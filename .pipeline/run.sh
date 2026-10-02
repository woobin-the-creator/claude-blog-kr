#!/usr/bin/env bash
# Daily pipeline: detect new claude.com/blog and claude.dev posts -> translate+deploy via the
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
# The run commits in this checkout and pushes main, so it must be on main.
branch="$(git branch --show-current)"
if [ "$branch" != "main" ]; then
  echo "repo is on '$branch', not main; skipped"
  notify "⏸ 번역 파이프라인 건너뜀: 로컬 레포가 '${branch}' 브랜치예요. main으로 돌려 두면 다음 실행에서 처리해요."
  exit 0
fi
git pull --rebase --quiet 2>/dev/null || true

NEW="$(python3 "$PIPE_DIR/detect_new.py")"
if [ -z "$NEW" ]; then
  echo "no new posts"
  exit 0
fi
echo "new posts:"; echo "$NEW"

while IFS=$'\t' read -r url cat; do
  [ -z "$url" ] && continue
  slug="${url##*/}"
  echo "--- translating $url ---"

  case "$url" in
    https://claude.dev/*)
      label="claude.dev"
      source_note="This post is from claude.dev, Anthropic's developer blog (a Next.js site), not claude.com's Webflow blog. The skill's extract_media.py still finds its images and <video> clips, but returns site-relative /media/... paths (prefix https://claude.dev) and also lists the site logo /shared/img/clawd-mark.png, which is not content. Download the content images and the mp4 clips (small, a few hundred KB) under posts/assets/${slug}/ and embed each clip with <video controls muted playsinline loop poster=...>, keeping its aria-label as the caption.
Catalog entry: main \"claude.dev\", cat \"${cat}\", date = the post's own publish date (not today), and credit the original author(s) in the post meta line." ;;
    *)
      label="Claude 블로그"
      source_note="Catalog entry: main \"Claude blog\"; take cat from the post's category on claude.com." ;;
  esac

  prompt="Use the claude-blog-translate-ko skill to translate the post at ${url} into Korean and deploy it to the existing GitHub Pages repo at ${REPO}.
The repo is already set up: index.html, posts/, and posts/assets/nav.{css,js} all exist.
IMPORTANT: name the generated post file exactly posts/${slug}.html (use the blog slug as the filename) and put its downloaded media under posts/assets/${slug}/.
Translate faithfully (no summarizing), carry over every image, video, YouTube embed, and hyperlink, register the post in CBK_POSTS in posts/assets/posts.js (the single catalog for index, sidebar, and breadcrumb; keep it sorted by date, newest first), then commit and push to origin main.
${source_note}
Work autonomously; do not ask questions."

  # A claude -p that hangs at startup never exits on its own (2026-10-02: idle
  # for 1h50m, ignored SIGTERM), so cap each post and SIGKILL after a grace period.
  # </dev/null: otherwise claude reads the rest of the slug list from the loop's stdin into its prompt.
  if timeout -k 60 45m claude -p "$prompt" --dangerously-skip-permissions </dev/null; then
    # Confirm it is actually live (poll the live URL, not the build API).
    live=0
    for _ in $(seq 1 30); do
      code="$(curl -s -o /dev/null -w "%{http_code}" "$PAGES_BASE/posts/${slug}.html" || echo 000)"
      [ "$code" = "200" ] && { live=1; break; }
      sleep 8
    done
    title="$(curl -sL "$url" | grep -o '<title>[^<]*</title>' | head -1 | sed -e 's/<[^>]*>//g' -e 's/ | Claude//' -e 's| / claude\.dev Blog||')"
    [ -z "$title" ] && title="$slug"
    if [ "$live" = "1" ]; then
      echo "live OK: $slug"
      python3 "$PIPE_DIR/mark_seen.py" "$slug"
      git add "$PIPE_DIR/seen.json" && git commit -q -m "pipeline: mark $slug translated" && git push -q origin main 2>/dev/null || true
      notify "🆕 새 ${label} 글 번역 완료%0A<b>${title}</b>%0A${PAGES_BASE}/posts/${slug}.html"
    else
      echo "deployed but not live yet: $slug"
      notify "⚠️ ${slug} 번역은 됐지만 GitHub Pages 반영이 늦습니다. 잠시 후 확인하세요.%0A${PAGES_BASE}/"
    fi
  else
    rc=$?
    echo "claude run FAILED for $slug (exit $rc; 124/137 = timed out)"
    notify "❌ 번역 실패: ${slug} (exit ${rc})%0A로그: ${LOG}"
  fi
done <<< "$NEW"

echo "=== done $(date) ==="
