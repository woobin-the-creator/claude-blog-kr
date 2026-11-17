---
slug: "how-the-claude-code-team-thinks-about-verification"
title: "Claude Code 팀은 검증을 어떻게 생각하는가"
nav: "Claude Code 팀의 검증 방식 · 투자할 테스트 3종(E2E·속성·차분), verify 스킬로 변경 실행, 3회 실패 시 사람 호출, diff 발동 신뢰성 체크리스트 39개, 변경이 자기 검사 수정 금지, 커밋 게이트 관찰→강제 모드, 리뷰어 평가·놓친 것을 규칙으로"
main: "claude.dev"
cat: "Engineering"
date: "2026-11-16"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  .table-wrap { overflow-x: auto; margin: 0 0 20px; }\n  .table-wrap table { margin: 0; min-width: 560px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure img.phone { max-width: 360px; display:block; margin: 0 auto; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 10839
---

<!-- rendered HTML -->
<header>
  <h1>Claude Code 팀은 검증을 어떻게 생각하는가</h1>
  <div class="meta">
    2026년 11월 16일
    · 카테고리: Engineering
    · 글쓴이: Addy Osmani
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification">How the Claude Code team thinks about verification</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">엔드투엔드(end-to-end) 테스트, 속성(property) 테스트, 차분(differential) 테스트가 어떻게 코딩 에이전트로 하여금 증거를 갖고 자기 작업을 검증하게 해 주는지, 그리고 Claude Code 팀은 검증 장치(verifier)가 정직하게 작동하도록 무엇을 하는지.</p>

<p>Claude Code 팀에서는 코드의 대부분(약 90%)을 Claude가 작성하고 <a href="https://claude.dev/blog/solving-code-review-at-anthropic/">Claude가 리뷰</a>합니다. 이 정도 규모가 되면, 에이전트가 증거를 갖고 자기 작업을 검증하도록 어떻게 갖춰 주느냐가 매우 중요해집니다.</p>

<p>검증 루프(verification loop)는 Claude에게 더 많은 일을 맡길 수 있게 해 주는 기본 구성 요소입니다. 검증 루프가 없으면 모든 것을 직접 확인해야 하니 한 번에 Claude를 한두 개밖에 돌릴 수 없습니다. 검증 루프가 있으면 수십, 수백 개를 병렬로 돌릴 수 있습니다.</p>

<p>에이전트에게 <a href="https://claude.com/blog/building-verification-loops-in-claude-code-with-skills">자기 출력을 검증할 방법</a>을 주는 것이 품질을 높이는 효과적인 방법이기 때문입니다. 구조화된 파일 생성에 관한 내부 테스트에서, 별도의 채점기(grader)가 루브릭(rubric)에 비춰 Claude의 작업을 검사하게 하자 일반적인 프롬프팅 루프보다 <a href="https://claude.com/blog/claude-managed-agents">과제 성공률이 최대 10%p 올라갔고</a>, 가장 어려운 문제에서 개선 폭이 가장 컸습니다.</p>

<p>한때 검증하는 데 비용이 많이 들던 것들(테스트, 벤치마크, 명세, 실제 엔드투엔드 실행)은 이제 에이전트에게 저렴하게 요청할 수 있습니다. 코드처럼 에이전트는 테스트, 벤치마크, 명세를 빠르게 만들어 낼 수 있습니다. 그리고 한번 만들어지면 이런 테스트와 벤치마크는 소프트웨어로 실행되므로, 추가 토큰을 많이 쓰지 않고도 자주 돌릴 수 있습니다.</p>

<p>그 결과를 활용해 해당 작업에서 에이전트의 성능을 높이는 식으로 검증 루프를 닫을 수도 있습니다. 예를 들어 로그에 사용자 데이터가 있는지 검사하는 테스트에서 에이전트가 반복해서 실패한다면, 훅(hook)을 만들거나 CLAUDE.md에 더 명시적인 규칙을 넣어 이후의 문제를 막을 수 있습니다. 이렇게 하면 같은 문제가 다시 생기는 것을 (대부분) 막을 수 있습니다.</p>

<p>그렇다면 빠른 속도로 품질 좋은 코드를 만드는 데 검증이 이렇게 중요하다면, 어떤 종류의 테스트를 써야 하고 파이프라인 전반에 어떻게 적용해야 할까요? 이 글은 그 질문에 답하고, Claude Code 팀이 쓰는 프로세스도 함께 소개합니다.</p>

<h2 id="not-all-tests-are-created-equal-3-tests-worth-investing-in">모든 테스트가 똑같지는 않다: 투자할 가치가 있는 테스트 3가지</h2>

<p>어떤 종류의 테스트를 고르든 피해야 할 실패 유형이 몇 가지 있습니다.</p>

<p>테스트가 불안정(flaky)하면 에이전트는 실패한 코드를 고치는 대신 테스트를 다시 돌리도록 학습하게 됩니다. 테스트가 느리면 에이전트가 배치마다 테스트를 덜 돌리게 되어, 문제를 정확히 짚어 내기 어려워질 수 있습니다. 무거운 테스트는 변경을 커밋하기 전에 돌리는 것이 가장 좋습니다.</p>

<p>이제 제가 가장 투자할 가치가 있다고 생각하는 세 가지 테스트를 소개합니다.</p>

<h3>E2E 테스트</h3>

<p>테스트 한 종류에만 집중해야 한다면 엔드투엔드(E2E)를 고르세요. 이 테스트는 장바구니에 상품 담기, 결제하기, 확인 페이지로 이동하기처럼 실제 사용자 흐름을 기술합니다.</p>

<p>E2E 테스트가 이렇게 효과적인 이유는 속이기 어렵기 때문입니다. 기능 전체가 동작하거나, 동작하지 않거나 둘 중 하나입니다. 또한 완료 기준이 명확하고, 무엇이 망가졌는지 구체적으로 알려 줄 수 있습니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-the-claude-code-team-thinks-about-verification/fig-a-unit-vs-e2e.png" alt="단위 테스트 실패와 엔드투엔드 테스트 실패 비교. 왼쪽: checkout.test.ts에는 “FAIL checkout.test.ts / Error: Timeout after 30s”만 표시되며, “눈 감고 쏘기. 단계도, 추적 기록도 없음.”이라는 설명이 붙어 있다. 오른쪽: checkout.spec.ts에는 단계 추적(회원 가입, 장바구니에 상품 담기, 결제 실패, 확인 페이지에 도달하지 못함), “Payment form failed to load”와 비활성화된 “Place order” 버튼이 보이는 shop.example/checkout 스크린샷, 그리고 “실패한 단계: 결제 — 결제 폼이 끝내 로드되지 않아 ‘Place order’가 비활성 상태로 남음”이 표시되며, “스크린샷, 추적 기록, 그리고 어느 단계가 실패했는지에 대한 설명.”이라는 설명이 붙어 있다." loading="lazy" width="1999" height="1093">
  <figcaption><b>FIG A</b>단위 테스트는 “Error: Timeout after 30 seconds”만 보여 줄 수 있지만, 엔드투엔드 테스트는 무엇이 망가졌는지에 대한 설명과 함께 스크린샷을 보여 줄 수 있습니다.</figcaption>
</figure>

<p>단위 테스트는 더 빠르고 덜 불안정하지만, 단위 테스트를 통과하고도 기능이 망가질 수 있습니다. 에이전트도, 테스트도 작업 전체를 이해하지 못하기 때문입니다.</p>

<p>E2E 테스트에서는 실제로 실행 중인 시스템을 다룰 손과 볼 눈을 에이전트에게 주는 것이 효과적입니다. <a href="https://chromedevtools.github.io/devtools-protocol/">CDP</a>, 시뮬레이터, API 하네스 같은 도구로 앱을 띄우고, 조작하고, 살펴보는 스킬을 쓸 수 있습니다.</p>

<p>기능 맵(feature map)은 에이전트를 위한 가이드이자 채점 루브릭 역할을 할 수 있습니다. 보통 사용자 관점에서 기능을 나열하고, 경로, 키보드 단축키, 셀렉터, 기대 결과를 설명하기 때문입니다.</p>

<h3>속성 테스트: 깨질 수 없는 제약</h3>

<p>많은 테스트는 무엇이 잘못될지 여러분이 예상한 것을 바탕으로 합니다. 속성 테스트(property test)는 사람이 놓치기 쉬운 엣지 케이스를 살피는데, 바로 그곳이 에이전트가 자주 실패하는 지점입니다.</p>

<p>먼저 실패할 수 없다고 생각하는 명제를 하나 쓴 다음, 테스트 라이브러리(JS/TS는 <a href="https://fast-check.dev/">fast-check</a>, Python은 <a href="https://hypothesis.readthedocs.io/en/latest/">Hypothesis</a>, Rust는 <a href="https://proptest-rs.github.io/proptest/">proptest</a> 등)로 그 반례를 찾으려는 입력을 수천 개 생성합니다.</p>

<p>사실상 모든 소프트웨어 프로젝트에는 다음과 같은 속성이 많이 있습니다.</p>

<ul>
  <li><strong>왕복 인코딩(round-trip encoding)</strong>: “X를 인코딩했다가 다시 디코딩하면 X가 나온다.” 파싱과 직렬화에도 똑같이 적용됩니다.</li>
  <li><strong>불변식(invariant)</strong>: “계좌 잔액은 절대 음수가 될 수 없다”처럼 항상 참이어야 하는 것.</li>
  <li><strong>멱등성(idempotency)</strong>: 어떤 동작(마이그레이션, 정규화, 재시도)을 두 번 해도 한 번 한 것과 효과가 같다.</li>
  <li><strong>동치성(equivalence)</strong>: 최적화된 코드가 단순하지만 정확한 코드와 같은 결과를 낸다.</li>
</ul>

<p>속성 라이브러리는 원래 코드를 만든 에이전트와 같은 편향으로 만들어지지 않은 엣지 케이스를 사용하므로, 에이전트를 정직하게 유지하는 좋은 방법입니다. 또한 명세가 실제 운영 동작과 어긋나서 더 이상 검증의 믿을 만한 근거가 되지 못하는 재작성(rewrite) 작업에서 특히 유용합니다.</p>

<h3>차분 테스트: 기존 시스템이 정답지다</h3>

<p>차분 테스트(differential test)는 기능이 그대로 유지돼야 하는 <a href="https://claude.com/resources/articles/ai-code-migration">대규모 마이그레이션</a>에서 특히 효과적입니다. 이 테스트에서는 기존 시스템과 새 시스템에 같은 입력을 넣고 결과가 달라지는지 봅니다. 달라진다면 고쳐야 할 버그나 호환성을 깨는 변경(breaking change)이 있는 것입니다.</p>

<p>차분 테스트의 핵심은 무작위로 생성한 입력이나 실제 운영 트래픽의 샘플을 쓰는 것입니다. 공백처럼 상관없는 요소는 정규화하고, 새 환경이 기존 환경과 달라야 하는 상황을 위해 승인된 변경 목록도 관리하는 것이 좋습니다.</p>

<h2 id="how-the-claude-code-team-thinks-about-verification">Claude Code 팀은 검증을 어떻게 생각하는가</h2>

<p>앞서 <a href="https://claude.dev/blog/solving-code-review-at-anthropic/">Anthropic에서 코드 리뷰가 어떻게 이뤄지는지</a> 쓴 적이 있지만, 이 글에서는 우리가 작업을 어떻게 검증하는지 더 깊이 다루려 합니다.</p>

<h3>검증이란 변경을 실제로 실행해 보는 것</h3>

<p>앱을 엔드투엔드로 실행해 보는 것이 테스트보다 더 중요합니다. 시뮬레이터에서 직접 써 보지도 않고 iOS 변경을 출시하지는 않을 텐데, Claude도 마찬가지입니다.</p>

<p>Claude는 사람이나 QA 엔지니어처럼 앱 전체를 테스트할 수 있습니다. 웹 변경에는 Claude Chrome 확장 프로그램을, 모바일에는 iOS나 Android MCP를, 데스크톱에는 컴퓨터 사용(computer use)을 쓰게 하거나, 백엔드 작업이라면 서비스를 로컬에서 실행하게 하세요.</p>

<p>시뮬레이터를 띄우거나 앱을 실행하는 방법을 코드로 정리하려면 verify라는 스킬을 만드세요. 저장소의 .claude/skills/ 폴더에, 관련 코드와 최대한 가까운 곳에 두고, 필요한 만큼 여러 개 추가하면 됩니다. Claude는 변경을 커밋하기 전에 verify 스킬을 써야 한다는 것을 압니다.</p>

<p>그런 다음 verify 스킬을 빠르고 안정적으로 만드는 데 투자하세요. Claude에게 이 스킬을 반복해서 개선하고 스트레스 테스트하게 하세요. 이것은 여러분의 스모크 테스트(smoke test) 하네스이니 아주 튼튼해야 합니다.</p>

<p>Claude에게 자기 변경을 엔드투엔드로 스모크 테스트할 방법을 주면 결과가 훨씬 좋아집니다. 사람이 그러듯 Claude가 반복하며 실제 실수를 더 빨리 잡아내는 것을 보게 될 겁니다. Anthropic에서는 거의 모든 변경을 이렇게 테스트합니다.</p>

<h3>실패한 테스트는 사람의 주의가 필요하다</h3>

<p>누구도 모든 변경을 읽을 수는 없으니, 우리는 실패를 사람이 봐야 할 것을 정하는 한 가지 방법으로 씁니다. Claude가 검사를 돌리고 실패한 것은 고치려고 시도합니다. 세 번을 돌고도 여전히 실패하는 검사가 있으면 Claude는 멈추고 사람을 부릅니다.</p>

<h3>코드 소유자가 자기 검사를 직접 쓴다</h3>

<p>코드를 소유한 사람이 그 코드에 대한 검사를 쓰고, 소유자라면 짚었을 것을 검사가 짚어 낼 때까지 다듬습니다. 검사가 리뷰어를 끌어들일 때는 그 이유를 말해야 합니다. 그래야 리뷰어가 diff를 보고 이유를 알아낼 필요가 없습니다.</p>

<h3>신뢰성 검사는 diff를 보고 발동한다</h3>

<p>우리는 39개 항목으로 된 신뢰성 체크리스트를 관리합니다. 각 항목에는 diff에서 읽어 낼 수 있는 발동 조건(trigger), 검사 내용, 그리고 그 항목이 생기게 된 장애나 PR이 붙어 있습니다. 그중 하나는 “--resume은 오래된 대화 기록(transcript)을 불러온다”입니다. 세션 저장소나 메시지 타입이 바뀌면, 오래된 대화 기록에는 새 필드가 없을 것이므로 새 필드가 안전하게 로드되는지 묻습니다.</p>

<p>Claude는 diff를 읽고 발동 조건이 맞는 항목(보통 3~10개)만 검사합니다. 그래서 누구도 과거 장애를 외우고 있을 필요가 없습니다.</p>

<h3>리뷰어는 하나, 라운드는 여러 번</h3>

<p>우리는 리뷰어를 더 쌓는 방식으로 리뷰를 개선하려 하지 않습니다. 기본 리뷰어 위에 더 비싼 두 번째 리뷰어를 얹는 것은 기본 리뷰어를 조정하는 것보다 못한 경우가 많습니다. 대신 우리는 이 코드에서 리뷰어가 무엇에 주목해야 하는지 적은 <a href="https://code.claude.com/docs/en/code-review-customize">REVIEW.md</a>를 둡니다.</p>

<p>또한 리뷰와 검증 라운드는 서로 위에 쌓여야 한다고 생각합니다. 매번 처음부터 모든 것을 다시 검사하는 대신, 각 라운드가 이전 라운드의 맥락과 과거의 실패를 참고하도록 합니다. 이 편이 더 저렴하고 더 많이 찾아냅니다.</p>

<h3>변경이 자기 검사를 수정할 수 없게 한다</h3>

<p>어떤 변경이 자기를 판정하는 검사를 수정할 수 있다면, 그 검사는 망가진 것입니다. Code Review는 REVIEW.md 파일을 베이스 브랜치나 기본 브랜치에서 읽고, <a href="https://code.claude.com/docs/en/code-review-customize">풀 리퀘스트의 변경분에서는 절대 읽지 않습니다</a>. Claude Code 팀은 변경을 통제하는 규칙이 그 변경이 수정할 수 없는 브랜치에 있도록 보장합니다.</p>

<p>Claude Code 팀은 또한 리뷰를 커밋 단위로 합니다. 리뷰가 진행되는 동안 누군가 push를 하고 있다면 그 리뷰 결과는 더 이상 쓸모가 없습니다. 오래된 커밋에 대한 리뷰 통과는 아무 의미가 없습니다.</p>

<p>팀은 또한 저렴한 검사를 먼저 돌립니다. 에이전트가 로컬에서 테스트하기 전에 push를 하면, 스스로 잡을 수 있었던 버그 때문에 공유 리뷰와 CI 시간을 써 버린 셈입니다. 우리 팀에서는 Claude가 풀 리퀘스트를 열기 전에 테스트, 빌드, 린터를 돌립니다. Claude가 작업을 마치면 테스트를 돌리는 <a href="https://code.claude.com/docs/en/hooks">훅</a>이나, 테스트 스위트 통과를 목표로 하는 <a href="https://code.claude.com/docs/en/goal">/goal</a>로 이를 강제할 수 있습니다.</p>

<h3>새 게이트는 관찰 모드로 시작한다</h3>

<p>우리 저장소에서는 각 커밋에 어떻게 검증됐는지를 도장처럼 찍어 둡니다. 이 도장에는 “none”도 있어서, 검증되지 않은 커밋을 조회할 수 있습니다.</p>

<p>또한 세션에 /code-review나 /verify가 없었으면 커밋을 막을 수 있는 커밋 게이트(commit gate)도 만들었습니다. 이 게이트는 꺼짐(off), 관찰(observe), 강제(enforce) 모드로 설정해 두었습니다.</p>

<p>관찰 모드는 무엇이 막혔을지를 기록만 하므로, 오탐(false positive)을 검토하고 아무도 영향을 받지 않는지 확인할 수 있습니다.</p>

<p>강제 모드는 커밋을 막습니다. 어떤 커밋이든 메시지에 왜 검증되지 않았는지 설명을 담을 수 있습니다. 한 세션에서 커밋이 두 번 막혔다면 다음 커밋은 통과시켜서 Claude가 갇히지 않도록 합니다. Claude Code도 완벽하지 않으니까요.</p>

<h3>정말 중요한 것으로 검사를 테스트한다</h3>

<p>Claude Code 팀은 리뷰어도 정기적으로 리뷰합니다. 머지된 변경 중 몇 개가 되돌려졌는지(revert), 머지 전에 메인테이너가 몇 개를 거절했는지, 그리고 크기를 맞춘 깨끗하게 유지된 변경들의 부분집합을 추적합니다.</p>

<p>이것은 정식 평가(evaluation)로도 할 수 있습니다. <a href="https://claude.dev/blog/solving-code-review-at-anthropic/">코드 리뷰 글</a>에서 우리는 Code Review 팀이 과거의 장애와 revert를 바탕으로 평가를 어떻게 구성했는지 설명했습니다. 이들은 각 예시마다 저장소를 리뷰 당시의 상태로 재현하고, 버그가 무엇이었는지에 대한 한 문장짜리 정답을 제공합니다. 해당 버그를 정확히 설명한 발견만 점수를 받습니다. 과도한 지적(over-flagging)을 막기 위해 머지되어 안정적으로 유지된 변경을 대조군으로 씁니다. 튜닝용 세트는 시스템을 평가하는 고정 테스트 세트와 분리되어 있습니다.</p>

<p>이들은 원본 발견(raw findings), 검증 후, 최종 리뷰 단계의 재현율(recall)도 따로따로 평가했습니다. 이렇게 하면 시스템이 이미 찾은 버그를 중간에 잃어버리고 있는지 볼 수 있습니다. 이 모든 단계를 하나의 엔드투엔드 점수로 취급하는 평가로는 이런 미묘한 차이를 잡아낼 수 없습니다.</p>

<p>타당성 외에 우리가 신경 쓰는 다른 차원은 그 변경을 하는 것이 얼마나 중요한가입니다. 좋은 리뷰어는 기술적으로 맞는 지적 대부분을 잡아내겠지만, 사람들이 신경 쓰는 것은 그 버그가 반드시 고쳐야 하는 것인지, 고치는 게 좋은 것인지, 사소한 지적(nit)인지입니다.</p>

<p>Code Review에는 바로 이 개념이 있어서, 지적 사항에 <a href="https://code.claude.com/docs/en/code-review-pull-requests">Important, Nit, Pre-existing</a> 태그를 붙입니다. “pre-existing” 태그는 이미 버그였던 것에 대해 리뷰어가 작성자에게 책임을 묻지 말아야 한다는 뜻입니다.</p>

<p>마지막으로 Claude Code 팀은 재현율을 올리되, 그다음 개선이 실제로 버그를 잡는 게 아니라 평가에 과적합(overfitting)하게 되는 지점까지만 올립니다.</p>

<h3>놓친 것을 규칙으로 바꾼다</h3>

<p>Claude Code 저장소에서는 놓친 사례를 규칙으로 바꾸는 방법이 두 가지 있습니다. 첫째는 사람의 코드 리뷰 코멘트와 PR revert에서 패턴을 뽑아내 흔한 문제를 찾는 것입니다. 잠재적 규칙으로 고려되려면 적어도 두 개의 PR에서 나타나야 하고 diff에서 식별할 수 있어야 합니다. 에이전트 세 개가 그 규칙을 반증하려 시도하고, 그 뒤 사람이 PR에서 검토하고 승인합니다.</p>

<p>둘째 방법은 알려진 장애와 연관된 PR에 대해 버그 탐지기 세 개를 다시 돌려 보는 것입니다. 적어도 두 개가 버그를 찾으면 탐지 가능한 버그입니다. 작은 diff에서 버그를 놓쳤다면, 그것은 REVIEW.md의 규칙으로 바꿀 가치가 있는 빈틈입니다.</p>

<p>불안정한 테스트도 같은 방식으로 다룹니다. Claude는 그런 테스트를 건너뛰거나, sleep을 넣거나, 통과할 때까지 재시도할 수 없습니다. 근본 원인을 찾지 못하면 테스트를 삭제하고 그 이유를 적어 둡니다.</p>

<p>규칙도 정리가 필요합니다. 테스트 스위트, 검증 단계, .md 파일은 내버려 두면 늘어나기만 하므로, 우리는 정기적으로 정리합니다.</p>

<h2 id="good-tests-good-results">좋은 테스트, 좋은 결과</h2>

<p>에이전트에게 강한 피드백 루프와 함께 자기 작업을 검증할 방법을 주는 것이 모든 것을 바꾼다는 것을 우리는 확인했습니다. 검증 계층을 다른 시스템과 똑같이 다루세요. 검증 장치가 판정하는 변경이 그것에 손대지 못하게 하고, 여러분에게 중요했던 버그로 그것을 채점하고, 무언가를 놓쳤을 때는 교훈을 적어 두어 같은 일이 두 번 일어나지 않게 하고, 그 교훈들이 계속 돌릴 가치가 있도록 가지치기하세요.</p>

<p>그렇게 하면 여러분의 일은 모든 diff를 읽는 것에서 “완료”가 어떤 모습인지 정의하고 증거를 검토하는 것으로 바뀝니다. 바로 그것이 여러 Claude를 한 번에 돌릴 수 있게 해 줍니다.</p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
