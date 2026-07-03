#!/usr/bin/env bash
# YouTube queue worker: poll the Supabase queue (filled by youtube.html) ->
# turn each URL into a Korean post via the claude-youtube-to-blog skill ->
# push, verify live, mark done/error, notify on Telegram.
set -uo pipefail

PIPE_DIR="$HOME/claude-blog-kr/.pipeline"
REPO="$HOME/claude-blog-kr"
OWNER="woobin-the-creator"
PAGES_BASE="https://$OWNER.github.io/claude-blog-kr"
MAX_PER_RUN=3   # bound one launchd cycle; leftovers picked up next cycle

mkdir -p "$PIPE_DIR/log"
LOG="$PIPE_DIR/log/youtube-$(date +%Y%m%d-%H%M%S).log"
exec >>"$LOG" 2>&1
echo "=== youtube worker run $(date) ==="

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# --- single-instance lock (macOS has no flock; mkdir is atomic) ---
LOCK="$PIPE_DIR/youtube_worker.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  # steal locks older than 3h (crashed run)
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +180 2>/dev/null)" ]; then
    echo "stale lock, stealing"
    rm -rf "$LOCK"; mkdir "$LOCK" || exit 0
  else
    echo "another run in progress"; exit 0
  fi
fi
trap 'rm -rf "$LOCK"' EXIT

# --- config: telegram + sync key from .pipeline/.env, gemini from repo .env ---
if [ -f "$PIPE_DIR/.env" ]; then set -a; . "$PIPE_DIR/.env"; set +a; fi
if [ -f "$REPO/.env" ]; then set -a; . "$REPO/.env"; set +a; fi

if [ -z "${CBK_SYNC_KEY:-}" ]; then
  echo "CBK_SYNC_KEY missing in $PIPE_DIR/.env — cannot see the queue; exiting"
  exit 0
fi

# Supabase URL/anon key: single source = the site's own config file.
SB_URL="$(sed -n 's/.*supabaseUrl: *"\([^"]*\)".*/\1/p' "$REPO/posts/assets/cbk-config.js" | head -1)"
SB_KEY="$(sed -n 's/.*supabaseAnonKey: *"\([^"]*\)".*/\1/p' "$REPO/posts/assets/cbk-config.js" | head -1)"
if [ -z "$SB_URL" ] || [ -z "$SB_KEY" ]; then
  echo "could not parse supabase config"; exit 1
fi

rpc() { # rpc <fn> <json-body>  -> prints response body, returns curl status
  curl -sS --fail-with-body "$SB_URL/rest/v1/rpc/$1" \
    -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" \
    -H "Content-Type: application/json" -d "$2"
}

notify() {
  local text="$1"
  if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
    curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
      --data-urlencode "text=${text}" \
      -d "parse_mode=HTML" >/dev/null \
      && echo "notified" || echo "notify FAILED"
  else
    echo "no telegram creds; would have notified: $text"
  fi
}

cd "$REPO" || { echo "repo missing"; exit 1; }

processed=0
while [ "$processed" -lt "$MAX_PER_RUN" ]; do
  claim="$(rpc cbk_yt_claim "{\"p_key\":\"$CBK_SYNC_KEY\"}")" || { echo "claim rpc failed: $claim"; break; }
  # setof returns [] when the queue is empty
  row_id="$(printf '%s' "$claim" | jq -r '.[0].id // empty')"
  url="$(printf '%s' "$claim" | jq -r '.[0].url // empty')"
  if [ -z "$row_id" ]; then echo "queue empty"; break; fi
  processed=$((processed + 1))
  echo "--- processing #$row_id: $url ---"

  git pull --rebase --quiet 2>/dev/null || true

  prompt="Use the claude-youtube-to-blog skill to turn this YouTube video into a Korean blog post for the repo at ${REPO}: ${url}
IMPORTANT: this is a ONE-SHOT headless run (claude -p). There is no next turn, no notifications, and nothing resumes after you stop: NEVER launch background tasks and NEVER end your turn to 'wait for' an event, notification, or long-running call. Call every tool synchronously (long Gemini video calls included — just block on them) and keep working in this single turn until you print the final RESULT line.
Work fully autonomously; do not ask questions. Choose the slug and the two-level category (main=출처 channel, cat=주제) yourself following the skill's rules. Do the frame quality pass yourself: Read the extracted frames, drop duplicates, low-value ones, and people-only/talking-head shots (informational visuals only — zero stills is fine for podcast-format videos), and write the captions. Capture animated infographics/demos as short looping mp4 clips per the skill's step 4b.
Register the post in posts/assets/posts.js as the skill instructs, then commit and push to origin main.
When (and only when) the post is committed and pushed, print as the very last line of your final message exactly: RESULT_SLUG=<the post slug>
If you cannot complete the post for any reason, print as the very last line exactly: RESULT_ERROR=<one-line reason>"

  out_file="$PIPE_DIR/log/youtube-claude-$row_id.out"
  if claude -p "$prompt" --dangerously-skip-permissions >"$out_file" 2>&1; then
    slug="$(grep -o 'RESULT_SLUG=[A-Za-z0-9._-]*' "$out_file" | tail -1 | cut -d= -f2)"
    err_line="$(grep -o 'RESULT_ERROR=.*' "$out_file" | tail -1 | cut -c14-213)"
  else
    slug=""
    err_line="claude -p exited non-zero (log: $(basename "$out_file"))"
  fi

  if [ -n "$slug" ]; then
    # confirm it is actually live before calling it done
    live=0
    for _ in $(seq 1 30); do
      code="$(curl -s -o /dev/null -w "%{http_code}" "$PAGES_BASE/posts/${slug}.html" || echo 000)"
      [ "$code" = "200" ] && { live=1; break; }
      sleep 8
    done
    if [ "$live" = "1" ]; then
      echo "live OK: $slug"
      rpc cbk_yt_finish "{\"p_key\":\"$CBK_SYNC_KEY\",\"p_id\":$row_id,\"p_status\":\"done\",\"p_slug\":\"$slug\"}" >/dev/null \
        || echo "finish rpc failed (post is live though)"
      notify "📺 유튜브 포스트 완료%0A${PAGES_BASE}/posts/${slug}.html"
    else
      echo "pushed but not live yet: $slug — leaving as done (pages lag)"
      rpc cbk_yt_finish "{\"p_key\":\"$CBK_SYNC_KEY\",\"p_id\":$row_id,\"p_status\":\"done\",\"p_slug\":\"$slug\"}" >/dev/null || true
      notify "⚠️ 유튜브 포스트 push 완료, GitHub Pages 반영 대기 중%0A${PAGES_BASE}/posts/${slug}.html"
    fi
  else
    [ -z "$err_line" ] && err_line="no RESULT_SLUG in output (log: $(basename "$out_file"))"
    echo "FAILED #$row_id: $err_line"
    safe_err="$(printf '%s' "$err_line" | jq -Rs .)"
    rpc cbk_yt_finish "{\"p_key\":\"$CBK_SYNC_KEY\",\"p_id\":$row_id,\"p_status\":\"error\",\"p_error\":$safe_err}" >/dev/null \
      || echo "finish(error) rpc failed"
    notify "❌ 유튜브 포스트 실패%0A${url}%0A${err_line}"
  fi
done

echo "=== done $(date) (processed $processed) ==="
