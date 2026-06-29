# 스펙: TLDR 뉴스레터 → 한글 번역 피드 (`/my-feed`)

> 상태: 설계 확정(grill 2026-06-29), 구현 전.
> 목적: 매일 받는 **TLDR(tech) 뉴스레터**의 항목을 **한글로 번역해 누적 타임라인 피드**로 보여준다.
> 게시글(claude.com/blog 번역) 영역과는 **별개 엔드포인트** `/my-feed`.

---

## 0. 배경 — 무엇이 바뀌었나 (grill 요약)

처음 구상은 "insane-search로 핫토픽 top 10을 **생성** → 피드 → 좋아요 → 전문 번역 포스팅 → 위키 학습"
이었다. grill 과정에서 두 번 좁혀졌다:

1. **소스 피벗:** 토픽을 *생성*할 필요가 없다. 사용자가 이미 **TLDR 뉴스레터**를 구독 중이고,
   TLDR은 모든 호를 **공개 웹 URL**로도 발행한다(`https://tldr.tech/tech/<날짜>`).
   → insane-search·요약 생성 전부 불필요. **번역만** 하면 된다. Gmail 접근도 불필요.
2. **범위 축소(MVP):** "좋아요 → 전문 번역 포스팅 → 위키 학습" 뒷단은 **보류**.
   이번엔 "뉴스레터 → 한글 누적 피드"까지만 만든다.

검증한 사실(2026-06-29):

| 확인 | 결과 |
|---|---|
| `tldr.tech/tech/<date>` 공개 접근 | HTTP 200 (urllib, 인증 불필요) |
| 항목 구조 | `제목 (N minute read)` + 출처 URL 1개 + 2~3문장 요약 + 섹션 헤더 |
| 단일 원문 여부 | 항목마다 출처 링크 1개 → "단일 원문"이라 하이브리드 분기 불필요 |
| 중복 키 | 출처 URL(쿼리 제거)이 안정적 키 |

> **보류된 뒷단을 위한 복선:** 좋아요·이유·전문 번역·위키 학습을 나중에 붙일 때는
> grill에서 이미 정해둔 결정을 재사용한다 — 좋아요는 **Supabase를 작업 큐**로 써서 맥 launchd가
> 폴링→번역→포스팅, 위키는 **포스팅된 글을 일반 rating으로** 학습(피드 좋아요 자체는 위키에
> 직접 넣지 않음). 이 MVP에선 Supabase가 **전혀 필요 없다**.

---

## 1. 전체 데이터 흐름

```
[하루 2회 launchd]                         [정적 호스팅]            [브라우저]
tldr.tech/tech/<date>  ──fetch(urllib)──▶ parse 항목들
                                              │ (제목·요약·URL·섹션)
                                              ▼
                                       feed.json 의 기존 URL과 대조 → 새 항목만
                                              │
                                       claude -p 로 제목+요약 한글 번역
                                              │
                                       feed.json 맨 앞에 누적 ──commit·push──▶ GitHub Pages
                                                                                   │
                                                              my-feed.html 이 feed.json 읽어 타임라인 렌더
```

기존 `.pipeline/run.sh`(글 번역 파이프라인)와 **동일한 패턴**(launchd → `claude -p` → commit → push).
별도 스크립트 `.pipeline/run-feed.sh` + 별도 plist로 둔다. 두 파이프라인은 독립.

---

## 2. 확정된 설계 결정 (grill 2026-06-29)

| 항목 | 결론 |
|---|---|
| 소스 | **메인 TLDR(tech)** 한 종. `https://tldr.tech/tech/<YYYY-MM-DD>` |
| 접근 | 공개 웹 fetch(urllib). Gmail·IMAP·API **불필요** |
| 콘텐츠 저장 | 커밋된 정적 **`feed.json`**. Supabase 불필요 |
| 페이지 | 신규 정적 `my-feed.html`(`/my-feed`). X·스레드풍 타임라인 |
| 타임라인 | **누적**(새 항목만 위로). 교체 아님 |
| 중복 제거 | **출처 URL(쿼리 제거)** 키. 코드로 처리(LLM 유사도 판정 안 씀) |
| 항목 형태 | 한글 제목 + 한글 요약(TLDR 요약을 번역) + **원문(영어) 링크** + 섹션·날짜 |
| 번역 | `claude -p` 1회로 호당 ~10항목의 제목+요약 일괄 번역 |
| 주기 | **하루 2회**(발행 지연·누락 안전망). 이미 처리한 항목은 URL로 스킵 |
| 보류 | 좋아요·이유 → 전문 번역 포스팅 → 위키 학습 (= Phase 2) |

---

## 3. `feed.json` 데이터 모델

배열 1개. 최신이 앞. 한 원소 = 한 TLDR 항목.

```json
[
  {
    "id": "https://vercel.com/blog/ai-sdk-7",      // 중복 키 = 출처 URL(쿼리 제거)
    "url": "https://vercel.com/blog/ai-sdk-7?utm_source=tldr",  // 표시용 원문 링크(원본 그대로)
    "issue": "2026-06-26",                          // 어느 호에서 왔나 (tldr.tech/tech/<issue>)
    "section": "Headlines & Launches",              // TLDR 섹션(영문 원형)
    "title_en": "Vercel Launches AI SDK 7 ...",     // 원제(괄호 reading-time 제거)
    "title_ko": "Vercel, AI SDK 7 출시 ...",        // 번역 제목
    "summary_en": "Vercel released ...",            // 원 요약
    "summary_ko": "Vercel이 ... 출시했다.",          // 번역 요약
    "read_min": 3,                                  // "(3 minute read)"에서 추출(없으면 null)
    "added_at": "2026-06-29T22:00:00.000Z"          // 이 항목이 feed.json에 들어온 시각(정렬용)
  }
]
```

- **정렬:** `added_at` 내림차순(피드는 "내가 본 순서"가 아니라 "들어온 순서" 타임라인).
  같은 호의 항목은 TLDR 원래 순서를 보존.
- **중복 키 `id`:** `url`에서 쿼리스트링(`?utm_source=...`)과 트레일링 슬래시를 제거해 정규화.
  이미 `feed.json`에 같은 `id`가 있으면 스킵(재번역 안 함).
- **불변:** 한 번 들어온 항목은 수정/삭제하지 않는다(누적 로그). 번역 품질 보정은 Phase 2 과제.

---

## 4. 파싱 규약 (`.pipeline/feed_fetch.py`, 결정론 레이어)

`detect_new.py`와 같은 스타일(python3 stdlib, urllib + re). LLM 안 씀.

1. **fetch:** `https://tldr.tech/tech/<date>`. 비-200 또는 빈 본문(주말·공휴일·미발행)이면
   **조용히 종료**(stdout 비움) — `detect_new.py`의 "없으면 종료"와 동일.
2. **항목 추출:** 본문에서 `<a href="...">제목</a>` 중 제목이
   `(\d+ minute read)` 또는 `(GitHub Repo)` 패턴을 포함하는 것을 항목으로 본다.
   각 `<a>` 바로 뒤(또는 인접 블록)의 요약 문단을 `summary_en`으로 잡는다.
3. **정제:**
   - `html.unescape()`로 엔티티 디코딩(TLDR은 `&#x27;` 등으로 줌 — 검증됨).
   - 제목에서 `\s*\((\d+) minute read\)\s*$` 제거 → `title_en`, 숫자 → `read_min`.
   - `url`에서 쿼리·앵커·트레일링 슬래시 제거 → `id`.
4. **출력:** 미정규화 항목 배열을 JSON으로 stdout. (번역 전. 번역은 run-feed.sh가 호출)

> 견고성 메모: TLDR HTML 구조가 바뀌면 정규식이 깨질 수 있다(글 파이프라인 `detect_new.py`와
> 같은 약점). 항목 0개로 끝나면 run-feed.sh가 텔레그램으로 경고 한 줄 보내 "조용한 실패"를 막는다.

---

## 5. 실행 스크립트 (`.pipeline/run-feed.sh`)

`run.sh`의 골격(로그·PATH·텔레그램 notify·git pull/push) 재사용.

```
1. cd repo, git pull --rebase
2. RAW = python3 feed_fetch.py <today>        # 오늘 호의 항목들(번역 전)
3. RAW 비었으면: "no issue today" 로그 후 종료(정상)
4. feed.json 로드 → RAW에서 id가 이미 있는 항목 제거 → NEW
5. NEW 비었으면: "no new items" 종료(정상)
6. claude -p 로 NEW의 title_en/summary_en 을 한글 번역(JSON in/out, 자율 실행)
7. 번역 결과를 added_at 찍어 feed.json 맨 앞에 prepend → 저장
8. git add feed.json && commit && push origin main
9. notify: "🆕 TLDR 피드 N건 추가" (+ /my-feed 링크)
10. 항목 0개로 끝났는데 fetch는 200이었다면 notify 경고(파싱 깨짐 의심)
```

번역 프롬프트 요지(6번): "다음 JSON 배열의 각 항목에서 `title_en`과 `summary_en`을 자연스러운
한국어로 번역해 `title_ko`/`summary_ko`를 채워 **같은 JSON 구조로만** 답하라. 고유명사·제품명은
원어 유지. 요약은 의역 OK, 길이 비슷하게. 그 외 설명 금지." → 결정론 파서가 결과를 검증.

---

## 6. 피드 페이지 (`my-feed.html`)

기존 사이트 자산(`posts/assets/nav.css` 등)과 톤 맞춤. 정적.

- `feed.json`을 `fetch()`로 읽어 클라이언트 렌더(정적 호스팅이라 빌드타임 주입 불필요).
- **날짜(issue)별 그룹** 헤더 + 그 아래 카드들. 카드 = 한글 제목(클릭 시 원문 새 탭) +
  한글 요약 + 작은 메타(섹션·read_min·"원문(영어)" 링크).
- 상단에 `index.html`/`library.html`로 가는 기존 nav. `my-feed`로 가는 링크를
  `index.html`·`library.html`·nav에도 추가.
- 빈 상태("아직 항목이 없습니다") 처리.

> Phase 2가 붙으면 각 카드에 좋아요(👍)·이유칸이 생기고(글 페이지 cbk-bar 패턴 재사용),
> 좋아요가 Supabase 큐로 가 전문 번역 → 게시글로 승격된다. MVP에선 카드는 **읽기 전용**.

---

## 7. Phase 2 — 보류된 뒷단 (나중에)

> 지금 구현하지 않는다. grill에서 합의된 방향만 기록.

1. **좋아요·이유 UI:** my-feed 카드에 글 페이지와 같은 좋아요/싫어요 + 이유칸.
2. **Supabase 작업 큐:** 좋아요 → 브라우저가 Supabase 피드-좋아요 큐에 기록.
   (피드 콘텐츠는 계속 feed.json. 큐만 Supabase.)
3. **전문 번역 포스팅:** launchd 작업이 큐 폴링 → 좋아요 항목의 원문 URL을 전문 한글 번역 →
   `posts/<slug>.html` + `posts.js`에 `main="AI 피드"`(또는 유사) 카테고리로 등록 → 커밋.
   - 단일 원문이 아닌 경우(드묾)만 종합 해설로 분기(하이브리드).
   - 과다 포스팅은 "하루 최대 N건" 속도 제한으로 방지.
4. **위키 학습:** 포스팅된 글이 일반 rating 경로로 위키에 들어감(위키 코드 무수정).
   - 알려진 한계: 피드에서 누른 👎(싫어요)·포스팅 안 한 항목은 위키에 안 들어감(합의됨).
5. claude.com/blog 전용 번역 스킬은 임의 사이트엔 안 맞을 수 있어, 피드 포스팅용 번역 경로는
   별도 검증 필요.

---

## 8. 작업 순서 & 미결

### 구현 순서 (MVP, 작은 단위)
1. `.pipeline/feed_fetch.py` — fetch + 파싱 + 정규화(번역 전 JSON 출력). 단위 검증 포함.
2. 초기 `feed.json` — 빈 배열 `[]` (또는 시드로 최근 1~2호).
3. `.pipeline/run-feed.sh` — 오케스트레이션 + 번역 호출 + 누적 + commit/push + notify.
4. `my-feed.html` — feed.json 렌더(날짜 그룹·카드·원문 링크·빈 상태) + nav 링크 추가.
5. launchd plist `com.woobin.claudeblog.feed.plist` — 하루 2회.
6. 라이브 1회 수동 실행 → /my-feed 에 한글 항목 뜨는지 확인.

### 미결 / 결정 대기
- **하루 2회 시각:** TLDR(tech)은 평일 오전(미국)에 발행 → KST 저녁/심야. 정확한 두 시각 확정 필요
  (예: KST 23:00, 익일 09:00). 발행 직후 1회 + 누락 대비 1회.
- **시드 범위:** 첫 `feed.json`을 빈 배열로 시작할지, 최근 며칠 호를 미리 채울지.
- **번역 단위:** 호 전체를 한 번에 번역(추천, 컨텍스트·비용 유리) vs 항목별 호출.
- **read_min/섹션 노출 정도:** 카드에 다 보일지, 메타로 접을지(구현자 재량).

---

## 참고
- TLDR 공개 아카이브(tech) — https://tldr.tech/tech/
- 검증한 예시 호 — https://tldr.tech/tech/2026-06-26 (HTTP 200, 항목 구조 확인)
- 기존 글 파이프라인(동일 패턴 참고) — `.pipeline/run.sh`, `.pipeline/detect_new.py`
- 보류된 뒷단의 좋아요/위키 설계 — `docs/spec-feedback-llm-wiki.md`
