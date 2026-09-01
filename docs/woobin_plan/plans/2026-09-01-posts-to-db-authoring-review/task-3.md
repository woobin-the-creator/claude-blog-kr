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
  - `window.CBK_CATALOG_ERROR` — `""` normally, a Korean message when the catalog could not be loaded. Set before subscribers are notified, so a consumer can read it inside its `CBK_onCatalog` callback.

**Background the implementer needs:**

This file replaces `posts/assets/posts.js`, which is a hand-edited literal array. The replacement must be **stale-while-revalidate**: read `localStorage["cbk:catalog:v1"]` synchronously so the page can paint immediately (and so the site still works while Supabase is unreachable), then fetch `cbk_posts_list()` and re-notify subscribers if anything changed.

Match the surrounding style exactly: an IIFE, `var`, `function`, `.then()`. No `let`, `const`, arrow functions, or `async`. Look at `posts/assets/store.js:209-232` for the `cfg()` / `rpc()` pattern to copy — but note that `cbk_posts_list` takes **no key**, so do not send one.

**Two failure modes this file must survive — both were caught in review, do not simplify them away:**

1. **A poisoned cache must not wedge the site permanently.** `shape(r)` reads `r.slug`, so a single `null` or non-object entry in the cached array throws *at parse time*, killing the whole IIFE. `CBK_POSTS`, `CBK_onCatalog` and `CBK_catalogReady` are then all `undefined`, and because the throw happens before `refresh()` is ever called, the bad cache can never be replaced — index, library and all 79 legacy sidebars stay blank until the user manually clears localStorage. `readCache()` therefore validates every entry (`x && typeof x === "object" && x.slug`) and `localStorage.removeItem`s the key when anything looks wrong, so the fetch path repopulates it.
2. **Subscribers must fire exactly once even when the load fails.** If `notify()` only runs on the success path, a cold start with no network — or with the DB simply empty, which is the state the site is in until the human migration runs — calls subscribers zero times, so `render()` never runs and the page is blank with no explanation. `settle()` handles both paths: it always notifies on success, notifies on failure only when nothing was painted from cache (so no duplicate render), and shows a small Korean banner (`#cbk-catalog-error`) **only when `POSTS` is empty** — with a cache present the site works fine offline and must stay quiet.

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
  if (opts.rawCache) w.localStorage.setItem("cbk:catalog:v1", opts.rawCache);
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
  const warmOffline = [];
  w.CBK_onCatalog(function (list) { warmOffline.push(list.length); });
  const resolved = await w.CBK_catalogReady;
  ok("offline still resolves CBK_catalogReady", Array.isArray(resolved));
  ok("offline keeps the cached rows", w.CBK_POSTS.length === 1 && w.CBK_POSTS[0].slug === "cached");
  ok("offline with a cache notifies exactly once (no duplicate render)", warmOffline.length === 1);
  ok("offline with a cache shows no banner — the site still works", !w.document.getElementById("cbk-catalog-error"));

  // --- offline cold start: subscribers must still fire, and the blank page must explain itself ---
  // 이 경로가 지금 실서비스 상태다: 사람이 실이관을 돌리기 전까지 DB 에 행이 없다.
  w = boot({ offline: true });
  const cold = [];
  w.CBK_onCatalog(function (list) { cold.push(list.length); });
  await w.CBK_catalogReady;
  ok("offline cold start still notifies subscribers exactly once", cold.length === 1);
  ok("offline cold start subscriber sees an empty list", cold[0] === 0);
  const banner = w.document.getElementById("cbk-catalog-error");
  ok("offline cold start shows an error banner instead of a blank page", !!banner);
  ok("offline cold start message is Korean", !!banner && /불러오지 못했습니다/.test(banner.textContent));
  ok("offline cold start exposes CBK_CATALOG_ERROR for consumers",
     typeof w.CBK_CATALOG_ERROR === "string" && w.CBK_CATALOG_ERROR.length > 0);

  // --- poisoned cache: one bad entry must not wedge the site forever ---
  // shape(r) 가 r.slug 에서 던지면 IIFE 전체가 죽어 CBK_POSTS/CBK_onCatalog/
  // CBK_catalogReady 가 undefined 로 남고, refresh() 도 못 돌아 나쁜 캐시가 영영 남는다.
  w = boot({ cache: [null, { slug: "cached", file: "cached.html", title: "캐시", nav: "캐시", main: "m", cat: "c", date: "2026-07-01", author: "ai", rev: 1 }] });
  ok("poisoned cache does not kill the module", typeof w.CBK_onCatalog === "function");
  ok("poisoned cache still exposes CBK_POSTS", Array.isArray(w.CBK_POSTS));
  ok("poisoned cache still exposes CBK_catalogReady", !!w.CBK_catalogReady);
  ok("poisoned cache is dropped from localStorage", w.localStorage.getItem("cbk:catalog:v1") === null);
  const healed = [];
  w.CBK_onCatalog(function (list) { healed.push(list.length); });
  await w.CBK_catalogReady;
  ok("poisoned cache is replaced by the network", w.CBK_POSTS.length === 2 && w.CBK_POSTS[0].slug === "newer");
  ok("poisoned cache still notifies subscribers", healed[healed.length - 1] === 2);

  // a cache that is not an array at all
  w = boot({ rawCache: '"not-an-array"' });
  ok("non-array cache is dropped", w.localStorage.getItem("cbk:catalog:v1") === null);
  await w.CBK_catalogReady;
  ok("non-array cache recovers from the network", w.CBK_POSTS.length === 2);

  // unparseable JSON
  w = boot({ rawCache: "{oops" });
  ok("unparseable cache is dropped", w.localStorage.getItem("cbk:catalog:v1") === null);
  await w.CBK_catalogReady;
  ok("unparseable cache recovers from the network", w.CBK_POSTS.length === 2);

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

  function dropCache() {
    try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
  }

  /* 캐시를 통째로 믿지 않는다. 한 칸이라도 null/비객체면 shape() 가 r.slug 에서
     던지고, 그러면 이 IIFE 가 통째로 죽어 CBK_POSTS·CBK_onCatalog·CBK_catalogReady 가
     전부 undefined 로 남는다. 죽는 지점이 refresh() 앞이라 나쁜 캐시를 갈아끼울
     기회조차 없다 — 사용자가 직접 localStorage 를 지우기 전까지 인덱스·보관함·
     레거시 79개 포스트의 사이드바가 영구히 빈 화면이 된다.
     그래서 의심스러우면 지우고 네트워크로 다시 채운다. */
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      var good = Array.isArray(v);
      if (good) {
        for (var i = 0; i < v.length; i++) {
          if (!v[i] || typeof v[i] !== "object" || !v[i].slug) { good = false; break; }
        }
      }
      if (!good) { dropCache(); return null; }
      return v;
    } catch (e) { dropCache(); return null; }
  }
  function writeCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(POSTS)); } catch (e) {}
  }

  /* 빈 화면 + 아무 설명 없음을 막는다. 캐시가 한 건이라도 있으면 사이트는 그걸로
     정상 동작하므로 배너를 띄우지 않는다 — 정말 아무것도 못 그릴 때만 뜬다. */
  function setError(msg) {
    window.CBK_CATALOG_ERROR = msg || "";
    var el = document.getElementById("cbk-catalog-error");
    if (!msg || POSTS.length) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      return;
    }
    if (!document.body) return;
    if (!el) {
      el = document.createElement("p");
      el.id = "cbk-catalog-error";
      el.setAttribute("role", "status");
      el.style.cssText = "margin:16px 0;padding:12px 14px;border:1px solid #e6d9c8;" +
        "border-radius:8px;background:#fdf8f2;color:#8a5a3b;font-size:14px;line-height:1.6;";
      document.body.insertBefore(el, document.body.firstChild);
    }
    el.textContent = msg;
  }

  /* 성공이든 실패든 구독자를 정확히 한 번은 깨운다.
     실패 경로에서 notify() 를 빼먹으면 콜드 스타트(네트워크 장애 또는 DB 가 아직
     비어 있는 지금 상태)에서 render() 가 아예 호출되지 않아 안내조차 없는
     백지 화면이 된다. 캐시로 이미 한 번 그렸다면(painted) 다시 알릴 것이 없으므로
     중복 렌더도 하지 않는다. */
  function settle(msg) {
    var painted = loaded;
    loaded = true;
    setError(msg || "");
    if (!painted || !msg) notify();
  }

  var cached = readCache();
  if (cached && cached.length) { fill(cached.map(shape)); loaded = true; }

  function refresh() {
    var c = cfg();
    if (!c.url || !c.key) {
      settle("동기화 설정이 없어 글 목록을 불러올 수 없습니다.");
      return Promise.resolve(POSTS);
    }
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
      writeCache();
      settle("");
      return POSTS;
    }).catch(function () {
      // 오프라인/장애: 캐시가 있으면 그걸로 계속 가고, 아무것도 없으면 안내를 띄운다.
      settle("글 목록을 불러오지 못했습니다. 연결을 확인한 뒤 새로고침해 주세요.");
      return POSTS;
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
