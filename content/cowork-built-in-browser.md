---
slug: "cowork-built-in-browser"
title: "Cowork에 브라우저가 내장됐다"
nav: "Cowork 내장 브라우저 · Claude가 자기 브라우저를 열다"
main: "Claude blog"
cat: "Product announcements"
date: "2026-08-26"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .subtitle { color:#333; font-size: 1.05rem; margin: 0 0 14px; line-height:1.6; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h2 .num { color: var(--accent); font-size: 0.85em; margin-right: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  h4 { font-size: 1.02rem; margin: 26px 0 6px; color:#000; }\n  p { margin: 0 0 16px; }\n  .lead { font-size: 1.05rem; color:#333; }\n  .deck { color:#555; font-style: italic; margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; border:1px solid var(--line); }\n  pre code { background: none; padding: 0; font-size: 0.85rem; line-height:1.5; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; aspect-ratio: 16 / 9; margin: 22px 0; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%;\n    border: 0; border-radius: 8px; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .stats { display:flex; flex-wrap:wrap; gap:12px; margin: 20px 0 24px; }\n  .stat { flex:1 1 180px; border:1px solid var(--line); border-radius:8px; padding:14px 16px; }\n  .stat b { display:block; font-size:1.35rem; color:var(--accent); line-height:1.3; }\n  .stat span { color:var(--muted); font-size:0.86rem; }\n  .q { display:flex; gap:14px; align-items:flex-start; margin: 22px 0;\n    background:#fafafa; border:1px solid var(--line); border-radius:10px; padding:16px 18px; }\n  .q img { width:52px; height:52px; border-radius:50%; object-fit:cover; flex:0 0 52px;\n    border:1px solid var(--line); }\n  .q .qt { margin:0 0 8px; font-style:italic; color:#222; }\n  .q .qa { margin:0; font-size:0.86rem; color:var(--muted); }\n  .q .qa a { color:var(--accent); text-decoration:none; }\n  .logos { display:flex; flex-wrap:wrap; gap:10px; margin:16px 0 24px; }\n  .logos a { flex:0 0 auto; }\n  .logos img { height:44px; width:auto; border:1px solid var(--line); border-radius:6px;\n    background:#fff; padding:4px 8px; display:block; }\n  .rules { counter-reset: r; list-style:none; padding-left:0; }\n  .rules li { counter-increment: r; padding-left:36px; position:relative; }\n  .rules li::before { content: counter(r,decimal-leading-zero); position:absolute; left:0;\n    color:var(--accent); font-weight:700; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  table { border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 10px 12px; text-align: left;\n    vertical-align: top; line-height: 1.6; }\n  th { background: var(--code-bg); font-weight: 600; }\n  td:first-child { white-space: nowrap; font-weight: 600; width: 92px; }\n  .tbl-wrap { overflow-x: auto; }"
has_markdown: false
markdown_length: 0
html_length: 5752
---

<!-- rendered HTML -->
<header>
  <h1>Cowork에 브라우저가 내장됐다</h1>
  <p class="subtitle">데스크톱 앱 안에서 <strong>Claude가 자기 브라우저를 직접 연다.</strong> 사이트를 돌아다니고, 페이지를 읽고, 클릭하고, 양식을 채운다. 확장 프로그램도, 별도 설정도 필요 없고, 내 브라우저에서 넘어가는 것도 내가 고르지 않는 한 없다.</p>
  <div class="meta">
    2026년 8월 26일 · 읽는 데 약 5분
    · 카테고리: <a href="https://claude.com/blog/category/announcements">Product announcements</a>
    · 제품: <a href="https://claude.com/product/cowork">Claude Cowork</a>
    <span class="orig">원문: <a href="https://claude.com/blog/cowork-built-in-browser">Claude gets its own browser in Cowork by Anthropic</a> (claude.com/blog)</span>
  </div>
</header>

<figure class="hero">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/cowork-built-in-browser/hero.svg" alt="글의 대표 일러스트레이션">
</figure>

<div class="callout">
  <strong>안내</strong> — 이 글은 원문의 축자 번역이 아니라, 원문을 읽고 핵심을 한국어로 정리한 <strong>요약·해설</strong>입니다.
  원문의 모든 섹션을 원문 순서 그대로 빠짐없이 다루고, 원문에 실린 영상과 링크도 모두 그대로 옮겼습니다.
  정확한 원문 표현은 위 원문 링크에서 확인하세요.
</div>

<p class="lead">한 줄 요약: <strong>데스크톱 앱의 Claude Cowork에 브라우저가 들어왔다.</strong> 웹사이트를 써야 하는 작업이 생기면 사이드 패널에 브라우저가 열리고, Claude가 알아서 페이지를 넘나들며 읽고, 클릭하고, 입력한다. 나는 하던 일을 계속하면서 <strong>작업의 웹 부분만 떼어 넘길 수 있다</strong>.</p>

<p>Claude가 대신 해줄 수 있는 일로 원문이 든 예시는 이런 것들이다 — 양식(form) 채우기, 대시보드에서 숫자 뽑아오기, <strong>커넥터가 없는 포털</strong>을 헤집고 다니며 일 처리하기.</p>

<div class="video">
  <iframe src="https://www.youtube.com/embed/63GVebZvqok" title="Cowork in-app browser"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen loading="lazy"></iframe>
</div>

<p>지금까지 Cowork에서 Claude에게 웹을 쓰게 하려면 <a href="http://claude.com/claude-in-chrome">Claude in Chrome</a> 확장 프로그램을 통해 <strong>내 브라우저에 접근 권한을 주는 것</strong>이 유일한 방법이었다. 이미 열어둔 페이지에서 해야 하는 일이라면 지금도 그쪽이 맞다. 하지만 원문의 표현을 빌리면, 웹 작업의 상당수는 <em>내 브라우저</em>가 필요한 게 아니라 그냥 <em>브라우저 하나</em>가 필요할 뿐이다. 이제 Claude에게 그 브라우저가 생겼다.</p>

<p>이번 주부터 Claude 데스크톱 앱의 <strong>Pro · Max · Team 플랜</strong>에 순차 배포된다. <strong>Enterprise</strong> 관리자는 오늘부터 조직에 켤 수 있다.</p>

<h2>어느 브라우저를, 언제</h2>

<p>핵심은 이것이다 — <strong>내 브라우저가 아니라 Claude의 브라우저다.</strong> 내장 브라우저는 내가 쓰는 브라우저와 완전히 분리돼 있고, <strong>Claude는 내 탭도, 북마크도, 비밀번호도 보지 못한다.</strong></p>

<p>대신 내가 쓰는 사이트에 로그인 상태를 유지하고 싶다면 <strong>로그인 정보를 사이트 단위로 하나씩 넘겨줄 수</strong> 있다. 가져올 수 있는 출처는 다음과 같다.</p>

<ul>
  <li><strong>macOS</strong> — Chrome, Edge, Firefox</li>
  <li><strong>Windows · Linux</strong> — Firefox</li>
</ul>

<p>다만 <strong>은행, 이메일, SSO(단일 로그인) 사이트는 기본적으로 제외</strong>된다. 내가 명시적으로 포함시키지 않는 한 넘어가지 않는다.</p>

<p>두 가지 웹 사용 방식의 차이도 여기서 갈린다.</p>

<ul>
  <li><strong>내장 브라우저</strong> — 내가 계속 다른 일을 하는 동안 <strong>웹 작업을 Claude에게 넘기는</strong> 용도. 원문 예시: 보고서에 쓸 리서치 모으기, 벤더 포털에서 이번 달 인보이스 걷어오기.</li>
  <li><strong>Claude in Chrome</strong> — <strong>이미 열어둔 페이지</strong>, 그리고 <strong>이미 로그인해 둔 계정</strong>에서 하는 일. 원문 예시: CRM 업데이트하기, 받은편지함 처리하기, 지금 보고 있는 문서 편집하기.</li>
</ul>

<p>이미 Claude in Chrome을 쓰고 있다면 <strong>그대로 계속 동작하고 기본값도 그쪽으로 유지된다.</strong> 쓰고 있지 않다면 Claude는 내장 브라우저를 쓴다. 언제든 <code>설정(Settings) → Cowork → 선호 브라우저(Preferred browser)</code>에서 바꿀 수 있다.</p>

<h2>통제권을 놓지 않으려면</h2>

<p>내장 브라우저 역시 브라우저에서 행동하는 모든 AI 에이전트와 똑같이 <a href="https://www.anthropic.com/research/prompt-injection-defenses">프롬프트 인젝션(prompt injection)</a> 위험을 안고 있다. 페이지 안에 숨겨진 지시문이 Claude의 방향을 틀어놓으려 하는 공격이다.</p>

<p>여기에는 <strong>Claude in Chrome과 동일한 안전장치가 그대로 적용된다.</strong> Claude가 실행하려는 동작을 <strong>사용자가 원래 요청한 내용과 대조해 검사하는 장치</strong>도 포함된다. 자세한 설명은 <a href="http://claude.com/blog/claude-in-chrome-generally-available">Claude in Chrome 정식 출시 글</a>에 정리돼 있다. (한글 정리: <a href="claude-in-chrome-generally-available.html">Claude in Chrome 정식 출시</a>)</p>

<div class="callout">
  <strong>원문의 경고</strong> — 이 조치들은 위험을 <strong>의미 있게 줄이지만 없애지는 못한다</strong>. 그래서 Anthropic은 <strong>신뢰하는 사이트에서 먼저 시작하라</strong>고 권한다. 더 자세한 내용은 <a href="https://support.claude.com/en/articles/12902428-use-claude-in-chrome-safely">안전 사용 가이드</a> 참고.
</div>

<h2>시작하기</h2>

<p>내장 브라우저는 <strong>앞으로 한 주에 걸쳐</strong> Claude 데스크톱 앱의 <strong>Pro · Max · Team</strong> 플랜에 순차 배포된다. 지원 OS는 <strong>macOS · Windows · Linux(베타)</strong>다.</p>

<p>내 계정에 도착하면 <strong>기본값으로 켜져 있다.</strong> 웹사이트가 관련된 작업을 Claude에게 시키면 브라우저가 알아서 열린다.</p>

<p><strong>Enterprise 플랜</strong>에서는 지금 바로 쓸 수 있고, 관리자는 <code>조직 설정(Organization settings) → Cowork → 내장 브라우저(Built-in browser)</code>에서 관리한다.</p>

<p>마지막으로 어디서 동작하는지 정리하면 이렇다.</p>

<ul>
  <li>내장 브라우저는 <strong>데스크톱 앱 안에서 산다.</strong></li>
  <li>웹이나 휴대폰에서도 <strong>내 데스크톱 앱이 켜져 있고 온라인이면</strong> Claude가 그 브라우저를 원격으로 몰 수 있다.</li>
  <li>데스크톱 앱 없이 웹에서만 쓴다면, Claude에게 브라우저를 쥐여주는 방법은 <strong>여전히 Claude in Chrome</strong>이다.</li>
</ul>

<hr>

<h3>관련 링크</h3>

<ul>
  <li><a href="https://claude.com/product/cowork">Claude Cowork</a> — 이 글의 대상 제품</li>
  <li><a href="http://claude.com/claude-in-chrome">Claude in Chrome</a> — 내 브라우저를 쓰는 다른 방식</li>
  <li><a href="http://claude.com/blog/claude-in-chrome-generally-available">Claude in Chrome 정식 출시 글</a> — 안전장치의 상세 설명 (<a href="claude-in-chrome-generally-available.html">한글 정리</a>)</li>
  <li><a href="https://www.anthropic.com/research/prompt-injection-defenses">브라우저 사용을 위한 프롬프트 인젝션 방어</a> — Anthropic 리서치</li>
  <li><a href="https://support.claude.com/en/articles/12902428-use-claude-in-chrome-safely">Claude in Chrome 안전 사용 가이드</a></li>
  <li><a href="https://www.youtube.com/watch?v=63GVebZvqok">Cowork in-app browser</a> — 본문에 실린 소개 영상</li>
  <li><a href="https://claude.com/blog/category/announcements">Product announcements</a> — 이 글의 카테고리</li>
</ul>

<footer>
  원문: <a href="https://claude.com/blog/cowork-built-in-browser">Claude gets its own browser in Cowork by Anthropic</a> — claude.com/blog, 2026년 8월 26일.<br>
  이 페이지는 원문을 읽고 한국어로 정리한 요약·해설이며, 영상과 링크는 원문에서 가져왔습니다. 모든 권리는 원저작자(Anthropic)에게 있습니다.
</footer>
