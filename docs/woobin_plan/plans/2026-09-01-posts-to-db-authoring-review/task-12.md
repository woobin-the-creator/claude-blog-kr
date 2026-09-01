### Task 12: Nightly git snapshot and legacy-file cutover

**Files:**
- Create: `scripts/snapshot.mjs`
- Create: `.pipeline/com.cbk.snapshot.plist`
- Create: `tests/snapshot.test.js`
- Delete: all 79 `posts/*.html` (keep `posts/assets/` untouched)
- Modify: `README` section of `wiki/CLAUDE.md` is **not** touched; modify `.pipeline/youtube_worker.sh` (drop the polling loop), `tests/package.json`

**Interfaces:**
- Consumes: `cbk_posts_list()`, `cbk_post_get(p_slug)` from Task 1.
- Produces: `content/<slug>.md` — one file per post, YAML frontmatter plus body. Exports `toMarkdownFile(post)` and `fromMarkdownFile(text)` for the test; the pair must round-trip exactly, **with one documented exception**: `toMarkdownFile` writes a terminating newline after `body_html`, and `fromMarkdownFile` strips exactly one (`.replace(/\n$/, "")`). A `body_html` that genuinely ends in `\n` therefore loses that one character. No row in the current data does, and the snapshot is an archive rather than the render source, so this is accepted — but do not describe the pair as byte-exact, and do not "fix" it by stripping more than one newline.

**Background the implementer needs:**

This is the task that makes moving content out of git safe. Git stops being the publishing path but becomes the **change-history store** — which is what the user asked GitHub to be. Every night the snapshot pulls every post out of the DB, writes it to `content/`, and commits only if something changed. Three things fall out of that:

- The archive survives losing the Supabase project or account.
- Agents can still `grep` the corpus as files, which the translation and wiki skills rely on.
- Post edits get a real diff history, which the DB alone does not give.

**Ordering matters and it is the reason this task is last.** The 79 legacy `posts/*.html` files must not be deleted until (a) Task 5's renderer serves them from the DB, and (b) this task's snapshot has actually written them into `content/` at least once. Delete first and a failed migration means an archive that exists nowhere.

`posts/assets/` stays. Those 79 MB are the media the post bodies link to by absolute URL (Task 2), served by Pages. Deleting them breaks every image in the archive.

The last polling loop lives in `.pipeline/youtube_worker.sh` — the `while [ "$processed" -lt "$MAX_PER_RUN" ]` block that calls `cbk_yt_claim`. Task 9's listener now subscribes to `cbk_yt_queue`, so the worker becomes a plain "process one URL" function the listener invokes, and its launchd timer goes away.

- [ ] **Step 1: Write the failing test**

Create `tests/snapshot.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }

(async () => {
  const { toMarkdownFile, fromMarkdownFile } = await import(ROOT + "/scripts/snapshot.mjs");

  const post = {
    slug: "my-first", title: "제목: 콜론 포함", nav: "짧은 제목", main: "내 글",
    cat: "에세이", date: "2026-09-01", author: "me", rev: 3,
    body_html: "<h2>안녕</h2>\n<p>본문 --- 대시 포함</p>",
    body_md: "## 안녕\n\n본문 --- 대시 포함",
    style_css: "body{color:#111}"
  };

  const text = toMarkdownFile(post);
  ok("starts with frontmatter", text.startsWith("---\n"));
  ok("slug in frontmatter", /^slug: my-first$/m.test(text));
  ok("title with a colon is quoted", /^title: ".*"$/m.test(text));
  ok("rev recorded", /^rev: 3$/m.test(text));
  ok("body follows the frontmatter", text.includes("## 안녕"));

  const back = fromMarkdownFile(text);
  ok("round-trip slug", back.slug === post.slug);
  ok("round-trip title", back.title === post.title);
  ok("round-trip date", back.date === post.date);
  ok("round-trip author", back.author === post.author);
  ok("round-trip rev", back.rev === 3);
  ok("round-trip body_md", back.body_md === post.body_md);
  ok("round-trip style_css", back.style_css === post.style_css);
  ok("round-trip body_html", back.body_html === post.body_html);

  // a migrated translation has no markdown source
  const translated = Object.assign({}, post, { body_md: null, author: "ai" });
  const t2 = fromMarkdownFile(toMarkdownFile(translated));
  ok("null body_md round-trips as null", t2.body_md === null);
  ok("html body still round-trips without markdown", t2.body_html === translated.body_html);

  // a body containing a --- line must not break the frontmatter split
  const dashed = Object.assign({}, post, { body_md: "앞\n\n---\n\n뒤" });
  ok("a --- line in the body survives", fromMarkdownFile(toMarkdownFile(dashed)).body_md === "앞\n\n---\n\n뒤");

  // --- cutover assertions ---
  const legacy = fs.readdirSync(ROOT + "/posts").filter(f => f.endsWith(".html"));
  ok("legacy post html files are gone", legacy.length === 0);
  ok("posts/assets survived", fs.existsSync(ROOT + "/posts/assets/cbk.css"));
  ok("media directories survived", fs.readdirSync(ROOT + "/posts/assets").length > 50);

  const yt = fs.readFileSync(ROOT + "/.pipeline/youtube_worker.sh", "utf8");
  ok("the claim polling loop is gone", !/while \[ "\$processed" -lt "\$MAX_PER_RUN" \]/.test(yt));
  ok("cbk_yt_claim is no longer polled in a loop", (yt.match(/cbk_yt_claim/g) || []).length <= 1);
  const lst = fs.readFileSync(ROOT + "/.pipeline/listener.mjs", "utf8");
  ok("the listener claims queue rows instead of spawning blind", /cbk_yt_claim/.test(lst));
  ok("the queue has a catch-up path", /kickQueue|drainQueue/.test(lst));

  console.log("snapshot: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node snapshot.test.js
```

Expected: FAIL — `Cannot find module '.../scripts/snapshot.mjs'`

- [ ] **Step 3: Write the snapshot script**

Create `scripts/snapshot.mjs`:

```js
#!/usr/bin/env node
/* 야간 스냅샷: DB의 글을 전부 content/*.md 로 떨구고, 바뀐 게 있으면 커밋한다.
 *
 * 발행 경로에서 git 을 뺀 대가를 여기서 되찾는다 —
 *   · Supabase 계정을 잃어도 아카이브가 남는다
 *   · 에이전트가 여전히 파일로 grep 할 수 있다
 *   · 글 수정에 진짜 diff 이력이 생긴다
 * 즉 GitHub 은 발행 수단이 아니라 "변경이력 저장소" 로 남는다.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "content");

/* 본문에 --- 줄이 있어도 frontmatter 파싱이 깨지지 않도록,
   구분자를 고유 문자열로 쓰고 본문은 통째로 뒤에 붙인다. */
const FM_END = "---8<--- body ---8<---";

function q(s) {
  return JSON.stringify(String(s == null ? "" : s));
}

export function toMarkdownFile(p) {
  const fm = [
    "---",
    "slug: " + p.slug,
    "title: " + q(p.title),
    "nav: " + q(p.nav || ""),
    "main: " + q(p.main || ""),
    "cat: " + q(p.cat || ""),
    "date: " + String(p.date).slice(0, 10),
    "author: " + (p.author || "ai"),
    "rev: " + (p.rev || 1),
    "has_markdown: " + (p.body_md == null ? "false" : "true"),
    "style_css: " + q(p.style_css || ""),
    "---",
    ""
  ].join("\n");

  const body = p.body_md == null ? "" : p.body_md;
  return fm + body + "\n" + FM_END + "\n" + (p.body_html || "") + "\n";
}

export function fromMarkdownFile(text) {
  const lines = text.split("\n");
  if (lines[0] !== "---") throw new Error("missing frontmatter");
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("unterminated frontmatter");

  const meta = {};
  for (let i = 1; i < end; i++) {
    const at = lines[i].indexOf(":");
    if (at === -1) continue;
    const k = lines[i].slice(0, at).trim();
    const raw = lines[i].slice(at + 1).trim();
    meta[k] = raw.startsWith('"') ? JSON.parse(raw) : raw;
  }

  // end 는 닫는 --- 줄. 그 다음 줄이 곧 본문 첫 줄이다(빈 줄을 넣지 않는다).
  const rest = lines.slice(end + 1).join("\n");
  const split = rest.indexOf("\n" + FM_END + "\n");
  if (split === -1) throw new Error("missing body separator");

  const md = rest.slice(0, split);
  const html = rest.slice(split + FM_END.length + 2).replace(/\n$/, "");

  return {
    slug: meta.slug,
    title: meta.title,
    nav: meta.nav,
    main: meta.main,
    cat: meta.cat,
    date: meta.date,
    author: meta.author,
    rev: Number(meta.rev),
    style_css: meta.style_css,
    body_md: meta.has_markdown === "true" ? md : null,
    body_html: html
  };
}

/* ---- CLI ---- */
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
  return r.json();
}

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

async function main() {
  const commit = process.argv.includes("--commit");
  const list = await rpc("cbk_posts_list", {});
  if (!list || !list.length) throw new Error("cbk_posts_list returned nothing — refusing to snapshot an empty DB");

  fs.mkdirSync(OUT, { recursive: true });
  const keep = new Set();

  for (const meta of list) {
    const rows = await rpc("cbk_post_get", { p_slug: meta.slug });
    const p = rows && rows[0];
    if (!p) continue;
    const file = path.join(OUT, p.slug + ".md");
    const next = toMarkdownFile(p);
    const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    if (prev !== next) fs.writeFileSync(file, next);
    keep.add(p.slug + ".md");
  }

  // DB에서 지워진 글은 스냅샷에서도 뺀다(이력은 git 에 남는다).
  for (const f of fs.readdirSync(OUT)) {
    if (f.endsWith(".md") && !keep.has(f)) fs.unlinkSync(path.join(OUT, f));
  }

  console.error("snapshot: " + list.length + " posts");

  if (!commit) return;
  git("add", "content");
  const staged = git("diff", "--cached", "--name-only").trim();
  if (!staged) { console.error("no changes"); return; }
  git("commit", "-m", "snapshot: 포스트 " + list.length + "건 (" + new Date().toISOString().slice(0, 10) + ")");
  git("push", "origin", "main");
  console.error("committed and pushed");
}

if (process.argv[1] && process.argv[1].endsWith("snapshot.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
```

The `refusing to snapshot an empty DB` guard matters: without it, a transient RPC failure would delete every file in `content/` and commit that deletion.

- [ ] **Step 4: Run the snapshot for real, before deleting anything**

```bash
node scripts/snapshot.mjs
ls content/*.md | wc -l        # expect 79 (plus any post written since)
head -14 content/artifacts-in-claude-code.md
```

`wc -l` alone is **not** a sufficient check — 79 files with empty bodies would pass it, and Step 6 deletes the only other copy. Verify the contents too:

```bash
# 1) 모든 스냅샷이 실질적인 본문을 담고 있는지 (빈 파일 0건이어야 한다)
node -e '
const fs=require("fs"),path=require("path");
(async () => {
  const {fromMarkdownFile}=await import("./scripts/snapshot.mjs");
  const files=fs.readdirSync("content").filter(f=>f.endsWith(".md"));
  let bad=[];
  for (const f of files) {
    const p=fromMarkdownFile(fs.readFileSync(path.join("content",f),"utf8"));
    if (!p.slug || !p.title || (p.body_html||"").length < 200) bad.push(f);
  }
  console.log("files:",files.length,"suspect:",bad.length,bad.slice(0,5));
  process.exit(bad.length?1:0);
})();'

# 2) 79개 레거시 파일의 슬러그가 하나도 빠짐없이 스냅샷에 있는지
for f in posts/*.html; do
  s=$(basename "$f" .html)
  [ -f "content/$s.md" ] || echo "MISSING SNAPSHOT: $s"
done | tee /tmp/cbk-missing.txt
wc -l < /tmp/cbk-missing.txt      # expect 0
```

Expected: `suspect: 0`, and an empty missing list. **Do not proceed to Step 5 until all three checks pass** — this is the only copy of the archive outside Supabase.

- [ ] **Step 5: Commit the first snapshot on its own**

```bash
git add content scripts/snapshot.mjs
git commit -m "feat(snapshot): DB 스냅샷을 content/ 로 떨구고 첫 스냅샷 커밋"
```

A separate commit means the archive lands in history before the deletion commit, so `git revert` on the deletion is enough to recover.

> ### STOP AND ASK — 79개 삭제 직전, 사람 승인
>
> **여기가 이 플랜에서 되돌리기 가장 비싼 지점이다. 구현 에이전트는 Step 6 을 실행하기 전에 멈추고 오케스트레이터에게 아래를 그대로 보고한다:**
>
> 1. Step 5 스냅샷 커밋의 해시와 `git show --stat <hash> | tail -3` 출력
> 2. Step 4 검증 결과 — `files: N suspect: 0`, 그리고 missing 목록이 비어 있음
> 3. 배포된 사이트에서 실제로 확인한 글 3건의 URL (`post.html?slug=…` 로 본문이 보이는지)
>
> 사람이 "지워도 된다" 고 답하기 전에는 `git rm posts/*.html` 을 실행하지 않는다. 승인 없이 진행했다면 되돌리는 방법은 삭제 커밋을 `git revert` 하는 것뿐이고, 그 사이 Pages 에는 79개 글이 사라진 채로 배포된다.

- [ ] **Step 6: Delete the legacy post files** *(사람 승인 후에만)*

```bash
git rm posts/*.html
# Task 4 가 로드만 끊어두고 남겨둔 옛 카탈로그. 이관 스크립트가 이 파일을
# 카탈로그 소스로 읽기 때문에 그때는 지울 수 없었다. 이관이 끝난 지금 지운다.
git rm posts/assets/posts.js
ls posts/assets | wc -l          # expect the same count as before this task — assets are untouched
git status --porcelain | grep -c '^D  posts/assets'   # expect 0
```

- [ ] **Step 7: Drop the last polling loop**

In `.pipeline/youtube_worker.sh`, replace the `while [ "$processed" -lt "$MAX_PER_RUN" ]` loop with a single-pass function that takes one queue row id and URL as arguments. Keep everything inside the loop body — the `kind` detection, the two prompts, the `publish.mjs` call from Task 8, the `cbk_yt_finish` reporting, and the Telegram notification. Only the loop, `MAX_PER_RUN`, the `cbk_yt_claim` call, and the `processed` counter go away; the listener now claims the row and passes it in.

In `.pipeline/listener.mjs` (Task 9), add the second subscription next to the `cbk-posts` channel:

```js
  /* 큐 행은 반드시 cbk_yt_claim 으로 집어야 한다.
   * 바로 spawn 하면 행이 pending 으로 남아 재연결·재시작마다 다시 처리된다. */
  async function drainQueue() {
    for (;;) {
      const rows = await realRpc("cbk_yt_claim", { p_key: process.env.CBK_SYNC_KEY });
      const row = (rows || [])[0];
      if (!row) return;                       // 더 집을 게 없다
      log("queue claim: " + row.id + " " + row.url);
      await new Promise(res => {
        const c = nodeSpawn("bash",
          [path.join(ROOT, ".pipeline/youtube_worker.sh"), String(row.id), row.url],
          { cwd: ROOT, stdio: ["ignore", "inherit", "inherit"] });
        c.on("close", res);
        c.on("error", e => { log("queue worker failed: " + e.message); res(); });
      });
    }
  }

  let queueBusy = false;
  function kickQueue() {
    if (queueBusy) return;                    // 한 번에 하나 (리뷰와 같은 규칙)
    queueBusy = true;
    drainQueue()
      .catch(e => log("queue drain failed: " + e.message))
      .finally(() => { queueBusy = false; });
  }

  sb.channel("cbk-queue")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "cbk_yt_queue" },
        () => kickQueue())
    .subscribe(status => {
      log("realtime(queue): " + status);
      if (status === "SUBSCRIBED") kickQueue();   // 재연결 시 놓친 행을 쓸어담는다
    });
```

`drainQueue()` doubles as the queue's catch-up sweep: it loops until `cbk_yt_claim` returns nothing, so rows submitted while the Mac was asleep are picked up on the next `SUBSCRIBED`. Call `kickQueue()` once from `main()` alongside the existing `L.catchUp()` for the cold-start case. **This is the whole reason `cbk_yt_queue` survives** — see the "Deviation from the spec" section of `00-overview.md`. A version of this that spawns without claiming would make that justification false and reprocess every row on every restart.

Then remove the worker's launchd timer plist from `~/Library/LaunchAgents` (a human step — note it in the commit body; the repo does not track that file).

- [ ] **Step 8: Install the nightly snapshot job**

Create `.pipeline/com.cbk.snapshot.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.cbk.snapshot</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>cd "$HOME/claude-blog-kr" &amp;&amp; git pull --rebase --quiet; node scripts/snapshot.mjs --commit</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>4</integer><key>Minute</key><integer>30</integer></dict>
  <key>StandardOutPath</key><string>/tmp/cbk-snapshot.log</string>
  <key>StandardErrorPath</key><string>/tmp/cbk-snapshot.err</string>
</dict>
</plist>
```

- [ ] **Step 9: Run the test to verify it passes**

```bash
cd tests && node snapshot.test.js
```

Expected: the final line reads `snapshot: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 10: Run the whole suite and check the live site**

```bash
cd tests && npm test
```

Expected: every test passes.

Then, after pushing, confirm by hand that all three URL shapes still work on the live site:

- `https://woobin-the-creator.github.io/claude-blog-kr/` — index lists every post
- `https://woobin-the-creator.github.io/claude-blog-kr/post.html?slug=artifacts-in-claude-code` — renders
- `https://woobin-the-creator.github.io/claude-blog-kr/posts/artifacts-in-claude-code.html` — the deleted legacy URL falls through `404.html` and still renders, with images intact

The third one is the check that matters most; it is the only proof that existing bookmarks and `wiki/sources/*.md` links did not break.

- [ ] **Step 11: Register the test and commit**

Add `snapshot.test.js` to `tests/package.json`'s `test` script and a `test:snapshot` entry.

```bash
git add -A posts .pipeline/youtube_worker.sh .pipeline/listener.mjs .pipeline/com.cbk.snapshot.plist tests/snapshot.test.js tests/package.json
git commit -m "chore(cutover): 레거시 포스트 파일 제거, 마지막 폴링 루프 은퇴, 야간 스냅샷 가동"
```
