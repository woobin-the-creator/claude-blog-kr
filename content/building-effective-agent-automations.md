---
slug: "building-effective-agent-automations"
title: "효과적인 에이전트 자동화 만들기"
nav: "효과적인 에이전트 자동화 · Managed Agents 레퍼런스 구현, bookmark·ledger·vault·예산 상한, 흔한 실패 유형 6가지 규칙"
main: "claude.dev"
cat: "Agents"
date: "2026-10-08"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  .code-label { display:block; color: var(--muted); font-size: 0.75rem; letter-spacing: .04em;\n    text-transform: uppercase; margin: 0 0 4px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 18284
---

<!-- rendered HTML -->
<header>
  <h1>효과적인 에이전트 자동화 만들기</h1>
  <div class="meta">
    2026년 10월 8일
    · 카테고리: Agents
    · 글쓴이: Lance Martin, CJ Avilla
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/building-effective-agent-automations">Building effective agent automations</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">레퍼런스 구현을 따라가며 흔한 실패 유형까지 함께 살펴보는 안내서</p>

<p>AI가 우리 일을 가속할수록, 따라가기는 점점 어려워진다. Anthropic에서는 이를 돕기 위해 단순한 에이전트 자동화를 자주 쓴다. 이런 자동화는 보통 스케줄에 따라 돌고, 백그라운드에서 컨텍스트를 모으고, 우리가 알아야 할 것을 먼저 알려 준다. 하지만 효과적인 에이전트 자동화를 만드는 일은 어렵다. 아무도 눈치채지 못한 채 소스 접근 권한을 잃을 수도 있고, 우리의 선호를 따르지 못할 수도 있다.</p>

<p>우리는 <a href="https://platform.claude.com/docs/en/managed-agents/overview">Claude Managed Agents</a>(베타)를 사용해, 커스텀 소스(예: Slack과 GitHub 저장소)를 스케줄에 따라 읽고, 지난 실행 이후 무엇이 바뀌었는지 추적하고, 알아야 할 내용을 (예: Slack에) 올려 주는 레퍼런스 구현을 만들었다. 이 글에서는 각 단계를 하나씩 따라가며 레퍼런스 구현을 공유하고, 에이전트를 대신 구성해 주는 Claude Code 명령도 제공한다.</p>

<h2 id="get-the-code">코드 받기</h2>

<p>레퍼런스 구현은 <a href="https://github.com/anthropics/claude-quickstarts/tree/main/managed-agents/daily-brief">여기</a>에 있다. 대화형으로 따라가고 싶다면 Claude Code에서 아래 명령을 실행하자. <code>claude-api</code> 스킬이 이 글의 지침에 따라 에이전트 설정을 도와준다.</p>

<span class="code-label">Prompt</span>
<pre><code>/claude-api managed-agents-onboard https://claude.dev/blog/building-effective-agent-automations/</code></pre>

<p>이 레퍼런스 구현에는 Slack 앱(<a href="https://api.slack.com/apps?new_app=1&amp;manifest_yaml=display_information%3A%0A%20%20name%3A%20Daily%20brief%0A%20%20description%3A%20Posts%20one%20short%20brief%20each%20weekday%20morning.%0Afeatures%3A%0A%20%20bot_user%3A%0A%20%20%20%20display_name%3A%20Daily%20brief%0A%20%20%20%20always_online%3A%20false%0A%20%20app_home%3A%0A%20%20%20%20home_tab_enabled%3A%20false%0A%20%20%20%20messages_tab_enabled%3A%20true%0A%20%20%20%20messages_tab_read_only_enabled%3A%20true%0Aoauth_config%3A%0A%20%20scopes%3A%0A%20%20%20%20bot%3A%0A%20%20%20%20%20%20-%20channels%3Ahistory%0A%20%20%20%20%20%20-%20chat%3Awrite%0Asettings%3A%0A%20%20org_deploy_enabled%3A%20false%0A%20%20socket_mode_enabled%3A%20false%0A%20%20token_rotation_enabled%3A%20false%0A">manifest로 만들기</a>)과 <a href="https://github.com/settings/personal-access-tokens/new">GitHub 토큰</a>이 필요하다. 제공되는 파일(아래 참조)은 에이전트, 환경(environment), 메모리 스토어(memory store), 볼트(vault), 배포(deployment)를 포함한 Claude API 리소스의 설정이다.</p>

<span class="code-label">Text</span>
<pre><code>daily-brief/
├── agent.md                        모델, 도구, 지침
├── deployment.md                   스케줄, 시간대, 예산, 입력 메시지
├── environment.yaml                네트워크 allowlist
├── memory_store_preferences.yaml   사용자 선호
├── memory_store_state.yaml         에이전트의 bookmark, ledger, 노트, 실행 기록
├── vault.yaml                      자격 증명을 보관하는 vault
├── claude-lock.json                리소스 ID, ant apply가 기록
└── slack/manifest.yaml             봇 앱 하나</code></pre>

<p>ant CLI의 명령인 <a href="https://platform.claude.com/docs/en/cli-sdks-libraries/cli/apply"><code>ant apply</code></a>는 이 파일들을 읽어 여러분의 Claude API 워크스페이스(플랫폼이 리소스를 저장하고 실행하는 곳)에 리소스를 만들고, 그 ID를 <code>claude-lock.json</code>에 기록한다.</p>

<p>아래 절들에서 이 명령을 사용할 것이다. 한 번 구성해 두면 자동화는 Anthropic 인프라 위에서 스케줄에 따라 돌아가므로, 여러분의 머신에서 계속 켜 두어야 하는 것은 아무것도 없다.</p>

<h2 id="overview">개요</h2>

<p>우리가 만들 에이전트는 여섯 가지 구성 요소로 이루어지며, 다음 순서로 다룬다.</p>

<ul>
  <li>소스(Sources) - 읽을 장소를 이름 붙여 나열한 목록</li>
  <li>목적지(Destination) - 에이전트가 쓸 수 있는 단 한 곳</li>
  <li>에이전트(Agent) - agent.md에 담긴 모델, 도구, 실행 단계</li>
  <li>스케줄(Schedule) - cron 스케줄</li>
  <li>메모리(Memory) - 여러분의 선호와 에이전트 자신의 메모리</li>
  <li>가드레일(Guardrails) - 읽기만 하는 곳은 어디든 읽기 전용 접근, 그리고 실행 1회당 지출 상한</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/architecture.png" alt="에이전트 아키텍처: 스케줄이 에이전트를 깨우고, 에이전트는 소스에서 읽어 독자를 위한 브리프를 하나의 목적지에 올린다. 메모리는 에이전트의 상태와 독자의 선호를 담고, 가드레일이 에이전트를 둘러싼다." loading="lazy">
  <figcaption>에이전트 아키텍처: 스케줄이 에이전트를 깨우고, 에이전트는 소스에서 읽어 독자를 위한 브리프를 하나의 목적지에 올린다. 메모리는 에이전트의 상태와 독자의 선호를 담고, 가드레일이 에이전트를 둘러싼다.</figcaption>
</figure>

<h2 id="sources">소스</h2>

<p>에이전트는 기본 소스 두 가지, Slack 채널과 GitHub pull request를 읽는다. 채널과 저장소는 여러분의 <code>preferences</code> 파일에 나열한다. 템플릿은 다른 소스를 쓰도록 확장할 수 있다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/sources.png" alt="소스가 강조된 아키텍처 다이어그램. 소스는 읽기 전용이며, vault의 자격 증명으로 MCP나 HTTPS를 통해 접근해 에이전트에 공급된다." loading="lazy">
  <figcaption>소스(Sources)가 강조된 아키텍처 다이어그램. 소스는 읽기 전용이며, vault의 자격 증명으로 MCP나 HTTPS를 통해 접근해 에이전트에 공급된다.</figcaption>
</figure>

<h3 id="give-the-agent-its-own-scoped-credentials">에이전트에게 범위가 제한된 전용 자격 증명을 주자</h3>

<p><a href="https://platform.claude.com/docs/en/managed-agents/overview">Managed Agents</a>에서 자격 증명은 <a href="https://platform.claude.com/docs/en/managed-agents/vaults">vault</a>에 보관된다. 에이전트는 이 자격 증명을 참조할 수 있지만, 실제 값은 Claude의 코드가 실행되는 샌드박스 바깥의 vault에 그대로 머문다(<a href="https://www.anthropic.com/engineering/managed-agents">여기</a>와 <a href="https://x.com/katelyn_lesse/status/2099315903884415400">여기</a> 참조).</p>

<ul>
  <li><p><strong>MCP 서버(GitHub).</strong> 에이전트는 샌드박스 바깥에서 실행되는 프록시를 통해 MCP 도구를 호출한다. 프록시는 서버의 URL과 일치하는 vault 자격 증명을 찾는다.</p></li>
  <li><p><strong>셸(Slack).</strong> 에이전트는 샌드박스 안에서 bash 도구로 curl을 사용해 Slack API를 호출한다. 샌드박스는 불투명한 자리 표시자 <code>$SLACK_BOT_TOKEN</code>만 들고 있다. 요청이 샌드박스를 벗어날 때, 플랫폼이 여러분이 허용한 호스트에 대해 실제 토큰으로 바꿔 넣는다.</p></li>
</ul>

<p><code>ant</code> CLI와 저장소의 템플릿 파일로 vault를 만들자.</p>

<span class="code-label">Shell</span>
<pre><code>ant apply vault.yaml</code></pre>

<p>이 명령은 여러분의 Claude API 워크스페이스에 vault를 만들고(플랫폼이 보관한다), 그 ID를 <code>claude-lock.json</code>에 기록한다. 그다음 <a href="https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript">TypeScript SDK</a>로 각 자격 증명을 vault에 추가한다. 다음은 Slack 자격 증명을 추가하는 예시다.</p>

<span class="code-label">TypeScript</span>
<pre><code>const vaultId = process.env.VAULT_ID!; // vault의 ID, claude-lock.json에서 가져온다
await client.beta.vaults.credentials.create(vaultId, {
  display_name: "SLACK_BOT_TOKEN",
  auth: {
    type: "environment_variable",
    secret_name: "SLACK_BOT_TOKEN",
    secret_value: process.env.SLACK_BOT_TOKEN!,
    networking: { type: "limited", allowed_hosts: ["slack.com"] },
    injection_location: { header: true },
  },
});</code></pre>

<p>vault를 만들고 각 자격 증명을 추가한 뒤에는, vault를 배포에 연결한다. <code>claude-lock.json</code>의 vault ID를 배포 파일 <code>deployment.md</code>의 <code>vault_ids</code>에 복사해 넣으면 된다.</p>

<h3 id="read-from-where-you-left-off">멈춘 자리에서 이어서 읽자</h3>

<p>흔한 실수는 에이전트에게 "<em>지난 24시간</em>" 같은 고정된 창을 읽으라고 하는 것이다. 실행이 늦어지면 빈틈이 생기고, 실행이 일러지면 항목이 반복된다. 대신 소스마다 bookmark를 하나씩 주자. 매 실행이 끝날 때 에이전트는 각 소스에서 읽은 가장 새로운 항목의 타임스탬프를 <code>bookmarks.json</code> 파일 하나에, 소스별 항목으로 기록한다. 예: <code>"slack": "2026-09-14T13:02:11Z"</code>.</p>

<p>다음 실행은 그 bookmark에서 시작하므로, 읽는 창이 지난 실행 이후의 모든 것을 덮도록 늘어나거나 줄어든다. bookmark는 <code>state</code>라는 <a href="https://platform.claude.com/docs/en/managed-agents/memory">memory store</a>에 들어 있다. 이것은 텍스트 파일 폴더인데, 플랫폼이 매 실행의 샌드박스에 <code>/mnt/memory/</code> 아래로 마운트하고 실행 사이에도 보존한다. 에이전트는 평범한 파일 도구로 이를 읽고 쓰며, 그 방법은 <code>agent.md</code>의 지침이 알려 준다.</p>

<h3 id="dont-mistake-a-failed-read-for-a-quiet-day">읽기 실패를 조용한 하루로 착각하지 말자</h3>

<p>MCP 서버가 다운되었거나 토큰이 만료되었어도, 실행은 그대로 시작된다. 다만 그 서버의 도구만 빠진 채로. 세션은 오류를 로그에 남기지만, 에이전트는 그 소스에서 아무것도 보지 못하고 "새로운 것 없음"이라고 보고한다.</p>

<p><code>agent.md</code>의 규칙 세 가지가 이를 바로잡는다. 소스가 실패하면 에이전트는 그 소스의 bookmark를 그 자리에 그대로 두고, 나머지 소스로 브리프를 작성하고, 읽을 수 없었던 것을 한 줄로 밝히며 브리프를 끝낸다("이번 실행에서는 pull request를 읽을 수 없었음"). 그래서 독자가 그 사실을 알게 된다.</p>

<h2 id="destination">목적지</h2>

<p>우리 템플릿은 Slack 채널 하나에, 실행마다 날짜가 붙은 글을 올린다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/destination.png" alt="목적지가 강조된 아키텍처 다이어그램. 오늘의 브리프가 이미 올라가 있지 않은지 확인한 뒤, 에이전트는 하나의 목적지에 올리고, 그 목적지가 독자에게 브리프를 전달한다." loading="lazy">
  <figcaption>목적지(Destination)가 강조된 아키텍처 다이어그램. 오늘의 브리프가 이미 올라가 있지 않은지 확인한 뒤, 에이전트는 하나의 목적지에 올리고, 그 목적지가 독자에게 브리프를 전달한다.</figcaption>
</figure>

<p>에이전트는 샌드박스 안의 bash 도구로 Slack에 글을 올린다. 읽을 때 쓴 것과 같은 봇 토큰을 사용한다.</p>

<p>글을 올리는 데 누구의 승인도 필요하지 않다. 에이전트는 bash 명령으로 글을 보내고, 내장 bash 도구는 기본적으로 승인을 묻지 않고 실행된다. <code>slack.com</code>은 에이전트가 실행되는 샌드박스인 <a href="https://platform.claude.com/docs/en/managed-agents/environments">environment</a>의 allowlist에도 들어 있다. 게시는 요청 하나다.</p>

<span class="code-label">Shell</span>
<pre><code>curl -s https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"channel": "C0123456789", "text": "Daily brief, Tue Sep 15 ..."}'</code></pre>

<h3 id="confirm-the-post-landed-before-recording-it">기록하기 전에 글이 실제로 올라갔는지 확인하자</h3>

<p>게시가 확인되면 에이전트는 보고한 항목의 ledger와 bookmark를 갱신한다. 이 기록이 실제로 올라간 것과 맞지 않으면 두 가지가 잘못될 수 있다. 에이전트가 실제로는 올라가지 않은 글을 기록하면, bookmark는 앞으로 넘어가고 그 항목들은 영영 보고되지 않는다. 첫 글이 올라갔는지 확신하지 못해 다시 올리면, 독자는 같은 브리프를 두 번 받는다.</p>

<p><code>agent.md</code>의 규칙 세 가지가 이를 막는다. 첫째, 에이전트는 채널의 최근 메시지에서 오늘 제목을 찾아보고, 그 호가 이미 있으면 올리지 않는다. 둘째, Slack이 <code>"ok": true</code>와 메시지 ts를 돌려줄 때만 게시된 것으로 친다. 셋째, 에이전트는 그 확인 뒤에만 ledger와 bookmark를 갱신한다. 결과가 불분명하면 실행을 "maybe posted"로 표시하고 다른 것은 아무것도 바꾸지 않는다. 그래서 아무것도 잃지 않는다.</p>

<p>에이전트는 memory store에 실행 기록(<code>runs/&lt;date&gt;.md</code>)을 남긴다. 게시 전에 실행을 "posting"으로 표시하고, 그다음 메시지 ID와 함께 "posted"로, 또는 "maybe posted"로 표시한다.</p>

<h2 id="agent">에이전트</h2>

<p>Claude Managed Agents에서 <a href="https://platform.claude.com/docs/en/managed-agents/agent-setup">agent</a>는 버전이 관리되는 설정이다. 모델, 시스템 프롬프트, 도구로 이루어진다. 각 실행은 자기 실행 단계를 따른 뒤 멈춘다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/agent.png" alt="에이전트가 강조된 아키텍처 다이어그램: 모델에, 실행 루프와 판단 규칙을 담은 프롬프트를 더한 것." loading="lazy">
  <figcaption>에이전트(Agent)가 강조된 아키텍처 다이어그램: 모델에, 실행 루프와 판단 규칙을 담은 프롬프트를 더한 것.</figcaption>
</figure>

<p>우리 레퍼런스 구현에서 에이전트 설정은 <code>agent.md</code>다.</p>

<span class="code-label">Markdown</span>
<pre><code>---
name: Daily brief
model: claude-sonnet-5-5
mcp_servers:
  - type: url
    name: github
    url: https://api.githubcopilot.com/mcp/
tools:
  - type: agent_toolset_20260401
    configs:
      - name: web_search
        enabled: false
      - name: web_fetch
        enabled: false
  - type: mcp_toolset
    mcp_server_name: github
    default_config:
      permission_policy:
        type: always_allow
---
[번호가 붙은 실행 단계 8개. 전체 텍스트는 저장소의 agent.md에 있다.]</code></pre>

<p>frontmatter는 에이전트 이름, 모델, 도구, MCP 서버를 지정한다. 본문은 에이전트 지침을 제공한다. MCP 도구는 기본적으로 승인을 요구하는데 승인해 줄 사람이 아무도 없으므로, GitHub toolset은 <code>always_allow</code>로 설정하고 GitHub 토큰은 <code>read-only</code>로 둔다.</p>

<h3 id="keep-the-brief-short">브리프는 짧게</h3>

<p><code>agent.md</code>는 Claude를 간결함 쪽으로 이끈다.</p>

<span class="code-label">Text</span>
<pre><code>4. 결정하라. 독자가 오늘 그것에 대해 행동할 때, 또는 그것이 독자가 곧 내릴 결정을 바꿀 때 항목은 한 줄을 차지할 자격이 있다. 확신이 없으면 빼라. 대부분의 날에는 몇 개, 때로는 하나도 없다. 개수("열린 리뷰 12개")는 항목이 아니다. 막혀 있는 것들을 링크하라. 이미 ledger에 있고 아직 열려 있는 항목은 표시가 붙은 한 줄("still waiting, day 3")로 이어 가고, 다시 보고하지 않는다. 닫힌 항목은 아무 말 없이 떨어뜨린다. preferences 파일이 은퇴시킨 주제를 되살리지 마라.</code></pre>

<h3 id="re-check-anything-still-open-right-before-posting">게시 직전에 아직 열려 있는 것을 다시 확인하자</h3>

<p>에이전트가 소스를 읽는 시점과 게시하는 시점 사이에 항목은 바뀔 수 있다. 게시 직전에 <code>agent.md</code>는 에이전트에게 각 항목의 실시간 상태를 다시 확인하라고 지시한다.</p>

<span class="code-label">Text</span>
<pre><code>5. 검증하라. 네가 읽는 동안 세상은 움직였다. 보고할 모든 항목에 대해 게시 직전에 실시간 소스를 다시 확인하라. 읽은 뒤 해결되었으면 떨어뜨리고, 아직 열려 있지만 바뀌었으면 그 줄을 고치고, 확인할 수 없으면 떨어뜨린 뒤 실행 기록의 cuts에 적어라. 낡은 "still waiting on you" 하나는 빠진 항목 열 개보다 더 많은 신뢰를 잃게 하므로, 항목의 상태를 절대 얼버무리지 마라. 단언하거나 떨어뜨려라. 모든 링크는 소스 자체의 링크 필드(pull request의 html_url, Slack permalink)에서 복사하고, 절대 손으로 조립하지 마라.</code></pre>

<h2 id="schedule">스케줄</h2>

<p>Claude Managed Agents에서 에이전트는 설정 파일일 뿐이다. 이를 실행하는 것은 <a href="https://platform.claude.com/docs/en/managed-agents/scheduled-deployments">deployment</a>다. deployment는 에이전트, environment, 그리고 각 실행의 첫 메시지를 지정한다. 스케줄, vault, memory store, 예산도 여기에 담긴다. 스케줄이 발동할 때마다 플랫폼은 새 에이전트 <a href="https://platform.claude.com/docs/en/managed-agents/sessions">session</a>을 시작한다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/schedule.png" alt="스케줄이 강조된 아키텍처 다이어그램: 실행마다 에이전트를 깨우는 scheduled deployment." loading="lazy">
  <figcaption>스케줄(Schedule)이 강조된 아키텍처 다이어그램: 실행마다 에이전트를 깨우는 scheduled deployment.</figcaption>
</figure>

<p>우리 템플릿에서 deployment는 <code>deployment.md</code>에 담기며, 본문이 첫 메시지다.</p>

<span class="code-label">Markdown</span>
<pre><code>---
name: Daily brief
agent: ./agent.md
environment_id: ./environment.yaml
schedule:
  type: cron
  expression: "32 7 * * 1-5"
  timezone: America/New_York
vault_ids: [vlt_...]   # 소스 절에서 만든 vault
resources:
  - path: ./memory_store_preferences.yaml
    access: read_only
    instructions: The reader's preferences. Re-read them every run. Never write here.
  - path: ./memory_store_state.yaml
    access: read_write
    instructions: Your state. Bookmarks, ledger, notes, proposals, and run records.
---
Write today's brief.
The reader's time zone is America/New_York. Work out every date in that zone.
Follow your run steps in order. Today's edition is titled "Daily brief, &lt;weekday&gt; &lt;month&gt; &lt;day&gt;".</code></pre>

<p>다음 명령은 경로로 지정한 에이전트, environment, memory store와 함께 deployment를 만든다.</p>

<span class="code-label">Shell</span>
<pre><code>ant apply deployment.md</code></pre>

<p>스케줄을 기다리지 않고 테스트하려면, <code>claude-lock.json</code>의 ID를 사용해 <code>ant beta:deployments run --deployment-id &lt;id&gt;</code>로 실행을 직접 시작하면 된다.</p>

<h3 id="compute-dates-in-your-time-zone">날짜는 여러분의 시간대로 계산하자</h3>

<p>흔한 버그는 에이전트가 서버의 시간대로 날짜를 계산해서 오늘 아침을 "어제"라고 부르는 것이다. <code>deployment.md</code>에서 <code>timezone</code> 필드는 실행이 발동하는 시점을 정하고, 본문 둘째 줄은 에이전트에게 날짜 계산에 어느 시간대를 쓸지 알려 준다.</p>

<h2 id="memory">메모리</h2>

<p>각 실행은 지난 실행에 대한 기억이 전혀 없는 새 샌드박스에서 시작한다. 메모리가 없으면 피드백이 남지 않는다. 그러나 낡은 메모리는 에이전트를 혼란스럽게 할 수 있다. 이미 해결된 항목을 아직 대기 중이라고 보고하거나, 아직 열려 있는 항목을 "이미 보고했다"는 이유로 떨어뜨리는 식이다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/memory.png" alt="메모리가 강조된 아키텍처 다이어그램. State는 에이전트가 읽고 쓰는 것이고, Preferences는 독자가 쓰고 에이전트는 읽기만 하는 것이다." loading="lazy">
  <figcaption>메모리(Memory)가 강조된 아키텍처 다이어그램. State는 에이전트가 읽고 쓰는 것이고, Preferences는 독자가 쓰고 에이전트는 읽기만 하는 것이다.</figcaption>
</figure>

<p>우리 템플릿은 <a href="https://platform.claude.com/docs/en/managed-agents/memory">memory store</a> 두 개를 둔다. /mnt/memory/ 아래에 마운트되는 폴더들이다(소스 절 참조).</p>

<ul>
  <li><p><strong>preferences</strong> (여러분의 것, 에이전트에게는 읽기 전용): 읽을 채널과 저장소, 빼야 할 것, 길이 상한, 목적지, 그리고 언제 멈출지.</p></li>
  <li><p><strong>state</strong> (에이전트의 것, 읽기·쓰기): bookmark, 보고한 것의 ledger, 실행마다 하나씩의 기록, 여러분의 선호에 대해 제안하는 변경, 그리고 각 소스가 어떻게 동작하는지에 대한 노트("가장 새로운 50개만 돌려준다").</p></li>
</ul>

<p><code>ant apply deployment.md</code>는 preferences store를 만들지만, 그 안의 파일은 만들지 않는다. 첫 실행 전에 저장소의 <code>scripts/seed-preferences.sh</code>로 여러분의 preferences.md를 거기에 써 두자.</p>

<h3 id="re-read-your-preferences-at-the-start-of-every-run">매 실행 시작 때 선호를 다시 읽자</h3>

<p>흔한 문제는 선호의 복사본이 프롬프트에 박혀 있어서, 이미 바꾼 규칙을 계속 적용하는 경우다. 에이전트가 매 실행마다 파일을 새로 읽게 하자. 파일을 읽을 수 없으면 기본값으로 실행하는 대신 멈추고 그렇다고 말해야 한다.</p>

<h3 id="keep-a-ledger-of-what-youve-already-reported-and-report-the-change">이미 보고한 것의 ledger를 유지하고, 변화를 보고하자</h3>

<p>에이전트는 보고한 모든 항목의 ledger인 <code>ledger.md</code>를 유지해서 브리프가 같은 말을 반복하지 않게 한다. 각 줄은 항목을 보고한 시점, 출처, 바뀌지 않는 ID(Slack 메시지 타임스탬프나 pull request 번호), 그리고 마지막으로 알려진 상태를 기록한다.</p>

<span class="code-label">Text</span>
<pre><code>2026-09-09 slack:C0123456789 1788963600.000100 refund thread: customer waiting on a decision
2026-09-11 github 481 review blocked, day 2 (still waiting)
2026-09-11 slack:C0234567891 1789117333.000300 enterprise escalation: owner named, in progress</code></pre>

<h2 id="guardrails">가드레일</h2>

<p>우리 자동화는 스케줄에 따라 "백그라운드"에서 돌기 때문에, 에이전트가 할 수 있는 일과 쓸 수 있는 돈에 한도를 둔다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-effective-agent-automations/guardrails.png" alt="가드레일이 강조된 아키텍처 다이어그램: 턴·시간·지출 상한을 갖춘 에이전트 주위의 경계와, 누군가 지켜보는 heartbeat." loading="lazy">
  <figcaption>가드레일(Guardrails)이 강조된 아키텍처 다이어그램: 턴·시간·지출 상한을 갖춘 에이전트 주위의 경계와, 누군가 지켜보는 heartbeat.</figcaption>
</figure>

<h3 id="limits-on-what-it-can-do">할 수 있는 일의 한도</h3>

<p>에이전트는 다른 사람이 쓴 메시지와 이슈를 읽고, 그 텍스트는 지시로 해석될 수 있다. 에이전트가 그 지시를 따랐을 때 할 수 있는 일을 제한하자. 우리 예시에서 GitHub 토큰과 <code>preferences</code> store는 읽기 전용이고, environment는 allowlist에 있는 호스트에만 닿는다. 심어진 지시는 여전히 브리프의 내용을 바꿀 수 있다. 에이전트가 실행 사이에 남기는 노트를 통해서도 그렇다. 하지만 GitHub에 쓰거나 여러분의 규칙을 고칠 수는 없다.</p>

<p>Slack은 예외다. 같은 토큰이 글을 올리므로, 봇은 읽거나 올려야 하는 곳에만 초대하자.</p>

<h3 id="set-the-spending-cap-from-real-runs">지출 상한은 실제 실행을 보고 정하자</h3>

<p>지출 상한은 비용 폭주로부터 여러분을 보호한다. 정상 실행 비용의 3~5배에서 시작한 뒤, 실제 수치를 보면서 조여 가자. 상한에 닿은 실행은 실패하는 대신 일시 중지되므로, 너무 낮게 잡은 상한은 조용해진 브리프처럼 보인다. 상한은 <code>deployment.md</code>의 <a href="https://platform.claude.com/docs/en/managed-agents/budgets"><code>budget</code></a>이다. 모든 실행은 전액을 받고, 상한에 도달한 실행은 <code>budget_reached</code> 중지 사유와 함께 일시 중지된다.</p>

<span class="code-label">YAML</span>
<pre><code>budget:
  type: limit
  max_list_cost:
    amount: "500" # 문자열, 센트 단위: "500"은 $5.00
    currency: USD</code></pre>

<h2 id="getting-started">시작하기</h2>

<p>우리 레퍼런스 구현은 여섯 가지 규칙으로 요약된다.</p>

<ul>
  <li>각 소스는 고정된 시간 창이 아니라 bookmark에서부터 읽는다.</li>
  <li>읽기 실패는 조용한 하루가 아니라 읽을 수 없었다고 보고한다.</li>
  <li>게시 직전에 모든 항목을 다시 확인한다.</li>
  <li>Slack이 확인해 줄 때만 게시된 것으로 치고, 그다음 bookmark와 ledger를 갱신한다.</li>
  <li>에이전트가 고칠 수 없는 store에서 매 실행마다 선호를 다시 읽는다.</li>
  <li>읽기만 하는 곳은 어디든 읽기 전용 접근을 주고, 실행마다 쓸 수 있는 금액에 상한을 둔다.</li>
</ul>

<p>Claude Code가 이 글의 지침을 따라 안내해 줄 수 있다. 먼저 업데이트하자.</p>

<span class="code-label">Shell</span>
<pre><code>claude update</code></pre>

<p>그다음 claude-api 스킬을 사용하자.</p>

<span class="code-label">Prompt</span>
<pre><code>/claude-api managed-agents-onboard https://claude.dev/blog/building-effective-agent-automations/</code></pre>

<p>claude-api 스킬은 이 글을 읽고, 설정을 제안하고, 프로젝트의 agents/ 폴더에 파일을 쓰고, ant apply로 리소스를 만든다. 이를 출발점으로 삼아 여러분의 소스, 목적지, 메모리 선호에 맞게 에이전트를 커스터마이즈하자.</p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
