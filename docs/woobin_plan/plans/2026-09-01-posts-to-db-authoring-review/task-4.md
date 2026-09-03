### Task 4: Rewire the catalog consumers and delete `posts.js`

**Files:**
- Modify: `index.html:73-79` (script tags + `var POSTS`), `index.html:151-194` (`render`)
- Modify: `library.html:164-171` (script tags + `var POSTS`)
- Modify: `posts/assets/nav.js:1-9` (catalog source + current slug), `posts/assets/nav.js:36-59` (build + refresh)
- Modify: all 79 `posts/*.html` — one `<script src>` swap
- Stop loading (but do NOT delete): `posts/assets/posts.js` — the migration script still reads it; Task 12 deletes it
- Modify: `tests/nav.test.js:17-21` and `tests/nav.test.js:75`, `tests/library.test.js:12-20`

**Interfaces:**
- Consumes: `window.CBK_POSTS`, `window.CBK_postBySlug`, `window.CBK_onCatalog`, `window.CBK_currentSlug` from Task 3.
- Produces: nothing new. This task only moves existing consumers onto the Task 3 API.

**Background the implementer needs:**

Three files read the catalog synchronously at load time and render once:

- `index.html:79` — `var POSTS = window.CBK_POSTS || [];` then `render()` at the bottom of the IIFE
- `library.html:171` — same pattern, then `render()`
- `posts/assets/nav.js:5` — `var POSTS = window.CBK_POSTS || [];` then `buildItems()` inline at line 42

With Task 3 in place, `CBK_POSTS` starts empty on a cold visit and fills asynchronously. **The fix is the same in all three: keep the existing `var POSTS = window.CBK_POSTS || []` line (it now holds a live reference that Task 3 mutates in place) and move the initial render call inside `window.CBK_onCatalog(...)`.** Nothing else about the render functions changes.

`posts/assets/store.js:135` also reads `window.CBK_postBySlug` inside `wikiRecords()`. That keeps working untouched, because Task 3 preserves the synchronous signature.

The 79 legacy `posts/*.html` files each load `<script src="assets/posts.js"></script>`. They are deleted in Task 12, but between here and there they must not 404, so swap the tag rather than leaving it dangling.

**Careful — the legacy posts are not uniform.** Only 16 of the 79 load `assets/cbk-config.js`; the other 63 end with just `store.js` → `posts.js` → `nav.js`. `catalog.js` reads `window.CBK_CONFIG` at parse time, so a bare tag swap would leave 63 posts with an empty config, `refresh()` returning immediately, and no sidebar or breadcrumb on those pages until Task 12 deletes them. Step 6 therefore does a **two-pass** rewrite: swap the tag everywhere, then insert `cbk-config.js` only into the files that lack it.

- [ ] **Step 1: Update the tests first**

In `tests/nav.test.js`, replace the `w.CBK_POSTS = [...]` / `w.CBK_postBySlug = ...` stub block at **lines 17-21** with a stub of the Task 3 API. The two posts and their fields stay exactly as they are:

```js
  w.CBK_POSTS = [
    { file: "ai-era-durable-skills.html", slug: "ai-era-durable-skills", date: "2026-06-26", main: "AI 인사이트", cat: "역량·커리어", title: "RAG는 죽지 않았다", nav: "내구성 역량" },
    { file: "opus46.html", slug: "opus46", date: "2026-05-01", main: "제품", cat: "모델", title: "Opus 4.6", nav: "Opus 4.6" }
  ];
  w.CBK_postBySlug = (k) => w.CBK_POSTS.find(p => p.file === k || p.slug === String(k).replace(/\.html$/, "")) || null;
  w.CBK_onCatalog = (fn) => fn(w.CBK_POSTS);
  w.CBK_currentSlug = () => "ai-era-durable-skills";
```

`tests/nav.test.js:75` reuses the stub for a second window (`w2.CBK_POSTS = w.CBK_POSTS; w2.CBK_postBySlug = w.CBK_postBySlug;`). Extend that line the same way, or `nav.js` in the second window gets no catalog:

```js
  w2.CBK_POSTS = w.CBK_POSTS; w2.CBK_postBySlug = w.CBK_postBySlug;
  w2.CBK_onCatalog = (fn) => fn(w2.CBK_POSTS);
  w2.CBK_currentSlug = () => "ai-era-durable-skills";   // dom2 의 URL 과 같은 글이어야 저장된 평가가 복원된다
```

The slug **must** be `ai-era-durable-skills`, matching `dom2`'s URL — the three assertions after this block check that slug's saved rating and reason. Any other slug makes them fail.

In `tests/library.test.js` the catalog stub is **not JS in the test file** — it is a template-literal string (`const postsStub = \`…\`` at lines 12-20) that gets injected into the JSDOM document, with `$` and backslashes already escaped (`/\\.html$/`). The new stubs must go **inside that string literal**, in ES5 style, not next to it:

```js
const postsStub = `
window.CBK_POSTS = [ … unchanged … ];
window.CBK_postBySlug = function(k){ … unchanged … };
window.CBK_onCatalog = function(fn){ fn(window.CBK_POSTS); };
window.CBK_currentSlug = function(){ return ""; };
`;
```

The same file also rewrites the script tags by exact string match at lines 22-25. The `posts.js` line must be updated to the new filename or the stub stops being injected at all:

```js
html = html.replace('<script src="posts/assets/catalog.js"></script>', '<script>' + postsStub + '</script>');
```

Finally, add the **link regression block** to `tests/nav.test.js`, just above its `console.log`. `nav.js` was written when it only ever ran inside `posts/`, so every link in it is `posts/`-relative; this block pins all six link kinds at all three serving locations (inside `posts/`, root `post.html`, and the `/claude-blog-kr/` 404 fallback). Without the `at404` half, the `CBK_SITE_BASE` bug in Step 3 is invisible — the sidebar links *look* right and silently resolve to paths that only work because the 404 handler reads the query string first.

```js
  // --- 루트에서 서빙될 때(post.html / 404.html) 링크가 사이트 밖을 가리키지 않는다 ---
  // nav.js 는 원래 posts/ 안에서만 돌던 파일이라 "../index.html", "../library.html",
  // "assets/cbk.css" 가 하드코딩돼 있었다. post.html 은 저장소 루트에서 서빙되므로
  // 그대로 두면 전부 깨진다. CBK_AT_ROOT / CBK_ASSET_BASE 로 접두사를 바꾼다.
  async function bootNav(atRoot, url, assetBase, siteBase) {
    const d = new JSDOM(html, { url, runScripts: "dangerously" });
    const win = d.window;
    win.URL.createObjectURL = () => "x"; win.URL.revokeObjectURL = () => {};
    if (atRoot) {
      win.CBK_AT_ROOT = true;
      win.CBK_ASSET_BASE = assetBase;
      if (siteBase) win.CBK_SITE_BASE = siteBase;   // 404.html 만 세팅한다
    }
    win.CBK_POSTS = w.CBK_POSTS; win.CBK_postBySlug = w.CBK_postBySlug;
    win.CBK_onCatalog = (fn) => fn(win.CBK_POSTS);
    win.CBK_currentSlug = () => "ai-era-durable-skills";
    for (const src of [storeSrc, navSrc]) {
      const s = win.document.createElement("script"); s.textContent = src; win.document.body.appendChild(s);
    }
    return win.document;
  }
  const href = (d, sel) => (d.querySelector(sel) || {}).getAttribute
    ? d.querySelector(sel).getAttribute("href") : null;

  const inPosts = await bootNav(false, "https://x.test/posts/ai-era-durable-skills.html");
  eq("posts/: brand link unchanged", href(inPosts, ".nav-brand"), "../index.html");
  eq("posts/: library link unchanged", href(inPosts, ".nav-library"), "../library.html");
  eq("posts/: sidebar link is the bare filename", href(inPosts, "#site-nav ul a"), "ai-era-durable-skills.html");
  eq("posts/: stylesheet path unchanged",
     href(inPosts, 'link[rel="stylesheet"]'), "assets/cbk.css");

  const atRoot = await bootNav(true, "https://x.test/post.html?slug=ai-era-durable-skills", "posts/");
  eq("root: brand link stays inside the site", href(atRoot, ".nav-brand"), "index.html");
  eq("root: library link stays inside the site", href(atRoot, ".nav-library"), "library.html");
  eq("root: sidebar links go through post.html",
     href(atRoot, "#site-nav ul a"), "post.html?slug=ai-era-durable-skills");
  eq("root: stylesheet resolves under posts/",
     href(atRoot, 'link[rel="stylesheet"]'), "posts/assets/cbk.css");
  eq("root: breadcrumb link stays inside the site",
     href(atRoot, ".post-crumb a"), "index.html#m=" + encodeURIComponent("AI 인사이트"));

  // 404.html 은 GitHub Pages 가 /claude-blog-kr/posts/<slug>.html 주소를 그대로 둔 채
  // 돌려주는 파일이다. 여기서 BASE 를 "" 로 두면 index.html 이
  // /claude-blog-kr/posts/index.html 로 풀려 또 404 로 떨어지고, 그 404 는 slug
  // "index" 로 렌더를 시도해 "글을 찾을 수 없습니다: index" 를 띄운다 —
  // 옛 북마크로 들어온 방문자가 사이트 밖으로 나갈 길이 없어진다.
  // 그래서 CBK_AT_ROOT(어디서 서빙되나)와 CBK_SITE_BASE(링크 기준이 어디냐)를 분리한다.
  const at404 = await bootNav(true, "https://x.test/claude-blog-kr/posts/opus46.html",
                              "/claude-blog-kr/posts/", "/claude-blog-kr/");
  eq("404 fallback: stylesheet uses the absolute Pages base",
     href(at404, 'link[rel="stylesheet"]'), "/claude-blog-kr/posts/assets/cbk.css");
  eq("404 fallback: brand link goes to the site root, not /posts/index.html",
     href(at404, ".nav-brand"), "/claude-blog-kr/index.html");
  eq("404 fallback: home link goes to the site root",
     href(at404, ".nav-home"), "/claude-blog-kr/index.html");
  eq("404 fallback: library link goes to the site root",
     href(at404, ".nav-library"), "/claude-blog-kr/library.html");
  eq("404 fallback: sidebar links resolve to the real post.html, not a path under /posts/",
     href(at404, "#site-nav ul a"), "/claude-blog-kr/post.html?slug=ai-era-durable-skills");
  eq("404 fallback: breadcrumb link goes to the site root",
     href(at404, ".post-crumb a"), "/claude-blog-kr/index.html#m=" + encodeURIComponent("AI 인사이트"));
  eq("404 fallback: bar library link goes to the site root",
     href(at404, ".cbk-library"), "/claude-blog-kr/library.html");
  // post.html 은 /claude-blog-kr/post.html 로 서빙되므로 상대경로가 이미 맞다.
  // 여기에 SITE_BASE 를 박으면 로컬 파일로 열 때 깨지므로 세팅하지 않는 것이 맞다.
  eq("root without a site base: links stay relative", href(atRoot, ".nav-brand"), "index.html");
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd tests && node nav.test.js && node library.test.js
```

Expected: FAIL — the sidebar is empty, because `nav.js` still renders at load time and no longer receives the catalog through the path the stub provides.

- [ ] **Step 3: Rewire `posts/assets/nav.js`**

Change the header comment and the two catalog reads at lines 1-9:

```js
/* Shared sidebar nav + breadcrumb + per-post bookmark/notes UI.
 * Post catalog lives in catalog.js (window.CBK_POSTS + CBK_onCatalog) — load it before this file.
 * Requires store.js (window.CBK) for bookmarks; degrades gracefully if absent. */
(function () {
  var POSTS = window.CBK_POSTS || [];

  /* 이 파일은 posts/ 안(레거시 79개)과 저장소 루트(Task 5 의 post.html / 404.html)
   * 양쪽에서 로드된다. 루트에서 서빙될 때 "../index.html" 은 사이트 밖을 가리키므로
   * 링크 접두사를 한 곳에서 계산한다. post.html 은 이 파일 로드 전에
   * window.CBK_AT_ROOT = true 를 세팅한다.
   *
   * CBK_AT_ROOT 만으로는 부족하다: 404.html 은 GitHub Pages 가 없는 경로에
   * 돌려주는 파일이라 주소창이 /claude-blog-kr/posts/<slug>.html 인 채로 실행된다.
   * 그 상태에서 BASE 를 "" 로 두면 index.html 이 /claude-blog-kr/posts/index.html
   * 로 풀려 또 404 로 떨어지고(그리고 slug "index" 로 렌더를 시도한다) 방문자가
   * 사이트 밖으로 나갈 길이 없다. 그래서 "루트에서 서빙된다"(CBK_AT_ROOT)와
   * "링크를 어디 기준으로 걸어야 하나"(CBK_SITE_BASE)를 분리한다.
   *   post.html  → CBK_SITE_BASE 미설정. 주소가 /claude-blog-kr/post.html 이라
   *                상대경로가 이미 맞고, 로컬 파일로 열 때도 깨지지 않는다.
   *   404.html   → CBK_SITE_BASE = "/claude-blog-kr/". 주소가 임의 깊이라 절대경로만 안전하다. */
  var SITE = window.CBK_SITE_BASE || "";
  var BASE = window.CBK_AT_ROOT ? SITE : "../";

  var CBK = window.CBK || null;
  var slug = window.CBK_currentSlug ? window.CBK_currentSlug()
           : (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
  var current = slug + ".html";
```

`nav.js` also loads its own stylesheet and links the library with `posts/`-relative paths, which break the same way. Add a second helper next to `BASE`:

```js
  /* assets/ 자체도 마찬가지다. posts/ 안에서는 "assets/…", 루트에서 서빙될 때는
   * post.html 이 세팅한 CBK_ASSET_BASE("posts/" 또는 "/claude-blog-kr/posts/")를 앞에 붙인다. */
  var ASSETS = (window.CBK_ASSET_BASE || "") + "assets/";
```

and fix these three too — `nav.js:106` `link.href = "assets/cbk.css"` becomes `ASSETS + "cbk.css"`, and the two `"../library.html"` links (`nav.js:42` in the sidebar, `nav.js:132` in the rating bar) become `BASE + "library.html"`. Miss these and the root-served pages render the bookmark/rating bar unstyled with a dead 보관함 link.

Then replace every hardcoded `"../index.html"` in this file with `BASE + "index.html"`. There are **four** occurrences — `nav.js:39` (`.nav-brand`), `nav.js:40` (`← 메인으로`), and the two inside the breadcrumb below (`nav.js:75`, `nav.js:77`):

```js
    '<a class="nav-brand" href="' + BASE + 'index.html">Claude 블로그 한글 번역</a>' +
    '<a class="nav-home" href="' + BASE + 'index.html">← 메인으로</a>' +
```

The sidebar's per-post links have the same problem. `buildItems()` at `nav.js:17` emits `href="' + p.file + '"`, which is relative to `posts/`; from the repo root that resolves to `/<slug>.html`, which is not a real path and does not match `404.html`'s `/posts/<slug>.html` recovery pattern either. Add one more helper next to `BASE` and use it in `buildItems`:

```js
  /* posts/ 안에서는 예전처럼 파일 상대 링크, 루트에서는 post.html?slug= 로 건다.
     404 폴백에서는 SITE 를 붙여야 한다 — 안 붙이면 /claude-blog-kr/posts/post.html?slug=x
     라는 없는 경로가 되고, 404 가 쿼리스트링을 먼저 읽는 덕에 "동작하는 것처럼" 보일 뿐
     HTTP 상태는 계속 404 다. */
  function hrefFor(file) {
    if (!window.CBK_AT_ROOT) return file;
    return SITE + "post.html?slug=" + encodeURIComponent(String(file).replace(/\.html$/, ""));
  }
```

```js
        '<li><a class="nav-link' + active + '" href="' + hrefFor(p.file) + '">' +
```

`window.CBK_AT_ROOT` is set by Task 5's `post.html` and `404.html` before `nav.js` loads; on the 79 legacy pages it is undefined, so their behaviour is byte-identical to today. `window.CBK_SITE_BASE` is set by `404.html` **only** — `post.html` deliberately leaves it undefined, because it really is served at `/claude-blog-kr/post.html` and hardcoding a base there would break opening the file locally. Task 5's test asserts both link forms, and `tests/nav.test.js` asserts all six link kinds (brand, home, library ×2, sidebar, breadcrumb) at all three serving locations.

`current` was previously the raw filename from the URL and is used at line 14 (`p.file === current ? " active" : ""`) and line 62 (`CBK_postBySlug(current)`). Deriving it from the slug keeps both working when the page is `post.html?slug=…` (Task 5).

Then, after `document.body.insertBefore(nav, document.body.firstChild);` at line 45, subscribe so the sidebar redraws when the catalog arrives. `refreshSidebar` already exists at line 48 and does exactly this:

```js
  if (window.CBK_onCatalog) window.CBK_onCatalog(function () { refreshSidebar(); });
```

Move that line below the `refreshSidebar` function definition (after line 59) so the function is defined when it runs.

The breadcrumb at lines 62-81 also depends on the catalog. Wrap it in a function and call it from the same subscription:

```js
  /* ---------- breadcrumb (메인 › 서브 › 제목) ---------- */
  function buildCrumb() {
    var meta = window.CBK_postBySlug ? window.CBK_postBySlug(slug) : null;
    var header = document.querySelector("header");
    if (!meta || !header) return;
    if (document.querySelector(".post-crumb")) return;   // 갱신 시 중복 삽입 방지
    function enc(s) { return encodeURIComponent(s); }
    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    var crumb = document.createElement("nav");
    crumb.className = "post-crumb";
    crumb.setAttribute("aria-label", "breadcrumb");
    crumb.innerHTML =
      '<a href="' + BASE + 'index.html#m=' + enc(meta.main) + '">' + esc(meta.main) + "</a>" +
      '<span class="post-crumb-sep">›</span>' +
      '<a href="' + BASE + 'index.html#m=' + enc(meta.main) + "&c=" + enc(meta.cat) + '">' + esc(meta.cat) + "</a>" +
      '<span class="post-crumb-sep">›</span>' +
      '<span class="post-crumb-cur">' + esc(meta.title) + "</span>";
    header.parentNode.insertBefore(crumb, header);
  }

  if (window.CBK_onCatalog) window.CBK_onCatalog(function () { refreshSidebar(); buildCrumb(); });
  else { refreshSidebar(); buildCrumb(); }
```

Everything from line 83 (`/* ---------- per-post bookmark + note bar ---------- */`) onward is unchanged — it depends on `CBK`, not on the catalog.

- [ ] **Step 4: Rewire `index.html`**

Replace lines 73-75:

```html
  <script src="posts/assets/catalog.js"></script>
  <script src="posts/assets/cbk-config.js"></script>
<script src="posts/assets/store.js"></script>
```

`cbk-config.js` must load **before** `catalog.js`, because `catalog.js` reads `window.CBK_CONFIG` at parse time. Put it first:

```html
  <script src="posts/assets/cbk-config.js"></script>
  <script src="posts/assets/catalog.js"></script>
  <script src="posts/assets/store.js"></script>
```

`index.html` contains **five** `render();` calls (lines 200, 205, 210, 213, 217) — four are inside event handlers and must not be touched. Wrap only the **initial** one: the bare `render();` at **line 213**, which sits on its own between the `favBtn` listener above it and the `CBK.sync.onSync(...)` block below it. Wrap that one:

```js
    if (window.CBK_onCatalog) window.CBK_onCatalog(function () { render(); });
    else render();
```

Leave `var POSTS = window.CBK_POSTS || [];` at line 79 as is — it is now a live reference.

- [ ] **Step 5: Rewire `library.html`**

Replace lines 164-166:

```html
  <script src="posts/assets/cbk-config.js"></script>
  <script src="posts/assets/catalog.js"></script>
  <script src="posts/assets/store.js"></script>
```

Update the comment at line 170 to name the new source, leave `var POSTS` alone, and wrap its **initial** `render()` call the same way as Step 4. `library.html` has six `render();` calls (317, 345, 361, 418, 429, 439); the initial one is the bare `render();` at **line 439**. The other five are inside event handlers — leave them.

- [ ] **Step 6: Swap the script tag in the 79 legacy post files**

```bash
cd /Users/mac_wb/.paseo/worktrees/3t1h93mp/pure-dolphin

# 사전 확인: 79개 전부 posts.js 를 로드하지만 cbk-config.js 는 16개만 로드한다
grep -l 'assets/posts\.js'  posts/*.html | wc -l    # expect 79
grep -l 'assets/cbk-config\.js' posts/*.html | wc -l    # expect 16

# 1패스: 태그 교체 (79개 전부)
sed -i '' 's|<script src="assets/posts\.js"></script>|<script src="assets/catalog.js"></script>|' posts/*.html

# 2패스: cbk-config.js 가 없는 63개에만 catalog.js 바로 앞에 삽입
for f in $(grep -L 'assets/cbk-config\.js' posts/*.html); do
  sed -i '' 's|<script src="assets/catalog\.js"></script>|<script src="assets/cbk-config.js"></script>\
<script src="assets/catalog.js"></script>|' "$f"
done

# 사후 확인
grep -l 'assets/posts\.js'      posts/*.html | wc -l    # expect 0
grep -l 'assets/catalog\.js'    posts/*.html | wc -l    # expect 79
grep -l 'assets/cbk-config\.js' posts/*.html | wc -l    # expect 79
grep -c 'assets/cbk-config\.js' posts/*.html | grep -v ':1$' | wc -l    # expect 0 (중복 삽입 없음)
```

Order matters: `catalog.js` reads `window.CBK_CONFIG` at parse time, so `cbk-config.js` must come first. In the 16 files that already had it, it sits above `store.js` (e.g. `posts/agent-identity-access-model.html:160`), which is already before the swapped tag — those need no insertion, and the last check above proves none got a second copy.

If the "expect 79 / expect 0" counts do not all match, **stop and fix the sed before committing** — a wrong count here means some legacy posts silently lose their sidebar.

- [ ] **Step 7: Stop loading `posts.js` — but do NOT delete it yet**

```bash
grep -rl 'assets/posts\.js' --include='*.html' . | wc -l    # expect 0 — nothing loads it any more
cd tests && node nav.test.js && node library.test.js && node catalog.test.js
```

**Do not run `git rm posts/assets/posts.js` in this task.** `scripts/migrate-posts.mjs:90` and `tests/migrate-posts.test.js:21` both read that file as the catalog source for the migration — deleting it here breaks Step 8's `npm test` in this very task, and breaks the human migration that this task's own STOP AND ASK schedules for immediately afterwards. The file stops being *served* here (no HTML references it) and gets deleted in Task 12, next to `git rm posts/*.html`, once the migration has already consumed it.

Expected: all three pass.

- [ ] **Step 8: Run the whole suite**

```bash
cd tests && npm test
```

Expected: everything passes. `tests/store.test.js` exercises `wikiRecords()`, which calls `window.CBK_postBySlug` — if it fails, the stub in that file needs the same treatment as Step 1.

- [ ] **Step 9: Commit**

```bash
git add index.html library.html posts/assets/nav.js posts/*.html tests/
git commit -m "refactor(catalog): posts.js 제거, 인덱스·보관함·사이드바를 DB 카탈로그로 전환"
```

> ### STOP AND ASK — 이 태스크와 Task 5 사이의 실이관
>
> **레이어 B 는 여기서 멈춘다. 구현 에이전트가 마이그레이션을 실행하지 않는다.**
>
> Task 4 까지 마치면 사이트는 DB 카탈로그를 읽는데 DB 에는 아직 행이 없다 — 인덱스·보관함·사이드바가 전부 비어 보인다. 이걸 채우는 건 사람이 한 번 돌리는 실이관이다:
>
> ```bash
> CBK_SYNC_KEY=<내 24자 sync_key> node scripts/migrate-posts.mjs
> ```
>
> 실행 전제: Task 1 의 STOP AND ASK(스키마 실행 + `cbk_owner_claim` true)가 끝나 있어야 한다. 실행 후 검증·롤백 절차는 **Task 2 말미의 STOP AND ASK 블록**에 있다(79건 확인, 빈 제목 0건 확인).
>
> 사람이 "79건 확인" 을 보고하기 전에는 Task 5 를 시작하지 않는다.
