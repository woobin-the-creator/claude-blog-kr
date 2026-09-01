const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const catalogSrc = fs.readFileSync(ROOT + "/posts/assets/catalog.js", "utf8");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ROWS = [
  { slug: "newer", title: "새 글", nav: "새", main: "내 글", cat: "에세이", date: "2026-09-01", author: "me", rev: 2, updated_at: "2026-09-01T00:00:00Z" },
  { slug: "older", title: "옛 글", nav: "옛", main: "Claude blog", cat: "Agents", date: "2026-06-01", author: "ai", rev: 1, updated_at: "2026-06-01T00:00:00Z" }
];

function boot(opts) {
  opts = opts || {};
  const dom = new JSDOM("<!doctype html><html><body></body></html>",
    { url: opts.url || "https://x.test/posts/older.html", runScripts: "dangerously" });
  const w = dom.window;
  w.CBK_CONFIG = { supabaseUrl: "https://db.test", supabaseAnonKey: "anon" };
  if (opts.cache) w.localStorage.setItem("cbk:catalog:v1", JSON.stringify(opts.cache));
  w.fetch = function () {
    if (opts.offline) return Promise.reject(new Error("offline"));
    return Promise.resolve({ ok: true, status: 200, json: function () { return Promise.resolve(ROWS); } });
  };
  const s = w.document.createElement("script"); s.textContent = catalogSrc; w.document.body.appendChild(s);
  return w;
}

(async () => {
  // --- cold start: nothing cached, network fills it ---
  let w = boot();
  ok("CBK_POSTS exists immediately (empty on cold start)", Array.isArray(w.CBK_POSTS) && w.CBK_POSTS.length === 0);
  const seen = [];
  w.CBK_onCatalog(function (list) { seen.push(list.length); });
  await w.CBK_catalogReady;
  ok("network fills the catalog", w.CBK_POSTS.length === 2);
  ok("subscriber was notified after the fetch", seen[seen.length - 1] === 2);
  ok("newest first", w.CBK_POSTS[0].slug === "newer");
  ok("file field synthesised for legacy consumers", w.CBK_POSTS[0].file === "newer.html");
  ok("author carried through", w.CBK_POSTS[0].author === "me");
  ok("cache written", JSON.parse(w.localStorage.getItem("cbk:catalog:v1")).length === 2);

  // --- lookup ---
  ok("CBK_postBySlug by slug", w.CBK_postBySlug("older").title === "옛 글");
  ok("CBK_postBySlug by filename", w.CBK_postBySlug("older.html").title === "옛 글");
  ok("CBK_postBySlug missing returns null", w.CBK_postBySlug("nope") === null);

  // --- warm start: cache paints synchronously, before any await ---
  w = boot({ cache: [{ slug: "cached", file: "cached.html", title: "캐시", nav: "캐시", main: "m", cat: "c", date: "2026-07-01", author: "ai", rev: 1 }] });
  ok("cache is available synchronously", w.CBK_POSTS.length === 1 && w.CBK_POSTS[0].slug === "cached");
  const early = [];
  w.CBK_onCatalog(function (list) { early.push(list[0].slug); });
  ok("subscriber fires immediately when a cache exists", early[0] === "cached");
  await w.CBK_catalogReady;
  ok("network refresh replaces the cache contents", w.CBK_POSTS[0].slug === "newer");
  ok("subscriber fired again after refresh", early[early.length - 1] === "newer");

  // --- offline: cache survives, promise still resolves ---
  w = boot({ offline: true, cache: [{ slug: "cached", file: "cached.html", title: "캐시", nav: "캐시", main: "m", cat: "c", date: "2026-07-01", author: "ai", rev: 1 }] });
  const resolved = await w.CBK_catalogReady;
  ok("offline still resolves CBK_catalogReady", Array.isArray(resolved));
  ok("offline keeps the cached rows", w.CBK_POSTS.length === 1 && w.CBK_POSTS[0].slug === "cached");

  // --- CBK_POSTS identity is stable across a refresh ---
  w = boot();
  const ref = w.CBK_POSTS;
  await w.CBK_catalogReady;
  ok("CBK_POSTS is mutated in place, not replaced", ref === w.CBK_POSTS && ref.length === 2);

  // --- current slug ---
  ok("CBK_currentSlug from a path", boot({ url: "https://x.test/posts/older.html" }).CBK_currentSlug() === "older");
  ok("CBK_currentSlug from a query string", boot({ url: "https://x.test/post.html?slug=newer" }).CBK_currentSlug() === "newer");

  await sleep(10);
  console.log("catalog: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
