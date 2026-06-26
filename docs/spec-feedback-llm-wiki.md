# 스펙: 글 평가(좋아요/싫어요/이유) + LLM Wiki 선호 학습

> 상태: 설계 확정(grill 2026-06-26), 구현 전.
> 목적: 글마다 **취향 신호**(좋아요/싫어요 + 그 이유)를 모아, 추후 **LLM Wiki**가
> "내가 선호하는 타입의 정보를 직접 가져오게" 하는 토대를 만든다.

---

## 0. 배경 — "LLM Wiki"가 정확히 무엇인가 (조사 결과)

사용자가 말한 "LLM wiki"는 막연한 개념이 아니라 **Andrej Karpathy가 정의한 "LLM Wiki" 패턴**이다.
insane-search로 확인한 실제 유즈케이스:

| 사례 | 핵심 메커니즘 | 우리에게 주는 시사점 |
|---|---|---|
| **Karpathy "LLM Wiki"** ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)) | raw 소스 → LLM이 `index.md` + 위키링크 article로 **컴파일**. index를 항상 컨텍스트에 두고, 쿼리 때 필요한 article만 읽음. **벡터DB 불필요** | 블로그 글 = raw 소스. 위키는 "내 취향 프로필 + 주제별 정리"가 됨 |
| **NicholasSpisak/second-brain** ([repo](https://github.com/NicholasSpisak/second-brain)) | `raw/`(인박스) → `wiki/`(sources·entities·concepts·synthesis) → `output/`. YAML frontmatter + wikilink. ingest/query/lint 3 워크플로우 | 폴더·파일 규약을 그대로 차용 가능 |
| **Pistis-RAG / EPIC (preference-aligned RAG)** ([arXiv](https://arxiv.org/pdf/2407.00072)) | 사용자 like/dislike 피드백을 RAG 파이프라인에 주입해 **재랭킹**. 선호를 "compact·stable한 개인 컨텍스트"로 취급 | 좋아요/싫어요가 retrieval 가중치가 됨 |
| **mem0 / Letta** ([mem0](https://github.com/mem0ai/mem0)) | 대화에서 선호 사실을 추출→벡터 저장→다음 프롬프트에 주입하는 **메모리 레이어** | 우리는 대화 대신 *명시적 평가*를 쓰므로 추출 단계가 더 정확 |

**핵심 차이 (RAG vs LLM Wiki):** 일반 RAG는 매 질문마다 원문에서 지식을 재발견한다.
LLM Wiki는 **synthesis(종합)를 1급 산출물로 한 번 만들어 누적**한다. 우리 규모(글 수십 개)에선
벡터DB 없이 index 기반 탐색으로 충분하다 — Karpathy의 핵심 주장.

**우리 설계에 주는 결론:** 지금 단계는 *raw 신호 수집기*만 만들면 된다. 신호가
`{글, 좋아요/싫어요, 이유, 출처, 주제, 시각}`로 깨끗이 쌓이면, 추후 LLM Wiki ingest가
그걸 읽어 "선호 프로필"과 "주제별 큐레이션"을 컴파일한다.

> **이미 깔린 복선:** `supabase/schema.sql`의 `feedback`/`feedback_at` 컬럼은
> "맥 배치(service_role)가 채울 자리"로 예약돼 있다. 즉 원 설계가 이미
> *사용자 신호 → AI 배치가 읽고 산출물을 써넣음* 흐름을 의도했다.
> **사용자 코멘트는 입력, `feedback`은 AI 산출** — 둘을 절대 섞지 않는다.

---

## 1. 전체 데이터 흐름

```
[글 페이지에서 평가]                [동기화]              [LLM Wiki 빌드 — 추후]
좋아요/싫어요 + 이유  ──localStorage──▶ Supabase ──service_role──▶ AI 배치(Claude Code)
   (nav.js / store.js)   (CBK.sync)    cbk_items        │            = Karpathy ingest
                                                         ▼
                                          wiki/ (index.md + 주제별 article + 선호 프로필)
                                                         │
                                          쿼리: "내가 좋아할 X 주제 글 가져와" ──▶ 큐레이션 결과
                                                         │
                                          (선택) 결과를 feedback 컬럼에 써서 사이트에 노출
```

---

## 2. Phase A — 지금 구현 (신호 수집기)

### 2.1 확정된 설계 결정 (grill)

| 항목 | 결론 |
|---|---|
| 데이터 주인 | 나 한 명(개인 선호 로그). 인증·중복방지 불필요 |
| 신호 분리 | 즐겨찾기★(다시 볼 글)·메모(할 일)는 **유지**, 좋아요/싫어요·이유는 **별도 신규** |
| 좋아요/싫어요 | 3상태: 좋아요(+1) / 중립(없음) / 싫어요(-1) |
| 코멘트 | "그 평가의 **이유**". 자유 메모와 의미 분리, 평가에 귀속 |
| 저장 | localStorage + Supabase **둘 다** (기존 sync 확장) |
| wiki 선호 단위 | 기존 분류 `main`(출처)·`cat`(주제)로 충분. 추가 메타 불필요 |

### 2.2 데이터 모델 (`store.js`)

기존 `cbk:data:v1`에 서브객체 2개 추가. 패턴은 `notes`와 동일(LWW용 `meta` 타임스탬프 공유).

```js
{
  bookmarks: { [slug]: true },
  notes:     { [slug]: "string" },
  ratings:   { [slug]: 1 | -1 },     // 신규. 중립이면 키 없음(삭제)
  reasons:   { [slug]: "string" },   // 신규. 평가 이유. 빈 값이면 키 없음
  meta:      { [slug]: "ISO" },      // 기존. 모든 신호 공유(per-slug LWW)
  updatedAt: "ISO"
}
```

`ensure()`에 `ratings`/`reasons` 초기화 추가. `present()` 갱신 — 항목이 "존재"하는 조건에
평가/이유도 포함시킨다(툼스톤 판정이 정확해지도록):

```js
function present(d, slug) {
  return !!d.bookmarks[slug]
      || !!(d.notes[slug]   && d.notes[slug].trim())
      || (d.ratings[slug] === 1 || d.ratings[slug] === -1)
      || !!(d.reasons[slug] && d.reasons[slug].trim());
}
```

신규 API (기존 `getNote/setNote`와 대칭):

```js
getRating: function (slug) { return load().ratings[slug] || 0; },      // 0=중립
setRating: function (slug, v) {                                         // v ∈ {1,-1,0}
  var d = load();
  if (v === 1 || v === -1) d.ratings[slug] = v; else delete d.ratings[slug];
  touch(d, slug); save(d);
},
getReason: function (slug) { return load().reasons[slug] || ""; },
setReason: function (slug, text) {
  var d = load();
  if (text && text.trim()) d.reasons[slug] = text; else delete d.reasons[slug];
  touch(d, slug); save(d);
},
```

`exportData`는 자동 포함(전체 객체 직렬화). `importData`는 `ratings`/`reasons` 머지 루프 2줄 추가.

### 2.3 UI (`nav.js` — cbk-bar 확장)

기존 cbk-bar(즐겨찾기·메모 버튼)에 평가 영역을 추가한다. 즐겨찾기 버튼 **다음**, 메모 토글 **앞**.

- 좋아요(👍)·싫어요(👎) 토글 버튼 2개. 현재 상태면 `on` 클래스. 한쪽 켜면 반대쪽 꺼짐(3상태).
- 평가가 켜져 있을 때만 "이유" 입력칸을 노출(없으면 접힘). 라벨: "왜 이렇게 평가했나요?".
  메모와 동일하게 autosize + 디바운스(500ms) 자동저장 + "저장됨 ✓" 상태.
- 메모 textarea(`#cbk-note`)와 별개 textarea(`#cbk-reason`). 둘을 시각적으로 구분.

동작:
```js
function applyRating(v) {                 // v ∈ {1,-1}, 같은 값 다시 누르면 0(중립)
  var cur = CBK.getRating(slug);
  var next = (cur === v) ? 0 : v;
  CBK.setRating(slug, next);
  // 버튼 on/off 갱신, next!==0 이면 이유칸 펼치고 포커스, 0이면 접기(이유는 보존)
}
```

`refreshBar()`(백그라운드 sync pull 후 호출)에 평가/이유 갱신 추가 — 단 **편집 중인 이유칸은 덮어쓰지 않음**
(메모와 동일 가드: `document.activeElement === reasonTa || reasonTimer !== null`).

> 마이크로 결정(구현자 재량): 이유칸은 평가를 눌러야 펼쳐지게 한다(마찰↓, 의미 결합↑).
> 단 이미 이유가 있으면 평가와 무관하게 보이도록 한다.

### 2.4 Supabase (`supabase/schema.sql` + RPC)

`cbk_items`에 **새 컬럼 2개 추가**. `feedback`/`feedback_at`는 AI 배치 전용이므로 **재사용 금지**.

```sql
alter table public.cbk_items add column if not exists rating smallint;     -- 1 | -1 | NULL(중립)
alter table public.cbk_items add column if not exists reason text not null default '';
```

`cbk_upsert` 시그니처 확장(파라미터 2개 추가). **함수 시그니처가 바뀌므로 기존 함수 drop 필요**:

```sql
drop function if exists public.cbk_upsert(text, text, boolean, text);
create or replace function public.cbk_upsert(
  p_key text, p_slug text, p_bookmarked boolean, p_note text,
  p_rating smallint default null, p_reason text default ''
) returns public.cbk_items
language plpgsql security definer set search_path = public as $$
declare r public.cbk_items;
begin
  insert into public.cbk_items
    (sync_key, post_slug, bookmarked, note, rating, reason, deleted, updated_at)
  values (p_key, p_slug, p_bookmarked, p_note, p_rating, p_reason, false, now())
  on conflict (sync_key, post_slug) do update
    set bookmarked = excluded.bookmarked,
        note       = excluded.note,
        rating     = excluded.rating,
        reason     = excluded.reason,
        deleted    = false,
        updated_at = now()
  returning * into r;
  return r;
end;
$$;
-- grant execute 새 시그니처로 다시 부여
```

`cbk_delete`는 평가/이유도 비우도록 갱신(`rating=null, reason=''`). `cbk_get`은 `select *`라 자동 포함.
`feedback` 컬럼은 이 RPC들이 **건드리지 않는다**(배치 전용 불변식 유지).

### 2.5 동기화 (`store.js` CBK.sync)

`syncNow()`의 per-slug LWW 머지에 `rating`/`reason`을 추가한다(기존 `bookmarked`/`note`와 동일 취급):
- remote 행 파싱에 `rating`, `reason` 포함.
- "remote가 더 새것" 분기에서 평가/이유도 채택/삭제.
- push 비교(`R.bookmarked !== ...` 등)에 `R.rating`/`R.reason` 불일치도 포함.
- `cbk_upsert` 호출에 `p_rating`, `p_reason` 전달.

### 2.6 보관함 (`library.html`)

- 각 카드에 평가 뱃지(👍/👎)와 이유 표시·인라인 편집·필터칩("좋아요만"/"싫어요만") 추가.
- POSTS 목록은 nav.js와 library.html **두 곳에 중복**됨 — 글 추가 시 둘 다 수정(기존 주의사항).

### 2.7 LLM Wiki용 export 포맷 (Phase A의 마지막 산출)

Phase B가 바로 먹을 수 있게, 평가가 있는 글만 추린 **레코드 배열**을 export에 포함(또는 별도 버튼).
한 줄 = 한 글:

```json
{
  "slug": "ai-era-durable-skills",
  "title": "RAG는 죽지 않았다 …",
  "main": "AI 인사이트",          // 출처
  "cat":  "역량·커리어",          // 주제
  "rating": 1,                     // 1 | -1
  "reason": "사례가 구체적이고 바로 적용 가능해서",
  "rated_at": "2026-06-26T..."
}
```

`main`/`cat`/`title`은 `posts.js`(`CBK_postBySlug`)에서 join. 이게 Karpathy 패턴의 `raw/` 입력이 된다.

---

## 3. Phase B — LLM Wiki (추후, 조사 기반 설계)

Karpathy 패턴 + second-brain 폴더 규약을 차용. **벡터DB 없이** index 기반.

### 3.1 폴더/파일 (제안)

```
wiki/
  index.md              # 항상 컨텍스트에 두는 카탈로그(페이지 1줄 요약 + 링크)
  profile.md            # ⭐ 내 선호 프로필 — 좋아요/싫어요·이유에서 컴파일
  topics/<주제>.md      # cat별 정리(이 주제에서 뭘 좋아했나/피했나 + 글 링크)
  sources/<slug>.md     # 글별 요약 + 내 평가/이유 (frontmatter: rating, main, cat)
  log.md                # append-only ingest/query 로그
CLAUDE.md (또는 AGENTS.md)  # 위키 구조·규약·ingest/query/lint 워크플로우·규칙
```

### 3.2 세 워크플로우 (Karpathy 그대로)

- **Ingest:** export 레코드를 읽어 → `sources/<slug>.md` 생성/갱신 → `topics/<cat>.md`와
  `profile.md`의 선호 진술 갱신(예: "역량·커리어 주제 선호도 높음; '추상적·이론만'인 글은 -") →
  위키링크 연결 → index·log 갱신. (글 하나가 10~15 페이지를 건드릴 수 있음)
- **Query:** "내가 좋아할 X 주제 글 가져와" → index에서 후보 → `profile.md`의 선호로
  **재랭킹**(Pistis-RAG 방식) → 이유 근거와 함께 큐레이션 결과 제시 → 좋은 결과는
  synthesis 페이지로 저장(누적).
- **Lint:** 모순(같은 주제에 상반된 선호)·끊긴 링크·고아 페이지·오래된 주장 점검.

### 3.3 선호를 retrieval에 쓰는 법 (조사한 preference-aligned RAG)

`profile.md`를 항상 컨텍스트에 두고, 후보 글을 다음으로 정렬:
1. 주제(`cat`) 선호도 — 좋아요 비율
2. 출처(`main`) 선호도
3. 이유 텍스트의 패턴 — "구체적 사례", "바로 적용" 같은 내가 반복적으로 칭찬한 속성 매칭

(선택) AI가 큐레이션 결과를 `cbk_items.feedback`에 써넣으면, 사이트 글 페이지에
"AI 추천 이유"로 노출 가능 — 원 설계의 `feedback` 복선 완성.

---

## 4. 작업 순서 & 미결

### 구현 순서 (작은 단위)
1. `store.js` — ratings/reasons 모델 + API + present/ensure/import (로컬만, sync 제외).
2. `nav.js` — cbk-bar 평가 버튼 + 이유칸 + refreshBar 가드.
3. `library.html` — 평가 뱃지·이유·필터.
4. `schema.sql` — 컬럼 2개 + cbk_upsert/cbk_delete 갱신 + grant. (Supabase에 적용)
5. `store.js` CBK.sync — rating/reason 머지·전달.
6. export 레코드 포맷(Phase B 입력).
7. (추후) Phase B 위키 스캐폴드 + CLAUDE.md 워크플로우.

### 미결 / 결정 대기
- 이유칸 노출 방식: 평가 누른 뒤에만 펼침(기본 추천) vs 항상 노출.
- Supabase 컬럼: 분리(`rating`+`reason`, 추천) vs jsonb 합본. → 기존 "한 줄=한 글"과 맞게 분리.
- export: 기존 전체 백업 JSON에 포함 vs "위키용 내보내기" 별도 버튼. → 별도 버튼이 깔끔.

---

## 참고 출처
- Karpathy LLM Wiki gist — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- second-brain (구현 예) — https://github.com/NicholasSpisak/second-brain
- Pistis-RAG (human feedback RAG) — https://arxiv.org/pdf/2407.00072
- mem0 (memory layer) — https://github.com/mem0ai/mem0
- awesome-llm-knowledge-bases — https://github.com/SingggggYee/awesome-llm-knowledge-bases
