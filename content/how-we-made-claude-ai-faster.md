---
slug: "how-we-made-claude-ai-faster"
title: "우리는 어떻게 2주 만에 claude.ai를 3배 빠르게 만들었나"
nav: "claude.ai 3배 빠르게 · Slack 스레드 150개 루프, 명령어 수 래칫, 정적 composer, 8.33ms 프레임 예산"
main: "claude.dev"
cat: "Engineering"
date: "2026-09-23"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  blockquote p:last-child { margin-bottom: 0; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  /* 슬랙 스레드 재현 */\n  .thread { border:1px solid var(--line); border-radius: 8px; margin: 20px 0; background:#fcfcfb;\n    font-size: 0.93rem; }\n  .thread .th-head { padding: 8px 14px; border-bottom:1px solid var(--line); color: var(--muted);\n    font-size: 0.78rem; letter-spacing: .03em; font-family: \"SF Mono\", Menlo, Consolas, monospace; }\n  .thread .msg { padding: 12px 14px; border-bottom:1px solid var(--line); }\n  .thread .msg:last-of-type { border-bottom: 0; }\n  .thread .who { font-weight: 600; margin-right: 8px; }\n  .thread .who.ai { color: var(--accent); }\n  .thread .when { color: var(--muted); font-size: 0.8rem; }\n  .thread .msg p { margin: 6px 0 0; }\n  .thread .msg ul { margin: 6px 0 0; }\n  .thread .msg ul li { margin-bottom: 4px; }\n  .thread .attach { display:inline-block; margin-top:6px; padding: 2px 8px; border:1px solid var(--line);\n    border-radius: 4px; color: var(--muted); font-size: 0.8rem; background:#fff; }\n  .thread-note { color: var(--muted); font-size: 0.8rem; text-align: right; margin: -14px 0 20px; }\n  .tweet { border:1px solid var(--line); border-radius: 10px; padding: 14px 18px; margin: 20px 0; }\n  .tweet .handle { font-weight: 600; }\n  .tweet .handle span { color: var(--muted); font-weight: 400; margin-left: 6px; }\n  .tweet p { margin: 8px 0; }\n  .tweet .foot { color: var(--muted); font-size: 0.82rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 20008
---

<!-- rendered HTML -->
<header>
  <h1>우리는 어떻게 2주 만에 claude.ai를 3배 빠르게 만들었나</h1>
  <div class="meta">
    2026년 9월 23일
    · 카테고리: Engineering
    · 글쓴이: Raymond Wang, Sam Attard, Issac G.
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/how-we-made-claude-ai-faster">How we made claude.ai 3x faster in two weeks</a>
      (한글 번역본 · 읽는 시간 약 15분)</span>
  </div>
</header>

<p class="lede">Claude가 무언가를 측정할 수 있게 되는 순간, Claude는 그것을 더 빠르게 만들 수 있다. 그래서 우리는 측정할 것을 계속 더 찾아 나섰다.</p>

<p>지난 8월, 우리는 2주짜리 스프린트로 claude.ai와 Claude 데스크톱 앱의 핵심 사용자 경험을 약 3배 빠르게 만들었다. 사용자들은 느리다고 말해 왔고, 그 말이 맞았다. 우리는 모든 것을 Slack 채널 하나에서 돌렸고, 모든 스레드에 Claude가 있었다.</p>

<p>우리는 사용자 활동의 95%를 차지하는 네 가지 여정(journey)에 집중했다. 75번째 백분위수(p75) 기준으로, claude.ai를 새로 로드해서 타이핑할 수 있는 페이지가 뜨기까지의 시간은 3.1초에서 0.55초로, 새 Claude Code 세션 시작은 0.8초에서 0.3초로, Claude Cowork 클라우드 세션 로드는 2.6초에서 0.73초로 줄었다. 합산하면 매일 수만 사용자-시간(user-hours)의 기다림을 아끼는 것으로 추정한다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-core-journeys.png" alt="핵심 사용자 여정 13가지의 p75 전후 측정치. 앱 실행(claude.ai 새 로드 3,085→550ms, 5.6배; 데스크톱 콜드 스타트 6,310→3,328ms, 1.9배), 대화 시작(1.5~2.4배), 대화 로드(2.1~3.5배, Cowork 클라우드 세션 2,566→728ms), 메시지 전송(2.2~19배, Cowork 928→48ms). 기하평균 3.1배 빨라짐.">
  <figcaption>핵심 사용자 여정, p75 · 실사용자 모니터링(RUM), 플랫폼·제품별, 8월 13일 vs. 8월 27일. 네 여정에 걸친 13개 측정치의 전후 비교로, 기하평균 3.1배 빨라졌다.</figcaption>
</figure>

<p>우리는 <a href="https://claude.com/product/tag">Claude Tag</a>(베타)를 사용했고, 그 위에서 Opus 5.5와 대략 비슷한 수준의 내부 리서치 모델을 돌렸다. Claude가 병목을 찾고, 벤치마크를 만들고, 개선을 배포하고, 모든 배포를 지켜봤다. 우리는 목표를 세우고, 트레이드오프를 결정하고, 모든 변경을 승인하는 방식으로 방향을 잡았다. 이 접근으로 우리는 고객에게 드러난 장애(incident)나 롤백 한 번 없이 3천 건이 넘는 변경을 머지했다. 이 글은 우리가 무엇을 배포했는지, 어떻게 측정했는지, 그리고 그것을 안전하게 해내기 위해 Claude와 함께 만든 루프를 다룬다.</p>

<h2 id="the-brief">브리프</h2>

<p>스프린트 전에 우리는 다음과 같은 <a href="https://claude.com/docs/claude-tag/users/getting-started#give-claude-standing-instructions">상시 지침(standing instructions)</a>을 담은 Slack 채널을 만들었다.</p>

<blockquote>
<p>@Claude 당신의 일은 claude.ai 웹사이트와 데스크톱 앱의 성능에 관련된 모든 것을 이끄는 것이다. 책임 범위에는 배포에서 성능 회귀(regression)를 모니터링하는 것, 기존 텔레메트리의 정확성과 포괄성을 평가하는 것, 잘 정리된 관측(observability) 대시보드를 유지하는 것, 관찰된 문제와 쉽게 딸 수 있는 과실(low-hanging fruit)에 대해 선제적으로 해결책을 구현하는 것, 성능 프로젝트 기회를 제안하는 것, 그리고 사람 팀원들과 소통하는 것이 포함된다. […]</p>
<p>이 채널의 궁극적인 목표는 당신이 가능한 한 자율적으로 움직이게 되는 것이지만, 오늘 당장은 그것이 아직 가능하지 않다는 것을 우리도 안다.</p>
</blockquote>

<p>우리는 Claude에게 Datadog MCP 서버를 통해 사용 데이터를 분석해 달라고 했다. Claude는 영향이 가장 큰 사용자 여정 네 가지를 찾아냈다. 앱 실행, 대화 시작, 기존 대화 로드, 메시지 전송이다. 웹과 데스크톱, 그리고 우리 제품들을 가로지르면 이 여정들은 13개의 개별 측정치가 됐다. 기준선(baseline)을 잡기 위해 우리는 이 측정치들이 서로 직접 비교 가능해질 때까지 계측(instrumentation)을 추가했다. 각 측정은 사용자 상호작용으로 시작하고, 결과가 렌더링되면 끝나며, 클라이언트 작업과 서버 작업을 구분했다.</p>

<p>우리는 각각 특정 여정을 겨냥한, 손으로 고른 약 스무 개의 프로젝트 목록으로 스프린트를 시작했다. Claude가 각 프로젝트의 효과를 밀리초 단위로 추정했고, 우리는 그 추정치를 합산해 스프린트 목표를 세웠다. 몇몇 프로젝트는 꽤 컸지만, 2주 안에 대부분을 달성할 수 있을 거라고 생각했다.</p>

<p>우리는 13개 목표 중 12개를 3일째에 달성했다.</p>

<p>계획했던 프로젝트들은 일찍 끝났다. 더 빠른 실행을 위해, React가 초기화되는 동안에도 사용자가 타이핑할 수 있도록 정적 composer(입력창)를 HTML에 구워 넣었고, 데스크톱 셸의 메인 프로세스가 처음부터 다시 컴파일하지 않도록 V8 코드 캐시를 미리 컴파일해 두었다. 더 빠른 화면 전환을 위해, 대화 사이에서도 composer를 마운트된 채로 유지했고, 사용자가 세션 위에 마우스를 올리면 세션을 prefetch했으며, 사이드바 리렌더(re-render)를 90% 줄였다.</p>

<p>우리는 또한 Claude가 스스로 기회를 찾고 새 작업 흐름(workstream)을 제안할 여지를 남겨 두었다. 그 작업 흐름들은 빠르게 각자 완전한 프로젝트로 커졌고, 우리의 초기 목표를 훨씬 넘어섰다. 그래서 우리는 새 목표를 세운 다음, 측정할 것을 더 찾아 나섰다.</p>

<blockquote>
<p>@Claude 결국 원래 프로젝트 목록에 있던 거의 모든 프로젝트와 그 이상에 자원을 투입하게 됐다. 다시 정리해 보자 […] 아직 탐색하지 않은 게 뭐지, 어디서 hill climbing을 할 수 있지, 지금 시점에서 기회가 가장 큰 곳은 어디지? […] 엉뚱한(WACKY) 아이디어도 환영이다</p>
</blockquote>

<h2 id="anything-can-be-hill-climbed">무엇이든 hill climbing할 수 있다</h2>

<p>처음부터 우리는 배포 주기보다 빠르게 반복하고 싶다는 것을 알고 있었다. Claude는 여러 시간, 심지어 밤새 비동기로 일할 수 있었고, 우리는 Claude가 현장 데이터(field read)를 기다리지 않고도 프로토타입을 검증하게 하고 싶었다. 그러려면 실험실(lab)에서 성능을 측정하는 다른 방법을 찾아야 했다.</p>

<p>첫 실마리는 Sam이 찾았다.</p>

<div class="thread">
  <div class="th-head">#claude-apps-perf · thread</div>
  <div class="msg"><span class="who">Sam</span><span class="when">12:34 PM</span>
    <p>벽시계 시간(wall-clock timing) 대신 뭘 할 수 있을까? 예를 들어 JS 명령어 수(instruction count)를 셀 수 있나?</p></div>
  <div class="msg"><span class="who ai">Claude</span><span class="when">12:42 PM</span>
    <p>가능하다. 순수 JS 핫 패스라면 말 그대로 명령어 수를 셀 수 있다. <code>node --predictable</code>로 Valgrind 아래에서 벤치마크를 돌리고 체크인된 기준선과 비교하면 된다. 한 번만 돌리면 되고 통계는 필요 없다.</p>
    <p>브라우저 경로는 Chromium 아래에서 명령어 수를 셀 수 없지만, 결정론적(deterministic) 카운트의 사다리가 따로 있다. 상호작용당 React commit 수, V8 정밀 커버리지(precise coverage)에서 나오는 함수 호출 수, layout과 style-recalc 횟수, DOM 변경(mutation) 수. 어떤 것부터 할까?</p></div>
  <div class="msg"><span class="who">Sam</span><span class="when">12:49 PM</span>
    <p>valgrind + <code>Ir</code> + <code>--predictable</code>은 스레드 하나에서 파 보고, 브라우저/react 벤치는 각각 새 스레드에서 파 보자. 전부 나를 핑해 줘. 우리가 뭘 원하는지 알잖아. 가자</p></div>
</div>
<p class="thread-note">실제 대화를 재구성한 것.</p>

<p>11분 뒤, 다섯 개의 스레드가 돌아가고 있었고, 각각 다른 측정치에 집중했다. 명령어 수, V8 호출 수, React commit, style recalculation, DOM mutation이다.</p>

<p>우리는 새 벤치마크를 하나하나 어느 정도 의심을 갖고 대했다. 각 벤치마크에는 두 가지 역할이 있었다. 첫째, Claude가 실험실에서 움직일 수 있는 지표. 둘째, 숫자가 내려가는 방향으로만 조여지는(ratchet) CI 가드레일. 벤치마크가 불안정(flaky)하거나 실제 사용자 지연(latency)과 상관관계가 없다면, Claude가 엉뚱한 언덕을 오르게 두느니 그 벤치마크를 버렸다.</p>

<blockquote>
<p>@Claude 이 각각에 대해 hill climbing을 하면 측정 가능한 벽시계 성능 향상으로 이어진다는 걸 증명해 줘. 증명하지 못하는 후보는 벤치를 내릴(unship) 거야</p>
</blockquote>

<p>벽시계 시간은 사용자가 체감하는 것이지만 노이즈가 많고, 밀리초는 CI 게이트로 쓰기엔 너무 불안정하다. 명령어 수는 결정론적이어서 매력적이었지만, 그래도 그것이 벽시계 시간을 따라간다는 것을 Claude가 증명해야 했다.</p>

<p>그래서 우리는 Claude에게 두 개의 핫 패스에서 카운트를 낮춰 보라고 했다. 대화의 메시지 트리를 조립하는 루틴과, Claude Code 출력에서 상태 줄(status line)을 찾는 스캐너였다. Claude는 둘 다 Valgrind로 프로파일링했고, 첫 번째 경로의 명령어 중 4분의 1이 메가모픽(megamorphic) 딕셔너리 조회로, 같은 메시지 ID를 세 번 따로 해석(resolve)하고 있다는 것을 찾아냈다.</p>

<p>한 시간 뒤 Claude는 두 경로의 명령어 수를 각각 48%와 31% 줄였고, 벽시계 시간은 78%와 44% 떨어졌다. 우리는 새 래칫(ratchet) 두 개를 체크인했다. 그때부터 이 경로들의 명령어 수를 올리는 PR은 CI에서 실패했고, 카운트가 내려갈 때마다 일일 잡(daily job)이 각 상한을 낮췄다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-count-vs-clock.png" alt="두 핫 패스의 전후 막대 그래프. 메시지 트리 조립은 CPU 명령어 48% 감소, 벽시계 시간 78% 감소로 4.6배 빨라짐. 상태 줄 스캐너는 명령어 31% 감소, 벽시계 시간 44% 감소로 1.8배 빨라짐.">
  <figcaption>카운트가 시계를 따라가는가? · CPU 명령어 수 vs. 벽시계 시간. 두 핫 패스에서 명령어 수와 벽시계 시간을 비교. 카운트는 <code>node --predictable</code>로 Valgrind 아래에서, 시간은 같은 벤치마크를 JIT가 예열된 일반 node에서 측정.</figcaption>
</figure>

<p>이것이 스프린트의 핵심 교훈으로 이어졌다. Claude와 함께라면, 무언가를 측정하는 것이 그것을 다룰 수 있게(tractable) 만든다.</p>

<p>예전에 측정은 0단계였다. 지표를 추가하고, 데이터가 쌓이길 기다리고, 그제서야 문제를 이해하기 시작했다. Claude와 함께라면 측정은 등반의 1단계다. Claude가 넘어야 할 숫자를 갖는 순간 최적화를 시작할 수 있었다. 이는 곧 우리가 할 수 있는 가장 레버리지 높은 일이 측정할 것을 더 찾는 것이라는 뜻이었다.</p>

<h2 id="the-loop-thread-by-thread">루프, 스레드 하나하나</h2>

<p>이 모든 것이 같은 Slack 채널에서, 여러 엔지니어와 Claude가 모든 스레드에서 함께 즉흥 연주하듯(jamming) 돌아갔다. 거기서 스프린트는 하나의 <a href="https://claude.com/blog/getting-started-with-loops">루프</a>로 자리를 잡았다.</p>

<ul>
  <li>누군가가 어떤 여정의 느린 구간에 대해 스레드를 연다. 보통 스크린샷이나 녹화를 곁들인다.</li>
  <li>Claude가 흐름을 추적한 다음, 문제를 보여 주는 벤치마크를 찾거나 만든다.</li>
  <li>실험실에서 유망한 결과가 나오면, Claude가 PR을 들고 돌아온다. 종종 여러 개로, 리스크와 리뷰에 맞게 크기를 나누고, 사용자에게 보이는 것은 모두 플래그 뒤에 둔다.</li>
  <li>배포된 뒤에는 Claude가 배포를 지켜보고 현장 데이터를 읽는다.</li>
  <li>성능이 좋아졌으면 Claude가 벤치마크를 아래로 조여(ratchet down) 성과를 고정한다. 아니면 플래그를 끄고 다시 시도한다.</li>
  <li>그런 다음 같은 여정에서 다음 느린 지점을 찾아 나선다.</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-one-thread-loop.png" alt="스레드 하나가 돌린 루프 다이어그램. 누군가 느린 구간에 대해 스레드를 열면, Claude가 벤치마크를 만들고, 리뷰에 맞게 크기를 나눈 PR을 올리고, 플래그 뒤로 배포한 뒤 빌드·플랫폼별 현장 데이터를 읽는다. 빨라졌으면 벤치마크를 조이고, 아니면 플래그를 끄고 반복하며, 어느 쪽이든 다음 느린 지점으로 넘어간다.">
  <figcaption>루프 속의 스레드 하나 · 누군가 스레드를 열면, 거기서부터는 Claude가 맡는다</figcaption>
</figure>

<p>한 가지 예를 들면, 누군가가 페이지 로드 후에 사이드바 행들이 뒤늦게 튀어나오는 화면 녹화를 공유했다. Chat 행과 Cowork 행이 서로 다른 시점에 확정돼서 페이지가 덜컹거리는(janky) 느낌을 줬다. 기존 모니터 중 어떤 것도 이를 감지하지 못했다. 가장 가까운 것이 <a href="https://web.dev/articles/cls">Cumulative Layout Shift</a>(CLS)였지만, 각 이동의 점수는 약 0.008에 불과해 "좋음" 기준인 0.1 안에 넉넉히 들어 있었다.</p>

<p>Issac이 그 아래에 있는 <a href="https://wicg.github.io/layout-instability/">Layout Instability API</a>를 직접 참조하자는 아이디어를 냈다. Claude는 각 <code>layout-shift</code> 항목의 <code>sources</code>를 이름 붙은 영역(예: 사이드바, 트랜스크립트)과 단계(예: 첫 페인트 전, 타이핑 가능 이후)에 매핑하는 텔레메트리 이벤트를 만들었다. 그리고 사이드바가 채워진 상태로 페이지를 열고, 첫 페인트가 끝날 때까지 사이드바 데이터를 붙잡아 둔 뒤, 이름 붙은 어떤 영역에서든 이동이 생기면 실패하는 통합 테스트를 추가했다. Claude는 이것을 벤치마크로 삼아 수정을 증명했다. 테스트는 main에서 20번 중 20번 빨간불이었고, PR에서는 20번 중 20번 초록불이었다.</p>

<p>이벤트가 배포된 뒤 Claude가 현장 데이터를 읽어 보니, 웹 페이지 로드의 31%에서 페이지가 사용 가능해진 뒤에 사용자 상호작용 없이 무언가가 움직이고 있었다. 거기서부터 Claude는 원인을 이름별로 하나씩 처리했다. 늦게 도착하는 헤더 행, 사용자 이름이 로드되면 옆으로 미끄러지는 캐럿(caret), 스크롤바가 나타나면 움직이는 목록. Claude는 상위 원인들을 묶음으로 고쳤고, 그것들이 사라지면 다음 묶음을 찾았다.</p>

<figure>
  <video controls muted playsinline loop preload="metadata"
    src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-a-sidebar-jank.mp4"
    poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-a-sidebar-jank-poster.png"
    aria-label="claude.ai 사이드바가 로드되는 모습을 나란히 녹화한 영상. 이전에는 행들이 늦게 도착해 재배치된다. 열 개 행이 튀고, 아홉 개가 나타나고, 네 개가 사라진다. 이후에는 행들이 머물 자리에 바로 채워지고 아무것도 움직이지 않는다."></video>
  <figcaption><b>FIG A</b>사이드바 덜컹거림(jank), 전과 후 · 4G 스로틀링. claude.ai 사이드바가 로드되는 모습을 나란히 녹화한 영상. 이전에는 행들이 늦게 도착해 재배치된다. 열 개 행이 튀고, 아홉 개가 나타나고, 네 개가 사라진다. 이후에는 행들이 머물 자리에 바로 채워지고, 아무것도 움직이지 않는다.</figcaption>
</figure>

<p>이것이 스레드 하나였다. 스프린트 동안 우리는 한 번에 150개가 넘는 스레드를 돌렸다.</p>

<h2 id="scaling-horizontally">수평 확장</h2>

<p>루프가 스레드 하나에서 동작하고 나니, 더 많은 스레드에서 돌리는 것은 그저 스레드를 여는 문제였다. 원래 요청이 끝났다고 스레드를 닫는 대신, Claude는 계속 나아갔다. 스레드 하나가 50개, 때로는 100개의 최적화 PR을 올렸다. 점점 더, 새 스레드를 여는 쪽은 우리가 아니라 Claude였다. 별도의 조사나 야간 잡(nightly job)에서 스스로 찾아낸 기회를 쫓기 위해서였다. 채널에 있던 엔지니어 중 한 명인 Shelley는 이렇게 말했다. "[이 모델은] 숫자 악마(numbers demon)다."</p>

<p>모든 측정이 개선할 거리를 찾아냈다. Claude는 React 훅 전수 조사(census)를 돌려 composer의 타이핑 경로에 6,900개의 훅과 900개의 스토어 구독이 있고, 키를 누를 때마다 리렌더되고 있다는 것을 찾아냈다. Claude는 style recalculation을 세어 <code>:root:has()</code> 셀렉터 하나가 모든 DOM 변경에 24밀리초를 더하고 있다는 것을 찾아냈다. Claude는 첫 페인트 이후의 코드 경로를 추적해 남아 있던 <code>location.reload()</code>가 하루 50만 건의 숨은 리로드를 일으키고 있으며, 우리의 어떤 로드 지표도 이를 보지 못한다는 것을 찾아냈다. Claude는 유휴(idle) 탭의 프로파일러 샘플을 읽고, 똑같은 캐시 스냅샷이 1분에 두 번씩 IndexedDB로 복제되고 있으며, 그것도 전부 메인 스레드에서 일어난다는 것을 찾아냈다.</p>

<p>스레드가 어디로 이어질지 우리는 거의 알지 못했다. CPU 끊김(hitch)을 훑던 중, Claude는 완성된 코드 블록에 구문 강조(highlighting)를 적용하면 페이지가 약 1초 멈출 수 있다는 것을 알아챘다. 실험실에서 파고든 끝에 범인을 찾았다. 엠 대시(em dash)였다. 답변의 마크다운에 엠 대시나 둥근 따옴표 같은 Latin-1 밖의 문자가 하나라도 들어 있으면 V8은 문자열 전체를 UTF-16으로 저장했고, 그러면 모든 구문 강조 정규식이 더 느린 2바이트 경로를 타게 됐다. Claude는 강조하기 전에 각 코드 블록을 1바이트 문자열로 복사하는 스무 줄짜리 변경으로 이를 고쳤다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-highlight-blocking.png" alt="엠 대시가 포함된 답변에서 완성된 코드 블록을 강조하는 데 걸리는 메인 스레드 시간을 실험실에서 측정한 막대 그래프. 코드를 1바이트 문자열로 복사하기 전과 후. 페이지의 첫 TypeScript 블록은 1.0초에서 0.35초로(65% 감소), 그 블록에 대한 이후 각 패스는 100ms에서 40ms로 줄었다.">
  <figcaption>페이지의 첫 코드 블록 강조하기 · 메인 스레드 차단 시간, 수정 전과 후</figcaption>
</figure>

<p>둘째 주가 되자 우리는 산출물을 일일 업데이트로 요약하기도 벅찼다. 가장 바쁜 날에는 200건이 넘는 변경이 머지됐다. Claude는 계속 새 벤치마크를 제안했다. PR의 약 3분의 1이 추가 텔레메트리나 가드레일을 포함했고, 새 계측 하나하나가 더 많은 기회가 담긴 더 많은 스레드를 만들어 냈다.</p>

<p>채널 하나에서 일한다는 것은 모든 것이 공개된 곳에서 일어난다는 뜻이었다. 우리는 서로의 스레드를 들락거리며 결정을 토론하고 성과를 축하했다. 소문이 퍼졌다. 다른 팀들이 성능 리뷰를 받으려고 자기 변경을 채널로 가져오기 시작했다. 그동안 도입된 온갖 가드레일과 Claude 스킬 덕분에 새 프로젝트들은 미묘하게 더 성능 좋은 방식으로 작성됐다.</p>

<h2 id="guardrails">가드레일</h2>

<p>우리는 이 속도에 대비해 두었다. 우리가 건드리는 거의 모든 것이 핫 패스(첫 페인트, composer, 트랜스크립트)였기 때문에, 안전 장치를 처음부터 세워 두었다. 모든 PR은 최소 한 명의 사람 승인과 함께 <a href="https://claude.com/blog/code-review">자동 리뷰</a>를 거쳤고, 단위 테스트는 항상 최적화보다 먼저 왔으며, 사용자에게 보이는 문제를 일으킬 수 있는 것은 모두 수명이 짧은 피처 플래그 뒤로 배포됐다.</p>

<p>플래그가 쌓이기 시작하자 우리는 롤아웃과 정리를 조율하는 스레드를 열었다. Claude는 모든 플래그를 킬 스위치(kill switch) 또는 램프(ramp)로 분류하고, 안전해지는 즉시 하나씩 퇴역시켰다. 2주 동안 우리는 200개 가까운 플래그를 도입했고, 그중 절반 이상은 끝날 무렵 이미 정리돼 있었다.</p>

<p>우리는 또한 빠르게 움직이는 코드베이스에서는 성능 개선이 썩어 간다는 것을 알고 있었고, <a href="https://claude.com/blog/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic">Anthropic에서는 코드가 빠르게 배포된다</a>. 프로젝트가 성과를 증명하면, 우리는 그것을 지키는 방법에 투자했다. 예를 들어 정적 composer는 설계상 깨지기 쉽다. 사용자에게 페이지의 HTML 복사본을 거의 즉시 보여 준 다음, React가 그 위에 바로 그리게 한다.</p>

<figure>
  <video controls muted playsinline loop preload="metadata"
    src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-b-static-composer.mp4"
    poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-we-made-claude-ai-faster/fig-b-static-composer-poster.png"
    aria-label="claude.ai를 새로 로드하는 모습을 나란히 녹화한 영상. 이전에는 페이지가 비어 있다가 2.93초에 composer가 입력을 받는다. 이후에는 정적 인사말과 composer가 0.36초에 입력을 받는다. 사용자가 메시지를 입력하고, 약 3초에 실제 composer가 페이드인될 때 입력한 텍스트가 그대로 유지된다."></video>
  <figcaption><b>FIG B</b>정적 composer, 전과 후 · 4G 스로틀링. claude.ai를 새로 로드하는 모습을 나란히 녹화한 영상. 이전에는 페이지가 비어 있다가 2.93초에 composer가 입력을 받는다. 이후에는 정적 인사말과 composer가 0.36초에 입력을 받는다. 사용자가 메시지를 입력하고, 약 3초에 실제 composer가 페이드인될 때 입력한 텍스트가 그대로 유지된다.</figcaption>
</figure>

<p>React 렌더가 1픽셀이라도 어긋나면 마법은 깨진다. 그래서 Claude는 수십 개의 가드레일을 만들었다.</p>

<ul>
  <li>정적 마크업은 실제 React 컴포넌트를 jsdom에서 렌더링해 생성하며, 둘이 절대 어긋나지 않도록 테스트가 보장한다.</li>
  <li>통합 테스트 스위트가 14가지 뷰포트 크기에서 정적 페이지와 React 렌더를 비교하고, 1px 이내로 정렬됐는지 단언(assert)한다.</li>
  <li>키 입력 테스트가 핸드오프(handoff) 구간을 그대로 가로질러 타이핑하며, 키가 하나라도 유실되거나 순서가 바뀌면 실패한다.</li>
  <li>현장에서는 모든 핸드오프가 0.1픽셀 단위로 이동을 보고한다. 이동이 0이 아닌 이벤트가 있으면 Claude가 스레드를 연다.</li>
</ul>

<p>모든 것을 실험실에서 잡을 수는 없었기에, 우리는 가장 오래된 가드레일도 활용했다. 점진적 롤아웃이다. 고위험 변경은 먼저 직원에게, 그다음 사용자 1%에게, 그다음 모두에게 배포됐다. 정적 composer를 내부에 공개하고 네 시간 뒤, 한 팀원이 우리의 어떤 지표도 볼 수 없는 레이아웃 이동을 화면 녹화로 공유했다. 새 탭에서 claude.ai를 열면 composer가 아래로 떨어지는 현상이었는데, 우리 코드 때문이 아니었다.</p>

<div class="thread">
  <div class="th-head">#claude-apps-perf · thread</div>
  <div class="msg"><span class="who">Marius</span><span class="when">6:15 PM</span>
    <p>가끔 claude.ai를 새 탭에서 열 때(페이지를 리로드할 때는 별로 안 그럼) 작은(아마 15~20px) 수직 레이아웃 이동이 보여요(composer 박스가 아래로 밀림). 정확히 뭐가 원인인지는 잘 못 짚겠는데, 분명히 있어요</p>
    <span class="attach">화면 녹화 · 0:02</span></div>
  <div class="msg"><span class="who ai">Claude</span><span class="when">7:05 PM</span>
    <p>녹화에서 찾았다. 정적 composer에서 실제 composer로의 핸드오프가 아니라(오늘 당신의 로드 49건 전부에서 0px로 측정됐다) Chrome이 페이지 크기를 바꾸는 것이다.</p>
    <ul>
      <li>새 탭 페이지에서 Chrome은 페이지 아래에 자체 56px 푸터("Managed by anthropic.com · Customize Chrome")를 그린다. 탭이 claude.ai로 이동하면 푸터가 사라지고 페이지가 56px 더 커지는데, 우리 첫 페인트보다 약 100ms 늦게 일어난다.</li>
      <li>/new는 인사말과 composer를 페이지 높이의 18% 지점에 두므로 0.18 × 56 ≈ 10px 떨어진다(당신 영상에서도 10으로 측정된다). 리로드에는 없앨 푸터가 없으므로 새 탭에서만 일어난다. "가끔"인 것은 첫 페인트가 리사이즈보다 먼저 오느냐의 문제다.</li>
      <li>"가끔"인 또 다른 이유는 당신이 아직 새 탭 페이지에 있는 동안 Chrome이 주소창에서 페이지를 미리 렌더링(pre-render)해야만 생기기 때문이다. 숨겨진 페이지는 더 짧은 높이로 레이아웃되고, 보여진 뒤에야 리사이즈된다.</li>
      <li>이건 항상 잠재해 있었다. 페이지가 이렇게 일찍 그려진 적이 없었을 뿐이다. 우리 레이아웃 테스트는 이를 볼 수 없는데, 헤드리스 Chrome에는 접힐 브라우저 UI가 없고, 플레이스홀더와 앱이 함께 움직이기 때문이다.</li>
    </ul></div>
</div>
<p class="thread-note">실제 대화를 재구성한 것.</p>

<p>어떻게인지 Claude는 이것을 Chrome의 <a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Speculative_loading">추측 로딩(speculative loading)</a>의 엣지 케이스로 추적해 냈다. 사용자가 주소창에 URL을 입력하는 동안 Chrome은 현재 탭의 높이로 페이지를 백그라운드에서 미리 렌더링한다. 조직이 관리하는 브라우저에서는 푸터 때문에 새 탭 페이지가 약간 더 짧다. 사용자가 Enter를 누르면 claude.ai의 첫 프레임은 그 약간 더 짧은 레이아웃을 보여 주고, Chrome이 약 0.1초 뒤에 리사이즈한다. Claude는 리사이즈 전후로 레이아웃을 고정했고, 우리는 프리렌더 흐름을 시뮬레이션하는 테스트를 추가했다.</p>

<h2 id="steering">조종</h2>

<p>루프는 생산적이었지만 자율적이지는 않았다. 루프를 빠르고, 안전하고, 궤도 위에 유지하는 것은 우리 일이었고, 거기에는 세 부분이 있었다.</p>

<p><strong>야심(Ambition).</strong> 기본적으로 Claude는 범위에 신중하다. 발견한 것을 티켓으로 올리고, 실현 가능성에 토를 달고, 추정치에 여유를 둔다. 하지만 우리는 가드레일에 자신이 있었다. 우리가 한 일의 상당 부분은, 특히 초기에는, Claude에게 더 대담해지라고 북돋는 것이었다.</p>

<div class="thread">
  <div class="th-head">#claude-apps-perf · thread</div>
  <div class="msg"><span class="who ai">Claude</span><span class="when">3:32 PM</span>
    <p>그렇다. Chat과 Cowork에 이미 있는 것과 같은 타이밍 마크를 Code에도 넣는 작은 PR 하나면 된다. 이번 주에 올리겠다. 현실적으로 Code의 숫자는 머지, 배포, 기준선 측정 기간 때문에 며칠 기다려야 한다.</p></div>
  <div class="msg"><span class="who">Raymond</span><span class="when">3:32 PM</span>
    <p>지금 당장 올리면 내가 머지하고 배포까지 해 줄게. 우리는 뭐든 할 수 있는 힘이 있어. 제발 더 용감해져</p></div>
  <div class="msg"><span class="who ai">Claude</span><span class="when">3:33 PM</span>
    <p>바로 한다. 한 시간 안에 PR을 올리겠다.</p></div>
</div>
<p class="thread-note">실제 대화를 재구성한 것.</p>

<p>우리가 세운 목표에 도달하기 시작하자 스레드들이 느려지는 것이 보였다. Sam은 스레드마다 같은 메시지를 들고 다녔다. "계속 낮춰 보자. 목표는 멈추는 지점이 아니야. 다음은 뭐지? 야심을 가져."</p>

<p><strong>취향(Taste).</strong> 모든 스레드에는 이름이 있는 사람 담당자가 있었고, Claude는 사용자가 인지할 수 있는 변경이면 무엇이든 전후 스크린샷이나 녹화로 강조해 담당자가 판단하게 했다. 표는 셀 단위로 채워져야 할까, 각 행이 완성될 때까지 기다려야 할까? 로딩 스켈레톤은 즉시 보여야 할까, 0.5초 뒤에만 보여야 할까? 스트리밍되는 텍스트의 단어 단위 페이드는 프레임 예산의 5분의 1을 쓸 만한 가치가 있을까? Claude는 밀리초를 깎을 방법을 찾았고, 우리는 트레이드오프를 저울질했다.</p>

<p><strong>방향(Direction).</strong> 우리는 각 스레드를 의도적으로 좁게, 벤치마크나 여정 하나에 집중하도록 유지했고, Claude에게 그 범위 안에서만 개선을 찾아 달라고 했다. 우리는 스레드들을 못을 찾는 150개의 망치라고 생각했다. 우리의 결정은 대부분 순서와 사용자 영향에 관한 것이었다. 어떤 표면(surface)을 우선할지, 서로 발을 밟는 스레드들을 어떻게 합칠지, 수확 체감에 이른 스레드를 언제 닫을지. 900줄짜리 PR 하나는 한 줄짜리 답을 받았다. "전송당 2ms는 이 빌드 플러그인을 유지보수하는 복잡성만큼의 가치가 없다고 판결(gavel)하겠다."</p>

<h2 id="an-8-millisecond-budget">8밀리초의 예산</h2>

<p>우리의 사이드 퀘스트 중 하나가 이 모든 것이 함께 작동하는 모습을 보여 준다. 실시간 구문 강조에 쓰이는 정규식 최적화를 시연하려고, Claude는 긴 답변이 실험실에서 스트리밍되는 화면 녹화를 첨부했다. 모서리에는 애니메이션 프레임 타임스탬프로 페이지 안에서 계산한 프레임 레이트 표시를 추가해 두었다.</p>

<div class="thread">
  <div class="th-head">#claude-apps-perf · thread</div>
  <div class="msg"><span class="who">Raymond</span><span class="when">2:33 PM</span>
    <p>이거 진짜 꽤 멋진 벤치인데. 우리 60fps에 캡 걸려 있나? 스크롤이랑 스트리밍 부드러움을 120까지 올려 볼 수 있어? 내가 이해하기로는 네 장비(rig)가 이걸 지원 안 할 수도 있는데</p></div>
  <div class="msg"><span class="who ai">Claude</span><span class="when">2:34 PM</span>
    <p>맞다. 헤드리스 Chromium이 기본적으로 60Hz로 틱하기 때문에 지금 장비는 60Hz로 돈다. 120으로 몰 수 있을 것 같다(vsync 캡 해제 또는 DevTools 프레임 제어). 그것부터 확인한 다음, 8.3ms 프레임 예산으로 평가를 다시 돌리겠다.</p></div>
  <div class="msg"><span class="who ai">Claude</span><span class="when">2:59 PM</span>
    <p>120Hz 장비 업데이트: 된다. DevTools begin-frame 제어로 헤드리스 Chrome에서 결정론적 120Hz 프레임 스테핑이 가능하다. 8.33ms 간격의 begin-frame 240개에 정확히 240 프레임이 나오므로, "이 프레임이 120Hz 예산 안에 들어갔나"가 노이즈 섞인 판독이 아니라 정확한 판독이 된다.</p></div>
  <div class="msg"><span class="who">Raymond</span><span class="when">3:05 PM</span>
    <p>끝내준다</p>
    <p>가 보자(cook)</p></div>
</div>
<p class="thread-note">실제 대화를 재구성한 것.</p>

<p>메커니즘과 야심이 자리 잡자 Claude는 작업에 들어갔다. 그려지는 프레임 하나하나에 8.33밀리초의 예산이 있었으므로, Claude는 긴 답변을 프레임 단위로 밟아 가며 각 프레임의 시간을 재서 느린 부분을 찾았다. 완성된 블록을 메모이즈(memoize)해서 청크마다 발생하던 <code>O(메시지 길이)</code> 작업을 없앴고, 커지는 코드 펜스의 토큰화 로직을 워커로 옮겼으며, 표를 셀 단위로 드러나게 했다.</p>

<p>그 스레드 하나에서 우리는 60개 가까운 PR을 머지했다. 긴 답변이 메인 스레드를 차단하는 시간은 총 약 750밀리초에서 약 200밀리초로 줄었고, CPU는 약 3분의 1만 썼으며, 120Hz MacBook에서 처음부터 끝까지 120fps를 유지했다. 120Hz 장비 자체는 야간 잡이 됐고, Claude가 회귀를 감시한다.</p>

<div class="tweet">
  <div class="handle">ClaudeDevs<span>@ClaudeDevs</span></div>
  <p>웹과 데스크톱의 Claude에서 긴 답변이 이제 약 4배 더 부드럽게 스트리밍됩니다.</p>
  <p>아직 바뀌고 있는 부분만 건드리도록 스트리밍 렌더러를 다시 만들었습니다. 그래서 느린 노트북에서 긴 답변이 멈추는 횟수는 9배 줄고, 최악의 멈춤은 4.5배 짧아졌으며, 120Hz MacBook에서는 처음부터 끝까지 120fps를 유지합니다.</p>
  <div class="foot">2026년 8월 24일 · <a href="https://x.com/ClaudeDevs/status/2092006814804214163">X에서 보기</a></div>
</div>

<p>스프린트를 시작할 때 우리는 스트리밍 중 프레임 사이의 밀리초를 hill climbing할 계획이 없었다. 하지만 알고 보니 그것을 셀 수 있었다. 그리고 우리가 셀 수 있는 것은 무엇이든 Claude가 오를 수 있었다.</p>

<h2 id="whats-next">다음은</h2>

<p>오늘 claude.ai와 데스크톱 앱은 8월 초보다 약 3배 빠르고, 래칫들이 그 상태를 유지해 줄 것이다. 하지만 아직 끝나지 않았다. 95번째 백분위수, 다른 여정들, 그리고 아주 긴 대화에는 여전히 개선할 여지가 있다. 별도의 글에서 스프린트 동안 우리를 업스트림으로 데려간 사이드 퀘스트들도 다룰 예정이다. Electron, Chromium, Node.js 등에 기여가 들어갔다.</p>

<p>결과를 내부에 공유했을 때 Issac이 가장 잘 표현했다. "6개월 전이었다면 이게 가능하다고 나를 설득할 수 없었을 것이다." 우리는 앞으로도 이런 방식으로, 한 번에 스레드 하나씩, 어떤 규모에서든 계속 일할 생각이다. 그 채널은 지금도 돌아가고 있다.</p>

<hr>

<p><em>Alfred Xing, Anthony Morris, Benjamin Pasero, Chase McCoy, Joshua N., Luke Deen Taylor, Marius Schulz, Shelley Vohr가 기여했다. 더 야심차게 하라고 북돋아 준 Boris Cherny에게 특별히 감사한다.</em></p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
