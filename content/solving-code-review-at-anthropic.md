---
slug: "solving-code-review-at-anthropic"
title: "Claude Code 팀은 코드 리뷰를 어떻게 하는가"
nav: "Claude Code 팀의 코드 리뷰 · 7겹 검사, 위험 비례 승인, 장애를 eval로, 리뷰 라운드 수렴, 사람이 결정하는 5곳"
main: "claude.dev"
cat: "Engineering"
date: "2026-10-15"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  .code-label { display:block; color: var(--muted); font-size: 0.75rem; letter-spacing: .04em;\n    text-transform: uppercase; margin: 0 0 4px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  table { width:100%; border-collapse: collapse; margin: 16px 0 24px; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }"
has_markdown: false
markdown_length: 0
html_length: 17566
---

<!-- rendered HTML -->
<header>
  <h1>Claude Code 팀은 코드 리뷰를 어떻게 하는가</h1>
  <div class="meta">
    2026년 10월 15일
    · 카테고리: Engineering
    · 글쓴이: Addy Osmani, Morgan Westlee Lunt, Qing Wang (Member of Technical Staff)
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/solving-code-review-at-anthropic">How the Claude Code team does code review</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">에이전트가 코드를 쏟아내는 속도에 맞춰 코드를 어떻게 리뷰할까? Claude Code 팀은 높은 커버리지와 깊이 있는 리뷰를 갖춘 뒤, 리버트(revert)나 장애(incident)를 늘리지 않는 선에서 사람의 리뷰 시간을 최소화하는 쪽으로 최적화하기 시작했다.</p>

<p>앞서 말한 적이 있듯, Claude Code 자체 코드의 약 90퍼센트는 Claude가 쓴다. 그렇다면 그만큼의 양을 어떻게 리뷰할까? 이제 코드를 읽는 사람이 있기는 할까? 그리고 뭔가 고장 나면 누가 잡아낼까?</p>

<p>이 글은 Claude Code 팀의 코드 리뷰 흐름과 그것이 어떻게 발전해 왔는지를 다룬다. 6월부터 9월 사이, Claude Code 코드베이스에 머지된 pull request 수는 두 배 넘게 늘었지만, 리버트해야 했던 비율은 40퍼센트 넘게 줄었다.</p>

<p>우리는 리뷰를 없애지 않았다. 다만 읽는 일의 대부분을 기계로 옮겼고, 사람의 시간과 주의력을 기준으로 최적화했으며, 실수를 빠르고 쉽게 되돌릴 수 있도록 하는 데 크게 투자했다.</p>

<h2 id="rethinking-the-purpose-of-code-review">코드 리뷰의 목적을 다시 생각하기</h2>

<p>에이전트가 코드를 쓰면 변경의 수가 빠르게 늘어난다. Anthropic의 모노레포(monorepo)에서는 하루에 반영되는 변경이 올해 <a href="https://www.anthropic.com/engineering/redesigning-source-control">5월 약 2,500건에서 9월 30,000건 이상</a>으로 늘었다.</p>

<p>Claude Code는 모노레포와 분리된 자체 저장소에 있지만, 이곳도 압박을 많이 받고 있다. 이렇게 빠르게 배포할 때, 사람이 한 줄 한 줄 하는 코드 리뷰는 불가능까지는 아니더라도 엄청나게 어렵다.</p>

<p>코드 리뷰에는 두 가지 역할이 있다.</p>

<ol>
  <li>배포 전에 문제를 찾아 고친다</li>
  <li>팀 전체에 공유된 컨텍스트와 코드베이스 이해를 쌓는다</li>
</ol>

<p>이 글은 주로 문제를 찾아 고치는 쪽을 다루지만, 두 번째 역할도 글 끝부분에서 다시 다룬다.</p>

<p>우리는 "사람이 코드를 읽었는가?"라는 질문이 "이 변경에서 무엇이 잘못될 수 있고, 그것을 잡아내기에 맞는 검사는 자동화된 것이든 사람이든 무엇인가?"라는 질문의 부정확한 대리 지표라고 생각한다.</p>

<p>이 질문을 던지자 리뷰가 <em>언제</em> 일어나는지도 바뀌었다. 예전에는 리뷰가 길 끝에 놓인 관문이었다. 코드를 쓰고, PR을 열고, 동료를 기다린다.</p>

<p>지금은 리뷰가 계속 돌아간다. 글을 쓰는 동안 돌아가는 맞춤법 검사에 더 가깝다. 대부분의 변경은 사람에게 봐 달라고 요청하기 전에 Claude가 적어도 한 번은 리뷰하고 고친 상태다. 이것으로 일상적인 실수 대부분이 잡히고, 팀의 주의력은 더 높은 수준의 질문과 면밀한 검토를 위해 남겨 둔다.</p>

<h2 id="the-scarce-resource-human-time-and-attention">희소한 자원: 사람의 시간과 주의력</h2>

<p>우리는 사람만 풀 수 있는 문제를 위해 사람의 시간과 주의력을 아끼고, 나머지는 자동화된 검사가 잡아내도록 하고 싶다. 지금의 변경 속도에서도 사람이 할 일은 여전히 엄청나게 많고, 우리 팀은 거의 매일 새롭고 낯선 과제를 만난다.</p>

<p>사람의 시간은 리뷰 비용의 양쪽을 모두 포함한다. 사람들이 리뷰하는 데 쓰는 시간, 그리고 나쁜 코드가 망가뜨린 것을 고치는 데 쓰는 시간이다. 첫 번째를 줄여도 그 시간이 두 번째에서 다시 나타난다면 소용이 없다.</p>

<p>그래서 목표는 Claude Code 저장소들(CLI, 데스크톱·웹 앱, 모바일 앱)의 pull request 대부분이 리버트나 장애를 늘리지 않으면서, 루프 안에 사람이 최대 한 명만 있는 상태로 머지되는 것이다. 그 한 명은 작성자 본인이어도 된다. 사람의 시간을 측정하기 위해 우리는 PR당 사람의 승인 수(중앙값과 95번째 백분위수), 사람의 코멘트, 그리고 PR이 사람을 기다리는 시간을 추적한다. 리버트율과 장애율은 가드레일이다. 이것들이 오르면 사람의 시간을 아낀 것이 아니라 옮겨 놓았을 뿐이다.</p>

<h2 id="the-life-of-a-change">변경의 일생</h2>

<p>엔지니어의 노트북(또는 Slack 안의 Claude 세션)에서 시작된 일반적인 변경은 여러 겹의 코드 리뷰를 거친다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/solving-code-review-at-anthropic/life-of-a-change.png" alt="pull request의 검사 단계를 위에서 아래로 보여 주는 도표. PR 전에 작업이 검증된다. 모든 PR에서 필수 CI, Claude 코드 리뷰와 보안 리뷰가 모두 자동으로 돌고, 그다음 사람이 결정하는 위험 기반 승인이 있다. 이어서 머지 큐, 머지 후에는 먼저 사내에서 쓰는 feature flag, 점진적 릴리스, 그리고 지켜보고 고쳐 나가거나(fix forward) 롤백하는 마지막 단계가 온다." loading="lazy">
  <figcaption><strong>변경의 일생</strong> — 작성자의 머신에서 사용자에게 이르기까지, 일반적인 Claude Code 변경의 경로.<br>경로의 대부분은 자동화되어 있고, 사람의 주의력은 위험이 있는 곳으로 간다.</figcaption>
</figure>

<h2 id="layer-by-layer">층층이</h2>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/solving-code-review-at-anthropic/layers.png" alt="위에서 아래로 쌓인 여섯 개의 층: 검증, 필수 CI, AI 리뷰, 보안 리뷰, 사람의 승인, 머지 큐와 flag. 각 층에는 서로 다른 위치에 구멍이 있다. 구멍으로 빠진 문제는 아래 층에서 잡히고, 모든 층의 구멍을 통과한 하나는 맨 아래의 빠른 롤백에 떨어진다." loading="lazy">
  <figcaption><strong>관문 하나가 아니라 여러 층</strong> — 여섯 겹의 검사, 그리고 그 아래의 롤백.<br>각 층은 어떤 문제는 잡고 어떤 문제는 놓친다. 모든 층을 통과하는 문제는 드물고, 나머지는 롤백이 처리한다.</figcaption>
</figure>

<h3 id="1-verified">1. 다른 누가 보기 전에 작업을 검증한다</h3>

<p>이제 리뷰의 대부분은 PR이 생기기도 전에 일어난다. 우리는 Claude에게 실행해 볼 수 있는 것, 예를 들어 테스트, 빌드, 디자인과 비교할 스크린샷 같은 것을 주고, 다 됐다고 말하는 대신 그 출력을 보여 달라고 한다. 그다음 서브에이전트(subagent)가 새로운 컨텍스트로 diff를 리뷰한다. 두 습관 모두 우리의 <a href="https://code.claude.com/docs/en/best-practices">best-practices 가이드</a>에서 온 것이다.</p>

<p>PR을 열기 전에 우리 중 많은 사람이 사내 스킬도 몇 개 돌린다. 하나는 버그를 찾고, 하나는 diff를 단순하게 만들고, 하나는 동작을 처음부터 끝까지(end to end) 확인한다. UI 변경은 우리의 디자인 가이드라인에 맞는지도 확인한다.</p>

<p>Claude Code를 만든 Boris Cherny는 Claude에게 자기 작업을 검증할 방법을 주는 것이 좋은 결과를 얻는 데 <a href="https://x.com/bcherny/status/2007179861115511237">아마 가장 중요한 일</a>이라고 말한 바 있다. 그는 이것이 최종 결과를 두세 배 좋게 만든다고 추정하며 이렇게 썼다. "검증은 도메인마다 모습이 다르다. bash 명령 하나를 실행하는 것처럼 단순할 수도 있고, 테스트 스위트를 돌리거나, 브라우저나 폰 시뮬레이터에서 앱을 테스트하는 것일 수도 있다."</p>

<p><strong>자동 리뷰어가 같은 것을 계속 지적하면, 우리는 그 근원에서 고친다.</strong> 스킬에서, lint 규칙으로, 또는 다음과 같은 지침 파일을 업데이트해서다.</p>

<ul>
  <li><code>CLAUDE.md</code>는 Claude에게 이 프로젝트가 무엇인지 알려 준다. 스택, 컨벤션, 목표와 비목표(non-goals)다. 모든 리뷰가 이 파일을 불러오므로, 큰 코드베이스에서는 짧게 유지하고 거기서 다른 문서를 가리킨다. 리뷰어는 이 파일의 컨벤션을 어기는 코드, 그리고 이 파일의 어떤 줄을 낡게 만드는 변경도 지적한다.</li>
  <li><code>REVIEW.md</code>는 코드 오너가 쓰며, 리뷰어에게 자기 영역의 코드에서 무엇이 중요한지 알려 준다. 리뷰어가 실제로 이 파일을 따르는지는 따로 확인한다. 좋은 <code>REVIEW.md</code>는 짧다. 그 저장소에서 실패가 어떤 모습인지 말하고(문서라면 "거짓을 말한다", 설정이라면 "잘못 라우팅한다"), 사소한 지적(nit)의 수에 상한을 두고, 건너뛸 경로를 나열하고, 이름만 보고 추측하는 대신 파일과 줄 번호를 증거로 요구한다. 또한 개수로 시작하는 요약을 요구하고, 고칠 것이 없을 때는 그렇다고 분명히 말하라고 한다.</li>
</ul>

<h3 id="2-ai-review">2. 모든 pull request에 AI 리뷰</h3>

<p>모든 pull request는 사람이 보기 전에 Claude 리뷰를 받는다. Claude는 diff를 저장소 전체 및 PR에 명시된 의도와 대조해 읽고, 이 변경이 자기 문제를 해결하는지, 시스템에 맞는지, 아니면 다른 무언가를 망가뜨리는지 묻는다.</p>

<p>버그 수정이라면 근본 원인을 찾는다. 공개 버전인 <a href="https://code.claude.com/docs/en/code-review">Code Review for Claude Code</a>는 이제 Team 및 Enterprise 플랜에서 정식 출시(GA)되었고, <code>/code-review</code>는 더 가벼운 버전을 로컬에서 실행한다.</p>

<p>우리가 <a href="https://claude.com/resources/articles/code-review">리서치 프리뷰를 출시</a>했을 때, 실질적인 리뷰 코멘트를 받은 사내 PR의 비율은 16%에서 54%로 올랐다. 1,000줄이 넘는 PR 대부분에서는 발견 사항(finding)이 나오고, 작은 PR 대부분은 깨끗하게 돌아온다. 관리자는 저장소마다 Quick, Standard, Deep 중 하나를 설정한다. Deep은 버그 하나를 놓치는 비용이 추가 리뷰 시간보다 큰 곳에서 쓸 가치가 있다.</p>

<p><strong>발견 사항은 사람이 리뷰하기 전에 다른 에이전트들이 검증한다.</strong> 여러 에이전트가 동시에 버그를 찾는다. 그다음 별도의 그룹이 각 발견 사항에 투표하고, 충분히 많은 에이전트가 진짜라고 동의해야만 게시된다. 스타일, 진단(diagnostics), 정리(cleanup)에 관한 것뿐인 발견 사항은 버린다. 이 필터들은 우리 자신의 PR로 A/B 테스트를 해 본 뒤에 유지하기로 했다. 남은 것은 심각도 순으로 정렬된 인라인 코멘트로 나타난다. 각각에는 Important, Nit, Pre-existing 태그가 붙어서, 그 PR이 만들지 않은 버그가 작성자의 잘못처럼 보이지 않는다.</p>

<p><strong>모든 발견 사항에는 답해야 한다.</strong> 고치거나, 이유를 적고 스레드를 resolve한다. 밤사이 에이전트가 수정을 맡는 경우가 많아서, 작성자가 돌아오면 PR은 이미 한 라운드를 더 거친 상태다.</p>

<h3 id="3-security-review">3. 머지를 막을 수 있는 보안 리뷰</h3>

<p>보안도 별도의 자동 리뷰를 받는다. 버그 리뷰나 보안 리뷰의 발견 사항이 하나라도 열려 있는 동안 PR은 머지될 수 없다. 고치거나, 짧은 이유를 적고 스레드를 닫는다. 오탐(false positive)은 이렇게 처리한다.</p>

<p>이후 커밋이 문제를 고치면 발견 사항은 저절로 해제된다. 같은 구성을 오픈소스 보안 리뷰 GitHub Action이나 <code>/security-review</code> 명령으로 만들 수 있다. 설정 방법은 <a href="https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code">Claude Code의 자동 보안 리뷰</a>에 나와 있다.</p>

<h3 id="4-automated-checks">4. 머지를 막는 자동화된 검사</h3>

<p>흔히 하는 것들이다. lint, 타입 검사, 모든 플랫폼에서의 테스트, 그리고 빌드. (이 정도 양에 맞춰 CI를 확장한 이야기는 <a href="https://claude.com/resources/articles/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic">여기</a>에 썼다.) 일반적인 CLI pull request는 누가 보기도 전에 수십 개의 검사를 돌릴 수 있다. PR 템플릿은 변경을 어떻게 테스트했는지, 그리고 어떻게 되돌리는지를 묻는다. Claude가 이 부분을 채울 수 있지만, 변경을 요청한 사람이 서명(sign off)한다.</p>

<h3 id="5-human-approval">5. 위험에 비례하는 사람의 승인</h3>

<p>문서 수정과 auto-updater 변경은 위험이 다르므로 리뷰도 다르게 받는다.</p>

<table>
  <thead>
    <tr><th>위험</th><th>예시</th><th>사람의 승인</th></tr>
  </thead>
  <tbody>
    <tr><td>낮음</td><td>문서, 문구(copy), 사내 전용 기능, flag 뒤에 있는 추가형 변경</td><td>자동 리뷰와 보안 검사가 통과(green)하면 필요 없음</td></tr>
    <tr><td>중간</td><td>일반적인 제품 변경, 그리고 캐싱·auto-updater·시스템 프롬프트 같은 민감한 영역의 변경</td><td>한 명</td></tr>
    <tr><td>높음</td><td>가장 위험한 코드, 그리고 항상 두 사람이 필요한 소수의 경로</td><td>두 명</td></tr>
  </tbody>
</table>

<p><strong>등급은 작성자가 아니라 변경이 정한다.</strong> 분류기(classifier)가 변경을 읽고 위험 등급을 고른다. 두 번째 분류기는 등급상 필요 없다고 나오더라도 이 특정 변경에 다른 사람이 필요한지 묻는다. 어떤 경로는 항상 사람이 필요하다. 오너가 민감하다고 지정한 모든 것, 그리고 모든 CI 워크플로우 파일이다.</p>

<p><strong>가벼운 경로는 신뢰된 작성자만 쓸 수 있다.</strong> 저장소의 신뢰 목록에 있는 작성자, 주로 그 저장소를 소유한 팀만 가벼운 경로를 쓴다. 다른 사람은 모두 두 번째 사람의 승인이 필요하다. 또한 에이전트의 승인은 결코 사람의 승인으로 치지 않는다. 자동 리뷰는 위험이 낮은 변경을 통과시킬 수는 있지만, 사람이 필요한 자리를 채울 수는 없다.</p>

<p><strong>변경을 프롬프트한 사람이 그 변경을 책임진다.</strong> 에이전트가 쓴 PR에서는 에이전트를 지휘한 사람이 필수 리뷰어 중 한 명으로 계산된다. 그 사람이 직접 코드를 타이핑한 것과 똑같다.</p>

<p><strong>승인은 특정 커밋 하나에만 적용된다.</strong> 에이전트의 push나 누군가 손으로 해결한 머지처럼, 시스템이 보증할 수 없는 새 커밋이 들어오면 승인을 다시 받아야 한다.</p>

<h3 id="6-merge-queue">6. 머지 큐, flag, 그리고 점진적 릴리스</h3>

<p>머지 큐(merge queue)는 변경을 적용한 main에 대해 모든 검사를 다시 돌린다. 그래서 각각은 통과하는 두 PR이 합쳐져 main을 망가뜨릴 수 없다. 새 동작은 보통 flag 뒤에 숨겨 Anthropic 직원에게 먼저 배포되고, 우리가 워낙 많이 쓰다 보니 사용자보다 먼저 회귀(regression)를 드러내는 경우가 많다. 공개 릴리스는 먼저 <code>latest</code> 채널로 나가고, <code>stable</code> 채널은 그 뒤를 따른다.</p>

<h3 id="7-fast-rollback">7. 빠른 감지, 빠른 롤백</h3>

<p>그래도 일부 실수는 빠져나가므로, 마지막 층은 그것을 빠르게 잡는 데 집중한다. flag는 배포 없이 끌 수 있다. Claude Code에는 주간 온콜(on-call) 순번이 있고, 장애 리뷰에서는 어느 층이 그 문제를 잡았어야 했는지 묻는다.</p>

<p>잘못된 머지를 알아차리는 일은 여전히 작성자와 온콜, 그리고 리버트·장애 대시보드에 달려 있다. 그 숫자들이 움직일 때 승인을 조이는 서킷 브레이커(circuit breaker)는 아직 없다. 여기 엔지니어들은 더 많은 코드가 사람 없는 머지(zero-human merge)로 옮겨 가기 전에 그것을 원한다.</p>

<p>한 동료는 속도를 늦추면 오류율이 낮아지기는 하지만, 그건 주로 모든 일을 덜 하기 때문이라고 말했다. 우리는 문제를 알아차리고 고치는 속도를 높이는 쪽을 택하겠다.</p>

<h2 id="how-we-make-the-reviewer-better">리뷰어를 더 낫게 만드는 방법</h2>

<p>우리의 코드 리뷰 프로세스는 루프를 돌며 계속 개선된다.</p>

<p><strong>모든 장애는 이제 eval이 된다.</strong> 팀은 장애를 일으킨 과거 PR들을 그 fix-forward와 리버트와 함께 모았고, 해당 코드를 잘 아는 엔지니어들이 각 버그와 그 위치를 확인했다. 리뷰어는 매일 이 세트에 대해 실행된다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/solving-code-review-at-anthropic/incidents-eval.png" alt="장애나 리버트가 전문가가 확인한 사례가 되어 eval 세트에 추가된다. 리뷰어에 대한 변경은 매일 도는 eval 실행에 들어가 모든 사례에 대해 채점된다. 점수가 오르면 변경을 유지하고 아니면 버리며, 다음 변경과 함께 루프가 다시 시작된다." loading="lazy">
  <figcaption><strong>우리의 장애가 곧 eval이다</strong> — 과거 장애와 리버트로 만들어, 매일 실행한다.<br>eval은 장애가 생길 때마다 커지고, 리뷰어에 대한 모든 변경은 그 전체에 대해 채점된다.</figcaption>
</figure>

<p><strong>사람들이 코멘트를 어떻게 처리하는지 보고 노이즈를 측정한다.</strong> 버그가 아닌 것을 잔뜩 지적해도 상관없다면 더 많은 버그를 잡기는 쉽다. 그래서 그에 대한 견제가 필요하다. 우리는 리뷰어가 남긴 모든 코멘트를 PR의 사람이 어떻게 반응했는지에 따라 분류한다. 고쳤는지, 틀렸다고 했는지, 의도된 동작이라고 했는지, 중요하지 않다고 판단했는지다. 또한 깨끗하다는 것을 아는 PR에 리뷰어를 돌려서, 누군가에게 해로운 변경을 하게 만들었을 법한 보고를 얼마나 자주 하는지 센다. 문서로 적어 둔 우리의 우선순위는 첫째가 진짜 버그를 잡는 것, 둘째가 리뷰 라운드를 줄이는 것이다.</p>

<p>작성자가 에이전트일 때 노이즈의 비용은 더 크다. 사람은 사소한 지적을 몇 초 만에 넘길 수 있다. 에이전트는 그것을 고치고, 그러면 커밋이 하나 더 생기고 리뷰도 한 라운드 더 돈다.</p>

<p><strong>리뷰는 수렴해야 한다.</strong> 에이전트 작성자와 에이전트 리뷰어는 서로를 끝없이 바쁘게 만들 수 있다. 어떤 CLI PR은 작성자가 멈추기 전까지 밤사이 리뷰와 수정을 50라운드 넘게 거쳤다.</p>

<p>리뷰어가 계속 지적하던 것에 git blame을 돌려 보니, 그중 약 59%는 리뷰어의 첫 패스 때부터 있던 코드였다. 리뷰어는 새 버그를 찾는 경우가 드물었고, 라운드마다 오래된 버그를 몇 개씩 더 찾고 있었다.</p>

<p>이 상황은 우리가 스스로 악화시켰다. 패스마다 새로운 것이 하나씩 잡히니, 기본적으로 여러 라운드를 돌리는 데 익숙해져 있었던 것이다. 위험한 변경이라면 그럴 가치가 있지만, 모든 PR에 그럴 필요는 없다. 팀은 이제 재현율(recall)과 함께 통과까지의 라운드 수(rounds-to-pass)를 추적하며, 재리뷰 방식을 바꿨다.</p>

<ul>
  <li><strong>라운드 상한.</strong> 세 라운드가 지나면 리뷰어는 작성자에게 한 걸음 물러서서 접근 방식을 다시 생각해 보라고 한다.</li>
  <li>처음 몇 번의 패스 이후에는 <strong>diff만 재리뷰</strong>한다.</li>
  <li><strong>버그의 유형(class)을 지적</strong>해서, 작성자가 한 줄이 아니라 모든 사례를 고치게 한다.</li>
  <li>이미 게시된 발견 사항은 <strong>반복하지 않는다</strong>.</li>
</ul>

<p>리뷰 에이전트는 매일 밤 기존 코드에도 돌아서, 오래된 버그가 다른 곳에서 드러나기 전에 잡도록 돕는다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/solving-code-review-at-anthropic/convergence.png" alt="수렴 작업 전후 비교: 한 번의 리뷰·수정 라운드 후 통과한 pull request는 65%에서 78%로 늘었고, 다섯 라운드 이상 필요했던 pull request는 8.9%에서 1.5%로 줄었으며, 통과까지의 평균 리뷰 수는 2.08에서 1.32로 줄었다." loading="lazy">
  <figcaption><strong>수렴하는 리뷰</strong> — 수렴 변경 전후의 사내 pull request.<br>수렴 변경 이후, 사내 pull request당 리뷰 라운드가 줄었다. (한 라운드 후 통과 65% → 78%, 5라운드 이상 8.9% → 1.5%, 통과까지 평균 리뷰 수 2.08 → 1.32)</figcaption>
</figure>

<h2 id="where-humans-stay-in-the-loop">사람이 루프에 남는 곳</h2>

<p>일상적인 실수 하나를 잡자고 시니어 엔지니어를 깊은 몰입 작업에서 끌어내는 비용은 자동 리뷰보다 훨씬 크다. Anthropic에서 우리의 일은 모든 diff를 읽는 것에서 기계가 잘 못하는 결정으로 옮겨 갔다.</p>

<ul>
  <li><strong>애초에 이걸 만들어야 하나?</strong> 방향, 안목(taste), 범위. 리뷰 병목이 해결됐다고 선언한 한 팀도 팀 바깥에서 온 변경에는 여전히 사람의 리뷰를 유지해서, 누군가 "이걸 해야 하기는 하나?"라고 묻게 한다.</li>
  <li><strong>위험한 코드</strong>. 예를 들어 결제(billing), auto-updater, CI 워크플로우.</li>
  <li>다른 사람들이 따라 할 패턴을 정하는 <strong>아키텍처</strong>.</li>
  <li><strong>증거 읽기.</strong> 테스트 출력, 실행된 명령과 그 결과, 스크린샷, 리뷰어의 발견 사항. 검사들이 무엇을 놓칠지 말할 수 없다면, 빠른 승인 대신 제대로 된 리뷰를 요청하자.</li>
  <li><strong>결과에 대한 책임.</strong> 누가 타이핑했든, 배포되는 모든 변경에는 책임지는 사람이 있다.</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/solving-code-review-at-anthropic/where-a-person-decides.png" alt="자동화된 검사가 전 구간에서 돌고, 사람이 결정하는 지점이 다섯 곳 있다: 만들어야 하나, 위험한 코드, 아키텍처, 증거 읽기, 결과에 대한 책임." loading="lazy">
  <figcaption><strong>사람이 결정하는 곳</strong> — 다섯 가지 결정은 사람에게 남고, 나머지 모든 곳에서는 검사가 돈다.<br>사람들은 모든 diff를 읽는 일에서 기계가 잘 못하는 결정으로 옮겨 갔다.</figcaption>
</figure>

<h2 id="sharing-context-across-the-team">팀 전체에 컨텍스트 공유하기</h2>

<p>코드 리뷰의 두 번째 역할은 언제나 코드베이스에 대한 이해를 퍼뜨리는 것이었다. 동료의 diff를 읽는 것은 무엇이 바뀌었는지, 조각들이 어떻게 맞물리는지 배우는 방법이다. 기계가 읽는 일의 대부분을 한다면, 사람은 코드를 어떻게 배울까?</p>

<p>이를 위한 공식적인 프로세스는 없다. 팀의 누구도 Claude Code의 완전한 멘탈 모델을 머릿속에 갖고 있지 않고, 우리는 누구도 그럴 필요가 없다고 생각한다. 누군가 코드베이스의 한 부분을 이해하고 싶으면, Claude에게 정확히 그 조각에 대한 설명서(explainer)를 써 달라고 한다. 몇 분이면 되고, 오늘 시점의 코드를 그대로 반영한다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/solving-code-review-at-anthropic/learn-the-code.png" alt="&quot;기계가 읽는 일의 대부분을 한다면, 사람은 코드를 어떻게 배울까?&quot;라는 제목의 도표. 왼쪽의 격자는 코드베이스를 나타내며, 이해하고 싶은 부분인 managed settings가 몇 칸 강조되어 있다. 누구도 그 완전한 멘탈 모델을 머릿속에 갖고 있지 않다. &quot;정확히 그 조각에 대해 Claude에게 묻기&quot;라는 화살표와 &quot;Claude Code는 managed settings를 어떻게 가져오나?&quot;라는 예시 질문이 두 가지 결과로 이어진다. Claude가 설명서를 쓰는데, 몇 분이면 되고 오늘 시점의 코드를 반영한다. 그리고 일부 사람에게는 Claude가 코드의 그 부분을 시각화해 그 사람이 좋아하는 방식으로 가르쳐 주는 작은 artifact를 만든다. 아래쪽: 사소한 diff를 한 줄씩 읽는 것, 즉 한 줄짜리 문구 변경은 거의 아무것도 가르쳐 주지 않는다. 곧 바꿀 모듈에 대한 설명서는 많은 것을 가르쳐 준다." loading="lazy">
  <figcaption>기계가 읽는 일의 대부분을 한다면, 사람은 코드를 어떻게 배울까? — 정확히 그 조각에 대해 Claude에게 묻고, 설명서나 작은 artifact로 배운다.</figcaption>
</figure>

<p>우리 중 일부는 한 걸음 더 나아가, 코드의 그 부분을 시각화하고 그 사람이 좋아하는 방식으로 가르쳐 주는 작은 artifact를 Claude에게 만들게 한다.</p>

<p>사람의 주의력을 잘 쓰는 것이 목표라면, 이 방식이 사소한 diff를 한 줄씩 읽는 것보다 낫다. 한 줄짜리 문구 변경은 거의 아무것도 가르쳐 주지 않는다. 곧 바꿀 모듈에 대한 설명서는 많은 것을 가르쳐 준다. 기본적으로 공개 Slack 채널에서 일하는 우리의 문화도 도움이 된다. 다른 사람들이 무엇을 만들고 있는지, 만드는 동안 볼 수 있기 때문이다.</p>

<h2 id="you-land-it-you-own-it">"반영했으면, 책임진다"</h2>

<p>작거나 중간 크기의 변경을 반영(land)했는데 그래도 뭔가 잘못되면, 보통 그 사람이 고치는 것이 팀의 규범이다. 몇 가지가 이것이 나쁘게 흘러가지 않도록 막아 준다.</p>

<ul>
  <li><strong>변경은 작다.</strong> 그래서 리뷰하고, 디버그하고, 리버트하기 쉽다.</li>
  <li><strong>모든 것은 되돌릴 수 있다.</strong> flag, 리버트, 단계적 릴리스로 대부분의 실수를 몇 분 안에 되돌린다.</li>
  <li><strong>영향 범위(blast radius)가 기준을 정한다.</strong> 비싼 코드에는 더 많은 사람과 더 많은 검사가 붙는다.</li>
  <li><strong>회귀는 빠르게 드러난다.</strong> 텔레메트리와 사내 사용을 통해서다.</li>
  <li><strong>비난이 아니다.</strong> 수정을 맡는다는 것은 가장 많은 컨텍스트를 가진 사람이 맡는다는 뜻이다. 장애 리뷰는 시스템을 들여다본다.</li>
</ul>

<p>책임은 공유되기도 한다. 팀의 상당수는 <a href="https://claude.com/product/tag">공개 채널</a>에서 일한다. 그곳에서는 누구나 다른 사람이 무엇을 만드는지 보고, 스레드를 이어받거나, 빈틈에 Claude를 투입할 수 있으며, 그 코드를 소유하지 않은 사람들에게서도 피드백이 온다. 모든 줄에 관문을 두지 않고도 품질이 높게 유지되는 데에는 이 개방성이 큰 몫을 한다.</p>

<h2 id="when-we-change-direction">방향을 바꿀 때</h2>

<p>에이전트 덕분에 일을 시작하는 비용이 싸졌기 때문에, 어떤 작업은 반영되지 말아야 한다. 보통은 채널의 누군가가 왜 하는지 묻거나, 이전의 결정을 가리키거나, 더 단순한 경로를 제안하고, 작성자는 PR을 닫거나 다시 다듬는다.</p>

<p>코드를 빨리 썼으니 PR을 닫아도 손해처럼 느껴지지 않는다. 요령은 다른 방향을 스레드에서 일찍 제기하는 것이다. 다 만들어진 PR에 머지를 막는 코멘트로 다는 것이 아니라.</p>

<h2 id="how-you-can-adopt-this-process">이 프로세스를 도입하는 방법</h2>

<p>여러분의 팀에서 이렇게 하는 데 필요한 조각은 대부분 오늘 이미 있다.</p>

<h3 id="before-the-pull-request">pull request 전에</h3>

<ul>
  <li>에이전트에게 실행할 수 있는 검사를 주고 짧은 <code>CLAUDE.md</code>에 나열하자. 포매터와 린터를 실행하는 hook도 함께.</li>
  <li><code>/code-review</code>와 <code>/security-review</code>를 로컬에서 실행하거나, 새로운 컨텍스트의 서브에이전트 리뷰를 돌리자.</li>
  <li><code>REVIEW.md</code>를 추가하고, 반복되는 리뷰 코멘트를 그 안으로 옮기자.</li>
</ul>

<h3 id="on-every-pull-request">모든 pull request에서</h3>

<ul>
  <li>CI를 필수로 하고, PR 템플릿에 "Testing", "Risk", "How to revert"를 추가하자.</li>
  <li>저장소 하나에 AI 리뷰어(Code Review for Claude Code 또는 Claude Code GitHub Action)를 추가하고, 몇 주 동안 <code>REVIEW.md</code>를 다듬은 다음 범위를 넓히자.</li>
  <li>자동 보안 리뷰를 추가하고, 머지 전에 모든 리뷰 스레드가 resolve되도록 요구하자.</li>
  <li>리뷰 노력을 위험에 맞추자. 일상적인 변경은 빠르게, 버그를 놓치면 비싼 곳은 깊게(Code Review의 Quick, Standard, Deep).</li>
  <li>리뷰 라운드에 상한을 두자. 처음 몇 번 이후에는 새 diff만 재리뷰하자.</li>
</ul>

<h3 id="approval">승인</h3>

<ul>
  <li>위험 등급을 문서로 적고, 작성자가 아니라 변경을 기준으로 정하자. 엄격하게 시작해서 증거가 쌓이면 완화하자.</li>
  <li>가벼운 승인 경로는 신뢰하는 작성자에게만 열어 두자.</li>
  <li>CODEOWNERS와 branch protection을 써서 인증, 결제, CI·릴리스 워크플로우, 설치 프로그램은 항상 사람이 필요하게 하자.</li>
  <li>봇의 승인이 필수 사람 승인을 대신하게 두지 말고, 새 커밋이 들어오면 승인을 무효화하자.</li>
</ul>

<h3 id="merge-and-after">머지와 그 이후</h3>

<ul>
  <li>머지 큐, feature flag, 사내 우선 사용, 단계적 릴리스, 한 번에 되돌리는 롤백을 쓰자.</li>
  <li>장애와 리버트를 eval 세트로 만들고, 리뷰어의 프롬프트·도구·모델이 바뀔 때마다 다시 채점하자.</li>
  <li>사람의 시간을 측정하고, 리버트율과 장애율을 가드레일로 삼자.</li>
</ul>

<h2 id="where-this-is-going">앞으로의 방향</h2>

<p>Code Review의 <a href="https://claude.com/resources/articles/code-review">출시 발표</a>는 pull request 승인은 여전히 사람이 내리는 결정이라고 말했다. 이 제품은 발견 사항을 게시할 뿐 승인을 하지 않는다. 우리 자신의 저장소는 한 걸음 더 나아가, 어떤 저위험 변경이 자동 검사만으로 머지될지를 오너가 정하게 하고 있으며, 그 선은 계속 움직이고 있다.</p>

<p>리뷰가 무언가를 놓치면, 우리는 모델이 무엇을 보지 못했는지 묻고 그 해결책을 <code>CLAUDE.md</code>, 스킬, 또는 새로운 검사에 넣는다. 목표는 변하지 않았다. 변경당 사람의 시간은 줄이고, 리버트는 이전보다 늘지 않게 하는 것이다.</p>

<p>여러분의 팀이 에이전트에게 pull request를 열게 한다면, 어떤 검사를 자동화했는지, 어떤 검사에 아직 사람이 필요한지, 그리고 우리가 무엇을 잘못 생각하고 있다고 보는지 듣고 싶다.</p>

<p><em>리뷰해 준 Emma Webb, Michael Segner, Amie Rotherham에게 감사드린다.</em></p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
