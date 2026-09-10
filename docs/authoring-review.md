# 웹 글쓰기 · AI 첨삭 · 야간 백업

## 사용

- `write.html`에서 마크다운을 쓰고 발행한다. Git 커밋 없이 공개된다.
- 기존 보관함의 소유자 동기화 코드를 그대로 쓴다. 글 주소는 첫 발행 후 고정된다.
- 내 글의 `post.html?slug=...` 위에 나타나는 **글 편집**으로 수정한다. 번역 글은 읽기 전용이다.
- 임시 글은 브라우저 localStorage에 저장한다. 다른 판본과 충돌하면 덮어쓰지 않고 임시 글 다운로드와 최신 글로 복귀를 제공한다.
- 리뷰 탭에서 진행 상태·지적을 보고 반영함/무시로 표시한다. 이 버튼은 글을 자동 수정하지 않는다. 실패한 첨삭은 재시도할 수 있다.
- 이미지 URL을 마크다운으로 삽입할 수 있다. 파일 업로드는 이번 구현에 포함하지 않았다. 기존 계획의 anon 공개 업로드/덮어쓰기 정책은 무단 호스팅 위험 때문에 배포하지 않았다.

## 첨삭 실행

Mac의 `com.cbk.listener` launchd 작업이 Supabase Realtime 변경을 받는다.
한 번에 한 글만 검토하며 시작·재연결 시 누락된 작업을 따라잡는다. Mac이 꺼져 있으면 발행은 가능하지만 첨삭은 켜진 뒤 진행된다.
프로세스 제한은 10분, DB 임대는 15분이다. 재연결 후 일회성 16분 복구 타이머로 이전 실행의 임대를 회수한다.
실패 상태는 무한 재시도하지 않는다. 인증·연결 문제를 확인한 후 리뷰 탭에서 재시도한다.

Claude CLI는 구독 인증을 사용한다. 기본 실행은 safe/restricted 모드이고 WebSearch/WebFetch만 허용한다.
파일/셸/MCP/플러그인 도구와 사용자 커스터마이징은 비활성화한다. DB·GitHub·Telegram 비밀값이나 API 과금 키는 자식 환경에 전달하지 않는다.
본문을 stdin으로 전달하고 JSON 출력만 받는다. parent가 검증 후 판본과 불투명 실행 토큰을 확인해 지적을 한 transaction으로 저장한다.
첨삭 도중 글이 바뀌면 이전 결과를 폐기하고 새 판본을 이어서 검토한다.

```bash
cd .pipeline && npm ci
# 저장소 루트에서
node scripts/supabase-admin.mjs sync-listener-secret
launchctl bootstrap gui/$(id -u) .pipeline/com.cbk.listener.plist
launchctl print gui/$(id -u)/com.cbk.listener
```

로그: `/tmp/cbk-listener.log`, `/tmp/cbk-listener.err`. 본문·비밀값·모델 원문 출력은 로그에 남기지 않는다.
다른 CLI를 사용할 때는 `.pipeline/.env`에 `CBK_REVIEW_COMMAND_JSON`을 JSON argv 배열로 지정한다.
대체 실행기도 stdin 글 JSON → stdout `{ "findings": [...] }` 계약을 지켜야 하며, 제한된 도구 권한과 구독 인증을 별도로 확인해야 한다.

## 야간 스냅샷

GitHub Actions `Nightly post snapshot`이 한국 시간 04:30에 실행된다(플랫폼 사정으로 지연 가능).
Mac에 의존하지 않는다. 변경이 있을 때만 `content/`를 커밋한다. 실패 알림은 GitHub Actions 알림 설정을 따른다.
수동 실행은 Actions의 Run workflow 또는 `node scripts/snapshot.mjs`.

- 하나의 DB SELECT로 일관된 전체 본문을 읽는다. 빈 목록·잘못된 경로·빈 본문은 쓰기 전에 거부한다.
- `content/<slug>.md`는 메타데이터, 마크다운 원본, 렌더된 HTML, CSS를 보관한다. 본문 길이 기반으로 구분해 마지막 개행·구분자·유니코드를 정확히 복원한다.
- `content/manifest.json`의 activeSlugs가 현재 공개된 글 목록이다. 삭제된 글의 옛 스냅샷 파일은 보존된다.
- 소유자 키, 리뷰, 실행 토큰, 비공개 오류는 공개 스냅샷에 넣지 않는다.
- 복원 시 `fromMarkdownFile`로 읽고 activeSlugs만 선택한다. 새 DB에 스키마를 배포한 뒤 관리 세션에서 복원한다. 기존 운영 DB에 자동 덮어쓰기하지 않는다.
- GitHub와 Supabase 모두에 접근할 수 없게 되는 상황까지 막는 외부 백업은 아니다. Storage 이미지의 바이너리 백업도 포함하지 않는다.

## 이번 범위와 남은 전환

PR #12 후속 중 웹 에디터, AI 첨삭, 야간 백업을 구현했다. 번역 파이프라인의 `publish.mjs` 전환, 링크 큐 폴링 교체, Storage 파일 업로드, 레거시 HTML 대량 삭제는 별도 후속이다.
기존 번역 자동화·미디어·82개 HTML은 그대로 보존된다. 이 글쓰기 기능은 그 전환 없이 동작한다.
첫 스냅샷은 82건 전체 복원 검증을 통과했다.
