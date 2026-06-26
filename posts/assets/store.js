/* Shared local store for bookmarks + per-post notes.  Exposes window.CBK.
 *
 * Data is keyed by post SLUG (filename without ".html"), so the shape maps
 * 1:1 onto a server row { slug, bookmarked, note } — this is the layer the
 * cross-device sync (Phase 2, CBK.sync below) plugs into without touching UI.
 *
 * Per-slug timestamps live in `meta` (incl. tombstones for deleted items) so
 * sync can resolve conflicts by last-write-wins. The UI never reads `meta`.
 *
 * Storage is the browser's localStorage: per-browser, private, offline.
 * 내보내기/가져오기 (export/import) moves data manually; CBK.sync moves it
 * automatically through a Supabase project when one is configured.
 */
(function () {
  var KEY = "cbk:data:v1";
  var SYNC_KEY = "cbk:sync_key:v1";
  var EPOCH = "1970-01-01T00:00:00.000Z";

  function load() {
    try { return ensure(JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return ensure({}); }
  }
  function ensure(d) {
    if (!d || typeof d !== "object") d = {};
    if (!d.bookmarks || typeof d.bookmarks !== "object") d.bookmarks = {};
    if (!d.notes || typeof d.notes !== "object") d.notes = {};
    if (!d.ratings || typeof d.ratings !== "object") d.ratings = {};
    if (!d.reasons || typeof d.reasons !== "object") d.reasons = {};
    if (!d.meta || typeof d.meta !== "object") d.meta = {};
    return d;
  }
  function isRating(v) { return v === 1 || v === -1; }
  function save(d) {
    d.updatedAt = nowISO();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
  }
  function nowISO() { return new Date().toISOString(); }
  function touch(d, slug) { d.meta[slug] = nowISO(); }
  function metaT(d, slug) { return d.meta[slug] || EPOCH; }

  /* an item "exists" only while it carries a bookmark, a non-empty note, a
     rating, or a non-empty reason; an empty item with a meta timestamp is a
     tombstone (a recent deletion). */
  function present(d, slug) {
    return !!d.bookmarks[slug]
        || !!(d.notes[slug] && d.notes[slug].trim())
        || isRating(d.ratings[slug])
        || !!(d.reasons[slug] && d.reasons[slug].trim());
  }

  var CBK = {
    /* slug of the current page (or of a given filename/href) */
    slugOf: function (nameOrHref) {
      var f = nameOrHref || location.pathname;
      f = String(f).split("?")[0].split("#")[0].split("/").pop() || "";
      return f.replace(/\.html$/i, "");
    },

    all: function () { return load(); },

    isBookmarked: function (slug) { return !!load().bookmarks[slug]; },
    toggleBookmark: function (slug) {
      var d = load();
      if (d.bookmarks[slug]) delete d.bookmarks[slug];
      else d.bookmarks[slug] = true;
      touch(d, slug);
      save(d);
      return !!d.bookmarks[slug];
    },
    bookmarkedSlugs: function () { return Object.keys(load().bookmarks); },

    getNote: function (slug) { return load().notes[slug] || ""; },
    setNote: function (slug, text) {
      var d = load();
      if (text && text.trim()) d.notes[slug] = text;
      else delete d.notes[slug];
      touch(d, slug);
      save(d);
    },

    /* rating: 1 (좋아요) | -1 (싫어요) | 0 (중립 = 키 삭제) */
    getRating: function (slug) { var v = load().ratings[slug]; return isRating(v) ? v : 0; },
    setRating: function (slug, v) {
      var d = load();
      if (isRating(v)) d.ratings[slug] = v;
      else delete d.ratings[slug];
      touch(d, slug);
      save(d);
      return isRating(d.ratings[slug]) ? d.ratings[slug] : 0;
    },

    /* reason: free-text "왜 이렇게 평가했나" attached to the rating */
    getReason: function (slug) { return load().reasons[slug] || ""; },
    setReason: function (slug, text) {
      var d = load();
      if (text && text.trim()) d.reasons[slug] = text;
      else delete d.reasons[slug];
      touch(d, slug);
      save(d);
    },

    /* slugs that carry a like/dislike — used by 보관함 filters and wiki export */
    ratedSlugs: function () { return Object.keys(load().ratings).filter(function (s) { return isRating(load().ratings[s]); }); },

    /* Records for the LLM Wiki ingest (Phase B). One row per rated post,
       joined with the catalog (posts.js) so each carries 출처(main)/주제(cat).
       Only posts that have a like/dislike are included. */
    wikiRecords: function () {
      var d = load();
      var bySlug = (typeof window !== "undefined" && window.CBK_postBySlug) || null;
      return Object.keys(d.ratings)
        .filter(function (s) { return isRating(d.ratings[s]); })
        .map(function (slug) {
          var p = bySlug ? bySlug(slug) : null;
          return {
            slug: slug,
            title: p ? p.title : slug,
            main: p ? p.main : "",
            cat: p ? p.cat : "",
            date: p ? p.date : "",
            rating: d.ratings[slug],
            reason: d.reasons[slug] || "",
            bookmarked: !!d.bookmarks[slug],
            rated_at: d.meta[slug] || ""
          };
        })
        .sort(function (a, b) { return (b.rated_at || "").localeCompare(a.rated_at || ""); });
    },

    /* download wikiRecords() as JSON — the raw/ input for the wiki */
    exportWiki: function () {
      var recs = this.wikiRecords();
      var blob = new Blob([JSON.stringify(recs, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "claude-blog-kr-preferences.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    exportData: function () {
      var data = load();
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "claude-blog-kr-notes.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    /* merge an exported file back in; incoming values win on conflict */
    importData: function (file, cb) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var incoming = ensure(JSON.parse(reader.result));
          var d = load();
          Object.keys(incoming.bookmarks).forEach(function (k) { d.bookmarks[k] = true; });
          Object.keys(incoming.notes).forEach(function (k) { d.notes[k] = incoming.notes[k]; });
          Object.keys(incoming.ratings).forEach(function (k) { if (isRating(incoming.ratings[k])) d.ratings[k] = incoming.ratings[k]; });
          Object.keys(incoming.reasons).forEach(function (k) { d.reasons[k] = incoming.reasons[k]; });
          Object.keys(incoming.meta).forEach(function (k) { d.meta[k] = incoming.meta[k]; });
          save(d);
          if (cb) cb(null, d);
        } catch (e) { if (cb) cb(e); }
      };
      reader.onerror = function () { if (cb) cb(reader.error); };
      reader.readAsText(file);
    }
  };

  /* ----------------------------------------------------------------------
   * CBK.sync — optional cross-device sync through a Supabase project.
   *
   * Talks only to the RPCs in supabase/schema.sql via the public anon key.
   * The secret that protects the data is the per-user sync_key, kept in its
   * own localStorage slot so it never travels inside export files.
   * -------------------------------------------------------------------- */
  function cfg() {
    var c = (typeof window !== "undefined" && window.CBK_CONFIG) || {};
    return { url: (c.supabaseUrl || "").replace(/\/+$/, ""), key: c.supabaseAnonKey || "" };
  }

  function rpc(fn, body) {
    var c = cfg();
    return fetch(c.url + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: {
        "apikey": c.key,
        "Authorization": "Bearer " + c.key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) {
          throw new Error("RPC " + fn + " " + r.status + (t ? ": " + t : ""));
        });
      }
      return r.status === 204 ? null : r.json();
    });
  }

  /* Upsert one item. Tries the rating/reason-aware signature first; if the
     server still runs the pre-migration cbk_upsert (4 args), PostgREST answers
     404 "Could not find function …" — we then retry the legacy 4-arg call so a
     pending schema migration never breaks bookmark/note sync. */
  function upsert(key, p) {
    var full = {
      p_key: key, p_slug: p.slug, p_bookmarked: p.bookmarked, p_note: p.note,
      p_rating: (p.rating === 1 || p.rating === -1) ? p.rating : null,
      p_reason: p.reason || ""
    };
    return rpc("cbk_upsert", full).catch(function (e) {
      var msg = String(e && e.message || "");
      if (/cbk_upsert/.test(msg) && /(404|Could not find|PGRST202)/.test(msg)) {
        return rpc("cbk_upsert", { p_key: key, p_slug: p.slug, p_bookmarked: p.bookmarked, p_note: p.note });
      }
      throw e;
    });
  }

  var Sync = {
    isConfigured: function () { var c = cfg(); return !!(c.url && c.key); },

    getKey: function () { try { return localStorage.getItem(SYNC_KEY) || ""; } catch (e) { return ""; } },
    setKey: function (k) {
      k = (k || "").trim();
      try { if (k) localStorage.setItem(SYNC_KEY, k); else localStorage.removeItem(SYNC_KEY); }
      catch (e) {}
      return k;
    },
    /* 24-char URL-safe random code; the whole secret is in this string. */
    generateKey: function () {
      var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
      var bytes = new Uint8Array(24), out = "";
      (window.crypto || window.msCrypto).getRandomValues(bytes);
      for (var i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
      return out;
    },

    /* Two-way merge: pull remote rows, resolve per-slug by newest timestamp,
       then push the items this device owns (and delete the ones it retired).
       Resolves to { pulled, pushed, deleted }. */
    syncNow: function () {
      if (!Sync.isConfigured()) return Promise.reject(new Error("동기화가 설정되지 않았습니다."));
      var key = Sync.getKey();
      if (!key) return Promise.reject(new Error("동기화 코드가 없습니다."));

      return rpc("cbk_get", { p_key: key }).then(function (rows) {
        rows = rows || [];
        var remote = {};
        rows.forEach(function (r) {
          remote[r.post_slug] = {
            bookmarked: !!r.bookmarked,
            note: r.note || "",
            rating: isRating(r.rating) ? r.rating : 0,   // 1|-1|0 (null/absent column → 0)
            reason: r.reason || "",
            deleted: !!r.deleted,          // tombstone flag from the server
            t: r.updated_at || EPOCH
          };
        });

        var d = load();
        var slugs = {};
        Object.keys(d.meta).forEach(function (s) { slugs[s] = true; });
        Object.keys(d.bookmarks).forEach(function (s) { slugs[s] = true; });
        Object.keys(d.notes).forEach(function (s) { slugs[s] = true; });
        Object.keys(remote).forEach(function (s) { slugs[s] = true; });

        var pushes = [], deletes = [], pulled = 0;

        Object.keys(slugs).forEach(function (slug) {
          var R = remote[slug] || null;
          var localT = metaT(d, slug);
          var localHas = present(d, slug);
          var remoteHas = R && !R.deleted &&
            (R.bookmarked || (R.note && R.note.trim()) || isRating(R.rating) || (R.reason && R.reason.trim()));

          if (R && R.t > localT) {
            // remote is newer → adopt its state, whether content or a tombstone.
            if (remoteHas) {
              if (R.bookmarked) d.bookmarks[slug] = true; else delete d.bookmarks[slug];
              if (R.note && R.note.trim()) d.notes[slug] = R.note; else delete d.notes[slug];
              if (isRating(R.rating)) d.ratings[slug] = R.rating; else delete d.ratings[slug];
              if (R.reason && R.reason.trim()) d.reasons[slug] = R.reason; else delete d.reasons[slug];
            } else {
              // follow the deletion across every signal
              delete d.bookmarks[slug]; delete d.notes[slug];
              delete d.ratings[slug]; delete d.reasons[slug];
            }
            d.meta[slug] = R.t;
            pulled++;
          } else if (localHas) {
            // local is newer/equal and has content → push it if remote differs.
            var localRating = isRating(d.ratings[slug]) ? d.ratings[slug] : 0;
            if (!R || R.deleted ||
                R.bookmarked !== !!d.bookmarks[slug] ||
                R.note !== (d.notes[slug] || "") ||
                R.rating !== localRating ||
                R.reason !== (d.reasons[slug] || "")) {
              pushes.push({
                slug: slug, bookmarked: !!d.bookmarks[slug], note: d.notes[slug] || "",
                rating: localRating, reason: d.reasons[slug] || ""
              });
            }
          } else if (d.meta[slug]) {
            // local is a tombstone and is the winner → make sure remote is a tombstone too.
            var remoteAlreadyTomb = R && R.deleted && R.t <= localT;
            if (!remoteAlreadyTomb) deletes.push(slug);
          }
        });

        save(d); // persist pulled changes + tombstones before the network round-trip

        // After a push, adopt the server's updated_at as our local timestamp so
        // every synced item is compared on the server's clock, not this device's.
        var ops = pushes.map(function (p) {
          return upsert(key, p)
            .then(function (row) {
              if (Array.isArray(row)) row = row[0];
              if (row && row.updated_at) d.meta[p.slug] = row.updated_at;
            });
        }).concat(deletes.map(function (slug) {
          return rpc("cbk_delete", { p_key: key, p_slug: slug })
            .then(function (row) {
              if (Array.isArray(row)) row = row[0];
              if (row && row.updated_at) d.meta[slug] = row.updated_at; // adopt tombstone time
            });
        }));

        return Promise.all(ops).then(function () {
          save(d); // persist the adopted server timestamps
          return { pulled: pulled, pushed: pushes.length, deleted: deletes.length };
        });
      });
    }
  };

  CBK.sync = Sync;
  window.CBK = CBK;
})();
