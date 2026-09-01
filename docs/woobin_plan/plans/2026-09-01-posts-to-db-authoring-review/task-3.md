### Task 3: DB-backed catalog with a localStorage cache

**Files:**
- Create: `posts/assets/catalog.js`
- Create: `tests/catalog.test.js`
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `cbk_posts_list()` from Task 1 (public, no key). Supabase URL and anon key come from `window.CBK_CONFIG` in `posts/assets/cbk-config.js`.
- Produces — the whole browser-side catalog API. Tasks 4, 5, 6 and 11 depend on these exact names:
  - `window.CBK_POSTS` — array of `{ file, slug, date, main, cat, title, nav, author, rev }`, newest first. Mutated **in place** on refresh so callers holding a reference stay correct. `file` is `slug + ".html"` and exists purely so the existing consumers keep working unchanged.
  - `window.CBK_postBySlug(key)` — synchronous lookup by slug or filename. Returns `null` when absent. Same contract as the function currently at `posts/assets/posts.js:175`.
  - `window.CBK_onCatalog(fn)` — subscribe. Called immediately if a cache is already loaded, and again after each successful network refresh. This is the only correct place for a consumer to render.
  - `window.CBK_currentSlug()` — the slug of the page being viewed, from `?slug=` if present, otherwise from the last path segment with `.html` stripped.
  - `window.CBK_catalogReady` — a Promise resolving to `CBK_POSTS` after the first network attempt (resolves with the cached array even if the network failed).

**Background the implementer needs:**

This file replaces `posts/assets/posts.js`, which is a hand-edited literal array. The replacement must be **stale-while-revalidate**: read `localStorage["cbk:catalog:v1"]` synchronously so the page can paint immediately (and so the site still works while Supabase is unreachable), then fetch `cbk_posts_list()` and re-notify subscribers if anything changed.

Match the surrounding style exactly: an IIFE, `var`, `function`, `.then()`. No `let`, `const`, arrow functions, or `async`. Look at `posts/assets/store.js:209-232` for the `cfg()` / `rpc()` pattern to copy — but note that `cbk_posts_list` takes **no key**, so do not send one.

- [ ] **Step 1: Write the failing test**

Create `tests/catalog.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node catalog.test.js
```

Expected: FAIL — `ENOENT ... posts/assets/catalog.js`

- [ ] **Step 3: Write the catalog**

Create `posts/assets/catalog.js`:

```js
/* 포스트 카탈로그 단일 소스. 예전 posts.js(손편집 배열)를 대체한다.
 *
 * stale-while-revalidate: localStorage 캐시를 동기로 먼저 읽어 즉시 그리고,
 * 그다음 cbk_posts_list() 로 갱신해 구독자에게 다시 알린다.
 * 그래서 Supabase 가 안 떠 있어도 사이트는 마지막으로 본 목록으로 동작한다.
 *
 * 소비자는 CBK_onCatalog(fn) 안에서 렌더해야 한다 — 그래야 캐시 페인트와
 * 네트워크 갱신 양쪽에서 화면이 맞는다.
 */
(function () {
  var CACHE_KEY = "cbk:catalog:v1";
  var POSTS = [];
  var subs = [];
  var loaded = false;

  function cfg() {
    var c = (typeof window !== "undefined" && window.CBK_CONFIG) || {};
    return { url: (c.supabaseUrl || "").replace(/\/+$/, ""), key: c.supabaseAnonKey || "" };
  }

  /* 서버 행 → 소비자가 기대하는 모양. file 은 기존 코드 호환용 파생 필드다. */
  function shape(r) {
    var slug = r.slug;
    return {
      file: slug + ".html",
      slug: slug,
      date: typeof r.date === "string" ? r.date.slice(0, 10) : r.date,
      main: r.main || "",
      cat: r.cat || "",
      title: r.title || "",
      nav: r.nav || r.title || "",
      author: r.author || "ai",
      rev: r.rev || 1
    };
  }

  /* 참조를 유지한 채 내용만 갈아끼운다 — var POSTS = window.CBK_POSTS 로
     받아둔 소비자가 계속 올바른 배열을 보게 하기 위해서다. */
  function fill(list) {
    POSTS.length = 0;
    for (var i = 0; i < list.length; i++) POSTS.push(list[i]);
    POSTS.sort(function (a, b) {
      if (a.date === b.date) return a.slug < b.slug ? -1 : 1;
      return a.date < b.date ? 1 : -1;          // 최신순
    });
  }

  function notify() {
    for (var i = 0; i < subs.length; i++) {
      try { subs[i](POSTS); } catch (e) {}
    }
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      return Array.isArray(v) ? v : null;
    } catch (e) { return null; }
  }
  function writeCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(POSTS)); } catch (e) {}
  }

  var cached = readCache();
  if (cached && cached.length) { fill(cached.map(shape)); loaded = true; }

  function refresh() {
    var c = cfg();
    if (!c.url || !c.key) return Promise.resolve(POSTS);
    return fetch(c.url + "/rest/v1/rpc/cbk_posts_list", {
      method: "POST",
      headers: {
        "apikey": c.key,
        "Authorization": "Bearer " + c.key,
        "Content-Type": "application/json"
      },
      body: "{}"
    }).then(function (r) {
      if (!r.ok) throw new Error("cbk_posts_list " + r.status);
      return r.json();
    }).then(function (rows) {
      fill((rows || []).map(shape));
      loaded = true;
      writeCache();
      notify();
      return POSTS;
    }).catch(function () {
      return POSTS;                 // 오프라인/장애: 캐시로 계속 간다
    });
  }

  window.CBK_POSTS = POSTS;

  window.CBK_postBySlug = function (key) {
    if (!key) return null;
    var want = String(key).replace(/\.html$/, "");
    for (var i = 0; i < POSTS.length; i++) {
      if (POSTS[i].slug === want) return POSTS[i];
    }
    return null;
  };

  window.CBK_onCatalog = function (fn) {
    if (typeof fn !== "function") return;
    subs.push(fn);
    if (loaded) { try { fn(POSTS); } catch (e) {} }
  };

  window.CBK_currentSlug = function () {
    var q = /[?&]slug=([^&#]+)/.exec(location.search);
    if (q) return decodeURIComponent(q[1]).replace(/\.html$/, "");
    var last = location.pathname.split("/").pop() || "";
    return last.replace(/\.html$/, "");
  };

  window.CBK_catalogRefresh = refresh;
  window.CBK_catalogReady = refresh();
})();
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd tests && node catalog.test.js
```

Expected: the final line reads `catalog: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 5: Register the test and commit**

Add `catalog.test.js` to `tests/package.json`'s `test` script and a `test:catalog` entry.

```bash
git add posts/assets/catalog.js tests/catalog.test.js tests/package.json
git commit -m "feat(catalog): DB에서 카탈로그를 읽고 localStorage로 캐시하는 catalog.js"
```
