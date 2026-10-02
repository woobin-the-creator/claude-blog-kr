---
slug: "lessons-from-building-claude-code-prompt-caching-is-everything"
title: "Claude Code를 만들며 배운 것: 프롬프트 캐싱이 전부다"
nav: "프롬프트 캐싱이 전부다 · 접두어 순서·메시지로 갱신·도구/모델 고정·캐시 안전 컴팩션 포크"
main: "claude.dev"
cat: "Engineering"
date: "2026-04-30"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 7946
---

<!-- rendered HTML -->
<header>
  <h1>Claude Code를 만들며 배운 것: 프롬프트 캐싱이 전부다</h1>
  <div class="meta">
    2026년 4월 30일
    · 카테고리: Engineering
    · 글쓴이: Thariq Shihipar
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything">Lessons from building Claude Code: Prompt caching is everything</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Claude Code에서 프롬프트 캐싱(prompt caching)을 최적화하기 위한 모범 사례. 프롬프트를 가장 효과적으로 구성하는 방법, 도구를 쓰는 방법, 그 위에 컴팩션(compaction)을 얹는 방법을 다룬다.</p>

<p>엔지니어링에서는 "캐시가 내 주변의 모든 것을 지배한다(cache rules everything around me)"는 말을 자주 하는데, 같은 규칙이 에이전트에도 그대로 적용된다.</p>

<p>Claude Code처럼 오래 실행되는 에이전트 제품이 현실적으로 가능한 것은 <a href="https://x.com/RLanceMartin/status/2024573404888911886"><strong>프롬프트 캐싱</strong></a> 덕분이다. 프롬프트 캐싱은 이전 왕복(roundtrip)에서 수행한 연산을 재사용할 수 있게 해 주어, 지연 시간과 비용을 크게 줄여 준다.</p>

<p>Claude Code 팀은 하네스(harness) 전체를 프롬프트 캐싱을 중심으로 설계한다. 프롬프트 캐시 적중률(hit rate)이 높으면 비용이 줄고, 구독 플랜에 더 넉넉한 사용량 한도(rate limit)를 제공할 수 있다. 그래서 우리는 프롬프트 캐시 적중률에 알림을 걸어 두고, 너무 낮아지면 SEV(장애)를 선언한다.</p>

<p>아래는 대규모로 프롬프트 캐싱을 최적화하면서 배운, 종종 직관에 어긋나는 교훈들이다.</p>

<h2 id="lay-out-your-prompt-for-caching">캐싱을 염두에 두고 프롬프트를 배치하라</h2>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/lessons-from-building-claude-code-prompt-caching-is-everything/fig-a-prompt-layout.png" alt="Claude Code의 요청 구조: 정적 시스템 프롬프트와 도구, CLAUDE.md, 세션 컨텍스트가 캐시된 접두어를 이루고, 그 뒤로 대화 메시지만 턴마다 늘어난다." loading="lazy">
  <figcaption><b>FIG A</b>Claude Code의 시스템 프롬프트는 안정적인 부분은 캐시에 남고, 대화 자체만 턴마다 늘어나도록 구성되어 있다.</figcaption>
</figure>

<p>프롬프트 캐싱은 접두어 일치(prefix matching) 방식으로 동작한다. API는 요청의 시작부터 각 <code>cache_control</code> 브레이크포인트까지의 모든 내용을 캐시한다. 즉, 무엇을 어떤 순서로 넣는지가 엄청나게 중요하다. 가능한 한 많은 요청이 같은 접두어를 공유하게 만들어야 한다.</p>

<p>프롬프트를 어떻게 구성하느냐는 캐시 적중뿐 아니라 출력 품질에도 영향을 준다. <a href="https://claude.com/blog/best-practices-for-prompt-engineering">프롬프트 엔지니어링의 기본</a>은 이 분야의 나머지 절반이다.</p>

<p>가장 좋은 방법은 정적인 내용을 먼저, 동적인 내용을 마지막에 두는 것이다. Claude Code에서는 다음과 같은 모습이다.</p>

<ol>
  <li><strong>정적 시스템 프롬프트</strong>와 도구(tools) — 전역으로 캐시됨</li>
  <li><strong>CLAUDE.md</strong> — 프로젝트 안에서 캐시됨</li>
  <li><strong>세션 컨텍스트</strong> — 세션 안에서 캐시됨</li>
  <li><strong>대화 메시지</strong></li>
</ol>

<p>이렇게 하면 캐시 적중을 공유하는 세션의 수를 최대로 늘릴 수 있다.</p>

<p>하지만 이 접근은 놀랄 만큼 깨지기 쉽다. 우리도 여러 가지 이유로 이 순서를 깨뜨린 적이 있다. 정적 시스템 프롬프트에 상세한 타임스탬프를 넣은 것, 도구 정의의 순서를 비결정적으로 섞은 것, 도구의 파라미터(예: Agent 도구가 호출할 수 있는 에이전트 목록)를 갱신한 것 등이 그 예다.</p>

<h2 id="use-messages-for-updates">갱신에는 메시지를 쓰라</h2>

<p>프롬프트에 넣은 정보가 시간이 지나 낡는 경우가 있다. 예를 들어 현재 시각을 넣어 두었거나, 사용자가 파일을 바꾼 경우다. 프롬프트를 고치고 싶은 유혹이 들겠지만, 그러면 캐시 미스(cache miss)가 발생하고 사용자에게 꽤 큰 비용이 될 수 있다.</p>

<p>대신 이 정보를 에이전트의 다음 턴 메시지로 전달할 수 있는지 생각해 보라. Claude Code에서는 다음 사용자 메시지나 도구 결과(tool result)에 <code>&lt;system-reminder&gt;</code> 태그를 추가해 모델에 갱신된 정보를 전달한다. 이렇게 하면 캐시가 보존된다.</p>

<h2 id="dont-change-models-mid-session">세션 중간에 모델을 바꾸지 말라</h2>

<p>프롬프트 캐시는 모델별로 따로 존재하며, 이 때문에 프롬프트 캐싱의 비용 계산은 꽤 직관에 어긋날 수 있다.</p>

<p>예를 들어 Opus와 10만 토큰짜리 대화를 진행한 상태에서 비교적 쉬운 질문을 하나 하고 싶다고 하자. 이때 Haiku로 전환하는 것이 Opus에게 그냥 답하게 하는 것보다 실제로는 더 비싸다. Haiku용 프롬프트 캐시를 처음부터 다시 만들어야 하기 때문이다.</p>

<p>모델을 꼭 바꿔야 한다면 가장 좋은 방법은 서브에이전트(subagent)를 쓰는 것이다. 위의 예를 이어 가면, Opus에게 처리해야 할 작업에 대해 다른 모델로 넘기는 "인계(hand-off)" 메시지를 준비하게 하는 서브에이전트를 띄울 수 있다. 우리는 Haiku를 쓰는 Claude Code의 Explore 에이전트에서 이 방식을 자주 사용한다.</p>

<h2 id="never-add-or-remove-tools-mid-session">세션 중간에 도구를 추가하거나 제거하지 말라</h2>

<p>대화 중간에 도구 집합을 바꾸는 것은 사람들이 프롬프트 캐싱을 깨뜨리는 가장 흔한 방법 중 하나다. 직관적으로는 맞는 것처럼 보인다. 모델에게는 지금 필요하다고 생각되는 도구만 주어야 한다는 것이다. 하지만 도구는 캐시된 접두어의 일부이므로, 도구를 추가하거나 제거하면 대화 전체의 캐시가 무효화된다.</p>

<h3 id="using-plan-mode-to-design-around-the-cache">캐시를 중심으로 설계하기: Plan Mode</h3>

<p><a href="https://code.claude.com/docs/en/common-workflows">Plan Mode</a>는 캐싱 제약을 중심으로 기능을 설계한 좋은 예다. 직관적인 접근은 이렇다. 사용자가 plan mode에 들어가면 도구 집합을 읽기 전용 도구만으로 교체한다. 하지만 그러면 캐시가 깨진다.</p>

<p>대신 우리는 <em>모든</em> 도구를 항상 요청에 유지하고, EnterPlanMode와 ExitPlanMode 자체를 도구로 둔다. 사용자가 Plan Mode를 켜면 에이전트는 지금 Plan Mode에 있다는 것과 지시 사항을 설명하는 시스템 메시지를 받는다. 코드베이스를 탐색하고, 파일을 편집하지 말고, 계획이 완성되면 ExitPlanMode를 호출하라는 내용이다. 도구 정의는 절대 바뀌지 않는다.</p>

<p>여기에는 덤으로 따라오는 이점이 있다. EnterPlanMode는 모델이 스스로 호출할 수 있는 도구이므로, 어려운 문제를 감지하면 캐시를 전혀 깨뜨리지 않고 자율적으로 plan mode에 들어갈 수 있다.</p>

<h3 id="use-tool-search-to-defer-instead-of-remove">제거 대신 지연(defer): tool search 활용</h3>

<p>같은 원칙이 우리의 <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool">tool search tool</a>에도 적용된다. Claude Code에는 수십 개의 MCP 도구가 로드될 수 있는데, 이것을 모두 매 요청에 포함하면 비용이 크지만, 대화 중간에 제거하면 캐시가 깨진다.</p>

<p>우리의 해법은 <code>defer_loading</code>이다. 도구를 제거하는 대신, 가벼운 스텁(stub)만 보낸다. 도구 이름에 <code>defer_loading: true</code>만 붙인 것이다. 모델은 필요할 때 tool search로 이 도구들을 "발견"할 수 있다. 전체 도구 스키마는 모델이 해당 도구를 선택했을 때만 로드된다. 같은 스텁이 항상 같은 순서로 존재하기 때문에 캐시된 접두어가 안정적으로 유지된다.</p>

<p>API에서 <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool">tool search tool</a>을 써서 이 과정을 더 단순하게 처리할 수도 있다.</p>

<h2 id="compacting-without-breaking-the-cache">캐시를 깨지 않고 컴팩션하기</h2>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/lessons-from-building-claude-code-prompt-caching-is-everything/fig-b-compaction-fork.png" alt="컴팩션 흐름: 컨텍스트 윈도우가 가득 차면 부모 대화와 같은 접두어로 캐시된 호출을 포크해 요약을 만들고, 원래 메시지 대신 요약을 넣어 대화를 이어 간다." loading="lazy">
  <figcaption><b>FIG B</b>컨텍스트 윈도우가 가득 차면 Claude Code는 캐시된 호출을 포크(fork)해 대화를 요약한 뒤, 원래 메시지 자리에 요약을 넣고 대화를 재개한다.</figcaption>
</figure>

<p><a href="https://platform.claude.com/docs/en/build-with-claude/compaction">컴팩션(Compaction)</a>은 컨텍스트 윈도우가 다 찼을 때 일어나는 일이다. 지금까지의 대화를 요약하고, 그 요약으로 새 세션을 이어 간다.</p>

<p>컴팩션은 프롬프트 캐싱과 상호작용하는데, 여기서 실수하기가 쉽다. 대화를 컴팩션하려면 모델이 요약을 쓸 수 있도록 전체 대화를 모델에 보내야 한다. 가장 단순한 방법은 별도의 API 호출을 하나 만들어 자체 시스템 프롬프트("이것을 요약하라" 같은 것)를 주고 도구는 붙이지 않는 것이다. 하지만 바로 거기에 비용 함정이 있다. 프롬프트 캐싱은 요청의 접두어가 이미 캐시된 내용과 처음부터 바이트 단위로 일치할 때만 적용된다. 메인 대화는 어떤 시스템 프롬프트와 도구 집합 아래에서 캐시되어 있고, 요약 호출은 다른 시스템 프롬프트에 도구가 없으니, 두 접두어는 맨 첫 토큰에서부터 갈라지고 캐시는 전혀 적용되지 않는다. 결국 보내는 대화 전체에 대해 캐시되지 않은 입력 요금을 전액 지불하게 된다. 그리고 대화가 길수록(즉, 컴팩션이 더 필요할수록) 그 한 번의 호출은 더 비싸진다.</p>

<h3 id="the-solution-cache-safe-forking">해법: 캐시 안전 포크(cache-safe forking)</h3>

<p>우리는 컴팩션을 실행할 때 부모 대화와 <em>정확히 같은</em> 시스템 프롬프트, 사용자 컨텍스트, 시스템 컨텍스트, 도구 정의를 사용한다. 부모의 대화 메시지를 앞에 그대로 두고, 맨 끝에 컴팩션 프롬프트를 새 사용자 메시지로 덧붙인다.</p>

<p>API 입장에서 이 요청은 부모의 마지막 요청과 거의 동일하게 보인다. 같은 접두어, 같은 도구, 같은 히스토리이므로 캐시된 접두어가 재사용된다. 새로 들어가는 토큰은 컴팩션 프롬프트 자체만이다.</p>

<p>다만 이 방식에서는 컴팩션 메시지와 요약 출력 토큰이 들어갈 자리가 컨텍스트 윈도우에 남아 있어야 하므로, "컴팩션 버퍼(compaction buffer)"를 따로 확보해 두어야 한다.</p>

<p>컴팩션은 까다롭지만, 다행히 이 교훈들을 직접 겪으며 배울 필요는 없다. Claude Code에서 배운 것을 바탕으로 우리는 <a href="https://platform.claude.com/docs/en/build-with-claude/compaction#prompt-caching">컴팩션</a>을 API에 직접 내장했으므로, 여러분의 애플리케이션에서도 이 패턴을 바로 적용할 수 있다.</p>

<h2 id="lessons-learned">배운 교훈</h2>

<p>에이전트를 만들 때 프롬프트 캐싱을 최적화하는 데 유용했던 패턴 몇 가지를 정리한다.</p>

<ol>
  <li><strong>프롬프트 캐싱은 접두어 일치다.</strong> 접두어 어디든 바뀌면 그 뒤의 모든 것이 무효화된다. 시스템 전체를 이 제약을 중심으로 설계하라. 순서만 제대로 잡으면 캐싱의 대부분은 공짜로 따라온다.</li>
  <li><strong>시스템 프롬프트 변경 대신 메시지를 쓰라.</strong> plan mode 진입, 날짜 변경 같은 것을 위해 시스템 프롬프트를 고치고 싶어질 수 있지만, 실제로는 이런 내용을 대화 중 메시지로 끼워 넣는 것이 더 낫다.</li>
  <li><strong>대화 중간에 도구나 모델을 바꾸지 말라.</strong> 도구 집합을 바꾸는 대신 도구로 상태 전환(plan mode 같은 것)을 모델링하라. 도구를 제거하는 대신 도구 로딩을 지연하라.</li>
  <li><strong>가동 시간(uptime)을 모니터링하듯 캐시 적중률을 모니터링하라.</strong> 우리는 캐시가 깨지면 알림을 보내고 이를 인시던트로 다룬다. 캐시 미스율 몇 퍼센트포인트 차이가 비용과 지연 시간에 극적인 영향을 줄 수 있다.</li>
  <li><strong>포크 작업은 부모의 접두어를 공유해야 한다.</strong> 부수 연산(컴팩션, 요약, 스킬 실행)을 실행해야 한다면, 부모의 접두어에서 캐시 적중을 얻을 수 있도록 동일한 캐시 안전 파라미터를 사용하라.</li>
</ol>

<p>Claude Code는 첫날부터 프롬프트 캐싱을 중심으로 만들어졌다. 에이전트를 만들 때 최상의 결과를 얻고 싶다면, 여러분도 그렇게 하기를 권한다.</p>

<p><a href="https://code.claude.com/docs/en/overview"><em>지금 Claude Code를 시작해 보세요.</em></a></p>

<p><em>이 글은 Claude Code 팀의 기술 스태프(member of technical staff) Thariq Shihipar가 썼습니다.</em></p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
