---
slug: "automating-eval-design-and-hillclimbing"
title: "Claude로 eval 설계와 hillclimbing 자동화하기"
nav: "eval 설계·hillclimbing 자동화 · 좋은 eval 4요소, 과적합 방지, /claude-api build-eval·hillclimb"
main: "claude.dev"
cat: "Playbooks"
date: "2026-09-28"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.95rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  td.nw, th.nw { white-space: nowrap; }\n  td.num, th.num { text-align: right; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 16170
---

<!-- rendered HTML -->
<header>
  <h1>Claude로 eval 설계와 hillclimbing 자동화하기</h1>
  <div class="meta">
    2026년 9월 28일
    · 카테고리: Playbooks
    · 글쓴이: Lance Martin
    · 읽는 시간: 12분
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/automating-eval-design-and-hillclimbing">Automating eval design and hillclimbing with Claude</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">스스로를 속이지 않고 eval을 설계하고 그 eval에 맞춰 hillclimbing하는 원칙, 그리고 claude-api 스킬의 build-eval·hillclimb 명령이 그 원칙을 어떻게 실제로 적용하는지.</p>

<p>평가(evaluation, 이하 eval)는 앱이나 스킬이 특정 작업을 얼마나 잘 수행하는지에 대한 신호를 준다. 하지만 eval을 설계하는 것, 그리고 스스로를 속이지 않으면서 그 eval 성능을 끌어올리는 것은 어렵다. 우리는 이 두 가지에 대한 가이드를 <a href="https://github.com/anthropics/skills/tree/main/skills/claude-api">claude-api 스킬</a>에 추가했다.</p>

<p>이 스킬을 쓰면 <code>/claude-api build-eval</code>로 코드베이스 안에 eval을 만들고, <code>/claude-api hillclimb</code>로 그 eval에 맞춰 애플리케이션을 한 번에 한 가지씩 바꿔 가며 개선할 수 있다. 과적합(overfitting)을 잡아내기 위한 홀드아웃(held-out) 예제 세트도 함께 쓴다.</p>

<p>이 글에서는 먼저 좋은 eval 설계와 hillclimbing의 원칙을 짚고, 그다음 <code>claude-api</code> 스킬을 쓰는 Claude Code가 그 원칙을 어떻게 적용하는지 보여 준다. 마지막으로 이 명령들의 예시 몇 가지로 마무리한다.</p>

<h2 id="eval-design">Eval 설계</h2>

<p>잘 설계된 eval에는 몇 가지 공통 요소가 있다(그림 1).</p>

<ol>
<li><strong>Eval 작업이 프로덕션을 반영한다.</strong> "프로덕션", 즉 테스트하려는 능력이나 애플리케이션이 실제로 쓰일 환경에서 여러분이 신경 쓰는 작업을 샘플링하자. 때로는 만들기 쉽거나 채점하기 쉽다는 이유로 작업이 선택된다. 하지만 작업 분포가 여러분이 <em>실제로</em> 신경 쓰는 것을 대표하도록 하는 것이 중요하다.</li>
<li><strong>더 강한 모델과 더 많은 사고(thinking)로 성능이 올라간다.</strong> 더 유능한 모델과 더 높은 effort 수준은 보통 eval에서 더 좋은 성능을 내야 한다. 그렇지 않다면, 모호한 작업이나 보정이 잘못된 채점기(grader)가 성능의 발목을 잡고 있는 경우가 많다.</li>
<li><strong>프런티어에 "통과할 만한" 여유(headroom)가 있다.</strong> 가장 유능한 모델을 가장 높은 effort로 돌려도 eval 점수가 100%에 한참 못 미쳐야 한다. 그렇지 않으면 변경이 성능에 어떤 영향을 주는지 신뢰성 있게 판단할 수 없다. 중요한 건, 그 격차가 불가능하거나 모호한 작업 때문이어서는 안 된다는 점이다. 흔한 징후는 반복 횟수와 무관하게 모든 eval 실행에서 실패하는 작업이다. 좋은 작업이란 도메인 전문가 두 명이 같은 판정에 도달하고, 채점기가 확인하는 모든 것이 작업 안에 명시되어 있는 작업이다.</li>
<li><strong>실행 간 분산(run-to-run variance)이 낮다.</strong> 분산이 크다면 대개 잘못 설계된 모호한 작업이나, 동일한 출력에 다른 판정을 내리는 채점기 때문이다. 분산은 설정 안에 숨어 있기도 하다. 예를 들어 effort가 일관되게 적용되지 않을 수 있다. 또한 환경이 eval 결과에 영향을 줄 수 있다. 이전 시도에서 남은 상태(파일, git 히스토리)가 에이전트에게 답을 건네줄 수 있다.</li>
</ol>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig1-four-elements.svg" alt="작은 모델, 중간 모델, 가장 유능한 모델을 낮음·중간·높음 effort로 돌렸을 때, 시도당 액션 토큰 대비 점수. 번호가 매겨진 설명이 네 가지 요소를 표시한다. 더 유능한 모델과 더 높은 effort로 점수가 오르고, 맨 위 선은 만점 아래에 머물며, 오차 막대는 좁게 유지된다.">
  <figcaption><b>FIG 1</b>좋은 eval의 네 가지 요소. 차트 제목: "Score against tokens spent"(사용 토큰 대비 점수) · 세 가지 모델 크기 × 세 가지 effort 설정, 예시용 도식.</figcaption>
</figure>

<h3 id="adversarial-sampling">적대적 샘플링(adversarial sampling)</h3>

<p>모델의 능력은 들쭉날쭉하다(jagged). 오늘의 모델이 실패한다는 이유로 케이스를 고르면, 한 모델의 능력 표면에서 골짜기만 샘플링하는 셈이다(그림 2). 그러면 eval은 여러분의 애플리케이션에 본질적으로 어렵거나 가치 있는 것이 아니라, 그 모델의 실패 지문(failure fingerprint)을 측정하게 될 수 있다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig2-adversarial-sampling.png" alt="작업 공간에 걸친 능력을 그린 두 패널. 각각 오늘의 모델은 들쭉날쭉한 곡선, 다음 모델은 그 위의 더 매끈한 곡선이다. 왼쪽은 오늘의 모델이 실패하는 곳에서 샘플링한 케이스가 골짜기에만 몰려 있고, 오른쪽은 사람이 어렵다고 판단한 케이스가 봉우리와 골짜기에 고루 퍼져 있으며, 발동하지 않아야 하는(should-not-fire) 케이스도 몇 개 있다.">
  <figcaption><b>FIG 2</b>적대적 샘플링</figcaption>
</figure>

<p>사람이 어렵다고 판단했기 때문에 어려운 케이스를 고르자. 유용한 테스트는 어떤 작업을 포함하기 전에 왜 그 작업이 어려운지 말할 수 있는지다. 프로덕션 트래픽, 버그 리포트, 티켓에서 나온 여러분 애플리케이션의 구체적인 실패 케이스를 포함하자. 하지만 사용자 트래픽을 맹신하지는 말자. 사용자는 종종 될 거라고 기대하는 것만 시도하기 때문에, 사용자 트래픽에서만 뽑은 작업 분포는 쉬운 쪽으로 치우칠 수 있다.</p>

<h2 id="claude-api-build-eval">/claude-api build-eval</h2>

<p>claude-api 스킬의 <code>build-eval</code> 명령은 이 원칙들을 안내형 워크플로우로 바꾼다. Claude Code에서 <code>/claude-api build-eval</code>을 실행하면 Claude가 여러분을 인터뷰하고, 코드베이스 안에 eval을 만들며, 특정 지점에서 멈춰 승인을 기다린다.</p>

<h3 id="designing-examples">예제 설계하기</h3>

<p>Claude는 다음 순서로 eval용 입력을 샘플링하도록 돕는다.</p>

<ol>
<li>프로덕션 트랜스크립트. 보존 정책과 민감 데이터에 대해 먼저 물어본다.</li>
<li>버그 리포트와 지원 티켓.</li>
<li>여러분이 직접 손으로 쓴 케이스 5~10개.</li>
<li>코드베이스에서 합성한 케이스.</li>
</ol>

<p>스킬은 프로덕션 트래픽을 우선하지만, 여러분이 제공한 실제 예제 몇 개를 기준점 삼아 합성 데이터를 생성할 수도 있다. 스킬은 Claude에게 모든 입력을 보여 주는 간단한 페이지를 만들고, 여러분이 확인할 때까지 기다리도록 지시한다. 예시로, 이메일 라우터 애플리케이션에 대해 스킬이 사용자에게 검토를 요청할 수 있는 입력 세트를 아래에 보인다(그림 3).</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig3-inputs-review.png" alt="24개 입력이 있는 받은편지함 라우팅 eval에 대한 스킬의 검토 페이지. 각 케이스의 이메일 본문을 billing, easy, ambiguous 같은 태그와 함께 나열한다. 옆에서 Claude가 채팅으로 입력이 대표성이 있는지 묻고, 사용자가 그렇다고 답한다.">
  <figcaption><b>FIG 3</b>스킬이 생성한 입력 검토 페이지 예시</figcaption>
</figure>

<h3 id="validating-the-grader">채점기 검증하기</h3>

<p>입력이 정해지면 Claude는 애플리케이션 출력에 맞는 가장 저렴한 채점기를 제안한다.</p>

<ul>
<li><strong>프로그램 방식 검증(programmatic verification)</strong>: 출력 가능성이 제한되어 있다면 코드 기반 검사를 쓴다(정확히 일치, 고정 집합의 레이블, 스키마와 맞는 JSON, 통과하는 테스트).</li>
<li><strong>LLM 판정자(LLM-as-judge)</strong>: 출력 공간이 열려 있어서 유효한 답은 많지만 품질 기준은 분명한 경우 이 검사를 기본으로 쓴다. 이 경우 두 번째 모델이 입력, 출력, 그리고 (1~5점 척도가 아니라) 검증 가능한 주장(claim)으로 쓰인 루브릭을 읽고, 근거와 함께 점수를 돌려준다. 비교할 베이스라인이 있다면 판정자는 대신 두 출력을 무작위 순서로, 어느 쪽이 베이스라인인지 모른 채 읽고 더 나은 쪽을 고른다. 판정 모델은 여러분이 고르며, 테스트 중인 모델이어서는 안 된다.</li>
</ul>

<p>Claude는 케이스 몇 개를 채점한 뒤 여러분이라면 다르게 점수를 매겼을 것이 있는지 묻는다(그림 4). 일반적으로 평가기를 믿기 전에 <a href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents">채점된 트랜스크립트 샘플을 읽어 보는 것</a>이 중요하다. 채점 실패는 eval이 잘못 구성되는 가장 흔한 경로 중 하나다.</p>

<p>채점기를 검증하고 나면 스킬은 eval 세트의 크기(케이스 × 반복 × 모델, 그리고 대략 얼마나 걸릴지)를 알려 주고, 베이스라인을 실행한 뒤, 신뢰 구간과 함께 점수를 출력한다. 돌려받는 것은 케이스, 채점기, 러너, 케이스당 JSON 한 줄과 전체 트랜스크립트 하나, 그리고 각 케이스의 점수를 트랜스크립트 링크와 함께 나열한 단순한 페이지다. 그 페이지가 보여 주는 것 이상(예: 차트)이 필요하면 그냥 요청하면 된다. Claude가 그 옆에 추가 페이지로 만들어 준다. 기본적으로 이런 추가 페이지는 로컬에서 열리고 네트워크에서 아무것도 불러오지 않는 정적 파일이다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig4-results-page.png" alt="받은편지함 라우팅 eval에 대한 스킬의 결과 페이지. 24개 케이스에 대한 베이스라인 평균 정답률 0.681, 그다음 각 반복으로 가는 링크가 있는 케이스별 점수 표. 반복 링크를 열면 그 케이스의 원시 JSON 트레이스가 옆에 표시된다.">
  <figcaption><b>FIG 4</b>각 입력에 대한 제안 점수와 함께 생성되는 결과 페이지의 도식</figcaption>
</figure>

<h3 id="diagnostic-checks">진단 검사</h3>

<p>위에서 말한 베이스라인 실행 중에 Claude는 여러 가지를 점검한다.</p>

<ul>
<li><strong>채점기</strong>: Claude는 같은 출력에 채점기를 두 번 돌리고, 판정이 바뀌었는지 보고한다.</li>
<li><strong>배관(plumbing)</strong>: Claude는 타임아웃, API 오류, 잘린 답변을 점검해서 인프라 노이즈가 모델 분산으로 둔갑하지 않도록 한다.</li>
<li><strong>여유(headroom)</strong>: 베이스라인이 이미 약 95% 이상이면 스킬은 사용자에게 경고하고, hillclimb은 품질보다 비용이나 지연 시간을 탐색하는 쪽을 목표로 해야 한다고 알린다.</li>
</ul>

<h2 id="hillclimbing">Hillclimbing</h2>

<p>이제 작업에 대한 애플리케이션 성능을 신뢰성 있게 채점할 수단이 생겼으니, 개선을 시도해 볼 수 있다. Hillclimbing은 비용과 성능 사이에서 트레이드오프가 있는 effort나 프롬프트 같은 파라미터를 튜닝하는 효과적인 방법이다. 어디에 적용할지 고를 때의 일반적인 팁은 다음과 같다.</p>

<ul>
<li><strong>저렴한 반복(cheap iteration)</strong> - hillclimbing의 대상이 되는 표면(surface)을 수정하는 비용이 (시간, 비용, 노력 면에서) 저렴해야 한다. 사내의 많은 시도와 고객들은 프롬프트와 스킬 같은 텍스트에 hillclimbing을 집중해 왔다. 이런 것은 바꾸고 되돌리기 쉽다. 반면 hillclimbing 중에 에이전트 하네스(harness)를 제한 없이 수정하는 것은 광범위한 코드 변경을 수반할 수 있다.</li>
<li><strong>귀속 가능(attributable)</strong> - eval 점수의 변화가 hillclimbing 중에 수정하는 표면에 귀속될 수 있어야 한다. 예를 들어 hillclimbing의 성공적인 적용 사례 여럿은 스킬 트리거링에 집중했다. eval 지표(스킬의 트리거 비율)가 수정 대상인 스킬 설명과 직접 결합되어 있기 때문이다.</li>
<li><strong>범위가 잘 정해진 목표(well-scoped objective)</strong> - 흔한 실패 유형 하나는 eval에 남은 여유를 신중히 고려하지 않은 채 성능을 개선해 달라고 막연히 요청하는 것이다. 포화 상태에 가까운 eval이나 범위가 불분명한 표면(예: 하네스를 업데이트해 달라는 막연한 요청)은 정체될 가능성이 더 크다. 여러 시도에 걸쳐 대체로 강력한 목표 하나는 비용이다. eval이 포화됐더라도 성능을 유지하면서 <a href="https://claude.com/blog/reducing-cost-and-improving-performance-with-claude-platform">비용을 줄일 방법을 찾아 달라</a>고 Claude에게 요청할 수 있다.</li>
</ul>

<h3 id="overfitting">과적합(overfitting)</h3>

<p>잘 설계된 eval이라도 프로덕션에서 신경 쓰는 정확한 작업 분포와 일치하는 경우는 드물다. 그 결과 eval에 대한 "과적합"은 흔한 문제이며, 프로덕션 트래픽보다 eval에서 더 잘 동작하는 시스템을 낳는다.</p>

<p>Eval이 하네스(모델을 둘러싼 코드, 즉 프롬프트, 도구, Claude를 호출하는 루프)로 "새어 들어가는" 경로는 많다. 예를 들어 OCR이 도움이 되는 eval 작업이 있지만, 프로덕션 작업에서는 OCR이 거의 도움이 되지 않는다고 하자. eval 하네스는 애플리케이션에 OCR 도구를 추가할 수 있는데, 이는 벤치마크 점수는 올리지만 프로덕션에는 아무 영향이 없다. 더 넓게 보면, hillclimbing은 여러분이 고른 특정 eval 예제의 엣지 케이스를 처리하는 기능을 하네스에 추가할 수 있다. 이런 하네스 추가는 eval 점수는 올리지만 프로덕션 개선으로 이어지지 않는다(그림 5).</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig5-harness-overfitting.png" alt="왼쪽에는 벤치마크의 특성, 오른쪽에는 그에 맞춰 하네스에 추가되는 것들. OCR이 필요한 작업 구성은 OCR 도구를 추가하고, /app 안의 작업은 '항상 cd /app, pytest 실행'을 추가하고, 독특한 문구는 그에 맞춘 프롬프트를, 읽어 본 실패는 각각 패치 하나를 낳는다. 점선 화살표는 노골적인 유출을 표시한다. 답이 들어 있는 공개 저장소가 있으면 하네스가 참조 해답을 curl로 가져온다.">
  <figcaption><b>FIG 5</b>하네스 과적합의 흔한 원인.</figcaption>
</figure>

<p>세 가지가 이 문제에 도움이 된다.</p>

<ul>
<li><strong>케이스를 나눈다.</strong> hillclimber가 읽어도 되는 train 세트와 절대 보지 않는 test 세트를 쓴다. train 세트 점수는 오르는데 test 세트 점수가 제자리라면, 그것이 흔한 과적합 경고 신호다.</li>
<li><strong>실패를 프롬프트에 절대 붙여 넣지 않는다.</strong> hillclimber가 실패한 트랜스크립트를 읽더라도, 실패 내용을 프롬프트에 붙여 넣어서는 절대 안 된다.</li>
<li><strong>답을 구조적으로 모델의 손이 닿지 않는 곳에 둔다.</strong> 모델은 때때로 eval의 답을 직접 찾아내는 식으로 "보상 해킹(reward hack)"을 할 수 있다.</li>
</ul>

<p>아래에서 다루듯, claude-api 스킬은 이 원칙들을 여러분 대신 적용한다.</p>

<h2 id="claude-api-hillclimb">/claude-api hillclimb</h2>

<p>claude-api 스킬의 hillclimb 명령은 이 원칙들을 안내형 워크플로우로 바꾼다. Claude Code에서 <code>/claude-api hillclimb</code>을 실행하면 Claude가 주어진 eval에 맞춰 반복적으로 개선한다. 어떤 변경을 허용할지는 여러분이 고르며, 다음을 포함한다.</p>

<ul>
<li>시스템 프롬프트</li>
<li>스킬 또는 지침 파일</li>
<li>도구 설명</li>
<li>모델 선택, effort 수준, 기타 API 파라미터</li>
<li>하네스 코드</li>
</ul>

<p>시작하기 전에 Claude는 무엇을 최적화하고 싶은지(예: 성능, 또는 성능을 유지하면서 비용) 묻고, eval 세트를 무작위로 test와 train으로 나눈다. 비용이 목표라면 프롬프트 캐싱, 선택한 모델과의 호환성 관점에서 프롬프트 감사하기, 모델과 effort 설정 고르기 등 <a href="https://claude.com/blog/reducing-cost-and-improving-performance-with-claude-platform">몇 가지 흔한 비용 요인</a>을 고려한다.</p>

<p>첫 라운드 전에 Claude는 eval의 노이즈(우연만으로 점수가 움직일 수 있는 폭)가 여러분이 행동에 옮길 최소 개선 폭보다 작은지 확인한다. 그렇지 않으면 그렇다고 말하고 반복이나 케이스를 더 늘리라고 제안한다.</p>

<p>매 라운드마다 Claude는 이전 라운드의 train 트랜스크립트를 읽고 변경 하나를 패치로 제안한다. 각 라운드는 효과가 eval의 노이즈 위로 드러날 수 있는 변경을 겨냥한다. 한 줄을 고쳐 쓰는 대신 실패 동작을 근본에서 고친다(예: 원인이 되는 섹션을 다시 쓰거나 빠진 규칙을 추가). 그런 다음 패치된 변경으로 eval을 실행한다. 이 시점에 Claude는 검사를 적용한다. <code>train</code> 세트는 개선됐는데 <code>test</code> 세트가 제자리라면 과적합을 의심하고 패치를 되돌린다. 성능이 떨어지면 되돌린다. train과 test 세트가 모두 개선되면 패치를 유지한다(그림 6).</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig6-hillclimber-process.png" alt="Hillclimbing 루프. 프롬프트처럼 편집 대상이 되는 것이 고정된 모델과 하네스에 들어가고, 홀드아웃 test 분할과 train 분할에서 채점된다. 분석기는 train 실패만 읽고 라운드마다 diff 하나를 제안한다. train과 test가 모두 오르면 diff를 유지하고, train만 오르거나 어느 한쪽 점수가 떨어지면 되돌린다.">
  <figcaption><b>FIG 6</b>hillclimber가 쓰는 프로세스.</figcaption>
</figure>

<p>점수가 두세 라운드 동안 정체되면 Claude는 남은 train 실패를 하나씩 읽고 원인별로 분류한다. 어떤 단일 수정도 eval 노이즈보다 큰 이득을 낼 수 없다면 이 작업을 더 일찍 수행하고, 측정하기엔 너무 작은 변경에 라운드를 쓰는 대신 반복이나 케이스를 늘리라고 제안한다. 이 단계는 모호한 eval 케이스, 하네스 오류, 실행 간 분산을 잡아낼 수 있다.</p>

<p>정당한 실패만 이후 hillclimbing 라운드에 포함된다.</p>

<p>Hillclimbing이 끝나면 Claude는 여러분의 목표 기준으로 test 세트에서 가장 좋았던 버전으로 코드를 남겨 둔다. 베이스라인 대비 test 결과를 신뢰 구간과 함께 보고한다(그림 7). 이득이 노이즈 범위 안이라면 그렇다고 말하고 머지하지 말 것을 권한다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig7-hillclimb-report.png" alt="Hillclimbing 후 받은편지함 라우팅 결과 페이지. 세 변형의 train·test 점수를 비교한다. 각 큐를 정의하고 동점 처리 규칙을 추가한 변형 v1은 둘 다 0.875로 최고로 표시된다. 작업 예제 두 개를 추가한 v2는 train은 올랐지만 test가 제자리여서 되돌려졌다.">
  <figcaption><b>FIG 7</b>hillclimbing 후 생성되는 보고서의 도식.</figcaption>
</figure>

<h2 id="examples">예시</h2>

<h3 id="hillclimbing-for-cost-reduction">비용 절감을 위한 hillclimbing</h3>

<p>우리는 비용을 줄이고 성능을 높인다는 목표로 <a href="https://claude.com/blog/reducing-cost-and-improving-performance-with-claude-platform">사내 고객 지원 벤치마크</a>에 <code>/claude-api hillclimb</code>을 돌렸다. 벤치마크에는 티켓 44개가 있었고, 30개는 탐색에 쓰고 14개는 홀드아웃으로 남겼다. 시작점은 기본(high) effort 설정의 Opus 4.8로, 탐색 티켓에서 결정 정확도 74.4%, 티켓당 토큰 비용 4.6센트였다.</p>

<p>Hillclimb은 먼저 프롬프트를 감사해서 필수 도구 호출 의식(ritual), 스크래치패드 단계, 서로 모순되는 규칙을 <a href="https://claude.com/blog/reducing-cost-and-improving-performance-with-claude-platform">제거했다</a>. 그다음 low effort의 Opus 5.5를 시도했다. 이것으로 베이스라인 정확도 기준을 87.8%로 넘어섰고, 비용은 티켓당 1.9센트로 시작 비용의 절반 아래로 줄었다.</p>

<p>그 절감의 일부는 <a href="https://claude.dev/blog/getting-the-most-out-of-opus-5-5/">Opus 5.5의 가격</a>에서 온다. 입력·출력 토큰은 Opus 4.8보다 20% 저렴하고, 캐시 읽기는 60% 저렴하다. Opus 5.5가 기준을 넘었으므로 hillclimb은 한 단계 아래 등급으로 내려가 더 저렴한 모델도 기준을 넘을 수 있는지 확인했다. low effort의 Sonnet 5는 비슷한 88.9%를 기록했고, 비용은 약 절반인 티켓당 1센트였다(그림 8).</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig8-cost-hillclimb.svg" alt="탐색 티켓의 결정 정확도를 로그 스케일의 티켓당 비용에 대해 그린 차트. 채택된 경로를 따라간다. high effort Opus 4.8 베이스라인 74.4%·4.6센트, 감사한 프롬프트로 low effort Opus 5.5 87.8%·1.9센트, 같은 프롬프트로 low effort Sonnet 5 88.9%·약 1센트, 개선된 프롬프트로 Sonnet 5 98.9%·약 1센트. 점선은 시작 정확도 74.4%를 표시한다.">
  <figcaption><b>FIG 8</b>비용 중심 hillclimbing. 차트 제목: "The customer support benchmark"(고객 지원 벤치마크) · 채택된 경로를 따른 네 가지 구성.</figcaption>
</figure>

<p>마지막으로 Claude는 라우팅 규칙과 환불 상한 교차 참조를 넣어 프롬프트를 개선했고, Sonnet 5를 거의 같은 비용에 98.9%까지 끌어올렸다. 탐색이 한 번도 보지 않은 홀드아웃 티켓 14개에서 최종 구성은 원래 설정의 78.6% 대비 90.5%를 기록했고, 비용은 약 5분의 1이었다.</p>

<h3 id="hillclimbing-for-performance-improvement">성능 개선을 위한 hillclimbing</h3>

<p>또 다른 예는 우리의 <a href="https://github.com/anthropics/skills/tree/main/skills/claude-api">claude-api</a> 스킬이다. 이 스킬은 우리 API 사용법과 Claude로 작업하는 일반적인 팁(이 글에서 다룬 하위 명령 포함)을 안내한다. 우리는 이 스킬이 우리 API를 쓰는 코드를 올바르게 구현할 수 있도록 하고 싶었고, 스킬을 테스트하기 위해 문서에서 파생한 eval 세트를 만들었다.</p>

<p>우리 eval에서 스킬은 66%로 시작했다. hillclimber에게 문서와 SDK 접근 권한을 줘서 Claude가 오류를 찾아 스스로 고칠 수 있게 했다(그림 9). Claude는 스킬에 여덟 가지 기능에 대한 설명이 빠져 있음을 발견했다.</p>

<p>스킬에 그 섹션들을 추가하자 성능이 74%로 올랐다. 그다음 C#과 Java 타입 표에서 오류를 찾아내 성능을 77%로 끌어올렸다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/automating-eval-design-and-hillclimbing/fig9-performance-hillclimb.svg" alt="claude-api 스킬 eval에서 hillclimbing 라운드에 걸친 통과율. 베이스라인 66.1%에서 24라운드의 87.9%까지 오른다. 번호가 매겨진 세 단계가 작업을 표시한다. 빠진 섹션과 타입 표 추가, 그다음 스킬이 Claude에게 코드를 쓰라고 지시하는 방식 수정, 그다음 채점기 수정과 추가 스킬 편집.">
  <figcaption><b>FIG 9</b>성능 중심 hillclimbing. 차트 제목: "The claude-api skill eval"(claude-api 스킬 eval) · 세 단계의 작업으로 66.1%에서 87.9%까지.</figcaption>
</figure>

<p>점수가 두 라운드 동안 정체된 뒤 Claude는 남은 실패를 분석해 근본 원인별로 묶었다. 보통 라운드는 가장 흔한 실패에 대해 편집 하나를 한다. 이 단계는 편집을 하지 않고, 남은 모든 실패를 원인별로 분류만 한다. 이 성찰(reflection) 단계는 몇 가지 면에서 유용했다.</p>

<ul>
<li>실패 묶음 전체를 돌아보며 hillclimber는 스킬 내용은 있는데 Claude가 그냥 (예컨대 학습된 사전 지식에서 나온) 오래된 API 형태를 쓰고 있다는 것을 발견했다. 이를 해결하기 위해 hillclimber는 스킬 맨 위 근처에 Claude가 기억하는 형태에서 현재 형태로 안내하는 표를 추가했다. 예를 들어 최근 Opus 모델에서는 API가 거부하는 고정 토큰 예산의 확장 사고(extended thinking)에서 적응형 사고(adaptive thinking)로, 구버전 웹 검색·웹 가져오기 도구에서 현재 버전으로. 또한 C#과 Java의 고정 예산 사고에 대한 경고를 적응형 사고 예제 위로 옮겼다. 이것으로 성능이 80%로 올랐다.</li>
<li>명백한 내용 공백을 메웠는데도 성능이 전혀 오르지 않는 작업은 예제나 채점기에 결함이 있다는 징후다. 한 작업은 오류 타입 하나를 잡는 코드를 요구했는데, 그 채점기는 최소 세 개의 체인을 원했다. Claude는 작업 문구를 고쳐 썼다. 다른 채점기의 지시는 우리 문서와 모순됐는데, 실제 API를 테스트해 보니 문서가 맞았다. 이것들을 해결하고 스킬을 더 편집하자 성능은 약 88%가 됐다.</li>
</ul>

<h2 id="getting-started">시작하기</h2>

<p><strong>참고:</strong> 먼저 <code>claude update</code>를 실행하자. claude-api 스킬은 Claude Code에 내장되어 있어서, 업데이트하면 이 명령들의 최신 버전을 받게 된다.</p>

<pre><code>claude update</code></pre>

<p>그다음 Claude Code에서:</p>

<pre><code>/claude-api build-eval
/claude-api hillclimb</code></pre>

<p>이 하위 명령들은 <a href="https://github.com/anthropics/skills/tree/main/skills/claude-api">claude-api 스킬</a>을 통해 Claude Code에서 바로 쓸 수 있다.</p>

<p>특정 문제에 대한 eval 세트를 만들고 싶다면 <code>/claude-api build-eval</code>을 실행하자. 예제(예: 트레이스)에 대한 접근을 제공해서 방향을 잡아 줄 수 있다. Claude는 이 글에서 공유한 가이드를 적용해 예제와 채점기를 설계하고, 여러분이 예제와 채점기를 승인하도록 한다.</p>

<p>Eval이 이미 있고 여러분의 목표(예: 더 나은 성능, 또는 성능을 유지하면서 더 낮은 비용)에 따라 Claude가 개선하길 원한다면 <code>/claude-api hillclimb</code>을 실행하자. Claude는 이 글에서 공유한 가이드를 적용해 오르는 동안 과적합을 점검하고, eval 자체의 버그(예: 맞아 보이는 답을 틀렸다고 표시하는 채점기나 하네스 오류)를 첫 라운드 전과 점수가 정체될 때마다 점검한다.</p>

<p><em>스킬 개발에 힘써 준 Misha Khalman에게 특별히 감사를 전한다. 리뷰, 기여, 제품 지원을 해 준 Misha Khalman, Michael Segner, Matt Bell, Matt Thanabalan, Punit Shah에게도 감사를 전한다.</em></p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
