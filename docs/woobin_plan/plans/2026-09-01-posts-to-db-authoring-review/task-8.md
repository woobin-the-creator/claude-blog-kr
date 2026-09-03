### Task 8: `publish.mjs` and rewiring the translation pipelines

**Files:**
- Create: `scripts/publish.mjs`
- Create: `tests/publish.test.js`
- Modify: `.pipeline/run.sh:47-60` (the prompt handed to `claude -p`)
- Modify: `.pipeline/youtube_worker.sh:99-125` (the two prompts)
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `cbk_post_upsert(...)`, `cbk_owner_claim(p_key)` from Task 1; `absolutizeAssets(html, slug, pagesBase)` and `PAGES_BASE` from `scripts/migrate-posts.mjs` (Task 2).
- Produces: `scripts/publish.mjs` as **the single entry point for putting a post into the site.** Both translation skills and the Task 9 listener shell out to it. CLI contract:
  - `node scripts/publish.mjs <html-file> --slug <slug> --title <t> --main <m> --cat <c> [--nav <n>] [--date YYYY-MM-DD] [--author ai|me] [--dry]`
  - Prints exactly one line on success: `PUBLISHED <slug>`
  - Exits non-zero with a one-line reason on `stderr` otherwise.
  - Also exports `parseArgs(argv)` and `buildRow(html, opts)` for the test.

**Background the implementer needs:**

`.pipeline/run.sh` and `.pipeline/youtube_worker.sh` currently tell `claude -p` to write a file into `posts/`, register the post in the catalog, and `git push`. **The two workers name the catalog differently** — `run.sh:51` says "the POSTS array in `posts/assets/nav.js`" while `youtube_worker.sh` says "`posts.js` registration". Any assertion or grep you write has to cover both spellings. All three of those steps are exactly what this plan removes. The skills (`claude-blog-translate-ko`, `claude-youtube-to-blog`) still generate a full standalone HTML file — that part is good and should not change, because the skills produce rich markup with figures and embeds. What changes is the last mile: instead of committing the file, the worker calls `publish.mjs`, which extracts body and style out of the generated file exactly the way Task 2's `extractPost` does, and upserts it.

**Media is the one thing that still needs a commit.** The skills download images into `posts/assets/<slug>/`, and those files must be reachable at a Pages URL for the body's absolute links to resolve. So the worker still commits the *assets directory* — but not the post, and not the catalog (`posts.js` / the `POSTS` array in `nav.js`). Keep that distinction explicit in the prompts, because a model reading a half-updated instruction will do both or neither.

Do not duplicate the extraction logic. Import it from `scripts/migrate-posts.mjs`.

- [ ] **Step 1: Write the failing test**

Create `tests/publish.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const os = require("os");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }

(async () => {
  const { parseArgs, buildRow } = await import(ROOT + "/scripts/publish.mjs");

  // --- parseArgs ---
  const a = parseArgs(["file.html", "--slug", "s1", "--title", "제목", "--main", "M", "--cat", "C"]);
  ok("file positional captured", a.file === "file.html");
  ok("slug parsed", a.slug === "s1");
  ok("title parsed", a.title === "제목");
  ok("nav falls back to title", a.nav === "제목");
  ok("author defaults to ai", a.author === "ai");
  ok("date defaults to today", /^\d{4}-\d{2}-\d{2}$/.test(a.date));

  let threw = false;
  try { parseArgs(["f.html", "--slug", "Bad Slug", "--title", "t", "--main", "m", "--cat", "c"]); }
  catch (e) { threw = /slug/i.test(e.message); }
  ok("parseArgs rejects a bad slug", threw);

  threw = false;
  try { parseArgs(["f.html", "--slug", "ok-slug", "--main", "m", "--cat", "c"]); }
  catch (e) { threw = /title/i.test(e.message); }
  ok("parseArgs requires a title", threw);

  // --- buildRow uses the same extraction as the migration ---
  const html = [
    "<!DOCTYPE html><html lang=\"ko\"><head><title>T</title>",
    "<style>body{color:#abc}</style></head>",
    "<body>",
    "<header><h1>제목</h1></header>",
    "<p><img src=\"assets/s1/hero.png\"></p>",
    "<footer>끝</footer>",
    "<script src=\"assets/nav.js\"><\/script>",
    "</body></html>"
  ].join("\n");
  const tmp = path.join(os.tmpdir(), "cbk-publish-test.html");
  fs.writeFileSync(tmp, html);

  const row = buildRow(html, parseArgs([tmp, "--slug", "s1", "--title", "제목", "--main", "M", "--cat", "C"]));
  ok("style extracted without its tag", row.style_css === "body{color:#abc}");
  ok("body keeps the header", /<header>/.test(row.body_html));
  ok("body keeps the footer", /<footer>/.test(row.body_html));
  ok("script chrome stripped", !/<script/i.test(row.body_html));
  ok("relative asset absolutised",
     row.body_html.includes("https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/s1/hero.png"));
  ok("body_md is null for pipeline output", row.body_md === null);
  ok("author carried", row.author === "ai");

  // --- the workers were actually rewired ---
  const runSh = fs.readFileSync(ROOT + "/.pipeline/run.sh", "utf8");
  const ytSh  = fs.readFileSync(ROOT + "/.pipeline/youtube_worker.sh", "utf8");
  /* 주의: 아래 세 단언의 "예전 버전"(!/posts\.js/ 과 /posts\/assets\//)은
   * 수정 전에도 통과한다 — run.sh 는 애초에 "posts.js" 라는 문자열을 쓰지 않고
   * ("POSTS array in posts/assets/nav.js" 라고 쓴다), "posts/assets/" 는 이미
   * 프롬프트 본문에 등장한다. 반증 가능한 형태로 쓴다. */
  ok("run.sh no longer tells the skill to register the post in the catalog",
     !/posts\/assets\/(posts|nav)\.js/.test(runSh));
  ok("youtube_worker.sh no longer tells the skill to register the post in the catalog",
     !/posts\.js|POSTS array/.test(ytSh));
  ok("run.sh no longer tells the skill to edit index.html", !/add the post to index\.html/i.test(runSh));
  ok("run.sh calls publish.mjs", /publish\.mjs/.test(runSh));
  ok("youtube_worker.sh calls publish.mjs", /publish\.mjs/.test(ytSh));
  ok("run.sh commits only the asset dir", /git add "posts\/assets\/\$slug"/.test(runSh));
  ok("youtube_worker.sh commits only the asset dir", /git add "posts\/assets\/\$slug"/.test(ytSh));
  ok("run.sh no longer pushes the post itself", !/posts\/\$\{?slug\}?\.html/.test(runSh.split("git add")[1] || ""));

  console.log("publish: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node publish.test.js
```

Expected: FAIL — `Cannot find module '.../scripts/publish.mjs'`

- [ ] **Step 3: Write `scripts/publish.mjs`**

```js
#!/usr/bin/env node
/* 생성된 포스트 HTML 파일 하나를 cbk_posts 에 올린다.
 *
 * 이게 "글이 사이트에 올라가는" 단 하나의 입구다. 번역 스킬도, 유튜브 워커도,
 * 사람이 손으로 만든 파일도 전부 여기를 지난다. 커밋은 하지 않는다 —
 * 미디어(posts/assets/<slug>/)만 워커가 따로 커밋한다.
 *
 *   node scripts/publish.mjs out.html --slug my-post --title "제목" --main "Claude blog" --cat "Agents"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPost, absolutizeAssets, PAGES_BASE } from "./migrate-posts.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function parseArgs(argv) {
  const out = { author: "ai", dry: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry") { out.dry = true; continue; }
    if (a.startsWith("--")) { out[a.slice(2)] = argv[++i]; continue; }
    rest.push(a);
  }
  out.file = rest[0];
  if (!out.file) throw new Error("usage: publish.mjs <html-file> --slug … --title … --main … --cat …");
  if (!out.slug || !/^[a-z0-9][a-z0-9-]{0,120}$/.test(out.slug)) {
    throw new Error("invalid or missing --slug (lowercase letters, digits, hyphen)");
  }
  if (!out.title || !out.title.trim()) throw new Error("--title is required");
  if (!out.main) out.main = "";
  if (!out.cat) out.cat = "";
  if (!out.nav) out.nav = out.title;
  if (!out.date) out.date = new Date().toISOString().slice(0, 10);
  if (out.author !== "me") out.author = "ai";
  return out;
}

/* extractPost 를 그대로 재사용한다 — 이관과 발행이 다른 방식으로 본문을
   뜯으면 같은 글이 두 경로에서 달라 보이게 된다. */
export function buildRow(html, opts) {
  const row = extractPost(html, {
    file: opts.slug + ".html",
    title: opts.title, nav: opts.nav, main: opts.main, cat: opts.cat, date: opts.date
  }, PAGES_BASE);
  row.author = opts.author;
  return row;
}

function cfg() {
  const src = fs.readFileSync(ROOT + "/posts/assets/cbk-config.js", "utf8");
  const url = (src.match(/supabaseUrl:\s*"([^"]*)"/) || [])[1];
  const key = (src.match(/supabaseAnonKey:\s*"([^"]*)"/) || [])[1];
  if (!url || !key) throw new Error("could not parse posts/assets/cbk-config.js");
  return { url: url.replace(/\/+$/, ""), key };
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

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const html = fs.readFileSync(opts.file, "utf8");
  const row = buildRow(html, opts);

  if (opts.dry) {
    console.error(JSON.stringify({ slug: row.slug, title: row.title, bytes: row.body_html.length }));
    console.log("PUBLISHED " + row.slug);
    return;
  }

  const key = process.env.CBK_SYNC_KEY;
  if (!key) throw new Error("CBK_SYNC_KEY is not set");
  await rpc("cbk_owner_claim", { p_key: key });
  await rpc("cbk_post_upsert", {
    p_key: key, p_slug: row.slug, p_title: row.title, p_nav: row.nav,
    p_main: row.main, p_cat: row.cat, p_date: row.date,
    p_body_html: row.body_html, p_body_md: row.body_md,
    p_style_css: row.style_css, p_author: row.author
  });
  console.log("PUBLISHED " + row.slug);
}

if (process.argv[1] && process.argv[1].endsWith("publish.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
```

Note `absolutizeAssets` is imported but only used transitively through `extractPost`; keep the import so the module's dependency on Task 2 is explicit, or drop it if the linter complains — either is fine, but do not re-implement it.

- [ ] **Step 4: Rewire `.pipeline/run.sh`**

**First, read `.pipeline/run.sh:47-72` as it actually is.** Three things there differ from `youtube_worker.sh` and will silently break the replacement block below if you do not fix them:

1. The call is `if claude -p "$prompt" --dangerously-skip-permissions; then` — **stdout is not captured to a file.** The whole script redirects to `$LOG` via `exec >>"$LOG"`, so there is no `$out_file` to grep.
2. `$title` is scraped from the *source* page with `curl` **after** the `claude -p` call, inside the success branch that this task deletes.
3. `$cat` does not exist at all.

So before touching the prompt, change the invocation to match `youtube_worker.sh:112`:

```bash
  out_file="$PIPE_DIR/log/translate-$slug.out"
  if claude -p "$prompt" --dangerously-skip-permissions >"$out_file" 2>&1; then
```

Now replace the prompt string at lines 51-55. The current text ends with instructions to add the post to `index.html`, to the `POSTS` array in `posts/assets/nav.js`, and to commit and push. Replace those sentences with:

```
IMPORTANT: do NOT edit index.html, do NOT edit posts/assets/posts.js or catalog.js, and do NOT commit the post file. Publishing happens through the database, not through git.
Write the generated post to /tmp/cbk-${slug}.html and put its downloaded media under posts/assets/${slug}/ in the repo.
When the file is written, print these as the very last lines of your final message, one per line, exactly:
RESULT_FILE=/tmp/cbk-${slug}.html
RESULT_TITLE=<the Korean post title, one line>
RESULT_CAT=<the sub-category, one line>
If you cannot complete the post, print as the very last line exactly: RESULT_ERROR=<one-line reason>
```

Then, after the `claude -p` call, replace the commit/push/verify block with:

```bash
  file="$(grep -o 'RESULT_FILE=[^ ]*' "$out_file" | tail -1 | cut -d= -f2)"
  title="$(grep -o 'RESULT_TITLE=.*' "$out_file" | tail -1 | cut -c14-213)"
  cat="$(grep -o 'RESULT_CAT=.*'   "$out_file" | tail -1 | cut -c12-113)"
  [ -z "$title" ] && title="$slug"
  [ -z "$cat" ] && cat="번역"
  if [ -z "$file" ] || [ ! -f "$file" ]; then
    err_line="$(grep -o 'RESULT_ERROR=.*' "$out_file" | tail -1 | cut -c14-213)"
    [ -z "$err_line" ] && err_line="no RESULT_FILE in output"
    echo "FAILED $slug: $err_line"
    notify "❌ 번역 실패%0A${slug}%0A${err_line}"
    continue
  fi

  # 미디어만 커밋한다 — 본문은 DB로 간다.
  if [ -d "posts/assets/$slug" ]; then
    git add "posts/assets/$slug"
    git diff --cached --quiet || git commit -q -m "assets: $slug 미디어 추가"
    git push -q origin main || echo "asset push failed (post still publishes)"
  fi

  if CBK_SYNC_KEY="$CBK_SYNC_KEY" node scripts/publish.mjs "$file" \
       --slug "$slug" --title "$title" --main "Claude blog" --cat "$cat" --author ai; then
    notify "✅ 번역 포스트 발행%0A${PAGES_BASE}/post.html?slug=${slug}"
  else
    notify "❌ 발행 실패%0A${slug}"
  fi
```

The `cut -c` offsets follow the same convention as `youtube_worker.sh:114` (`RESULT_ERROR=` is 13 characters, so `cut -c14-`). `RESULT_TITLE=` is also 13 characters; `RESULT_CAT=` is 11, hence `cut -c12-`.

Also delete the now-dead live-URL polling loop (`for _ in $(seq 1 30) ... curl "$PAGES_BASE/posts/${slug}.html"`) and the `curl`-based `$title` scrape it contained — the post no longer exists at that URL, so the loop would spend four minutes timing out on every run before reporting a false failure. `mark_seen.py` / `seen.json` handling stays exactly as it is.

`run.sh` also needs `CBK_SYNC_KEY` — it already sources `$PIPE_DIR/.env` at lines 20-23, which is where `youtube_worker.sh` reads the same variable from. Add it to `.pipeline/.env.example` in this task (it is not there today; the file currently lists only the two Telegram variables):

```
# 발행 RPC 소유자 키. 보관함 > 동기화 코드와 같은 값.
CBK_SYNC_KEY=
```

**Out of scope, on purpose — the skill bodies are not edited by this task.** `claude-blog-translate-ko` and `claude-youtube-to-blog` still instruct the agent to register the post in `posts/assets/posts.js` and to commit/push (`claude-blog-translate-ko/SKILL.md:106-111`, `claude-youtube-to-blog/SKILL.md:203-218`). Those files are **not in this repository** — they ship from the `woobin-harness` plugin and live under `~/.claude/plugins/cache/woobin-harness/<version>/skills/`, so any edit there is overwritten on the next plugin update. This task therefore relies on the prompt override ("do NOT edit index.html, do NOT edit posts/assets/posts.js or catalog.js, do NOT commit the post file"), which is the last instruction the agent reads and is stated in the imperative.

That is a real, accepted risk: after Task 4 deletes `posts/assets/posts.js`, an agent that follows the skill body over the prompt will try to edit a file that no longer exists and fail loudly rather than silently — which is the failure mode we want. **Report this to the user at the end of Layer D**; updating the two skills in the `woobin-harness` plugin repo is separate follow-up work, not part of this plan.

- [ ] **Step 5: Rewire `.pipeline/youtube_worker.sh`**

Apply the same three changes to `common_rules` at lines 99-105:

- Delete `Register the post in posts/assets/posts.js as the skill instructs, then commit and push to origin main.`
- Change the media commit to `git add "posts/assets/$slug"` (asset directory only, never the post file) so it matches `run.sh` and the test's assertion.
- Replace `RESULT_SLUG=<the post slug>` with `RESULT_FILE=<absolute path to the generated html>` plus `RESULT_SLUG=`, `RESULT_TITLE=` and `RESULT_CAT=` lines.
- Add the same "do NOT edit index.html / posts.js / catalog.js, do NOT commit the post" sentence.

Then replace the live-check block at lines 133-160. The 30-attempt `curl` poll against `$PAGES_BASE/posts/${slug}.html` existed because Pages deployment was the slow step; publishing is now a single RPC, so drop the poll entirely and treat a zero exit from `publish.mjs` as success. Keep the media commit exactly as in Step 4, and change the notification URL to `${PAGES_BASE}/post.html?slug=${slug}`.

- [ ] **Step 6: Run the test to verify it passes**

```bash
cd tests && node publish.test.js
```

Expected: the final line reads `publish: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 7: Smoke-test the CLI without touching the network**

```bash
printf '<!DOCTYPE html><html><head><style>body{color:#111}</style></head><body><header><h1>T</h1></header><p>hi</p></body></html>' > /tmp/cbk-smoke.html
node scripts/publish.mjs /tmp/cbk-smoke.html --slug smoke-test --title "스모크" --main "내 글" --cat "테스트" --dry
```

Expected: a JSON line on stderr and `PUBLISHED smoke-test` on stdout.

- [ ] **Step 8: Register the test and commit**

Add `publish.test.js` to `tests/package.json`'s `test` script and a `test:publish` entry.

```bash
git add scripts/publish.mjs .pipeline/run.sh .pipeline/youtube_worker.sh tests/publish.test.js tests/package.json
git commit -m "feat(pipeline): 번역·유튜브 파이프라인이 파일 커밋 대신 publish.mjs로 발행"
```
