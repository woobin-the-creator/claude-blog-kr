---
slug: "building-agents-when-to-fold-subagents-into-your-main-agent-loop"
title: "에이전트 만들기: 서브에이전트를 메인 에이전트 루프로 합쳐야 할 때"
nav: "서브에이전트를 메인 루프로 합치기 · 점진적 공개(스킬·도구 검색), 작업 완수 eval, 하나씩 합치고 비교, 팀은 스킬·도구를 소유"
main: "Claude blog"
cat: "Best practices"
date: "2026-10-22"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 13350
---

<!-- rendered HTML -->
<header>
  <h1>에이전트 만들기: 서브에이전트를 메인 에이전트 루프로 합쳐야 할 때</h1>
  <div class="meta">
    2026년 10월 22일
    · 카테고리: <a href="https://claude.com/resources/best-practices">Best practices</a>
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop">Building agents: When to fold subagents into your main agent loop</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Claude Platform에서 에이전트를 만들 때 서브에이전트(subagent)를 줄이고 그 대신 컨텍스트와 도구를 점진적으로 공개(progressive disclosure)하면, 비용과 지연 시간(latency)을 줄이면서 품질을 높일 수 있다. 언제, 어떻게 옮겨 가면 되는지 정리했다.</p>

<p><em>Claude Platform에서 여러 서브에이전트를 포함한 에이전트를 만들었다면, 우리의 <a href="https://github.com/anthropics/single-agent-loop-kit">마이그레이션 키트(migration kit)</a>로 어떤 서브에이전트를 메인 에이전트 루프에 합치는 게 좋을지 확인해 보자. 이 키트는 안내형 워크플로를 실행해 여러분의 패턴을 식별하고, 대안을 평가하고, 가장 좋은 접근을 검증한다. 실제 에이전트에 돌리기 전에 모의(mock) 시스템에서 먼저 시험해 볼 수 있는 데모도 들어 있다.</em></p>

<p>서브에이전트란 자기만의 컨텍스트 윈도, 도구, 지시문을 갖고 <a href="https://claude.com/resources/articles/multi-agent-coordination-patterns">코디네이터가 조율하는</a> 에이전트로, 에이전트 설계의 핵심 구성 요소다. 서브에이전트는 검증, 병렬 작업, 모듈 단위 권한 부여에 효과적이다. 우리도 Claude Platform으로 만드는 여러 자체 에이전트에서 서브에이전트를 쓴다. 예를 들어 우리의 <a href="https://www.anthropic.com/engineering/multi-agent-research-system">멀티 에이전트 리서치 시스템</a>이 그렇다.</p>

<p>그런데 최근 Applied AI 팀은 라우터, 플래너, 도메인 서브에이전트를 메인 에이전트 루프에 합쳐서 효과를 본 기업 에이전트 배포 사례들에서 하나의 패턴을 발견했다. <a href="https://claude.com/resources/articles/the-anatomy-of-effective-commerce-agents#:~:text=In%20our%20comparisons%20across%20several%20enterprise%20deployments,latency%20per%20task">여러 기업 배포 사례를 비교한 결과</a>, <a href="https://claude.com/resources/articles/building-agents-with-skills-equipping-agents-for-specialized-work">스킬을 갖춘 단일 에이전트</a>가 '프롬프트 하나에 모든 것을 담는' 설계와 서브에이전트 설계 모두를 품질 면에서 자주 앞섰고, 작업당 비용과 지연 시간도 더 낮은 경우가 많았다.</p>

<p>예를 들어 한 회사는 고객 대상 에이전트 안에 있던 십여 개의 전문(specialist) 서브에이전트 때문에 브랜드에 맞는 일관된 경험을 유지하기 어려웠고, 늘어난 지연 시간이 사용자 경험을 해친다는 것을 알게 됐다.</p>

<p>우리가 검토하는 에이전트 설계안도 익숙한 순서를 따르는 경우가 많다. 의도 분류기(intent classifier), 고정된 다단계 추론 파이프라인, 사용자 세그먼트별 버킷, 별도의 추천 분기, 그리고 그 위에 얹힌 멀티 에이전트 오케스트레이터다.</p>

<p>이런 경우 우리가 주는 피드백은 대개, 이 구조의 대부분이 모델이 더 이상 대신 해 줄 필요가 없는 일을 하고 있으며, 명확한 시스템 프롬프트 하나와 얇은 데이터 도구 4~5개, 그리고 확실한 출력 가드레일만으로도 대부분의 사용 사례를 감당할 수 있다는 것이다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-agents-when-to-fold-subagents-into-your-main-agent-loop/subagent-design.gif" alt="서브에이전트 설계"></figure>

<p>분명히 해 두자면, 서브에이전트는 연구의 최전선을 포함해 여전히 쓸 곳이 있다. 다음과 같은 경우에 쓰자.</p>
<ul>
  <li>단일 에이전트 루프가 컨텍스트 비대화(context bloat)로 측정 가능한 성능 저하를 겪을 때</li>
  <li>여러 작업을, 작업이 끝나면 버릴 수 있는 새 컨텍스트 윈도에서 병렬로 처리해야 할 때</li>
  <li>단일 에이전트가 적절한 도구를 고르는 데 어려움을 겪거나, 시스템 프롬프트에 서로 충돌하는 지시가 있을 때</li>
</ul>

<p>하지만 기업들이 팀마다, 또는 문제 유형마다 서브에이전트를 하나씩 배정해서 에이전트 아키텍처가 조직도를 그대로 베낀 꼴이 되는 경우를 너무 자주 본다(콘웨이의 법칙이 작동하는 셈이다).</p>

<p>이 글에서는 언제 서브에이전트를 메인 에이전트 루프로 합치는 것을 고려해야 하는지, 그리고 대규모 조직에서 에이전트를 만들며 배운 모범 사례를 설명한다.</p>

<h2>대규모 조직에서 에이전트를 만들 때의 실패 유형</h2>

<p>기업들은 흔히 여러 제품과 기능을 하나의 고객 인터페이스로 묶는 에이전트를 만들고 싶어 한다.</p>

<p>보통 각 기능은 서로 다른 팀이 담당하기 때문에, 기업들은 우선 각 팀이 자기 에이전트를 만들게 한 뒤 중앙 플랫폼 팀이 그 위에 오케스트레이터를 얹는 방식으로 시작한다. 이는 오케스트레이터-서브에이전트 구조나, 특정 에이전트들을 MCP 도구로 노출한 단일 에이전트 구조 등 여러 형태가 될 수 있다.</p>

<p>가장 간단한 해법처럼 보이지만, 곧바로 다음과 같은 복잡성이 생긴다.</p>
<ul>
  <li><strong>컨텍스트 관리:</strong> 에이전트끼리 어떤 컨텍스트를 주고받을지 정해야 하고, 그렇게 주고받는 과정에서 세부 사항이 자주 사라진다.</li>
  <li><strong>서브에이전트 난립(subagent sprawl):</strong> 팀마다 자기 서브에이전트를 내놓기 때문에, 강제되는 기준도 명확한 담당자도 없이 서로 겹치는 서브에이전트가 수백 개에 이르게 된다.</li>
  <li><strong>프랑켄프롬프트(Frankenprompt):</strong> 팀마다 시스템 프롬프트에 문장을 하나씩 보태다 보니, 규칙끼리 충돌하고 일관된 어조가 사라진다.</li>
  <li><strong>검증되지 않은, 지나치게 국소적인 eval:</strong> 저마다 자기 하위 작업에 과도하게 최적화된 eval을 추가한다. 전체 세트를 소유하거나 관리하는 사람은 없고, 경영진은 희석되고 지나치게 국소적인 점수를 근거로 의사결정을 내린다.</li>
  <li><strong>지연 시간:</strong> 멀티 에이전트 아키텍처의 복잡성은 지연 시간을 늘린다. 자사의 멀티 에이전트 하네스(harness)를 단일 에이전트 루프와 비교 평가한 한 고객은 후자에서 실행 시간이 약 2배 빨라졌다.</li>
</ul>

<h2>점진적 공개를 쓰는 에이전트 루프</h2>

<p>앞서 설명한 오케스트레이터-서브에이전트 설계는 여러 팀에 걸쳐 만들어진 전문 에이전트들을 조율하는 합리적인 방법이지만, 더 효과적인 방법은 <strong>스킬로 컨텍스트를 점진적으로 공개하고</strong>, <strong>도구 검색(tool search)으로 도구를 점진적으로 공개하는 것</strong>인 경우가 많다. 즉, 에이전트는 스킬과 도구의 짧은 설명만 보고, 실제로 필요할 때에만 전체 내용을 불러온다.</p>

<p>이 접근이 타당한 이유는 세 가지다.</p>
<ul>
  <li><strong>공유된 컨텍스트가 더 나은 답을 만든다:</strong> 오래 실행되는 에이전트라면 여러 작업에서 나온 컨텍스트가 메인 컨텍스트 윈도에 함께 있기를 원한다. 앞선 각 단계의 결과를 직접 본 에이전트는 그것들을 서로 연결할 수 있고, 이는 서브에이전트들이 돌려주는 요약 묶음보다 더 풍부한 결과물과 더 나은 통찰로 이어진다. 또한 <a href="https://claude.com/resources/articles/building-multi-agent-systems-when-and-how-to-use-them">컨텍스트 윈도 수가 줄고, 정보가 손실되는 인계(handoff)도 줄어든다</a>.</li>
  <li><strong>점진적 공개는 컨텍스트 비대화를 막는다:</strong> 이 기법을 쓰면 모든 컨텍스트를 하나의 긴 시스템 프롬프트에 한꺼번에 불러오지 않고도 매우 다양한 작업을 해낼 수 있는 단일 에이전트를 만들 수 있다. 이는 팀들이 그동안 작업을 서브에이전트로 쪼개던 주된 이유를 없애 준다. 실제로 우리는 <a href="https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/">더 발전된 모델용 Claude Code 시스템 프롬프트를 80% 넘게 줄였는데</a>, 여기에는 스킬과 도구를 점진적으로 공개하는 것과 관련된 감축이 포함돼 있다.</li>
  <li><strong>모델의 능력이 더 좋아졌다:</strong> Opus 4.5부터 모델은 대부분의 팀이 예상한 것보다 훨씬 많은 일을 단일 루프 안에서 처리할 수 있게 됐다. Opus 5.5와 Fable 5.1에서는 사고(thinking)를 끌 수 없고, 최근 모델들은 점점 더 자신의 진행 상황을 서술하고 작업하면서 스스로 결과를 점검하기 때문에 하네스의 일부 요소가 불필요해진다. 새 모델이 나올 때마다 의사결정의 더 많은 부분을 하네스에서 모델 자체로 옮길 수 있다. 단순한 루프는 다음 모델로 옮기기도 더 쉽다. 우리가 고객을 도운 마이그레이션 사례에서는, 경직된 멀티 에이전트 구조가 새 모델이 더 많은 일을 맡지 못하게 막는 요인인 경우가 많았다.</li>
</ul>

<p>단일 에이전트 루프 설계에는 규율이 필요하다. 세심하게 관리되는 시스템 프롬프트, 적절한 때에 발동하는 스킬과 도구 설명, 그리고 컨텍스트 윈도·메모리·메모 작성(note-taking)을 의도적으로 다루는 일이다. 이 글의 이후 섹션에서 마이그레이션과 설계 시 고려 사항을 더 깊이 다룬다.</p>

<p>하나의 중앙 팀이 엔드투엔드 품질과 시스템 프롬프트를 소유하고, 새 도구와 eval이 출시되기 전에 모두 검토해야 한다. 이 중앙 팀을 작게 유지하면 반복(iteration)이 빨라지고 큰 조직 전체의 조율 비용도 낮아진다.</p>

<p>멀티 에이전트 방식을 택한다면, 통할 수 있는 가장 단순한 패턴(생성자-검증자(generator-verifier), 오케스트레이터-서브에이전트 등)부터 시작하자. 경계는 <strong>컨텍스트 기준으로 나눠서 효과적으로 분해하자. 즉, 각 서브에이전트에게 시스템의 나머지 부분에서 필요한 것이 거의 없는 작업 단위를 맡기고, 간결한 결과를 돌려주게 하자</strong>(좋은 후보는 서로 독립적인 리서치 경로, 깔끔한 인터페이스를 가진 별개의 컴포넌트, 또는 블랙박스 검증이다). 에이전트를 문제 유형별로 나누면 에이전트들이 '전화 게임'을 하게 된다. 정보를 이리저리 주고받으면서 인계할 때마다 정확도가 떨어진다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-agents-when-to-fold-subagents-into-your-main-agent-loop/split-by-problem.png" alt="문제 유형별로 나눈 서브에이전트"></figure>

<h2>서브에이전트를 메인 에이전트 루프로 합치는 방법</h2>

<p>많은 팀이 이미 오케스트레이터와 일련의 전문 에이전트를 프로덕션에서 운영하고 있다. 다음은 우리가 지향하기를 권하는 단일 루프 설계다.</p>
<ul>
  <li>하나의 모델과 하나의 컨텍스트 윈도가 개방형 도구 루프를 실행하고, 한도(턴·비용 예산, 쓰기 게이트)는 하네스에서 설정한다.</li>
  <li>매 턴마다 모델은 도구 호출 묶음(batch)을 내보낸다. 하네스는 이를 병렬로 실행하고 원시 결과를 같은 모델에 돌려주며, 모델이 다음 단계를 결정한다. 다음 단계는 또 다른 도구 호출 묶음일 수도, 사용자에게 던지는 질문일 수도, 답변일 수도 있다.</li>
  <li>루프는 모델이 답하거나 <a href="https://platform.claude.com/docs/en/build-with-claude/task-budgets">예산(budget)</a>에 도달하면 멈춘다. 선택적으로 답변 후에 목표 또는 검증자 점검을 돌릴 수 있다.</li>
  <li>모델은 첫 턴에 컨텍스트 안에 계획을 쓰고, 결과가 도착할 때마다 그 계획을 고친다. 이것이 오케스트레이터와 전문 에이전트 구성과의 가장 큰 차이다. 계획을 쓰는 모델이 곧 그 계획을 실행하는 모델이므로, 턴 도중에도 계획을 바꿀 수 있다.</li>
  <li>컨텍스트는 여전히 불러와지지만, 에이전트가 직접 관리한다.
    <ul>
      <li>모델이 각 단계를 결정하므로, 규칙 카탈로그를 바탕으로 계획을 다시 써 주는 코드 단계는 더 이상 필요 없다.</li>
      <li>작업 순서와 도메인 절차는 <strong>스킬</strong>로 옮긴다.</li>
      <li>강한 제약(검증, 승인 게이트)과 대화 도중에 생기는 그 밖의 모든 것(예: 메모리 조회)은 <strong>도구</strong>로 옮긴다.</li>
      <li>비용이 싸고 거의 항상 관련 있는 것(예: 엔티티 해석(entity resolution) 단계)을 불러오는 데, 그리고 루프가 호출하는 도구 내부의 기계적인 부분(페이로드 구성, 스트림 파싱, 확인 질문 이후 재개)을 처리하는 데에는 여전히 코드를 쓸 수 있다.</li>
    </ul>
  </li>
</ul>

<p>이 단일 루프 설계는 많은 팀이 지향하는 최종 형태(사용자의 상위 목표를 이해하고 사용자를 대신해 행동하는 에이전트)에도 도움이 된다. 에이전트가 배운 모든 것을 하나의 컨텍스트에 담아 두기 때문이다.</p>

<p>아래 제안은 팀이 멀티 에이전트 시스템에서 단일 에이전트 루프로 단계적으로 옮겨 가는 방법, 그리고 그 과정에서 여러 팀이 계속 해당 에이전트에 기여하는 방법이다.</p>

<h3>작업 완수(task-completion) eval</h3>

<p>첫 단계는 서브에이전트를 메인 에이전트 루프로 합쳐야 할지 판단하는 데 도움이 되는 eval 세트를 만드는 것이다. 우리가 보기에 잘 통하는 eval 구조는, 중앙 팀이 소유하는 공용 엔드투엔드 세트 하나와, 각 스킬을 소유한 팀이 그 스킬과 함께 내놓는 더 작은 eval 세트들이다. 골든 예시 10개 정도만 있어도 시작하기에 충분하다.</p>

<p>에이전트의 최종 메시지를 루브릭에 맞춰 채점하는 것은 답변 품질을 추적하기 좋은 출발점이다. 아직 오케스트레이터가 있는 동안에는 라우팅 정확도(올바른 서브에이전트를 골랐는가?)도 추적해야 한다. 서브에이전트를 합친 뒤에는 대신 에이전트가 올바른 스킬을 불러왔는지, 올바른 도구를 호출했는지를 확인한다. 아키텍처를 비교할 때 가장 중요한 것이 작업 완수 여부이므로, 시간을 두고 작업 완수 eval 쪽으로 옮겨 가는 것이 도움이 된다.</p>

<p>내부 시스템을 재현(replay)하기 어렵고 사용자 참여를 시뮬레이션하기 어려운 환경에서는 이 작업이 복잡할 수 있다. 우리 내부에서 효과가 있었던 방법 하나는 중요한 이벤트에 타임스탬프를 기록해 두었다가, 나중에 그 이벤트를 재현해 표적 eval로 돌리는 것이다.</p>

<h3>시간을 두고 서브에이전트 줄이기</h3>

<p>단일 에이전트 루프로 발전해 가는 일은 서브에이전트를 도구와 스킬로 합쳐 넣는 과정이다. 도메인 서브에이전트들을 병합하거나, 도구로 호출하거나, 스킬과 도구로 대체하는 방식으로 할 수 있다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-agents-when-to-fold-subagents-into-your-main-agent-loop/folding-in-subagents.gif" alt="서브에이전트 합치기"></figure>

<h3>도메인 에이전트 병합하기</h3>

<p>첫 병합 전에 작은 엔드투엔드 eval부터 만들자. 그다음 <strong>공유하는 컨텍스트를 기준으로, 가장 많이 쓰이는 서브에이전트부터 합쳐 넣자.</strong></p>

<p>서로의 출력을 이어받거나, 같은 데이터를 다루거나, 자주 함께 호출되는 <a href="https://claude.com/resources/articles/building-multi-agent-systems-when-and-how-to-use-them">전문 에이전트들을 병합하자</a>. 예를 들어 프로덕션 트래픽의 상당 부분이 한 전문 에이전트 다음에 또 다른 전문 에이전트로 이어진다면, 이 둘은 강하게 결합된 쌍이므로 하나의 도메인 에이전트로 병합할 후보가 된다.</p>

<h3>도구로 호출되는 서브에이전트</h3>

<p>앞서 말한 세 가지 조건 중 하나에 해당해 서브에이전트를 유지한다면, 메인 에이전트가 서브에이전트를 도구로 호출하게 해서 메인 에이전트가 계속 사용자와의 대화를 쥐고 있게 하는 것이 효과적일 수 있다.</p>

<p>서브에이전트가 대화를 넘겨받는 완전한 인계(handoff)는, 그 서브에이전트가 사용자와 직접 대화해야 할 때에만 권한다. 그 밖의 모든 것은 메인 루프 안의 스킬과 도구로 처리할 수 있다.</p>

<p>이렇게 하면 서브에이전트용 공용 응답 스키마를 정의하고, 메인 에이전트로 결론을 실제 데이터와 대조해 검증하고, 최종 종합(synthesis) 단계로 들어가는 입력을 줄일 수 있다. 서브에이전트를 <strong>다시 작성</strong>할 필요가 없으므로 좋은 첫걸음이다. 또한 어떤 서브에이전트를 메인 에이전트로 합칠지 결정하기 전에 작업 완수 eval의 <strong>기준선(baseline)</strong>도 얻을 수 있다.</p>

<p>다만 몇 가지 실패 유형은 여전히 남는다.</p>
<ul>
  <li>각 전문 에이전트가 자기만의 프롬프트, 컨텍스트, 담당 팀, eval을 갖는다</li>
  <li>각 호출은 여전히 정보가 손실된 요약을 돌려준다</li>
  <li>모든 호출이 지연 시간을 늘리는 중첩된 모델 루프다</li>
</ul>

<h3>스킬과 도구로 서브에이전트를 메인 에이전트에 합치기</h3>

<p>각 서브에이전트의 프롬프트는 스킬로, API 호출은 MCP 도구로 바꿔서 서브에이전트를 하나씩 메인 에이전트에 합쳐 넣자. 서브에이전트가 있을 때와 없을 때의 eval 성능을 비교한 뒤, 어느 쪽을 유지할지 결정한다.</p>

<p>비교할 때는 최종 점수만 보지 말고, 어떤 작업의 결과가 뒤집혔는지 살펴보자. 우리가 샘플 지원(support) 에이전트에서 이를 시험했을 때, 서브에이전트 하나를 다른 서브에이전트에 합치자 지연 시간은 줄었지만, 그동안 통과하던 프로세스 하나가 깨졌다. 메인 에이전트가 주문 조회 도구를 쥐고 혼자 답하면서, 배송 전문 에이전트에게 배송일을 묻지 않았던 것이다.</p>

<p>변경할 때마다 그 전에, eval에 프로덕션에서 함께 실행되는 모든 에이전트 연쇄(chain)와 에이전트가 절대 어겨서는 안 되는 모든 규칙에 대한 작업이 들어 있는지 확인하자. 그리고 각 작업을 두 번 이상 돌리자. 이번처럼 깨지는 현상은 두 번 중 한 번에서만 나타났기 때문이다.</p>

<h2>여러 팀이 하나의 에이전트에 기여하는 방법</h2>

<p>도메인 추론은 지식 베이스, 스킬, MCP 도구에서 가져올 수 있다. 개별 팀은 소유 대상을 에이전트에서 스킬과 도구로 옮기고, 작은 중앙 팀 하나가 시스템 프롬프트와 엔드투엔드 품질의 소유권을 유지할 수 있다. 여기에는 새 스킬, 도구, eval을 출시 전에 검토하는 일이 포함된다.</p>

<h3>MCP 도구</h3>

<p>도구는 에이전트가 행동을 취하거나, 시스템에서 실시간 데이터를 읽거나, 정해진 형태로 결과를 돌려줘야 할 때 적합하다. 마이그레이션하는 동안 서브에이전트를 계속 호출하는 수단으로 도구를 쓸 수도 있다. 시스템 프롬프트의 도구 정의가 30~50개를 넘어가면 도구 선택 능력이 떨어지는 경향이 있으므로, (API 하나당 도구 하나가 아니라) 사용자 의도별로 묶은 도구를 권한다.</p>

<p>지연 로딩(deferred loading)과 함께 <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool">도구 검색(tool search)</a>을 쓰고, 강한 선행 조건은 최소화하되 꼭 필요한 것은 도구 안으로 옮기자. 예를 들어 Y가 X의 출력을 필요로 한다면, Y의 도구가 그 출력이 있는지 확인하고 모델이 따를 수 있는 지시를 돌려준다. 사용자별 권한도 같은 방식으로 처리한다. 각 도구는 호출한 사용자가 무엇을 보거나 할 수 있는지 확인하고, 모델이 읽을 수 있는 평이한 거절을 돌려준다. 그러면 권한 수준마다 별도의 에이전트를 두지 않고도 루프 하나로 접근 권한이 서로 다른 사용자들을 모두 상대할 수 있다.</p>

<h3>스킬</h3>

<p>스킬은 에이전트가 팀이 일하는 방식, 즉 예전에 전문 서브에이전트의 프롬프트에 담겨 있던 단계, 규칙, 판단 기준을 알아야 할 때 적합하다.</p>

<p>늘어나는 스킬 라이브러리를 다루는 우리의 방법은, 유지보수 작업을 스킬을 쓰는 사람들에게 되돌려 주는 것이다. 다른 스킬을 만들고, 테스트하고, 정리(prune)할 수 있는 스킬을 쓰면 힘든 일은 Claude가 대신 해 줄 수 있다.</p>

<p>스킬 난립을 막으려면, 팀별 DRI(직접 책임자)가 자기 팀의 스킬을 소유하고, 그 스킬이 잘 만들어졌고 서로 구별되며 적절한 eval과 함께 출시되는지 책임지게 할 수 있다.</p>
<ul>
  <li><strong>/skill-creator</strong>로 처음부터 잘 짜인 새 스킬을 작성하고, 기존 스킬을 감사(audit)해서 다듬고 중복을 없애고 구조를 바꿀 수 있다.</li>
  <li><strong>/skill-doctor</strong>로 라이브러리의 각 스킬이 얼마나 비용을 쓰고 실제로 얼마나 자주 쓰이는지 보고, 쓸모없는 것을 삭제할 수 있다.</li>
</ul>

<h3>지식 베이스</h3>

<p>지식 베이스는 에이전트가 가끔씩만 필요로 하는 참고 자료에 적합하다. 사실 정보와 참고 자료(정책, 지표 정의, 제품 사양)는 모델이 호출하는 검색·조회 도구 뒤에 두거나, 스킬 안의 참고 파일로 함께 내보낼 수 있다. <a href="https://claude.com/resources/articles/seeing-like-an-agent">코드가 이런 컨텍스트를 가져와 프롬프트에 붙여 넣게 하는 방식</a>은 피하자.</p>

<h2>이 작업을 빠르게 해 주는 도구</h2>

<p>우리는 최근 위에서 언급한 작업 대부분을 도와줄 Claude API 스킬 모음을 <a href="https://code.claude.com/docs/en/commands">공개했다</a>. 우리의 <a href="https://github.com/anthropics/single-agent-loop-kit">마이그레이션 키트</a>는 이 스킬들을 하나의 안내형 워크플로로 엮어, 멀티 에이전트 시스템을 평가하고 단일 에이전트 루프로 옮기도록 돕는다. 실제 시스템에 돌리기 전에 시험해 볼 수 있는 데모도 들어 있다.</p>
<ul>
  <li><strong>/claude-api build-eval:</strong> 중앙 팀이 소유하는 첫 엔드투엔드 세트나, 각 팀이 스킬과 함께 내놓는 작은 eval을 만드는 데 도움을 준다.</li>
  <li><strong>/claude-api prompt-audit:</strong> 프롬프트, 스킬, 도구 설명에서 이전 모델을 위해 쓰인 지시를 찾아내고 수정안을 diff로 제안한다. 시스템 프롬프트에 돌리면, 이전 모델 때문에 추가됐지만 지금은 에이전트를 더 느리거나 더 경직되게 만드는 규칙을 찾을 수 있다. 각 팀의 DRI도 자기 팀의 스킬과 도구 설명에 이를 돌릴 수 있다.</li>
  <li><strong>/claude-api hillclimb:</strong> 기존 eval을 기준으로 앱을 반복적으로 개선한다. '합친 것 vs 유지한 것' 비교에 쓸 수 있고(서브에이전트 하나를 스킬과 도구로 합친 뒤, 이 스킬이 스킬과 도구 설명을 반복 개선하게 해서 합친 버전이 서브에이전트와 같거나 더 나은 성능을 내는지 본다), 시스템 프롬프트 개선에도 쓸 수 있다.</li>
  <li><strong>/claude-api cost-optimize:</strong> 호출이 어디에 쓰이는지 프로파일링하고, 프롬프트 캐싱, 불필요한 입력·출력 토큰 줄이기, effort, 모델 선택 같은 선택지로 절감안을 한 번에 하나씩 제안한다. 주어진 설계에서 비용과 지연 시간을 낮추는 데 도움이 된다.</li>
</ul>

<p>모델이 발전하면, 모델을 가장 잘 쓰는 방법에 대한 우리의 이해와 모범 사례 지침도 함께 발전한다. 그래서 특정 아키텍처 하나보다 그 밑에 깔린 원칙이 더 중요하다. 측정하고, 한 번에 하나씩 바꾸고, 버텨 내는 것을 유지하라.</p>

<p>이번 경우도 마찬가지다. 모델의 능력이 좋아지고 에이전트가 더 오래 실행될수록, 더 많은 서브에이전트를 스킬과 도구로 바꿀 수 있다. 그렇다고 한 번에 다 옮길 필요는 없다. 작은 엔드투엔드 eval을 만들고, 서브에이전트 하나를 합쳐 넣고, 합친 버전의 점수가 더 나쁠 때에만 서브에이전트로 남겨 두자. 그리고 이를 반복하자.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
