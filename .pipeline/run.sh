#!/usr/bin/env bash
# Daily pipeline: detect new claude.com/blog posts -> translate+deploy via the
# claude-blog-translate-ko skill -> notify on Telegram.
set -uo pipefail

PIPE_DIR="$HOME/claude-blog-kr/.pipeline"
REPO="$HOME/claude-blog-kr"
OWNER="woobin-the-creator"
PAGES_BASE="https://$OWNER.github.io/claude-blog-kr"

mkdir -p "$PIPE_DIR/log"
LOG="$PIPE_DIR/log/run-$(date +%Y%m%d-%H%M%S).log"
exec >>"$LOG" 2>&1
echo "=== pipeline run $(date) ==="

# Make sure CLI tools on PATH under launchd's minimal environment.
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# Optional notification config (.env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
if [ -f "$PIPE_DIR/.env" ]; then
  # shellcheck disable=SC1091
  set -a; . "$PIPE_DIR/.env"; set +a
fi

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
git pull --rebase --quiet 2>/dev/null || true

NEW="$(python3 "$PIPE_DIR/detect_new.py")"
if [ -z "$NEW" ]; then
  echo "no new posts"
  exit 0
fi
echo "new posts:"; echo "$NEW"

while IFS= read -r slug; do
  [ -z "$slug" ] && continue
  url="https://claude.com/blog/$slug"
  echo "--- translating $slug ---"

  prompt="Use the claude-blog-translate-ko skill to translate the post at ${url} into Korean and deploy it to the existing GitHub Pages repo at ${REPO}.
The repo is already set up: index.html, posts/, and posts/assets/nav.{css,js} all exist.
IMPORTANT: name the generated post file exactly posts/${slug}.html (use the blog slug as the filename) and put its downloaded media under posts/assets/${slug}/.
Translate faithfully (no summarizing), carry over every image, YouTube embed, and hyperlink, add the post to index.html (newest first) and to the POSTS array in posts/assets/nav.js, then commit and push to origin main.
Work autonomously; do not ask questions."

  if claude -p "$prompt" --dangerously-skip-permissions; then
    # Confirm it is actually live (poll the live URL, not the build API).
    live=0
    for _ in $(seq 1 30); do
      code="$(curl -s -o /dev/null -w "%{http_code}" "$PAGES_BASE/posts/${slug}.html" || echo 000)"
      [ "$code" = "200" ] && { live=1; break; }
      sleep 8
    done
    title="$(curl -s "$url" | grep -o '<title>[^<]*</title>' | head -1 | sed -e 's/<[^>]*>//g' -e 's/ | Claude//')"
    [ -z "$title" ] && title="$slug"
    if [ "$live" = "1" ]; then
      echo "live OK: $slug"
      python3 "$PIPE_DIR/mark_seen.py" "$slug"
      git add "$PIPE_DIR/seen.json" && git commit -q -m "pipeline: mark $slug translated" && git push -q origin main 2>/dev/null || true
      notify "🆕 새 Claude 블로그 글 번역 완료%0A<b>${title}</b>%0A${PAGES_BASE}/posts/${slug}.html"
    else
      echo "deployed but not live yet: $slug"
      notify "⚠️ ${slug} 번역은 됐지만 GitHub Pages 반영이 늦습니다. 잠시 후 확인하세요.%0A${PAGES_BASE}/"
    fi
  else
    echo "claude run FAILED for $slug"
    notify "❌ 번역 실패: ${slug}%0A로그: ${LOG}"
  fi
done <<< "$NEW"

echo "=== done $(date) ==="
