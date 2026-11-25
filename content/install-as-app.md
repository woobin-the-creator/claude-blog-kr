---
slug: "install-as-app"
title: "아티팩트를 Mac·Windows 앱으로 만들기"
nav: "아티팩트를 데스크톱 앱으로 설치(베타) · 자체 아이콘·별도 창, Claude·커넥터 사용, 아티팩트 수정 시 자동 업데이트, 알림·메뉴 막대/트레이, 권한 3단계(기본·앱 권한·전체 접근, 업데이트마다 재확인), 데모 앱 Linnet·Phosphor·Sift·Tern·Vitals, Team 기본 켜짐·Enterprise 소유자가 켬, 공유 메뉴에서 설치"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-24"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h2 .num { color: var(--accent); font-size: 0.85em; margin-right: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .video-title { color: var(--muted); font-size: 0.85rem; text-align: center; margin: 0 0 24px; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .callout h4 { margin: 4px 0 6px; font-size: 1rem; }\n  .callout p:last-child { margin-bottom: 0; }\n  .logos { display:flex; flex-wrap:wrap; gap:10px; margin:16px 0 24px; padding:0; list-style:none; }\n  .logos li { margin:0; }\n  .logos img { height:44px; width:auto; border:1px solid var(--line); border-radius:6px;\n    background:#fff; padding:8px 10px; display:block; }\n  table { border-collapse: collapse; width: 100%; margin: 16px 0 24px; font-size: 0.88rem; }\n  th, td { border: 1px solid var(--line); padding: 6px 8px; text-align: center; }\n  th { background: #faf8f6; font-weight: 600; }\n  td:first-child { text-align: left; font-weight: 600; }\n  .stats { display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px; margin: 20px 0 24px; }\n  .stat { border:1px solid var(--line); border-radius:8px; padding:14px 16px; }\n  .stat img { height:22px; width:auto; display:block; margin-bottom:10px; }\n  .stat b { display:block; font-size:1.5rem; color:var(--accent); line-height:1.3; }\n  .stat span { color:var(--muted); font-size:0.86rem; }\n  .toc { border:1px solid var(--line); border-radius:8px; padding:14px 18px; margin: 16px 0 24px; }\n  .toc p { margin:0 0 6px; font-weight:600; }\n  .toc ol { margin:0; }\n  .setup { border:1px solid var(--line); border-radius:10px; padding:16px 18px; margin: 16px 0 24px; background:#fcfcfb; }\n  .setup > p:first-child { font-weight:600; margin-bottom:10px; }\n  .setup dl { margin:0; }\n  .setup dt { font-weight:600; font-size:0.9rem; color:var(--accent); margin-top:10px; }\n  .setup dd { margin: 2px 0 0; }\n  .setup dd.instr { background:#fff; border:1px solid var(--line); border-radius:6px; padding:10px 12px; font-size:0.92rem; }\n  .setup details { margin-top:8px; font-size:0.85rem; color:var(--muted); }\n  .setup details p { margin:6px 0 0; font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size:0.8rem; line-height:1.55; }\n  .q { display:flex; gap:14px; align-items:flex-start; margin: 22px 0;\n    background:#fafafa; border:1px solid var(--line); border-radius:10px; padding:16px 18px; }\n  .q img { width:52px; height:52px; border-radius:50%; object-fit:cover; flex:0 0 52px;\n    border:1px solid var(--line); }\n  .q blockquote { margin:0 0 8px; padding:0; border:none; color:#222; }\n  .q .who { margin:0; font-size:0.86rem; color:var(--muted); }\n  .checklist { list-style:none; padding-left:0; }\n  .checklist li { position:relative; padding-left:30px; margin-bottom:14px; }\n  .checklist li::before { content:\"☐\"; position:absolute; left:0; top:0; color:var(--accent); font-size:1.1rem; }\n  .checklist li > strong { display:block; }\n  .checklist li p { margin: 4px 0 8px; }\n  .phase { font-weight:700; margin: 24px 0 8px; color:#000; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .tbl { overflow-x:auto; margin: 16px 0 24px; }\n  .tbl table { margin:0; }\n  .tbl th, .tbl td { text-align:left; vertical-align:top; min-width:140px; }\n  .eyebrow { display:block; color:var(--accent); font-size:0.8rem; font-weight:700; letter-spacing:0.02em; margin-bottom:2px; }\n  .cta { display:inline-block; margin: 4px 0 16px; padding:8px 14px; border:1px solid var(--accent); border-radius:6px; text-decoration:none; }\n  .cust { margin: 22px 0; background:#fafafa; border:1px solid var(--line); border-radius:10px; padding:16px 18px; }\n  .cust img { height:26px; width:auto; display:block; margin-bottom:12px; }\n  .cust blockquote { margin:0 0 8px; padding:0; border:none; color:#222; }\n  .cust .who { margin:0; font-size:0.86rem; color:var(--muted); }"
has_markdown: false
markdown_length: 0
html_length: 4280
---

<!-- rendered HTML -->
<header>
  <h1>아티팩트를 Mac·Windows 앱으로 만들기</h1>
  <p>매일 쓰는 아티팩트를 다른 앱처럼 열고, 내 컴퓨터에서 더 많은 일을 하게 하세요</p>
  <div class="meta">
    2026년 11월 24일
    · 카테고리: <a href="https://claude.com/resources/product-updates">Product updates</a>
    · 제품: Claude apps
    · 읽는 시간 4분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/install-as-app">Turn artifacts into Mac and Windows apps by Anthropic</a>
      (한글 번역본)</span>
  </div>
</header>

<div class="toc">
  <p>목차</p>
  <ol>
    <li><a href="#what-installed-apps-can-do">설치한 앱으로 할 수 있는 일</a></li>
    <li><a href="#permissions">권한</a></li>
    <li><a href="#getting-started">시작하기</a></li>
  </ol>
</div>

<p>오늘부터 Claude 아티팩트(artifact)로 데스크톱 앱을 만들고, 실행하고, 공유할 수 있습니다. “앱으로 설치(Install as app)” 기능이 Mac용·Windows용 Claude에 베타로 순차 출시됩니다.</p>

<p>아티팩트를 Mac이나 Windows 앱으로 설치하면, 그 앱은 자체 아이콘을 갖고 Claude 안이 아니라 별도의 창에서 열립니다. 다른 사람과 공유할 수도 있으며, 컴퓨터와 상호작용하려면 먼저 사용자의 허락을 받아야 합니다. 얼마나 허용할지는 사용자가 정합니다.</p>

<p>각 앱은 Claude와 사용자의 커넥터(connector)를 쓸 수 있고, 바탕이 되는 아티팩트가 수정되면 자동으로 업데이트됩니다. 덕분에 지식 노동자와 개발자 모두에게 앱을 만들고 유지하는 과정이 간단해집니다. 앱이 Claude에 보내는 요청은 사용 중인 요금제의 사용량 한도에 포함됩니다.</p>

<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/vBDP--QD_Og?rel=0" title="Demo of Install as app: artifacts built with Claude open as their own Mac apps, including a file manager and a 3D globe."
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe></div>
<p class="video-title">“앱으로 설치” 데모: 파일 관리자와 3D 지구본을 비롯해 Claude로 만든 아티팩트가 각각 독립된 Mac 앱으로 열립니다.</p>

<p>아티팩트는 처음에 차트나 웹페이지처럼 공유하는 작업 결과물로 시작했습니다. 이제 사람들은 아티팩트를 일상 업무의 도구로 씁니다. 캘린더와 이메일에서 정기적으로 내용을 가져오는 회의 준비 페이지나, 그날 발송해야 할 주문을 추적하는 트래커 같은 것들입니다.</p>

<p>업무에 의존하는 도구라면, 다른 앱처럼 열리고 신경 써야 할 일이 생겼을 때 알려 줘야 합니다.</p>

<h2 id="what-installed-apps-can-do">설치한 앱으로 할 수 있는 일</h2>

<p>설치한 앱은 알림을 보내거나 메뉴 막대(menu bar)나 시스템 트레이(system tray)에 항목을 추가할 수 있습니다. 권한은 앱마다 사용자가 정하며, Team·Enterprise 관리자는 조직 전체에 대해 앱 권한과 전체 접근 권한을 켜거나 끌 수 있습니다.</p>

<p>Anthropic 사람들은 이 기능으로 다음과 같은 앱을 만들었습니다.</p>
<ul>
  <li><a href="https://claude.ai/artifact/HPtmhTpoSdHmRKNCJEUsoS">Linnet</a>: 레이어를 지원하는 본격적인 이미지 편집기</li>
  <li><a href="https://claude.ai/artifact/UtJhPrH24ejRTTWRtohwbx">Phosphor</a>: 영화 세트장에서 튀어나온 듯한 파일 관리자</li>
  <li><a href="https://claude.ai/artifact/BDCr8b2L6rbJQXhsztAL2x">Sift</a>: 폴더 규칙을 정해 두고 Claude를 써서 파일을 정리해 주는 앱</li>
  <li><a href="https://claude.ai/artifact/7QjDeZEKPQUsDUCmFEjvyy">Tern</a>: 옆에서 Claude가 돕고 설명해 주는 터미널</li>
  <li><a href="https://claude.ai/artifact/NSkw2jaPZdkdqkrVfswSGc">Vitals</a>: 컴퓨터 성능을 슬쩍 확인할 수 있는 메뉴 막대·트레이 앱</li>
</ul>

<p>우리 엔지니어 한 명이 만든 데모 앱을 <a href="https://claude.ai/artifact/9j53nCVcrSdZyCHtxUZkWJ">여기</a>에서 더 볼 수 있습니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/install-as-app/demo-apps-desktop.png" alt="아티팩트로 만든 데모 앱들이 놓인 레트로 픽셀아트 데스크톱. Library 앱 메뉴가 열려 있고 앱 창 네 개가 떠 있다" loading="lazy">
</figure>

<h2 id="permissions">권한</h2>

<p>권한에는 세 단계가 있습니다.</p>
<ul>
  <li><strong>기본(Default):</strong> 설치한 앱은 브라우저에서 할 수 있는 일만 할 수 있습니다.</li>
  <li><strong>앱 권한(App permissions):</strong> 앱이 Claude가 엄격하게 통제할 수 있는 일반적인 기능의 사용을 요청할 수 있습니다. 항상 위에 떠 있는 창 만들기, 전역 단축키 감지, 알림 보내기 같은 기능입니다.</li>
  <li><strong>컴퓨터 전체 접근(Full computer access):</strong> 앱이 매번 묻지 않고 프로그램을 실행하고 파일을 읽고, 바꾸고, 삭제할 수 있도록 요청할 수 있습니다.</li>
</ul>

<p>허락은 현재 버전의 앱에만 적용되므로, Claude는 업데이트가 있을 때마다(사용자 자신이 수정한 경우에도) 다시 묻습니다. 앱의 일부가 다른 웹사이트에서 오는 경우, 그 부분은 Claude가 다시 묻지 않고도 바뀔 수 있습니다.</p>

<p>전체 접근 권한은 사용자가 직접 만든 앱이나, Team·Enterprise에서는 같은 조직 사람이 만든 앱에만 줄 수 있습니다. Anthropic은 설치 전에 앱을 검토하지 않으므로, 신뢰하는 앱에만 전체 접근 권한을 주세요.</p>

<h2 id="getting-started">시작하기</h2>

<p>Claude에게 원하는 앱을 설명하고, 아티팩트로 사용해 본 다음 “앱으로 설치(Install as app)”를 클릭하세요. 패키징하거나 서명할 필요가 없고, 사용자의 Claude 계정을 쓰기 때문에 API 키나 별도 로그인도 필요 없습니다.</p>

<p>“앱으로 설치”는 모든 요금제에 베타로 순차 출시됩니다. HIPAA 대응(HIPAA-ready) 조직과 하이브리드 배포 환경에서는 쓸 수 없습니다. Team에서는 기본으로 켜져 있되 전체 접근 권한은 꺼져 있습니다. Enterprise에서는 소유자(owner)가 켜기 전까지 꺼져 있습니다. 앱을 열려면 온라인 상태여야 하고 Claude에 로그인되어 있어야 합니다. Claude Docs, Slides, Sheets를 비롯한 일부 아티팩트는 설치할 수 없습니다.</p>

<p>Mac용 또는 Windows용 Claude를 업데이트하고, 매일 쓰는 아티팩트를 연 다음 공유(Share) 메뉴에서 “앱으로 설치”를 선택하세요.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
