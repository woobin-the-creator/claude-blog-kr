---
slug: "claude-code-in-the-cloud"
title: "클라우드에서 쓰는 Claude Code: 클라우드 세션 현장 가이드"
nav: "Claude Code 클라우드 세션 현장 가이드 · 작업마다 VM 하나, 병렬 워크플로우 7가지, GitHub 연결 한 번에 성공하기"
main: "claude.dev"
cat: "Playbooks"
date: "2026-10-06"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  .table-wrap { overflow-x: auto; margin: 0 0 20px; }\n  .table-wrap table { margin: 0; min-width: 560px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure img.phone { max-width: 360px; display:block; margin: 0 auto; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 28603
---

<!-- rendered HTML -->
<header>
  <h1>클라우드에서 쓰는 Claude Code: 클라우드 세션 현장 가이드</h1>
  <div class="meta">
    2026년 10월 6일
    · 카테고리: Playbooks
    · 글쓴이: Addy Osmani
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/claude-code-in-the-cloud">Claude Code in the cloud: a field guide to cloud sessions</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Claude Code가 자기만의 머신에서 돌아가면 무엇이 달라지는지, 그게 빛을 발하는 워크플로우는 무엇인지, 그리고 GitHub 연결을 한 번에 성공시키는 방법.</p>

<p>여러분은 아마 자기 노트북의 터미널에서 Claude Code를 실행할 것이다. 그 세션은 세 가지 면에서 노트북에 묶여 있다.</p>

<ul>
  <li>작업 트리(working tree)를 공유한다. 그래서 한 저장소에서 세션 두 개를 돌리면 같은 파일을 고치고 같은 포트를 두고 다툴 수 있다.</li>
  <li>여러분의 자격 증명(credential)으로 실행된다.</li>
  <li>컴퓨터가 잠들거나 Wi-Fi가 끊기면 멈춘다.</li>
</ul>

<p><a href="https://code.claude.com/docs/en/claude-code-on-the-web">클라우드 세션(cloud session)</a>은 Claude Code를 자기만의 머신에서 실행한다. 작업마다 새 가상 머신(VM)이 하나씩 주어지고, 거기에 여러분의 저장소가 새 브랜치로 clone되어 있으며, 환경 설정(setup)도 이미 끝나 있다.</p>

<p>클라우드 세션은 <a href="https://code.claude.com/docs/en/web-quickstart">claude.ai/code</a>, <a href="https://code.claude.com/docs/en/mobile">Claude 모바일 앱</a>, <a href="https://code.claude.com/docs/en/desktop#run-long-running-tasks-in-the-cloud">데스크톱 앱</a>, <a href="https://code.claude.com/docs/en/claude-code-on-the-web#from-terminal-to-cloud">터미널</a>, 그리고 <a href="https://code.claude.com/docs/en/slack">Slack</a>에서 시작할 수 있다. 그 뒤에는 브라우저, 모바일 앱, 데스크톱에서 진행 상황을 따라갈 수 있다. 작업이 끝나면 결과는 브랜치에 남고, 그 브랜치를 pull request로 만들 수 있다.</p>

<p>클라우드 세션은 Pro, Max, Team, Enterprise 플랜에 추가 비용 없이 포함된다. 클라우드 머신에 대한 별도 요금은 없고, 세션은 Claude Code의 나머지 기능과 같은 사용량 한도(usage limit)를 쓴다. 플랜에 따라서는 조직 소유자(owner)가 먼저 <a href="https://claude.ai/admin-settings/claude-code">클라우드 세션을 켜야</a> 할 수도 있다.</p>

<div class="callout">
<p><strong>클라우드 세션 보너스 크레딧.</strong> 기존 개인 Pro·Max 구독자는 플랜 한도와 별도로 클라우드 세션용 일회성 보너스 크레딧을 받을 수 있다. Pro는 $100, Max는 $250이다. 10월 7일까지 claude.ai/code/claim-credit에서, 또는 Claude Code 안에서 <code>/claim-credit</code>으로 받을 수 있다. 크레딧은 11월 4일에 만료된다. 다 쓰거나 만료되면 플랜의 일반 사용량이 적용된다. Projects나 Routines에는 쓸 수 없다. <a href="https://www.anthropic.com/legal/promotion-credit-terms">프로모션 크레딧 제공 약관(Promotional Credit Offer Terms)</a>을 참고하자.</p>
</div>

<p>이 가이드를 위해 나는 작은 샘플 저장소를 대상으로 실제 클라우드 세션 네 개를 돌렸다. 그 세션들의 기록(transcript), diff, 소요 시간이 글 곳곳에 나온다. 저장소와 스크린샷 속 사용자는 가상이다. 하지만 작업, 출력, 숫자는 그 세션들에서 나온 것이다.</p>

<p>클라우드 세션의 주요 장점 하나는 여러 작업을 서로 방해하지 않고 동시에 돌릴 수 있다는 것이다. 아래는 내가 16초 안에 연달아 시작한 세션 세 개로, 각각 자기 머신에서 돌아갔다. 내 노트북에서였다면 이것들을 하나씩 차례로 돌리거나, 서로 부딪히지 않게 챙기느라 시간을 썼을 것이다.</p>

<figure>
  <video controls muted playsinline loop preload="metadata" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-a-timeline.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-a-poster.png" aria-label="VM 세 개에서 16초 안에 연달아 시작된 클라우드 세션 세 개의 타임라인. 빗금 친 설정 막대 뒤로, 불안정한 테스트 수정은 65초에 스위트 40회 실행·실패 0으로 끝나고, 문서 재작성은 62초에 문서 오류 5건 수정으로, 구조화 로깅 변경은 87초에 JSON 로그와 새 테스트 5개로 끝난다."></video>
  <figcaption><b>FIG A</b>한 저장소에서 돌린 클라우드 세션 세 개의 실제 타임라인. 첫 시작 시점부터 초 단위. 빗금 친 막대는 샘플 저장소를 다시 만드는 설정 단계이고(보통은 GitHub clone이 이 자리를 대신한다), 점 하나는 도구 호출(tool call) 하나다.</figcaption>
</figure>

<h2 id="three-tasks-one-repository-three-machines">작업 셋, 저장소 하나, 머신 셋</h2>

<p>샘플 저장소는 <strong>tidepool</strong>로, 가상의 항구 세 곳의 조수(tide)를 예측하는 작은 Node API다. 여기에는 흔한 문제 세 가지가 있었다. 테스트 하나가 네 번에 한 번꼴로 실패했고, API 문서가 코드에서 더는 읽지 않는 매개변수를 설명하고 있었으며, 로거(logger)가 문자열을 이어 붙여 로그 줄을 만들고 있었다.</p>

<p>나는 문제당 하나씩, 클라우드 세션 세 개를 16초 안에 시작했다. 프로그램으로 시작했고, tidepool이 GitHub에 없어서 각 세션은 먼저 프롬프트에 담긴 파일로 저장소를 다시 만들었다. 실제 저장소라면 이 단계는 건너뛰고, 터미널에서는 세션 하나가 <code>claude --cloud</code> 명령 하나다. 줄여 쓰면 세 프롬프트는 이랬다.</p>

<pre><code>claude --cloud "npm test fails maybe one run in four. Find the flaky test, fix the root cause in the code (not the test), and prove it by running the suite at least 30 times in a row."
claude --cloud "docs/API.md is out of date with src/server.js. Rewrite it so every endpoint, parameter, default and response shape matches the code. Start the server and run each curl example to check it."
claude --cloud "Make src/logger.js emit one JSON object per line, keep LOG_LEVEL, and log method, path, status and duration_ms as fields. Add a test for the logger."</code></pre>

<p>세션은 각각 61초, 65초, 72초 동안 돌았고, 첫 세션이 시작된 지 87초 만에 셋 다 끝났다. 저장소를 다시 만드는 데 각 실행의 대략 3분의 1에서 절반 남짓이 들었다. 결과는 이렇다.</p>

<ul>
  <li><strong>불안정한(flaky) 테스트.</strong> Claude는 <code>TtlCache.get</code>에서 경쟁 조건(race)을 찾았다. 캐시는 로더(loader)가 끝난 뒤에야 값을 저장했기 때문에, 로드 중에 같은 키로 두 번째 <code>get</code>이 오면 로더를 또 호출했다. Claude는 캐시가 진행 중인 promise를 저장하도록 바꾸고, 로드가 실패하면 항목을 지우게 했으며, <code>npm test</code>를 40번 연속 실행해 실패 0을 확인했다.</li>
  <li><strong>문서.</strong> Claude는 서버를 띄우고 모든 엔드포인트에 curl을 날려서, 옛 문서가 틀린 지점 다섯 가지를 찾았다. API가 반환한 적 없는 필드를 나열했고, 코드가 무시하는 <code>days</code> 매개변수를 문서화했고, 높이가 미터인데 피트로 적었고, <code>/next-high</code> 엔드포인트를 빠뜨렸고, 오류 응답을 빼먹었다. 또한 잘못된 형식의 <code>from=</code> 값이 200과 함께 빈 목록을 반환한다는 것도 찾아냈는데, 손대라고 하지 않은 서버 코드를 고치는 대신 그 사실을 주의사항(caveat)으로 문서화했다.</li>
  <li><strong>로거.</strong> Claude는 JSON 로거를 쓰고, 요청 로그를 구조화된 필드로 옮기고, 테스트 다섯 개를 추가했다. 커밋 시점에 테스트 하나가 실패하고 있어서, Claude는 캐시 테스트를 여덟 번 다시 돌려 그중 다섯 번 실패하는 것을 보고, 첫 세션이 고치고 있던 바로 그 경쟁 조건까지 추적해 들어갔다. 같은 수정을 제안했지만, 자기 작업 범위 밖이라 캐시는 건드리지 않았고, 요약에 스위트가 깨끗하지 않다고 적었다.</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-b-sessions.png" alt="claude.ai/code에 Structured logging 세션이 보인다. 문자열로 만들던 요청 로그를 logger.info('request', { method, path, status, duration_ms })로 바꾸는 src/server.js diff가 펼쳐져 있고, claude/structured-logging 브랜치 막대에 Create PR 버튼이 있다." loading="lazy">
  <figcaption><b>FIG B</b>claude.ai/code 인터페이스에 띄운 세 세션. 로컬에서 실행해 실제 기록을 재생한 것이다. 설정 단계는 잘라냈고, 경로는 /home/user 아래로 보이며, 사이드바 아래쪽 제목 세 개는 채움용이고, 모드 칩(chip)은 기본값을 보여 준다.</figcaption>
</figure>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-c-flaky.png" alt="Fix the flaky test 세션: cache.js를 패치하고 테스트 스위트를 40번 돌린 명령, 그 출력 runs=40 fails=0, 그리고 TtlCache.get의 경쟁 조건에 대한 Claude의 설명." loading="lazy">
  <figcaption><b>FIG C</b>Fix the flaky test 세션</figcaption>
</figure>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-d-docs.png" alt="Update the tidepool API docs 세션: 옛 docs/API.md가 틀린 다섯 가지에 대한 Claude의 요약." loading="lazy">
  <figcaption><b>FIG D</b>Update the tidepool API docs 세션</figcaption>
</figure>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-e-sidebar.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-e-poster.png" aria-label="사이드바에서 세 세션 사이를 클릭해 오간 뒤, 로거 세션의 기록을 스크롤한다."></video>
  <figcaption><b>FIG E</b>같은 로컬 빌드를 20초 녹화한 것. 세 세션 사이를 클릭해 오간 뒤, 로거 세션의 기록을 스크롤한다.</figcaption>
</figure>

<p>로거 결과는 클라우드 세션이 왜 병렬 작업에 맞는지 보여 준다. 각 세션은 저장소 사본, 프로세스, 브랜치를 각자 갖고 있었다. 문서 세션과 로거 세션은 둘 다 테스트를 위해 API 서버를 띄웠지만, 서로 아무 영향도 주지 않았다. 노트북 한 대에서 에이전트 둘이 체크아웃 하나에서 일했다면 같은 파일을 고쳤을 것이고, 각자 포트를 따로 고르지 않는 한 포트에서 충돌했을 것이다.</p>

<p>그 격리(isolation) 때문에, 로거 세션은 첫 세션이 만들고 있던 캐시 수정에 접근할 수 없었다. 병렬 작업은 파일 경계를 따라 나누고, 브랜치는 합리적인 순서로 머지하며, 한 세션이 다른 세션이 이미 고치고 있는 문제를 보고하리라고 예상하자.</p>

<h2 id="under-the-hood-of-a-claude-code-cloud-session">Claude Code 클라우드 세션의 내부</h2>

<p>클라우드 세션은 Anthropic이 관리하는 인프라에서, 또는 <a href="https://code.claude.com/docs/en/self-hosted-environments">셀프 호스팅 환경(self-hosted environment)</a>을 통해 여러분 조직의 머신에서 돌아가는 Claude Code 세션이다. 그림이 구성 요소를 보여 준다. 그 뒤의 네 가지 요점은 여러분의 일하는 방식을 바꾸는 것들이다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-f-anatomy.png" alt="세션은 브라우저, 휴대폰, 데스크톱, 터미널, Slack 또는 루틴에서 시작한다. 새 VM 안에서 claude 브랜치로 clone한 저장소, auto 모드의 Claude Code, 환경 설정과 함께 돌아간다. GitHub 트래픽은 토큰을 VM 바깥에 보관하는 프록시를 거치고, 그 밖의 트래픽은 네트워크 허용 목록을 적용하는 보안 프록시를 거친다. 결과는 브랜치와 pull request다." loading="lazy">
  <figcaption><b>FIG F</b>클라우드 세션의 해부도. 에이전트가 손댈 수 있는 모든 것은 VM 안에 있다. 여러분의 GitHub 토큰과 네트워크 정책은 그 바깥에 있다.</figcaption>
</figure>

<ul>
  <li><strong>작업마다 자기 머신이 생긴다.</strong> 저장소가 새 브랜치로 clone된 새 VM이므로, 세션끼리 서로의 파일이나 포트를 건드릴 수 없다. <a href="https://code.claude.com/docs/en/cloud-environments#installed-tools">설치된 도구</a>를 참고하자.</li>
  <li><strong>여러분의 GitHub 토큰은 VM에 들어가지 않는다.</strong> 프록시가 토큰을 보관하고, 세션은 자기 작업 브랜치에만 push할 수 있는 단기 자격 증명을 받는다. <a href="https://code.claude.com/docs/en/cloud-environments#github-proxy">GitHub 프록시</a>를 참고하자.</li>
  <li><strong>저장소의 Claude 설정은 따라간다. 개인 설정은 따라가지 않는다.</strong> <code>CLAUDE.md</code>, 규칙, 스킬, 에이전트, 명령은 저장소와 함께 이동하고, 여러분의 <code>~/.claude</code>는 노트북에 남는다. <a href="https://code.claude.com/docs/en/settings#settings-in-cloud-sessions">클라우드 세션의 설정</a>을 참고하자.</li>
  <li><strong>유휴 VM은 회수된다.</strong> 세션을 다시 열면 대화가 복원된 새 VM을 받으므로, 중요한 작업은 커밋해 두자. <a href="https://code.claude.com/docs/en/claude-code-on-the-web#environment-expired">환경 만료</a>를 참고하자.</li>
</ul>

<p>사양, <a href="https://code.claude.com/docs/en/permission-modes">권한 모드(permission mode)</a>, 네트워크 수준은 <a href="https://code.claude.com/docs/en/cloud-environments">클라우드 환경 문서</a>를 보자.</p>

<h2 id="local-or-cloud">로컬이냐 클라우드냐?</h2>

<p>클라우드 세션은 로컬 세션을 대체하지 않으며, 대부분은 둘 다 쓴다. 표는 둘이 어디서 다른지 보여 주고, 그 뒤 문단은 각각 언제 맞는지 말한다.</p>

<div class="table-wrap">
<table>
<thead><tr><th></th><th>로컬 세션</th><th>클라우드 세션</th></tr></thead>
<tbody>
<tr><td>실행 위치</td><td>여러분의 머신</td><td>작업마다 새 VM</td></tr>
<tr><td>노트북이 잠들거나 오프라인일 때</td><td>세션이 멈춘다</td><td>세션이 계속 돌아간다</td></tr>
<tr><td>한 저장소에서 여러 작업</td><td>별도 worktree, 포트, 그리고 주의</td><td>작업당 VM 하나, 브랜치 하나</td></tr>
<tr><td>에이전트가 닿을 수 있는 것</td><td>여러분의 사용자 계정이 닿는 모든 것. SSH 키, 클라우드 CLI, <code>~/.claude</code> 포함</td><td>저장소, 여러분이 정한 네트워크 수준, 켜 둔 커넥터, 세션 범위의 GitHub 자격 증명</td></tr>
<tr><td>시작·추적 위치</td><td>그 머신, 또는 원격 제어(remote control)를 통한 휴대폰</td><td>브라우저, 휴대폰, 데스크톱, 터미널, Slack, API 호출, 스케줄</td></tr>
<tr><td>승인</td><td>명령별 승인을 포함한 모든 모드</td><td>Auto, Accept edits, Plan</td></tr>
<tr><td>끝나면</td><td>작업 트리의 변경 사항</td><td>브랜치, 원하면 pull request</td></tr>
<tr><td>컴퓨팅</td><td>여러분의 머신</td><td>별도 컴퓨팅 요금 없음. 플랜 한도를 사용</td></tr>
</tbody>
</table>
</div>

<p>작업에 여러분의 머신에만 있는 것이 필요하면 로컬에 머물자. 실제 로컬 데이터가 든 데이터베이스, VPN으로 접근하는 서비스, GPU, 휴대폰 시뮬레이터, 책상 위의 하드웨어가 그렇다. 변경 하나하나를 몇 초 안에 자기 브라우저에서 보고 싶은 빡빡한 시각 루프에도 로컬이 맞고, 조직이 <a href="https://code.claude.com/docs/en/zero-data-retention">Zero Data Retention</a>으로 운영된다면 클라우드 세션이 꺼지므로 역시 로컬이다.</p>

<p>두 선택지 사이에 기능 두 가지가 있다. <strong>원격 제어(Remote control)</strong>는 세션을 여러분의 머신에 두고 휴대폰이나 브라우저에서 조종하게 해 준다. Team·Enterprise 베타인 <strong><a href="https://code.claude.com/docs/en/self-hosted-environments">셀프 호스팅 환경</a></strong>은 클라우드 세션을 조직의 인프라에서 돌려서 사설 네트워크에 닿을 수 있게 한다.</p>

<p>어느 것도 해당하지 않는다면 그 작업은 클라우드에 잘 맞는 후보다. 다음 절은 그게 가장 빛을 발하는 워크플로우를 다룬다.</p>

<h2 id="seven-workflows-that-suit-cloud-sessions">클라우드 세션에 맞는 워크플로우 일곱 가지</h2>

<p>이 워크플로우들은 표의 차이점을 실제로 활용한다. 작업마다 별도 머신, 자리를 비운 동안에도 계속 돌아가는 세션, 그리고 끝에 남는 검토용 브랜치.</p>

<h3 id="clear-a-backlog-in-parallel">1. 밀린 일을 병렬로 치우기</h3>

<p>서로 무관한 작은 수정 다섯 개가 있다고 하자. 로컬에서는 하나씩 차례로 하거나, worktree 다섯 개를 만들어 포트와 설치를 따로 관리해야 한다. 클라우드에서는 세션 다섯 개를 시작하고 브랜치 다섯 개를 검토하면 된다.</p>

<pre><code>claude --cloud "Fix the flaky test in auth.spec.ts"
claude --cloud "Update the API documentation"
claude --cloud "Refactor the logger to use structured output"</code></pre>

<p><code>claude --cloud</code>는 현재 브랜치 기준으로 GitHub 원격(remote)을 clone하므로, 로컬 커밋을 먼저 push하자. VM이 뜨는 동안 CLI는 설정 단계의 실시간 체크리스트를 보여 주고, 그동안 입력한 내용은 큐에 쌓아 둔다.</p>

<p>각 작업은 무엇이 잘못됐는지, 완료가 어떤 모습인지, 어떻게 증명할지를 담은 자기 완결적인 티켓으로 쓰자. 불안정한 테스트의 프롬프트는 증명 방법을 명시했다. 스위트를 최소 30번 연속 실행하라고. 세션은 40번 돌렸다.</p>

<p>작업들이 더 큰 하나의 일에 속한다면, <strong><a href="https://claude.com/blog/projects-redesigned">프로젝트(project)</a></strong>(Pro·Max 공개 베타)가 조정자(coordinator) 대화를 돌려서 클라우드 세션을 대신 시작하고 추적해 준다. 그런 다음 작업 중, 여러분을 기다리는 중, 검토 준비됨으로 상태별로 묶어 준다.</p>

<h3 id="let-it-prove-the-fix">2. 수정을 증명하게 하기</h3>

<p>불안정한 테스트는 반복 증명이 필요한 작업의 가장 분명한 예다. 스위트를 몇 번이고 다시 돌려야 하는데, 그 루프가 지금 작업 중인 머신을 붙잡고 있는 건 원치 않는다. 클라우드에서 Claude는 캐시를 패치하고 명령 하나로 전체 스위트를 40번 돌렸다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-g-forty-runs.png" alt="불안정한 테스트 세션의 Bash 단계: 진행 중인 promise를 캐시하도록 src/cache.js를 패치한 뒤, 테스트 스위트를 40번 돌리는 루프. 출력은 runs=40 fails=0." loading="lazy">
  <figcaption><b>FIG G</b>40회 실행, 실패 0: 불안정한 테스트 세션의 실제 명령과 출력. 로컬에서 실행한 claude.ai/code 인터페이스에 재생한 것이다. Claude는 src/cache.js를 패치하고 한 단계 안에서 전체 스위트를 40번 반복했다. 경로는 /home/user 아래로 보인다.</figcaption>
</figure>

<p>VM은 컴퓨팅 요금이 없고 그 CPU는 여러분 것이 아니니, 철저한 증명을 요구하자. 스위트를 200번 돌리고, 커밋 50개에 걸쳐 회귀(regression)를 bisect하고, 느린 통합 테스트 계층을 돌리고, 문서 세션이 그랬듯 앱을 띄워 curl로 두드리자.</p>

<p>Claude의 턴(turn)은 여전히 플랜 사용량에 들어가지만, 명령 하나 안의 긴 테스트 실행은 비용이 거의 들지 않는다. <a href="https://code.claude.com/docs/en/cloud-environments">포그라운드 명령</a>은 기본 2분(최대 10분) 뒤에 타임아웃되고, 그다음 최대 30분까지 백그라운드에서 계속 돈다. 환경의 변수에 <code>BASH_DEFAULT_TIMEOUT_MS</code>와 <code>BASH_MAX_TIMEOUT_MS</code>를 넣어 기본값을 올릴 수 있다.</p>

<h3 id="plan-at-your-desk-build-in-the-cloud-finish-in-your-terminal">3. 책상에서 계획하고, 클라우드에서 만들고, 터미널에서 마무리하기</h3>

<p>큰 변경이라면 주고받기가 저렴한 곳에서 먼저 접근 방식을 합의하자. Claude를 plan 모드로 시작해 함께 계획을 세우고, 계획을 커밋하고, push한다.</p>

<pre><code>claude --permission-mode plan
# ...계획을 합의하고 docs/migration-plan.md에 저장한 뒤 커밋·push...
claude --cloud "Execute the migration plan in docs/migration-plan.md"</code></pre>

<p>클라우드 세션이 만드는 동안 여러분의 터미널은 다른 일에 자유롭다. 끝나면 세션을 끌어내려 손으로 마무리하자.</p>

<pre><code>claude --teleport            # 클라우드 세션 선택
claude --teleport &lt;session-id&gt;</code></pre>

<p>teleport는 여러분이 같은 저장소에 있는지 확인하고, 세션의 브랜치를 fetch해 체크아웃하고, 대화 전체를 터미널에 불러온다. 작업 트리가 깨끗해야 하고(stash를 제안해 준다), 브랜치는 push되어 있어야 한다. Claude Code 안에서는 <code>/teleport</code>(또는 <code>/tp</code>)가 같은 선택 화면을 열고, <code>/tasks</code> 다음 <code>t</code>도 된다. 데스크톱 앱은 반대 방향으로 가는데, <strong>Open in</strong> 메뉴가 로컬 세션을 클라우드로 보낸다.</p>

<h3 id="check-in-from-your-phone">4. 휴대폰으로 들여다보기</h3>

<p>Claude 앱의 Code 탭은 같은 세션에 연결된다. 휴대폰에서 작업을 시작하고, 따라가고, 조종하고, Claude가 물은 질문에 답하고, Claude에게 pull request를 지켜보라고 말할 수 있다.</p>

<p>휴대폰은 키보드 앞에 앉을 때쯤이면 잊어버릴 질문에 어울린다. 나는 네 번째 세션에 휴대폰으로 칠 법한 질문을 던졌다. tidepool은 조수를 어떻게 예측하고, 시간 창(time window)의 가장자리에서 어떻게 틀릴 수 있을까? 세션은 코드를 돌려 답을 확인했고 실제 버그를 찾았다. 루프가 첫 샘플과 마지막 샘플을 절대 검사하지 않아서, API가 창의 시작점에 정확히 떨어지는 만조(high tide)를 놓친다.</p>

<figure>
  <img class="phone" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-h-phone.png" alt="휴대폰 너비의 claude.ai/code에 Claude의 답 첫머리가 보인다. predictTides에는 가장자리 문제 두 가지가 있고 실행으로 확인했다는 내용과 How it works 절." loading="lazy">
  <figcaption><b>FIG H</b>휴대폰에서 던진 질문: 브라우저에서 휴대폰 너비로 띄운 claude.ai/code(네이티브 앱이 아님). 로컬에서 실행해 네 번째 세션의 실제 답을 재생한 것이다.</figcaption>
</figure>

<figure>
  <img class="phone" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-i-phone-end.png" alt="답의 끝부분: 관측소별로 보고된 만조·간조가 같은 높이의 이웃을 가진 빈도 표와 제안된 수정." loading="lazy">
  <figcaption><b>FIG I</b>Claude는 샘플 데이터에 코드를 돌려 주장 하나하나를 확인했고, 파일은 하나도 바꾸지 않았다.</figcaption>
</figure>

<h3 id="hand-ci-failures-and-review-comments-to-claude">5. CI 실패와 리뷰 코멘트를 Claude에게 넘기기</h3>

<p>저장소에 Claude GitHub App이 설치되어 있으면, 클라우드 세션이 pull request를 지켜보다가 거기서 일어나는 일에 대응할 수 있다. claude.ai/code의 세션 안 CI 막대에서 <strong>Auto-fix</strong>를 켜자. 터미널에서 PR 브랜치에 <code>/autofix-pr</code>을 실행하거나, 모바일 앱에 PR을 지켜보라고 하거나, PR URL을 세션에 붙여 넣어도 된다.</p>

<p>Claude는 실패한 검사와 리뷰 코멘트에 대해 분명한 수정을 push하고, 무엇을 바꿨는지 설명한다. 애매하거나 아키텍처에 관한 것은 여러분에게 묻는다. 리뷰 스레드의 답글은 여러분의 GitHub 사용자명으로, Claude Code라는 표시와 함께 올라간다. Claude는 base 브랜치와의 머지 충돌을 알림받지 않으므로, rebase하라고 말해 주자. Claude의 코멘트는 Atlantis 같은 코멘트 기반 자동화를 트리거할 수도 있다.</p>

<h3 id="start-work-without-starting-it-yourself">6. 직접 시작하지 않고 일 시작하기</h3>

<p><strong>루틴(routine)</strong>(리서치 프리뷰)은 프롬프트, 저장소, 커넥터, 환경처럼 한 작업을 해내기 위해 설계된 저장된 리소스 여러 개의 묶음이다. 각 실행은 트리거로 시작되는 클라우드 세션이다. 트리거는 스케줄(가장 잦아야 매시간), 루틴 고유 엔드포인트로의 HTTP 호출, 또는 pull request 열림이나 릴리스 같은 GitHub 이벤트일 수 있다. claude.ai/code/routines에서, 데스크톱 앱에서, 또는 CLI의 <code>/schedule</code>로 만들 수 있다. 루틴은 승인 프롬프트 없이 돌아가며, 기본적으로 <code>claude/</code> 접두사가 붙은 브랜치에 push한다.</p>

<p>여기서 작은 도구 둘이 도움이 된다. 로그인된 어떤 머신에서든, CI 작업에서도, 실행 중인 세션에 후속 메시지를 큐에 넣을 수 있다.</p>

<pre><code>claude -p "The integration tier is green now; rebase on main and push" --cloud &lt;session-id&gt;</code></pre>

<p>미리 채워진 세션을 즐겨찾기할 수도 있다. <code>claude.ai/code?prompt=Triage+the+newest+issues&amp;repositories=acme-labs/tidepool</code> 같은 URL은 프롬프트와 저장소가 이미 채워진 채로 claude.ai/code를 연다.</p>

<h3 id="run-code-you-dont-fully-trust">7. 완전히 믿지 못하는 코드 실행하기</h3>

<p>기여자의 pull request, 새 의존성의 설치 스크립트, 5분 전에 clone한 저장소는 모두 여러분이 읽지 않은 코드를 실행할 수 있다. 노트북에서 그 코드는 SSH 키, 클라우드 CLI 세션, 브라우저 프로필 옆에서 돈다. 클라우드 세션에서는 그런 것이 전혀 없는 일회용 VM에서, 세션 범위의 GitHub 자격 증명과 좁힐 수 있는 네트워크로 돈다.</p>

<p>가장 엄격한 실행을 원하면 환경의 네트워크 접근을 <strong>None</strong>으로 두고, 아니면 패키지 레지스트리, GitHub, 주요 클라우드 SDK 호스트를 허용하는 <strong>Trusted</strong>를 유지하자. None에서도 Claude Code는 여전히 Anthropic API에 요청을 보내므로 그 경로로 데이터가 VM을 나갈 수 있고, 세션은 여전히 자기 브랜치에 push할 수 있다. 모든 아웃바운드 트래픽은 호스트명을 기록하는 프록시를 거친다.</p>

<h2 id="connecting-github-without-getting-stuck">막히지 않고 GitHub 연결하기</h2>

<p>첫 클라우드 세션이 잘못된다면 가장 흔한 원인은 GitHub다. 문제 대부분은 클라우드 세션에 서로 다른 GitHub 권한 두 가지가 필요하다는 데서 온다.</p>

<ul>
  <li><strong>GitHub로 로그인</strong>은 Claude에게 여러분이 누구인지 알려 준다.</li>
  <li><strong>Claude GitHub App 설치</strong>는 계정이나 조직에서 Claude가 볼 수 있는 비공개 저장소를 정한다.</li>
</ul>

<p>공개 저장소는 첫 번째만으로 된다. 비공개 저장소는 그것을 소유한 계정이나 조직에 두 번째가 필요하다. GitHub를 연결했는데 비공개 저장소가 안 보인다면, 보통 그 저장소를 소유한 계정이나 조직에 App이 설치되지 않은 것이다.</p>

<div class="table-wrap">
<table>
<thead><tr><th>연결한 것</th><th>공개 저장소</th><th>내 비공개 저장소</th><th>조직의 비공개 저장소</th><th>Auto-fix, GitHub 트리거, 프로젝트</th></tr></thead>
<tbody>
<tr><td>GitHub 로그인만</td><td>가능</td><td>불가</td><td>불가</td><td>불가</td></tr>
<tr><td>+ 개인 계정에 App</td><td>가능</td><td>가능</td><td>불가</td><td>내 저장소</td></tr>
<tr><td>+ 조직에 App(소유자 승인)</td><td>가능</td><td>내 계정에도 있을 때만</td><td>가능</td><td>조직 저장소</td></tr>
<tr><td><code>/web-setup</code>(내 <code>gh</code> 토큰)</td><td>가능</td><td>가능</td><td>토큰이 닿는 만큼</td><td>불가, App 필요</td></tr>
</tbody>
</table>
</div>

<h3 id="path-a-connect-in-the-browser-recommended">경로 A: 브라우저에서 연결(권장)</h3>

<p><a href="https://claude.ai/connect-github">claude.ai/connect-github</a>에서 GitHub 계정을 연결한 뒤, 저장소를 소유한 계정이나 조직에 Claude GitHub App을 설치하자. 조직이라면 보통 소유자가 설치를 승인해야 한다. <a href="https://code.claude.com/docs/en/web-quickstart">퀵스타트</a>가 각 단계를 안내한다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-j-signin.png" alt="Connect to GitHub 버튼이 있는 Code with Claude anywhere 화면." loading="lazy">
  <figcaption><b>FIG J</b>1단계, GitHub로 로그인. 샘플 데이터로 로컬에서 실행한 claude.ai/code 온보딩 화면. 일러스트 속 저장소 이름과 Research preview 칩은 제품 자체 아트워크의 일부다.</figcaption>
</figure>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-k-install-app.png" alt="저장소에 Claude GitHub App을 설치하라고 안내하는 Connect your repositories 화면. Skip과 Connect repositories 버튼이 있다." loading="lazy">
  <figcaption><b>FIG K</b>2단계, Claude GitHub App 설치</figcaption>
</figure>

<p>GitHub가 claude.ai/code로 되돌려 보내지 않는다면, <a href="https://claude.ai/connect-github">claude.ai/connect-github</a> 연결 페이지가 흔한 원인에 대한 짧은 체크리스트를 보여 줄 수 있다. 그중 하나가 single sign-on 단계로, 건너뛰면 조직의 저장소가 숨겨진다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-l-checklist.png" alt="Didn't finish connecting 화면과 다섯 가지 팁: 올바른 GitHub 계정으로 로그인하기, single sign-on 단계에서 각 조직을 authorize하기, GitHub connection not completed가 보였다면 다시 시작하기, 먼저 자기 계정을 연결하고 조직 접근은 나중에 소유자가 승인하게 하기, 또는 터미널에서 /web-setup 실행하기." loading="lazy">
  <figcaption><b>FIG L</b>GitHub가 되돌려 보내지 않을 때: 중단된 GitHub 연결에 대한 제품 자체 체크리스트. 로컬에서 실행한 claude.ai/code 인터페이스의 quick-setup 온보딩 흐름에서.</figcaption>
</figure>

<p>Auto-fix, GitHub 트리거 루틴, 프로젝트도 App에 의존하므로, 다른 방식으로 연결하더라도 App은 설치하자.</p>

<h3 id="path-b-connect-from-your-terminal-with-web-setup">경로 B: /web-setup으로 터미널에서 연결</h3>

<p>이미 <code>gh</code> CLI를 쓴다면 Claude Code 안에서 <code>/web-setup</code>을 실행해 <code>gh</code> 토큰을 Claude 계정에 보내자. 그러면 세션은 App이 있든 없든 그 토큰이 닿는 모든 저장소에 접근할 수 있다. 자세한 절차는 <a href="https://code.claude.com/docs/en/web-quickstart#connect-from-your-terminal">터미널에서 연결하기</a>를 보자. Team·Enterprise 플랜에서는 소유자가 먼저 <a href="https://code.claude.com/docs/en/claude-code-on-the-web#quick-setup-for-team-and-enterprise">Quick setup</a>을 켜야 한다.</p>

<h3 id="path-c-skip-github-for-a-one-off">경로 C: 일회성 작업이면 GitHub 건너뛰기</h3>

<p>GitHub 원격이 없는 저장소, 또는 App이 설치되지 않은 저장소에서 <code>claude --cloud</code>를 실행하면, Claude Code는 clone 대신 저장소 번들(bundle)을 업로드한다. 세션이 다시 push할 수 있는 건 여러분의 GitHub 연결에 그 저장소 push 권한이 있을 때뿐이다. 문서에 <a href="https://code.claude.com/docs/en/claude-code-on-the-web#send-local-repositories-without-github">번들에 포함되는 것과 빠지는 것</a>이 나와 있다.</p>

<h3 id="if-you-run-team-or-enterprise">Team이나 Enterprise를 운영한다면</h3>

<p>소유자에게는 짧은 체크리스트가 있다. <a href="https://claude.ai/admin-settings/connectors">claude.ai/admin-settings/connectors</a>에서 GitHub 커넥터를 켜고, <a href="https://claude.ai/admin-settings/claude-code">Claude Code 관리자 설정</a>에서 클라우드 세션을 허용하고, 조직의 저장소에 Claude GitHub App을 설치(또는 구성원의 요청을 승인)하고, <a href="https://code.claude.com/docs/en/claude-code-on-the-web#quick-setup-for-team-and-enterprise">Quick setup</a>을 켤지 정한다. IP 허용 목록(allowlist)이나 GitHub Enterprise Server를 쓰는 조직은 단계가 하나 더 있다. <a href="https://code.claude.com/docs/en/claude-code-on-the-web#limitations">IP 허용 목록</a>과 <a href="https://code.claude.com/docs/en/github-enterprise-server">GitHub Enterprise Server</a> 문서를 보자.</p>

<h3 id="when-it-still-doesnt-work">그래도 안 될 때</h3>

<div class="table-wrap">
<table>
<thead><tr><th>보이는 것</th><th>이유</th><th>해결</th></tr></thead>
<tbody>
<tr><td>선택 화면에 비공개 저장소가 없다</td><td>그 저장소를 소유한 계정이나 조직에 App이 설치되지 않았거나, App의 저장소 접근 범위에서 빠져 있다</td><td>거기에 App을 설치하거나, GitHub 설정에서 App의 Repository access에 그 저장소를 추가한다</td></tr>
<tr><td>조직을 연결하려면 조직 소유자여야 한다는 오류</td><td>조직이 멤버십 확인을 막았다. 보통 보류 중인 App 권한 요청, IP 허용 목록, 또는 SAML single sign-on 때문이다</td><td>소유자가 조직의 GitHub App 설정에서 보류 중인 권한 요청을 수락하거나, 설치된 GitHub App에 대한 IP 허용 목록 상속을 켜거나, (SAML이라면) Claude에게 조직 접근을 허가한다</td></tr>
<tr><td>연결 직후 조직의 저장소가 보이지 않는다</td><td>조직이 SAML single sign-on을 쓰는데 그 인가(authorization) 단계를 건너뛰었다</td><td>GitHub의 "Single sign-on to your organizations" 단계에서 계속하기 전에 각 조직 옆의 <strong>Authorize</strong>를 클릭한다. 이미 건너뛰었다면 GitHub 설정에서 그 조직에 대해 Claude를 authorize한 뒤 다시 연결한다</td></tr>
<tr><td>모든 클라우드 세션이 인증 오류로 실패한다</td><td>여러분의 Claude 조직이 IP 허용 목록을 쓴다</td><td>Anthropic 호스팅 서비스를 예외로 두도록 지원팀에 요청한다</td></tr>
</tbody>
</table>
</div>

<p>그 밖의 문제는 문서의 <a href="https://code.claude.com/docs/en/claude-code-on-the-web#troubleshooting">트러블슈팅</a>을 보자. <a href="https://code.claude.com/docs/en/web-quickstart#no-repositories-appear-after-connecting-github">GitHub 연결 후 저장소가 안 보이는 경우</a>도 거기 있다. GitHub 연결을 완전히 끊으려면 claude.ai/customize/connectors를 쓰자.</p>

<h2 id="give-sessions-what-they-need-to-check-their-own-work">세션이 스스로 검증할 수 있게 해 주기</h2>

<p>테스트를 돌릴 수 있는 세션은 작업을 돌려주기 전에 스스로 검증한다. 그게 없으면 여러분은 아무도 실행해 보지 않은 변경을 검토하게 된다. 이 가이드의 데모에서 가치 대부분은 Claude가 무언가를 실행한 데서 나왔다. 스위트 40회, 서버와 curl, 창 가장자리의 조수 계산. 10분의 환경 설정이 Claude에게 그런 검사를 돌릴 수단을 준다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-code-in-the-cloud/fig-m-environment.png" alt="Add cloud environment 대화 상자. 이름 tidepool, Trusted 네트워크 접근, LOG_LEVEL=debug, 그리고 apt-get으로 shellcheck를 설치하는 설정 스크립트." loading="lazy">
  <figcaption><b>FIG M</b>샘플 값으로 로컬에서 실행한 claude.ai/code 인터페이스에서 클라우드 환경 추가하기: 이름, 네트워크 접근 수준, .env 형식의 변수, 설정 스크립트</figcaption>
</figure>

<ul>
  <li><strong>Default 환경에서 시작하자.</strong> Trusted 네트워크 접근, 변수 없음, 설정 스크립트 없음이며, 대부분의 JavaScript, Python, Go, Rust 저장소에는 이걸로 충분하다.</li>
  <li><strong>머신 설정에는 setup script를 쓰자.</strong> Claude Code가 시작되기 전에 root로 실행되므로 <code>apt install</code>이 된다. 반드시 exit 0으로 끝나야 하며 아니면 세션이 시작되지 않고, 환경이 캐시되려면 5분 안팎에 끝나야 한다. 그 뒤로 새 세션은 여러분의 도구가 디스크에 깔린 스냅샷에서 시작한다. 캐시는 스크립트나 허용 호스트를 바꿀 때, 그리고 약 7일마다 다시 만들어진다.</li>
  <li><strong>프로젝트 설정에는 SessionStart 훅을 쓰자.</strong> <code>npm install</code> 같은 단계는 저장소의 <code>.claude/settings.json</code> 훅에 넣어서 로컬과 클라우드에서 같은 방식으로 돌게 하자. 클라우드에서만 돌아야 하는 단계라면 <code>CLAUDE_CODE_REMOTE</code>를 확인하자. 저장소 훅은 단일 저장소 세션에서 로드된다.</li>
  <li><strong>서비스는 세션마다 띄우자.</strong> 캐시는 파일을 저장한다. 돌고 있던 프로세스는 캐시에서 살아남지 않는다. Claude에게 <code>service postgresql start</code>를 실행하라고 하거나, SessionStart 훅에서 하자.</li>
  <li><strong>동작하는 가장 좁은 네트워크 수준을 고르자.</strong> Trusted는 흔한 레지스트리를 커버한다. 사설 레지스트리를 더하려면 Custom을, 작업에 공개 인터넷이 꼭 필요할 때만 Full을 쓰자. 변경은 1분 안팎에 실행 중인 세션에 반영된다.</li>
  <li><strong>비밀값은 공유 변수에 두지 말자.</strong> 환경 변수는 그 환경을 쓰는 누구에게나 보인다. Pro·Max에서는 환경의 API 자격 증명이 지정한 호스트로 가는 요청에 VM 바깥에서 키를 붙여 주므로, 키가 변수에 들어 있을 일이 없다.</li>
  <li><strong>명령은 CLAUDE.md에 적자.</strong> 개인 <code>~/.claude</code>는 클라우드 VM에 닿지 않는다. Claude가 통합 테스트 실행법을 알아야 한다면 저장소가 그걸 말해 줘야 한다.</li>
</ul>

<h2 id="habits-that-pay-off">효과 있는 습관</h2>

<ul>
  <li><strong>작업 하나, 세션 하나.</strong> 작고 분리된 세션이 검토하기 쉽고 버리기도 싸다.</li>
  <li><strong>증거를 요구하자.</strong> 작업 완료를 증명하는 명령을 명시하고, diff보다 Claude의 요약을 먼저 읽자.</li>
  <li><strong><code>claude --cloud</code> 전에 push하자.</strong> VM은 GitHub에서 clone하므로, push하지 않은 커밋은 닿지 않는다.</li>
  <li><strong>긴 작업은 중간중간 커밋하자.</strong> 유휴 VM은 회수될 수 있다.</li>
  <li><strong>diff 뷰에서 검토하자.</strong> 인라인 코멘트는 다음 메시지에 한데 묶이고, <strong>Create PR</strong>은 정식 PR, 초안(draft), 또는 GitHub의 작성 페이지를 열 수 있다.</li>
  <li><strong>Claude가 일하는 동안 조종하자.</strong> Claude가 일하는 동안 보낸 메시지는 큐에 쌓이고, 큐에 든 메시지는 되돌릴 수 있다.</li>
  <li><strong>세션을 공유하자.</strong> Team·Enterprise에서는 세션의 공개 범위를 Team으로 두면 리뷰어가 변경이 어떻게 만들어졌는지 읽을 수 있다. 클라우드 세션의 커밋에는 기록으로 되돌아가는 링크인 <code>Claude-Session</code> 트레일러(trailer)가 붙는다.</li>
  <li><strong>한도를 지켜보자.</strong> 병렬 세션은 플랜 한도를 병렬로 쓰므로, 세션 다섯 개는 하나보다 약 다섯 배 빨리 한도를 소모한다. 루틴에는 자체 시간당 상한이 있고, <a href="https://code.claude.com/docs/en/claude-projects">프로젝트</a>는 하루에 새 스레드를 최대 200개까지 시작할 수 있다.</li>
</ul>

<h2 id="common-questions">자주 묻는 질문</h2>

<p><strong>누가 클라우드 세션을 쓸 수 있나?</strong> Pro, Max, Team 플랜, 그리고 프리미엄 시트나 Chat + Claude Code 시트를 가진 Enterprise 사용자가 claude.ai 계정으로 로그인해서 쓸 수 있다. Console API 키나 서드파티 제공자로는 쓸 수 없다. <a href="https://code.claude.com/docs/en/claude-code-on-the-web">클라우드 세션 문서</a>를 보자.</p>

<p><strong>내 데이터는 어디로 가나?</strong> Anthropic이 세션 기록을 저장하며, 보관 기간은 플랜과 모델 개선(model-improvement) 설정에 따라 다르다. VM은 비활성 후 회수되고, 세션을 삭제하면 그 데이터가 제거된다. <a href="https://code.claude.com/docs/en/data-usage">데이터 사용</a>과 <a href="https://code.claude.com/docs/en/security">보안</a>을 보자.</p>

<p><strong>Claude가 내 클라우드 세션 데이터로 학습하나?</strong> 클라우드 세션은 Claude Code의 나머지와 같은 정책을 따른다. Team, Enterprise, API에서는 조직이 동의(opt in)하지 않는 한 Anthropic은 여러분의 코드나 프롬프트로 모델을 학습하지 않는다. Free, Pro, Max에서는 여러분의 <a href="https://claude.ai/settings/data-privacy-controls">모델 개선 설정</a>에 따른다. <a href="https://code.claude.com/docs/en/data-usage">데이터 사용</a>을 보자.</p>

<p><strong>큰 저장소도 감당하나?</strong> VM은 vCPU 약 4개, RAM 16 GB, 디스크 30 GB다. 무거운 설치는 <a href="https://code.claude.com/docs/en/cloud-environments#setup-scripts">setup script</a>에 넣어 한 번만 돌리고 캐시된 스냅샷에 들어가게 하자.</p>

<p><strong>GitLab이나 Bitbucket은?</strong> <code>claude --cloud</code>는 어떤 git 저장소에서든 번들을 업로드할 수 있지만, 세션이 그 호스트로 다시 push할 수는 없다. <a href="https://code.claude.com/docs/en/github-enterprise-server">GitHub Enterprise Server</a>는 Team·Enterprise에서 지원된다. <a href="https://code.claude.com/docs/en/claude-code-on-the-web#limitations">플랫폼 제한</a>을 보자.</p>

<p><strong>병렬 브랜치가 충돌하면?</strong> 세션들은 서로를 모른다. 브랜치 하나를 머지한 뒤, <code>claude -p "rebase on main and fix any conflicts" --cloud &lt;session-id&gt;</code>처럼 <a href="https://code.claude.com/docs/en/claude-code-on-the-web#send-follow-ups-from-the-cli">다음 세션에 후속 메시지를 보내자</a>.</p>

<p><strong>내 로컬 도구를 잃게 되나?</strong> 사용자 수준 설정은 따라가지 않으므로, 팀에 필요한 것은 저장소로 옮기자. 스킬과 명령은 <code>.claude/</code> 아래에 커밋하고, 프로젝트 범위 MCP 서버는 <code>.mcp.json</code>에 추가하고, 테스트 명령은 <code>CLAUDE.md</code>에 문서화하자. <a href="https://code.claude.com/docs/en/settings#settings-in-cloud-sessions">클라우드 세션의 설정</a>에 각 세션이 무엇을 읽는지 나와 있다.</p>

<h2 id="start-in-five-minutes">5분 만에 시작하기</h2>

<p>설정은 5분쯤 걸린다. 그 뒤로는 작업을 넘기고, 노트북을 닫고, 검토 준비가 된 브랜치로 돌아오면 된다.</p>

<ol>
  <li>claude.ai/code를 열거나, Claude Code에서 claude.ai 계정으로 <code>/login</code>을 실행한다.</li>
  <li>GitHub를 연결하고, 저장소가 있는 곳에 Claude GitHub App을 설치한다.</li>
  <li>저장소와 Default 환경을 고른다.</li>
  <li>밀린 일 중 하나를 완료 증명 명령과 함께 Claude에게 준다.</li>
  <li>탭을 닫는다. 나중에 휴대폰으로 들여다본 뒤, claude.ai/code에서 diff를 검토하고 pull request를 만든다.</li>
</ol>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
