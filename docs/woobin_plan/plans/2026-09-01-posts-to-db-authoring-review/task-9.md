### Task 9: Resident Realtime listener

**Files:**
- Create: `.pipeline/listener.mjs`
- Create: `.pipeline/package.json`
- Create: `.pipeline/com.cbk.listener.plist`
- Create: `supabase/realtime-posts.sql`
- Create: `tests/listener.test.js`
- Modify: `.pipeline/.env.example`, `tests/package.json`

**Interfaces:**
- Consumes: `cbk_review_claim(p_key, p_slug)`, `cbk_review_finish(p_key, p_slug, p_status, p_error)`, `cbk_review_pending(p_key)` from Task 1.
- Produces — exported for the test and for Task 10:
  - `makeListener({ rpc, spawn, log })` -> `{ onPostEvent(row), catchUp(), inFlight() }`. All I/O is injected so the logic is testable without a database or a subprocess. **`spawn(slug)` resolves to `{ code, out }`** — `out` is the child's captured stdout, which the listener scans for Task 10's `REVIEW_ERROR` marker. It rejects only when the process could not be run at all.
  - `reviewCommand(slug)` -> `{ cmd, args }`, built from `process.env.CBK_REVIEW_CMD` (default `claude -p`).

**Background the implementer needs:**

This replaces every polling loop in the project. `youtube_worker.sh` is currently invoked by launchd on a timer and calls `cbk_yt_claim` in a loop; after this task the listener holds an open Realtime connection and reacts within a second of a row changing.

Three facts drive the design:

1. **Realtime events are not durable.** If the Mac is asleep or the process is down when a row is written, that event is gone forever. This is why `cbk_posts.review_status` exists as a column and why `cbk_review_pending` exists as an RPC — on every startup, and on every reconnect, the listener sweeps for work it missed. Without the sweep, a post written from a phone while the Mac was closed would never get reviewed.
2. **Realtime authorises through RLS.** `cbk_posts` has RLS on with no policies, so the `anon` key receives no change events at all. The listener therefore connects with the **service role key**, which bypasses RLS. That key must live only in `.pipeline/.env`, which `.gitignore` already covers (see `.gitignore:4`). It must never appear in `posts/assets/cbk-config.js` or any other tracked file.
3. **One review at a time — really one, globally.** `claude -p` is expensive and the machine is a laptop. Two separate guards are needed and it is easy to ship only the first: a `Set` of slugs so the same post is never reviewed twice concurrently, **and** a serial queue so at most one agent runs at all. Without the second guard, the first `catchUp()` after Task 2's migration would spawn one `claude -p` per pending post — up to 79 at once — and take the machine down. `maxConcurrent` is 1 and the test asserts it.

4. **Exit code 0 does not mean the review succeeded.** Task 10's agent contract ends with either `REVIEW_DONE <slug> <n>` or `REVIEW_ERROR <reason>` as the last line, and `claude -p` exits 0 in both cases. The listener must read the child's stdout and honour that line; if it only checks the exit code, a failed review is filed as `done` and never retried.

`cbk_review_claim` is the concurrency guard on the database side — it only transitions `pending` -> `running`, and returns nothing for a post already being handled. Always claim before spawning, and treat "claim returned nothing" as "someone else has it, skip".

- [ ] **Step 1: Write the failing test**

Create `tests/listener.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const { makeListener, reviewCommand } = await import(ROOT + "/.pipeline/listener.mjs");

  // --- reviewCommand ---
  delete process.env.CBK_REVIEW_CMD;
  const def = reviewCommand("my-post");
  ok("default command is claude", def.cmd === "claude");
  ok("default args carry -p", def.args.includes("-p"));
  ok("the prompt names the slug", def.args.join(" ").includes("my-post"));

  process.env.CBK_REVIEW_CMD = "hermes run --headless";
  const custom = reviewCommand("my-post");
  ok("CBK_REVIEW_CMD overrides the binary", custom.cmd === "hermes");
  ok("CBK_REVIEW_CMD keeps its own flags", custom.args.slice(0, 3).join(" ") === "run --headless");
  delete process.env.CBK_REVIEW_CMD;

  // --- harness ---
  function harness(opts) {
    opts = opts || {};
    const calls = [];
    const spawned = [];
    let resolveSpawn = [];
    const rpc = async (fn, body) => {
      calls.push({ fn, body });
      if (fn === "cbk_review_claim") {
        return (opts.claimable === false) ? [] : [{ slug: body.p_slug, rev: 1 }];
      }
      if (fn === "cbk_review_pending") return opts.pending || [];
      return null;
    };
    const spawn = (slug) => {
      spawned.push(slug);
      return new Promise((res, rej) => resolveSpawn.push({ slug, res, rej }));
    };
    const L = makeListener({ rpc, spawn, log: () => {} });
    return { L, calls, spawned, resolveSpawn };
  }

  // --- a pending row claims then spawns ---
  let h = harness();
  h.L.onPostEvent({ slug: "a", review_status: "pending", rev: 1 });
  await sleep(10);
  ok("claim happened before the spawn", h.calls[0].fn === "cbk_review_claim");
  ok("agent spawned for the slug", h.spawned[0] === "a");
  ok("slug is reported in flight", h.L.inFlight().includes("a"));

  h.resolveSpawn[0].res({ code: 0, out: "REVIEW_DONE a 3\n" });
  await sleep(10);
  const fin = h.calls.find(c => c.fn === "cbk_review_finish");
  ok("finish called after a clean exit", !!fin && fin.body.p_status === "done");
  ok("slug left the in-flight set", !h.L.inFlight().includes("a"));

  // --- exit 0 + REVIEW_ERROR is a failure, not a success ---
  h = harness();
  h.L.onPostEvent({ slug: "a2", review_status: "pending", rev: 1 });
  await sleep(10);
  h.resolveSpawn[0].res({ code: 0, out: "…\nREVIEW_ERROR 본문을 읽지 못했습니다\n" });
  await sleep(10);
  const soft = h.calls.find(c => c.fn === "cbk_review_finish");
  ok("REVIEW_ERROR on a zero exit is recorded as error", !!soft && soft.body.p_status === "error");
  ok("REVIEW_ERROR reason is carried", /본문을 읽지 못했습니다/.test(soft.body.p_error || ""));

  // --- a failing agent records the error rather than hanging ---
  h = harness();
  h.L.onPostEvent({ slug: "b", review_status: "pending", rev: 1 });
  await sleep(10);
  h.resolveSpawn[0].rej(new Error("boom"));
  await sleep(10);
  const err = h.calls.find(c => c.fn === "cbk_review_finish");
  ok("finish called with error status", !!err && err.body.p_status === "error");
  ok("error text recorded", /boom/.test(err.body.p_error || ""));
  ok("slug released after failure", !h.L.inFlight().includes("b"));

  // --- rows that are not pending are ignored ---
  h = harness();
  h.L.onPostEvent({ slug: "c", review_status: "done", rev: 1 });
  h.L.onPostEvent({ slug: "d", review_status: "running", rev: 1 });
  await sleep(10);
  ok("a done row does not spawn", h.spawned.length === 0);
  ok("a running row does not spawn", !h.spawned.includes("d"));

  // --- an unclaimable row does not spawn ---
  h = harness({ claimable: false });
  h.L.onPostEvent({ slug: "e", review_status: "pending", rev: 1 });
  await sleep(10);
  ok("a row claimed by someone else does not spawn", h.spawned.length === 0);

  // --- the same slug is never spawned twice concurrently ---
  h = harness();
  h.L.onPostEvent({ slug: "f", review_status: "pending", rev: 1 });
  await sleep(5);
  h.L.onPostEvent({ slug: "f", review_status: "pending", rev: 2 });
  await sleep(10);
  ok("duplicate event for an in-flight slug is dropped", h.spawned.filter(s => s === "f").length === 1);

  // --- catch-up sweeps what Realtime missed, one at a time ---
  h = harness({ pending: [{ slug: "g", review_status: "pending", rev: 1 }, { slug: "h", review_status: "pending", rev: 1 }] });
  await h.L.catchUp();
  await sleep(10);
  ok("catch-up asked for the pending set", !!h.calls.find(c => c.fn === "cbk_review_pending"));
  ok("catch-up runs one agent at a time", h.spawned.length === 1 && h.spawned[0] === "g");
  h.resolveSpawn[0].res({ code: 0, out: "REVIEW_DONE g 0\n" });
  await sleep(10);
  ok("the next queued post starts once the first finishes", h.spawned.join(",") === "g,h");
  h.resolveSpawn[1].res({ code: 0, out: "REVIEW_DONE h 0\n" });
  await sleep(10);
  ok("the queue drains", h.L.inFlight().length === 0);

  // --- a crashing agent does not wedge the queue ---
  h = harness({ pending: [{ slug: "i", review_status: "pending", rev: 1 }, { slug: "j", review_status: "pending", rev: 1 }] });
  await h.L.catchUp();
  await sleep(10);
  h.resolveSpawn[0].rej(new Error("kaboom"));
  await sleep(10);
  ok("the queue keeps moving after a failure", h.spawned.join(",") === "i,j");

  console.log("listener: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node listener.test.js
```

Expected: FAIL — `Cannot find module '.../.pipeline/listener.mjs'`

- [ ] **Step 3: Add the Realtime publication SQL**

Create `supabase/realtime-posts.sql`:

```sql
-- Realtime 이 cbk_posts 변경을 흘려보내도록 publication 에 넣는다.
-- 리스너(.pipeline/listener.mjs)는 service_role 키로 붙는다 — cbk_posts 는
-- RLS 가 켜져 있고 정책이 없어서 anon 으로는 이벤트가 하나도 안 온다.
-- service_role 키는 .pipeline/.env(gitignore됨)에만 둔다.

alter publication supabase_realtime add table public.cbk_posts;

-- 링크 요청 큐도 같은 리스너가 받는다(폴링 워커를 없애기 위해).
alter publication supabase_realtime add table public.cbk_yt_queue;
```

If either table is already in the publication Supabase raises `relation is already member of publication`; that is safe to ignore when running by hand.

- [ ] **Step 4: Write the listener**

Create `.pipeline/package.json`:

```json
{
  "name": "cbk-pipeline",
  "private": true,
  "type": "module",
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0"
  }
}
```

Create `.pipeline/listener.mjs`:

```js
#!/usr/bin/env node
/* 상주 리스너. 폴링을 대체한다.
 *
 * cbk_posts 에 글이 새로 들어오거나 본문이 바뀌면 review_status 가 'pending' 이
 * 되고, 그 변경이 Realtime 으로 여기 도착한다. 그러면 헤드리스 에이전트를
 * 띄워 첨삭시킨다.
 *
 * Realtime 이벤트는 내구성이 없다 — 맥이 자고 있으면 그냥 사라진다. 그래서
 * 시작할 때와 재연결할 때마다 cbk_review_pending 으로 놓친 것을 쓸어 담는다.
 * 이게 큐 테이블 없이도 일이 새지 않게 하는 장치다.
 */
import { spawn as nodeSpawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

/* CBK_REVIEW_CMD 로 에이전트를 갈아끼운다. 기본은 Claude Code 구독으로 도는 claude -p. */
export function reviewCommand(slug) {
  const raw = (process.env.CBK_REVIEW_CMD || "claude -p").trim();
  const parts = raw.split(/\s+/);
  const cmd = parts[0];
  const flags = parts.slice(1);
  const prompt =
    "Read " + path.join(ROOT, ".pipeline/review-prompt.md") +
    " and follow it exactly to proofread the post with slug " + slug + ". " +
    "Work fully autonomously in this single turn; do not ask questions and do not start background tasks.";
  return { cmd, args: flags.concat([prompt]) };
}

/* 순수 로직. rpc/spawn/log 를 주입받아 DB나 자식 프로세스 없이 테스트한다. */
export function makeListener({ rpc, spawn, log }) {
  const running = new Set();   // 큐에 있거나 실행 중인 슬러그 (중복 방지용)
  const queue = [];            // 대기 중인 슬러그
  let active = false;          // 동시 실행 상한 1

  /* 큐에 넣기만 한다. 실제 실행은 drain() 이 하나씩 한다.
   * 이관 직후 catchUp() 이 pending 79건을 쓸어올 수 있는데,
   * 여기서 바로 spawn 하면 claude -p 가 79개 뜬다. */
  function handle(slug) {
    if (running.has(slug)) return;             // 같은 글에 두 번 붙지 않는다
    running.add(slug);
    queue.push(slug);
    drain();
  }

  async function drain() {
    if (active) return;
    const slug = queue.shift();
    if (!slug) return;
    active = true;
    try {
      await run(slug);
    } finally {
      active = false;
      running.delete(slug);
      if (queue.length) drain();
    }
  }

  async function run(slug) {
    try {
      const claimed = await rpc("cbk_review_claim", { p_key: key(), p_slug: slug });
      if (!claimed || claimed.length === 0) return;   // 남이 이미 집어갔다
      log("review start: " + slug);

      const r = (await spawn(slug)) || {};
      /* claude -p 는 에이전트가 실패해도 0 으로 끝난다.
       * 성패의 근거는 Task 10 이 정한 마지막 줄이다. */
      const out = String(r.out || "");
      const bad = /^REVIEW_ERROR\b.*/m.exec(out);
      if (bad) throw new Error(bad[0].replace(/^REVIEW_ERROR\s*/, "") || "REVIEW_ERROR");

      await rpc("cbk_review_finish", { p_key: key(), p_slug: slug, p_status: "done", p_error: null });
      log("review done: " + slug);
    } catch (e) {
      log("review failed: " + slug + " — " + e.message);
      try {
        await rpc("cbk_review_finish", {
          p_key: key(), p_slug: slug, p_status: "error", p_error: String(e.message).slice(0, 500)
        });
      } catch (e2) { log("finish(error) rpc failed: " + e2.message); }
    }
  }

  function onPostEvent(row) {
    if (!row || !row.slug) return;
    if (row.review_status !== "pending") return;
    handle(row.slug);
  }

  async function catchUp() {
    const rows = await rpc("cbk_review_pending", { p_key: key() });
    for (const r of rows || []) handle(r.slug);
  }

  return { onPostEvent, catchUp, inFlight: () => Array.from(running) };
}

function key() { return process.env.CBK_SYNC_KEY || ""; }

/* ---- wiring (테스트에서는 실행되지 않는다) ---- */
function cfg() {
  const src = fs.readFileSync(ROOT + "/posts/assets/cbk-config.js", "utf8");
  const url = (src.match(/supabaseUrl:\s*"([^"]*)"/) || [])[1];
  const anon = (src.match(/supabaseAnonKey:\s*"([^"]*)"/) || [])[1];
  return { url: url.replace(/\/+$/, ""), anon };
}

async function realRpc(fn, body) {
  const c = cfg();
  const r = await fetch(c.url + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: { apikey: c.anon, Authorization: "Bearer " + c.anon, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error("RPC " + fn + " " + r.status + ": " + (await r.text()));
  return r.status === 204 ? null : r.json();
}

function realSpawn(slug) {
  const { cmd, args } = reviewCommand(slug);
  return new Promise((res, rej) => {
    /* stdout 은 파이프로 받아야 한다 — Task 10 의 REVIEW_DONE / REVIEW_ERROR
     * 마지막 줄이 성패의 유일한 근거다. stderr 는 그대로 로그로 흘린다. */
    const p = nodeSpawn(cmd, args, { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"] });
    let out = "";
    p.stdout.setEncoding("utf8");
    p.stdout.on("data", d => { out += d; if (out.length > 200000) out = out.slice(-200000); });
    p.on("error", rej);
    p.on("close", code => code === 0
      ? res({ code, out })
      : rej(new Error(cmd + " exited " + code + (out ? " — " + out.slice(-300) : ""))));
  });
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const c = cfg();
  const service = process.env.SUPABASE_SERVICE_KEY;
  if (!service) { console.error("SUPABASE_SERVICE_KEY missing in .pipeline/.env"); process.exit(1); }
  if (!process.env.CBK_SYNC_KEY) { console.error("CBK_SYNC_KEY missing in .pipeline/.env"); process.exit(1); }

  const log = m => console.log(new Date().toISOString() + " " + m);
  const L = makeListener({ rpc: realRpc, spawn: realSpawn, log });

  const sb = createClient(c.url, service, { auth: { persistSession: false } });

  sb.channel("cbk-posts")
    .on("postgres_changes", { event: "*", schema: "public", table: "cbk_posts" },
        p => L.onPostEvent(p.new))
    .subscribe(status => {
      log("realtime: " + status);
      // 재연결마다 쓸어담는다 — 끊겨 있던 동안의 이벤트는 복구되지 않는다.
      if (status === "SUBSCRIBED") L.catchUp().catch(e => log("catchUp failed: " + e.message));
    });

  await L.catchUp().catch(e => log("initial catchUp failed: " + e.message));
  log("listening");
}

if (process.argv[1] && process.argv[1].endsWith("listener.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd tests && node listener.test.js
```

Expected: the final line reads `listener: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 6: Install the dependency and the launchd job**

```bash
cd .pipeline && npm install
```

Create `.pipeline/com.cbk.listener.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.cbk.listener</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>cd "$HOME/claude-blog-kr" &amp;&amp; set -a &amp;&amp; . .pipeline/.env &amp;&amp; set +a &amp;&amp; exec node .pipeline/listener.mjs</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/cbk-listener.log</string>
  <key>StandardErrorPath</key><string>/tmp/cbk-listener.err</string>
</dict>
</plist>
```

`KeepAlive` is what makes this resident: launchd restarts the process if it dies or if the machine wakes with a dropped socket, and `catchUp()` runs on every reconnect, so nothing queued during the outage is lost.

- [ ] **Step 7: Document the new secret**

Append to `.pipeline/.env.example`:

```
# 브라우저 동기화 코드. cbk_posts / cbk_reviews RPC 를 호출할 때 쓴다.
CBK_SYNC_KEY=
# Supabase service_role 키. Realtime 은 RLS 를 통과해야 이벤트를 주는데
# cbk_posts 는 정책이 없어서 anon 으로는 아무것도 안 온다.
# 이 파일(.pipeline/.env)은 .gitignore 에 있다 — 절대 커밋하지 말 것.
SUPABASE_SERVICE_KEY=
# 첨삭 에이전트. 기본값은 claude -p (Claude Code 구독으로 과금).
# 예: CBK_REVIEW_CMD="hermes run --headless"
CBK_REVIEW_CMD=
```

- [ ] **Step 8: Verify the service key is not tracked**

```bash
git check-ignore -v .pipeline/.env
git status --porcelain | grep -c 'pipeline/.env$'   # expect 0
```

Expected: the first command prints the ignoring rule; the second prints `0`.

- [ ] **Step 9: Register the test and commit**

Add `listener.test.js` to `tests/package.json`'s `test` script and a `test:listener` entry.

```bash
git add .pipeline/listener.mjs .pipeline/package.json .pipeline/package-lock.json .pipeline/com.cbk.listener.plist .pipeline/.env.example supabase/realtime-posts.sql tests/listener.test.js tests/package.json
git commit -m "feat(listener): 폴링 대신 Realtime으로 깨어나 첨삭 에이전트를 스폰하는 상주 리스너"
```

> ### STOP AND ASK — 리스너를 실제로 띄우는 건 사람이 한다
>
> 이 태스크는 코드와 plist 를 커밋하는 데서 끝난다. **구현 에이전트는 `launchctl load` 를 실행하지 않고, `.pipeline/.env` 를 편집하지도 않는다.** 아래는 전부 사람 몫이다:
>
> 1. **service role key 입력** — Supabase 대시보드 → Settings → API → `service_role` 키를 복사해 `.pipeline/.env` 에 `SUPABASE_SERVICE_KEY=` 로 넣는다. 이 키는 RLS 를 통째로 우회하므로 `.pipeline/.env`(gitignore 대상) 밖으로 나가면 안 된다. 에이전트에게 값을 불러주지도 말 것 — 대화 기록에 남는다.
> 2. **Realtime 활성화** — 대시보드 → Database → Replication 에서 `cbk_posts` 와 `cbk_yt_queue` 를 `supabase_realtime` 퍼블리케이션에 넣는다(`supabase/realtime-posts.sql` 과 같은 내용을 SQL 에디터에서 실행해도 된다).
> 3. **launchd 등록** — `launchctl bootstrap gui/$(id -u) .pipeline/com.cbk.listener.plist` 후 `.pipeline/log/` 에 `realtime: SUBSCRIBED` 가 찍히는지 확인한다.
>
> 3번을 하기 전에 **Task 10 이 먼저 끝나 있어야 한다.** 리스너가 스폰하는 명령이 Task 10 에서 정의되므로, 순서를 뒤집으면 첫 catch-up 이 존재하지 않는 프롬프트로 에이전트를 돌린다. 레이어 E 를 전부 마친 뒤에 한 번에 띄운다.
