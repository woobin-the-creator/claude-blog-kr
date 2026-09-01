### Task 6: Markdown editor that publishes instantly

**Files:**
- Create: `posts/assets/markdown.js`
- Create: `write.html`
- Create: `posts/assets/write.js` (the editor's page script — an external file, **not** an inline `<script>` block)
- Create: `tests/write-page.test.js`
- Modify: `index.html` (add a link to the editor), `tests/package.json`

**Interfaces:**
- Consumes: `cbk_post_upsert(...)` and `cbk_owner_claim(p_key)` from Task 1; `CBK.sync.getKey()` from `posts/assets/store.js:262`; `window.CBK_catalogRefresh` from Task 3.
- Produces:
  - `window.CBK_md(src)` -> HTML string. Pure function, no DOM.
  - `write.html` DOM contract used by Tasks 7 and 11: `#w-slug`, `#w-title`, `#w-nav`, `#w-main`, `#w-cat`, `#w-date`, `#w-body` (textarea), `#w-preview`, `#w-publish`, `#w-msg`, and the tab buttons `[data-tab="edit"]` / `[data-tab="review"]` with panels `#tab-edit` / `#tab-review`.

**Background the implementer needs:**

There is no build step and no npm dependency in the browser, so the markdown renderer is a small hand-written function, not a library. It needs to cover what a blog post uses: ATX headings, paragraphs, fenced code, inline code, bold, italic, links, images, unordered and ordered lists, blockquotes, and horizontal rules. Anything it does not recognise passes through as a paragraph.

**Escape HTML before applying inline rules**, otherwise a post containing a script tag publishes an XSS onto the live site. The user is the only author, but the rendered output is public and the same function will later render text that came back from an agent.

The secret is the existing `sync_key` — read it with `CBK.sync.getKey()`, never prompt for a second credential. On the first publish, call `cbk_owner_claim` before `cbk_post_upsert`; it is idempotent and seeds the owner row so the human never has to run SQL by hand.

Autosave the draft to `localStorage["cbk:draft:v1"]` on every keystroke, so closing the tab does not lose work. This is a plain local draft, not a server-side one — publishing is instant, so there is no need for a server draft state.

- [ ] **Step 1: Write the failing test**

Create `tests/write-page.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const mdSrc = fs.readFileSync(ROOT + "/posts/assets/markdown.js", "utf8");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  // ---------- markdown ----------
  const mdDom = new JSDOM("<!doctype html><html><body></body></html>", { runScripts: "dangerously" });
  const mw = mdDom.window;
  const s0 = mw.document.createElement("script"); s0.textContent = mdSrc; mw.document.body.appendChild(s0);
  const md = mw.CBK_md;

  ok("h2", md("## 제목") === "<h2>제목</h2>");
  ok("paragraph", md("한 줄입니다.") === "<p>한 줄입니다.</p>");
  ok("bold", /<strong>굵게<\/strong>/.test(md("이건 **굵게** 입니다.")));
  ok("italic", /<em>기울임<\/em>/.test(md("이건 *기울임* 입니다.")));
  ok("inline code", /<code>x = 1<\/code>/.test(md("값은 `x = 1` 입니다.")));
  ok("link", /<a href="https:\/\/x\.test">링크<\/a>/.test(md("[링크](https://x.test)")));
  ok("image", /<img src="https:\/\/x\.test\/a\.png" alt="그림">/.test(md("![그림](https://x.test/a.png)")));
  ok("ul", md("- 하나\n- 둘") === "<ul><li>하나</li><li>둘</li></ul>");
  ok("ol", md("1. 하나\n2. 둘") === "<ol><li>하나</li><li>둘</li></ol>");
  ok("blockquote", md("> 인용") === "<blockquote><p>인용</p></blockquote>");
  ok("hr", md("---") === "<hr>");
  ok("fenced code preserved verbatim", md("```\nconst a = 1 < 2;\n```") === "<pre><code>const a = 1 &lt; 2;\n</code></pre>");
  ok("html is escaped, not executed", md("<b>x</b>") === "<p>&lt;b&gt;x&lt;/b&gt;</p>");
  ok("no inline formatting inside fenced code", md("```\n**not bold**\n```").includes("**not bold**"));
  ok("empty input is empty output", md("") === "");

  // ---------- write.html ----------
  const html = fs.readFileSync(ROOT + "/write.html", "utf8");
  const dom = new JSDOM(html, { url: "https://x.test/write.html", runScripts: "dangerously" });
  const w = dom.window;
  w.CBK_CONFIG = { supabaseUrl: "https://db.test", supabaseAnonKey: "anon" };
  w.localStorage.setItem("cbk:sync_key:v1", "OWNERKEY123456789");

  const calls = [];
  w.fetch = function (u, init) {
    const fn = String(u).split("/rpc/")[1];
    const body = JSON.parse((init && init.body) || "{}");
    calls.push({ fn, body });
    if (fn === "cbk_owner_claim") return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(true) });
    if (fn === "cbk_post_upsert") return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ slug: body.p_slug, rev: 1 }) });
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
  };
  /* write.js 는 반드시 마지막이다. 이 파일이 CBK / CBK_CONFIG / sync_key 를 전부
   * 읽고 나서 동작하므로, 위 스텁들이 자리를 잡은 뒤에 실행돼야 한다.
   * (write.html 에 인라인으로 넣으면 JSDOM 이 문서를 파싱하는 순간 —
   *  즉 스텁을 꽂기 전에 — 실행돼서 "동기화 코드가 없습니다" 로 빠진다.
   *  그래서 별도 파일로 뺐다.) */
  for (const f of ["posts/assets/store.js", "posts/assets/catalog.js",
                   "posts/assets/markdown.js", "posts/assets/write.js"]) {
    const sc = w.document.createElement("script");
    sc.textContent = fs.readFileSync(ROOT + "/" + f, "utf8");
    w.document.body.appendChild(sc);
  }
  await sleep(30);
  const doc = w.document;

  ok("editor fields present",
     ["w-slug","w-title","w-nav","w-main","w-cat","w-date","w-body","w-preview","w-publish","w-msg"]
       .every(id => !!doc.getElementById(id)));
  ok("edit and review tabs present",
     !!doc.querySelector('[data-tab="edit"]') && !!doc.querySelector('[data-tab="review"]'));
  ok("date defaults to today", /^\d{4}-\d{2}-\d{2}$/.test(doc.getElementById("w-date").value));
  ok("main defaults to 내 글", doc.getElementById("w-main").value === "내 글");

  // live preview
  doc.getElementById("w-body").value = "## 안녕\n\n본문입니다.";
  doc.getElementById("w-body").dispatchEvent(new w.Event("input", { bubbles: true }));
  await sleep(30);
  ok("preview renders markdown", /<h2>안녕<\/h2>/.test(doc.getElementById("w-preview").innerHTML));
  ok("draft autosaved", JSON.parse(w.localStorage.getItem("cbk:draft:v1")).body === "## 안녕\n\n본문입니다.");

  // publishing validates the slug
  doc.getElementById("w-slug").value = "Bad Slug!";
  doc.getElementById("w-title").value = "제목";
  doc.getElementById("w-publish").click();
  await sleep(30);
  ok("bad slug is rejected client-side", /슬러그/.test(doc.getElementById("w-msg").textContent));
  ok("bad slug did not hit the network", calls.filter(c => c.fn === "cbk_post_upsert").length === 0);

  // a good publish
  doc.getElementById("w-slug").value = "my-first";
  doc.getElementById("w-publish").click();
  await sleep(50);
  const claim = calls.find(c => c.fn === "cbk_owner_claim");
  const up = calls.find(c => c.fn === "cbk_post_upsert");
  ok("owner is claimed before publishing", !!claim && !!up && calls.indexOf(claim) < calls.indexOf(up));
  ok("publish sent the sync key", up.body.p_key === "OWNERKEY123456789");
  ok("publish sent author=me", up.body.p_author === "me");
  ok("publish sent rendered html", /<h2>안녕<\/h2>/.test(up.body.p_body_html));
  ok("publish sent the markdown source", up.body.p_body_md === "## 안녕\n\n본문입니다.");
  ok("publish sent an empty style_css", up.body.p_style_css === "");
  ok("success message names the live URL", /post\.html\?slug=my-first/.test(doc.getElementById("w-msg").innerHTML));
  ok("draft cleared after publish", w.localStorage.getItem("cbk:draft:v1") === null);

  console.log("write-page: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node write-page.test.js
```

Expected: FAIL — `ENOENT ... posts/assets/markdown.js`

- [ ] **Step 3: Write the markdown renderer**

Create `posts/assets/markdown.js`:

```js
/* 최소 마크다운 -> HTML. 빌드 스텝이 없으므로 라이브러리를 쓰지 않는다.
 *
 * 순서가 중요하다: 펜스 코드블록을 먼저 뽑아 자리표시자로 치환하고,
 * 나머지를 이스케이프한 뒤 인라인 규칙을 적용하고, 마지막에 코드블록을
 * 되돌린다. 그래야 코드 안의 별표나 꺾쇠가 건드려지지 않는다.
 */
(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, function (m, c) { return "<code>" + c + "</code>"; })
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  }

  window.CBK_md = function (src) {
    if (!src) return "";
    var blocks = [];
    // 1) 펜스 코드블록을 통째로 빼둔다
    var text = String(src).replace(/```[a-zA-Z0-9]*\n([\s\S]*?)```/g, function (m, code) {
      blocks.push("<pre><code>" + esc(code) + "</code></pre>");
      return "\nCBKCODE" + (blocks.length - 1) + "\n";
    });

    var lines = text.split(/\r?\n/);
    var out = [], i = 0;

    function flushList(tag, items) {
      out.push("<" + tag + ">" + items.map(function (t) {
        return "<li>" + inline(esc(t)) + "</li>";
      }).join("") + "</" + tag + ">");
    }

    while (i < lines.length) {
      var ln = lines[i];

      if (/^\s*$/.test(ln)) { i++; continue; }

      var ph = /^CBKCODE(\d+)$/.exec(ln.trim());
      if (ph) { out.push(blocks[+ph[1]]); i++; continue; }

      if (/^\s*(---|\*\*\*|___)\s*$/.test(ln)) { out.push("<hr>"); i++; continue; }

      var h = /^(#{1,6})\s+(.*)$/.exec(ln);
      if (h) { var n = h[1].length; out.push("<h" + n + ">" + inline(esc(h[2].trim())) + "</h" + n + ">"); i++; continue; }

      if (/^\s*>\s?/.test(ln)) {
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
        out.push("<blockquote>" + window.CBK_md(q.join("\n")) + "</blockquote>");
        continue;
      }

      if (/^\s*[-*+]\s+/.test(ln)) {
        var ul = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { ul.push(lines[i].replace(/^\s*[-*+]\s+/, "")); i++; }
        flushList("ul", ul); continue;
      }

      if (/^\s*\d+[.)]\s+/.test(ln)) {
        var ol = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { ol.push(lines[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
        flushList("ol", ol); continue;
      }

      // 문단: 빈 줄이나 다른 블록이 나올 때까지 모은다
      var para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) &&
             !/^(#{1,6}\s|\s*[-*+]\s|\s*\d+[.)]\s|\s*>|CBKCODE\d)/.test(lines[i]) &&
             !/^\s*(---|\*\*\*|___)\s*$/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      out.push("<p>" + inline(esc(para.join("\n"))) + "</p>");
    }

    return out.join("");
  };
})();
```

- [ ] **Step 4: Run just the markdown assertions**

```bash
cd tests && node write-page.test.js 2>&1 | head -20
```

Expected: the 15 markdown checks pass; the run then fails at `ENOENT ... write.html`.

- [ ] **Step 5: Write the editor page**

Create `write.html`. Model the page chrome on `youtube.html` — same header treatment, same "설정 안 됨" fallback when there is no sync key.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>글쓰기 · Claude 블로그 한글 번역</title>
<style>
  body { font-family:-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo","Malgun Gothic",sans-serif;
         color:#1a1a1a; line-height:1.6; max-width:1100px; margin:0 auto; padding:32px 24px 96px; background:#fff; }
  h1 { font-size:1.6rem; margin:0 0 20px; }
  .tabs { display:flex; gap:8px; border-bottom:2px solid #e5e5e5; margin-bottom:20px; }
  .tabs button { background:none; border:none; padding:10px 16px; font-size:0.95rem; cursor:pointer;
                 color:#666; border-bottom:2px solid transparent; margin-bottom:-2px; }
  .tabs button.on { color:#c96442; border-bottom-color:#c96442; font-weight:600; }
  .meta-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; margin-bottom:16px; }
  .meta-grid label { display:block; font-size:0.82rem; color:#666; margin-bottom:4px; }
  input, textarea, select { width:100%; padding:8px 10px; border:1px solid #ddd; border-radius:6px;
                            font:inherit; font-size:0.92rem; }
  .split { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  #w-body { min-height:460px; font-family:"SF Mono",Menlo,Consolas,monospace; font-size:0.88rem; resize:vertical; }
  #w-preview { min-height:460px; border:1px solid #eee; border-radius:6px; padding:16px 18px; overflow:auto; }
  #w-preview img { max-width:100%; height:auto; }
  #w-preview pre { background:#f6f6f4; padding:14px; border-radius:6px; overflow-x:auto; }
  .actions { margin-top:16px; display:flex; align-items:center; gap:12px; }
  #w-publish { width:auto; padding:10px 22px; background:#c96442; color:#fff; border:none;
               border-radius:6px; cursor:pointer; font-size:0.95rem; }
  #w-publish:disabled { opacity:0.5; cursor:default; }
  #w-msg { font-size:0.88rem; }
  #w-msg.err { color:#a33; }
  #w-msg.ok  { color:#2a7; }
  @media (max-width:860px) { .split { grid-template-columns:1fr; } }
</style>
</head>
<body>
  <h1>✍️ 글쓰기</h1>
  <div class="tabs">
    <button type="button" data-tab="edit" class="on">편집</button>
    <button type="button" data-tab="review">리뷰</button>
  </div>

  <section id="tab-edit">
    <div class="meta-grid">
      <div><label for="w-slug">슬러그 (URL, 영문 소문자·하이픈)</label><input id="w-slug" placeholder="my-first-post"></div>
      <div><label for="w-title">제목</label><input id="w-title" placeholder="글 제목"></div>
      <div><label for="w-nav">사이드바 짧은 제목</label><input id="w-nav" placeholder="비우면 제목을 씁니다"></div>
      <div><label for="w-main">출처(메인 분류)</label><input id="w-main" value="내 글"></div>
      <div><label for="w-cat">주제(서브 분류)</label><input id="w-cat" placeholder="에세이"></div>
      <div><label for="w-date">날짜</label><input id="w-date" type="date"></div>
    </div>
    <div class="split">
      <textarea id="w-body" placeholder="마크다운으로 씁니다."></textarea>
      <div id="w-preview"></div>
    </div>
    <div class="actions">
      <button type="button" id="w-publish">발행</button>
      <span id="w-msg"></span>
    </div>
  </section>

  <section id="tab-review" hidden></section>

  <script src="posts/assets/cbk-config.js"></script>
  <script src="posts/assets/store.js"></script>
  <script src="posts/assets/catalog.js"></script>
  <script src="posts/assets/markdown.js"></script>
  <script src="posts/assets/write.js"></script>
</body>
</html>
```

**Do not put the page script inline in `write.html`.** It goes in `posts/assets/write.js`, for two reasons: the ES5-IIFE Global Constraint applies to files under `posts/assets/`, and — decisively — an inline block runs the moment JSDOM parses the document, which in `tests/write-page.test.js` is *before* `store.js`, `CBK_CONFIG`, and the `cbk:sync_key:v1` stub exist. An inline script would therefore always take the "동기화 코드가 없습니다" early-return branch and every publish assertion would fail no matter how correct the code was. Task 7 and Task 11 add to this same file.

`posts/assets/write.js` must do exactly this, in ES5 IIFE style:

1. `var CBK = window.CBK;` and `var syncKey = CBK && CBK.sync ? CBK.sync.getKey() : "";`. If there is no key, put `동기화 코드가 없습니다. 보관함에서 먼저 설정하세요.` into `#w-msg`, disable `#w-publish`, and stop.
2. Default `#w-date` to today: `new Date().toISOString().slice(0,10)`.
3. `rpc(fn, body)` — copy the shape from `posts/assets/store.js:214-232` verbatim.
4. Tab switching: clicking `[data-tab]` toggles the `on` class and shows/hides `#tab-edit` / `#tab-review` via the `hidden` property.
5. `renderPreview()` — `document.getElementById("w-preview").innerHTML = window.CBK_md(bodyEl.value)`. Bound to `input` on `#w-body`, called once at start.
6. `saveDraft()` — writes `{ slug, title, nav, main, cat, date, body }` to `localStorage["cbk:draft:v1"]` on every `input` event. On load, restore it if present. Write synchronously rather than debounced; a draft object is small and the test asserts it lands after a single event.
7. `publish()` —
   - Read the fields. Validate `slug` against `/^[a-z0-9][a-z0-9-]{0,120}$/`; on failure set `#w-msg` to `슬러그는 영문 소문자·숫자·하이픈만 쓸 수 있습니다.` with class `err` and **return before any fetch**.
   - Validate that title is non-empty: `제목을 입력하세요.`
   - Disable the button, then `rpc("cbk_owner_claim", { p_key: syncKey })` **first**, then `rpc("cbk_post_upsert", ...)` with `p_key`, `p_slug`, `p_title`, `p_nav` (falling back to the title), `p_main`, `p_cat`, `p_date`, `p_body_html: window.CBK_md(body)`, `p_body_md: body`, `p_style_css: ""`, `p_author: "me"`.
   - On success: set `#w-msg` innerHTML to `발행됐습니다 · <a href="post.html?slug=SLUG">글 보기</a>` (substituting the real slug) with class `ok`, `localStorage.removeItem("cbk:draft:v1")`, and call `window.CBK_catalogRefresh()` so the index picks it up.
   - On failure: `#w-msg` gets `발행 실패: ` plus the error message, class `err`. If the message contains `not the owner`, use `이 사이트의 소유자 키가 아닙니다.` instead.
   - Re-enable the button in both cases.

The file is a single `(function () { ... })();` IIFE at top level — no `DOMContentLoaded` wrapper. It is the last script tag on the page, so the DOM it needs is already parsed, and the test injects it last for the same reason.

`p_style_css` is empty for hand-written posts: they inherit the renderer's default styling in `post.html`, unlike the 79 migrated posts which carry their own CSS.

- [ ] **Step 6: Run the test to verify it passes**

```bash
cd tests && node write-page.test.js
```

Expected: the final line reads `write-page: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 7: Link the editor from the index**

In `index.html`, next to the existing 보관함 link, add `<a href="write.html">✍️ 글쓰기</a>` styled the same way as its neighbour.

- [ ] **Step 8: Register the test and commit**

Add `write-page.test.js` to `tests/package.json`'s `test` script and a `test:write` entry.

```bash
git add write.html posts/assets/write.js posts/assets/markdown.js index.html tests/write-page.test.js tests/package.json
git commit -m "feat(write): 마크다운 에디터에서 커밋 없이 바로 발행"
```
