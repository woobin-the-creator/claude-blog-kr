---
slug: site-redesign
confirmed_at: 2026-10-01
spec_review: 2026-10-01 · findings 23 (high 5) · 전부 반영
---

# 사이트 디자인 개편 — 확정 설계

## Problem

2026-10-01 기준 375·768·1280px에서 7개 페이지(홈, 글 2종, 보관함, 링크 큐, 글쓰기, 404)를 렌더링해 확인한 문제다.

1. `post.html`이 `nav.css`를 로드하지 않는다. `nav.js`가 만든 `#site-nav`(글 104개 링크)가 무스타일 목록으로 본문 위에 깔린다. 모든 폭에서 본문이 한참 아래에서 시작한다.
2. `word-break: keep-all`이 없어 한글이 단어 중간에서 끊긴다("워/크숍").
3. 모바일에서 3열 표를 375px에 우겨넣어 칸마다 2~3글자씩 세로로 흐른다. `.tbl-wrap`은 9개 글에만 있다.
4. 홈 목록은 104개 행이 같은 모양이라 위계가 없다. 툴바가 버튼·밑줄 링크·이모지를 섞는다.
5. 페이지마다 인라인 `<style>`이 따로 있어 radius(5/8/12/999px)·회색·테두리가 제각각이다. 공용 토큰이 없다.
6. 강조색 `#c96442`가 흰 배경 대비 3.90:1, 카테고리 글자 `#a98`이 2.76:1로 WCAG AA(4.5:1) 미달이다.
7. 다크모드가 없다. DB의 글별 CSS(`cbk_posts.style_css`) 104개 전부 `body{background:#fff}`를 하드코딩한다.
8. 모바일 보관함 칩이 줄바꿈으로 깨지고("좋/아요"), 메모 FAB가 본문을 가린다.

## Goals

- 모든 페이지가 하나의 디자인 시스템(`posts/assets/site.css`의 토큰)을 쓴다.
- 레퍼런스 claude.dev의 원칙을 가져온다: 종이색 배경과 잉크색 글자, 얇은 구분선 행 목록(날짜 | 제목), mono 대문자 소형 라벨, 각진 태그, 글 페이지 왼쪽 열 목차.
- 한글 가독성: Pretendard, `word-break: keep-all`, 본문 17px(모바일 16px)·행간 1.8, 본문 최대 폭 680px.
- 라이트/다크 테마. 시스템 설정을 따르고 헤더 토글로 고정할 수 있다.
- 375/768/1280에서 가로 스크롤 0. 표·코드블록은 자기 박스 안에서만 가로 스크롤.

## Non-goals

- 라우팅/URL 변경 없음: `index.html`, `post.html?slug=`, `posts/<slug>.html`(정적 레거시 + 404 폴백), `library.html`, `youtube.html`, `write.html`, `#m=&c=` 딥링크.
- 글 데이터 변경 없음: DB `body_html`/`style_css`/마크다운, `content/*.md`, `posts/*.html`을 수정하지 않는다.
- SEO 메타 변경 없음: 각 페이지 `<title>`과 `render-post.js`의 `document.title` 설정을 유지한다(현재 다른 메타 태그는 없다).
- RSS 신설 없음(현재 없음). 홈 검색창, 이전/다음 글 링크도 이번 범위 밖.
- 기능 추가·제거 없음. 기존 DOM id/class 계약(`tests/`가 검사하는 것)을 유지한다.

## Decisions

| # | 결정 | 고른 것 | 근거 |
|---|------|---------|------|
| 1 | 시각 방향 | B 하이브리드 — claude.dev의 구조·색·mono 라벨 + 제목/본문은 한글 산세리프 | 사용자 선택 |
| 2 | 한글 웹폰트 | Pretendard Variable dynamic subset (jsDelivr CDN `orioncactus/pretendard@v1.3.9`), 코드·라벨은 시스템 mono 스택 | 사용자 선택 |
| 3 | 글 페이지 구조 | 상단 헤더 + 데스크톱 왼쪽 열 = 이 글의 목차(h2/h3), 전체 글 목록은 헤더 "글 목록" 버튼으로 여는 서랍 | 사용자 선택 |
| 4 | 다크모드 | 시스템 자동 + 헤더 토글. 토글은 지금 보이는 테마의 반대로 바꾸고, 결과가 시스템 설정과 같으면 저장값을 지워 다시 시스템을 따른다. 저장 키 `localStorage["cbk:theme"]`(`light`/`dark`), 적용은 `<html data-theme>`(없으면 시스템). 깜빡임 방지 head 인라인 스크립트는 try/catch로 감싸고 `matchMedia`를 호출하지 않는다(jsdom에 없음) | 사용자 선택 · 순환 방식은 추천안 기본값 |
| 5 | 글별 CSS 처리 | `render-post.js`가 `style_css`를 `@layer post { … }`로 감싸 주입. 공용 CSS(unlayered)가 이기고 `.callout`·`.stats` 등 컴포넌트는 토큰으로 재채색 | 추천안 기본값 |
| 6 | 색 토큰 | 라이트: bg `#FAF9F5` / ink `#141413` / body `#3D3D3A` / muted `#65645C` / link `#A84A2A` / line `#E6E3D8`. 다크: bg `#141413` / ink `#F0EEE6` / body `#C2C0B6` / muted `#9C9A90` / link `#E5896A` / line `#2E2D2A` | 추천안 기본값 (전 조합 ≥4.5:1 실측) |
| 7 | 간격·타입 스케일 | 간격 4px 단위 4·8·12·16·24·32·48·64·96. 타입 12(라벨)·14·16/17(본문)·20(h3)·24(h2)·clamp 30–38(h1) | 추천안 기본값 |
| 8 | 모바일 목차 | 1080px 미만에서는 본문 위 접이식 `<details>` "목차" | 추천안 기본값 |
| 10 | 파일 구성 | 새 파일 `posts/assets/site.css`(토큰·기본·헤더·홈·보관함·큐·본문), `posts/assets/site.js`(테마 토글·모바일 메뉴). `nav.css`는 글 페이지 레이아웃·서랍·목차·브레드크럼으로 다시 쓴다(레거시 글이 정적으로 링크하므로 삭제 불가). `cbk.css`·`authoring.css`는 토큰 기반으로 다시 쓴다. 모든 페이지가 `site.css`를 쓴다 | 추천안 기본값 |
| 11 | 사이트 헤더 요소 | `<nav class="site-header">`. `<header>`를 쓰지 않는다 — `nav.js`가 `header`를 찾아 브레드크럼·평가바를 붙이기 때문. `nav.js`의 탐색도 `#post-body header` 우선으로 좁힌다. 글 페이지 헤더는 `nav.js`가 `#site-nav.site-header`로 만들고, 나머지 페이지는 정적 마크업 | 추천안 기본값 |
| 12 | 글 목록 서랍 | 기존 `#site-nav ul`과 `nav-mobile.js`의 `.nav-toggle`/`.nav-open`을 재사용. 모든 폭에서 서랍(오른쪽 패널)으로 열리고 Esc·바깥 클릭·링크 클릭으로 닫힌다 | 추천안 기본값 |
| 13 | 목차 id | 기존 id가 있으면 그대로. 없으면 제목 텍스트로 slug(공백→`-`, 문자·숫자·한글·`-`만, 중복은 `-2`…). h2가 2개 미만이면 목차를 만들지 않고 본문을 가운데 정렬 | 추천안 기본값 |
| 14 | 레거시 정적 글 | `nav.js`가 본문 노드를 `<main class="post-main"><div id="post-body">`로 감싸 post.html과 같은 구조로 만든다. `site.css`·`site.js`·Pretendard는 `nav.js`가 없을 때만 주입(중복 방지). 주입 순서는 `cbk.css` 다음 | 추천안 기본값 |
| 15 | 표 | `nav.js`가 `.tbl-wrap`/`.table-wrap` 밖의 `table`을 `.table-scroll`로 감싼다. 600px 이하에서 칸 최소 폭 7rem | 추천안 기본값 |
| 16 | 모바일 메모 버튼 | 600px 이하에서 아이콘만 보이는 44px 원형(라벨은 aria-label), 본문 하단에 버튼 높이만큼 여백 | 추천안 기본값 |
| 9 | 시각 검증 스크립트 위치 | `tests/e2e/`에 별도 `package.json`(devDependency: `playwright`, `axe-core`). 기존 `tests/` `npm test`와 CI(`test.yml`, `deploy-supabase.yml`)에 영향 없음. 정적 서버는 스크립트 내장 node 서버로, 레포를 `/claude-blog-kr/`에 마운트하고 없는 경로는 `404.html`을 404로 돌려준다(GitHub Pages와 동일). Supabase는 `page.route`로 가로채 `content/*.md`에서 만든 픽스처로 응답한다(오프라인·결정적, 운영 DB 쓰기 없음). 동기화 키는 넣지 않는다 | 추천안 기본값 |

**가정** — 틀리면 말해라
- 글별 개성(글마다 다른 색)은 사라진다. 실측상 104개 글이 같은 템플릿(`--accent:#c96442`, 같은 폰트 스택)을 쓰므로 잃는 개성이 거의 없다.
- 레거시 정적 URL `posts/<slug>.html`은 인라인 `<style>`을 layer로 감쌀 수 없다(파일 수정 금지). `nav.js`가 `site.css`를 뒤에 주입하고 선택자 특이도로 이긴다. 이 경로는 head 인라인 스크립트가 없어 테마 적용 전 한 프레임 깜빡일 수 있다.
- 레거시 정적 글은 인라인 CSS를 layer로 못 감싸므로 `#post-body` 래퍼 특이도(1,0,x)로 이긴다. 범위는 `site.css` 9절의 요소·컴포넌트 목록으로 한정한다.
- Pretendard CDN이 막히면 시스템 한글 글꼴(Apple SD Gothic Neo/맑은 고딕)로 폴백한다.
- "댓글" = 좋아요/별로 + 평가 이유 + 메모, "태그" = 출처/주제 칩 + 브레드크럼, "검색" = 보관함 검색으로 해석한다.

## Acceptance criteria

1. `cd tests/e2e && npm run shots -- --root <dir> --out <dir>`가 홈·글 `post.html?slug=how-we-claude-code`(이미지·인용)·`post.html?slug=the-ai-native-sdlc-playbook`(표·코드)·레거시 `posts/how-we-claude-code.html`·보관함·링크 큐·글쓰기·404(정적 파일 없는 slug)를 375/768/1280 × 라이트/다크로 찍는다. before는 `main` 체크아웃을 `--root`로 준다. 스크린샷은 커밋하지 않는다(`deploy-pages.yml`이 `.` 전체를 배포하므로 `tests/e2e/shots/`는 gitignore).
2. 위 모든 조합에서 `document.documentElement.scrollWidth <= clientWidth`.
3. 375px에서 `#post-body` 안 `table`·`pre`·`img`의 오른쪽 끝이 뷰포트 안이거나, 가로 스크롤 가능한 조상 박스 안에 있다.
4. `cd tests && npm test` 통과.
5. e2e(`tests/e2e`)로 기능 확인: 홈 출처/주제 칩 필터와 딥링크, 즐겨찾기만 보기, 글 페이지 즐겨찾기·좋아요·이유 저장·메모 패널 열고 닫기, 글 목록 서랍 열고 닫기(Esc 포함), 목차 링크, 테마 토글이 새로고침 후 유지, 보관함 검색·필터, 404 폴백 렌더, 레거시 정적 글에서 헤더·목차·평가바 렌더.
5a. 375px 보관함 필터 칩이 한 줄(칩 높이 ≤ 36px)이고, 375px 메모 버튼 폭 ≤ 48px.
6. axe-core `color-contrast` 규칙 위반 0 (AC1 페이지 × 라이트/다크, 1280px). 추가로 전체 글 슬러그 × 다크 1280px 스윕에서도 위반 0, 전체 글 × 375px 스윕에서 가로 스크롤 0.
7. 새 clone에서 `cd tests/e2e && npm ci && npx playwright install chromium && npm test`로 AC2·3·5·5a·6이 재현된다(서버·픽스처는 스크립트가 만든다). e2e 테스트는 폰트 CDN 요청을 막아 결정적으로 돈다. 스크린샷(`npm run shots`)은 폰트를 허용한다.
7a. 바뀌는 테스트 계약: `tests/post-page.test.js`의 `#post-style` 기대값을 `@layer post {\n<원문>\n}`로 바꾼다. 유지하는 계약: `nav.test.js`의 첫 stylesheet = `cbk.css`, `.nav-brand`/`.nav-home`/`.nav-library`/`#site-nav ul a`/`.post-crumb a` href, `#cbk-*` id, `library.test.js`의 `.chip[data-filter]`/`.card*`/`#summary`의 `👍 1`/`#q`, `library.test.js`·`yt-page.test.js`·`post-page.test.js`가 문자열로 치환하는 `<script src="posts/assets/X.js"></script>` 태그 원형, `script[src]` nav.js 경로.
7b. 커밋 전 `tests/` wiki 테스트가 만든 `wiki/` 변경은 되돌린다.
8. 구현 후 `woobin-harness:code-reviewer` 1사이클을 돌리고 findings와 처리 결과를 PR 본문 `### 리뷰` 절에 기록한다.

## Rejected alternatives

- A. claude.dev 그대로(제목·내비까지 mono) — 한글 mono 글꼴이 없어 한·영 혼합 제목의 글꼴이 섞이고 mono 웹폰트 의존성이 하나 더 는다.
- C. 중립 모던 카드형 — 레퍼런스와 멀어지고 104개 목록이 카드로 길어진다.
- Noto Sans KR — 파일이 크고 획이 굵어 본문이 무겁다. 시스템 글꼴만 — 기기별 모양이 달라 "한글 웹폰트" 요구 미충족.
- 글 페이지 A(전체 글 목록 사이드바 유지) — 104개 목록이 시야를 차지하고 글 구조가 안 보인다. C(목차+목록 한 사이드바) — 목차가 목록에 밀린다.
- 다크모드 자동만 — 다크로 읽으려면 OS 설정을 바꿔야 한다.
- 글별 CSS를 아예 주입하지 않기 — `.callout`·`.stats`·`.q` 등 60여 개 컴포넌트 스타일이 사라진다. 특이도 경쟁(`!important`) — 104개 글 CSS와 끝없는 우선순위 싸움이 된다.
- 사이트 헤더를 `<header>`로 — `nav.js`의 `querySelector("header")`가 브레드크럼·평가바를 사이트 헤더 옆에 붙인다.
- e2e가 운영 Supabase를 직접 읽기 — 매일 밤 데이터가 바뀌어 비결정적이고 새 clone에서 오프라인 재현이 안 된다.
- 테마 3단 순환(시스템→라이트→다크) — 첫 클릭에 화면이 안 바뀌는 경우가 생긴다.
- playwright를 `tests/package.json`에 추가 — CI(`deploy-supabase.yml`)의 `npm ci`가 무거워진다.

## Provenance

- 2026-10-01 interview 세션. 현재 화면 분석은 Playwright 렌더(375/768/1280) 이미지, 레퍼런스는 claude.dev 홈·글 페이지 렌더와 computed style 추출.
- 결정 1–4는 사용자가 AskUserQuestion으로 선택(전부 추천안). 5–9는 추천안 기본값.

## Open questions

없음.
