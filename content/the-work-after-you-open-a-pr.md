---
slug: "the-work-after-you-open-a-pr"
title: "Claude Code로 출시까지: 실전 가이드"
nav: "PR 이후 작업을 /ship으로 · /code-review(effort low~max·--fix·ultra), /ship(커밋·PR·리뷰·최대 7일 watch, 규칙 파일·공개 저장소는 커밋 안 함), /steward로 기존 PR 돌보기, 신뢰하는 저장소에서만 watch, 같은 문제 3회 실패 시 작성자에게, CLAUDE.md·REVIEW.md·verify·steward 스킬, approvals.yml observe 모드→강제 전환"
main: "claude.dev"
cat: "Playbooks"
date: "2026-11-24"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  .table-wrap { overflow-x: auto; margin: 0 0 20px; }\n  .table-wrap table { margin: 0; min-width: 560px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure img.phone { max-width: 360px; display:block; margin: 0 auto; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 19951
---

<!-- rendered HTML -->
<header>
  <h1>Claude Code로 출시까지: 실전 가이드</h1>
  <div class="meta">
    2026년 11월 24일
    · 카테고리: Playbooks
    · 글쓴이: Addy Osmani (Member of Technical Staff)
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/the-work-after-you-open-a-pr/">A practical guide to shipping with Claude Code</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">풀 리퀘스트(PR)를 연 뒤의 후속 작업은 <code>/ship</code>으로 Claude Code에 넘기자. 몰입을 유지하도록 내 선호에 맞게 조정하는 방법을 정리했다.</p>

<p>풀 리퀘스트를 열고 나면 보통 후속 작업이 잔뜩 생긴다.</p>

<ul>
  <li>CI가 실패한다</li>
  <li>리뷰가 코멘트 여섯 개와 함께 돌아온다</li>
  <li>main을 머지하니 충돌이 난다</li>
</ul>

<p>하나하나는 아주 작은 일이지만, 매번 집중하던 일에서 나를 끌어낸다.</p>

<p>Claude Code 팀에서는 이런 후속 작업을 에이전트가 맡는 경우가 많다. 예를 들어 리뷰어가 찾은 문제를 에이전트가 집어 들어 처리하므로, 작성자가 돌아왔을 때는 PR이 이미 한 번 업데이트돼 있다.</p>

<p>내 경험상 이게 더 생산적이고 즐겁게 코딩하는 방식이다. 컨텍스트 전환을 최소화하고 몰입 상태를 유지해 준다.</p>

<p>Claude Code 팀이 코드 리뷰에 쓰는 프로세스는 <a href="https://claude.dev/blog/solving-code-review-at-anthropic/">여기</a>에서, 그 밑에 깔린 검증 프로세스는 <a href="https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/">여기</a>에서 이야기했다. <strong>이 글은 여러분의 저장소를 이렇게 일하도록 설정하는 방법에 관한 것</strong>으로, 최근 <a href="https://claude.com/resources/articles/introducing-claude-ship">Claude Ship 출시</a>와 함께 추가한 새 기능 일부를 활용한다.</p>

<p>대상은 팀이 GitHub에서 일하고 관리자 권한은 없는 개발자나 테크 리드다. 명령 몇 개만 실행하면 지금 바로 혼자서 시작할 수 있고, 알게 된 것은 저장소의 파일에 저장해 팀이 검토하게 하면 된다. 관리자는 팀이 팀 PR에 에이전트가 자동으로 이 일을 하길 원할 때만 개입하면 된다.</p>

<p>프로세스의 설계자는 여전히 여러분이다. 무엇을 만들지, 어떻게 만들지, 머지 기준이 무엇인지는 여러분이 정한다.</p>

<h2 id="the-post-pr-process">PR 이후의 프로세스</h2>

<p>PR을 연 다음에는 문제를 찾고, 문제를 해결하고, 마지막으로 변경을 머지해도 되는지 결정해야 한다.</p>

<p>Claude Ship은 이 일을 맡는 세 에이전트, Code Review, PR Steward(베타), Claude Approvals(베타)로 이뤄진다. Code Review는 정식 출시(GA)됐고, 나머지 둘은 베타다. <code>/ship</code>은 Claude Code에서 직접 실행해 내 풀 리퀘스트에 Claude Ship을 써 볼 수 있는 명령이다. 최신 버전 Claude Code에 포함돼 있고, 관리자가 에이전트를 하나도 켜기 전에도 동작한다. 앞의 두 단계는 오늘 당장 부분적으로 자동화할 수 있다. 마지막 단계는 브랜치 보호 규칙과 (팀이 도입한다면) 정책 파일에서 정하는 결정이다. Claude Ship에 포함된 세 에이전트로 나눠 보면 다음과 같다.</p>

<div class="table-wrap">
<table>
  <thead><tr><th>Claude에게 원하는 것</th><th>실행</th><th>실행 위치</th></tr></thead>
  <tbody>
    <tr><td>다른 사람이 보기 전에 버그 찾기</td><td><code>/code-review</code></td><td>내 세션</td></tr>
    <tr><td>PR을 열고, 리뷰하고, 돌아오는 피드백을 계속 처리하기</td><td><code>/ship</code></td><td>내 세션</td></tr>
    <tr><td>이미 연 PR 돌보기</td><td><code>/steward</code></td><td>내 세션</td></tr>
    <tr><td>팀 전체 PR에서 자동으로 이 일을 하기</td><td>Claude Ship</td><td>기본은 Anthropic 클라우드, 팀이 설정</td></tr>
  </tbody>
</table>
</div>

<h2 id="on-your-own-prs">내 PR에서</h2>

<h3 id="getting-started-today-with-code-review">오늘 바로 <code>/code-review</code>로 시작하기</h3>

<p>이 글에서 딱 하나만 한다면, push하기 전에 브랜치를 리뷰하자. 여기서 잡은 버그는 리뷰 코멘트나 실패한 검사(check)로 돌아와 다음 작업에서 나를 끌어낼 가능성이 줄어든다. Claude Code 프롬프트에서 이 명령을 입력한다.</p>

<pre><code>/code-review</code></pre>

<p>브랜치의 커밋과 아직 커밋하지 않은 변경을 정확성 버그 관점에서 리뷰한다. 알아 둘 만한 변형 몇 가지:</p>

<pre><code>/code-review high 1234       # PR 1234를 high effort로 리뷰
/code-review --fix           # 발견 사항을 작업 트리에 적용
/code-review --comment 1234  # 발견 사항을 PR에 게시
/code-review ultra           # 클라우드에서 더 깊은 리뷰 실행</code></pre>

<p>effort는 low부터 max까지 있다. low에서는 리뷰가 가장 확신하는 발견 사항만 보인다. 올릴수록 더 많이 보이고, 덜 확신하는 것도 일부 포함된다. Claude는 마지막으로 쓴 수준을 기억하므로, 위험도가 달라지면 다시 지정하자.</p>

<p>몇 가지 주의할 점:</p>

<ul>
  <li>ultra 설정은 특히 조심해서 쓰자. 클라우드에서 실행되고, claude.ai 로그인이 필요하며, 요금제와 별도로 과금될 수 있다. 써 보기 전에 <a href="https://code.claude.com/docs/en/ultrareview">ultrareview 문서</a>를 읽자.</li>
  <li>백그라운드 리뷰 중에 <code>--fix</code>가 만든 수정은 <code>/rewind</code>가 잡지 못할 수 있다. 쉽게 되돌리고 싶다면 먼저 커밋하자.</li>
  <li>로컬 <code>/code-review</code>는 <code>CLAUDE.md</code> 파일을 읽지만 <code>REVIEW.md</code>는 읽지 않는다. 이건 나중에 중요해진다.</li>
</ul>

<p>가장 먼저 할 일은 <code>/code-review</code>를 몇 번 돌려서 무엇을 잡고 어디서 틀리는지 파악하는 것이다. 이건 나중에 쓰인다.</p>

<h3 id="run-ship-for-your-next-pr">다음 PR에는 <code>/ship</code> 실행하기</h3>

<p>준비가 됐으면 이렇게 입력한다.</p>

<pre><code>/ship</code></pre>

<p>브랜치에 아직 PR이 없으면 <code>/ship</code>은 다음을 한다.</p>

<ol>
  <li>대기 중인 변경을 커밋한다. <code>git add -A</code>를 실행한 것처럼 동작하므로 <code>.gitignore</code>를 존중한다. 필요하면 브랜치를 만들고, 커밋 메시지는 내 세션을 써서 작성한다. 커밋 전에 알림이 오며, Esc를 눌러 중단할 수 있다.</li>
  <li>내 이름으로 push하고 PR을 만든다.</li>
  <li>커밋이 아직 Code Review로 리뷰되지 않았다면 <code>/code-review</code>로 코드 리뷰를 한다. 리뷰가 문제를 보고하면, 그중 타당하다고 판단한 것을 대신 고친다.</li>
  <li>최대 7일 동안 PR을 지켜본다(watch). 실패한 검사, 충돌, 리뷰 코멘트를 처리하고, PR이 머지되거나 닫히면 종료한다.</li>
</ol>

<p>첫 단계에서 <code>/ship</code>이 <code>git add -A</code>를 실행한 것처럼 대기 중인 변경을 커밋하는 동작은 종종 사람들을 놀라게 한다. <code>/ship</code>을 실행하기 전에 꼭 <code>git status</code>를 확인하자.</p>

<p>이 명령은 이름이 비밀 정보처럼 보이는 파일이나, <code>CLAUDE.md</code>, <code>REVIEW.md</code>, <code>.claude/</code>·<code>.github/</code> 디렉터리 안의 파일처럼 규칙을 정하는 파일을 건드리는 변경은 커밋하지 않는다. 이런 커밋은 미리 직접 해 둬야 한다.</p>

<p>또 공개(public) 저장소에서 작업 중이라면 이 명령은 어떤 변경도 대신 커밋하지 않는다. 진행하기 전에 대기 중인 변경을 직접 커밋해야 하고, PR이 이미 있다면 대기 중인 변경은 포함되지 않는다.</p>

<p><strong>선택: effort 수준, PR, 봇 지정하기</strong></p>

<pre><code>/ship high            # high effort로 실행
/ship 41              # 풀 리퀘스트 #41 작업
/ship +my-lint-bot    # my-lint-bot의 코멘트도 읽기
/ship stop            # watch 종료</code></pre>

<p>이 명령은 기본적으로 나, 쓰기 권한이 있는 사람, Claude GitHub App의 코멘트를 읽는다. 추가 봇은 <code>+name</code> 형식으로 지정할 수 있다. 그 봇이 코멘트를 달면, 코드와 대조해 확인할 주장(assertion)으로 취급한다.</p>

<h4 id="letting-claude-watch-the-pr">Claude에게 PR 지켜보기 맡기기</h4>

<p>Claude는 내 이름으로, 내 컴퓨터에서, 내 사용량(quota)을 써서 PR을 지켜본다. 노트북을 덮으면 멈추므로 세션을 열어 두고 컴퓨터가 잠들지 않게 하자. GitHub CLI에도 로그인돼 있어야 하고(먼저 <code>gh auth login</code> 실행), 내가 연 PR만 지켜본다.</p>

<p><a href="https://code.claude.com/docs/en/permission-modes">auto 모드</a>가 아니면 <a href="https://code.claude.com/docs/en/ship-command#what-claude-does-during-a-watch">watch</a>는 프롬프트마다 멈추고 내 응답을 기다린다. bypass-permissions 모드에서는 watch가 돌지 않는다. Windows에서는 <code>/ship</code>이 PR을 열고 리뷰까지는 하지만 watch는 시작되지 않는다는 점도 알아 두자.</p>

<p>watch에는 전용 체크아웃이 있어야 한다. 브랜치를 체크아웃한 상태로 둬야 하기 때문이다. 바로 다음 작업으로 넘어갈 생각이라면, 둘 중 하나는 별도 워크트리(worktree)에서 하자.</p>

<p>watch가 시작되지 못하면 Claude가 이유를 설명하지만, PR 리뷰는 그대로 한다. 예를 들어 저장소의 <code>.claude/settings.json</code>에 Bash용 <code>PreToolUse</code>나 <code>PermissionRequest</code> 훅이 있으면 watch를 돌릴 수 없다.</p>

<p>또 watch는 내가 자리를 비운 동안 모델 턴을 소모하므로, 요금제 사용량이나 API 청구액에 포함된다. 처음 쓸 때는 컴퓨터 근처에 있으면서 사용량이 예상 범위 안인지 확인하는 게 좋다.</p>

<h4 id="only-run-the-watch-on-repos-you-trust">신뢰하는 저장소에서만 watch 돌리기</h4>

<p>watch는 필요하면 base 브랜치를 내 브랜치에 머지한 다음, 테스트 같은 명령을 실행한다. 다시 말해 base 브랜치에 변경을 넣을 수 있는 사람이라면 누구든 watch 중에 내 컴퓨터에서 명령을 실행할 수 있다. <strong>base 브랜치에 변경을 넣을 수 있는 모든 사람을 신뢰하는 저장소에서만 로컬 watch를 돌리자.</strong></p>

<p>Claude는 PR을 절대 머지하지 말라는 지시를 받고, Claude Code도 무인 턴 동안 실행할 수 있는 gh·git 명령을 제한해 직접 머지나 force-push를 막는다. watch가 만드는 커밋 역시 규칙을 정하는 파일은 빼놓는다. <code>.github/</code>, <code>CODEOWNERS</code>, <code>CLAUDE.md</code>, <code>.claude/</code>, git 훅 등이다.</p>

<p>하지만 이것이 모든 경로를 막아 주지는 않는다. 예를 들어 테스트 스크립트도 내 자격 증명으로 실행되고, 턴 중에 내가 메시지를 입력하면 그 턴에는 제한이 풀릴 수 있다. 또 auto-merge가 켜져 있다면, watch가 만든 수정이 GitHub가 머지하도록 허용하는 결정적 계기가 될 수도 있다.</p>

<p>게다가 watch 중에 Claude가 하는 커밋과 push는 저장소의 git 훅 영향을 받지 않으므로, 반드시 있어야 하는 검사는 CI와 브랜치 규칙에 넣어 두자.</p>

<p>watch의 전체 약관은 처음 쓰기 전에 제품에서 <code>/ship terms</code>를 실행해 확인하자.</p>

<h3 id="steward-for-existing-prs">이미 있는 PR에는 <code>/steward</code></h3>

<p>많은 PR은 리뷰가 더 필요하지 않고, 머지까지 끌고 갈 누군가가 필요할 뿐이다. 그런 PR이 있으면 브랜치를 체크아웃하고 다음을 실행한다.</p>

<pre><code>/steward 41</code></pre>

<p><code>/ship</code>의 watch 부분만 실행한다. 내가 연 PR을 지켜보면서, 먼저 리뷰하지 않고 실패한 검사 고치기, 충돌 해결, 코멘트 처리 같은 일을 한다.</p>

<p>PR 번호를 지정하지 않으면 현재 브랜치의 PR을 지켜본다. 같은 <code>+name</code> 봇 지정을 받고, 앞의 주의 사항도 똑같이 적용된다.</p>

<p>다만 PR에 이미 Steward 라벨이 붙어 있으면 로컬 watch를 돌리지 않는다. 그리고 watch를 돌릴 수 없으면 <code>/steward</code>는 아무것도 하지 않는다.</p>

<p>watch를 멈추려면 <code>/steward stop</code>이나 <code>/ship stop</code> 중 아무거나 쓰면 된다. 세션 하나에서는 watch를 한 번에 하나만 돌릴 수 있으므로, 새로 시작하면 이전 watch는 종료된다.</p>

<p><code>/steward</code>를 PR Steward와 헷갈리지 말자. PR Steward는 관리자가 켠 뒤 <code>claude[bot]</code>으로 실행되는 팀 서비스다. <code>/steward</code> 명령은 내 이름으로, 내 세션에서 실행된다.</p>

<p>검사가 빨갛게 실패한 PR이 시작하기 좋은 대상이다. 충돌 루프에 갇힌 PR도 좋은 후보다. 반대로 설계 논쟁이 한창인 PR은 나쁜 대상이다. 그 논쟁은 내가 정리해야 하기 때문이다.</p>

<h3 id="claude-escalates-bigger-calls-to-you">큰 결정은 Claude가 나에게 넘긴다</h3>

<p>watch의 일부로, Claude는 작은 변경은 직접 하고 큰 변경은 위로 올리라는 지시를 받는다. 예를 들면 이런 것들이다.</p>

<ul>
  <li>새 API나 더 큰 범위처럼 무언가를 다시 설계해 달라는 요청</li>
  <li>해결하지 못한 보안 문제</li>
</ul>

<p>또 한 가지 문제에 대해 최대 3번까지만 push하고, 그다음에는 시도한 해결책들을 보고한다.</p>

<p>이는 <a href="https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/">검증 블로그 글</a>에서 한 주장과 대체로 같다. 같은 검사를 계속 돌리는데 세 번째 라운드 뒤에도 계속 실패한다면, 아마 접근 방식이 틀린 것이다.</p>

<p>이 시점에서 Claude는 코드 작성자에게 문제를 넘긴다.</p>

<h2 id="in-your-repo">내 저장소에서</h2>

<p>PR을 몇 개 거치고 나면 패턴이 보이기 시작한다. 예를 들어:</p>

<ul>
  <li>같은 리뷰어의 같은 코멘트</li>
  <li>Claude가 매번 알아내야 하는 설정 방법</li>
  <li>불안정한(flaky) 검사</li>
</ul>

<p>이런 것들을 팀을 위해 적어 두기 시작할 수 있다. 어느 도구가 읽어야 하느냐에 따라 몇 가지 파일 중 하나에 적는다.</p>

<div class="table-wrap">
<table>
  <thead><tr><th>반복되는 것</th><th>적을 곳</th><th>읽는 도구</th></tr></thead>
  <tbody>
    <tr><td>코드가 따라야 할 관례</td><td><code>CLAUDE.md</code></td><td>Claude Code, 로컬 <code>/code-review</code>, Code Review, PR Steward</td></tr>
    <tr><td>PR을 어떻게 리뷰할지에 대한 규칙</td><td><code>REVIEW.md</code></td><td>Code Review와 PR Steward (로컬 <code>/code-review</code>는 아님)</td></tr>
    <tr><td>앱을 띄우고 실제로 써 보는 방법</td><td><code>.claude/skills/verify/SKILL.md</code></td><td>변경을 검증할 때의 Claude Code</td></tr>
    <tr><td>이 저장소의 PR을 돌보는 방법</td><td><code>.claude/skills/steward/SKILL.md</code></td><td><code>/ship</code>, <code>/steward</code>, PR Steward</td></tr>
  </tbody>
</table>
</div>

<h3 id="repeat-comments-become-review-rules">반복되는 코멘트는 리뷰 규칙으로</h3>

<p>동료에게 새 쿼리에 테넌트(tenant) 검사가 들어갔는지 확인하라는 요청을 두 번 받았다고 해 보자. 로컬 리뷰를 쓴다면 <code>/ship</code>이 리뷰에 <code>/code-review</code>를 쓰므로 이 내용을 <code>CLAUDE.md</code>에 적으면 된다. 저장소에 Code Review가 켜져 있다면, 리뷰 전용 규칙을 루트 <code>REVIEW.md</code>에 적을 수 있다.</p>

<pre><code># Review instructions

## What Important means here
Wrong results, leaked data or anything that blocks a rollback.
Style and naming are Nit at most.

## Always check
- Database queries are scoped to the caller's tenant.
- New API routes have an integration test.

## Keep it quiet
- Report at most five Nits.
- Skip generated files and lockfiles.
- Behavior claims need a file and line.</code></pre>

<p class="callout">(번역 참고) 위 예시의 뜻: <strong>Important의 기준</strong>은 잘못된 결과, 유출된 데이터, 롤백을 막는 모든 것이며 스타일과 이름은 기껏해야 Nit다. <strong>항상 확인할 것</strong>: 데이터베이스 쿼리는 호출자의 테넌트로 범위가 제한돼야 하고, 새 API 라우트에는 통합 테스트가 있어야 한다. <strong>조용히 하기</strong>: Nit은 최대 다섯 개만 보고하고, 생성 파일과 lockfile은 건너뛰며, 동작에 대한 주장에는 파일과 줄 번호가 필요하다.</p>

<p>Code Review는 리뷰 중인 PR에 들어 있는 <code>REVIEW.md</code> 파일은 읽지 않는다. 또 경로 제외나 nit 개수 제한 같은 일부 지시는 기본 브랜치가 보호돼 있을 때만 따른다.</p>

<p>모든 코멘트를 규칙으로 올릴 필요는 없다. 우리 팀에는 패턴이 최소 2개 PR에서 반복돼야 규칙 후보로 본다는 원칙이 있다. 그다음 규칙을 추가하는 PR을 사람이 승인한다. 도입하기 좋은 기준이다. 필요하면 규칙을 지우는 것도 해야 한다.</p>

<h3 id="repeat-setup-becomes-verify-skills">반복되는 설정은 verify 스킬로</h3>

<p>앱을 띄우고 특정 페이지로 가는 방법을 Claude에게 계속 알려 주고 있다면, 그냥 적어 두자. <code>.claude/skills/verify/SKILL.md</code>를 만든다. 루트에 둬도 되고 해당 코드의 디렉터리에 둬도 된다.</p>

<pre><code>---
name: verify
description: Run the web app and exercise a change end to end. Use before committing.
---

1. Start the stack with npm run dev:stack.
2. Wait for /healthz on port 3000 to return 200.
3. Sign in with the seeded test account.
4. Exercise the changed flow in the browser and take a screenshot.
5. Report the steps you ran and what you saw. Don't report success without them.</code></pre>

<p class="callout">(번역 참고) 위 예시의 뜻: 웹 앱을 실행해 변경을 끝에서 끝까지 확인하며, 커밋 전에 쓴다. ① <code>npm run dev:stack</code>으로 스택을 띄운다. ② 3000번 포트의 <code>/healthz</code>가 200을 돌려줄 때까지 기다린다. ③ 시드된 테스트 계정으로 로그인한다. ④ 브라우저에서 바뀐 흐름을 직접 써 보고 스크린샷을 찍는다. ⑤ 실행한 단계와 본 것을 보고한다. 그것 없이 성공이라고 보고하지 않는다.</p>

<p>명령은 꼭 내 환경에 맞게 바꾸자.</p>

<p>Claude에게 몇 번 실행시켜 보고, 불안정한 동작은 고치자. 사람들은 믿지 못하는 검증은 무시한다.</p>

<h3 id="repeat-pr-maintenance-becomes-steward-rules">반복되는 PR 관리는 steward 규칙으로</h3>

<p>이건 놓치기 쉽다. 로컬 watch는 작업 디렉터리의 <code>.claude/skills/steward/SKILL.md</code> 파일을 읽는다.</p>

<p>Anthropic 클라우드에서 실행되는 PR Steward는 기본 브랜치에서 이 파일을 읽는다.</p>

<pre><code>---
name: steward
description: House rules for looking after PRs in this repository
user-invocable: false
disable-model-invocation: true
---

- Regenerate the lockfile with npm install; don't edit it by hand.
- `e2e-nightly` is flaky. Re-run it once before looking for a cause.
- Run npm test and npm run lint before pushing a fix.
- Leave comments about API design to the author.</code></pre>

<p class="callout">(번역 참고) 위 예시의 뜻: 이 저장소에서 PR을 돌볼 때의 규칙. lockfile은 손으로 고치지 말고 <code>npm install</code>로 다시 생성한다. <code>e2e-nightly</code>는 불안정하니 원인을 찾기 전에 한 번 다시 돌린다. 수정을 push하기 전에 <code>npm test</code>와 <code>npm run lint</code>를 실행한다. API 설계에 관한 코멘트는 작성자에게 맡긴다.</p>

<p>위 예시에서 두 설정은 이 스킬을 / 메뉴에서 숨기고, Claude가 스스로 고르는 스킬 목록에서도 빼 준다.</p>

<p>steward 파일로 watch의 제한을 바꿀 수는 없다. 하지만 저장소에 머지할 수 있는 사람이면 누구나 이 파일을 고칠 수 있으므로, 이 파일의 변경은 CI 변경을 리뷰하듯 신중하게 리뷰하자.</p>

<p>나중에 팀이 PR Steward를 켜면, 이 지침이 기본 브랜치에 들어간 시점부터 Anthropic 클라우드에서도 적용된다.</p>

<h2 id="across-your-teams-prs">팀 전체 PR에서</h2>

<h3 id="standardizing-the-post-pr-process">PR 이후 프로세스 표준화하기</h3>

<p>내 PR 몇 개에서 <code>/ship</code>을 돌려 보고 나면, Claude Ship이 팀 전체 PR에서 무엇을 할 수 있을지 감이 잘 잡힌다. 이 글의 나머지는 관리자와 나눌 그 대화를 위한 것이다. 무엇을 요청할지, 그리고 어떻게 안전하게 도입할지.</p>

<p><a href="https://code.claude.com/docs/en/claude-ship#who-can-use-claude-ship">시작하려면</a> 관리자에게 저장소 하나, 자원자 몇 명, 그리고 내 풀 리퀘스트에서 Claude Ship을 시험해 볼 제한된 기간을 요청하면 된다.</p>

<ol>
  <li><strong>예산 제약을 미리 합의한다.</strong></li>
  <li><strong>저장소의 기본 브랜치를 보호한다.</strong> 저장소 관리자가 이 요구 사항을 설정할 수 있다. 모든 업데이트가 최신 push에 대한 승인이 있는 PR을 거치도록 하고, Claude GitHub App이 우회(bypass) 목록에 없도록 한다.</li>
  <li><strong>이 저장소에 Code Review를 켠다.</strong> Claude 조직의 관리자 역할인 Owner가 Code Review를 켤 수 있다.</li>
  <li><strong>PR Steward를 Manual 모드로 켠다.</strong> 같은 Owner가 PR Steward를 켜서, 쓰기 권한이 있는 사용자가 <code>@claude steward</code>라고 코멘트하거나 작성자가 자동 시작에 동의(opt-in)했을 때 동작하게 할 수 있다. Steward를 멈추려면 <code>@claude stop</code>이라고 코멘트한다.</li>
  <li><strong>observe 모드 승인 정책을 만든다.</strong> 이 파일은 다른 파일과 똑같이 취급되므로 내 PR에서 만들 수 있다. 하지만 이 파일을 머지하면 저장소에 Approvals가 켜지므로, 먼저 Owner와 협의하자.</li>
</ol>

<p>PR Steward는 풀 리퀘스트를 승인하거나 머지하지 않도록 설계돼 있으므로, 머지 전에 원하는 승인을 브랜치 보호로 반드시 요구하자.</p>

<p>PR Steward는 리뷰어의 코멘트를 읽고 그에 따라 일부 행동을 한다. 텍스트를 해석하는 모든 에이전트가 그렇듯, 사람들이 하는 말에 속을 수 있다. 신뢰할 수 있는 협업자가 있는 저장소에서만 쓰고, 신뢰할 수 없는 사용자의 코멘트에 따라 PR Steward가 한 변경은 확인하자.</p>

<h3 id="configure-your-first-approval-policy">첫 승인 정책 구성하기</h3>

<p>승인 정책은 Claude Approvals가 기본 브랜치의 <code>.claude/approvals.yml</code> 파일에서 읽는다. 간단한 첫 정책은 이렇게 생길 수 있다.</p>

<pre><code># .claude/approvals.yml
version: 1
mode: observe
rules:
  - purpose: "A change takes two people."
    paths: ["**"]
    verdict: { claude: comments, seats: 2 }
    advisory: [claude/code_review]
  - purpose: "A change to the review rules takes two people."
    paths: ["**/.claude/**", "**/REVIEW.md", "**/CLAUDE.md", "**/CODEOWNERS", ".github/**"]
    nested: inherit
    verdict: { claude: comments, seats: 2 }</code></pre>

<p class="callout">(번역 참고) 두 규칙의 <code>purpose</code>는 각각 “변경에는 두 사람이 필요하다”, “리뷰 규칙을 바꾸는 변경에는 두 사람이 필요하다”는 뜻이다.</p>

<p><code>seats</code>는 승인해야 하는 사람 수이고, 작성자도 그중 한 자리를 채울 수 있다.</p>

<p>한 가지 함정이 있다. watch가 base 브랜치를 머지하고 나면 가장 최근 커밋은 머지 커밋이 되는데, 그 커밋에는 작성자 자리에 앉을 사람이 없다. 그래서 PR 작성자가 <code>@claude approve</code>라고 코멘트해야 한다.</p>

<p>규칙의 판정(verdict)이 <code>claude: comments</code>이면 Claude는 승인하지 않는다. 여러 규칙이 일치하면 가장 엄격한 규칙이 이긴다. observe 모드에서 검사는 자신이 어떻게 결정했을지만 알려 준다. Claude는 아무것도 승인하지 않는다.</p>

<p>advisory 줄은 빼지 말자. 정책 파일이 기본 브랜치에 들어가면, Code Review는 자신을 지정한 규칙에 일치하는 PR에서만 자동으로 시작된다. 그 줄이 없으면 자동 리뷰가 그냥 멈춘다. advisory 리뷰는 판정을 바꾸지 않으며, 이미 가진 설정 그대로 실행된다. Code Review를 지정한 정책은 Code Review가 꺼진 곳에서도 과금되는 리뷰를 시작할 수 있다.</p>

<p>Claude 리뷰를 통과했을 때 어떤 경로의 요구 조건을 낮출 수 있는지 보고 싶다면, advisory 줄을 override로 바꾸고 규칙의 purpose도 그에 맞게 고치자. 예를 들어 “Claude의 리뷰를 통과하면 한 명이면 충분하고 Claude가 승인한다(When Claude's review passes, one is enough and Claude approves.)”처럼.</p>

<pre><code>    override:
      - { if: "claude/code_review = pass", verdict: { claude: approves, seats: 1 } }</code></pre>

<p>override도 Code Review를 지정하므로, 해당 풀 리퀘스트는 여전히 자동 리뷰를 받는다. 리뷰가 통과하면 override가 규칙의 결정을 한 자리 + Claude의 승인으로 바꾼다. 작성자가 그 한 자리를 채울 수 있으므로, 이제 검사는 Claude가 승인했을 것이라고 보고할 수 있다. 하지만 풀 리퀘스트 안의 텍스트가 Claude의 리뷰를 흔들 수 있고, 그런 일이 생기면 이 override는 그 풀 리퀘스트에 필요한 조건을 낮춰 버린다.</p>

<p>항상 사람이 필요해야 하는 경로가 있다면, override 없는 규칙에 넣자(다음 절 1단계). 이걸 머지하기 전에 예산 담당자에게 알리자. <strong>이런 식으로 Claude의 리뷰를 쓰는 정책은 observe 모드에서도 Code Review 과금을 시작한다.</strong> Code Review 설정과 상관없이, push할 때마다 과금될 수 있다.</p>

<p>“이 PR이 마이그레이션과 관련 있나?” 같은 질문을 위한 분류기(classifier)를 직접 만들 수도 있다. <a href="https://code.claude.com/docs/en/approvals-classifiers#add-a-custom-classifier">커스텀 분류기</a>는 기본 브랜치의 <code>.claude/classifiers/&lt;name&gt;/def.yml</code>에 두며, observe 모드에서도 실행할 때마다 과금된다. 처음에는 경로와 Code Review 결과에 집중하자.</p>

<h3 id="monitoring-and-transitioning-to-enforcement">모니터링하고 강제(enforcement)로 전환하기</h3>

<p>우리 팀은 내부 커밋 게이트에도 observe 모드와 같은 프로세스를 쓴다. observe 모드에서 자신이 내렸을 결정을 기록하므로, 의무화하기 전에 오탐(false positive)을 분석할 수 있다. 결정은 Claude Approvals 검사와 거기 딸린 코멘트에서 볼 수 있다.</p>

<p>observe 모드의 가치는 실제로 모니터링할 때만 얻을 수 있다는 점을 명심하자. 도입하고 1~2주가 지나면, 머지된 PR을 다시 보면서 정책의 결정이 리뷰어들의 실제 행동과 어떻게 비교되는지 살펴보자.</p>

<p>처음 두 행은 override를 추가한 뒤에 해당한다.</p>

<div class="table-wrap">
<table>
  <thead><tr><th>정책의 판단</th><th>리뷰어들</th><th>할 일</th></tr></thead>
  <tbody>
    <tr><td>승인했을 것</td><td>덧붙일 말 없이 승인</td><td>규칙 유지</td></tr>
    <tr><td>승인했을 것</td><td>변경 요청</td><td>사람이 필요한 경로 규칙을 추가하거나, 리뷰가 잡았어야 했다면 <code>REVIEW.md</code> 수정</td></tr>
    <tr><td>두 사람 필요</td><td>매번 한눈에 보고 승인</td><td>예시를 충분히 본 뒤 규칙 범위를 좁히는 것을 고려</td></tr>
    <tr><td>두 사람 필요</td><td>실제로 질문이 있었음</td><td>규칙 유지</td></tr>
  </tbody>
</table>
</div>

<p>예시 PR 몇 개를 살펴보자. 나라면 어떻게 결정했을까? 어떤 규칙이 결정을 내렸나? 무엇을 바꾸겠나? 두 번째 행에 가장 주의를 기울이고, 규칙을 완화하기 전에 그것부터 고치자.</p>

<p>강제하기 전에 알아 둘 것 하나: Claude의 승인은 GitHub에서 실제 승인으로 집계된다. ruleset이 승인 하나만 요구한다면 Claude의 승인만으로 충분할 수 있다. 그러니 정책과 브랜치 규칙을 함께 읽자.</p>

<p>auto-merge를 쓰고, (위의 override처럼) 작성자만으로 채울 수 있는 정책이 있다면, 아무도 아무것도 하지 않았는데 머지되는 PR이 생길 수 있다. 경로마다 그게 괜찮은지 명시적으로 결정하고 적어 두자.</p>

<p>그다음 이 순서로 잠근다.</p>

<ol>
  <li>
    <p>항상 다른 사람의 눈이 한 번 더 필요한 경로에는 if나 override가 없는 규칙을 쓴다. 어떤 분류기 결과도 이를 뒤집을 수 없고, <code>nested: inherit</code>가 자체 정책을 가진 하위 디렉터리까지 이 규칙을 이어 준다.</p>
<pre><code>  - purpose: "Auth, billing and CI take a person who isn't an author."
    paths: ["src/auth/**", "src/billing/**", ".github/**"]
    nested: inherit
    verdict:
      claude: comments
      seats: [{ count: 1, from: [humans, "!pr/authors"] }]</code></pre>
    <p class="callout">(번역 참고) <code>purpose</code>는 “인증, 결제, CI에는 작성자가 아닌 사람이 필요하다”는 뜻이다.</p>
  </li>
  <li><code>mode: observe</code>를 지우고 머지한다. 이제 규칙이 승인한다고 정한 곳에서는 Claude가 승인할 수 있다.</li>
  <li>약 5분 뒤, 열린 PR에 <code>@claude approvals rerun</code>이라고 코멘트해 오래된 결과를 정리한다. 재실행하면 분류기 요금이 다시 청구될 수 있다.</li>
  <li>저장소 관리자에게 Claude Approvals 검사를 필수(required)로 만들고, 그 출처로 Claude 앱을 지정해 달라고 요청한다. 그 전까지는 검사 결과와 상관없이 PR이 머지될 수 있다.</li>
</ol>

<p>Claude Ship과 로컬 명령은 AI를 쓰므로 버그, 보안 문제, 그 밖의 이슈를 놓칠 수 있다. 기존 테스트, 스캐너, 리뷰어는 모두 유지하자.</p>

<h2 id="things-to-try-this-week">이번 주에 해 볼 것</h2>

<p>분명히 해 두고 싶은 것이 있다. Claude Code 팀에서는 에이전트를 호출한 사람이 변경에 책임을 진다. 마치 그 사람이 직접 타이핑한 것처럼.</p>

<p>PR 범위, 설계, 근거, 그리고 언제 머지할 수 있는지에 대한 규칙은 여전히 여러분의 팀이 책임져야 한다. 이 원칙을 염두에 두고, 시작할 수 있는 곳은 이렇다.</p>

<ol>
  <li><strong>오늘:</strong> 현재 브랜치에서 <code>/code-review</code>를 실행한다. 무엇을 틀렸고 무엇을 놓쳤는지 메모한다.</li>
  <li><strong>다음 PR:</strong> 머지할 수 있는 모든 사람을 신뢰하는 저장소에서 <code>/ship</code>을 써 보고, 자리를 지킨다. 다른 터미널과 git 체크아웃에서 기존 PR에 <code>/steward</code>를 써 본다.</li>
  <li><strong>금요일까지:</strong> 가장 많이 반복한 규칙을 <code>CLAUDE.md</code>, <code>REVIEW.md</code>, 또는 스킬에 담은 작은 PR을 만든다. <code>/ship</code>은 규칙 파일을 커밋하지 않으므로 커밋은 직접 한다. 그 PR과 observe 모드 정책 예시를 팀과 공유한다.</li>
</ol>

<p>그렇게 해 본다면, 어떤 규칙 파일이 가장 효과가 컸는지, 그리고 어떤 일은 계속 직접 하기로 했는지 꼭 듣고 싶다.</p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
