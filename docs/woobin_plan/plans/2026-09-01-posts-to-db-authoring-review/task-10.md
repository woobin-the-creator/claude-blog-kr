### Task 10: Review agent contract and submit CLI

**Files:**
- Create: `scripts/review-submit.mjs`
- Create: `.pipeline/review-prompt.md`
- Create: `tests/review-submit.test.js`
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `cbk_post_get(p_slug)`, `cbk_review_add(p_key, p_slug, p_rev, p_kind, p_severity, p_quote, p_comment, p_suggestion)` from Task 1. Invoked by `reviewCommand(slug)` from Task 9.
- Produces: the stdout contract Task 9 depends on — the agent's **last stdout line** is `REVIEW_DONE <slug> <n>` or `REVIEW_ERROR <reason>`. Task 9's `realSpawn` captures stdout and treats `REVIEW_ERROR` as a failure even on exit 0.
- Produces:
  - `scripts/review-submit.mjs` CLI: reads a JSON array of findings on **stdin** and writes them to `cbk_reviews`.
    - `node scripts/review-submit.mjs --slug <slug> [--rev N] [--dry] < findings.json`
    - Prints `SUBMITTED <n>` on success; exits non-zero with one line on stderr otherwise.
    - Exports `validateFindings(raw)` -> `{ ok: [...], errors: [...] }` for the test.
  - `.pipeline/review-prompt.md` — the instruction file the headless agent reads. Task 9's `reviewCommand` points at this exact path.

**Background the implementer needs:**

The agent is invoked headless and gets exactly one turn. It cannot ask questions, cannot resume, and nothing runs after it stops. The prompt therefore has to be a closed loop: fetch the post, judge it, emit findings, submit them, print a result line.

The review is **advisory** (spec Decision 7) — the agent never edits the post. It only writes rows into `cbk_reviews`. That is what keeps this safe to run automatically on every edit.

Review depth is fixed by spec Decision 8: sentences and structure, plus errors judgeable from inside the text. The agent web-searches **only** to check a factual claim it is genuinely unsure about, not every claim — full fact-checking costs minutes per post and produces false positives on anything recent.

The three `kind` values map to the three things the user asked for: `fact` (틀린 부분), `logic` (논리가 빈 곳), `style` (문장이 어색한 곳). The DB check constraint from Task 1 rejects anything else, so validate before submitting to get a readable error instead of a Postgres one.

Findings must quote the passage they are about (`quote`), because Task 11's UI highlights it and the author needs to find the spot without re-reading the whole post.

- [ ] **Step 1: Write the failing test**

Create `tests/review-submit.test.js`:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }

(async () => {
  const { validateFindings } = await import(ROOT + "/scripts/review-submit.mjs");

  const good = [
    { kind: "fact", severity: "high", quote: "2026년에 출시됐다", comment: "출시는 2025년입니다.", suggestion: "2025년으로 고치세요." },
    { kind: "style", severity: "low", quote: "그것은 그래서", comment: "지시어가 모호합니다." }
  ];
  let r = validateFindings(good);
  ok("valid findings pass", r.ok.length === 2 && r.errors.length === 0);
  ok("missing suggestion defaults to empty", r.ok[1].suggestion === "");

  r = validateFindings([{ kind: "nonsense", severity: "high", comment: "c" }]);
  ok("unknown kind is rejected", r.ok.length === 0 && /kind/.test(r.errors[0]));

  r = validateFindings([{ kind: "fact", severity: "urgent", comment: "c" }]);
  ok("unknown severity is rejected", r.ok.length === 0 && /severity/.test(r.errors[0]));

  r = validateFindings([{ kind: "fact", severity: "high", comment: "   " }]);
  ok("blank comment is rejected", r.ok.length === 0 && /comment/.test(r.errors[0]));

  r = validateFindings("not an array");
  ok("non-array input is rejected", r.ok.length === 0 && r.errors.length === 1);

  r = validateFindings([]);
  ok("an empty array is valid (a clean post)", r.ok.length === 0 && r.errors.length === 0);

  r = validateFindings(good.concat([{ kind: "logic", severity: "medium", comment: "근거가 없습니다." }]));
  ok("mixed valid findings all survive", r.ok.length === 3);

  r = validateFindings([good[0], { kind: "bad", severity: "high", comment: "c" }]);
  ok("one bad finding does not discard the good ones", r.ok.length === 1 && r.errors.length === 1);

  // --- the prompt file exists and states the closed loop ---
  const prompt = fs.readFileSync(ROOT + "/.pipeline/review-prompt.md", "utf8");
  ok("prompt names review-submit.mjs", /review-submit\.mjs/.test(prompt));
  ok("prompt forbids editing the post", /(수정하지|고치지|편집하지)/.test(prompt));
  ok("prompt lists the three kinds", /fact/.test(prompt) && /logic/.test(prompt) && /style/.test(prompt));
  ok("prompt states the one-shot constraint", /(ONE-SHOT|한 턴|single turn)/i.test(prompt));
  ok("prompt defines a final result line", /REVIEW_DONE/.test(prompt));
  ok("prompt defines the failure marker Task 9 keys off", /REVIEW_ERROR/.test(prompt));

  console.log("review-submit: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node review-submit.test.js
```

Expected: FAIL — `Cannot find module '.../scripts/review-submit.mjs'`

- [ ] **Step 3: Write the submit CLI**

Create `scripts/review-submit.mjs`:

```js
#!/usr/bin/env node
/* 첨삭 에이전트가 찾은 지적을 cbk_reviews 에 넣는다.
 *
 *   node scripts/review-submit.mjs --slug my-post < findings.json
 *
 * stdin 은 JSON 배열이다:
 *   [{ kind, severity, quote, comment, suggestion }, …]
 * 지적이 없으면 빈 배열 [] 을 준다 — 그것도 정상 결과다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const KINDS = ["fact", "logic", "style"];
const SEVERITIES = ["high", "medium", "low"];

export function validateFindings(raw) {
  const okList = [], errors = [];
  if (!Array.isArray(raw)) return { ok: [], errors: ["findings must be a JSON array"] };
  raw.forEach((f, i) => {
    if (!f || typeof f !== "object") { errors.push("#" + i + ": not an object"); return; }
    if (KINDS.indexOf(f.kind) === -1) { errors.push("#" + i + ": kind must be one of " + KINDS.join("|")); return; }
    if (SEVERITIES.indexOf(f.severity) === -1) { errors.push("#" + i + ": severity must be one of " + SEVERITIES.join("|")); return; }
    if (!f.comment || !String(f.comment).trim()) { errors.push("#" + i + ": comment is required"); return; }
    okList.push({
      kind: f.kind,
      severity: f.severity,
      quote: String(f.quote || ""),
      comment: String(f.comment).trim(),
      suggestion: String(f.suggestion || "")
    });
  });
  return { ok: okList, errors };
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

function readStdin() {
  return new Promise((res, rej) => {
    let buf = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", d => { buf += d; });
    process.stdin.on("end", () => res(buf));
    process.stdin.on("error", rej);
  });
}

async function main() {
  const argv = process.argv.slice(2);
  const get = name => { const i = argv.indexOf("--" + name); return i === -1 ? null : argv[i + 1]; };
  const slug = get("slug");
  const dry = argv.includes("--dry");
  if (!slug) throw new Error("--slug is required");

  const text = (await readStdin()).trim();
  let parsed;
  try { parsed = JSON.parse(text || "[]"); }
  catch (e) { throw new Error("stdin is not valid JSON: " + e.message); }

  const { ok, errors } = validateFindings(parsed);
  if (errors.length) throw new Error("invalid findings: " + errors.join("; "));

  if (dry) { console.log("SUBMITTED " + ok.length); return; }

  const key = process.env.CBK_SYNC_KEY;
  if (!key) throw new Error("CBK_SYNC_KEY is not set");

  let rev = Number(get("rev"));
  if (!rev) {
    const rows = await rpc("cbk_post_get", { p_slug: slug });
    if (!rows || !rows[0]) throw new Error("post not found: " + slug);
    rev = rows[0].rev;
  }

  for (const f of ok) {
    await rpc("cbk_review_add", {
      p_key: key, p_slug: slug, p_rev: rev,
      p_kind: f.kind, p_severity: f.severity,
      p_quote: f.quote, p_comment: f.comment, p_suggestion: f.suggestion
    });
  }
  console.log("SUBMITTED " + ok.length);
}

if (process.argv[1] && process.argv[1].endsWith("review-submit.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
```

- [ ] **Step 4: Write the agent prompt**

Create `.pipeline/review-prompt.md`:

```markdown
# 포스트 첨삭 — 헤드리스 에이전트 지시서

리스너가 이 파일을 너에게 읽히고 슬러그 하나를 준다. 그 글을 읽고 첨삭 의견을 남겨라.

**이건 ONE-SHOT 실행이다.** 다음 턴도, 알림도, 재개도 없다. 질문하지 말고, 백그라운드 작업을
띄우지 말고, 무엇을 기다리려고 턴을 끝내지 마라. 모든 도구를 동기로 호출하고, 마지막 결과
줄을 출력할 때까지 이 한 턴 안에서 끝내라.

## 절대 하지 않을 것

- **글을 수정하지 마라.** 이건 자문이다. 너는 지적만 남기고, 반영 여부는 사람이 정한다.
- `cbk_post_upsert` 를 호출하지 마라. `posts/` 아래 파일을 만들거나 고치지 마라.
- 커밋하지 마라. 푸시하지 마라.

## 단계

1. 글을 가져온다. `posts/assets/cbk-config.js` 에서 Supabase URL 과 anon 키를 읽고:

   ```bash
   curl -sS "$SUPABASE_URL/rest/v1/rpc/cbk_post_get" \
     -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
     -H "Content-Type: application/json" \
     -d '{"p_slug":"<슬러그>"}'
   ```

   응답의 `body_html` 이 검토 대상이고, `rev` 가 판본 번호다.

2. 읽고 판단한다. 세 종류만 본다:

   - `fact` — **틀린 부분.** 사실과 다른 서술, 잘못된 수치·날짜·이름·인용.
   - `logic` — **보완할 부분.** 근거 없이 건너뛴 결론, 빠진 전제, 앞뒤가 안 맞는 서술.
   - `style` — 비문, 오탈자, 모호한 지시어, 지나치게 긴 문장.

   **웹 검색은 정말 확신이 안 서는 사실 주장에만 쓴다.** 모든 문장을 검색으로 대조하지 마라 —
   글당 수 분이 걸리고 최신 정보일수록 오탐이 난다. 글 안에서 판단할 수 있으면 검색하지 않는다.

   각 지적의 `severity` 는 `high`(사실이 틀렸거나 결론이 무너짐) / `medium`(읽는 사람이
   오해할 수 있음) / `low`(다듬으면 좋음) 중 하나다.

   지적할 게 없으면 빈 배열을 내는 게 정답이다. 억지로 채우지 마라.

3. 결과를 제출한다. `quote` 에는 지적 대상 구절을 **본문에서 그대로** 옮겨라 — 사람이 그
   자리를 찾는 데 쓴다.

   ```bash
   cat <<'JSON' | node scripts/review-submit.mjs --slug <슬러그> --rev <rev>
   [
     {
       "kind": "fact",
       "severity": "high",
       "quote": "본문에서 그대로 옮긴 구절",
       "comment": "무엇이 어떻게 틀렸는지 한두 문장",
       "suggestion": "이렇게 고치면 된다 (선택)"
     }
   ]
   JSON
   ```

4. 마지막 줄로 정확히 이것만 출력한다:

   - 성공: `REVIEW_DONE <슬러그> <지적 개수>`
   - 실패: `REVIEW_ERROR <한 줄 이유>`
   이 줄은 **stdout 으로** 나가야 한다. Task 9 의 `realSpawn` 이 자식의 stdout 만 캡처하고 `REVIEW_ERROR` 를 찾으면 그 글을 `review_status='error'` 로 마감한다 — `claude -p` 는 에이전트가 실패해도 exit 0 이므로 이 줄이 성패의 유일한 근거다. stderr 로 보내면 실패가 성공으로 기록되고 재시도되지 않는다.

## 톤

한국어로 쓴다. 글쓴이는 본인이다 — 칭찬은 필요 없고, 무엇이 왜 문제인지만 짧고 구체적으로
적어라. "좋은 글입니다" 같은 문장은 넣지 마라.
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd tests && node review-submit.test.js
```

Expected: the final line reads `review-submit: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 6: Smoke-test the CLI offline**

```bash
echo '[{"kind":"style","severity":"low","quote":"q","comment":"c"}]' | node scripts/review-submit.mjs --slug x --dry
echo '[{"kind":"bogus","severity":"low","comment":"c"}]' | node scripts/review-submit.mjs --slug x --dry; echo "exit=$?"
```

Expected: `SUBMITTED 1`, then an `invalid findings: #0: kind must be one of fact|logic|style` line with `exit=1`.

- [ ] **Step 7: Register the test and commit**

Add `review-submit.test.js` to `tests/package.json`'s `test` script and a `test:review-submit` entry.

```bash
git add scripts/review-submit.mjs .pipeline/review-prompt.md tests/review-submit.test.js tests/package.json
git commit -m "feat(review): 첨삭 에이전트 지시서와 지적 제출 CLI"
```
