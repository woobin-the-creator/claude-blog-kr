# Posts-to-DB + Authoring + AI Review — Implementation Plan

> **For agentic workers:** Implement task-by-task in a fresh session (`/clear` first — the planning conversation is not needed and gets re-billed on every request). Task bodies live in the sibling `task-N.md` files; read each one immediately before implementing it, not all up front.

**Goal:** Remove `git commit` from the publishing path — post bodies move to Supabase, the site renders from the DB, a web editor publishes instantly, and a resident Mac listener spawns a headless agent to proofread every new or edited post.

**Architecture:** GitHub Pages keeps serving a static shell (code only, in git). Post metadata + body HTML live in `public.cbk_posts`; AI proofreading findings live in `public.cbk_reviews`. Both are reached only through `security definer` RPCs behind the public anon key, exactly like the existing `supabase/schema.sql`. Writes are gated by a new owner check (`cbk_owner`) because — unlike `cbk_items`, which is partitioned by `sync_key` so a stranger only ever writes their own partition — `cbk_posts` is publicly readable, so an ungated insert would appear on the live site. A resident `listener.mjs` holds Supabase Realtime subscriptions and spawns `$CBK_REVIEW_CMD` (default `claude -p`); there is no polling loop anywhere. A nightly `snapshot.mjs` dumps the DB back into `content/*.md` and commits it, so git remains the change-history store.

**Tech Stack:** Static HTML + ES5-style vanilla JS (no build step, no framework — match the existing files), Supabase Postgres + PostgREST RPC + Realtime + Storage, Node ESM scripts under `scripts/`, tests are plain Node scripts using `jsdom` and `@electric-sql/pglite`, launchd for scheduling.

**Spec:** `docs/woobin_plan/specs/2026-09-01-user-authored-posts-ai-review-design.md`

## Global Constraints

- **Browser JS must stay ES5-compatible IIFE style**, matching `posts/assets/store.js` and `nav.js`: `var`, `function`, `.then()` — no `let`/`const`/arrow/`async` in files under `posts/assets/` or in inline `<script>` blocks in `*.html`. Node scripts under `scripts/` and `.pipeline/` are modern ESM and may use anything.
- **No build step.** Every browser file is served as-is by GitHub Pages.
- **The only secret in the browser is the 24-char `sync_key`**, read via `CBK.sync.getKey()` from localStorage key `cbk:sync_key:v1`. Never add an API token, PAT, or service-role key to any file under version control.
- **Supabase access is RPC-only.** Every new table gets `enable row level security` with no policies; `anon`/`authenticated` receive `grant execute` on functions only. Follow `supabase/schema.sql` verbatim as the style reference.
- **Every write RPC must call `cbk_assert_owner(p_key)`** (Task 1). Read RPCs for post bodies are public and take no key. Review RPCs are owner-gated.
- **Free-tier budget:** DB goes read-only above 500 MB. All 79 existing post bodies total 1.5 MB (avg 19 KB, max 60 KB) — text is safe. Existing media (79 MB, 300 files under `posts/assets/<slug>/`) stays on GitHub Pages and is **not** uploaded to Supabase Storage.
- **Korean is the user-facing language.** All UI copy, error messages, and commit messages that a human reads stay in Korean, matching `youtube.html` and `library.html`.
- **Tests are registered in `tests/package.json`'s `test` script** and must run under plain `node` with no test runner.
- Run tests from the `tests/` directory: `cd tests && npm test`.

## Tasks

| # | Title | Files | Completion check |
|---|---|---|---|
| 1 | Posts + reviews schema and RPCs | `supabase/schema-posts.sql`, `tests/posts-schema.test.js` | `cd tests && node posts-schema.test.js` |
| 2 | Migrate 79 existing posts into the DB | `scripts/migrate-posts.mjs`, `tests/migrate-posts.test.js` | `cd tests && node migrate-posts.test.js` |
| 3 | DB-backed catalog with localStorage cache | `posts/assets/catalog.js`, `tests/catalog.test.js` | `cd tests && node catalog.test.js` |
| 4 | Rewire catalog consumers, delete `posts.js` | `index.html`, `library.html`, `posts/assets/nav.js`, `tests/nav.test.js`, `tests/library.test.js` | `cd tests && node nav.test.js && node library.test.js` |
| 5 | Post renderer + old-URL fallback | `post.html`, `404.html`, `posts/assets/render-post.js`, `tests/post-page.test.js` | `cd tests && node post-page.test.js` |
| 6 | Markdown editor that publishes instantly | `write.html`, `posts/assets/write.js`, `posts/assets/markdown.js`, `tests/write-page.test.js` | `cd tests && node write-page.test.js` |
| 7 | Image upload to Supabase Storage | `supabase/storage-post-media.sql`, `write.html`, `tests/storage-policy.test.js` | `cd tests && node storage-policy.test.js` |
| 8 | `publish.mjs` + rewire translation pipelines | `scripts/publish.mjs`, `.pipeline/run.sh`, `.pipeline/youtube_worker.sh`, `tests/publish.test.js` | `cd tests && node publish.test.js` |
| 9 | Resident Realtime listener | `.pipeline/listener.mjs`, `.pipeline/com.cbk.listener.plist`, `tests/listener.test.js` | `cd tests && node listener.test.js` |
| 10 | Review agent contract + submit CLI | `scripts/review-submit.mjs`, `.pipeline/review-prompt.md`, `tests/review-submit.test.js` | `cd tests && node review-submit.test.js` |
| 11 | Review UI (editor tab + post badge) | `posts/assets/write.js`, `posts/assets/reviews.js`, `post.html`, `write.html`, `tests/review-ui.test.js` | `cd tests && node review-ui.test.js` |
| 12 | Nightly git snapshot + legacy-file cutover | `scripts/snapshot.mjs`, `.pipeline/com.cbk.snapshot.plist`, `posts/*.html` (delete), `tests/snapshot.test.js` | `cd tests && npm test` |

## Ordering

- **Layer A (DB foundation): 1 → 2.** Task 2 executes the schema from Task 1 against pglite, so it needs Task 1's exact RPC signatures.
- **Layer B (read path): 3 → 4 → 5.** Task 3 defines `window.CBK_onCatalog`; Tasks 4 and 5 both consume it. Task 4 and Task 5 both touch nothing of each other's files, but Task 4 deletes `posts/assets/posts.js`, which Task 5's fallback must not reference — keep them ordered.
- **Layer C (write path): 6 → 7.** Task 7 adds an upload button inside the editor Task 6 creates; both modify `write.html`.
- **Layer D (pipeline): 8.** Depends on Task 1 only. Could run parallel to Layers B/C, but it shares no files with them and its own completion check is self-contained.
- **Layer E (review): 9 → 10 → 11.** Task 9 spawns the command Task 10 defines; Task 11 renders what Task 10 writes. Task 11 modifies `write.html` (Layer C) and `post.html` (Layer B), so it must come after both.
- **Layer F (cutover): 12.** Must be last. It deletes the 79 legacy `posts/*.html` files, which is only safe once Task 5 serves them from the DB and Task 12's own snapshot has been proven to round-trip them back into `content/`.
- **Shared-file map:** `write.html` + `posts/assets/write.js` — Tasks 6, 7, 11 (the editor's page script is an external file, not an inline block — see Task 6). `post.html` — Tasks 5, 11. `posts/assets/nav.js` — Task 4 only (Task 5 depends on the `CBK_AT_ROOT` / `hrefFor()` helpers Task 4 adds there). `supabase/schema-posts.sql` — Task 1 only (Task 7 uses a separate file). No two tracks are file-disjoint, so this plan cannot run as parallel tracks.

## Deviation from the spec, flagged

The spec's Goals say "큐 테이블과 폴링 워커를 은퇴시킨다". This plan retires **the polling** everywhere (Task 9 replaces it with Realtime) but **keeps the `cbk_yt_queue` table**, folding its trigger into the same listener as a second subscription. Reason: Realtime events are not durable — if the Mac is asleep when a row is written, the event is gone. A table that stores pending state is what makes the listener's startup catch-up query possible (Task 9, Step 4). Deleting the table would mean losing URL requests submitted while the Mac was off, which is worse than the problem being solved. The 6-step publishing path and the per-feature worker are both gone either way.

## Human checkpoints (구현 에이전트는 여기서 멈춘다)

이 플랜은 사람 승인 없이 넘어가면 안 되는 지점이 다섯 군데 있다. 각 태스크 파일 안에 `STOP AND ASK` 블록으로 박혀 있고, 여기 모아둔다:

| 시점 | 무엇을 | 왜 사람이 |
|---|---|---|
| Task 1 끝 | Supabase SQL 에디터에서 `schema-posts.sql` 실행 + **같은 세션에서 바로** `cbk_owner_claim('<sync_key>')` | anon 키가 공개돼 있어 claim 전까지 소유권 선점 창이 열려 있다 |
| Task 4 → Task 5 사이 | `CBK_SYNC_KEY=… node scripts/migrate-posts.mjs` 실이관 + 79건 검증 | 실서비스 DB 에 쓰는 유일한 배치. 검증·롤백 절차는 Task 2 말미 |
| Task 9 끝 (레이어 E 완료 후) | `.pipeline/.env` 에 `SUPABASE_SERVICE_KEY` 입력, Realtime 퍼블리케이션 등록, `launchctl bootstrap` | service role 키는 RLS 를 통째로 우회한다 — 에이전트에게 값을 주지 않는다 |
| Task 12 Step 4~5 | 스냅샷 79개가 **실제 본문을 담고** 있는지 검증 + 스냅샷 단독 커밋 | `wc -l` 만으로는 빈 파일 79개도 통과한다 |
| Task 12 Step 6 | `git rm posts/*.html` 승인 | 되돌리기 가장 비싼 지점. 스냅샷 커밋 해시 + 검증 결과 + 라이브 URL 3건을 보고받고 승인 |

Task 12 Step 7 의 워커 launchd 타이머 plist 제거(`~/Library/LaunchAgents`)도 저장소 밖이라 사람이 한다 — 다만 되돌리기 쉬우므로 차단 지점은 아니다.

## Explicitly out of scope

- **The two translation skills' own bodies.** `claude-blog-translate-ko` and `claude-youtube-to-blog` ship from the `woobin-harness` plugin (`~/.claude/plugins/cache/woobin-harness/<version>/skills/`), not from this repository, and still tell the agent to register posts in `posts/assets/posts.js` and to commit. Task 8 overrides them from the calling prompt instead. Updating the skills themselves is follow-up work in the plugin repo — see Task 8, Step 4's out-of-scope note.

## Rejected Alternatives

Carried from `docs/woobin_plan/specs/2026-09-01-user-authored-posts-ai-review-design.md` — do not re-propose these:

- **Browser commits to GitHub via the Contents API** — still makes a commit the precondition for publishing, which is exactly what the user is removing. Also needs a repo-write PAT in the browser.
- **Keep the Supabase queue + Mac worker (copy `youtube_worker.sh`)** — leaves the 6-step path, the multi-minute delay, and the Mac dependency in place, and reproduces the "one more queue per feature" growth.
- **Local markdown files + a build script** — cannot satisfy "write from the page"; requires sitting at the Mac.
- **Keep post bodies in git (the original recommendation)** — cannot decouple commit from publish. Its two real benefits (durable archive, agents can `grep` files) are recovered by Task 12's nightly snapshot.
- **Move the 79 MB of media to Supabase Storage too** — 300 files to migrate plus a bulk URL rewrite, in exchange for starting to consume the free Storage allowance and the 10 GB/month egress. Media is immutable pipeline output and is not on the authoring path.
- **New posts in the DB, the existing 79 as files** — smallest diff, but splits the catalog into two sources, which is the exact problem this plan removes.
- **Run the review in GitHub Actions** — `ANTHROPIC_API_KEY` billing lands outside the Claude Code subscription, and once commits leave the publishing path there is no `push` event left to trigger on.
- **Browser calls the Anthropic API directly** — misses edit events on already-published posts.
- **Gate publishing on the review** — turns publishing into two round trips and cancels out the instant-publish benefit.
- **Auto-fix instead of advisory notes** — rewrites the author's sentences without the author seeing it first.
