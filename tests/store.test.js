const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");

const storeSrc = fs.readFileSync(ROOT + "/posts/assets/store.js", "utf8");

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.log("  ✗ FAIL:", name); } }
function eq(name, a, b) { ok(name + " (got " + JSON.stringify(a) + ")", JSON.stringify(a) === JSON.stringify(b)); }

function freshWindow(opts) {
  opts = opts || {};
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/posts/foo.html", runScripts: "dangerously" });
  const w = dom.window;
  // stubs jsdom lacks
  w.URL.createObjectURL = () => "blob:stub";
  w.URL.revokeObjectURL = () => {};
  // catalog stub (posts.js)
  const CAT = {
    "ai-era-durable-skills": { title: "RAG는 죽지 않았다", main: "AI 인사이트", cat: "역량·커리어", date: "2026-06-26" },
    "opus46": { title: "Opus 4.6", main: "제품", cat: "모델", date: "2026-05-01" }
  };
  w.CBK_postBySlug = (k) => CAT[String(k).replace(/\.html$/, "")] || null;
  if (opts.config) w.CBK_CONFIG = opts.config;
  if (opts.fetch) w.fetch = opts.fetch;
  const s = w.document.createElement("script");
  s.textContent = storeSrc;
  w.document.body.appendChild(s);
  return w;
}

/* ---------- 1. rating: set / get / toggle / neutral ---------- */
(function () {
  const w = freshWindow(); const CBK = w.CBK;
  eq("rating default 0", CBK.getRating("a"), 0);
  CBK.setRating("a", 1);
  eq("set like", CBK.getRating("a"), 1);
  CBK.setRating("a", -1);
  eq("flip to dislike", CBK.getRating("a"), -1);
  CBK.setRating("a", 0);
  eq("neutral clears", CBK.getRating("a"), 0);
  ok("neutral removes key", w.localStorage.getItem("cbk:data:v1").indexOf('"a"') === -1 || JSON.parse(w.localStorage.getItem("cbk:data:v1")).ratings.a === undefined);
  CBK.setRating("a", 5); // invalid
  eq("invalid rating ignored", CBK.getRating("a"), 0);
})();

/* ---------- 2. reason ---------- */
(function () {
  const w = freshWindow(); const CBK = w.CBK;
  eq("reason default empty", CBK.getReason("a"), "");
  CBK.setReason("a", "구체적 사례라서");
  eq("set reason", CBK.getReason("a"), "구체적 사례라서");
  CBK.setReason("a", "   ");
  eq("blank reason clears", CBK.getReason("a"), "");
})();

/* ---------- 3. present / tombstone via meta ---------- */
(function () {
  const w = freshWindow(); const CBK = w.CBK;
  CBK.setRating("a", 1);
  let d = CBK.all();
  ok("meta stamped on rating", !!d.meta.a);
  CBK.setRating("a", 0); // now neutral, no other signal → tombstone (meta remains)
  d = CBK.all();
  ok("tombstone keeps meta after clearing rating", !!d.meta.a);
  ok("ratings.a gone", d.ratings.a === undefined);
})();

/* ---------- 4. ratedSlugs + wikiRecords (catalog join) ---------- */
(function () {
  const w = freshWindow(); const CBK = w.CBK;
  CBK.setRating("ai-era-durable-skills", 1);
  CBK.setReason("ai-era-durable-skills", "바로 적용 가능");
  CBK.setRating("opus46", -1);
  CBK.setBookmark ? null : null;
  CBK.toggleBookmark("opus46");
  eq("ratedSlugs count", CBK.ratedSlugs().sort(), ["ai-era-durable-skills", "opus46"]);
  const recs = CBK.wikiRecords();
  eq("wiki record count", recs.length, 2);
  const r = recs.find(x => x.slug === "ai-era-durable-skills");
  eq("wiki join main", r.main, "AI 인사이트");
  eq("wiki join cat", r.cat, "역량·커리어");
  eq("wiki rating", r.rating, 1);
  eq("wiki reason", r.reason, "바로 적용 가능");
  const r2 = recs.find(x => x.slug === "opus46");
  eq("wiki dislike", r2.rating, -1);
  eq("wiki bookmarked flag", r2.bookmarked, true);
  // a note-only / bookmark-only post must NOT appear (rating required)
  CBK.setNote("noteonly", "hi");
  eq("note-only excluded from wikiRecords", CBK.wikiRecords().length, 2);
})();

/* ---------- 5. importData merges ratings/reasons ---------- */
(function () {
  const w = freshWindow(); const CBK = w.CBK;
  CBK.setRating("a", 1);
  const incoming = { bookmarks: {}, notes: {}, ratings: { b: -1, bad: 9 }, reasons: { b: "why" }, meta: { b: "2026-01-01T00:00:00.000Z" } };
  // emulate importData's reader by calling with a fake File-like via FileReader
  const blob = new w.Blob([JSON.stringify(incoming)], { type: "application/json" });
  let done = false;
  CBK.importData(blob, function (err) {
    ok("import no error", !err);
    eq("import kept existing", CBK.getRating("a"), 1);
    eq("import added rating", CBK.getRating("b"), -1);
    eq("import added reason", CBK.getReason("b"), "why");
    eq("import rejected invalid rating", CBK.getRating("bad"), 0);
    done = true;
  });
  // FileReader in jsdom is async; spin briefly
  const deadline = Date.now() + 2000;
  (function wait() { if (done || Date.now() > deadline) { return; } setTimeout(wait, 5); })();
  return new Promise(res => { const i = setInterval(() => { if (done) { clearInterval(i); res(); } }, 5); });
})();

/* ---------- 6. sync: remote newer adopts rating/reason ---------- */
async function syncTests() {
  // mock server holding rows; rpc dispatches by fn name
  function makeFetch(state) {
    return function (url, init) {
      const fn = url.split("/rpc/")[1];
      const body = JSON.parse(init.body);
      let out;
      if (fn === "cbk_get") {
        out = Object.keys(state).map(s => Object.assign({ post_slug: s }, state[s]));
      } else if (fn === "cbk_upsert") {
        if (!("p_rating" in body)) { // legacy path should NOT be hit when server is new
          state.__legacyHit = true;
        }
        const t = "2026-12-31T00:00:00.000Z"; // server clock newer than any local
        state[body.p_slug] = {
          bookmarked: body.p_bookmarked, note: body.p_note,
          rating: ("p_rating" in body) ? body.p_rating : null,
          reason: ("p_reason" in body) ? body.p_reason : "",
          deleted: false, updated_at: t
        };
        out = [Object.assign({ post_slug: body.p_slug }, state[body.p_slug])];
      } else if (fn === "cbk_delete") {
        const t = "2026-12-31T00:00:00.000Z";
        state[body.p_slug] = { bookmarked: false, note: "", rating: null, reason: "", deleted: true, updated_at: t };
        out = [Object.assign({ post_slug: body.p_slug }, state[body.p_slug])];
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(out), text: () => Promise.resolve("") });
    };
  }

  // 6a. remote newer → local adopts rating + reason
  {
    const state = { "p1": { bookmarked: false, note: "", rating: 1, reason: "remote reason", deleted: false, updated_at: "2030-01-01T00:00:00.000Z" } };
    const w = freshWindow({ config: { supabaseUrl: "https://s.test", supabaseAnonKey: "k" }, fetch: makeFetch(state) });
    w.localStorage.setItem("cbk:sync_key:v1", "KEY");
    const res = await w.CBK.sync.syncNow();
    eq("6a pulled 1", res.pulled, 1);
    eq("6a adopted rating", w.CBK.getRating("p1"), 1);
    eq("6a adopted reason", w.CBK.getReason("p1"), "remote reason");
  }

  // 6b. local newer → push includes rating/reason (new signature, no legacy)
  {
    const state = {};
    const w = freshWindow({ config: { supabaseUrl: "https://s.test", supabaseAnonKey: "k" }, fetch: makeFetch(state) });
    w.localStorage.setItem("cbk:sync_key:v1", "KEY");
    w.CBK.setRating("p2", -1);
    w.CBK.setReason("p2", "local reason");
    const res = await w.CBK.sync.syncNow();
    eq("6b pushed 1", res.pushed, 1);
    eq("6b server got rating", state["p2"].rating, -1);
    eq("6b server got reason", state["p2"].reason, "local reason");
    ok("6b did NOT hit legacy path", !state.__legacyHit);
  }

  // 6c. legacy server (cbk_upsert lacks p_rating) → fallback keeps bookmark/note sync working
  {
    const state = {};
    function legacyFetch(url, init) {
      const fn = url.split("/rpc/")[1];
      const body = JSON.parse(init.body);
      if (fn === "cbk_get") return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve("") });
      if (fn === "cbk_upsert") {
        if ("p_rating" in body) {
          // simulate PostgREST 404 for unknown signature
          return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve(null), text: () => Promise.resolve("Could not find the function public.cbk_upsert(...) PGRST202") });
        }
        state[body.p_slug] = { bookmarked: body.p_bookmarked, note: body.p_note, deleted: false, updated_at: "2030-01-01T00:00:00.000Z" };
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([Object.assign({ post_slug: body.p_slug }, state[body.p_slug])]), text: () => Promise.resolve("") });
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve("") });
    }
    const w = freshWindow({ config: { supabaseUrl: "https://s.test", supabaseAnonKey: "k" }, fetch: legacyFetch });
    w.localStorage.setItem("cbk:sync_key:v1", "KEY");
    w.CBK.toggleBookmark("p3");
    w.CBK.setRating("p3", 1); // rating present locally
    let threw = false, res;
    try { res = await w.CBK.sync.syncNow(); } catch (e) { threw = true; console.log("    legacy threw:", e.message); }
    ok("6c sync did not throw on legacy server", !threw);
    ok("6c legacy upsert stored bookmark", state["p3"] && state["p3"].bookmarked === true);
  }
}

syncTests().then(() => {
  setTimeout(() => {
    console.log("\n=== store.js: " + pass + " passed, " + fail + " failed ===");
    process.exit(fail ? 1 : 0);
  }, 300);
});
