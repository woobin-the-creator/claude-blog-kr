### Task 11: Review UI — editor tab and post badge

**Files:**
- Create: `posts/assets/reviews.js`
- Create: `tests/review-ui.test.js`
- Modify: `write.html` (`#tab-review` panel, load `reviews.js`)
- Modify: `posts/assets/write.js` (mount the panel, `#review` hash handling) — Task 6 put the editor's page script in this file, **not** inline in `write.html`; keep it that way or `tests/write-page.test.js` breaks
- Modify: `post.html` (review badge for my own posts)
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `cbk_reviews_list(p_key, p_slug)`, `cbk_review_set_status(p_key, p_id, p_status)` from Task 1; `CBK.sync.getKey()`; the `#tab-review` panel from Task 6; the `cbk:post-rendered` event and `window.CBK_CURRENT_POST` from Task 5's `render-post.js`.
- Produces: `window.CBK_reviews.mount(el, opts)` where `opts` is `{ slug: string|null, syncKey: string, rpc: function }`. Renders the list into `el` and wires the 반영함 / 무시 buttons. Returns a `{ refresh() }` handle.

**Background the implementer needs:**

Reviews are private (spec Decision 11). The repo and the site are public, so the panel must render **nothing at all** when there is no `sync_key` in localStorage — not an empty state, not a "로그인하세요" prompt. A visitor should not learn that reviews exist.

Two surfaces show the same data:

1. `write.html`'s 리뷰 tab — every open finding across all posts, so the author has one place to work through them. `cbk_reviews_list(key, null)` returns all posts' findings, already sorted open-first then by severity (Task 1).
2. `post.html` — a compact badge on a post the author wrote, showing the count of open findings for that post with a link into the editor tab. Only for `author === "me"`; translated posts have no reviews.

`post.html` renders its body asynchronously, so the badge must attach on the `cbk:post-rendered` event rather than at script load.

Each finding needs two buttons. 반영함 (`applied`) means the author fixed it; 무시 (`dismissed`) means they disagree. Both call `cbk_review_set_status` and drop the row out of the open list. Do not delete the row — keeping resolved findings is what makes the history useful later.

- [ ] **Step 1: Write the failing test**

Create `tests/review-ui.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const src = fs.readFileSync(ROOT + "/posts/assets/reviews.js", "utf8");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ROWS = [
  { id: 1, post_slug: "my-first", post_rev: 2, kind: "fact", severity: "high",
    quote: "2026년에 출시", comment: "출시는 2025년입니다.", suggestion: "2025년으로 고치세요.", status: "open" },
  { id: 2, post_slug: "my-first", post_rev: 2, kind: "style", severity: "low",
    quote: "그것은", comment: "지시어가 모호합니다.", suggestion: "", status: "open" },
  { id: 3, post_slug: "other", post_rev: 1, kind: "logic", severity: "medium",
    quote: "따라서", comment: "근거가 없습니다.", suggestion: "", status: "applied" }
];

function boot() {
  const dom = new JSDOM("<!doctype html><html><body><div id='host'></div></body></html>", { runScripts: "dangerously" });
  const w = dom.window;
  const s = w.document.createElement("script"); s.textContent = src; w.document.body.appendChild(s);
  const calls = [];
  const rpc = (fn, body) => {
    calls.push({ fn, body });
    if (fn === "cbk_reviews_list") {
      const rows = body.p_slug ? ROWS.filter(r => r.post_slug === body.p_slug) : ROWS;
      return Promise.resolve(rows.map(r => Object.assign({}, r)));
    }
    return Promise.resolve({});
  };
  return { w, calls, rpc, host: w.document.getElementById("host") };
}

(async () => {
  ok("CBK_reviews.mount exists", typeof boot().w.CBK_reviews.mount === "function");

  // --- no sync key renders nothing at all ---
  let b = boot();
  b.w.CBK_reviews.mount(b.host, { slug: null, syncKey: "", rpc: b.rpc });
  await sleep(20);
  ok("no key renders an empty host", b.host.innerHTML.trim() === "");
  ok("no key makes no network call", b.calls.length === 0);

  // --- all-posts view ---
  b = boot();
  b.w.CBK_reviews.mount(b.host, { slug: null, syncKey: "K", rpc: b.rpc });
  await sleep(20);
  ok("asked for every post", b.calls[0].fn === "cbk_reviews_list" && b.calls[0].body.p_slug === null);
  const items = b.host.querySelectorAll("[data-review-id]");
  ok("only open findings are listed", items.length === 2);
  ok("comment shown", /출시는 2025년입니다/.test(b.host.textContent));
  ok("quote shown", /2026년에 출시/.test(b.host.textContent));
  ok("suggestion shown when present", /2025년으로 고치세요/.test(b.host.textContent));
  ok("severity is marked on the element", items[0].getAttribute("data-severity") === "high");
  ok("kind is marked on the element", items[0].getAttribute("data-kind") === "fact");
  ok("post slug is shown in the all-posts view", /my-first/.test(b.host.textContent));
  ok("html in a finding is escaped", !/<script/i.test(b.host.innerHTML));

  // --- resolving ---
  const applied = items[0].querySelector('[data-act="applied"]');
  const dismissed = items[0].querySelector('[data-act="dismissed"]');
  ok("반영함 button present", !!applied && /반영/.test(applied.textContent));
  ok("무시 button present", !!dismissed && /무시/.test(dismissed.textContent));

  applied.click();
  await sleep(20);
  const set = b.calls.find(c => c.fn === "cbk_review_set_status");
  ok("clicking 반영함 sets status", !!set && set.body.p_status === "applied");
  ok("it targets the right review id", set.body.p_id === 1);
  ok("the list refreshed after resolving", b.calls.filter(c => c.fn === "cbk_reviews_list").length === 2);

  // --- single-post view ---
  b = boot();
  b.w.CBK_reviews.mount(b.host, { slug: "my-first", syncKey: "K", rpc: b.rpc });
  await sleep(20);
  ok("single-post view passes the slug", b.calls[0].body.p_slug === "my-first");

  // --- empty state, only for the owner ---
  b = boot();
  b.rpc = () => Promise.resolve([]);
  b.w.CBK_reviews.mount(b.host, { slug: "clean", syncKey: "K", rpc: b.rpc });
  await sleep(20);
  ok("clean post shows a Korean empty state", /지적|없습니다/.test(b.host.textContent));

  // --- write.html loads reviews.js and post.html has the badge hook ---
  const write = fs.readFileSync(ROOT + "/write.html", "utf8");
  ok("write.html loads reviews.js", /assets\/reviews\.js/.test(write));
  const post = fs.readFileSync(ROOT + "/post.html", "utf8");
  ok("post.html loads reviews.js", /assets\/reviews\.js/.test(post));
  ok("post.html has a badge container", /id="post-review-badge"/.test(post));

  console.log("review-ui: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node review-ui.test.js
```

Expected: FAIL — `ENOENT ... posts/assets/reviews.js`

- [ ] **Step 3: Write `posts/assets/reviews.js`**

```js
/* AI 첨삭 결과 표시. write.html 의 "리뷰" 탭과 post.html 의 배지가 공유한다.
 *
 * 리뷰는 비공개다. 공개 사이트이므로 sync_key 가 없으면 아무것도 그리지 않는다 —
 * 빈 상태조차 그리지 않는다. 방문자는 리뷰가 존재한다는 사실도 알 필요가 없다.
 */
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var KIND_LABEL = { fact: "사실", logic: "논리", style: "문장" };
  var SEV_LABEL  = { high: "높음", medium: "보통", low: "낮음" };

  function itemHtml(r, showSlug) {
    var h =
      '<li class="rv-item" data-review-id="' + r.id + '"' +
        ' data-kind="' + esc(r.kind) + '" data-severity="' + esc(r.severity) + '">' +
      '<div class="rv-head">' +
        '<span class="rv-kind rv-' + esc(r.kind) + '">' + esc(KIND_LABEL[r.kind] || r.kind) + '</span>' +
        '<span class="rv-sev rv-sev-' + esc(r.severity) + '">' + esc(SEV_LABEL[r.severity] || r.severity) + '</span>';
    if (showSlug) h += '<a class="rv-slug" href="post.html?slug=' + esc(r.post_slug) + '">' + esc(r.post_slug) + "</a>";
    h += "</div>";
    if (r.quote) h += '<blockquote class="rv-quote">' + esc(r.quote) + "</blockquote>";
    h += '<p class="rv-comment">' + esc(r.comment) + "</p>";
    if (r.suggestion) h += '<p class="rv-suggest">→ ' + esc(r.suggestion) + "</p>";
    h += '<div class="rv-acts">' +
           '<button type="button" data-act="applied">반영함</button>' +
           '<button type="button" data-act="dismissed">무시</button>' +
         "</div></li>";
    return h;
  }

  function mount(el, opts) {
    if (!el) return { refresh: function () {} };
    var slug = opts && opts.slug ? opts.slug : null;
    var key = (opts && opts.syncKey) || "";
    var rpc = opts && opts.rpc;

    if (!key || typeof rpc !== "function") { el.innerHTML = ""; return { refresh: function () {} }; }

    function refresh() {
      return rpc("cbk_reviews_list", { p_key: key, p_slug: slug }).then(function (rows) {
        var open = (rows || []).filter(function (r) { return r.status === "open"; });
        if (!open.length) {
          el.innerHTML = '<p class="rv-empty">아직 지적이 없습니다.</p>';
          return;
        }
        el.innerHTML = '<ul class="rv-list">' +
          open.map(function (r) { return itemHtml(r, !slug); }).join("") + "</ul>";

        el.querySelectorAll("[data-act]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var li = btn.closest("[data-review-id]");
            var id = Number(li.getAttribute("data-review-id"));
            btn.disabled = true;
            rpc("cbk_review_set_status", { p_key: key, p_id: id, p_status: btn.getAttribute("data-act") })
              .then(refresh)
              .catch(function (e) { btn.disabled = false; console.error(e); });
          });
        });
      }).catch(function (e) {
        el.innerHTML = '<p class="rv-empty">리뷰를 불러오지 못했습니다: ' + esc(e.message) + "</p>";
      });
    }

    refresh();
    return { refresh: refresh };
  }

  window.CBK_reviews = { mount: mount };
})();
```

- [ ] **Step 4: Run the test to check progress**

```bash
cd tests && node review-ui.test.js
```

Expected: everything up to the last three assertions passes; those three still fail because `write.html` and `post.html` are not wired yet.

- [ ] **Step 5: Wire the editor tab**

In `write.html`, add `<script src="posts/assets/reviews.js"></script>` after `markdown.js` and **before `write.js`** (which reads `window.CBK_reviews`). Then give `#tab-review` its content by mounting into it in `posts/assets/write.js`:

```js
    if (window.CBK_reviews) {
      var reviewPanel = window.CBK_reviews.mount(document.getElementById("tab-review"), {
        slug: null, syncKey: syncKey, rpc: rpc
      });
      // 탭을 열 때마다 새로 읽는다 — 리스너가 방금 채웠을 수 있다.
      document.querySelector('[data-tab="review"]').addEventListener("click", function () {
        reviewPanel.refresh();
      });
      /* post.html 의 배지는 write.html#review 로 보낸다. 그 해시로 들어오면
       * 편집 탭이 아니라 리뷰 탭이 열려 있어야 한다 — 아니면 배지 링크가
       * 아무 일도 하지 않는 것처럼 보인다. */
      if (location.hash === "#review") {
        document.querySelector('[data-tab="review"]').click();
      }
    }
```

Add the review styles to `write.html`'s `<style>` block:

```css
  .rv-list { list-style:none; padding:0; margin:0; }
  .rv-item { border:1px solid #eee; border-left:3px solid #ddd; border-radius:6px; padding:14px 16px; margin-bottom:12px; }
  .rv-item[data-severity="high"]   { border-left-color:#c0392b; }
  .rv-item[data-severity="medium"] { border-left-color:#c96442; }
  .rv-item[data-severity="low"]    { border-left-color:#bbb; }
  .rv-head { display:flex; gap:8px; align-items:center; font-size:0.78rem; margin-bottom:8px; }
  .rv-kind, .rv-sev { padding:2px 8px; border-radius:10px; background:#f2f2f0; color:#555; }
  .rv-slug { margin-left:auto; color:#c96442; text-decoration:none; }
  .rv-quote { margin:0 0 8px; padding:6px 12px; border-left:2px solid #e5e5e5; color:#666; font-size:0.9rem; }
  .rv-comment { margin:0 0 6px; font-size:0.94rem; }
  .rv-suggest { margin:0 0 10px; color:#2a7; font-size:0.9rem; }
  .rv-acts button { width:auto; padding:5px 12px; margin-right:6px; font-size:0.82rem;
                    border:1px solid #ddd; border-radius:5px; background:#fff; cursor:pointer; }
  .rv-empty { color:#888; font-size:0.9rem; }
```

- [ ] **Step 6: Wire the post badge**

In `post.html`, add the container right above `#post-body`:

```html
<div id="post-review-badge" hidden></div>
```

Add its styles to the page's second `<style>` block:

```css
  #post-review-badge { margin:0 0 20px; padding:10px 14px; border-radius:6px;
                       background:#fdf3ef; border:1px solid #f0d9d0; font-size:0.88rem; }
  #post-review-badge a { color:#c96442; }
```

Load `reviews.js` alongside the other scripts, then attach on the render event:

```html
<script src="posts/assets/reviews.js"></script>
<script>
(function () {
  document.addEventListener("cbk:post-rendered", function (ev) {
    var p = ev.detail;
    if (!p || p.author !== "me") return;                 // 번역 포스트엔 리뷰가 없다
    var key = "";
    try { key = localStorage.getItem("cbk:sync_key:v1") || ""; } catch (e) {}
    if (!key) return;                                     // 방문자에겐 아무것도 보이지 않는다

    var c = window.CBK_CONFIG || {};
    function rpc(fn, body) {
      return fetch(String(c.supabaseUrl).replace(/\/+$/, "") + "/rest/v1/rpc/" + fn, {
        method: "POST",
        headers: {
          "apikey": c.supabaseAnonKey,
          "Authorization": "Bearer " + c.supabaseAnonKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error(fn + " " + r.status + " " + t); });
        return r.json();
      });
    }

    rpc("cbk_reviews_list", { p_key: key, p_slug: p.slug }).then(function (rows) {
      var open = (rows || []).filter(function (r) { return r.status === "open"; });
      if (!open.length) return;
      var el = document.getElementById("post-review-badge");
      el.innerHTML = "🔎 AI 첨삭 지적 " + open.length + "건 · " +
        '<a href="write.html#review">리뷰 탭에서 보기</a>';
      el.hidden = false;
    }).catch(function () { /* 조용히 넘어간다 — 본문은 이미 보이고 있다 */ });
  });
})();
</script>
```

`post.html` sits at the repo root while its scripts live under `posts/assets/`, so the `src` is `posts/assets/reviews.js` — matching the other tags Task 5 added.

- [ ] **Step 7: Run the test to verify it passes**

```bash
cd tests && node review-ui.test.js
```

Expected: the final line reads `review-ui: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 8: Run the whole suite**

```bash
cd tests && npm test
```

Expected: everything passes. `write-page.test.js` now loads a page that also references `reviews.js`; it stubs `fetch` for every RPC, so `cbk_reviews_list` resolves to `[]` and the panel renders its empty state without breaking any assertion.

- [ ] **Step 9: Register the test and commit**

Add `review-ui.test.js` to `tests/package.json`'s `test` script and a `test:review-ui` entry.

```bash
git add posts/assets/reviews.js posts/assets/write.js write.html post.html tests/review-ui.test.js tests/package.json
git commit -m "feat(review): 리뷰 탭과 포스트 배지에서 첨삭 지적 확인·반영·무시"
```
