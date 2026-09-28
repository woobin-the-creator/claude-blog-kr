---
slug: "claude-tag-now-supports-personal-connectors-in-channels"
title: "Claude Tag, 이제 채널에서 개인 커넥터를 지원합니다"
nav: "Claude Tag · 채널에서 개인 커넥터 지원"
main: "Claude blog"
cat: "Product announcements"
date: "2026-09-24"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  .quotes { display:grid; gap:18px; margin: 20px 0 8px; }\n  .quote { border:1px solid var(--line); border-radius: 10px; padding: 18px 20px; }\n  .quote img.logo { height: 26px; width:auto; display:block; margin-bottom: 12px; }\n  .quote p { margin: 0 0 10px; color:#333; }\n  .quote cite { display:block; font-style: normal; color: var(--muted); font-size: 0.85rem; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 4545
---

<!-- rendered HTML -->
<header>
  <h1>Claude Tag, 이제 채널에서 개인 커넥터를 지원합니다</h1>
  <div class="meta">
    2026년 9월 24일 · 읽는 시간 5분
    · 카테고리: <a href="https://claude.com/blog/category/announcements">Product announcements</a>,
    <a href="https://claude.com/blog/category/enterprise-ai">Enterprise AI</a>
    · 제품: <a href="https://claude.com/product/tag">Claude Tag</a>
    <span class="orig">원문:
      <a href="https://claude.com/blog/claude-tag-now-supports-personal-connectors-in-channels">Claude Tag now supports personal connectors in channels by Anthropic</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-tag-now-supports-personal-connectors-in-channels/hero.svg" alt="Claude Tag 일러스트"></figure>

<p class="lede"><a href="https://claude.com/product/tag">Claude Tag (베타)</a>를 쓰면 Slack 채널에 Claude를 추가해 팀과 나란히 일하게 할 수 있습니다. 지금까지 Claude는 <a href="https://claude.com/blog/agent-identity-access-model">관리자가 채널에 붙여 둔</a> 커넥터만 사용할 수 있었고, 대부분의 조직은 그 목록을 의도적으로 짧게 유지합니다. 접근 권한이 채널이 아니라 사람을 따라가길 원하기 때문입니다.</p>

<p>이제 Claude는 여러분이 채널에서 요청한 작업에 여러분 자신의 <a href="https://claude.com/docs/claude-tag/concepts/settings-map">커넥터</a>를 사용할 수 있습니다. 예를 들어 캘린더, 드라이브, CRM에서 배정받은 계정, 스테이징 배포 같은 것들입니다. <a href="http://claude.ai/customize">Claude 계정에 연결해 두었다면</a> 채널에서도 접근할 수 있습니다.</p>

<p>Claude에게 커넥터 접근을 요청한 순간부터 정보가 어떻게 드러날지는 여러분이 정합니다. 게시 전에 응답 하나하나를 검토할 수 있습니다. 또는 자동 모드(auto mode)를 써서, Claude가 검토가 필요한 민감한 내용이 있다고 판단하는 경우를 빼면 자동으로 게시되게 할 수도 있습니다. Enterprise 플랜에서는 관리자가 모든 구성원에게 검토를 필수로 요구할 수 있게 됩니다.</p>

<p>개인 커넥터(personal connectors)는 관리자에게 더 많은 거버넌스 선택지를 제공합니다. 에이전트 아이덴티티(agent identity) 아래 공유 도구 세트에 대한 접근을 제공할 수도 있고, 채널 구성원이 개인 커넥터만 사용하게 해 기존 역할 기반 접근 제어에 의존하게 할 수도 있으며, 도구별로 따로 결정할 수도 있습니다.</p>

<p>Claude Tag의 개인 커넥터는 지금 Team 플랜에 순차 적용 중이며, Enterprise가 뒤따를 예정입니다.</p>

<h2>개인 커넥터 사용하기</h2>

<p>채널에서 사람들이 필요로 하는 것의 대부분은 각자의 로그인 뒤에 있습니다. 내 캘린더에서 되는 시간, 내가 진행 중인 딜, 나만 열 수 있는 계획서 같은 것들입니다. 이제 그런 것들도 채널에서 요청할 수 있습니다.</p>

<p>예를 들어, GitHub에 연결된 채널인 #checkout-migration에 있는 Priya를 보겠습니다. 그는 이렇게 묻습니다. "@Claude 내 Google Drive 문서 'Checkout migration, Q3'를 우리가 출시한 것과 대조해 줘. 아직 남은 건 뭐야?"</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-tag-now-supports-personal-connectors-in-channels/priya-asks-claude.png" alt="Priya가 #checkout-migration 채널에서 Claude에게 계획서와 출시 내역을 대조해 달라고 요청하는 화면">
  <figcaption>Priya가 #checkout-migration에서 Claude에게 자신의 계획서를 출시된 것과 대조해 달라고 요청한다. 채널은 GitHub에 닿아 있다. 문서는 Priya만 열 수 있다.</figcaption>
</figure>

<p>Claude는 채널의 GitHub 커넥터를 통해 병합된 풀 리퀘스트를 읽습니다. 그 문서는 Priya만 열 수 있는 것입니다. 이전이라면 Claude는 거기서 멈췄을 것입니다.</p>

<p>이제 Claude는 채널의 작업과는 별도로 Priya의 Google Drive 커넥터를 통해 그 문서를 읽고, 무엇이 출시됐고 무엇이 남았는지 게시합니다. Priya의 계획서는 민감하지 않으므로 그는 자동 모드를 쓰고, Claude는 게시 전에 비교 결과를 점검합니다. 먼저 확인하고 싶은 문서라면 검토 모드(review mode)로 전환해 채널보다 먼저 응답을 볼 수 있습니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-tag-now-supports-personal-connectors-in-channels/claude-reply-review-prompt.png" alt="같은 스레드에서 Claude가 비교 결과를 답하고, 게시 전에 내용을 보여 주는 검토 프롬프트 화면">
  <figcaption>같은 스레드. 비교 결과가 담긴 Claude의 답변과, 게시되기 전에 무엇이 올라갈지 보여 주는 검토 프롬프트.</figcaption>
</figure>

<p>Claude가 여러분의 커넥터를 통해 하는 모든 일은 오늘날 다이렉트 메시지에서 하는 작업과 같은 방식으로, 해당 도구 자체의 로그에 여러분 계정 아래 기록됩니다. 채널 자체의 작업은 채널의 서비스 계정, 즉 보안팀이 이미 추적하고 있는 그 계정 아래 그대로 남습니다.</p>

<p>Claude가 무엇에 닿고 채널이 무엇을 보게 되는지는 다이렉트 메시지에서 커넥터를 쓸 때와 똑같이 여러분이 정하며, 커넥터는 언제든 연결을 끊을 수 있습니다.</p>

<h2>채널 자체의 커넥터가 여전히 중요한 곳</h2>

<p>개인 커넥터는 사람이 지켜보지 않는 상태(unattended)로 실행되지 않습니다. 예약된 루틴과 Claude가 스스로 시작하는 모든 작업은 관리자가 채널에 붙여 둔 커넥터를 사용합니다. 무인 작업에 필요한 도구나 채널 전체가 의존하는 작업은 공유 커넥터를 사용해야 합니다.</p>

<p>예를 들어, <a href="https://claude.com/blog/ai-ci-cd-on-call">CI 분류(triage)와 대응을 돕도록 #on-call 채널에</a> Claude를 추가하고 싶을 수 있습니다. 런북, 모니터링 도구, 배포 이력에 공유 커넥터를 설정해 두면 Claude가 (근무 시간 이후에도) 문제를 식별하고 해결을 도울 수 있습니다.</p>

<p>개인 커넥터에만 의존하는 채널은 밀착 감독되는 작업에 적합합니다. 예를 들어 RFP 응답을 함께 작성하는 일에는 채널 전체에 제공되지 않은 가격 정보나 다른 민감한 출처에서 데이터를 끌어와야 할 수 있습니다. Claude가 게시하는 모든 것은 채널의 모든 구성원에게 보입니다.</p>

<h2>다음 단계</h2>

<p>설치할 것은 없습니다. 여러분의 요청에 여러분의 커넥터 중 하나가 필요하면 Claude가 처음 한 번 묻고, 그다음부터는 스레드 안에서 그 커넥터를 사용합니다.</p>

<p>채널에서 @Claude에게 여러분만 닿을 수 있는 것을 요청해 보세요. <a href="https://claude.com/product/tag">Claude Tag</a>에 대해 더 알아보세요.</p>

<div class="callout">
  <strong>Claude로 조직의 운영 방식을 바꿔 보세요.</strong>
  <a href="https://claude.com/pricing#api">요금 보기</a> ·
  <a href="https://claude.com/contact-sales">영업팀 문의</a>
</div>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
