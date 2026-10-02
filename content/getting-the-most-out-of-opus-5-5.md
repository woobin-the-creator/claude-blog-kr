---
slug: "getting-the-most-out-of-opus-5-5"
title: "Claude와 Claude Code에서 Opus 5.5를 최대한 활용하기"
nav: "Opus 5.5 최대한 활용하기 · 완료 조건 명시, think hard 삭제, CLAUDE.md 멈춤 규칙, 서브에이전트, 플래그 대처, 체크리스트"
main: "claude.dev"
cat: "Playbooks"
date: "2026-09-22"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  h4 { font-size: 1.02rem; margin: 24px 0 6px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.95rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  td.nw, th.nw { white-space: nowrap; }\n  td.num, th.num { text-align: right; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figure table { margin-bottom: 0; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .interactive { border:1px dashed var(--line); border-radius: 8px; padding: 16px 18px; background:#fcfcfb; }\n  .interactive .label { font-size:0.8rem; color: var(--muted); letter-spacing: .04em; margin-bottom: 8px; }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 14111
---

<!-- rendered HTML -->
<header>
  <h1>Claude와 Claude Code에서 Opus 5.5를 최대한 활용하기</h1>
  <div class="meta">
    2026년 9월 22일
    · 카테고리: Playbooks
    · 글쓴이: Addy Osmani (Member of Technical Staff)
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/getting-the-most-out-of-opus-5-5">Getting the most out of Opus 5.5 in Claude and Claude Code</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Opus 5.5에게 어떻게 프롬프트를 쓰고, 긴 실행을 어떻게 조종하고, Claude 앱과 Claude Code에서 결과를 어떻게 확인할지.</p>

<p>Opus 5.5는 지금까지 Claude를 쓰던 방식 그대로 잘 돌아간다. 다만 몇 가지는 다르게 움직인다. 혼자서 더 오래 일하고, 무엇을 했는지 분명하게 말해 주며, 답하기 전에 매번 생각한다. 이 가이드는 Claude 앱과 Claude Code에서 Opus 5.5와 일하는 법을 다룬다. 모델에게 어떻게 프롬프트를 쓰고, 긴 실행을 어떻게 조종하고, 결과를 어떻게 확인하는지까지.</p>

<h2 id="try-this-first">먼저 이것부터 해 보자</h2>

<div class="callout">
<p><strong>Opus 5.5와의 첫 세션에서 해 볼 세 가지</strong></p>
<ol>
<li>작업 전체를 통째로 넘긴다. "완료"가 어떤 모습인지, 언제 멈춰서 물어봐야 하는지 말한다. 그다음은 일하게 둔다.</li>
<li>"신중하게 생각해라" 같은 줄은 지운다. Opus 5.5는 이미 답하기 전에 매번 생각한다.</li>
<li>긴 실행이 끝나면, 모델이 당신에게 필요로 하는 것부터 읽는다.</li>
</ol>
</div>

<h2 id="how-to-ask">1. 어떻게 요청할까</h2>

<h3 id="say-what-done-looks-like">"완료"가 어떤 모습인지 말하고, 돌게 두기</h3>

<p><strong>할 일.</strong> 작업 전체를 메시지 하나에 담아 준다. "테스트가 통과한다"나 "모든 엔드포인트가 마이그레이션됐다"처럼 결승선을 이름 붙인다. 그다음은 알아서 익게 둔다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5는 길고 여러 단계로 된 일을 Opus 5보다 더 잘 끝까지 끌고 간다. 이전 Opus 모델들과 비교해 가장 크게 좋아진 부분이 여러 단계 작업이다. 큰 저장소에서 변경 하나를 테스트가 통과할 때까지 끌고 가는 것 같은 일 말이다. 초기 테스터들은 긴 코딩 작업을 거의 지켜보지 않은 채 몇 시간씩 돌렸다. 결승선이 분명하면 모델은 언제 끝난 건지 안다.</p>

<p><strong>방법.</strong> 예를 들어 Claude Code에서는 이렇게 한다.</p>

<pre><code>Migrate the payment endpoints from the old client to the new one.
Done means: every endpoint uses the new client, the old client is deleted, and the test suite passes.
Stop and ask me only if a test fails for a reason you can't explain.</code></pre>

<p class="meta">(번역) 결제 엔드포인트를 옛 클라이언트에서 새 클라이언트로 마이그레이션해라. 완료의 뜻: 모든 엔드포인트가 새 클라이언트를 쓰고, 옛 클라이언트는 삭제됐고, 테스트 스위트가 통과한다. 설명할 수 없는 이유로 테스트가 실패할 때만 멈추고 나에게 물어라.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/getting-the-most-out-of-opus-5-5/fig-a-one-message.png" alt="예시 프롬프트를 라벨이 붙은 세 상자로 나눈 그림: 작업 전체(결제 엔드포인트를 옛 클라이언트에서 새 클라이언트로 마이그레이션), 강조된 결승선(모든 엔드포인트가 새 클라이언트를 쓰고, 옛 클라이언트는 삭제됐고, 테스트 스위트가 통과한다), 멈출 때(설명할 수 없는 이유로 테스트가 실패할 때만). 하단: '작업 전체를 메시지 하나에 담아라. 결승선을 이름 붙여라. 그다음은 내버려 둬라.'">
  <figcaption><b>FIG A</b>메시지 하나에: 작업 전체, 결승선, 그리고 멈출 때.</figcaption>
</figure>

<h3 id="stop-telling-it-to-think-hard">"열심히 생각해라"라고 그만 말하기</h3>

<p><strong>할 일.</strong> 프롬프트와 저장해 둔 지시문에서 "신중하게 생각해라", "단계별로 생각해라" 같은 줄을 지운다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5는 답하기 전에 항상 생각하고, 얼마나 생각할지도 스스로 정한다. 생각하라고 부탁할 필요가 없다. 우리가 채팅 제품에서 테스트했을 때, "신중하게 생각해라" 줄을 없애자 답이 더 빨리 시작됐고 품질이 눈에 띄게 떨어지지도 않았다.</p>

<p><strong>방법.</strong> 그 줄을 지운다. 간단한 질문에 빠른 답을 원하면 그렇게 말한다: "바로 답해라." Claude Code에서 생각하는 양을 바꾸고 싶으면 effort를 바꾼다.</p>

<h3 id="add-to-a-running-task">돌아가는 작업에 덧붙이기</h3>

<p><strong>할 일.</strong> 실행 중간에 뭔가 떠오르면, 모델이 일하는 동안 후속 메시지를 입력해도 된다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 이제 실행이 더 길어졌으니, 다시 시작하는 비용이 더 크다.</p>

<p><strong>방법.</strong> Claude Code에서 Claude가 일하는 동안 메시지를 입력하고 Enter를 누른다. 예를 들면 "옛 엔드포인트 이름도 alias로 남겨 둬."</p>

<h3 id="for-design-work-name-the-styles">디자인 작업에는 원하지 않는 스타일을 이름 붙이기</h3>

<p><strong>할 일.</strong> 페이지, 앱, artifact를 요청할 때 빼고 싶은 디자인 습관을 나열한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 디자인 방향이 없으면 Opus 5.5는 몇 가지 기본 스타일로 돌아간다. "흔한 느낌은 피해라" 같은 일반적인 지시는 대개 기본값 하나를 다른 기본값으로 바꿀 뿐이다. 구체적인 패턴 목록이 훨씬 잘 먹힌다.</p>

<p><strong>방법.</strong> 패턴을 이름 붙인다.</p>

<pre><code>Build a personal website with placeholder content.
Don't use a cream or off-white background, italic accent words in headings, numbered "01 / 02 / 03" section labels, monospace labels, or pill-shaped buttons.</code></pre>

<p class="meta">(번역) 자리표시 콘텐츠로 개인 웹사이트를 만들어라. 크림색이나 오프화이트 배경, 제목 속 이탤릭 강조 단어, "01 / 02 / 03" 번호 섹션 라벨, 모노스페이스 라벨, 알약 모양 버튼은 쓰지 마라.</p>

<p>그다음 모델이 대신 무엇을 골랐는지 본다. 그것도 마음에 안 들면 목록에 추가하고 다시 요청한다.</p>

<h2 id="steering-a-long-run">2. Claude Code에서 긴 실행 조종하기</h2>

<h3 id="tell-it-which-stops-you-want">어떤 멈춤을 원하는지 말하기</h3>

<p><strong>할 일.</strong> 언제 멈춰서 물어보고 언제 계속 가야 하는지에 대한 짧은 규칙을 CLAUDE.md 파일에 넣는다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5는 일하면서 상황을 계속 알려 준다. 긴 작업에서는 가끔 계속 가는 대신 보고하려고 멈춘다. 다음 단계를 이름만 부르고 실행하지는 않는 요약, 계속할지 묻는 제안, 작업을 막지도 않는 선택지 목록 같은 것이다. 모델은 이런 멈춤을 이름 붙인 지시를 따른다. 당신이 원하는 멈춤도 이름 붙여 두자.</p>

<p><strong>방법.</strong> 아래를 CLAUDE.md에 넣고, 프로젝트에 맞게 고친다.</p>

<pre><code>When a step doesn't need my input, keep going. Put status notes in the same message as your next action.
Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.</code></pre>

<p class="meta">(번역) 내 입력이 필요 없는 단계면 계속 가라. 상태 메모는 다음 행동과 같은 메시지에 넣어라. 나 없이는 진행할 수 없을 때, 또는 파괴적인 일(데이터 삭제, force-push, 이 저장소 밖의 무언가를 바꾸는 것) 전에만 멈추고 물어라.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/getting-the-most-out-of-opus-5-5/fig-b-claude-md-rule.png" alt="'어떤 멈춤을 원하는지 말하기'라는 제목의 CLAUDE.md 카드, 상자 두 개. 계속 가기: 내 입력이 필요 없는 단계면 계속 가고, 상태 메모는 다음 행동과 같은 메시지에 넣는다. 멈추고 묻기: 나 없이는 진행할 수 없을 때, 또는 파괴적인 일(데이터 삭제, force-push, 이 저장소 밖을 바꾸는 것) 전에만. 하단: '프로젝트에 맞게 고쳐라. 파괴적인 명령에 대한 권한 프롬프트도 켜 둬라.'">
  <figcaption><b>FIG B</b>CLAUDE.md 규칙: 언제 계속 가고, 언제 멈춰서 물을지.</figcaption>
</figure>

<p>실행이 "계속할까요?"로 멈추면 "continue"라고 답한다. 이게 자주 일어나면 위 규칙이 도움이 된다.</p>

<p>계속 가라는 규칙은 멈춤이 줄어든다는 뜻이니, 위험하거나 되돌리기 어려운 일 앞에서는 당신 쪽 확인을 남겨 두자. 위 규칙의 마지막 줄이 그 역할을 한다. 파괴적인 명령에 대한 권한 프롬프트도 켜 둔다.</p>

<p>페어 프로그래밍이라면 반대를 원할 수도 있다. 시작 전 한 줄 계획과 끝에 짧은 요약 같은 것. 그러면 CLAUDE.md에 그렇게 적는다. Opus 5.5는 어느 쪽이든 따른다.</p>

<h3 id="split-big-work-across-subagents">큰 일은 서브에이전트로 나누라고 하기</h3>

<p><strong>할 일.</strong> 큰 코드베이스 전체에 걸친 감사, 마이그레이션, 리뷰라면 Opus 5.5에게 일을 서브에이전트로 나누고 각 결과를 검사하라고 한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 초기 테스터들은 Opus 5.5가 긴 감사와 마이그레이션에서 병렬 서브에이전트를 거의 지켜보지 않은 채 조율하게 했다.</p>

<p><strong>방법.</strong></p>

<pre><code>Audit every service in services/ for the retry bug in the linked issue.
Give each service to its own subagent. When a subagent reports back, check its evidence before you accept it.
Finish with one table: service, affected yes or no, and the evidence.</code></pre>

<p class="meta">(번역) 링크한 이슈의 retry 버그에 대해 services/ 안의 모든 서비스를 감사해라. 서비스마다 전용 서브에이전트에 맡겨라. 서브에이전트가 보고하면 받아들이기 전에 증거를 검사해라. 표 하나로 마무리해라: 서비스, 영향 여부(yes/no), 증거.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/getting-the-most-out-of-opus-5-5/fig-c-subagents.png" alt="'서비스마다 전용 서브에이전트에 맡겨라'라는 제목의 다이어그램. 프롬프트 '링크한 이슈의 retry 버그에 대해 services/ 안의 모든 서비스를 감사해라'가 서브에이전트 네 개로 퍼져 나간다. 보고가 '증거를 검사해라' 단계(서브에이전트가 보고하면 받아들이기 전에 증거를 검사해라)에서 합쳐지고, 화살표가 '표 하나로 마무리'로 이어진다. 서비스, 영향 여부, 증거 열이 있는 빈 표.">
  <figcaption><b>FIG C</b>서브에이전트로 펼치고, 각각의 증거를 검사하고, 표 하나로 마무리한다.</figcaption>
</figure>

<h3 id="keep-the-task-list-in-a-file">작업 목록은 파일에 두기</h3>

<p><strong>할 일.</strong> 시간이 걸릴 실행이라면 Opus 5.5에게 작업 목록을 파일에 두고 진행하면서 갱신하라고 한다. 그런 다음 스크롤백이 아니라 그 파일을 읽어 실행이 어디쯤인지 본다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 이제 실행이 더 길다. 긴 실행은 컨텍스트 윈도우를 채우고, 그러면 Claude Code가 오래된 턴을 요약한다. 파일에 든 목록은 그걸 견디고, 무엇이 끝났고 무엇이 남았는지 한눈에 보여 준다.</p>

<p><strong>방법.</strong> "체크리스트를 TASKS.md에 둬라. 항목이 끝나면 체크하고, 새로 찾은 건 추가해라."</p>

<h2 id="checking-the-result">3. 결과 확인하기</h2>

<h3 id="read-what-it-needs-from-you-first">모델이 당신에게 필요로 하는 것부터 읽기</h3>

<p><strong>할 일.</strong> 긴 실행이 끝나면 먼저 Claude가 당신을 기다리고 있는 게 있는지 본다. 열어 둔 결정이나 승인을 원하는 변경 같은 것이다. 그다음 Claude 요약의 나머지를 읽는다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5는 Opus 5보다 자기 일을 더 분명하게 보고한다. 중간 업데이트와 최종 요약이 무엇을 했고, 무엇을 찾았고, 당신에게 무엇이 필요한지를 쉬운 말로 말한다.</p>

<p><strong>방법.</strong> 요약의 형식을 바꾸고 싶으면 CLAUDE.md에 적는다. 예를 들어 "모든 실행을 세 제목으로 끝내라: Blocked on me, Changed, Found."</p>

<h3 id="ask-it-to-review-the-code">코드 리뷰를 시키기</h3>

<p><strong>할 일.</strong> 사람이 보기 전에 Opus 5.5에게 diff나 pull request를 리뷰하라고 한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 한 초기 테스터는 가장 낮은 effort의 Opus 5.5가 high effort의 Opus 5보다 버그를 더 많이 잡으면서 오탐은 더 적었다고 했다. 변경을 쉬운 말로 설명하기도 해서, pull request 설명이 리뷰하기 더 편하다.</p>

<p><strong>방법.</strong> Claude에게 이 프롬프트를 준다.</p>

<pre><code>Review the diff on this branch against main.
List only problems you'd block the merge for. For each one, give the file and line, why it's wrong, and how to show it fails.</code></pre>

<p class="meta">(번역) 이 브랜치의 diff를 main과 비교해 리뷰해라. 머지를 막을 만한 문제만 나열해라. 각각에 대해 파일과 줄, 왜 틀렸는지, 실패를 어떻게 보여 줄 수 있는지 적어라.</p>

<h3 id="ask-it-to-mark-what-it-couldnt-confirm">확인하지 못한 것을 표시하라고 하기</h3>

<p><strong>할 일.</strong> 리서치와 분석에서는 찾지 못했거나 확인하지 못한 것을 말하라고 한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> "이건 찾지 못했다"는 읽을 가치가 있고, 그렇게 요청하면 찾기도 쉽다.</p>

<p><strong>방법.</strong> 요청에 "확인하지 못한 건 표시하고, 어디를 찾아봤는지 말해라"를 덧붙인다. Claude 리서치 보고서에서도, Claude Code에서도 통한다.</p>

<h2 id="in-claude-apps">4. Claude 앱에서</h2>

<p>먼저 모델 선택기가 Opus 5.5로 돼 있는지 확인한다.</p>

<h3 id="share-the-chart-or-screenshot-itself">차트나 스크린샷을 그대로 공유하기</h3>

<p><strong>할 일.</strong> 차트, 다이어그램, 스크린샷, 슬라이드를 첨부한다. 숫자를 다시 타이핑하지 않는다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5는 차트, 다이어그램, 스크린샷을 Opus 5보다 더 정확하게 읽고, 그러기 위해 추가 단계가 필요하지 않다. 이미지 안에서 사물이 어디 있는지에 달린 의미도 더 잘 읽는다. 화살표가 어느 상자들을 잇는지, 다이어그램 두 버전 사이에 무엇이 바뀌었는지, 캘린더 스크린샷에서 회의가 언제 시작해서 언제 끝나는지 같은 것이다.</p>

<p><strong>방법.</strong> 이미지를 첨부하고 구체적으로 묻는다: "이 서비스들 중 billing API를 직접 호출하는 건 어느 것인가?"</p>

<h3 id="ask-it-to-check-a-long-document">긴 문서를 점검하라고 하기</h3>

<p><strong>할 일.</strong> 긴 계획서, 보고서, 덱을 주고 실수를 찾으라고 한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5는 이전 Opus 모델들보다 디테일에 더 주의를 기울인다. 우리 테스트에서는 긴 계획 스레드에서 요일이 틀린 날짜를 잡았고, 덱에서 숫자와 맞지 않는 차트를 잡았다.</p>

<p><strong>방법.</strong> 이렇게 요청한다: "이 덱에서 서로 모순되는 것을 점검해라: 숫자, 날짜, 이름. 문제마다 인용하고 어디에 있는지 말해라."</p>

<h3 id="ask-for-the-finished-file">완성된 파일을 요청하기</h3>

<p><strong>할 일.</strong> 스프레드시트나 문서를 원하면 개요가 아니라 파일을 달라고 한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> Opus 5.5가 만든 스프레드시트와 문서는 공유하기 전에 손볼 게 Opus 5보다 적다.</p>

<p><strong>방법.</strong> "이걸 공유할 수 있는 스프레드시트로 만들어라: 벤더당 한 행, 열은 비용, 계약 종료일, 담당자."</p>

<h3 id="in-a-project-say-when-answers-are-settled">프로젝트에서는 답이 확정됐다고 말하기</h3>

<p><strong>할 일.</strong> 긴 대화에서 후속 질문이 느리게 느껴지면, 앞선 답은 확정된 것이라는 지시를 추가한다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 긴 대화에서 Opus 5.5는 짧은 후속 질문을 생각하면서 가끔 앞선 답을 다시 훑는다. 그게 답을 늦춘다.</p>

<p><strong>방법.</strong> 프로젝트 지시문에 아래를 추가한다.</p>

<pre><code>Once you have answered something, treat that answer as done. Focus on what I'm asking now, and don't go back over an earlier answer unless I ask about it or point out a problem with it.</code></pre>

<p class="meta">(번역) 한번 답한 것은 끝난 것으로 취급해라. 지금 묻는 것에 집중하고, 내가 다시 묻거나 문제를 지적하지 않는 한 앞선 답을 다시 훑지 마라.</p>

<p>긴 분석을 위한 프로젝트에서는 이 지시를 빼 둔다. 나중 단계가 앞선 단계의 실수를 드러낼 수 있기 때문이다.</p>

<h2 id="when-a-message-is-flagged">5. 메시지가 플래그됐을 때</h2>

<p>Opus 5.5는 Fable 수준의 생물·사이버 안전장치를 갖추고 출시된 첫 Opus 모델이다. Claude 앱과 Claude Code에서 플래그된 메시지는 대부분 더 오래된 모델로 옮겨지고, 작업은 거기서 이어진다. 소스 코드에서 보안 취약점을 찾는 일은 허용되며, 일상적인 건강·교육 질문도 여전히 동작해야 한다. 이 안전장치는 가끔 정당한 작업을 플래그할 수 있고, 우리는 잘못된 플래그를 줄이기 위해 조정하고 있다. 모델이 바뀌었다면 무엇이 보이고 무엇을 하면 되는지 아래에 적었다.</p>

<h3 id="flagged-in-claude-apps">Claude 앱에서</h3>

<p><strong>보이는 것.</strong> "Switched to"로 시작하고 더 오래된 모델 이름이 붙은 알림. Claude는 그 모델로 답하고, 대화는 그 모델에 머문다.</p>

<p><strong>할 일.</strong></p>

<ul>
<li>Opus 5.5로 돌아가려면 모델 선택기에서 고른다. 앞선 메시지가 대화에 아직 있으면 다시 플래그될 수 있다. 새 대화를 시작하면 그걸 피할 수 있다.</li>
<li>먼저 물어보게 하려면 Settings, 그다음 Capabilities로 가서 "Switch models when a message is flagged"를 끈다. 선택지가 담긴 "paused" 카드가 보일 것이다.</li>
</ul>

<p>검사는 파일과 검색 결과를 포함해 대화 안의 모든 것을 본다. 그래서 플래그가 마지막 메시지가 아니라 앞선 내용에서 올 수도 있다.</p>

<h3 id="flagged-in-claude-code">Claude Code에서</h3>

<p><strong>보이는 것.</strong> 더 오래된 모델 이름이 적힌 알림. 세션은 그 모델로 이어진다.</p>

<p><strong>할 일.</strong></p>

<ul>
<li><code>/model</code>을 실행해 되돌린다.</li>
<li>Esc를 두 번 눌러 마지막 메시지를 고치고 다시 시도한다.</li>
<li>먼저 물어보게 하려면 <code>/config</code>를 실행해 "Switch models when a message is flagged"를 바꾼다.</li>
<li>플래그가 틀렸다면 <code>/feedback</code>을 실행한다.</li>
</ul>

<h3 id="dont-ask-it-to-show-its-reasoning">답에 추론 과정을 보여 달라고 하지 않기</h3>

<p><strong>할 일.</strong> 내부 추론을 답에 그대로 재현하라는 요청을 프롬프트와 지시문에서 없앤다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> 내부 추론을 답에 재현하라는 요청은 거절될 수 있다. 플래그 범주 중 하나다.</p>

<p><strong>방법.</strong> 대신 필요한 것을 Claude에게 요청한다. 예를 들어 "이 접근을 고른 이유를 세 문장으로 설명해라."</p>

<h2 id="speed">6. 속도</h2>

<h3 id="turn-on-fast-mode">답을 하나씩 기다리고 있다면 fast mode 켜기</h3>

<p><strong>할 일.</strong> Claude Code에서 주고받는 작업, 즉 답을 하나 읽고 다음 메시지를 보내는 식의 작업에는 fast mode를 쓴다.</p>

<p><strong>Opus 5.5에서 중요한 이유.</strong> fast mode는 출시 시점부터 Opus 5.5에서 research preview로 쓸 수 있다. 같은 모델이고, 텍스트가 더 빨리 도착한다. 추가 사용량(extra usage)을 켜야 하고, 토큰당 비용이 standard mode보다 높다.</p>

<p><strong>방법.</strong> Claude에 <code>/fast</code>를 입력한다.</p>

<h2 id="your-opus-5-5-checklist">당신의 Opus 5.5 체크리스트</h2>

<p>다음 긴 작업 전에 이 목록을 훑어보자.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/getting-the-most-out-of-opus-5-5/fig-d-checklist.png" alt="체크박스 항목이 네 그룹(요청하기, Claude Code의 긴 실행, 확인하기, 플래그)으로 묶인 체크리스트 카드. 같은 항목이 아래에 텍스트로 나열돼 있다.">
  <figcaption><b>FIG D</b>체크리스트 한눈에 보기.</figcaption>
</figure>

<p><strong>요청하기</strong></p>
<ul>
<li>작업이 "완료"가 어떤 모습인지 말한다</li>
<li>프롬프트나 저장된 지시문에 "열심히 생각해라" 줄이 없다</li>
<li>디자인 요청은 빼야 할 스타일을 나열한다</li>
<li>차트와 스크린샷은 다시 타이핑하지 않고 첨부한다</li>
</ul>

<p><strong>Claude Code의 긴 실행</strong></p>
<ul>
<li>CLAUDE.md가 언제 멈추고 언제 계속 갈지, 그리고 파괴적인 일 앞에서는 멈추라고 말한다</li>
<li>파괴적인 명령에 대한 권한 프롬프트가 여전히 켜져 있다</li>
<li>큰 감사와 마이그레이션은 서브에이전트로 나뉜다</li>
<li>작업 목록은 파일에 둔다</li>
</ul>

<p><strong>확인하기</strong></p>
<ul>
<li>보고서의 "당신에게 필요한 것" 부분을 먼저 읽는다</li>
<li>사람이 리뷰하기 전에 리뷰 패스를 한 번 돌린다</li>
<li>리서치 답변은 확인하지 못한 것을 표시한다</li>
</ul>

<p><strong>플래그</strong></p>
<ul>
<li>되돌리는 법을 안다: 모델 선택기, 또는 <code>/model</code></li>
<li>"Switch models when a message is flagged"가 원하는 대로 설정돼 있다</li>
</ul>

<p><a href="https://www.anthropic.com/claude-opus-5-5">Opus 5.5</a>로 만들기 시작하자!</p>

<p><em>리뷰해 준 Molly Vorwerck에게 감사를 전한다.</em></p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
