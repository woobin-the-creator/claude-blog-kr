---
slug: "how-to-prepare-for-ai-driven-code-modernization-projects"
title: "AI 주도 코드 현대화 프로젝트, 어떻게 준비할 것인가"
nav: "AI 코드 현대화 준비 · 타깃·인증서·승격 정책 6단계"
main: "Claude blog"
cat: "Claude Code"
date: "2026-09-23"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  blockquote cite { display:block; font-style: normal; color: var(--muted); font-size: 0.85rem; margin-top: 6px; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  .table-wrap { overflow-x: auto; margin: 20px 0; }\n  table { border-collapse: collapse; width: 100%; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 10px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 14867
---

<!-- rendered HTML -->
<header>
  <h1>AI 주도 코드 현대화 프로젝트, 어떻게 준비할 것인가</h1>
  <div class="meta">
    2026년 9월 23일
    · 카테고리: <a href="https://claude.com/blog/category/claude-code">Claude Code</a>, <a href="https://claude.com/blog/category/enterprise-ai">Enterprise AI</a>
    · 제품: <a href="https://claude.com/product/claude-code">Claude Code</a>
    <span class="orig">원문:
      <a href="https://claude.com/blog/how-to-prepare-for-ai-driven-code-modernization-projects">How to prepare for AI-driven code modernization projects</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-to-prepare-for-ai-driven-code-modernization-projects/hero.svg" alt="코드 현대화 프로젝트 일러스트"></figure>

<p class="lede"><em>핵심 시스템과 규제 산업 기업을 위한 AI 주도 현대화(modernization) 프로젝트를 어떻게 조직할 것인가.</em></p>

<p><em>Anthropic의 <strong>Notes from the Field</strong> 시리즈에서는 포워드 디플로이드 엔지니어(forward deployed engineer)들이 실제 고객 배포에서 얻은 모범 사례를 공유한다. 이 글에서는 대규모 코드 현대화 프로젝트를 관리하며 얻은 경험을 나눈다.</em></p>

<p>한때 수년짜리 전사 총동원 사업으로 잡히던 <a href="https://claude.com/blog/how-ai-helps-break-cost-barrier-cobol-modernization">코드 현대화</a>는 이제 몇 달(혹은 <a href="https://claude.com/blog/ai-code-migration">몇 주</a>) 안에 끝낼 수 있다. 하지만 그 앞뒤에 놓인 조직 차원의 일은 대개 그대로다.</p>

<p>예를 들어 핵심 은행 시스템의 모든 변경은 변경 관리, 리뷰, 승인을 거쳐야 한다. 규제 기관, 감사인, 그리고 사업 부서가 요구하기 때문에 이 절차는 견고하게 만들어져 있다.</p>

<p>이 절차들이 핵심 시스템을 신뢰할 수 있게 만든다. 그리고 이 절차는 사람이 각 변경을 작성하고 사람이 각 diff를 리뷰한다는 가정 위에 세워졌다. 에이전트가 변경 작성을 가속하는 순간, 병목은 변경을 만들어내는 일에서 그 변경을 중심으로 조직을 움직이는 일로 옮겨 간다.</p>

<p>이 글은 현대화가 실제로 진행되기 전에 기업이 해야 하는 일을 다룬다. "완료"가 무엇을 뜻하는지 정의하고, 변경이 어떤 증거를 갖춰야 하는지, 인증된 변경이 어떻게 프로덕션에 도달할지, 그리고 실행을 시작하기 위해 무엇을 준비해 두어야 하는지다.</p>

<p>우리는 이 과정을 여섯 단계로 나눈다.</p>

<ol>
  <li><strong>타깃 정의:</strong> 현대화된 코드가 갖춰야 할 기술 스택과 동작.</li>
  <li><strong>인증서 만들기:</strong> 변경이 타깃 상태에서 올바르다고 간주되기 위해 충족해야 하는 조건.</li>
  <li><strong>승격 정책 설정:</strong> 인증된 변경이 생산되는 속도에 맞춰 프로덕션에 들어가는 경로.</li>
  <li><strong>선행 조건 갖추기:</strong> 환경, CI/CD, 리뷰 역량, 승인.</li>
  <li><strong>에이전틱 워크플로 구축과 다듬기:</strong> 현대화를 여러 개의 작은 병렬 서브에이전트 작업 흐름으로 분산해 변경을 생산하는 맞춤형 Claude Code <a href="https://claude.com/blog/introducing-dynamic-workflows-in-claude-code">다이내믹 워크플로(dynamic workflow)</a>. 타깃, 인증서, 승격 정책을 중심으로 구축한다.</li>
  <li><strong>현대화 실행:</strong> 코드베이스의 작은 파티션에서 워크플로를 처음부터 끝까지 검증한 뒤 확장한다.</li>
</ol>

<h2>1단계: 타깃 정의</h2>

<p><strong>타깃(target)</strong>은 현대화의 최종 상태다. 원하는 최종 상태에 따라 아래 표에 정리한 세 가지 현대화 유형 중 어느 것을 하는지가 결정된다.</p>

<h3>현대화 유형 결정하기</h3>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>유형</th><th>무엇인가</th><th>선택 시점</th><th>타깃은</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>업리프트(Uplift)</strong></td>
      <td>같은 스택 안에서의 버전 상향(예: C++11 → C++20).</td>
      <td>스택 자체는 괜찮지만 버전이 뒤처진 경우. 수명이 끝난 런타임, 패치되지 않은 보안 문제, 더는 업그레이드할 수 없는 의존성.</td>
      <td>런타임 버전과 패키지 집합.</td>
    </tr>
    <tr>
      <td><strong>트랜스폼(Transform)</strong></td>
      <td>동작은 고정한 채 스택을 바꾸는 재작성(예: COBOL → Java).</td>
      <td>스택이 해결해야 할 문제이고 동작은 신뢰할 수 있는 경우.</td>
      <td>업리프트에 필요한 모든 것에 더해, 새 코드가 따라야 할 언어, 프레임워크, 아키텍처 규약.</td>
    </tr>
    <tr>
      <td><strong>리이매진(Reimagine)</strong></td>
      <td>동작을 바꾸면서 새 아키텍처 위에 그린필드로 다시 만드는 것.</td>
      <td>코드와 함께 동작도 바꿔야 하는 경우.</td>
      <td>트랜스폼에 필요한 모든 것에 더해, 새 시스템에 대한 문서화된 동작 명세(behavioral spec).</td>
    </tr>
  </tbody>
</table>
</div>

<p>어떤 유형의 현대화를 할지는 조직 안에서 자주 논쟁거리가 된다. 우리 경험상 프로덕션에 가장 가까운 사람들은 리스크를 억제하기 위해 동작은 그대로 두고 스택만 바꾸길 원한다(트랜스폼 현대화). 반대편에는 코드베이스와 함께 살아온 엔지니어들이 있는데, 이들은 현대화로 기술 부채를 갚고 싶어 한다. 여기에 이 기회에 새 요구사항을 내걸고 싶어 하는 다른 비즈니스 이해관계자들이 더해진다(리이매진 현대화).</p>

<p>두 입장 모두 타당하다. 하지만 이 질문을 미해결로 두면 나중에 특정 변경이 "올바른가"를 둘러싼 논쟁으로 다시 떠오른다. 어느 길을 갈지 합의를 만드는 데는 초기 마찰이 따르지만, 프로젝트 전체는 훨씬 매끄러워진다.</p>

<h3>코드베이스 매핑과 동작 명세 작성</h3>

<p>현재 시스템을 이해하는 것이 타깃을 정의하는 좋은 첫걸음인 경우가 많다. 기존 코드가 실제로 무엇을 하는지 추출하고 현재 동작의 인벤토리를 만들면, 어떤 부분을 바꾸거나 버릴지, 그래서 현대화가 트랜스폼인지 리이매진인지 결정하기 쉬워진다. 이 과정에서 알려지지 않았던 비즈니스 로직과 엣지 케이스가 드러나는 일도 흔하다.</p>

<p>Claude는 <a href="https://claude.com/blog/how-ai-helps-break-cost-barrier-cobol-modernization">의존성을 매핑하고 아무도 만든 기억이 없는 워크플로를 문서화</a>하는 방식으로 이런 발견 작업의 상당 부분을 해낼 수 있다. <a href="https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-modernization">코드 현대화 플러그인</a>의 <em>assess</em>, <em>map</em>, <em>extract-rules</em> 명령은 소스 인용이 달린 비즈니스 규칙을 채굴해 주고, 엔지니어는 이를 리뷰하면 된다.</p>

<p>다만 Claude의 발견만으로는 레거시 시스템이 어떻게 동작하는지 전부 포착하지 못할 수 있다. 비즈니스 사용자와 개발자 인터뷰, 사내 문서가 그 빈틈을 메울 수 있다. 컨텍스트 수집에는 초기에 시간이 좀 들지만, 그 컨텍스트의 품질이 이후 워크플로가 내리는 모든 결정을 좌우한다.</p>

<p>리이매진의 경우 타깃 정의에 추가 작업이 필요하다. 상세한 동작 명세를 문서로 작성하고 사용자 그룹과 합의해야 한다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-to-prepare-for-ai-driven-code-modernization-projects/dependency-map.png" alt="코드 현대화 플러그인이 만든 인터랙티브 의존성 맵 예시">
  <figcaption>코드 현대화 플러그인의 인터랙티브 의존성 맵 예시.</figcaption>
</figure>

<h3>프로젝트의 정당성과 목표 세우기</h3>

<p>타깃을 정의하는 것과 함께, 조직은 애초에 왜 이 현대화를 할 가치가 있는지 따져 봐야 한다. 레거시 시스템 현대화는 지속적인 유지보수·운영 비용을 줄일 수 있다. 하지만 우리 경험상 비용 절감이 대부분의 현대화 프로젝트를 이끄는 목표였던 적은 없다.</p>

<blockquote>리스크 감소가 가장 중요한 현대화 이점인 경우가 많다. 프로젝트를 진행할지 논의할 때는 현대화를 하지 않았을 때의 리스크를 함께 고려하라.</blockquote>

<p>예를 들어 패치되지 않은 취약점을 안고 있는 시스템은 사이버 침해나, 사업 자체를 위험에 빠뜨릴 만큼 심각한 장애로 이어질 수 있다. 지원이 끊긴 런타임이나 시스템을 이해하는 엔지니어 풀의 축소는 그 리스크를 더 키운다.</p>

<p>Claude Code 같은 에이전틱 코딩 도구는 현대화 일정을 단축했지만, 예산은 여전히 추정하기 어렵고 이는 관성으로 이어진다. 우리는 <a href="https://claude.com/blog/ai-code-migration">대규모 현대화</a> 일부의 비용을 공개했고, <a href="https://claude.com/customers/lg-cns">다른 곳</a>도 그렇게 했다. 이는 대략적인 기준선이 될 수 있으며, 예산 추정에 대한 추가 안내는 이 가이드 하단에 있다.</p>

<p>이런 프로젝트를 시작할 때 가장 큰 어려움은 대개 시스템을 소유한 팀과 그 시스템에 의존하는 팀들로부터 내부 합의와 헌신을 끌어내는 일이다. 흔히 리더십 차원에서 사업 타당성을 세우고 프로젝트 목표를 정하면 이 과정이 수월해진다. 또한 뒤이어 나오는 인증서와 승격 정책에서의 트레이드오프를 붙들어 매는 기준점이 된다. 변경이 얼마나 큰 리스크를 감수해도 되는지를 두고 이해관계자들이 갈릴 때, 현대화하지 않는 리스크가 그 맞불이 된다.</p>

<h2>2단계: 인증서 정의</h2>

<p><strong>인증서(certificate)</strong>는 모든 현대화 변경이 충족해야 하는 조건 또는 테스트의 집합이다. 변경이 타깃에 비추어 올바르다는 가장 강력한 누적 증거를 주는 조건들을 고른다.</p>

<p>각 조건은 사람이 개입하지 않고도 검사할 수 있어야 한다. 그래야 에이전틱 워크플로가 인증서를 충족할 때까지 변경을 반복하거나, 그럴 수 없으면 사람 리뷰용으로 플래그를 세울 수 있다.</p>

<p>인증서에 무엇이 들어가는지는 타깃에 따라 다르지만, 대개 다음 목록에서 뽑게 된다.</p>

<ul>
  <li>기존 테스트 스위트가 통과한다</li>
  <li>현대화 중 Claude가 작성한 테스트가 모두 통과한다</li>
  <li>테스트 커버리지가 합의된 임계값을 충족한다</li>
  <li>성능 벤치마크가 합의된 범위 안에 머문다</li>
  <li>각각 새 컨텍스트 윈도에서 수행한 Claude의 독립적인 적대적 리뷰(adversarial review)에서 차단 수준의 문제가 발견되지 않는다</li>
  <li>사용자 인터페이스의 경우, Claude가 구동하는 컴퓨터 사용(computer use)에서 회귀가 발견되지 않는다</li>
  <li>현재 버전과 타깃 버전이 같은 입력에 대해 같은 출력을 낸다. 입력은 라이브, 녹화, 또는 Claude 생성 데이터일 수 있다</li>
  <li>영속 상태와 와이어 포맷이 현재 버전과 타깃 버전 사이에서 왕복(round-trip) 변환된다</li>
  <li>변경이 합의된 기간 동안 스테이징에서 실행되며 오류율, 지연, 알림에서 회귀가 없다</li>
  <li>정적 분석과 보안 스캔에서 새 발견 사항이 없다</li>
  <li>컴파일 타깃의 경우, 빌드가 깨끗하고 타입 검사가 통과한다</li>
</ul>

<blockquote><strong>인증서는 변경을 리뷰하고 프로덕션으로 승격할 사람들과 함께 작성하라.</strong> 인증서와 에이전틱 워크플로가 아직 설계 중일 때, 지금 코드베이스에 의존하는 개발자, 사용자 그룹, 비즈니스 리드를 끌어들여라.</blockquote>

<p>이들의 전문성이 인증서가 무엇을 측정할지 결정하고, 이들의 초기 참여가 변경이 리뷰에 도달했을 때의 동의를 얻어낸다. 완성된 인증서를 점검하는 좋은 방법은, 그들이 인증서의 증거만으로 머지해도 편안한지 묻는 것이다. 인증서에 자신들의 기준이 담겨 있다고 느낀다면, 3단계의 승격 정책은 더 가벼워질 수 있다.</p>

<p>인증서가 무엇을 기준으로, 어떻게 검사하는지는 현대화 유형에 따라 다르다.</p>

<ul>
  <li><strong>업리프트 현대화</strong>의 경우, 동등성(parity)의 기준은 기존 코드베이스이며 기존 테스트 스위트가 인증서의 핵심이 될 수 있다.</li>
  <li><strong>트랜스폼 현대화</strong>의 경우, 동등성의 기준은 역시 기존 코드베이스지만 기존 테스트 스위트가 새 스택에서 돌아가는 일은 드물다. 대신 프로덕션 트래픽 리플레이, 신·구 시스템 간 차등 테스트(differential testing), 프로덕션 병렬 배포가 대부분의 일을 한다.</li>
  <li><strong>리이매진 현대화</strong>의 경우, 인증서는 동작 명세에 닻을 내린다. 가장 어려운 경우다. 명세는 비교 대상이 되는 기존 시스템보다 덜 객관적이므로 모델 판단이 더 많이 개입하고, 결과의 변동성이 커질 수 있다. 여기서 인증서는 명세로부터 작성한 테스트, 각 변경을 명세에 대조하는 Claude의 독립적인 적대적 리뷰, 그리고 새 시스템이 기존 동작을 유지하는 부분에 대한 차등 검사에 기댄다. 명세가 명확해짐에 따라 인증서를 수정하게 될 것을 예상하라. 명세의 빈틈은 여기서 가장 먼저 드러난다.</li>
</ul>

<p>오래된 시스템은 테스트 커버리지가 얇고, 테스트가 불안정하며, 텔레메트리가 부족한 경우가 많다. 인증서를 정의하는 일의 일부는 이런 빈틈을 찾아내는 것이다. 강력한 인증서를 뒷받침하기 어렵다면, 이 단계에서 할 수 있는 가장 유용한 일 중 하나는 Claude를 써서 부족한 증거를 만드는 것이다. 프로덕션 병렬 환경을 세우든, 리플레이 하네스를 만들든, 테스트를 더 작성하든 말이다.</p>

<h2>3단계: 승격 정책 설정</h2>

<p>에이전트는 어떤 사람 팀이 diff 하나하나 리뷰할 수 있는 속도보다 훨씬 빠르게 변경을 생산한다. 승격 정책(promotion policy)은 미리 문서화하고 합의한 계층형 리뷰 경로로, 변경에 대한 사람 리뷰의 깊이를 정해 현대화가 수용 가능한 일정 안에 끝나게 한다.</p>

<p>인증서와 마찬가지로 이 단계도 리뷰어와 함께 진행하고, 가능한 한 조직의 기존 변경 관리 절차에 맞춰 넣어라. 세부 사항은 조직과 조직이 직면한 리스크 트레이드오프에 따라 다르지만, 어디서나 통하는 규칙이 몇 가지 있다.</p>

<ul>
  <li><strong>영향 범위(blast radius)와 에이전트 확신도로 변경을 계층화하라.</strong> 조직에 자체 변경 또는 리스크 분류 체계가 있다면 그것을 써라. 핵심 경로에는 전면적인 사람 리뷰를 유지하라.</li>
  <li><strong>반복되는 플래그는 근원에서 고쳐라.</strong> 시간에 따라 플래그된 변경을 묶어 분석하라. 같은 종류의 플래그가 계속 반복되면, 하나하나 리뷰하는 대신 에이전틱 워크플로나 인증서에서 원인을 고쳐라.</li>
  <li><strong>출력 형식은 리뷰어와 함께 설계하라.</strong> 어떤 정보와 형식이 리뷰를 가장 빠르게 만드는지, 어떤 신호가 다른 것보다 더 큰 확신을 주는지 합의하라. 5단계에서 초기 샘플 출력을 그들이 리뷰하게 하라.</li>
  <li><strong>SME 시간을 효과적으로 배분하라.</strong> 주제 전문가(SME)가 최종 diff를 전부 읽지는 않겠지만, 그들의 판단은 여전히 희소한 입력이다. 큰 diff를 헤집지 않고도 가장 높은 리스크 계층의 변경으로, 그리고 그 안에서 플래그된 에이전트 결정으로 바로 갈 수 있게 하라. 그러면 적은 전문가 시간으로 가장 큰 리스크를 지닌 변경을 커버할 수 있다.</li>
</ul>

<p>이 규칙 중 다수는 프로젝트 초기에 SME를 참여시켜 SME 시간을 앞당겨 쓴다. 그들의 피드백이 전체 현대화가 시작되기 전에 인증서와 에이전틱 워크플로를 조율한다.</p>

<p>샘플에 대한 그들의 승인은 확신이 높은 곳에서 더 가벼운 리뷰 경로를 택할 추가 근거도 된다. 리뷰가 마지막에 일어나는 전통적인 비에이전틱 패턴과는 정반대다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-to-prepare-for-ai-driven-code-modernization-projects/change-path.png" alt="변경이 생성에서 프로덕션까지 가는 경로 다이어그램">
  <figcaption><em>변경이 생성에서 프로덕션까지 가는 경로.</em></figcaption>
</figure>

<p>승격 정책은 현대화가 속도와 리뷰 깊이 사이의 스펙트럼에서 어디에 놓이는지도 반영해야 한다. 런타임 지원 종료처럼 빠듯한 마감을 향해 달리는 현대화에는 더 가벼운 사람 리뷰와, 변경당 더 많은 리스크를 감수한다는 명시적 합의가 담긴 빠른 정책이 필요하다.</p>

<p>일정이 긴 현대화는 더 깊은 사람 리뷰와 더 느린 전환(cutover)을 감당할 수 있다. 이해관계자들은 리스크 선호도와 제약에 따라 이 스펙트럼의 서로 다른 지점에 서게 되므로, 작업을 시작하기 전에 못 박아 두는 것이 좋다.</p>

<p>규제 환경에서는 어떤 변경이든 더 가벼운 사람 리뷰 경로를 택하는 것이 실제로 불편함을 준다. 개별 승인자는 잘못된 변경의 리스크를 짊어지기에 승인을 주저하고, 리더십은 노후한 시스템이라는 더 큰 리스크를 짊어진다.</p>

<p>우리 경험상 승격 정책에 대한 지시는 조직의 최상부에서 내려오는 것이 가장 좋다. 또한 미리 합의해 두는 것이 낫다. 그래야 프로덕션에 도달한 버그의 책임이 변경을 승인한 누군가에게 고정되지 않고 공유된다.</p>

<blockquote><strong>이 모든 것은 여전히 실질적인 증거 역할을 할 만큼 상세한 인증서와, Claude가 어떻게 그 변경에 도달했는지를 신뢰할 수 있을 만큼 이해하는 리뷰어에 달려 있다.</strong></blockquote>

<h2>4단계: 선행 조건 갖추기</h2>

<p>이 단계의 상당 부분은 현대화 바깥의 팀을 거친다. 호스트는 플랫폼 또는 인프라 팀, 테스트 용량은 QA 또는 릴리스 엔지니어링 팀, 승인은 보안·컴플라이언스 팀이다. 이들 팀은 각자 백로그나 승인 절차를 갖고 있는 경우가 많으므로, 요구사항을 파악하는 즉시, 흔히 1~3단계가 아직 진행 중일 때부터 일찍 대화를 시작하라.</p>

<h3>환경</h3>
<ul>
  <li>워크플로를 실행할 전용 원격 호스트. Claude가 코드베이스와 기타 관련 소스에 접근할 수 있어야 한다</li>
  <li>인증서가 요구하는 테스트 용량</li>
  <li>인증서를 강화하는 모든 것: 프로덕션 텔레메트리, 프로덕션 병렬 환경, 리플레이용 프로덕션 데이터</li>
</ul>

<h3>코드베이스와 CI/CD</h3>
<ul>
  <li>빌드·컴파일 로그, 임포트 분석, 또는 런타임 트레이스에 근거한 코드베이스 의존성 맵. 참고: 플러그인의 <em>map</em> 명령이 좋은 출발점이지만, 코드베이스의 크기와 나이에 따라 더 광범위한 사전 작업이 필요할 수 있다</li>
  <li>타깃 정의의 일부로서, 의존성이나 패키지를 어떻게 다룰지에 대한 계획</li>
  <li>필요하다면 CI/CD에 추가할 준비가 된 호환성 검사</li>
  <li>제자리(in place) 현대화를 한다면, 합의된 코드 프리즈 정책</li>
  <li>코드 프리즈와 새 호환성 요건을 다루는, 활동 중인 개발자 대상 커뮤니케이션 계획</li>
</ul>

<h3>팀과 리뷰</h3>
<ul>
  <li>코드베이스에 의존하는 다른 팀들이 어떻게 참여할지에 대한 합의. 인증서 승인이나 승격 정책에 따른 리뷰 등이 있으며, 리뷰어 시간을 확보해 둔다</li>
</ul>

<h3>보안과 컴플라이언스</h3>
<ul>
  <li>소스 코드에 사용하도록 승인된 Claude Code 모델 접근 경로</li>
  <li>에이전틱 워크플로에 대한 최소 권한 접근: 현대화 브랜치에만 쓰기 가능, 프로덕션 자격 증명 없음</li>
  <li>현대화 브랜치에서 비밀 정보와 개인식별정보(PII) 제거 또는 마스킹</li>
  <li>모든 변경을 추적할 수 있고, PR이 에이전트 트랜스크립트와 인증서 증거에 연결되어 있을 것</li>
  <li>새 의존성에 대한 라이선스 및 취약점 검사</li>
</ul>

<h2>5단계: 에이전틱 워크플로 구축과 다듬기</h2>

<p>Claude Code를 사용해 코드베이스 현대화를 위한 맞춤형 <a href="https://claude.com/blog/introducing-dynamic-workflows-in-claude-code">다이내믹 워크플로</a>를 개발하라.</p>

<p><a href="https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-modernization">코드 현대화 플러그인</a>에서 시작하고, 워크플로에 필요할 수 있는 모든 것을 파일 시스템이나 MCP를 통해 Claude가 접근할 수 있는 곳에 두기를 권한다. 여기에는 타깃, 인증서, 승격 정책, 코드베이스, 문서, 그리고 인증서가 요구하는 데이터 소스나 도구가 포함된다. 이 글 자체를 Claude에게 컨텍스트로 줄 수도 있다. 이것이 프로젝트의 중앙 지식 베이스가 된다.</p>

<p>그것이 갖춰지면 <a href="https://claude.com/blog/ai-code-migration">현대화 워크플로를 구축하는 것</a>은 쉬운 부분이다. 다운스트림에서 무엇이든 그것에 의존하기 전에, 코드베이스 특화 스킬이나 추출된 규칙을 포함해 Claude의 작업을 필요에 따라 SME가 리뷰하게 하라.</p>

<p>만든 것을 코드베이스의 작은 부분에 적용해 다듬어라. SME가 그것이 만들어낸 변경, 에이전트의 과정, 그리고 인증서를 충족했다는 증거를 리뷰한다.</p>

<blockquote>문제가 드러나면 각 변경이 아니라 워크플로를 수정해야 한다. 목표는 확장했을 때 변경이 거의 모든 곳에서 인증서를 충족하고, 리뷰어가 승격 정책 아래에서 편안하게 머지할 수 있으리라는 확신이다.</blockquote>

<h2>6단계: 현대화 실행</h2>

<p>먼저 코드베이스의 작은 부분에서 승격 정책을 통해 변경을 리뷰하고 반영하는 것까지 포함해 현대화를 처음부터 끝까지 완료하라. 아직 비용이 쌀 때 작동하지 않는 것을 고치고, 확신이 설 때까지 과정을 반복한 뒤 전체 코드베이스로 확장하라.</p>

<p>트랜스폼과 리이매진 현대화는 기존 시스템 옆에 타깃을 구축하고 완료되면 전환하는 방식인 반면, 업리프트에는 두 번째 선택지가 있다. 개발이 계속되는 라이브 코드베이스에서 제자리 현대화를 하는 것이다.</p>

<p>이는 시스템이 중단될 수 없거나, 코드베이스가 너무 빠르게 바뀌어 별도의 현대화된 사본을 최신으로 유지하기 어려울 때 흔히 택하는 방식이다. 이 경우 우리가 효과를 본 방법은 코드베이스를 리프(leaf)에서 안쪽으로 논리적 파티션으로 나누고, 한 번에 한 파티션씩 프리즈하고 현대화하며, 일단 현대화된 파티션을 새 커밋이 되돌릴 수 없도록 CI/CD에 게이트를 두는 것이다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-to-prepare-for-ai-driven-code-modernization-projects/in-place-partitions.png" alt="라이브 코드베이스를 파티션 단위로 제자리 현대화하는 과정 다이어그램">
</figure>

<h2>비용에 관한 메모</h2>

<p>이런 현대화에 토큰 비용이 얼마나 들지 자주 질문받는다. 현대화 작업은 저마다 다르지만, 주요 비용 요인은 다음과 같다.</p>

<ul>
  <li>코드베이스 중 변경해야 하는 양 대비 읽어야 하는 양</li>
  <li>인증서가 얼마나 복잡한가(규제 환경에서는 보통 변경 작성보다 검증이 더 큰 몫을 차지한다)</li>
  <li>인증서가 요구하는 새 테스트 작성과 테스트 수리의 양</li>
  <li>실행이 진행되는 동안 다른 팀이 주변에서 머지하면서 생기는 조정(reconciliation) 작업의 양</li>
</ul>

<blockquote>코드베이스의 작은 부분에서 현대화를 완료할 때 토큰 사용량을 측정하고, 그것으로 나머지 실행을 외삽하라. 라이브 코드베이스에서의 조정 작업처럼 파일럿이 볼 수 없었던 것은 미지수로 취급하라. 이렇게 하면 전체 현대화의 비용 하한 추정치를 얻을 수 있다.</blockquote>

<p>파일럿에서의 측정치는 에이전틱 워크플로에서 비용을 최적화할 지점도 보여 준다. 워크플로에서 토큰을 가장 많이 소비한 부분을 찾아 더 효율적으로 만들 방법을 고민하라. 컴퓨팅이 많이 드는 검증 신호는 더 저렴한 게이트 뒤로 옮겨, 더 쉬운 검사가 통과한 뒤에만 실행되게 하라.</p>

<p>인증서가 완전히 검사하는 기계적이고 대량인 작업에는 비용과 성능의 균형을 맞춘 Sonnet 같은 모델 사용을 고려하라. 더 지능적인 모델은 어려운 변환과 정확성을 검증하는 적대적 리뷰에 아껴 두어라.</p>

<p>저렴한 모델이 인증서를 충족하지 못할 때 더 비싼 모델로 에스컬레이션할 수도 있지만, 파일럿 중에 재시도율을 신중히 분석하라. 저렴한 시도 여러 번이 비싼 시도 한 번보다 비용이 더 들 수 있다. Claude에게 워크플로와 파일럿 데이터 모두에 대한 접근을 주면, 이 분석의 상당 부분을 함께 해낼 수 있다.</p>

<h2>현대화 그 너머</h2>

<p>현대화된 코드베이스는 산출물 중 하나일 뿐이다. 나머지는 그것을 만들어낸 워크플로, 무엇이 올바른지를 담은 문서화된 인증서, 변경 관리 절차가 이미 수용한 승격 정책, 그리고 반영된 모든 변경에 대한 증거 기록이다. 이 플레이북을 재사용 가능한 자산으로 성문화해, 다음 업그레이드나 재작성 때 패턴이 이미 갖춰져 있게 하라.</p>

<p>Anthropic의 포워드 디플로이드 엔지니어들은 고객의 가장 핵심적인 시스템에서 이 단계들을 함께 진행한다. 현대화를 준비하고 있다면 <a href="https://claude.com/contact-sales">우리 팀에 문의</a>하라.</p>

<h2>추가 자료</h2>

<ul>
  <li><a href="https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-modernization">Claude Code용 공개 codemod 플러그인</a></li>
  <li><a href="https://claude.com/blog/the-ai-native-sdlc-playbook">AI 네이티브 SDLC 플레이북</a></li>
  <li><a href="https://resources.anthropic.com/code-modernization-playbook">코드 현대화 플레이북</a></li>
  <li><a href="https://claude.com/blog/how-ai-helps-break-cost-barrier-cobol-modernization">AI를 활용한 COBOL 현대화: 비용 장벽 깨기</a></li>
</ul>

<div class="callout">
  <strong>Claude로 조직의 운영 방식을 바꿔 보세요.</strong>
  <a href="https://claude.com/pricing#api">요금 보기</a> ·
  <a href="https://claude.com/contact-sales">영업팀 문의</a>
</div>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
