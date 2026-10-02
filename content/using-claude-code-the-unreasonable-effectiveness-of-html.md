---
slug: "using-claude-code-the-unreasonable-effectiveness-of-html"
title: "Claude Code 활용하기: HTML의 터무니없는 효과"
nav: "HTML의 터무니없는 효과 · Markdown 대신 HTML로 스펙·리뷰·디자인·보고서·편집기 만들기"
main: "claude.dev"
cat: "Playbooks"
date: "2026-05-20"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 12862
---

<!-- rendered HTML -->
<header>
  <h1>Claude Code 활용하기: HTML의 터무니없는 효과</h1>
  <div class="meta">
    2026년 5월 20일
    · 카테고리: Playbooks
    · 글쓴이: Thariq Shihipar
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/using-claude-code-the-unreasonable-effectiveness-of-html">Using Claude Code: The unreasonable effectiveness of HTML</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Claude Code 팀원들이 더 풍부하고, 더 읽기 쉽고, 더 쉽게 공유할 수 있는 결과물을 만들기 위해 Markdown 대신 HTML을 쓰는 방법과 이유.</p>

<p>Markdown은 에이전트가 사람과 소통할 때 쓰는 지배적인 파일 형식이 되었다. 단순하고, 이식성이 좋고, 어느 정도의 서식(rich text) 기능이 있으며, 편집하기 쉽다. Claude는 심지어 Markdown 파일 안에서 ASCII로 다이어그램을 그리는 데도 놀랄 만큼 능숙해졌다.</p>

<p>하지만 에이전트가 점점 더 강력해지면서, 나는 Markdown이 점점 더 제약이 많은 형식이 되어 간다고 느꼈다. 구체적으로 말하면, 100줄이 넘는 Markdown 파일은 읽기가 힘들다. 나는 Claude로 더 풍부한 시각화, 색상, 다이어그램을 만들고 싶고, 이런 결과물을 더 쉽게 공유하고 싶다.</p>

<p>또 나는 이런 파일을 직접 편집하는 일이 점점 줄어들고, 스펙과 참고 자료로 쓰는 일이 늘고 있다. 편집을 하더라도 보통은 Claude에게 고쳐 달라고 프롬프트를 쓰는데, 그러면 Markdown의 가장 큰 장점 하나가 사라진다.</p>

<p>그래서 나는 Markdown 대신 HTML을 출력 형식으로 선호하기 시작했고, Claude Code 팀의 다른 사람들도 이 패턴을 쓰는 모습을 점점 더 많이 본다. 이 글에서는 우리 팀이 더 풍부하고 읽기 쉬운 Claude Code 결과물을 만들기 위해 왜, 그리고 어떻게 HTML을 쓰는지 공유한다. 따라 해 보고 싶다면 <a href="https://thariqs.github.io/html-effectiveness/#code-review">자주 쓰는 용도별 HTML 파일 템플릿</a>부터 바로 써 볼 수 있다.</p>

<h2 id="why-use-html">왜 HTML을 쓰는가?</h2>

<p>내가 지금 Claude Code로 하고 있는 종류의 일에는 Markdown보다 HTML이 더 잘 맞는 이유가 몇 가지 있다. 다음과 같은 것이 필요하거나 수반되는 작업들이다.</p>

<h3 id="information-density">정보 밀도</h3>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/info-density.png" alt="HTML 파일 하나가 담을 수 있는 여덟 종류의 정보: 표, 디자인, 일러스트, 코드, 인터랙션, 워크플로, 공간 레이아웃, 이미지." loading="lazy">
</figure>

<p>HTML은 Markdown보다 훨씬 풍부한 정보를 전달할 수 있다. 제목이나 서식 같은 단순한 문서 구조는 물론이고, 다음과 같은 온갖 종류의 정보도 표현할 수 있다.</p>

<ul>
  <li>표(table)를 이용한 표 형식 데이터</li>
  <li>CSS를 이용한 디자인 데이터</li>
  <li>SVG를 이용한 일러스트</li>
  <li>script 태그를 이용한 코드 스니펫</li>
  <li>HTML 요소에 JavaScript + CSS를 더한 인터랙션</li>
  <li>SVG와 HTML을 이용한 워크플로</li>
  <li>절대 위치(absolute position)와 canvas를 이용한 공간 데이터</li>
  <li>image 태그를 이용한 이미지</li>
</ul>

<p>내 생각에는 Claude가 읽을 수 있는 정보 가운데 HTML로 효율적으로 표현할 수 없는 것은 거의 없다. 그래서 HTML은 모델이 깊이 있는 정보를 당신에게 전달하고, 당신이 그것을 검토하는 데 매우 효율적인 수단이 된다.</p>

<p>이렇게 할 수 없을 때 모델은 Markdown 안에서 더 비효율적인 일을 하기도 한다. ASCII 다이어그램을 그리거나, 내가 제일 좋아하는 예로, 유니코드 문자로 색상을 어림잡아 표현하는 식이다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/palette-ascii.png" alt="Markdown 코드 블록 안에 ASCII로 그린 색상 팔레트: 색상 견본 대신 음영 문자 블록 옆에 hex 코드가 적혀 있다." loading="lazy">
  <figcaption><b>FIG A</b>Markdown밖에 쓸 수 없을 때 색상 팔레트가 어떤 모습이 되는지.</figcaption>
</figure>

<h3 id="visual-clarity-and-ease-of-reading">시각적 명확성과 읽기 편함</h3>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/spec-md-vs-html.png" alt="같은 결제 서비스 스펙을 두 가지로 표현. Markdown으로는 제목과 문단으로 이뤄진 240줄짜리 파일을 스크롤해야 한다. HTML로는 Overview, API, Rollout 탭, 지연 시간 목표 콜아웃, 지역별 볼륨 차트, 미결 질문 목록이 있는 한 페이지다." loading="lazy">
</figure>

<p>Claude가 더 복잡한 일을 해낼 수 있게 되면서, 점점 더 큰 스펙과 계획도 쓸 수 있게 되었다. 그런데 나는 100줄이 넘는 Markdown 파일은 실제로 읽지 않는 편이고, 조직 안의 다른 누군가에게 읽게 만드는 것은 확실히 불가능하다는 것을 알게 되었다.</p>

<p>하지만 HTML 문서는 훨씬 읽기 쉽다. Claude가 탭, 일러스트, 링크로 탐색하기 좋게 구조를 시각적으로 정리할 수 있기 때문이다. 심지어 모바일 반응형으로 만들어서 기기 형태에 따라 다르게 읽을 수도 있다.</p>

<h3 id="ease-of-sharing">공유의 편리함</h3>

<p>Markdown 파일은 공유하기가 꽤 어렵다. 대부분의 브라우저가 Markdown을 기본적으로 잘 렌더링하지 않기 때문이다. 이메일이나 메시지에 첨부 파일로 붙여야 하는 경우가 많다.</p>

<p>HTML 파일은 업로드만 하면 링크를 쉽게 공유할 수 있다. 동료들은 원하는 곳에서 열어 보고 쉽게 참조할 수 있다.</p>

<p>스펙, 보고서, PR 설명을 HTML로 만들면 누군가가 실제로 읽어 줄 가능성이 훨씬 높아진다.</p>

<h3 id="two-way-interactions">양방향 인터랙션</h3>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/checkout-sliders.png" alt="hover 애니메이션 길이, 배율, 그림자 블러 슬라이더와 spring easing 토글, “Copy as prompt” 버튼이 있는 checkout-button.html 페이지. 복사한 값을 Claude Code에 붙이면 CheckoutButton.tsx가 수정된다." loading="lazy">
</figure>

<p>HTML을 쓰면 <a href="https://x.com/trq212/status/2017024445244924382">문서와 상호작용</a>할 수도 있다. 예를 들어 디자인을 조정할 수 있는 슬라이더나 손잡이(knob)를 추가해 달라고 하거나, 알고리즘의 여러 옵션을 바꿔 보며 어떤 일이 벌어지는지 볼 수 있게 해 달라고 할 수 있다. 그렇게 바꾼 내용을 프롬프트로 복사해서 Claude Code에 다시 붙일 수 있게 해 달라고 요청할 수도 있다.</p>

<p>유용한 경우에는 이런 방식으로 지금 다루고 있는 특정 문제만을 위한 개별 편집 환경을 만들 수 있다.</p>

<h3 id="data-ingestion">데이터 수집</h3>

<p>Claude.ai나 Claude Design 대신 Claude Code로 HTML 파일을 만드는 가장 큰 이유 가운데 하나는 Claude Code가 받아들일 수 있는 그 모든 컨텍스트다. 예를 들어 이 글을 쓸 때 나는 Claude Code에게 내 코드 폴더를 훑어서 내가 만든 HTML 파일을 전부 찾아 묶고 분류한 다음, 각 유형을 나타내는 다이어그램이 들어간 HTML 파일을 만들어 달라고 했다. 이 글에 보이는 다이어그램들은 바로 그 결과물이다.</p>

<p>파일 시스템 외에도 Claude Code는 당신의 MCP(Slack, Linear 등), 웹 브라우저(Claude in Chrome), git 히스토리에서 추가 컨텍스트를 찾을 수 있다.</p>

<h2 id="getting-started">시작하기</h2>

<p>한 가지 짚어 둘 점: Claude가 이런 HTML을 만들게 하려고 특별히 할 일은 거의 없다. 그냥 "<em>HTML 파일을 만들어 줘</em>"나 "<em>HTML 아티팩트를 만들어 줘</em>"라고 프롬프트하면 된다. 중요한 것은 그 아티팩트가 무엇을 하길 원하는지, 그리고 어떻게 쓸 것인지를 아는 일이다. 시간이 지나면 반복되는 패턴을 스킬(skill)로 묶는 것이 합리적일 수 있지만, 처음에는 맨바닥에서 프롬프트로 시작하는 것이 다양한 용도에서 어떻게 동작하는지 감을 잡는 좋은 방법이다.</p>

<h2 id="use-cases">활용 사례</h2>

<p>이 접근법을 더 구체적으로 보여 주기 위해, 아래에 Markdown보다 HTML 파일을 쓰는 것이 더 합리적이라고 생각하는 <a href="https://thariqs.github.io/html-effectiveness/">활용 사례 몇 가지</a>를 소개한다. 이 사례들의 GitHub 갤러리는 <a href="https://github.com/anthropics/html-effectiveness">여기</a>에서 함께 볼 수 있다.</p>

<h3 id="specs-planning-and-exploration">스펙, 계획, 탐색</h3>

<p>HTML은 Claude가 문제 속으로 파고들 수 있는 풍부한 캔버스다. 나는 어떤 문제에 착수할 때 단순한 Markdown 계획 하나가 아니라 서로 얽힌 HTML 파일들의 망을 만들 것이라고 기대한다. 예를 들어 먼저 Claude Code에게 브레인스토밍을 하고 여러 선택지를 탐색한 결과물을 만들어 달라고 한다. 그다음 그중 하나를 더 깊이 파고, 그런 유형의 인터페이스에 대한 목업이나 예시를 만들어 달라고 한다. 마지막으로 마음에 들면 구현 계획을 써 달라고 한다. 계획이 만족스러우면 새 세션을 열어 이 파일들을 전부 넘겨주고 구현하게 한다.</p>

<p>검증할 때도 검증 에이전트에게 이 파일들을 읽어 들이게 하는데, 그러면 무엇이 필요한지에 대해 훨씬 넓은 컨텍스트를 갖게 된다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/fig-b-exploration.png" alt="“Pick an approach”라는 제목의 HTML 페이지. 디바운스 검색을 구현하는 세 가지 접근을 A, B, C 카드로 나란히 놓고 각각 코드와 장단점을 보여 준다. B가 선택되어 있다." loading="lazy">
  <figcaption><b>FIG B</b>탐색: 여러 접근법을 트레이드오프와 함께 한 페이지에 나란히.</figcaption>
</figure>

<p><strong>프롬프트 예시:</strong></p>

<ul>
  <li><em>온보딩 화면을 어떤 방향으로 가져가야 할지 모르겠어. 레이아웃, 톤, 밀도를 다르게 해서 서로 뚜렷하게 다른 접근 6가지를 만들고, 나란히 비교할 수 있게 HTML 파일 하나에 그리드로 배치해 줘. 각각 어떤 트레이드오프를 택하고 있는지 라벨을 달아 줘.</em></li>
  <li><em>HTML 파일로 꼼꼼한 구현 계획을 만들어 줘. 목업도 몇 개 넣고, 데이터 흐름을 보여 주고, 내가 검토해 보고 싶을 만한 중요한 코드 스니펫도 추가해 줘. 읽고 소화하기 쉽게 만들어 줘.</em></li>
</ul>

<p><strong>이런 데 쓰자:</strong></p>

<ul>
  <li>코드로 무언가를 구현하는 다른 방법 탐색</li>
  <li>여러 시각 디자인을 한 번에 실험</li>
</ul>

<h3 id="code-review-and-understanding">코드 리뷰와 이해</h3>

<p>Markdown 파일에서는 코드를 읽기 어려울 수 있지만, HTML에서는 diff, 주석(annotation), 플로차트, 모듈을 렌더링할 수 있다. 에이전트가 쓴 코드를 이해하거나, 코드를 리뷰하거나, 내 코드를 리뷰하는 사람에게 PR을 설명할 때 HTML을 쓰자.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/fig-c-code-review.png" alt="PR #482의 HTML 코드 리뷰. lib/session.ts diff에 특정 줄마다 blocking, nit, nice 태그가 붙은 여백 주석이 달려 있다." loading="lazy">
  <figcaption><b>FIG C</b>코드 리뷰: 심각도 태그가 달린 여백 메모와 함께 렌더링된 diff.</figcaption>
</figure>

<p><strong>프롬프트 예시:</strong></p>

<p><em>이 PR을 설명하는 HTML 아티팩트를 만들어서 리뷰를 도와줘. 나는 스트리밍/백프레셔(backpressure) 로직에 익숙하지 않으니 거기에 집중해 줘. 실제 diff를 인라인 여백 주석과 함께 렌더링하고, 발견 사항은 심각도별로 색을 구분하고, 개념을 잘 전달하는 데 필요한 것이 있으면 뭐든 더해 줘.</em></p>

<p><strong>이런 데 쓰자:</strong></p>

<ul>
  <li>PR 만들기</li>
  <li>PR 리뷰하기</li>
  <li>코드의 특정 주제 이해하기</li>
</ul>

<h3 id="design-and-prototypes">디자인과 프로토타입</h3>

<p>Claude Design이 HTML을 기반으로 하는 이유는, 최종 결과물이 HTML이 아니더라도 HTML이 디자인 표현에 믿기 어려울 만큼 뛰어나기 때문이다. Claude는 HTML로 디자인을 스케치한 다음 React, Swift 등 원하는 언어로 옮겨 쓸 수 있다.</p>

<p>애니메이션, 동작 같은 인터랙션도 프로토타이핑할 수 있다. 원하는 것을 정확히 맞춰 가도록 Claude에게 슬라이더나 손잡이 등을 만들어 달라고 해 보자.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/fig-d-design.png" alt="웹 앱의 디자인 토큰 페이지: 이름과 hex 코드가 붙은 색상 견본, 타입 스케일, 간격 스케일, primary·secondary·ghost 버튼." loading="lazy">
  <figcaption><b>FIG D</b>디자인: 실제로 보일 모습 그대로 렌더링된 토큰과 컴포넌트.</figcaption>
</figure>

<p><strong>프롬프트 예시:</strong></p>

<p><em>새 결제(checkout) 버튼을 프로토타이핑하고 싶어. 클릭하면 재생 애니메이션이 나오고 그다음 빠르게 보라색으로 바뀌는 거야. 이 애니메이션의 여러 옵션을 시험해 볼 수 있게 슬라이더와 옵션이 여러 개 있는 HTML 파일을 만들고, 잘 맞았던 파라미터를 복사할 수 있는 복사 버튼을 달아 줘.</em></p>

<p><strong>이런 데 쓰자:</strong></p>

<ul>
  <li>디자인 시스템 아티팩트 만들기</li>
  <li>컴포넌트 조정</li>
  <li>컴포넌트 라이브러리 시각화</li>
  <li>애니메이션 프로토타이핑</li>
</ul>

<h3 id="reports-research-and-learning">보고서, 리서치, 학습</h3>

<p>Claude Code는 여러 데이터 소스의 정보를 종합해서 읽기 좋은 보고서로 바꾸는 데 매우 효과적이다. Slack, 코드베이스, git 히스토리, 인터넷을 검색해서 읽기 쉬운 보고서를 만들어 달라고 프롬프트할 수 있다.</p>

<p>긴 HTML 문서, 인터랙티브한 설명서(explainer), 심지어 슬라이드쇼/덱 형태로도 구성할 수 있다. 시각화를 돕는 다이어그램은 SVG로 그려 달라고 하자.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/fig-e-reports.png" alt="“How rate limiting works”라는 제목의 설명서 페이지. 목차, TL;DR, 소스 줄에 링크된 접을 수 있는 요청 경로 4단계, 읽은 파일 목록, 탭으로 구분된 설정 스니펫이 있다." loading="lazy">
  <figcaption><b>FIG E</b>보고서: 내비게이션, 접을 수 있는 단계, 탭 스니펫이 있는 설명서.</figcaption>
</figure>

<p><strong>프롬프트 예시:</strong></p>

<p><em>우리 rate limiter가 실제로 어떻게 동작하는지 이해가 안 돼. 관련 코드를 읽고 HTML 설명서 페이지 하나를 만들어 줘. 토큰 버킷 흐름 다이어그램, 주석을 단 핵심 코드 스니펫 3~4개, 그리고 맨 아래에 "주의할 점(gotchas)" 섹션. 한 번만 읽을 사람에게 맞춰 최적화해 줘.</em></p>

<p><strong>이런 데 쓰자:</strong></p>

<ul>
  <li>기능 요약 작성</li>
  <li>설명서 생성</li>
  <li>주간 현황 보고서 초안</li>
  <li>장애(incident) 보고서 작성</li>
  <li>SVG 일러스트, 플로차트, 기술 다이어그램 제작</li>
</ul>

<h3 id="custom-editing-interfaces">맞춤 편집 인터페이스</h3>

<p>때로는 원하는 것을 텍스트 상자만으로 설명하기가 어렵다. 이런 경우 나는 Claude에게 지금 다루고 있는 바로 그 대상만을 위한 일회용 편집기를 만들어 달라고 자주 요청한다. 제품도, 재사용 가능한 도구도 아니고, 이 데이터 한 조각을 위해 특별히 만든 HTML 파일 하나다.</p>

<p>요령은 항상 내보내기(export)로 마무리하는 것이다. "JSON으로 복사" 또는 "프롬프트로 복사" 버튼을 두어, UI에서 내가 한 일을 Claude Code에 붙여 넣거나 파일로 커밋할 수 있는 무언가로 되돌리는 것이다. 당신은 여전히 루프 안에 있지만, 그 루프는 훨씬 촘촘해진다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/using-claude-code-the-unreasonable-effectiveness-of-html/flags-editor.png" alt="폼 형태로 렌더링된 flags.yaml 편집기. streaming과 billing 아래로 묶인 토글, 한 플래그에 붙은 의존성 경고, “Copy diff” 버튼이 있다. 클립보드에는 바뀐 두 키와 Claude에 붙일 프롬프트만 담긴다." loading="lazy">
</figure>

<p><strong>프롬프트 예시:</strong></p>

<ul>
  <li><em>이 Linear 티켓 30개의 우선순위를 다시 정해야 해. 각 티켓을 드래그할 수 있는 카드로 만들어 Now / Next / Later / Cut 열에 배치하는 HTML 파일을 만들어 줘. 네가 보기에 가장 적절하게 미리 정렬해 놓고. 최종 순서를 버킷마다 한 줄 근거와 함께 내보내는 "Markdown으로 복사" 버튼을 추가해 줘.</em></li>
  <li><em>우리 feature flag 설정이야. 폼 기반 편집기를 만들어 줘. 플래그를 영역별로 묶고, 플래그 사이의 의존성을 보여 주고, 전제 조건이 꺼져 있는 플래그를 켜려 하면 경고해 줘. 바뀐 키만 주는 "diff 복사" 버튼을 추가해 줘.</em></li>
  <li><em>이 시스템 프롬프트를 튜닝하고 있어. 나란히 놓인 편집기를 만들어 줘. 왼쪽에는 변수 슬롯이 강조된 편집 가능한 프롬프트, 오른쪽에는 채워진 템플릿을 실시간으로 다시 렌더링하는 샘플 입력 3개. 글자 수/토큰 수 카운터와 복사 버튼을 추가해 줘.</em></li>
</ul>

<p><strong>이런 데 쓰자:</strong></p>

<ul>
  <li>무엇이든 순서 바꾸기, 분류(triage)하기, 버킷으로 나누기(티켓, 테스트 케이스, 피드백)</li>
  <li>구조화된 설정 편집(feature flag, 환경 변수, 제약 조건이 있는 JSON/YAML)</li>
  <li>실시간 미리 보기와 함께 프롬프트, 템플릿, 문구 튜닝</li>
  <li>데이터셋 큐레이션: 행을 승인/거절하고, 예시에 태그를 붙이고, 선택한 것을 내보내기</li>
  <li>문서, 녹취록, diff에 주석을 달고 그 주석을 내보내기</li>
  <li>텍스트로 표현하기 괴로운 값 고르기: 색상, easing 곡선, 자르기 영역, cron 스케줄, 정규식</li>
</ul>

<h2 id="frequently-asked-questions">자주 묻는 질문</h2>

<p>Claude Code에서 HTML을 쓰는 것에 대해 가장 자주 받는 질문들과, 내가 실제로 매일 정착시킨 습관을 함께 적는다.</p>

<h3 id="isnt-it-less-efficient">덜 효율적이지 않나?</h3>

<p>Markdown이 토큰을 더 적게 쓰는 경우가 많긴 하지만, HTML의 더 높은 표현력과 내가 실제로 읽을 가능성이 훨씬 높다는 점 덕분에 전체적으로는 더 좋은 결과를 얻는다. Opus 4.7의 1MM(100만) 컨텍스트 윈도우에서는 늘어난 토큰 사용량이 컨텍스트 윈도우 안에서 거의 눈에 띄지 않는다.</p>

<h3 id="when-do-you-use-markdown-for-now">지금은 Markdown을 언제 쓰나?</h3>

<p>솔직히 거의 모든 일에서 Markdown 사용을 완전히 그만두었다. 다만 나는 아마 HTML 극대주의자 쪽으로 꽤 치우쳐 있을 것이다.</p>

<h3 id="is-this-how-youve-replaced-planning">이것이 계획(planning)을 대체한 방식인가?</h3>

<p>나는 계획을 하나만 두는 대신, 계획의 부분/단계마다 서로 다른 HTML 파일을 몇 개 두는 편이다. 예를 들어 HTML로 구현 계획을 만들고, UI 탐색을 위한 파일을 하나 더 만들고, 마지막으로 모든 디자인을 나열하는 HTML 컴포넌트를 만든다. 이 파일들은 나중을 위한 참고 자료로, 그리고 검증에 쓰기 위해 계속 보관하는 편이다.</p>

<h2 id="staying-in-the-loop-with-claude">Claude와 함께 루프 안에 머무르기</h2>

<p>위에서 말한 모든 것을 한마디로 하면, 내가 Markdown 대신 HTML을 쓰는 진짜 이유는 Claude와 함께 루프 안에 있다는 느낌을 훨씬 강하게 해 주기 때문이다. Claude가 더 많은 일을 맡게 되면서 나는 계획을 덜 꼼꼼히 읽고 있다는 것을 알아차렸고, Claude의 선택을 그냥 넘겨 버리는 대신 계속 관여할 방법을 원했다. HTML이 바로 그것이었다. 지금 나는 예전 어느 때보다 루프 안에 있다고 느낀다.</p>

<p><a href="https://claude.com/product/claude-code">Claude Code</a>로 시작해 보자.</p>

<p><em>이 글은 기술 스태프(member of technical staff) Thariq Shihipar가 썼으며, Claude Code에서 HTML 파일을 쓰는 것에 대한 그의 개인적인 의견과 애정을 담고 있다.</em></p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
