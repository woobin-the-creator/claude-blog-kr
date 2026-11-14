---
slug: "more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors"
title: "Claude와 일하는 더 많은 방법: Sheets, Whiteboards, 인터랙티브 커넥터"
nav: "Claude Sheets·Whiteboards·Data · 새 아티팩트 유형, 인터랙티브 커넥터 업그레이드, Claude Meetings 예고, 고객 사례(Datadog·Gusto·HubSpot), 자동 연결·커넥터 권한 제한"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-10"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 8387
---

<!-- rendered HTML -->
<header>
  <h1>Claude와 일하는 더 많은 방법: Sheets, Whiteboards, 인터랙티브 커넥터</h1>
  <div class="meta">
    2026년 11월 10일
    · 카테고리: <a href="https://claude.com/resources/product-updates">Product updates</a>
    · 제품: Claude apps
    · 읽는 시간 5분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors">More ways to work with Claude: Sheets, Whiteboards, and Interactive Connectors</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede"><em>생각의 속도로 일하세요</em></p>

<p>저희는 Claude Code가 개발자의 일하는 방식을 바꾸는 것을 지켜봤습니다. 엔지니어들은 코드를 한 줄씩 직접 작성하던 데서, 아이디어를 설명하고 Claude가 만든 결과를 검토하는 방식으로 옮겨 갔습니다. 덕분에 무언가를 만드는 즐거움을 되찾았습니다. 저희의 목표는 그 마법을 모든 팀에 전하는 것이고, 오늘 Claude로 할 수 있는 일을 넓힙니다. <strong>Claude Sheets</strong>, <strong>Claude Whiteboards</strong>, <strong>Claude Data</strong>라는 새로운 아티팩트(artifact) 유형을 소개합니다. 또한 <strong>인터랙티브 커넥터(interactive connectors)</strong>를 업그레이드해 가장 많이 쓰는 앱에서 더 쉽게 작업할 수 있게 했습니다. <strong>Claude Meetings</strong>도 곧 나옵니다.</p>

<h2 id="all-your-connectors-and-context">모든 커넥터와 컨텍스트</h2>

<p>Claude Code에서는 Claude에게 필요한 컨텍스트가 이미 코드베이스 안에 있습니다. 다른 팀의 경우 컨텍스트가 이메일, 앱, 드라이브에 흩어져 있습니다. Claude는 저희가 AI를 사용자가 쓰는 도구에 연결하기 위해 내놓은 오픈 표준인 <a href="https://www.anthropic.com/news/model-context-protocol" target="_blank" rel="noopener noreferrer">Model Context Protocol</a>(MCP) 위에 만들어진 커넥터를 통해 그 컨텍스트에 닿습니다. Claude Marketplace에는 커뮤니티가 만든 것을 포함해 9,000개가 넘는 커넥터와 플러그인이 올라와 있습니다.</p>

<p><a href="https://claude.com/resources/articles/interactive-connectors-full-tool" target="_blank" rel="noopener noreferrer"><strong>인터랙티브 커넥터</strong></a>는 여기서 한 걸음 더 나아갑니다. 오늘부터 파트너들은 자사 앱을 Claude 안에 직접 임베드할 수 있어서, 탭을 오가지 않고도 Adobe, Atlassian 등에서 작업할 수 있습니다. Salesforce(베타), NetSuite, Workday(베타)의 플러그인에는 스킬이 기본으로 들어 있어, 영업 담당자는 통화를 준비하고, 회계 담당자는 재무 데이터를 분석하고, HR 팀은 휴가와 경비를 처리할 수 있습니다.</p>

<h2 id="bring-ideas-to-life-faster-together">함께, 더 빠르게 아이디어를 현실로</h2>

<p>오늘부터 Claude는 팀과 함께 스프레드시트, 화이트보드, 대시보드를 만들 수 있습니다. 이 기능들은 <a href="https://www.youtube.com/watch?v=To5nrYqvR44" target="_blank" rel="noopener noreferrer">문서, 슬라이드 덱, 디자인</a>을 만드는 기존 능력, 그리고 콘텐츠를 짧은 애니메이션으로 바꿔 주는 <a href="https://support.claude.com/en/articles/17454997-get-started-with-claude-motion" target="_blank" rel="noopener noreferrer">Claude Motion</a>(베타)과 함께 동작합니다. 어떤 형식에서든 Claude가 필요한 것을 빠르게 파악하므로, 일의 속도는 여러분의 생각이 정합니다.</p>

<ul>
  <li><a href="https://claude.com/resources/articles/sheets-whiteboards-data" target="_blank" rel="noopener noreferrer"><strong>새로운 아티팩트 유형</strong></a>:
    <ul>
      <li>Claude Sheets에서는 팀과 Claude가 함께 스프레드시트를 만들고, 협업하며 데이터를 정리하고, 수식을 만들고 편집하며, 여러 탭에 걸쳐 작업합니다.</li>
      <li>Claude Whiteboards는 디지털 화이트보드로, 팀이 회의 중에 함께 아이디어를 펼쳐 놓고 정리한 뒤 Claude에게 결과 요약을 요청할 수 있습니다.</li>
      <li>Claude Data(이전 이름: Dashboards)는 Snowflake, Salesforce 같은 도구에 연결되며, 데이터 팀이 인증한 정의(베타)를 활용해 대시보드, 시각적 데이터 스토리, 내레이션이 들어간 짧은 영상을 만들 수 있습니다.</li>
    </ul>
  </li>
</ul>

<p>계정 트래커, 일일 브리핑, 프로젝트 현황판, 계약 검토 표처럼 팀의 일하는 방식에 맞춘 맞춤 아티팩트를 만들어 달라고 Claude에게 요청할 수도 있습니다. Claude는 모든 단계에서 같은 컨텍스트를 이어 가므로, 하나의 아이디어가 화이트보드에서 스프레드시트로, 다시 대시보드로 세부 사항을 반복해 설명할 필요 없이 이어집니다.</p>

<p>곧 나올 <strong>Claude Meetings</strong>를 사용하면 통화에 Claude를 추가해 메모를 맡기고, 대화하는 동안 팀이 작업 중인 문서를 업데이트하게 할 수 있습니다.</p>

<h2 id="teams-already-working-this-way">이미 이렇게 일하고 있는 팀들</h2>

<p>Anthropic 내부에서는 비기술 팀들도 엔지니어만큼 Claude를 잘 활용하기 시작했습니다. 저희 법무팀은 Claude와 함께 Slack 기반 법무 검토 도구를 만들었는데, 이 도구는 팀 자체 플레이북을 바탕으로 수정안(redline)을 자동으로 작성합니다. 이 덕분에 마케팅 검토가 3일에서 24시간으로 줄었고, 간단한 수정은 변호사가 초안을 검토하기 전에 끝납니다. 재무팀은 경영진을 위한 긴 사업 업데이트 문서를 인터랙티브 페이지로 바꿨고, 이제 팀 전체가 Claude와 함께 이 페이지를 업데이트합니다.</p>

<p>두 팀 모두 코드를 작성하지는 않지만, 각자 분야의 전문가입니다. 이들은 Claude를 사용해 그 지식을 시간을 아껴 주고 다른 사람들도 쓸 수 있는 도구로 바꿨습니다. 저희 고객들도 이렇게 일하고 있습니다.</p>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors/datadog.svg" alt="Datadog" loading="lazy">
  <blockquote><p>“Datadog에서 Claude는 코딩을 넘어 지식 업무로 확장됐습니다. 프로덕트 매니저들은 Claude를 사용해 아이디어에서 기능 브리프, PRD, 테스트 가능한 프로토타입까지 훨씬 빠르게 나아가고 있으며, 그만큼 고객의 요구, 제품 판단, 그리고 풀어야 할 올바른 문제에 집중할 시간이 늘었습니다. Datadog에서는 누군가 Claude로 좋은 것을 만들면 빠르게 퍼집니다.”</p></blockquote>
  <p class="who">Yanbing Li, Datadog 최고제품책임자(CPO)</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors/gusto.svg" alt="Gusto" loading="lazy">
  <blockquote><p>Gusto에서는 상업 법무팀의 한 구성원이 몇 시간 만에, 협상된 조건을 서명 가능한 계약서로 바꿔 주는 도구를 만들었습니다. 처리 기간은 일주일 넘게 걸리던 것이 몇 시간으로 줄었고, 협상된 내용은 여전히 그 담당자가 검토합니다.</p></blockquote>
  <p class="who">Gusto</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors/hubspot.svg" alt="HubSpot" loading="lazy">
  <blockquote><p>“Claude와 HubSpot이 매끄럽게 함께 동작하기 때문에, 저희 CSM(고객 성공 매니저)들은 모든 통화에 대비할 수 있는 컨텍스트를 다 갖추고 들어갑니다. Claude의 라이브 대시보드가 HubSpot에서 데이터를 가져와 각 통화에서 중요한 것과 다음에 연락할 고객을 보여 주고, 후속 이메일은 통화가 끝난 지 30분 안에 초안이 작성됩니다. 매주 몇 시간씩 걸리던 일이 이제 백그라운드에서 돌아가므로, 저희 팀은 고객이 더 나은 솔루션을 만들고, 가치를 입증하고, 더 잘 성장하도록 돕는 데 집중할 수 있습니다.”</p></blockquote>
  <p class="who">Jon Dick, HubSpot 최고고객책임자(CCO)</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors/accenture.svg" alt="Accenture" loading="lazy">
  <blockquote><p>“Accenture에서 Claude는 법무팀의 일하는 방식을 바꾸는 데 도움을 주고 있습니다. 법무 워크플로를 새롭게 구상하고, 법무 전문가들이 비즈니스를 지원할 새로운 방법을 열어 갈 기회에 기대가 큽니다.”</p></blockquote>
  <p class="who">Mindy Lok, Accenture 법무 최고기술책임자(Legal CTO) 겸 최고지식재산책임자(CIPO)</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/more-ways-to-work-with-claude-sheets-whiteboards-and-interactive-connectors/advantage-solutions.svg" alt="Advantage Solutions" loading="lazy">
  <blockquote><p>“저희 FP&amp;A 팀은 예측 주기마다 슬라이드, 코멘터리, 검증에 약 10시간을 쓰곤 했습니다. 그 취합 작업을 Claude로 자동화해 30분 미만으로 줄였습니다. Claude가 그 일을 모두 덜어 줬습니다. 이제 저희는 재무팀이 원래 해야 할 일, 즉 인사이트를 찾고 의사결정을 이끄는 일을 하고 있습니다. 이 정도 규모의 사업을 지원하는 팀에게는 의미 있는 변화입니다.”</p></blockquote>
  <p class="who">Ash Gupta, Advantage Solutions 재무 계획·분석(FP&amp;A) 디렉터</p>
</div>

<h2 id="built-for-and-with-enterprises">엔터프라이즈를 위해, 엔터프라이즈와 함께</h2>

<p>Claude가 더 많은 도구에 연결되기 시작하면서, 기업에는 Claude의 접근 권한과 동작을 감독할 더 나은 방법이 필요합니다. 저희는 기업이 자체 요구 사항을 충족할 수 있도록 보안·컴플라이언스 제어 기능을 기본으로 넣고 있으며, 저희의 가장 민감한 업무에도 같은 Claude를 사용합니다. Enterprise 플랜에서는 관리자가 누가 어떤 제품과 커넥터를 쓸 수 있는지 결정하고, 조직의 지출 한도를 세밀하게 설정할 수 있습니다.</p>

<p>이 제어는 Claude가 연결하는 도구에도 적용됩니다. 자격 요건을 갖춘 Team·Enterprise 플랜에서 베타로 제공되는 <a href="https://support.claude.com/en/articles/15537633-auto-connect-your-organization-s-apps-to-claude" target="_blank" rel="noopener noreferrer"><strong>Claude 자동 연결(auto-connect)</strong></a>을 사용하면, Notion, Atlassian, Dropbox 같은 앱 연결은 한 번만 설정하면 됩니다. 이후 직원들은 각자 하나하나 연결할 필요 없이, Claude에서 해당 도구를 처음 사용할 때 자동으로 연결됩니다.</p>

<p>어떤 방식으로 도구를 연결하든 Claude는 기존 권한 안에서 동작합니다. 관리자는 각 커넥터가 할 수 있는 일을 제한할 수도 있습니다. 예를 들어 Claude가 Slack을 읽을 수는 있지만 사용자를 대신해 메시지를 보내지는 못하게 할 수 있습니다.</p>

<p>민감한 비즈니스 데이터를 보호하는 일은 저희가 제품을 만드는 방식의 핵심이며, Claude가 더 길고 복잡한 작업을 맡게 되면서 그 보호 장치를 계속 강화하고 있습니다.</p>

<ul>
  <li><a href="https://claude.com/resources/articles/unified-claude-enterprise" target="_blank" rel="noopener noreferrer">Enterprise 조직의 데이터</a>는 전송 중과 저장 시 모두 암호화됩니다.</li>
  <li>Enterprise 플랜에서는 보안 팀이 감사 로그와, Splunk·CrowdStrike를 포함한 100개 이상의 보안·컴플라이언스 도구와 연동되는 Compliance API를 통해 <a href="https://support.claude.com/en/articles/15167101-get-started-with-claude-compliance-api-integrations" target="_blank" rel="noopener noreferrer">Claude가 어떻게 사용되고 있는지 확인할 수 있습니다</a>.</li>
  <li>Enterprise의 새로운 Claude 경험에서는 각 클라우드 세션이 자체 <a href="https://claude.com/resources/articles/unified-claude-enterprise" target="_blank" rel="noopener noreferrer">격리된 가상 머신(isolated virtual machine)</a>에서 실행되며, 커넥터 자격 증명은 그 바깥에 보관됩니다.</li>
</ul>

<h2 id="work-that-keeps-up-with-your-ideas">아이디어의 속도를 따라오는 일</h2>

<p>현대의 업무는 소프트웨어를 중심으로 짜여 있지만, Claude는 여러분을 중심으로 일합니다. Claude는 여러분이 연결한 도구를 통해 팀의 업무를 파악하고, 필요한 형식으로 아이디어를 현실로 만들도록 돕고, 관리자가 정한 제어 범위 안에서 동작합니다. 그만큼 여러분은 집중하고 큰 목표를 향해 나아갈 시간을 더 얻게 됩니다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
