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
- **Production Supabase changes are automatic.** Add immutable SQL files to `supabase/deploy-manifest.json`; `.github/workflows/deploy-supabase.yml` applies them on `main`, seeds the owner through the Management API, synchronizes legacy data, and verifies production invariants. Never send an implementer to SQL Editor.
- **Free-tier budget:** DB goes read-only above 500 MB. All 79 existing post bodies total 1.5 MB (avg 19 KB, max 60 KB) — text is safe. Existing media (79 MB, 300 files under `posts/assets/<slug>/`) stays on GitHub Pages and is **not** uploaded to Supabase Storage.
- **Korean is the user-facing language.** All UI copy, error messages, and commit messages that a human reads stay in Korean, matching `youtube.html` and `library.html`.
- **Tests are registered in `tests/package.json`'s `test` script** and must run under plain `node` with no test runner.
- Run tests from the `tests/` directory: `cd tests && npm test`. `tests/node_modules` is not checked in — run `npm install` there once before the first test run.
- **`npm test` dirties the working tree.** `tests/wiki.test.mjs` rewrites the tracked files `wiki/index.md`, `wiki/log.md`, `wiki/profile.json`, `wiki/profile.md` with a fresh timestamp every run. Always `git checkout -- wiki/` before staging, or that churn lands in your commit. Verified in Layer A.

## Tasks

| # | Title | Files | Completion check |
|---|---|---|---|
| 1 | Posts + reviews schema and RPCs | `supabase/schema-posts.sql`, `tests/posts-schema.test.js` | `cd tests && node posts-schema.test.js` |
| 2 | Migrate 79 existing posts into the DB | `scripts/migrate-posts.mjs`, `tests/migrate-posts.test.js` | `cd tests && node migrate-posts.test.js` |
| 3 | DB-backed catalog with localStorage cache | `posts/assets/catalog.js`, `tests/catalog.test.js` | `cd tests && node catalog.test.js` |
| 4 | Rewire catalog consumers, stop loading `posts.js` | `index.html`, `library.html`, `posts/assets/nav.js`, `tests/nav.test.js`, `tests/library.test.js` | `cd tests && node nav.test.js && node library.test.js` |
| 5 | Post renderer + old-URL fallback | `post.html`, `404.html`, `posts/assets/render-post.js`, `tests/post-page.test.js` | `cd tests && node post-page.test.js` |
| 6 | Markdown editor that publishes instantly | `write.html`, `posts/assets/write.js`, `posts/assets/markdown.js`, `tests/write-page.test.js` | `cd tests && node write-page.test.js` |
| 7 | Image upload to Supabase Storage | `supabase/migrations/20260908001000_storage_post_media.sql`, `write.html`, `tests/storage-policy.test.js` | `cd tests && node storage-policy.test.js` |
| 8 | `publish.mjs` + rewire translation pipelines | `scripts/publish.mjs`, `.pipeline/run.sh`, `.pipeline/youtube_worker.sh`, `tests/publish.test.js` | `cd tests && node publish.test.js` |
| 9 | Resident Realtime listener | `.pipeline/listener.mjs`, `.pipeline/com.cbk.listener.plist`, `tests/listener.test.js` | `cd tests && node listener.test.js` |
| 10 | Review agent contract + submit CLI | `scripts/review-submit.mjs`, `.pipeline/review-prompt.md`, `tests/review-submit.test.js` | `cd tests && node review-submit.test.js` |
| 11 | Review UI (editor tab + post badge) | `posts/assets/write.js`, `posts/assets/reviews.js`, `post.html`, `write.html`, `tests/review-ui.test.js` | `cd tests && node review-ui.test.js` |
| 12 | Nightly git snapshot + legacy-file cutover | `scripts/snapshot.mjs`, `.pipeline/com.cbk.snapshot.plist`, `posts/*.html` (delete), `tests/snapshot.test.js` | `cd tests && npm test` |

## Ordering

- **Layer A (DB foundation): 1 → 2.** Task 2 executes the schema from Task 1 against pglite, so it needs Task 1's exact RPC signatures.
- **Layer B (read path): 3 → 4 → 5.** Task 3 defines `window.CBK_onCatalog`; Tasks 4 and 5 both consume it. Task 4 and Task 5 both touch nothing of each other's files, but Task 4 stops every page from loading `posts/assets/posts.js`, which Task 5's fallback must not reference — keep them ordered. The file itself survives until Task 12: `scripts/migrate-posts.mjs` reads it as the catalog source for the one-time migration, which happens between Tasks 4 and 5.
- **Layer C (write path): 6 → 7.** Task 7 adds an upload button inside the editor Task 6 creates; both modify `write.html`.
- **Layer D (pipeline): 8.** Depends on Task 1 only. Could run parallel to Layers B/C, but it shares no files with them and its own completion check is self-contained.
- **Layer E (review): 9 → 10 → 11.** Task 9 spawns the command Task 10 defines; Task 11 renders what Task 10 writes. Task 11 modifies `write.html` (Layer C) and `post.html` (Layer B), so it must come after both.
- **Layer F (cutover): 12.** Must be last. It deletes the 79 legacy `posts/*.html` files, which is only safe once Task 5 serves them from the DB and Task 12's own snapshot has been proven to round-trip them back into `content/`.
- **Shared-file map:** `write.html` + `posts/assets/write.js` — Tasks 6, 7, 11 (the editor's page script is an external file, not an inline block — see Task 6). `post.html` — Tasks 5, 11. `posts/assets/nav.js` — Task 4 only (Task 5 depends on the `CBK_AT_ROOT` / `hrefFor()` helpers Task 4 adds there). `supabase/schema-posts.sql` — Task 1 only (Task 7 uses a separate file). No two tracks are file-disjoint, so this plan cannot run as parallel tracks.

## Deviation from the spec, flagged

The spec's Goals say "큐 테이블과 폴링 워커를 은퇴시킨다". This plan retires **the polling** everywhere (Task 9 replaces it with Realtime) but **keeps the `cbk_yt_queue` table**, folding its trigger into the same listener as a second subscription. Reason: Realtime events are not durable — if the Mac is asleep when a row is written, the event is gone. A table that stores pending state is what makes the listener's startup catch-up query possible (Task 9, Step 4). Deleting the table would mean losing URL requests submitted while the Mac was off, which is worse than the problem being solved. The 6-step publishing path and the per-feature worker are both gone either way.

## Automated operations and the remaining destructive gate

Supabase 작업에는 사람 체크포인트가 없다. 프로젝트 범위의 Management API token은 macOS Keychain과 GitHub Actions secret에만 보관한다. 로컬에서는 `node scripts/supabase-admin.mjs deploy`, 병합 뒤에는 `Deploy Supabase` workflow가 같은 manifest를 적용한다. `cbk_owner_claim`은 브라우저 역할에 공개하지 않으며 관리 세션만 호출하므로 선점 창도 없다. Realtime publication과 이후 Storage SQL도 migration으로 배포한다. 로컬 리스너의 서버 키는 `node scripts/supabase-admin.mjs sync-listener-secret`으로 gitignored `.pipeline/.env`에 넣는다.

Task 12의 스냅샷 본문 검증은 자동 테스트로 유지한다. `git rm posts/*.html`은 Supabase 조작이 아니라 대량 영구 삭제이므로, 스냅샷 커밋과 라이브 URL 검증이 성공한 뒤에만 수행한다.

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
