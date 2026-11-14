---
slug: "which-claude-model-should-you-build-with"
title: "어떤 Claude 모델로 만들어야 할까? Fable, Opus, Sonnet, Haiku"
nav: "Claude 모델 고르기 · Opus 5.5 medium에서 시작, 작업별 모델·effort 표, 비용·지연·컨텍스트 트레이드오프, 서브에이전트·advisor로 섞어 쓰기, 마이그레이션 호환성"
main: "claude.dev"
cat: "Playbooks"
date: "2026-11-09"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  .table-wrap { overflow-x: auto; margin: 0 0 20px; }\n  .table-wrap table { margin: 0; min-width: 560px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure img.phone { max-width: 360px; display:block; margin: 0 auto; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 21924
---

<!-- rendered HTML -->
<header>
  <h1>어떤 Claude 모델로 만들어야 할까? Fable, Opus, Sonnet, Haiku</h1>
  <div class="meta">
    2026년 11월 9일
    · 카테고리: Playbooks
    · 글쓴이: Addy Osmani
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/which-claude-model-should-you-build-with">Which Claude model should you build with? Fable, Opus, Sonnet, or Haiku</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">어떤 Claude 모델을 고를지, 각각 비용이 얼마인지, 그리고 여러 모델을 함께 쓰는 방법.</p>

<p>현재 Claude 라인업에는 정식 출시(GA)된 모델이 네 개 있다. Claude Haiku 5.5, Claude Sonnet 5.5, Claude Opus 5.5, Claude Fable 5.2다. Claude Mythos 5.2는 사이버보안과 생명과학 연구에서 가장 뛰어난 모델로, 검증 프로그램을 통해 제공된다.</p>

<p>Claude Platform 위에서 개발하거나 Claude Code로 작업한다면, 자주 하는 작업에 어떤 모델을 써야 할지 궁금할 수 있다. 이 글은 그 질문에 답하고, 트레이드오프를 어떻게 생각하면 되는지 설명한다.</p>

<figure>
  <video controls muted playsinline loop preload="metadata" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-a-alley.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-a-alley.jpg" aria-label="밤의 좁은 골목 사진 한 장과, Haiku 5.5·Sonnet 5.5·Opus 5.5·Fable 5.2가 그 골목을 코드로 그린 그림 네 개. 각각 첫 레이어부터 완성까지 쌓여 가는 모습."></video>
  <figcaption><b>FIG A</b>골목 사진 한 장을 Claude Haiku 5.5, Sonnet 5.5, Opus 5.5, Fable 5.2가 코드로 그린 결과. 각 이미지는 모델이 작성한 Python 프로그램이며, 그 프로그램이 호출하는 드로잉 엔진도 모델이 직접 만들었다. 첫 레이어부터 완성까지 보여 준다. 데모: Lance Martin.</figcaption>
</figure>

<h2 id="tldr">TL;DR</h2>

<p>짧게 답하면, 대부분의 작업은 Opus 5.5를 기본 effort 수준인 <code>medium</code>으로 두고 시작하면 된다.</p>

<p>Claude Code의 기본 모델인 데는 이유가 있다. 입력·출력 토큰당 가격이 Fable 5.2의 절반이고, 대부분의 코딩과 지식 작업(knowledge work)에서 먼저 써 보라고 권하는 모델이다.</p>

<p>거기서부터:</p>

<ul>
  <li>범위가 잘 정해진 일상 작업이라면 Sonnet 5.5로 내려간다. 버그 수정이나 스펙에 맞춰 만드는 기능 같은 것이다. 다만 스펙이 명확하다고 해서 무조건 Sonnet을 써야 하는 건 아니다. 마이그레이션이나 성능 최적화는 스펙이 명확해도 Opus 5.5가 필요할 만큼 어려울 수 있고, 큰 규모라면 Fable 5.2가 필요할 수도 있다.</li>
  <li>가장 단순한 대량 작업에는 Haiku 5.5까지 내려간다. 분류(classification), 라우팅(routing), 추출(extraction) 같은 것이다. Haiku 5.5는 더 큰 모델의 곁가지 작업을 맡는 서브에이전트(subagent)로 쓰기에도 좋다.</li>
  <li>코딩·금융·과학 분야에서 가장 어려운 기술 프로젝트라면 Claude Fable 5.2로 올라간다. Opus 5.5를 <code>high</code>로 올려도 부족할 때, 또는 사람이 지켜보지 않는 긴 실행(long unattended run)에도 올라간다.</li>
</ul>

<p>모델을 바꾸기 전에 먼저 effort 수준을 조정해 보자. effort는 비용과 능력 모두를 더 세밀하게 조절하는 다이얼이다. <code>high</code>를 넘어서면 effort를 한 단계 올리는 비용이 더 큰 모델로 바꾸는 비용과 맞먹을 수 있으니, 자기 작업에서 둘을 직접 비교하자. 이미 <code>high</code>를 넘겼다면, 대신 한 단계 위 모델을 더 낮은 effort로 테스트해 보자. 반대로 한 단계 내리는 것만으로도 더 낮은 요금에 원하는 결과를 얻을 수 있다.</p>

<p>더 높은 effort는 모델이 더 오래 생각하거나, 도구를 더 많이 호출하거나, 자기 작업을 더 많이 점검해야 할 때 도움이 된다. 다만 지연 시간(latency)도 늘어난다는 점을 기억하자. 또한 effort를 올린다고 해서 모델에 없던 지식이나 기술이 생기지는 않는다. 그게 필요하다면 여전히 더 큰 모델로 올라가야 한다.</p>

<h2 id="pick-a-model-by-task">작업별 모델 고르기</h2>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>작업</th><th>시작 모델</th><th>시작 effort</th><th>이유</th></tr>
  </thead>
  <tbody>
    <tr><td>일상적인 엔지니어링과 디버깅. 여러 PR에 걸친 기능 작업</td><td>Opus 5.5</td><td><code>medium</code>(기본값), 그다음 <code>high</code></td><td>일상 작업에서 비용과 능력의 균형.</td></tr>
    <tr><td>분류, 라우팅, 태깅, 대량 추출</td><td>Haiku 5.5</td><td><code>medium</code>(기본값)</td><td>모델 제품군 중 비용과 지연 시간이 가장 낮다.</td></tr>
    <tr><td>파일 검색, 로그 읽기, 요약을 하는 서브에이전트</td><td>Haiku 5.5 또는 Sonnet 5.5</td><td>모델의 기본값</td><td>틀린 답을 쉽게 알아챌 수 있고, 판단이 필요한 결정은 어차피 메인 모델이 내린다.</td></tr>
    <tr><td>채팅과 대화형 세션</td><td>Sonnet 5.5(단순한 대량 채팅이면 Haiku 5.5)</td><td><code>low</code> 또는 <code>medium</code></td><td>Sonnet 5.5는 빠르다. 특히 <code>low</code>나 <code>medium</code> effort에서.</td></tr>
    <tr><td>범위가 잘 정해진 코딩: 버그 수정, 기능 반복 개선, 스펙 기반 작업</td><td>Sonnet 5.5</td><td><code>medium</code>, 더 어려운 작업이면 <code>high</code></td><td>Opus 5.5의 절반 토큰 가격으로 범위가 정해진 작업을 잘 처리한다.</td></tr>
    <tr><td>일상적인 문서, 슬라이드, 스프레드시트</td><td>Sonnet 5.5</td><td><code>high</code>(기본값. Claude Code에서는 <code>medium</code>)</td><td>반복이 빠르고 디자인 감각이 좋다. 복잡한 재무 모델이나 방대한 원자료로 만드는 문서라면 Opus 5.5로 시작하자.</td></tr>
    <tr><td>조사, 리뷰, 초안 작성처럼 반복해서 돌리는 에이전트 작업</td><td>Sonnet 5.5</td><td><code>medium</code></td><td>잘 정의된 반복 작업에는 더 큰 모델이 필요한 경우가 드물다.</td></tr>
    <tr><td>컴퓨터 사용(computer use)과 비전 중심 워크플로우</td><td>Opus 5.5</td><td><code>medium</code></td><td>수많은 스크린샷과 이미지를 다루는 긴 에이전트 루프로, Opus 5.5가 겨냥한 장시간 에이전트 작업에 해당한다.</td></tr>
    <tr><td>대규모 리팩터링과 마이그레이션, 아키텍처 계획, 많은 서브에이전트 지휘</td><td>Fable 5.2</td><td><code>medium</code>, 그다음 <code>high</code>(API 기본값은 <code>high</code>)</td><td>기술 분야에서 Anthropic이 정식 출시한 모델 중 가장 뛰어나다.</td></tr>
    <tr><td>심층 리서치, 과학적·정량적 분석</td><td>Fable 5.2</td><td><code>medium</code>, 그다음 <code>high</code>(API 기본값은 <code>high</code>)</td><td>코딩·금융·과학 분야의 가장 어려운 기술 프로젝트를 위해 만들어졌다.</td></tr>
    <tr><td>아직 잘 모르겠다</td><td>Opus 5.5</td><td><code>medium</code>(기본값)</td><td>Pro, Max, Ultra, Team, Enterprise와 Anthropic API에서 Claude Code가 기본으로 쓰는 모델이고, 플랫폼 문서도 출발점으로 권한다.</td></tr>
  </tbody>
</table>
</div>

<h2 id="the-four-models-side-by-side">네 모델 나란히 비교</h2>

<div class="table-wrap">
<table>
  <thead>
    <tr><th></th><th>Haiku 5.5</th><th>Sonnet 5.5</th><th>Opus 5.5</th><th>Fable 5.2</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>용도</strong></td><td>대량·비용 민감 작업</td><td>범위가 정해진 작업을 빠르고 유능하게 돕기</td><td>복잡한 코딩과 지식 작업을 위한 일상용 주력 모델</td><td>가장 야심 차고 열린(open-ended) 기술 작업</td></tr>
    <tr><td><strong>상대적 지연 시간</strong></td><td>가장 빠름</td><td>빠름</td><td>보통</td><td>보통</td></tr>
    <tr><td><strong>입력 / 출력, 100만 토큰당</strong></td><td>프롬프트 10만 토큰 이하 $0.10 / $0.50, 10만 초과 $0.50 / $2.50</td><td>$2 / $10</td><td>$4 / $20</td><td>$8 / $40</td></tr>
    <tr><td><strong>캐시 읽기(cache read), 100만 토큰당</strong></td><td>10만 이하 $0.01, 10만 초과 $0.05</td><td>$0.10</td><td>$0.20</td><td>$0.20</td></tr>
    <tr><td><strong>컨텍스트 윈도</strong></td><td>100만 토큰</td><td>100만 토큰</td><td>100만 토큰</td><td>100만 토큰</td></tr>
    <tr><td><strong>최대 출력</strong></td><td>12.8만 토큰</td><td>12.8만 토큰</td><td>12.8만 토큰</td><td>12.8만 토큰</td></tr>
    <tr><td><strong>API에서의 thinking</strong></td><td>adaptive, 기본으로 켜져 있고 끌 수 있음</td><td>adaptive, 기본으로 켜져 있음. <code>between_tools</code>는 시작 전 thinking을 건너뜀</td><td>adaptive, 항상 켜짐</td><td>adaptive, 항상 켜짐</td></tr>
    <tr><td><strong>API 기본 effort</strong>(Claude Code는 다를 수 있음. <code>/effort status</code>로 확인)</td><td><code>medium</code></td><td><code>high</code>(Claude Code에서는 <code>medium</code>)</td><td><code>medium</code></td><td><code>high</code>(Claude Code에서는 <code>medium</code>)</td></tr>
    <tr><td><strong>Fast mode</strong></td><td>없음</td><td>없음</td><td>있음</td><td>있음</td></tr>
  </tbody>
</table>
</div>

<p>가격은 Claude API 정가(list price)다. 벤치마크 결과는 <a href="https://www.anthropic.com/claude/fable">Fable 5.2 페이지</a>를 참고하자.</p>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-b-portfolio.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-b-portfolio.jpg" aria-label="Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5가 각각 만든 포트폴리오 사이트 네 개를 나란히 보여 준다."></video>
  <figcaption><b>FIG B</b>Claude Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5가 같은 포트폴리오 사이트를 각각 만든 결과를 나란히 보여 준다. 데모: Addy Osmani.</figcaption>
</figure>

<h2 id="the-trade-offs">트레이드오프</h2>

<p>모델을 고르는 건 트레이드오프를 정하는 일이다. 예를 들어 더 큰 모델을 고르면 지연 시간 대신 능력을 택하는 것이다. 따져 봐야 할 주요 트레이드오프는 다음과 같다.</p>

<h3 id="capability-and-cost-per-finished-task">능력과 완료 작업당 비용</h3>

<p>일반적으로 더 큰 모델은 토큰당 비용이 더 비싸고 능력도 더 뛰어나다. 하지만 작업 단위로 보면 이 비용 대 능력의 트레이드오프가 언제나 성립하지는 않는다.</p>

<p>토큰당 가격이 높다고 해서 작업당 비용이 항상 더 높거나 결과가 항상 더 좋은 건 아니다. <a href="https://claude.dev/blog/spending-your-effort/">Spending your effort</a>에서 보여 줬듯이, Anthropic이 돌린 Terminal-Bench 3.0에서 이전 Fable인 5.1은 <code>max</code>로 58.0%를 기록했고, Opus 5.5는 <code>high</code>에서 절반의 토큰으로 58.9%를 기록했다.</p>

<p>가장 어려운 작업에서는 가격 차이가 좁혀질 수 있다. FrontierCode 2.0에서 Fable 5.2의 <code>high</code>는 Opus 5.5의 <code>max</code>와 거의 같은 점수(45.3% 대 45.5%)를 작업당 약 절반의 비용으로 냈다. 그러니 어려운 작업에서 Opus 5.5를 <code>high</code> 너머로 올리기 전에 Fable 5.2를 테스트해 보자. 일상 작업이라면 여전히 Opus 5.5 <code>medium</code>이 출발점이다. 벤치마크 결과는 <a href="https://www.anthropic.com/claude-fable-and-mythos-5-2">출시 글</a>을 참고하자.</p>

<p>한편 Claude Platform의 <a href="https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence">비용·지능 측정 결과</a>는 작은 모델의 한계도 보여 준다. 작은 모델은 대체로 출력을 검증할 수 있는 대량 작업에서는 잘하지만, 긴 에이전트 루프에는 덜 적합하다.</p>

<p>두 모델을 비교할 때는 일반적인 작업뿐 아니라 가장 어려운 작업의 비용도 따져 보자. 지출의 대부분이 가장 어려운 작업에서 나오기 때문이다. 20문제짜리 검색 벤치마크 하나에서는 두 문제가 전체 지출의 43%를 차지했다.</p>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-c-render-styles.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-c-render-styles.jpg" aria-label="3D 호숫가 장면 하나를 와이어프레임과 픽셀 아트부터 레이 트레이싱까지 열여섯 가지 렌더링 스타일로 다시 그린다."></video>
  <figcaption><b>FIG C</b>Fable 5.2가 게임 엔진이 세계를 만드는 방식을 보여 준다. 3D 장면 하나를 와이어프레임과 픽셀 아트부터 레이 트레이싱까지 열여섯 가지 모습으로 그리고, 각 기법에 이름표를 붙인다. 데모: Dan Fein.</figcaption>
</figure>

<h3 id="latency-against-accuracy">지연 시간 대 정확도</h3>

<p>더 빠른 설정은 더 일찍 끝나지만 더 많이 놓칠 수 있다. 모델과 effort 수준을 고르기 전에, 사람이 얼마나 기다릴 수 있는지부터 생각해 보자. 사람이 기다리는 응답이라면 Sonnet 5.5를 <code>low</code>나 <code>medium</code>으로 시작하자.</p>

<p>다음 세대 모델은 이전 모델보다 빠른 경우가 많다. Fable 5.2는 Fable 5.1보다 출력을 최대 30% 빠르게 생성한다. Sonnet 5.5는 Sonnet 5보다 30% 빠르게 돌아간다.</p>

<p>effort 수준과 지연 시간은 대략 비례한다. 얻는 정확도가 늘어나는 지연 시간만큼 가치가 있는지 판단하자. 예를 들어 SWE-bench Pro에서 Opus 5.5의 <code>medium</code>은 <code>high</code> 설정보다 약 2.5점 낮았고 비용은 약 70%였다. <code>low</code>는 약 8점 낮았고 비용은 약 3분의 1이었다. <code>xhigh</code>는 약 1.4점 높았고 비용은 <code>high</code>의 2.5배였다.</p>

<p>effort 수준을 바꾸는 것보다 자기 검증(self-verification) 수단을 마련해 주는 편이 비용 효율이 더 좋고 지연 시간도 덜 늘어나는 경우가 많다. 모델이 작업에 충분하지 않다면 다음 단계를 순서대로 밟자.</p>

<ol>
  <li>모델이 자기 작업을 검증할 수 있는지 확인한다. 테스트, 빌드, 또는 엔드포인트를 호출하는 스크립트 같은 것으로.</li>
  <li>effort를 한 단계 올린다.</li>
  <li>한 단계 위 모델로 옮긴다. 이때 작은 모델에서 쓰던 것보다 낮은 effort 수준에서 시작한다.</li>
</ol>

<p>결과를 자동으로 확인할 수 있다면, 모든 작업을 낮은 수준으로 돌리고 실패한 것만 높은 수준으로 다시 돌리자. 같은 SWE-bench Pro 하위 집합에서, Opus 5.5 <code>low</code>로 돌리고 실패한 것만 <code>high</code>로 다시 돌렸더니 작업당 약 $0.17에 약 97%를 통과했다. 모든 작업을 <code>high</code>로 돌렸을 때는 $0.29에 95.3%였다.</p>

<p>같은 모델에서 더 빠른 응답이 필요하다면, 능력을 포기하는 대신 속도에 돈을 낼 수도 있다. Claude API에서 Opus 5.5와 Fable 5.2는 둘 다 <a href="https://platform.claude.com/docs/en/build-with-claude/fast-mode">fast mode</a>를 제공해, 프리미엄 가격으로 더 높은 출력 속도를 낸다.</p>

<h3 id="context-against-cost">컨텍스트 대 비용</h3>

<p>현 세대의 모든 모델은 100만 토큰 컨텍스트 윈도를 갖고 있다. 큰 컨텍스트는 모델이 작업을 완수하는 데 도움이 될 수 있지만, 매 턴마다 비용이 든다. 턴마다 컨텍스트를 다시 보내기 때문이다. 그렇긴 해도 <a href="https://claude.com/blog/claude-opus-5-5-built-for-coding-sessions-that-use-more-context">긴 실행에서는 입력의 대부분이 캐시 읽기로 청구된다</a>.</p>

<p>Opus 5.5의 캐시 읽기는 100만 토큰당 $0.20, Sonnet 5.5는 $0.10이다. Fable 5.2도 같은 $0.20이므로, 캐시 비중이 큰 긴 실행에서 Fable과 Opus의 차이는 캐시되지 않은 입력과 출력에서 나온다. 여기서는 Fable이 토큰당 두 배 비싸다.</p>

<p><a href="https://claude.dev/blog/what-a-task-costs-on-opus-5-5/">What a task costs on Opus 5.5</a>에 따르면, 컨텍스트가 15만 토큰일 때 한 턴의 캐시 읽기는 약 $0.03이다. 2만 토큰이면 약 $0.004다.</p>

<p>여기서 얻을 수 있는 교훈 하나는, 메인 모델이 클수록 메인 컨텍스트를 가볍게 유지하는 게 더 중요하다는 것이다. 비싼 모델의 컨텍스트는 결정을 위해 남겨 두고, 장황한 읽기는 더 저렴한 서브에이전트에게 맡기자.</p>

<p>Haiku 5.5는 프롬프트 길이에 따라 토큰 가격이 달라지는 유일한 모델이다. 10만 토큰 이하 프롬프트는 낮은 구간으로 청구되고, 10만 토큰을 넘는 프롬프트는 그 다섯 배 요금으로 청구된다. 긴 프롬프트 구간도 여전히 Sonnet 5.5의 토큰당 가격의 4분의 1이다. 그래서 Haiku 5.5는 짧은 프롬프트에서 가장 이득인데, 이때 입력 가격은 Sonnet 5.5의 20분의 1이다.</p>

<p>모든 호출에 긴 프롬프트가 필요하다면, Haiku 5.5와 Sonnet 5.5를 정가가 아니라 완료 작업당 비용으로 비교하자.</p>

<h2 id="mixing-models">모델 섞어 쓰기</h2>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-d-coffee-shop.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-d-coffee-shop.jpg" aria-label="네 모델이 동시에 만드는 온라인 커피숍 하나. Fable 5.2는 코드를 TypeScript로 마이그레이션하고, Opus 5.5는 구독 기능을 만들고, Sonnet 5.5는 상품 페이지를 쓰고, Haiku 5.5는 고객 메시지를 분류한다."></video>
  <figcaption><b>FIG D</b>프로젝트 하나, 모델 넷, 각자 한 종류의 일을 맡는다. Claude Fable 5.2는 온라인 상점을 JavaScript에서 TypeScript로 옮기고, Opus 5.5는 월간 구독 기능을 만든다. Sonnet 5.5는 상품 페이지를 쓰고, Haiku 5.5는 고객 메시지를 분류한다. Opus 5.5는 Fable 5.2의 새 코드가 들어온 뒤에 자기 기능을 시작한다. 데모: Dan Fein.</figcaption>
</figure>

<h3 id="switch-at-a-natural-break">자연스러운 끊김 지점에서 바꾸기</h3>

<p>프롬프트 캐시는 그것을 쓴 모델의 것이다. 새 모델에서의 첫 턴은 대화 전체에 대해 캐시 쓰기(cache write) 가격을 낸다. 그 턴을 작게 만들려면 Claude Code에서 먼저 <code>/compact</code>를 실행하거나, 짧은 계획서를 써서 새 세션을 시작하자. API에서는 전체 기록 대신 지금까지의 작업 요약으로 새 모델의 대화를 시작하자.</p>

<p>각 thinking 블록에는 그것을 만든 모델이 기록되고, 각 모델은 다른 모델 중 일부의 블록만 읽는다. Claude API와 Claude Models on Google Cloud(Google 관리형)에서 Opus 5.5는 Sonnet 5.5와 Haiku 5.5의 thinking 블록을 읽는다. Sonnet 5.5는 Haiku 5.5의 블록을 읽는다. Fable 5.2는 Opus 5.5, Sonnet 5.5, Haiku 5.5의 블록을 읽는다. Claude API에서 Fable 5.1은 Opus 5.5의 블록을 읽는다.</p>

<p>한 단계 아래 모델로 옮기면 앞선 추론을 잃는다. 모델은 자기보다 위 모델의 블록을 절대 읽지 않기 때문이다. 다른 이동에서도 잃을 수 있다. 새 모델이 이전 모델의 thinking 블록을 읽을 수 없으면 API가 그 블록을 버리고, 요청은 그대로 성공한다. 그러면 새 모델은 그 추론 없이 작업한다.</p>

<p><a href="https://platform.claude.com/docs/en/build-with-claude/preserved-thinking">Preserved thinking</a> 문서에 모든 경우가 나와 있다. Fable 5.2에서 다른 정식 출시 모델로 옮기면 그 추론은 모두 버려진다.</p>

<h3 id="put-subagents-on-smaller-models">서브에이전트는 더 작은 모델에</h3>

<p>서브에이전트는 자기만의 컨텍스트 윈도에서 실행되고 요약을 돌려준다. 서브에이전트의 토큰은 그것이 돌아가는 모델의 요금으로 청구된다. Claude Code에서는 서브에이전트 정의에 <code>model: haiku</code>나 <code>model: sonnet</code>을 지정하자. <code>CLAUDE_CODE_SUBAGENT_MODEL</code> 환경 변수는 모델을 지정하지 않은 서브에이전트의 기본값을 정한다.</p>

<p>다음을 <code>.claude/agents/log-reader.md</code>로 저장하자.</p>

<pre><code>---
name: log-reader
description: Reads test output and logs, and reports each failing case. Use after a test run.
tools: Read, Grep, Glob, Bash
model: haiku
---
Read the logs you're given. For each failure, report the file, the test name and the first error line. Don't edit any files.</code></pre>

<p>작은 모델에는 파일 찾기, 테스트 실행, 로그 읽기처럼 실수를 쉽게 알아챌 수 있는 일을 맡기자. 코드 수정과 판단이 필요한 결정은 메인 모델에 두자. 작은 모델이 검색 결과를 잘못 읽으면, 메인 모델이 엉뚱한 파일을 열고 거기에 토큰을 쓰게 된다.</p>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-e-presidio-map.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/which-claude-model-should-you-build-with/fig-e-presidio-map.jpg" aria-label="샌프란시스코 프레시디오 지도. 고도, 자전거 경로, 안개, 기온을 요청하는 입력이 들어올 때마다 옆 패널의 Haiku 5.5 서브에이전트 목록으로 나뉘어 퍼지고, 서브에이전트들이 각자 맡은 부분을 지도 위에 그린다."></video>
  <figcaption><b>FIG E</b>보는 사람이 고도, 자전거 경로, 안개, 기온 같은 레이어를 요청한다. Opus 5.5가 작업을 계획하고, 병렬로 돌아가는 Haiku 5.5 서브에이전트들이 공유 지도 위에 조각을 그린다. 기온은 예시이고 안개는 인상을 표현한 것일 뿐 예보가 아니다. 지도 데이터 © OpenStreetMap 기여자, 고도는 USGS 3DEP 라이다. 데모: Lance Martin.</figcaption>
</figure>

<p>현재 버전의 Claude Code에서 내장 Explore 서브에이전트는 항상 Haiku에서 돌지 않고 세션의 모델에서 돈다. Claude API에서는 그 모델이 Opus로 상한이 걸린다. 탐색 비용을 낮게 유지하려면 <code>model: haiku</code>를 지정한 <code>Explore</code>라는 이름의 서브에이전트를 직접 정의하자. <code>haiku</code> 별칭이 가리키는 모델은 <code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code>로 고정할 수 있다.</p>

<p>Anthropic API에서 <code>haiku</code> 별칭은 이제 Haiku 5.5를 가리키며, 이를 쓰려면 Claude Code v2.1.293 이상이 필요하다. Amazon Bedrock, Google Cloud, Microsoft Foundry, Claude Platform on AWS에서는 여전히 Haiku 4.5를 가리킨다. 자세한 내용은 Claude Code의 <a href="https://code.claude.com/docs/en/model-config">모델 설정(model configuration)</a> 문서에 있다.</p>

<p>Claude Code에는 <code>opusplan</code> 별칭도 있다. plan mode에서는 Opus로 계획하고, 그 계획의 실행은 Sonnet으로 한다. 그러면 코드 수정이 Sonnet에 맡겨진다. 위의 조언은 그 반대다. 코드 수정은 메인 모델에 두고, 작은 모델에는 실수를 쉽게 알아챌 수 있는 일만 준다. <code>opusplan</code>을 기본값으로 삼기 전에 자기 작업에서 측정해 보자.</p>

<h3 id="escalate-hard-decisions-to-an-advisor">어려운 결정은 advisor에게 올리기</h3>

<p><a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool">advisor tool</a>(베타)은 더 빠르고 저렴한 실행자(executor) 모델과 더 강한 조언자(advisor) 모델을 짝짓는다. 실행자가 작업을 수행하다가 중간에 조언자에게 지침을 물을 수 있다. 토큰 대부분은 실행자의 요금으로 청구된다. 조언자는 실행자에게 없는 능력을 더해 줄 때, 그리고 실행자가 조언을 구할 때만 도움이 되는데, effort가 낮을수록 실행자는 조언을 덜 구한다.</p>

<p><strong>효과를 볼 만한 곳:</strong> 대부분의 턴이 일상적인 에이전트 작업. 플랫폼의 비용 가이드는 신중한 입장이다. advisor 표에 있는 네 가지 조합 중 어느 것도 실행자 단독보다 확실히 낫지 않았고, 조언자는 실행자가 물어볼 때만 도울 수 있다. 먼저 실행자의 조언 요청 비율(consult rate)을 측정하자. 실행자가 어떤 조언자를 받아들이는지도 확인하자. 예를 들어 Sonnet 5.5 실행자는 Fable 5.2, Opus 5.5, Opus 5, Sonnet 5.5를 받아들이고, Fable 5.2 실행자는 Fable 5.2나 Mythos 5.2만 받아들인다.</p>

<p><strong>별 도움이 안 되는 곳:</strong> 그 조합 중 하나는 내부 코딩 벤치마크에서 Opus 5.5 <code>high</code> 실행자에 Fable 5.1 조언자를 붙인 것이었다. 시도당 $2.92에 90.1%를 기록했다. Opus 5.5 <code>high</code> 단독보다 1.7점 높지만 비용은 약 2.1배다. 그 정도 향상은 실행 간 노이즈의 경계선에 있고, effort를 올렸어도 얻었을 만한 정도다.</p>

<h3 id="delegate-bulk-work-to-cheaper-workers">대량 작업은 더 저렴한 작업자에게 위임하기</h3>

<p>앞서 본 서브에이전트는 메인 모델 하나가 흐름을 쥐고 있는 동안 곁가지 작업을 처리한다. 이 패턴은 컨텍스트 윈도 하나보다 큰 작업을 위한 것이다. 최상위 모델이 이끌면서 작업을 쪼개고, 조각들을 더 저렴한 여러 작업자(worker)에게 병렬로 넘긴 뒤, 돌아온 결과를 합친다. 약 2,200만 토큰 분량의 소스 코드를 대상으로 한 내부 결함 탐색 벤치마크에서, Opus 5.5 리더가 Sonnet 5.5 작업자를 한 번에 최대 25개까지 부린 구성은 Opus 5.5를 기본 effort로 단독 실행한 것보다 비용이 약 3분의 1 적게 들었다. 점수는 거의 같았다.</p>

<p>Claude Platform에서는 Claude Managed Agents의 <a href="https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration">멀티에이전트 오케스트레이션(multiagent orchestration)</a>이 코디네이터 에이전트와 작업자 명단을 제공한다. 서로 의존하는 단계가 한 줄로 이어지는 작업이나 컨텍스트 윈도 하나에 들어가는 작업에는 쓰지 말자. 그런 경우에는 계획하고 합치는 비용이 아끼는 비용보다 크다. <a href="https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop">When to fold subagents into your main agent loop</a>에서 에이전트 루프 하나가 서브에이전트 팀보다 나은 경우를 다룬다.</p>

<h2 id="check-compatibility-before-migrating">마이그레이션 전에 호환성 확인하기</h2>

<p>모델 선택은 대체로 능력과 비용의 문제지만, 모델 이름만 바꾸고 나머지는 그대로 둘 수 있는 건 아니다. 현재 모델은 모두 도구 사용(tool use)과 이미지 입력을 지원하지만, 요청을 한 모델에서 다른 모델로 옮기기 전에 테스트해야 할 차이가 있다.</p>

<ul>
  <li><strong>Fable 5.2는 preserved thinking을 모든 API 계정으로 확대한다.</strong> Fable 5.2 thinking 블록 앞의 무언가가 바뀌었다면(시스템 프롬프트, 도구, 이전 메시지 포함) API는 그 요청을 400 오류로 거부한다. 영향받는 thinking을 버리도록 옵트인하지 않는 한 그렇다. Claude Code, Claude Agent SDK, Claude Managed Agents를 통해 요청을 만든다면 바꿀 것이 없다. 자체 코드가 기록을 편집한다면 추가 전용(append-only)으로 유지하고, 바꾸기 전에 테스트하자.</li>
  <li><strong>Thinking.</strong> Opus 5.5와 Fable 5.2는 항상 thinking을 하며, thinking을 끄는 요청은 오류를 반환한다. Sonnet 5.5는 기본으로 thinking을 하고, <code>between_tools</code>는 thinking을 도구 호출 사이로 제한한다. Haiku 5.5는 기본으로 thinking을 하며, <code>high</code> 이하 effort에서는 끌 수 있다. 어느 모델이든 응답이 thinking 블록으로 시작할 수 있으므로 콘텐츠 블록은 <code>type</code>으로 읽자.</li>
  <li><strong>강제 도구 사용(forced tool use).</strong> Sonnet 5.5, Opus 5.5, Fable 5.2에서 <code>tool_choice</code>를 <code>any</code>나 <code>tool</code>로 보내면 400 오류가 난다. <code>auto</code>를 보내고, 도구를 <code>strict: true</code>로 표시하고, 언제 그 도구를 쓸지 프롬프트에 적자.</li>
  <li><strong>컴퓨터 사용(computer use).</strong> Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.2는 Claude API와 Claude Models on Google Cloud(Google 관리형)에서 <code>computer_toolset_20260801</code> toolset을 통해서만 컴퓨터 사용을 지원한다.</li>
  <li><strong>Haiku 4.5에서 Haiku 5.5로.</strong> <code>budget_tokens</code>를 effort 수준으로 바꾸고, 기본값이 아닌 <code>temperature</code>, <code>top_p</code>, <code>top_k</code> 값은 빼자. 400 오류가 난다. <code>messages</code>는 사용자 턴으로 끝내자. 모델이 이어 쓰도록 마지막에 assistant 턴을 두면 이것도 400 오류가 난다.</li>
  <li><strong>안전 폴백(safety fallback).</strong> Opus 5.5, Sonnet 5.5, Fable 5.2는 안전 분류기(safety classifier)를 돌리며, 주로 사이버보안과 생물학 콘텐츠를 걸러 낸다. Claude Code에서는 걸린 요청이 이전 모델에서 다시 실행될 수 있고, 기록(transcript)에 어떤 모델인지 알리는 표시가 나온다. Fable 5.2는 Fable 5.1이 쓰는 폴백 모델을 그대로 유지한다. 걸린 사이버보안 요청은 Opus 4.8로, 걸린 생물학 요청은 Opus 5로 넘어간다.</li>
</ul>

<p>한 시스템이 여러 모델을 돌린다면, 모든 요청을 그중 가장 까다로운 모델에 맞춰 만들자. 기록은 추가 전용으로 유지하고, strict 도구와 함께 <code>tool_choice: auto</code>를 보내고, 콘텐츠 블록은 <code>type</code>으로 읽고, 프롬프트와 도구 설명은 가장 문자 그대로 받아들이는 모델에게도 통할 만큼 정확하게 쓰자. 그러면 코드를 바꾸지 않고도 한 단계를 위아래 등급으로 옮길 수 있다. 단계 유형마다 모델 하나처럼 라우팅 규칙이 단순하다면, 모델에게 고르라고 하지 말고 코드가 모델을 고르게 하자.</p>

<h2 id="measure-on-your-own-work">자기 작업으로 측정하기</h2>

<p>위의 SWE-bench Pro나 Terminal-Bench 수치 같은 공개 결과는 출발 모델을 정해 준다. 그다음에는 확정하기 전에 후보들을 자기 작업에서 테스트하자.</p>

<ol>
  <li>실제 작업 샘플을 뽑는다. 각 작업마다 통과하는 테스트, 닫힌 티켓, 올바른 행 수 같은 결과 확인 기준(outcome check)을 쓴다.</li>
  <li>후보 모델마다 두세 가지 effort 수준으로 돌린다. 실행끼리 캐시를 공유하지 않도록 각각 별도 세션에서 돌린다. 각 응답의 <code>usage</code> 필드에서 완료 작업별 비용을 기록한다.</li>
  <li>점수 대 지출을 그래프로 그린다. 멀티 모델 구성은 그 차트에서 모든 단일 모델 지점보다 나을 때만 유지한다.</li>
  <li>전환하기 전에, 우승한 구성을 실제 트래픽 일부에 섀도(shadow)로 돌려 본다.</li>
</ol>

<p>Claude Code에서 빠르게 확인하려면, 밀린 작업 하나를 <code>/model</code>로 두 모델에서 돌리고 <code>/usage</code>가 보고하는 값을 비교하자.</p>

<h2 id="learn-more">더 알아보기</h2>

<ul>
  <li><a href="https://claude.dev/blog/building-with-claude-sonnet-5-5/">Building with Claude Sonnet 5.5</a>는 Opus 대신 Sonnet을 고를 때, 가격, 마이그레이션, 튜닝을 다룬다.</li>
  <li><a href="https://claude.dev/blog/getting-the-most-out-of-opus-5-5/">Getting the most out of Opus 5.5 in Claude and Claude Code</a>는 Opus 5.5 프롬프팅과 긴 실행의 방향 잡기를 다룬다.</li>
  <li><a href="https://claude.dev/blog/what-a-task-costs-on-opus-5-5/">What a task costs on Opus 5.5</a>는 effort, 모델 선택, 서브에이전트의 비용을 따진다.</li>
  <li>Claude 블로그의 <a href="https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case">사용 사례에 맞는 최적의 Claude 모델 고르기</a>와 <a href="https://claude.com/blog/claude-model-and-effort-level-in-claude-code">Claude Code에서 모델과 effort 수준 고르기</a>가 더 깊이 다룬다.</li>
  <li>문서로는 <a href="https://platform.claude.com/docs/en/about-claude/models/choosing-a-model">Choosing a model</a>, <a href="https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence">Optimizing for cost and intelligence</a>, <a href="https://platform.claude.com/docs/en/build-with-claude/effort">Effort</a>, Claude Code의 <a href="https://code.claude.com/docs/en/model-config">model configuration</a>과 <a href="https://code.claude.com/docs/en/sub-agents">subagents</a>를 보자.</li>
</ul>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
