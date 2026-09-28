---
slug: "working-at-the-frontier-how-balyasny-asset-management-evaluates-and-governs-claude-fable-5"
title: "프런티어에서 일하기: Balyasny Asset Management는 Claude Fable 5를 어떻게 평가하고 관리하는가"
nav: "BAM × Claude Fable 5 · 수천 개 금융 과제 평가와 BAMAgent 거버넌스"
main: "Claude blog"
cat: "Enterprise AI"
date: "2026-09-17"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 6285
---

<!-- rendered HTML -->
<header>
  <h1>프런티어에서 일하기: Balyasny Asset Management는 Claude Fable 5를 어떻게 평가하고 관리하는가</h1>
  <div class="meta">
    2026년 9월 17일
    · 카테고리: <a href="https://claude.com/blog/category/enterprise-ai">Enterprise AI</a>
    · 제품: <a href="https://claude.com/platform/api">Claude Platform</a>,
    <a href="https://claude.com/product/claude-code">Claude Code</a>,
    <a href="https://www.anthropic.com/claude/fable">Claude Fable</a>
    <span class="orig">원문:
      <a href="https://claude.com/blog/working-at-the-frontier-how-balyasny-asset-management-evaluates-and-governs-claude-fable-5">Working at the frontier: How Balyasny Asset Management evaluates and governs Claude Fable 5 by Anthropic</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/working-at-the-frontier-how-balyasny-asset-management-evaluates-and-governs-claude-fable-5/hero.svg" alt="엔터프라이즈 AI 일러스트"></figure>

<p class="lede">BAM의 최고 AI 책임자(Chief AI Officer)와 함께, 이 회사가 왜 Claude Fable 5를 쓰는지, 그리고 프런티어 지능을 안전하고 신뢰성 있게 배포하는 데 안전장치가 어떤 역할을 하는지 이야기를 나눴습니다.</p>

<p>Balyasny Asset Management(BAM)는 약 380억 달러의 자산을 운용하고 약 2,000명의 투자 전문가와 직원을 두고 있는 글로벌 멀티 전략 투자 회사입니다. 최고 AI 책임자 Charlie Flanagan은 Anthropic과 만나, 회사가 수천 개의 실제 금융 과제로 새 모델을 어떻게 평가하는지, 왜 에이전트를 실행하는 자체 플랫폼을 만들었는지, 그리고 Claude Fable 5 출시로 무엇이 달라졌는지 이야기했습니다.</p>

<h2>2026년, BAM에게 프런티어 AI는 어떻게 달라졌나요?</h2>

<p>2026년은 우리가 '검색을 하는 AI 시스템'에서 '일을 하는 AI 시스템'으로 옮겨간 해입니다.</p>

<p>핵심 변화는 모델 자체뿐 아니라 Claude Code 같은, 모델을 둘러싼 하네스(harness)입니다. 하네스 덕분에 우리가 만드는 AI 솔루션이 훨씬 더 복잡하고 오래 걸리는 작업을 맡을 수 있게 되었습니다. AI에게 프롬프트가 아니라 '결과'를 주고, 완료될 때까지 계속 일하게 할 수 있다는 점이 판도를 바꿨습니다.</p>

<p>실제 사례가 합병 차익거래(merger-arbitrage) 분석입니다. 딜이 발표되면 이제 에이전트가 초기 딜 분석 패키지를 만듭니다. 딜이 성사될 가능성과 걸리는 기간을 추정하고, 핵심 경제·법적 조건을 추출하고, 조건과 마일스톤을 식별하고, 투자자의 판단이 필요한 영역을 표시합니다.</p>

<p>1년 전만 해도 이 단계들은 수작업 리서치와 별도 도구들에 흩어져 있었습니다. 다단계 워크플로 전체를 쓸 만한 결론까지 안정적으로 이어갈 수 있는 에이전트가 없었습니다. 예전에는 그 작업에 3~5일이 걸렸습니다. 지금은 하루가 채 걸리지 않습니다. 에이전트는 약 30분 동안 실행되고, 중요한 산출물을 실제로 활용하기 전에 사람이 검토합니다.</p>

<p>우리는 Anthropic의 프런티어 모델을 사용하지만, 실행 하네스, 데이터 접근, 검토 통제를 포함한 인프라 대부분은 BAM 내부에서 직접 구축했습니다.</p>

<h2>Claude Fable 5를 켜기 전에 어떻게 평가했나요?</h2>

<p>몇 년 전에 해두었던 일 중 지금까지 대단히 큰 도움이 된 것이 하나 있는데, 바로 견고한 평가 시스템에 투자한 것입니다. 우리는 일반 벤치마크나 단편적인 시연에 의존하지 않고, 주식, 매크로, 원자재 전반에 걸쳐 검증 가능한 결과가 있는 수천 개의 실제 금융 과제로 새 모델을 테스트합니다. 덕분에 모델 선택과 라우팅을 데이터에 근거해 결정할 수 있었고, 모든 기업이 투자해야 할 영역이라고 생각합니다.</p>

<p>우리는 모델 단독 성능과, 사용자들이 쓰는 것과 동일한 도구, 파일, 요구사항을 갖춘 우리의 에이전틱 환경 안에서의 성능을 모두 테스트합니다. 작업을 계획할 수 있는가, 올바른 도구를 고르고 사용할 수 있는가, 근거를 찾아 분석할 수 있는가, 오류에서 복구할 수 있는가, 중간 결과를 검증할 수 있는가, 근거에 기반한 산출물을 만들어낼 수 있는가를 봅니다. 또한 수치 오류, 누락된 범위, 근거 없는 결론, 검색(retrieval) 문제 같은 특정 실패 유형도 찾아봅니다.</p>

<p>관련 하위 집합에서 Fable은 수천 개 과제 전반에 걸쳐 89.4%를 기록했고, 이전 프로덕션 모델은 86.1%였습니다. 특히 두드러진 영역은 복잡한 계획 수립, 분석, 에이전틱 실행이었습니다.</p>

<p>놀라운 결과는 우리가 테스트해 온 경제학 문제 세트였습니다. 어떤 모델도 성공적으로 완료한 적이 없었는데, Fable이 처음으로 해냈습니다. 우리가 테스트했던 모든 모델 대비 큰 폭의 도약이었기 때문에, 처음에는 평가 자체의 문제일 수 있다고 봤습니다. 평가를 다시 실행하고, 과제와 채점 로직을 독립적으로 점검하고, Anthropic과 함께 결과를 검토한 뒤에야 개선이 실제라고 결론 내렸습니다. '와' 하는 순간이었습니다.</p>

<p>오늘날 우리 투자 팀들은 시스템 트레이딩과 코딩 작업에서 Fable을 기본 프런티어 모델로 사용합니다. 효율성과 비용을 기준으로 언제 Fable을 쓰고 언제 다른 모델을 쓸지에 대한 가이드를 팀에 제공합니다.</p>

<h2>오늘날의 프런티어 모델에서 안전은 어떻게 생각하고 있나요?</h2>

<p>우리는 안전을 한 번 하고 끝나는 모델 선택 문제가 아니라, 제품과 운영 모델의 문제로 다룹니다. 중요한 질문은 모델이 무엇을 할 수 있느냐만이 아닙니다. 어떤 데이터에 접근할 수 있는지, 어떤 도구를 쓸 수 있는지, 어떤 행동을 취할 수 있는지, 무엇이 반드시 사람의 승인을 거쳐야 하는지, 그리고 무언가 잘못됐을 때 우리가 어떻게 알 수 있는지입니다.</p>

<p>그래서 모델 자체가 통제 장치라고 가정하는 대신, 모델 주위에 통제 장치를 둡니다. 승인된 데이터 경계, 최소 권한 접근, 도구 단위 권한, 로깅과 추적 가능성, 중요한 산출물에 대한 사람의 검토, 예외 상황에 대한 명확한 에스컬레이션 경로를 사용합니다. 접근 범위를 넓히기 전에 적대적 시나리오와 실패 시나리오도 테스트합니다.</p>

<p>이런 통제는 첫날부터 최우선 과제였고, Fable이 나왔다고 해서 보안이 근본적으로 달라지지는 않았습니다. 더 유능한 모델이라고 해서, 단지 더 잘 추론하고 계획한다는 이유로 더 넓은 권한을 받지는 않습니다. 모델은 해당 사용자와 과제에 대해 승인된 도구와 데이터 소스만 사용할 수 있으며, 스스로에게 더 많은 접근 권한을 부여할 수 없습니다. 투자 판단과 책임은 사람에게 남아 있습니다.</p>

<h2>BAMAgent는 어디에 위치하나요?</h2>

<p>앞으로의 방향은 더 길게 실행되는 다단계 행동을 취할 수 있는, 더 유능한 에이전트 쪽입니다. 그래서 거버넌스는 덜 중요해지는 것이 아니라 더 중요해집니다. 우리에게 그것은 승인된 엔터프라이즈 워크플로에 에이전트를 안전하게 배포하기 위한 내부 플랫폼, BAMAgent를 만드는 일이었습니다. BAMAgent는 에이전트에게 필요한 도구와 시스템을 주되, 오직 그 도구와 시스템만 줍니다. 6개월째 만들고 있으며, 지금은 24시간 연중무휴로 일하는 수천 개의 자율 에이전트를 지원합니다.</p>

<p>BAMAgent는 우리 채팅 플랫폼의 다음 단계입니다. 채팅은 사람이 정보를 받아들이고 종합하는 것을 돕습니다. BAMAgent는 일을 합니다. 여러 에이전트가 병렬로 일하며 몇 시간 또는 며칠 동안 실행될 수 있는 다단계 리서치와 분석을 수행하고, 사람이 검토할 수 있는 결과물로 끝납니다. 기업 리서치 패키지를 만들고 유지하거나, 실적 발표나 매크로 이벤트를 준비하거나, 새로운 근거를 금융 시나리오로 바꿀 수 있습니다. 에이전트는 작업을 계획하고, 승인된 내부 시스템을 사용하고, 분석을 실행하고, 중간 산출물을 점검한 뒤, 리서치 아티팩트, 모델, 또는 의사결정 지원 패키지를 돌려줍니다.</p>

<p>Fable은 계획과 분석 단계에서 우리가 선호하는 모델입니다. 그 단계의 실수는 뒤따르는 모든 산출물로 흘러 들어가기 때문에, 문제를 어떻게 쪼갤지, 어떤 근거가 중요한지, 상충하는 신호를 어떻게 조정할지를 결정하는 데는 가장 강력한 모델을 쓰고 싶습니다. 그것이 에이전트를 유능한 동료처럼 일하게 만드는 요소입니다.</p>

<p>모든 기업은 사용자에게 에이전트의 효용을 최대화하면서도 기업 차원의 관리와 강제가 가능한 호스팅 에이전트(hosted-agent) 모델로 나아가는 전략을 세워야 합니다.</p>

<h2>Claude Fable 5는 BAM에 무엇을 가능하게 했나요?</h2>

<p>반응은 대단히 긍정적이었습니다. 결국 사람들이 관심을 갖는 것은 이 기술이 자신의 일상 업무에서 무엇을 열어줄 수 있느냐입니다.</p>

<p>한 사례로, BAMAgent가 세금 손실 수확(tax-loss harvesting) 분석을 실행했습니다. 9만 개의 데이터베이스 테이블을 탐색해 관련 뮤추얼 펀드 보유 데이터를 찾아내고, 자체 가중치 체계를 만들었습니다. 우리 팀의 검토를 거친 결과는 전통적인 접근법이 냈을 결과보다 더 포괄적이었습니다.</p>

<p>별도로, 우리 수석 이코노미스트는 반복적으로 수행하던 중앙은행 분석을 약 2일에서 약 30분으로 줄이는 에이전트 워크플로를 구성했습니다. 검토와 판단은 이코노미스트가 그대로 맡습니다.</p>

<p>Fable은 추론, 종합, 다단계 문제 해결을 담당합니다. BAM의 하네스는 워크플로 설계, 승인된 데이터와 도구 접근, 검색 컨텍스트, 권한, 모니터링, 사람의 검토 통제를 제공합니다. 프로덕션 품질의 결과를 내려면 둘 다 필요합니다.</p>

<h2>모델이 점점 더 강력해지는 가운데, AI 로드맵의 다음 단계는 무엇인가요?</h2>

<p>올해는 사람들이 '도구'를 갖는 데서 '팀 동료'를 갖는 데로 넘어가는 해입니다. 팀 동료와 마찬가지로, 에이전트는 함께 일할수록 더 유용해지고, 더 복잡한 과제를 완수하고, 먼저 나서서 도움이 되는 일을 하기 시작할 것입니다.</p>

<p>이미 일부 팀은 새로운 데이터와 정보를 끊임없이 분석하는 300개가 넘는 에이전트를 운영하고 있습니다. 덕분에 팀은 인사이트에 더 빨리 도달하고, 어떤 것도 놓치지 않게 됩니다.</p>

<p>우리가 던지는 질문도 달라집니다. 예전에는 전문가 시스템을 만들고, 사람들에게 이미 갖고 있던 프로세스를 자동화하는 법을 가르쳤습니다. 이제는 그 결과에 도달하는 더 나은 방법이 있는지를 묻습니다.</p>

<p>한계는 정말로 우리의 상상력뿐입니다. 도구, 데이터, 모델은 이제 몇 시간이고 실제 일을 해낼 수 있는 수준에 와 있습니다. 무엇이 가능한지 계속 다시 상상하는 것은 우리의 몫입니다. 앞으로의 12개월은 굉장히 흥미진진할 것입니다.</p>

<p><strong><em><a href="https://www.anthropic.com/claude/fable">Claude Fable</a>로 시작해 보세요.</em></strong></p>

<div class="callout">
  <strong>Claude로 조직의 운영 방식을 바꿔 보세요.</strong>
  <a href="https://claude.com/pricing#api">요금 보기</a> ·
  <a href="https://claude.com/contact-sales">영업팀 문의</a>
</div>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
