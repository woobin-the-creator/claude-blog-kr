### Task 2: Migrate the 79 existing posts into the DB

**Files:**
- Create: `scripts/migrate-posts.mjs`
- Create: `tests/migrate-posts.test.js`
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `cbk_post_upsert(p_key, p_slug, p_title, p_nav, p_main, p_cat, p_date, p_body_html, p_body_md, p_style_css, p_author)` from Task 1.
- Produces: `scripts/migrate-posts.mjs` exports `extractPost(html, entry, pagesBase)` → `{ slug, title, nav, main, cat, date, body_html, style_css, body_md, author }`. Task 8 (`publish.mjs`) and Task 12 (`snapshot.mjs`) both import `extractPost`'s sibling helper `absolutizeAssets(html, slug, pagesBase)`, so export both. `main()` is exported as well, so the test can drive the `--dry` path in-process and assert it never calls `fetch` — that no-network guarantee is what the human STOP AND ASK below rests on.

**Background the implementer needs:**

Every file in `posts/*.html` has exactly the same outer shape — verified across all 79:

```
<!DOCTYPE html><html lang="ko"><head> … <style> … </style></head>
<body>
<header> … </header>
   … post content …
<footer> … </footer>
<script src="assets/cbk-config.js"></script>
<script src="assets/store.js"></script>
<script src="assets/posts.js"></script>
<script src="assets/nav.js"></script>
<script src="assets/nav-mobile.js"></script>
</body></html>
```

`<body>` appears with no attributes in all 79 files, so a plain string split is safe. The body to store is everything between `<body>` and the **first** `<script` tag — the script tags are the site chrome, which the Task 5 renderer re-adds itself.

Media is referenced relatively as `src="assets/<slug>/foo.png"` and must become an absolute GitHub Pages URL, because the renderer at `post.html` sits one directory level up from `posts/`. The 79 MB of media stays exactly where it is — this is a URL rewrite, not a file move.

The catalog metadata (`title`, `nav`, `main`, `cat`, `date`) lives in `posts/assets/posts.js`, which is an IIFE that assigns `window.CBK_POSTS`. Evaluate it in a `node:vm` context with a stub `window` rather than parsing it with a regex.

- [ ] **Step 1: Write the failing test**

Create `tests/migrate-posts.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }

(async () => {
  const mod = await import(ROOT + "/scripts/migrate-posts.mjs");
  const { extractPost, absolutizeAssets, loadCatalog } = mod;
  const PAGES = "https://woobin-the-creator.github.io/claude-blog-kr";

  // --- absolutizeAssets ---
  const rewritten = absolutizeAssets('<img src="assets/my-slug/hero.png"><a href="https://x.test/a">x</a>', "my-slug", PAGES);
  ok("relative asset src becomes an absolute Pages URL",
     rewritten.includes('src="' + PAGES + '/posts/assets/my-slug/hero.png"'));
  ok("external links are left alone", rewritten.includes('href="https://x.test/a"'));
  const already = absolutizeAssets('<img src="' + PAGES + '/posts/assets/s/a.png">', "s", PAGES);
  ok("absolutizing twice is a no-op", already === '<img src="' + PAGES + '/posts/assets/s/a.png">');

  // --- catalog loads from the real posts.js ---
  const catalog = loadCatalog(ROOT + "/posts/assets/posts.js");
  ok("catalog has 79 entries", catalog.length === 79);
  ok("catalog entries carry file/date/main/cat/title/nav",
     catalog.every(e => e.file && e.date && e.main && e.cat && e.title && e.nav));

  // --- extractPost against every real post: lossless and script-free ---
  let bad = [];
  for (const entry of catalog) {
    const file = ROOT + "/posts/" + entry.file;
    if (!fs.existsSync(file)) { bad.push(entry.file + " missing"); continue; }
    const row = extractPost(fs.readFileSync(file, "utf8"), entry, PAGES);
    if (!row.body_html || row.body_html.length < 200) bad.push(entry.file + " body too short");
    if (/<script/i.test(row.body_html)) bad.push(entry.file + " body still has <script>");
    if (/<\/?body/i.test(row.body_html)) bad.push(entry.file + " body still has <body>");
    if (!row.style_css || row.style_css.length < 100) bad.push(entry.file + " style missing");
    if (/<style/i.test(row.style_css)) bad.push(entry.file + " style_css kept its tag");
    if (/src="assets\//.test(row.body_html)) bad.push(entry.file + " relative asset left");
    if (row.author !== "ai") bad.push(entry.file + " author should be ai");
    if (row.slug !== entry.file.replace(/\.html$/, "")) bad.push(entry.file + " slug mismatch");
  }
  ok("all 79 posts extract cleanly" + (bad.length ? " — " + bad.slice(0, 5).join("; ") : ""), bad.length === 0);

  // --- the header (title/meta) survives, since the renderer does not re-add it ---
  const one = catalog.find(e => e.file === "artifacts-in-claude-code.html");
  const row = extractPost(fs.readFileSync(ROOT + "/posts/" + one.file, "utf8"), one, PAGES);
  ok("body keeps its <header>", /<header>/.test(row.body_html));
  ok("body keeps its <footer>", /<footer>/.test(row.body_html));
  ok("body_md is null for migrated translations", row.body_md === null);

  // --- --dry 는 절대 네트워크를 건드리지 않는다 ---
  // 사람이 승인하는 STOP AND ASK 가 이 보장 위에 서 있다. Task 8 이 이 파일을
  // import 하므로, 여기서 회귀하면 사람 승인 없이 실서비스에 쓰게 된다.
  let fetchCalls = 0;
  const realFetch = globalThis.fetch;
  const realArgv = process.argv;
  const realWrite = process.stdout.write.bind(process.stdout);
  const realErr = console.error;
  let ndjsonLines = 0;
  globalThis.fetch = function () { fetchCalls++; return Promise.reject(new Error("--dry must not fetch")); };
  process.argv = [realArgv[0], ROOT + "/scripts/migrate-posts.mjs", "--dry"];
  process.stdout.write = function (chunk) { ndjsonLines += String(chunk).split("\n").length - 1; return true; };
  console.error = function () {};
  let dryErr = null;
  try { await mod.main(); } catch (e) { dryErr = e; }
  finally {
    globalThis.fetch = realFetch;
    process.argv = realArgv;
    process.stdout.write = realWrite;
    console.error = realErr;
  }
  ok("--dry runs without throwing" + (dryErr ? " — " + dryErr.message : ""), dryErr === null);
  ok("--dry never calls fetch", fetchCalls === 0);
  ok("--dry emits one NDJSON line per post", ndjsonLines === 79);

  console.log("migrate-posts: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node migrate-posts.test.js
```

Expected: FAIL — `Cannot find module '.../scripts/migrate-posts.mjs'`

- [ ] **Step 3: Write the migration script**

Create `scripts/migrate-posts.mjs`:

```js
#!/usr/bin/env node
/* 기존 posts/*.html 79개를 cbk_posts 로 이관한다.
 *
 * 미디어(posts/assets/<slug>/, 79MB)는 옮기지 않는다 — GitHub Pages 에 그대로 두고
 * 본문의 상대 경로만 절대 URL 로 바꾼다.
 *
 *   node scripts/migrate-posts.mjs --dry        # 무엇이 올라갈지 NDJSON 으로 출력
 *   CBK_SYNC_KEY=... node scripts/migrate-posts.mjs   # 실제 업로드
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PAGES_BASE = "https://woobin-the-creator.github.io/claude-blog-kr";

/* posts.js 는 window.CBK_POSTS 를 세팅하는 IIFE 다. 정규식으로 뜯지 말고 실행한다. */
export function loadCatalog(file) {
  const src = fs.readFileSync(file, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.window.CBK_POSTS || [];
}

/* src="assets/…" / href="assets/…" → Pages 절대 URL. 이미 절대면 건드리지 않는다.
 * slug 는 지금 쓰이지 않는다 — Task 8(publish.mjs) / Task 12(snapshot.mjs) 가
 * 이 시그니처로 호출하므로 호환을 위해 인자만 남겨둔다. */
export function absolutizeAssets(html, slug, pagesBase) {
  return html.replace(/(src|href|poster)="assets\//g, '$1="' + pagesBase + '/posts/assets/');
}

/* 한 파일 → 한 행. <body> 와 첫 <script 사이가 본문이다. */
export function extractPost(html, entry, pagesBase) {
  const slug = entry.file.replace(/\.html$/, "");

  const styleM = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i);
  const style_css = styleM ? styleM[1].trim() : "";

  const bodyStart = html.indexOf("<body>");
  if (bodyStart === -1) throw new Error(entry.file + " 에 <body> 가 없습니다");
  let body = html.slice(bodyStart + "<body>".length);

  const scriptAt = body.search(/<script\b/i);
  if (scriptAt !== -1) body = body.slice(0, scriptAt);
  body = body.replace(/<\/body>[\s\S]*$/i, "").trim();

  return {
    slug,
    title: entry.title,
    nav: entry.nav || entry.title,
    main: entry.main || "",
    cat: entry.cat || "",
    date: entry.date,
    body_html: absolutizeAssets(body, slug, pagesBase),
    style_css,
    body_md: null,          // 번역 이관분은 마크다운 원본이 없다
    author: "ai"
  };
}

/* ---- CLI ---- */
/* 설정은 모듈 스코프에서 한 번만 읽는다. rpc() 가 158번 불리는데 그때마다
 * 파일을 다시 읽고 정규식을 돌릴 이유가 없다. */
let CFG = null;
function cfg() {
  if (CFG) return CFG;
  const src = fs.readFileSync(ROOT + "/posts/assets/cbk-config.js", "utf8");
  const url = (src.match(/supabaseUrl:\s*"([^"]*)"/) || [])[1];
  const key = (src.match(/supabaseAnonKey:\s*"([^"]*)"/) || [])[1];
  if (!url || !key) throw new Error("posts/assets/cbk-config.js 에서 Supabase 설정을 읽지 못했습니다");
  CFG = { url: url.replace(/\/+$/, ""), key };
  return CFG;
}

async function rpc(fn, body) {
  const c = cfg();
  const r = await fetch(c.url + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: { apikey: c.key, Authorization: "Bearer " + c.key, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error("RPC " + fn + " " + r.status + ": " + (await r.text()));
  return r.status === 204 ? null : r.json();
}

export async function main() {
  const dry = process.argv.includes("--dry");
  const catalog = loadCatalog(ROOT + "/posts/assets/posts.js");
  const rows = catalog.map(e =>
    extractPost(fs.readFileSync(ROOT + "/posts/" + e.file, "utf8"), e, PAGES_BASE));

  if (dry) {
    for (const r of rows) {
      process.stdout.write(JSON.stringify({
        slug: r.slug, title: r.title, date: r.date, main: r.main, cat: r.cat,
        body_bytes: r.body_html.length, style_bytes: r.style_css.length
      }) + "\n");
    }
    console.error(rows.length + "건 준비 완료 (드라이런 — 아무것도 업로드하지 않았습니다)");
    return;
  }

  const key = process.env.CBK_SYNC_KEY;
  if (!key) { console.error("CBK_SYNC_KEY 가 없습니다"); process.exit(1); }
  // cbk_owner_claim 은 false 를 HTTP 200 으로 돌려준다. 버리면 첫 포스트에서
  // "RPC cbk_post_upsert 400: not the owner" 로 죽고, 진짜 원인이 안 보인다.
  const owned = await rpc("cbk_owner_claim", { p_key: key });
  if (owned !== true) {
    console.error("이 sync_key 는 이 사이트의 소유자가 아닙니다 — 다른 키가 이미 cbk_owner 를 선점했습니다.");
    console.error("Supabase SQL 에디터에서 `delete from public.cbk_owner where id = 1;` 로 지운 뒤,");
    console.error("그 사이 들어온 글이 없는지 cbk_posts 를 확인하고 다시 실행하세요.");
    process.exit(1);
  }

  let n = 0;
  for (const r of rows) {
    await rpc("cbk_post_upsert", {
      p_key: key, p_slug: r.slug, p_title: r.title, p_nav: r.nav,
      p_main: r.main, p_cat: r.cat, p_date: r.date,
      p_body_html: r.body_html, p_body_md: r.body_md,
      p_style_css: r.style_css, p_author: r.author
    });
    n++;
    console.error("[" + n + "/" + rows.length + "] " + r.slug);
  }
  // 이관분은 이미 검수된 번역이라 첨삭 대상이 아니다. pending 을 전부 내린다.
  for (const r of rows) {
    await rpc("cbk_review_finish", { p_key: key, p_slug: r.slug, p_status: "done", p_error: null });
  }
  console.error("완료: " + n + "건 업로드");
}

if (process.argv[1] && process.argv[1].endsWith("migrate-posts.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd tests && node migrate-posts.test.js
```

Expected: the final line reads `migrate-posts: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

If "all 79 posts extract cleanly" fails, the message names the first five offending files. Open one and compare its `<body>` region against the shape documented above — do not loosen the assertions to make them pass, because a body that still contains `<script>` will inject the old `posts.js` into the new renderer.

- [ ] **Step 5: Eyeball the dry run**

```bash
node scripts/migrate-posts.mjs --dry | head -3
node scripts/migrate-posts.mjs --dry | wc -l
```

Expected: 79 lines, each with a `body_bytes` in the low tens of thousands and a non-zero `style_bytes`.

- [ ] **Step 6: Register the test and commit**

Add `migrate-posts.test.js` to `tests/package.json`'s `test` script and a `test:migrate` entry, then:

```bash
git add scripts/migrate-posts.mjs tests/migrate-posts.test.js tests/package.json
git commit -m "feat(migrate): 기존 79개 포스트를 cbk_posts 로 옮기는 이관 스크립트"
```

> ### STOP AND ASK — 실데이터 이관은 사람이 승인한다
>
> **구현 에이전트는 `scripts/migrate-posts.mjs` 를 실서비스 대상으로 실행하지 않는다.** 이 태스크에서 허용되는 실행은 `--dry` 뿐이다. 커밋까지 마친 뒤 멈추고 오케스트레이터에게 보고한다.
>
> 실업로드는 Task 1 의 STOP AND ASK(스키마 실행 + `cbk_owner_claim` true 확인)가 끝난 뒤, **Task 4 와 Task 5 사이에** 사람이 직접 돌린다:
>
> ```bash
> CBK_SYNC_KEY=<내 24자 sync_key> node scripts/migrate-posts.mjs
> ```
>
> **업로드 직후 검증(사람이 확인하고 결과를 보고한다):**
>
> ```bash
> curl -sS "$CBK_SUPABASE_URL/rest/v1/rpc/cbk_posts_list" \
>   -H "apikey: $CBK_SUPABASE_ANON" -H "Content-Type: application/json" \
>   -d '{}' | jq 'length'          # 79 가 나와야 한다
>
> curl -sS "$CBK_SUPABASE_URL/rest/v1/rpc/cbk_posts_list" \
>   -H "apikey: $CBK_SUPABASE_ANON" -H "Content-Type: application/json" \
>   -d '{}' | jq '[.[] | select(.title == null or .title == "")] | length'   # 0 이어야 한다
> ```
>
> 개수가 79 가 아니거나 빈 제목이 있으면 **다음 태스크로 넘어가지 말고** 롤백한다:
>
> ```bash
> # 잘못 올라간 slug 를 하나씩 지운다 (전량 롤백이면 --dry 목록의 79개 slug 전부)
> curl -sS "$CBK_SUPABASE_URL/rest/v1/rpc/cbk_post_delete" \
>   -H "apikey: $CBK_SUPABASE_ANON" -H "Content-Type: application/json" \
>   -d '{"p_key":"<sync_key>","p_slug":"<slug>"}'
> ```
>
> 스크립트는 slug upsert 이므로 재실행이 안전하다 — 부분 실패 시 원인을 고치고 통째로 다시 돌려도 중복 행이 생기지 않는다.
