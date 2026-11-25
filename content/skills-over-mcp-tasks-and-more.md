---
slug: "skills-over-mcp-tasks-and-more"
title: "이제 MCP 서버가 Claude와 함께 스킬을 제공하고, 작업을 실행하는 등 더 많은 일을 할 수 있습니다"
nav: "Skills over MCP·Tasks·Elicitation · 서버가 도구와 함께 스킬 제공(공개 베타, 필요할 때만 로드·서버와 함께 업데이트, Shopify·HubSpot·Atlassian·Carta), Tasks(오래 걸리는 작업 백그라운드 위임, ZoomInfo)·Elicitation(호출 중 사용자 확인, Supabase·Railway·GitHub) 정식 출시, File Uploads 곧 출시, SDK 월 7억 다운로드·커넥터 1만 개+, 도구 검색 컨텍스트 85%+ 절감"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-24"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h2 .num { color: var(--accent); font-size: 0.85em; margin-right: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .video-title { color: var(--muted); font-size: 0.85rem; text-align: center; margin: 0 0 24px; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .callout h4 { margin: 4px 0 6px; font-size: 1rem; }\n  .callout p:last-child { margin-bottom: 0; }\n  .logos { display:flex; flex-wrap:wrap; gap:10px; margin:16px 0 24px; padding:0; list-style:none; }\n  .logos li { margin:0; }\n  .logos img { height:44px; width:auto; border:1px solid var(--line); border-radius:6px;\n    background:#fff; padding:8px 10px; display:block; }\n  table { border-collapse: collapse; width: 100%; margin: 16px 0 24px; font-size: 0.88rem; }\n  th, td { border: 1px solid var(--line); padding: 6px 8px; text-align: center; }\n  th { background: #faf8f6; font-weight: 600; }\n  td:first-child { text-align: left; font-weight: 600; }\n  .stats { display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px; margin: 20px 0 24px; }\n  .stat { border:1px solid var(--line); border-radius:8px; padding:14px 16px; }\n  .stat img { height:22px; width:auto; display:block; margin-bottom:10px; }\n  .stat b { display:block; font-size:1.5rem; color:var(--accent); line-height:1.3; }\n  .stat span { color:var(--muted); font-size:0.86rem; }\n  .toc { border:1px solid var(--line); border-radius:8px; padding:14px 18px; margin: 16px 0 24px; }\n  .toc p { margin:0 0 6px; font-weight:600; }\n  .toc ol { margin:0; }\n  .setup { border:1px solid var(--line); border-radius:10px; padding:16px 18px; margin: 16px 0 24px; background:#fcfcfb; }\n  .setup > p:first-child { font-weight:600; margin-bottom:10px; }\n  .setup dl { margin:0; }\n  .setup dt { font-weight:600; font-size:0.9rem; color:var(--accent); margin-top:10px; }\n  .setup dd { margin: 2px 0 0; }\n  .setup dd.instr { background:#fff; border:1px solid var(--line); border-radius:6px; padding:10px 12px; font-size:0.92rem; }\n  .setup details { margin-top:8px; font-size:0.85rem; color:var(--muted); }\n  .setup details p { margin:6px 0 0; font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size:0.8rem; line-height:1.55; }\n  .q { display:flex; gap:14px; align-items:flex-start; margin: 22px 0;\n    background:#fafafa; border:1px solid var(--line); border-radius:10px; padding:16px 18px; }\n  .q img { width:52px; height:52px; border-radius:50%; object-fit:cover; flex:0 0 52px;\n    border:1px solid var(--line); }\n  .q blockquote { margin:0 0 8px; padding:0; border:none; color:#222; }\n  .q .who { margin:0; font-size:0.86rem; color:var(--muted); }\n  .checklist { list-style:none; padding-left:0; }\n  .checklist li { position:relative; padding-left:30px; margin-bottom:14px; }\n  .checklist li::before { content:\"☐\"; position:absolute; left:0; top:0; color:var(--accent); font-size:1.1rem; }\n  .checklist li > strong { display:block; }\n  .checklist li p { margin: 4px 0 8px; }\n  .phase { font-weight:700; margin: 24px 0 8px; color:#000; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .tbl { overflow-x:auto; margin: 16px 0 24px; }\n  .tbl table { margin:0; }\n  .tbl th, .tbl td { text-align:left; vertical-align:top; min-width:140px; }\n  .eyebrow { display:block; color:var(--accent); font-size:0.8rem; font-weight:700; letter-spacing:0.02em; margin-bottom:2px; }\n  .cta { display:inline-block; margin: 4px 0 16px; padding:8px 14px; border:1px solid var(--accent); border-radius:6px; text-decoration:none; }\n  .cust { margin: 22px 0; background:#fafafa; border:1px solid var(--line); border-radius:10px; padding:16px 18px; }\n  .cust img { height:26px; width:auto; display:block; margin-bottom:12px; }\n  .cust blockquote { margin:0 0 8px; padding:0; border:none; color:#222; }\n  .cust .who { margin:0; font-size:0.86rem; color:var(--muted); }"
has_markdown: false
markdown_length: 0
html_length: 7559
---

<!-- rendered HTML -->
<header>
  <h1>이제 MCP 서버가 Claude와 함께 스킬을 제공하고, 작업을 실행하는 등 더 많은 일을 할 수 있습니다</h1>
  <div class="meta">
    2026년 11월 24일
    · 카테고리: <a href="https://claude.com/resources/product-updates">Product updates</a>
    · 제품: Claude apps, Claude Platform
    · 읽는 시간 6분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/skills-over-mcp-tasks-and-more">MCP servers can now ship skills, run tasks, and more with Claude by Anthropic</a>
      (한글 번역본)</span>
  </div>
</header>

<div class="toc">
  <p>목차</p>
  <ol>
    <li><a href="#ship-expertise-alongside-tools-with-skills-over-mcp">Skills over MCP로 도구와 함께 전문 지식 제공하기</a></li>
    <li><a href="#mcp-servers-can-now-take-on-long-running-interactive-work-with-claude">이제 MCP 서버가 Claude와 함께 오래 걸리는 상호작용형 작업을 맡을 수 있습니다</a></li>
    <li><a href="#add-support-to-your-plugins-today">지금 바로 플러그인에 지원을 추가하세요</a></li>
    <li><a href="#built-on-stronger-foundations-for-connecting-agents-in-production">프로덕션 환경에서 에이전트를 연결하기 위한 더 튼튼한 기반</a></li>
    <li><a href="#thank-you-to-the-mcp-community">MCP 커뮤니티에 감사드립니다</a></li>
  </ol>
</div>

<p>이제 Claude에서 Skills over MCP가 공개 베타로 제공되어, MCP 서버가 도구(tool)와 함께 스킬(skill)도 제공할 수 있습니다. 또한 서버가 Claude와 함께 더 길고 상호작용이 많은 작업을 처리할 수 있는 방법도 제공합니다. Tasks와 Elicitation이 정식 출시(GA)되었고, File Uploads도 곧 순차 출시됩니다.</p>

<p>2년 전, Anthropic은 AI 에이전트를 데이터가 있는 시스템에 연결하기 위한 새로운 표준으로 <a href="https://www.anthropic.com/news/model-context-protocol">Model Context Protocol(MCP)을 출시했습니다</a>. 이 사양(spec)은 프로덕션 환경에서 에이전트가 필요로 하는 연결성을 충족하도록 계속 발전해 왔으며, 에이전트 간 메시징과 오케스트레이션(orchestration)의 기반이 되어 가고 있습니다.</p>

<p>오늘의 업데이트로 Claude는 다른 에이전트와 일하듯이 서버와 일할 수 있게 됩니다. 서버로부터 배우고, 서버에 작업을 위임하고, 그 과정에서 입력과 파일을 주고받는 것입니다.</p>

<h2 id="ship-expertise-alongside-tools-with-skills-over-mcp">Skills over MCP로 도구와 함께 전문 지식 제공하기</h2>

<p>도구의 이름과 설명은 서버가 무엇을 할 수 있는지 Claude에게 알려 주지만, 특정 사용 사례를 어떻게 처리해야 하는지까지는 다루지 않습니다. <a href="https://modelcontextprotocol.io/extensions/skills/overview">Skills over MCP</a>를 이용하면 서버가 도구와 함께 스킬을 게시해, Claude가 더 길고 여러 단계로 이루어진 작업을 맡도록 도울 수 있습니다. Claude는 필요할 때만 스킬을 불러오므로 컨텍스트 사용량이 적게 유지됩니다. 스킬은 서버와 함께 업데이트되므로, 개발자는 도구와 사용 지침을 함께 배포할 수 있고 사용자는 따로 설치할 것이 없습니다.</p>

<p>스킬에는 모범 사례, 단계별 워크플로, 심지어 사용자의 계정이나 조직에 맞춘 플레이북(playbook)까지 담을 수 있습니다. Skills over MCP를 활용한 예시는 다음과 같습니다.</p>
<ul>
  <li><a href="https://claude.com/marketplace/connectors/shopify">Shopify</a>는 Claude가 판매자의 온라인 스토어를 처음부터 끝까지 디자인하고 업데이트하도록 돕습니다.</li>
  <li><a href="https://claude.com/marketplace/connectors/hubspot">HubSpot</a>은 고객을 온보딩하고 Claude에서 쓸 수 있도록 설정해 줍니다.</li>
  <li><a href="https://claude.com/marketplace/connectors/atlassian">Atlassian</a>은 Claude가 깊이 있는 조직 컨텍스트를 바탕으로 인사이트를 도출하고 업무를 분석하도록 돕습니다.</li>
  <li><a href="https://claude.com/marketplace/connectors/carta">Carta</a>는 업로드한 문서를 바탕으로 Claude가 지분(equity)을 작성하고 발행하도록 도울 예정입니다(곧 제공).</li>
</ul>

<p>Skills over MCP는 Claude와 Claude Code에서 공개 베타로 제공됩니다. Pro, Max, Ultra 요금제에서는 기본으로 켜져 있고, Team 요금제에서는 관리자가 활성화하면 사용할 수 있습니다. Enterprise에도 곧 제공될 예정입니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/skills-over-mcp-tasks-and-more/skills-over-mcp.png" alt="Skills over MCP(베타): MCP 서버가 Claude에 세 계층을 제공한다. 스킬은 사용자나 조직별로 맞춘 도메인 지식을, 도구는 Claude가 수행할 수 있는 동작을, 리소스는 Claude가 가져올 수 있는 컨텍스트를 담는다. 스킬은 필요할 때만 로드되며 서버와 함께 업데이트된다." loading="lazy">
</figure>

<h2 id="mcp-servers-can-now-take-on-long-running-interactive-work-with-claude">이제 MCP 서버가 Claude와 함께 오래 걸리는 상호작용형 작업을 맡을 수 있습니다</h2>

<p>프로덕션 환경의 에이전트는 점점 더 길고 중요한 일을 맡고 있습니다. 이제 서버는 그런 작업을 백그라운드에서 실행하고, 사용자에게 확인을 받고, Claude로부터 파일을 받는 방식으로 그 일을 지원할 수 있습니다.</p>

<p><strong><a href="https://modelcontextprotocol.io/extensions/tasks/overview">Tasks</a>로 오래 걸리는 작업 넘기기.</strong> 예전에는 도구 호출이 끝나야 Claude가 다음으로 넘어갈 수 있었습니다. Tasks를 이용하면 서버가 시간이 걸리는 작업, 심지어 에이전트 루프 전체를 실행하는 동안 Claude는 계속 일하다가 결과가 준비되면 이어받습니다. <a href="https://claude.com/marketplace/connectors/zoominfo">ZoomInfo</a>는 Tasks를 사용해, 이전에는 여러 번의 프롬프트가 필요했던 계정·연락처 심층 리서치를 수행합니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/skills-over-mcp-tasks-and-more/tasks.png" alt="Tasks: Claude가 오래 걸리는 작업을 MCP 서버에 넘기고, 계속 일하다가 결과가 준비되면 이어받는다." loading="lazy">
</figure>

<p><strong><a href="https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation">Elicitation</a>으로 호출 도중 입력 요청하기.</strong> 돈을 쓰거나 데이터를 삭제하는 것처럼, 어떤 동작은 사용자의 승인이 필요합니다. Elicitation을 이용하면 서버가 잠시 멈춰 폼이나 링크를 통해 사용자에게 입력을 요청한 뒤, 멈췄던 지점부터 이어서 진행할 수 있습니다. Elicitation을 활용한 예시는 다음과 같습니다.</p>
<ul>
  <li><a href="https://claude.com/marketplace/connectors/supabase">Supabase</a>는 유료 프로젝트를 만들기 전과 파괴적인(destructive) SQL을 실행하기 전에 비용을 확인받습니다.</li>
  <li><a href="https://claude.com/marketplace/connectors/railway">Railway</a>는 서비스 제거처럼 파괴적일 수 있는 변경을 하기 전에 먼저 묻습니다.</li>
  <li><a href="https://claude.com/marketplace/plugins/github">GitHub</a>는 에이전트가 저장소를 삭제하기 전에 사용자가 그 저장소의 이름을 직접 입력하게 합니다.</li>
</ul>

<p>Tasks와 Elicitation은 이제 Claude와 Claude Code에서 Pro, Max, Ultra 요금제에 정식 제공되며, Team과 Enterprise 조직에는 순차적으로 출시되고 있습니다.</p>

<p><strong><a href="https://github.com/modelcontextprotocol/experimental-ext-file-uploads">File Uploads</a>로 파일 주고받기.</strong> Claude는 텍스트뿐 아니라 파일도 MCP 서버에 넘길 수 있게 됩니다. File Uploads 확장은 PDF, 스프레드시트, 이미지를 컨텍스트 창을 거치지 않고 서버로 보냅니다.</p>

<p>File Uploads는 곧 Claude와 Claude Code에서 Pro, Max, Ultra 요금제와 대상이 되는 Team·Enterprise 요금제에 순차 출시됩니다.</p>

<h2 id="add-support-to-your-plugins-today">지금 바로 플러그인에 지원을 추가하세요</h2>

<p>이 기능들은 개방형 MCP 사양과 그 확장의 일부이므로, 이를 지원하는 서버는 Claude뿐 아니라 호환되는 모든 클라이언트에서 동작합니다. 지원을 추가하려면 <a href="https://code.claude.com/docs/en/mcp#use-skills-from-mcp-servers">Skills over MCP</a>, <a href="https://code.claude.com/docs/en/mcp#mcp-tasks-for-server-authors">Tasks</a>, <a href="https://code.claude.com/docs/en/mcp#respond-to-mcp-elicitation-requests">Elicitation</a>, <a href="https://claude.com/docs/connectors/building/files?open_in_browser=1">File Uploads</a> 문서를 참고하세요.</p>

<h2 id="built-on-stronger-foundations-for-connecting-agents-in-production">프로덕션 환경에서 에이전트를 연결하기 위한 더 튼튼한 기반</h2>

<p>AI 생태계 전반의 기여 덕분에 MCP SDK는 이제 매달 7억 회 이상 다운로드되고, Claude용 MCP 커넥터는 1만 개가 넘습니다. 우리는 MCP 커뮤니티와 함께 Claude에서 MCP가 동작하는 방식을 개선해 왔습니다. 지난 1년 동안 MCP는 다음과 같이 바뀌었습니다.</p>
<ul>
  <li><strong>토큰 효율 향상:</strong> <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool">도구 검색(Tool search)</a>은 필요할 때만 도구 정의를 불러오므로, 여러 서버를 쓰는 구성에서 도구 정의가 차지하는 컨텍스트를 85% 넘게 줄일 수 있습니다.</li>
  <li><strong>확장이 더 쉬워짐:</strong> <a href="https://claude.com/resources/articles/bringing-mcp-2026-07-28-to-claude">최신 MCP 사양</a>은 무상태(stateless)이며 Claude 제품 전반에서 지원되므로, 서버를 만들기가 쉽고 서버가 커져도 안정성을 유지하기가 수월합니다.</li>
  <li><strong>인증이 더 간단해짐:</strong> <a href="https://claude.com/docs/connectors/building/enterprise-managed-auth">Enterprise Managed Auth</a> 확장을 쓰면 관리자가 지원되는 서버를 한 번만 인증해 두면 되고, 사용자는 자동으로 연결됩니다.</li>
  <li><strong>상호작용성 강화:</strong> <a href="https://claude.com/docs/connectors/building/mcp-apps/quickstart">MCP Apps</a> 확장은 완전한 인터페이스를 대화 옆이나 전체 화면으로 Claude 안에 가져옵니다.</li>
</ul>

<p>이런 개선이 모여 MCP는 그 위에 무언가를 만들고 도입하기가 더 쉬워졌고, 프로덕션 환경 에이전트의 요구에 맞춰 표준이 계속 발전해 나갈 튼튼한 기반을 갖추게 되었습니다.</p>

<h2 id="thank-you-to-the-mcp-community">MCP 커뮤니티에 감사드립니다</h2>

<p>MCP는 <a href="https://aaif.io/">Agentic AI Foundation</a>이 호스팅하고, 그 위에서 무언가를 만드는 사람들이 함께 만들어 가는 개방형 표준입니다. <a href="https://blog.modelcontextprotocol.io/posts/mcp-turns-two">2년간의 발전</a>은 사양을 작성하고, SDK를 만들고, 서버를 출시하고, 클라이언트 지원을 추가한 메인테이너, 기여자, 개발자들 덕분에 가능했습니다. MCP를 지금의 모습으로 만들어 주셔서 감사합니다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
