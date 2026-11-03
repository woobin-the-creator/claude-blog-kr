---
slug: "message-threads"
title: "메시지 스레드로 장시간 실행 에이전트를 더 빠르게"
nav: "메시지 스레드 · Messages API thread 파라미터로 새 메시지만 전송, 50만~100만 토큰 TTFT 중앙값 약 35%↓, 퍼블릭 베타"
main: "Claude blog"
cat: "Announcements"
date: "2026-11-02"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 2179
---

<!-- rendered HTML -->
<header>
  <h1>메시지 스레드로 장시간 실행 에이전트를 더 빠르게</h1>
  <div class="meta">
    2026년 11월 2일
    · 카테고리: <a href="https://claude.com/resources/product-announcements">Announcements</a>
    · 제품: Claude Platform
    · 읽는 시간 3분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/message-threads">Make long-running agents faster with message threads</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Messages API에 새로 추가된 기능입니다. 대화를 한 번만 보내면, 이후 매 턴마다 API는 새로 추가된 내용만 받습니다.</p>

<p>메시지 스레드(message threads)가 이제 Claude Platform에서 퍼블릭 베타로 제공됩니다. 메시지 스레드를 사용하면 에이전트가 매 턴마다 전체 대화 기록을 다시 보낼 필요가 없어져, 장시간 실행되는 세션의 지연 시간(latency)이 줄어듭니다.</p>

<h3>메시지 스레드의 작동 방식</h3>

<p>코딩 에이전트는 한 세션에서 수백 건의 요청을 보낼 수 있으며, 각 요청은 앞선 모든 메시지와 도구 결과(tool result)를 다시 보냅니다. 대화가 수십만 토큰에 이르면, 그 전체를 다시 보내는 것만으로도 Claude가 응답을 시작하기까지 시간이 더 걸립니다. 메시지 스레드를 사용하면 에이전트는 지난 턴 이후 새로 생긴 내용만 보내므로, 첫 토큰까지의 시간(time to first token, TTFT)이 줄어듭니다.</p>

<p>대부분의 Claude Code 사용자에게 메시지 스레드가 기본으로 켜진 상태에서, 50만~100만 토큰 규모의 요청은 TTFT 중앙값이 약 35% 감소했습니다.</p>

<p>메시지 스레드를 사용하려면 Messages API 요청에 <code>thread</code> 파라미터를 추가하세요. 첫 요청에는 전체 대화를 담아 스레드를 시작합니다. 그 이후의 각 요청에는 새 메시지와 이전 응답의 ID만 담습니다. 턴과 턴 사이에 우리는 각 스레드를 메모리에 보관하며, 스레드는 암호화된 상태로 유지되고 디스크에 기록되지 않습니다. 스레드는 마지막 요청 후 5분이 지나면 만료되며, 그러면 클라이언트가 전체 대화를 다시 보내 새 스레드를 시작합니다. 메시지 스레드를 쓰면 각 요청의 크기는 작아지지만, Claude는 여전히 매 턴마다 전체 대화를 읽으므로 토큰 사용량은 그대로입니다.</p>

<p>메시지 스레드는 지연 시간이 중요한 활성 세션에 가장 적합하며, 다음과 같은 경우가 해당합니다.</p>

<ul>
  <li><strong>장시간 실행되는 코딩 에이전트</strong>: 도구 결과나 파일 편집이 생길 때마다 대화에 내용이 더해지는 경우.</li>
  <li><strong>컴퓨터 사용(computer use) 에이전트</strong>: 스크린샷을 매 턴마다 다시 업로드하는 대신 스레드에 그대로 남겨 두는 경우.</li>
  <li><strong>문서·이미지 중심 워크플로</strong>: 요청 크기가 작아지는 경우.</li>
</ul>

<p>에이전트가 지닌 컨텍스트가 많을수록, 메시지 스레드가 첫 토큰까지의 시간을 더 많이 줄일 수 있습니다.</p>

<h3>시작하기</h3>

<p>메시지 스레드는 지금 네이티브 Claude Platform을 비롯해 Claude Platform on AWS, Claude in Microsoft Foundry, Claude Models on Google Cloud(Anthropic 관리형)에서 퍼블릭 베타로 사용할 수 있습니다. 표준 Claude 토큰 요금과 기존 rate limit이 적용됩니다. 시작하려면 <a href="http://platform.claude.com/docs/en/build-with-claude/message-threads">문서</a>를 참고하세요.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
