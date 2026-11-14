---
slug: "sheets-whiteboards-data"
title: "Claude Whiteboards, Claude Sheets, Claude Data를 소개합니다"
nav: "Claude Whiteboards·Sheets·Data · 공유 화이트보드·스프레드시트 베타, Dashboards→Claude Data 정식 출시(인증 쿼리·실시간 공유·데이터 스토리·캐싱), 관리자 기본값"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-10"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 5048
---

<!-- rendered HTML -->
<header>
  <h1>Claude Whiteboards, Claude Sheets, Claude Data를 소개합니다</h1>
  <div class="meta">
    2026년 11월 10일
    · 카테고리: <a href="https://claude.com/resources/product-updates">Product updates</a>
    · 제품: Claude apps
    · 읽는 시간 6분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/sheets-whiteboards-data">Introducing Claude Whiteboards, Claude Sheets, and Claude Data</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/sheets-whiteboards-data/hero.svg" alt="Claude Whiteboards, Sheets, Data를 상징하는 일러스트"></figure>

<p class="lede"><em>이제 Claude 안에서 바로 화이트보드로 브레인스토밍하고, 시트를 만들고, 데이터를 공유할 수 있습니다.</em></p>

<p>오늘 Claude Whiteboards와 Claude Sheets를 베타로 출시하고, <a href="https://claude.com/resources/articles/dashboards-and-motion" target="_blank" rel="noopener noreferrer">Claude Dashboards</a>는 Claude Data라는 이름으로 정식 출시(GA)합니다. Whiteboards는 팀이 Claude와 함께 브레인스토밍하는 공유 보드이고, Sheets는 Claude가 여러분과 함께 만들고 편집하는 스프레드시트이며, Claude Data는 데이터 스토리(data story), 인증된 쿼리(certified query), 실시간 공유(live sharing)를 더합니다. 모두 모든 유료 플랜에서 사용할 수 있습니다.</p>

<div class="video">
  <iframe src="https://www.youtube-nocookie.com/embed/YewAJPawE7I?rel=0&amp;playsinline=1&amp;modestbranding=1" title="새 Claude 아티팩트 데모: 팀과 Claude가 연말 파이 출시를 위해 화이트보드, 스프레드시트, 대시보드를 만드는 모습" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<p>지금까지 Claude와 프로젝트를 진행하면 결과물을 다른 도구나 프로그램으로 옮겨야 하는 경우가 많았고, 그곳에서는 Claude가 진행 상황과 변경 사항을 실시간으로 따라갈 수 없었습니다. 이제 문서, 보드, 시트, 대시보드를 Claude 안에 그대로 두고, 팀이 계속 함께 편집할 수 있습니다. 준비가 되면 결과물을 파트너사의 도구로 바로 가져가 그곳에서 이어서 작업할 수도 있습니다.</p>

<h2 id="claude-whiteboards">Claude Whiteboards</h2>

<p>많은 사람이 Claude를 생각 파트너(thought partner)로 활용하지만, Claude와 브레인스토밍한 뒤에는 보통 결과를 다른 곳에 복사해 붙여 넣어야 동료들과 브레인스토밍이나 협업을 시작할 수 있었습니다. 이제는 정리되지 않은 계획을 Claude에게 소리 내어 이야기하면, Claude가 이를 담당자와 날짜가 들어간 타임라인이 있는 보드로 바꿔 주어 여러분과 팀이 실시간으로 협업할 수 있습니다. 예를 들어 회고(retro) 미팅에서는 모두가 각자 메모를 추가하면, Claude가 이를 주제별로 묶고 사람마다 실행 항목(action item)의 초안을 작성할 수 있습니다. 보드의 특정 부분 주위로 상자를 드래그해 그 부분에 집중한 뒤 Claude에게 질문할 수도 있습니다. 브레인스토밍이 끝나면 Claude가 보드를 문서나 덱(deck)으로 바꾸거나, Lucid, Miro, Vani by Zoho 같은 도구로 가져가 팀과 함께 계속 작업할 수 있게 해 줍니다.</p>

<h2 id="claude-sheets">Claude Sheets</h2>

<p>이제 Claude는 탭, 수식, 서식, 드롭다운을 갖춘 스프레드시트를 생성할 수 있습니다. 캠페인 트래커나 채용 예산을 요청하는 것 같은 프롬프트 하나만으로도 가능한 경우가 많습니다. Claude는 셀 안에서 직접 편집할 수 있으며, 새로 편집할 때마다 윤곽선으로 표시해 변경 사항을 추적할 수 있게 합니다. 시트를 팀과 공유해 여러분과 Claude가 함께 작업할 수도 있습니다.</p>

<p>현재 시트는 간단한 스프레드시트 기능만 갖추고 있지만, 더 많은 기능을 추가하고 있습니다. Excel의 전체 기능이 필요하면 파일을 .xlsx나 CSV로 내보내거나 <a href="https://claude.com/claude-for-microsoft-365" target="_blank" rel="noopener noreferrer">Claude for Excel</a>을 사용할 수 있습니다. Airtable, Asana, monday.com, Smartsheet 같은 파트너 도구에서 이어서 작업할 수도 있습니다.</p>

<h2 id="claude-data">Claude Data</h2>

<p><a href="https://claude.com/resources/articles/dashboards-and-motion" target="_blank" rel="noopener noreferrer">Claude Dashboards</a>는 10월에 베타로 출시되어, 팀이 Amazon Redshift, BigQuery, ClickHouse 같은 도구에 있는 회사 데이터에 빠르게 질문할 수 있게 해 주었습니다. 오늘부터 Claude Data라는 이름으로 정식 제공됩니다. 이름을 바꾼 이유는 기업이 데이터를 활용하는 방식이 대시보드보다 넓고, 이제 이 제품이 그들의 업무 방식을 더 폭넓게 다루기 때문입니다. 인증된 쿼리와 실시간 공유는 베타입니다. 팀이 Claude Data를 활용할 수 있는 몇 가지 방법은 다음과 같습니다.</p>

<ul>
  <li><strong>지표의 인증된 정의 만들기.</strong> 데이터 팀이 모두가 사용해야 할 쿼리를 인증해 두면, 서로 충돌하는 데이터로 대시보드를 만들거나 작업하는 일을 피할 수 있습니다. 이렇게 인증된 지표로 만든 차트에는 인증되었음을 나타내는 "certified" 배지가 붙습니다.</li>
  <li><strong>데이터로 스토리 만들기.</strong> Claude Data에서 Claude와 함께 지표를 바탕으로 데이터 스토리나 내레이션이 들어간 영상의 초안을 만들고, 공유하기 전에 검토할 수 있습니다.</li>
  <li><strong>모두에게 최신 수치 공유하기.</strong> 실시간 공유를 사용하면, 동료들은 데이터를 최신 상태로 유지하는 커넥터에 접근 권한이 없더라도 공유된 대시보드를 열었을 때 최신 수치를 볼 수 있습니다. 보는 사람은 여러분이 승인한 쿼리의 결과만 볼 수 있으며, 여러분의 권한으로 다른 쿼리를 실행할 수는 없습니다.</li>
  <li><strong>룩앤필 맞추기.</strong> 이제 Claude Data에서 디자인 시스템을 지원합니다.</li>
  <li><strong>캐싱으로 더 빠르게 로딩하기.</strong> 이전에는 대시보드를 열 때마다 매번 새로 불러왔습니다. 이제 대시보드가 캐싱을 지원하며, 새로고침 주기를 대시보드별로 설정할 수 있습니다.</li>
  <li><strong>시간에 따른 변경 추적하기.</strong> 이제 Claude Data에 변경 내용 추적(tracked changes) 기능이 생겨, 누가 편집했는지 확인하고 필요하면 특정 버전으로 되돌릴 수 있습니다.</li>
</ul>

<p>Claude Data의 파트너로는 Amplitude, Mixpanel, Omni, PostHog, Sigma가 있습니다.</p>

<h2 id="work-in-your-other-tools-too">다른 도구에서도 작업하세요</h2>

<p>오늘부터 <a href="https://claude.com/resources/articles/interactive-connectors-full-tool" target="_blank" rel="noopener noreferrer">인터랙티브 커넥터(interactive connectors)</a>를 대화 옆이나 전체 화면에서 완전한 앱으로 열 수 있습니다. 그래서 Adobe, Atlassian, Box, Notion 같은 도구에서 직접 작업하거나, Claude에게 함께 변경해 달라고 요청할 수 있습니다.</p>

<h2 id="getting-started">시작하기</h2>

<p>Claude Whiteboards, Sheets, Data는 웹, 데스크톱, 모바일에서 작동합니다. Claude Data를 사용하려면 웨어하우스나 CRM 같은 데이터 커넥터가 필요합니다.</p>

<p><strong>관리자를 위한 안내:</strong> Team 플랜에서는 세 가지 모두 기본으로 켜져 있습니다. Enterprise 플랜에서는 Claude Whiteboards와 Sheets가 기본으로 꺼져 있고, Claude Data는 2026년 11월 19일에 기본으로 켜집니다. 이 설정은 언제든 조직 설정(Organization settings) &gt; 아티팩트(Artifacts)에서 변경할 수 있습니다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
