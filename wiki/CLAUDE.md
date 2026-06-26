# LLM Wiki — 운영 매뉴얼 (claude-blog-kr 선호 학습)

이 디렉터리는 **내 글 취향을 학습해 "선호하는 타입의 정보를 직접 가져오게"** 하는 LLM Wiki다.
Andrej Karpathy의 *LLM Wiki* 패턴을 **구조화된 평가 데이터**에 맞게 적응했다:

- **결정론 레이어** (`*.mjs`) — 평가·출처·주제 같은 구조 신호의 "장부(bookkeeping)"를 담당.
  사람이 반복해도 같은 결과. 검증 가능(테스트·lint).
- **LLM 레이어** (`profile.md`의 "해석·패턴" 절, 쿼리 큐레이션) — *왜* 좋아하는지의 해석과
  최종 추천 판단을 담당. 결정론 레이어가 못 잡는 뉘앙스(예: "공지/추상은 회피")를 채운다.

> 왜 순수 LLM(원조 Karpathy)이 아니라 하이브리드인가: 입력이 자유 문서가 아니라
> `{rating, cat, main, reason}` 구조 레코드라, 집계·페이지생성·링크는 코드가 정확·재현가능하게
> 하는 게 낫다. LLM은 코드가 못 하는 "이유 해석·큐레이션"에 집중한다.

## 디렉터리 구조

```
wiki/
  CLAUDE.md         ← 이 파일. 구조·규약·워크플로우·규칙.
  raw/*.json        ← 입력. 보관함 "선호 내보내기"(store.js exportWiki) 산출물을 여기 둔다.
  ingest.mjs        ← raw → 위키 컴파일 (결정론)
  rank.mjs          ← 선호 기반 재랭킹 엔진 ("가져오기"의 코어)
  lint.mjs          ← 무결성 검증기
  index.md          ← [생성] 항상 컨텍스트에 두는 카탈로그
  profile.md        ← [생성+LLM] 취향 프로필. 자동 표 + LLM "해석·패턴" 절(보존됨)
  profile.json      ← [생성] 머신용 취향 집계 (rank.mjs 가 읽음)
  topics/<주제>.md  ← [생성] 주제별 좋아요/싫어요 묶음
  sources/<slug>.md ← [생성] 글 1건 = 평가 + 이유
  log.md            ← [생성] append-only 인제스트 로그
```

`index.md`·`topics/`·`sources/`·`profile.json`과 `profile.md`의 표 부분은 **생성물이라 직접 수정 금지**
(다음 ingest에 덮어쓰임). 사람이 쓰는 곳은 **`profile.md`의 "## 해석 · 패턴 (LLM 작성)" 절 하나뿐**이며,
이 절은 ingest가 보존한다.

## 입력 형식 (raw/*.json)

`store.js`의 `CBK.wikiRecords()`/보관함 "선호 내보내기" 산출물. 평가(👍/👎)된 글만 한 줄씩:

```json
{ "slug": "...", "title": "...", "main": "출처", "cat": "주제",
  "date": "YYYY-MM-DD", "rating": 1, "reason": "왜 이렇게 평가했나",
  "bookmarked": false, "rated_at": "ISO" }
```

여러 파일을 둬도 되고, 같은 slug는 `rated_at` 최신본이 이긴다.

## 워크플로우

### 1) Ingest — 새 평가를 반영
```
node wiki/ingest.mjs
```
한 일: 각 평가글 → `sources/<slug>.md`, 주제별 → `topics/<주제>.md`, 집계 → `profile.json` +
`profile.md` 표, 카탈로그 → `index.md`, `log.md`에 한 줄. **`profile.md`의 LLM 해석 절은 보존**한다.
ingest 후, 사람(LLM)은 `profile.md`의 "해석·패턴" 절을 새 이유들을 읽고 갱신한다.

### 2) Query — "내가 좋아할 글 가져와"
```
node wiki/rank.mjs ["키워드"] [--all] [--limit N]
```
한 일: `profile.json` + 글 카탈로그(`posts/assets/posts.js`)로 후보를 취향 점수순 정렬.
점수 = 0.7·주제(cat)선호 + 0.3·출처(main)선호, 표본 적으면 가중 약화. 기본은 미평가 글만.

그다음 **LLM이 큐레이션**한다: rank 상위 후보를 받아 `profile.md`의 "해석·패턴"을 근거로
최종 N개를 고르고 "왜 너에게 맞는지"를 이유와 함께 제시한다. (rank는 주제/출처만 보지만,
LLM은 "공지/추상 회피" 같은 속성 패턴까지 반영해 같은 주제 안에서 순서를 보정한다.)
좋은 답은 `sources/`나 합성 페이지로 저장해 누적할 수 있다.

### 3) Lint — 건강 검사
```
node wiki/lint.mjs
```
끊긴 위키링크, 평가글의 source 페이지 누락, index 링크 누락, 고아 페이지,
`profile.json` 집계 불일치를 잡는다. CI/커밋 전 게이트로 쓴다.

## 규칙 (LLM 행동)

1. `raw/`는 **입력**이다. 절대 수정하지 않는다.
2. 생성물(`index.md`·`topics/`·`sources/`·`profile.json`·`profile.md` 표)을 **손으로 고치지 않는다**.
   바꾸려면 `raw/`를 고치고 `ingest`를 다시 돌린다.
3. 사람이 쓰는 곳은 `profile.md`의 **"## 해석 · 패턴 (LLM 작성)"** 절 하나. ingest가 보존한다.
4. ingest 후에는 **항상 lint**를 돌려 통과를 확인한다.
5. 쿼리 답은 `index.md`에서 후보를 찾고 `profile.md`(특히 해석 절)를 근거로 한다. 추측 금지.
6. 위키링크는 `[[경로]]` (예: `[[sources/foo]]`, `[[topics/Claude-Code]]`), `.md` 없이.
7. `profile.json`의 점수/집계를 신뢰한다. 숫자를 새로 지어내지 않는다.

## 검증

- 구조·집계·랭킹: `node /tmp/cbk-test/test-wiki.mjs` 류의 단위 테스트(ingest 집계·rank 단조성).
- 무결성: `node wiki/lint.mjs`.
- 라이브 데모: `node wiki/rank.mjs --limit 5` 가 선호 주제 글을 상위로 올리는지.
