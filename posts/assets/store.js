/* Shared local store for bookmarks + per-post notes.  Exposes window.CBK.
 *
 * Data is keyed by post SLUG (filename without ".html"), so the shape maps
 * 1:1 onto a future server row { slug, bookmarked, note } — this is the layer
 * a cross-device sync (Phase 2) will plug into without changing the UI code.
 *
 * Storage is the browser's localStorage: per-browser, private, offline.
 * Use 내보내기/가져오기 (export/import) to move data between devices for now.
 */
(function () {
  var KEY = "cbk:data:v1";

  function load() {
    try { return ensure(JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return ensure({}); }
  }
  function ensure(d) {
    if (!d || typeof d !== "object") d = {};
    if (!d.bookmarks || typeof d.bookmarks !== "object") d.bookmarks = {};
    if (!d.notes || typeof d.notes !== "object") d.notes = {};
    return d;
  }
  function save(d) {
    d.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
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
      save(d);
      return !!d.bookmarks[slug];
    },
    bookmarkedSlugs: function () { return Object.keys(load().bookmarks); },

    getNote: function (slug) { return load().notes[slug] || ""; },
    setNote: function (slug, text) {
      var d = load();
      if (text && text.trim()) d.notes[slug] = text;
      else delete d.notes[slug];
      save(d);
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
          save(d);
          if (cb) cb(null, d);
        } catch (e) { if (cb) cb(e); }
      };
      reader.onerror = function () { if (cb) cb(reader.error); };
      reader.readAsText(file);
    }
  };

  window.CBK = CBK;
})();
