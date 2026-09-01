### Task 5: Post renderer and old-URL fallback

**Files:**
- Create: `post.html`
- Create: `404.html`
- Create: `posts/assets/render-post.js` (the shared renderer — this is the real code artifact of this task)
- Create: `tests/post-page.test.js`
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `cbk_post_get(p_slug)` from Task 1; `window.CBK_currentSlug`, `window.CBK_postBySlug`, `window.CBK_onCatalog` from Task 3.
- Produces: `post.html?slug=<slug>` as the canonical render URL for every post. Task 11 adds a review badge to this page and needs the element `#post-body` to exist as the body container and `#post-style` as the injected `<style>` element.

**Background the implementer needs:**

GitHub Pages serves files, not routes. Once the 79 legacy files are deleted in Task 12, `/posts/<slug>.html` has nothing behind it — but existing bookmarks, Telegram notification links, and `wiki/sources/*.md` all point there. Pages does serve `404.html` for any missing path, and the URL in the address bar is preserved, so `404.html` can read `location.pathname`, pull the slug out, and render the post. The HTTP status stays 404; that is acceptable because this plan already gives up SEO (see the spec's Non-goals).

Each post carries its own CSS in `cbk_posts.style_css` (Task 1) because the 79 archived posts do not share a stylesheet. Inject it into a `<style>` element rather than trying to merge stylesheets.

`body_html` comes from the DB and includes the post's own `<header>` and `<footer>` — the renderer supplies only the surrounding page chrome and the script tags. Task 2's test already guarantees no `<script>` survives inside `body_html`.

- [ ] **Step 1: Write the failing test**

Create `tests/post-page.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ROW = {
  slug: "my-first", title: "내 첫 글", nav: "첫 글", main: "내 글", cat: "에세이",
  date: "2026-09-01", author: "me", rev: 1,
  body_html: '<header><h1>내 첫 글</h1></header><p>본문입니다.</p>',
  style_css: "body{color:#123456}"
};

const RENDER_SRC = fs.readFileSync(ROOT + "/posts/assets/render-post.js", "utf8");

/* JSDOM 은 resources 로더를 붙이지 않으면 <script src> 를 가져오지 않는다.
 * runScripts:"dangerously" 는 "인라인 스크립트를 실행한다" 는 뜻일 뿐이다.
 * 그리고 fetch/CBK_CONFIG 스텁은 문서 파싱이 끝난 뒤에야 꽂을 수 있다.
 * 그래서 (1) 외부 스크립트 태그를 전부 걷어낸 HTML 을 파싱하고
 *        (2) 스텁을 주입하고
 *        (3) render-post.js 소스를 textContent 로 직접 실행한다.
 * 실행 순서를 테스트가 통제하게 되므로 이 방식이 실제 브라우저 순서와 같다. */
function boot(file, url, found) {
  let html = fs.readFileSync(ROOT + "/" + file, "utf8");
  html = html.replace(/<script src="[^"]*"><\/script>/g, "");
  const dom = new JSDOM(html, { url: url, runScripts: "dangerously" });
  const w = dom.window;
  w.CBK_CONFIG = { supabaseUrl: "https://db.test", supabaseAnonKey: "anon" };
  w.CBK_ASSET_BASE = "posts/";
  w.fetch = function (u, init) {
    const body = JSON.parse((init && init.body) || "{}");
    if (String(u).endsWith("/cbk_post_get")) {
      const hit = (found !== false && body.p_slug === ROW.slug) ? [ROW] : [];
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(hit) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
  };
  const s = w.document.createElement("script");
  s.textContent = RENDER_SRC;
  w.document.body.appendChild(s);
  return w;
}

(async () => {
  // post.html renders from ?slug=
  let w = boot("post.html", "https://x.test/post.html?slug=my-first");
  await sleep(30);
  const doc = w.document;
  ok("body container exists", !!doc.getElementById("post-body"));
  ok("body_html rendered", /본문입니다/.test(doc.getElementById("post-body").innerHTML));
  ok("post's own header kept", !!doc.querySelector("#post-body header h1"));
  ok("style injected", (doc.getElementById("post-style") || {}).textContent === "body{color:#123456}");
  ok("document title set from the post", doc.title === "내 첫 글");
  ok("no error state shown", doc.getElementById("post-error").hidden === true);
  ok("root pages flag themselves for nav.js", w.CBK_AT_ROOT === true);
  ok("nav.js is loaded from the asset base, not a bare relative path",
     [].slice.call(doc.querySelectorAll("script[src]"))
       .some(s => /^posts\/assets\/nav\.js$/.test(s.getAttribute("src"))));

  // missing post shows an error rather than a blank page
  w = boot("post.html", "https://x.test/post.html?slug=nope", false);
  await sleep(30);
  ok("missing post reveals the error block", w.document.getElementById("post-error").hidden === false);
  ok("missing post error is in Korean", /찾을 수 없/.test(w.document.getElementById("post-error").textContent));

  // 404.html recovers the slug from a legacy /posts/<slug>.html path
  w = boot("404.html", "https://x.test/claude-blog-kr/posts/my-first.html");
  await sleep(30);
  ok("404 fallback renders the post", /본문입니다/.test(w.document.getElementById("post-body").innerHTML));
  ok("404 fallback sets the title", w.document.title === "내 첫 글");

  // a genuinely unknown path is not treated as a post
  w = boot("404.html", "https://x.test/claude-blog-kr/nothing/here", false);
  await sleep(30);
  ok("non-post 404 shows the error block", w.document.getElementById("post-error").hidden === false);

  console.log("post-page: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node post-page.test.js
```

Expected: FAIL — `ENOENT ... post.html`

- [ ] **Step 3: Create the shared renderer script**

Create `posts/assets/render-post.js`:

```js
/* 포스트 한 건을 DB에서 읽어 화면에 그린다. post.html 과 404.html 이 공유한다.
 *
 * 79개 이관 포스트가 서로 다른 <style> 을 쓰기 때문에 CSS 는 글마다 따로
 * 주입한다(cbk_posts.style_css). 공용 스타일시트로 합치면 대부분의 글이
 * 조용히 다르게 보이게 된다.
 */
(function () {
  function cfg() {
    var c = (typeof window !== "undefined" && window.CBK_CONFIG) || {};
    return { url: (c.supabaseUrl || "").replace(/\/+$/, ""), key: c.supabaseAnonKey || "" };
  }

  /* 경로 어디에 있든 슬러그를 찾아낸다:
     /post.html?slug=x  ·  /posts/x.html  ·  /<repo>/posts/x.html */
  function slugFromLocation() {
    var q = /[?&]slug=([^&#]+)/.exec(location.search);
    if (q) return decodeURIComponent(q[1]).replace(/\.html$/, "");
    var m = /\/posts\/([^\/?#]+?)(?:\.html)?$/.exec(location.pathname);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function fail(msg) {
    var e = document.getElementById("post-error");
    if (e) { e.textContent = msg; e.hidden = false; }
    var b = document.getElementById("post-body");
    if (b) b.innerHTML = "";
  }

  var slug = slugFromLocation();
  if (!slug) { fail("글을 찾을 수 없습니다."); return; }

  var c = cfg();
  if (!c.url || !c.key) { fail("동기화 설정이 없어 글을 불러올 수 없습니다."); return; }

  fetch(c.url + "/rest/v1/rpc/cbk_post_get", {
    method: "POST",
    headers: {
      "apikey": c.key,
      "Authorization": "Bearer " + c.key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ p_slug: slug })
  }).then(function (r) {
    if (!r.ok) throw new Error("cbk_post_get " + r.status);
    return r.json();
  }).then(function (rows) {
    var p = (rows || [])[0];
    if (!p) { fail("글을 찾을 수 없습니다: " + slug); return; }

    var st = document.getElementById("post-style");
    if (st) st.textContent = p.style_css || "";

    var body = document.getElementById("post-body");
    if (body) body.innerHTML = p.body_html || "";

    document.title = p.title || slug;
    document.documentElement.setAttribute("data-slug", p.slug);
    window.CBK_CURRENT_POST = p;

    var err = document.getElementById("post-error");
    if (err) err.hidden = true;

    /* 사이드바·평가바는 본문이 DOM 에 들어온 뒤에 붙어야 한다. */
    ["assets/store.js", "assets/catalog.js", "assets/nav.js", "assets/nav-mobile.js"]
      .forEach(function (rel) {
        var s = document.createElement("script");
        s.src = (window.CBK_ASSET_BASE || "posts/") + rel;
        s.async = false;
        document.body.appendChild(s);
      });
    document.dispatchEvent(new CustomEvent("cbk:post-rendered", { detail: p }));
  }).catch(function (e) {
    fail("글을 불러오지 못했습니다: " + e.message);
  });
})();
```

**`window.CBK_AT_ROOT` (set by both pages in Steps 4 and 5, before any script tag):** `nav.js` hardcodes links relative to `posts/` — `"../index.html"` for the brand/home/breadcrumb links, and a bare `p.file` for each sidebar entry. `post.html` and `404.html` are served from the repo root, so without this flag every one of those links points outside the site. Task 4 Step 3 makes `nav.js` read the flag (`BASE` and `hrefFor()`); this task's only job is to set it. If Task 4 was implemented without those two helpers, go back and add them before finishing this task — the test below asserts the flag is set, and a manual click-through of the sidebar on `post.html` is the real check.

- [ ] **Step 4: Create `post.html`**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>글 · Claude 블로그 한글 번역</title>
<style id="post-style"></style>
<style>
  /* 글이 로드되기 전/실패했을 때만 보이는 최소 골격. 본문 스타일은 위 #post-style 이 담당한다. */
  body { font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
         color:#1a1a1a; line-height:1.75; max-width:760px; margin:0 auto; padding:48px 24px 96px; background:#fff; }
  #post-error { color:#a33; padding:24px 0; }
</style>
</head>
<body>
<p id="post-error" hidden></p>
<div id="post-body"></div>
<script>window.CBK_AT_ROOT = true; window.CBK_ASSET_BASE = "posts/";</script>
<script src="posts/assets/cbk-config.js"></script>
<script src="posts/assets/render-post.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create `404.html`**

Identical to `post.html` except the title and the comment — `render-post.js` already recovers the slug from a `/posts/<slug>.html` path, so no separate logic is needed:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude 블로그 한글 번역</title>
<style id="post-style"></style>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
         color:#1a1a1a; line-height:1.75; max-width:760px; margin:0 auto; padding:48px 24px 96px; background:#fff; }
  #post-error { color:#a33; padding:24px 0; }
  #post-error a { color:#c96442; }
</style>
</head>
<body>
<!-- GitHub Pages 는 없는 경로에 이 파일을 준다(주소는 그대로 유지된다).
     예전 링크 /posts/<slug>.html 이 여기로 떨어지면 그 슬러그로 글을 렌더한다. -->
<p id="post-error" hidden></p>
<div id="post-body"></div>
<script>window.CBK_AT_ROOT = true; window.CBK_ASSET_BASE = "/claude-blog-kr/posts/";</script>
<script src="/claude-blog-kr/posts/assets/cbk-config.js"></script>
<script src="/claude-blog-kr/posts/assets/render-post.js"></script>
</body>
</html>
```

Absolute paths are required here: `404.html` is served for arbitrary depths (`/posts/x.html`, `/a/b/c`), so relative script paths would resolve differently per URL. `/claude-blog-kr/` is the Pages base path for `https://woobin-the-creator.github.io/claude-blog-kr` — confirm it against `.github/workflows/deploy-pages.yml` and the live URL in `.pipeline/run.sh:9` before committing.

- [ ] **Step 6: Run the test to verify it passes**

```bash
cd tests && node post-page.test.js
```

Expected: the final line reads `post-page: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 7: Register the test and commit**

Add `post-page.test.js` to `tests/package.json`'s `test` script and a `test:post-page` entry.

```bash
git add post.html 404.html posts/assets/render-post.js tests/post-page.test.js tests/package.json
git commit -m "feat(render): DB에서 글을 그리는 post.html + 옛 URL을 살리는 404 폴백"
```
