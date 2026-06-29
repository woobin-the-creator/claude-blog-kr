#!/usr/bin/env bash
# TLDR feed pipeline: fetch today's TLDR(tech) issue -> keep only new items ->
# translate title+summary to Korean via Claude -> append to feed.json -> push ->
# notify on Telegram. Independent of the post-translation pipeline (run.sh).
set -uo pipefail

PIPE_DIR="$HOME/claude-blog-kr/.pipeline"
REPO="$HOME/claude-blog-kr"
OWNER="woobin-the-creator"
PAGES_BASE="https://$OWNER.github.io/claude-blog-kr"
FEED="$REPO/feed.json"

mkdir -p "$PIPE_DIR/log"
LOG="$PIPE_DIR/log/feed-$(date +%Y%m%d-%H%M%S).log"
exec >>"$LOG" 2>&1
echo "=== feed pipeline run $(date) ==="

# CLI tools on PATH under launchd's minimal environment.
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

DATE="$(date +%Y-%m-%d)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1) Fetch today's issue (empty array if no issue / fetch failed → no-op).
python3 "$PIPE_DIR/feed_fetch.py" "$DATE" > "$TMP/raw.json"
RAW_N="$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))))' "$TMP/raw.json" 2>/dev/null || echo 0)"
echo "fetched items: $RAW_N"
if [ "$RAW_N" = "0" ]; then
  # 200 page that parsed to zero items is suspicious (markup drift); a real
  # "no issue today" returns [] from a 404 and is normal. We can't easily tell
  # them apart here, so just log; weekends/holidays legitimately yield 0.
  echo "no items today ($DATE) — nothing to do"
  exit 0
fi

# 2) Keep only items not already in feed.json.
python3 "$PIPE_DIR/feed_store.py" new "$FEED" "$TMP/raw.json" > "$TMP/new.json"
NEW_N="$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))))' "$TMP/new.json" 2>/dev/null || echo 0)"
echo "new items: $NEW_N"
if [ "$NEW_N" = "0" ]; then
  echo "all items already in feed — nothing new"
  exit 0
fi

# 3) Translate title_en/summary_en → title_ko/summary_ko via Claude (JSON in/out).
PROMPT="다음은 TLDR 뉴스레터 항목들의 JSON 배열이다. 각 항목의 title_en 과 summary_en 을 자연스러운 한국어로 번역해 같은 항목에 title_ko 와 summary_ko 키를 추가하라. 규칙: (1) 고유명사·제품명·회사명은 원어 그대로 둔다. (2) 요약은 직역이 아니라 자연스러운 의역, 길이는 원문과 비슷하게. (3) id·url·issue·section·read_min·title_en·summary_en 은 절대 바꾸지 말고 그대로 둔다. (4) 출력은 번역이 채워진 JSON 배열 '하나만', 코드펜스나 설명 없이. 입력 파일: $TMP/new.json. 결과는 $TMP/translated.json 에 써라."

if claude -p "$PROMPT" --dangerously-skip-permissions; then
  echo "claude translation finished"
else
  echo "claude run FAILED"
  notify "❌ TLDR 피드 번역 실패 ($DATE)%0A로그: ${LOG}"
  exit 1
fi

# Defensive: if Claude wrote nothing usable, fall back to the untranslated items
# (feed_store fills *_ko from *_en), so the feed still grows and never blanks.
if [ ! -s "$TMP/translated.json" ]; then
  echo "no translated.json — falling back to untranslated items"
  cp "$TMP/new.json" "$TMP/translated.json"
fi

# 4) Merge into feed.json (prepend, stamp added_at, dedup by id).
ADDED_AT="$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"
ADDED="$(python3 "$PIPE_DIR/feed_store.py" merge "$FEED" "$TMP/translated.json" "$ADDED_AT")"
echo "merged into feed.json: $ADDED"
if [ "${ADDED:-0}" = "0" ]; then
  echo "nothing merged"
  exit 0
fi

# 5) Commit + push.
git add "$FEED"
git commit -q -m "feed: TLDR ${DATE} 항목 ${ADDED}건 추가" && git push -q origin main 2>/dev/null \
  && echo "pushed" || echo "commit/push skipped or failed"

notify "🆕 TLDR 한글 피드 ${ADDED}건 추가 (${DATE})%0A${PAGES_BASE}/my-feed.html"
echo "=== done $(date) ==="
