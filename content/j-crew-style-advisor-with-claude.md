---
slug: "j-crew-style-advisor-with-claude"
title: "J.Crew, Claude로 시그니처 스타일링 방식을 구현하다"
nav: "J.Crew Style Advisor · 완성된 룩 단위로 쇼핑하는 AI 스타일리스트, Fable 5.1 설계·Opus 5.5 프로토타입(Claude Code)·Sonnet 5.5 스타일리스트·Haiku 5.5 빠른 작업, 자체 화보 룩 기반 추천"
main: "Claude blog"
cat: "Enterprise"
date: "2026-11-12"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 3576
---

<!-- rendered HTML -->
<header>
  <h1>J.Crew, Claude로 시그니처 스타일링 방식을 구현하다</h1>
  <div class="meta">
    2026년 11월 12일
    · 카테고리: Enterprise
    · 제품: Claude Code
    · 읽는 시간 5분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/j-crew-style-advisor-with-claude">J. Crew brings its signature approach to styling to life with Claude</a>
      (한글 번역본)</span>
  </div>
</header>
<p class="lede">J.Crew의 새 Style Advisor는 Claude를 사용해 개별 상품이 아니라 완성된 룩(look)을 제안하는, 더 개인화된 온라인 쇼핑 방식을 제공합니다.</p>
<p>온라인 쇼핑은 보통 상품 하나씩 이루어집니다. 그래서 스웨터를 찾은 고객은 그에 어울리는 바지와 신발을 다시 검색해야 합니다. 이를 바꾸기 위해 J.Crew는 오늘 <a href="https://www.jcrew.com/" target="_blank" rel="noopener noreferrer">JCrew.com</a>에 Style Advisor를 출시했습니다. 고객이 완성된 코디 단위로 쇼핑할 수 있게 돕는 AI 스타일리스트입니다. J.Crew 팀은 <a href="https://claude.com/product/claude-code" target="_blank" rel="noopener noreferrer">Claude Code</a>로 이를 만들었고, Fable부터 Haiku까지 여러 Claude 모델을 각자 가장 잘하는 작업에 맞춰 사용했습니다. 현재 미국에서 여성복과 남성복 스타일에 대해 이용할 수 있습니다.</p>
<p>40년 넘게 J.Crew의 스타일리스트들은 비율, 색상, 레이어링의 균형을 맞추고 아이템을 예상치 못한 방식으로 조합하며 완성된 룩을 만들어 왔습니다. Style Advisor는 이 전문성을 온라인으로 가져옵니다. 고객이 해변 결혼식에 입을 옷이나 첫 면접 복장처럼 필요한 것을 설명하면, Style Advisor는 J.Crew 자체 화보 촬영에서 가져온 완성된 룩으로 답합니다. 고객은 거기서부터 계속 다듬어 갈 수 있어, 쇼핑이 시각적인 대화가 됩니다.</p>
<h2 id="how-it-s-built">어떻게 만들었나</h2>
<p>J.Crew 제품 팀은 복잡하고 열린 작업을 위한 Anthropic의 모델인 <a href="https://www.anthropic.com/claude/fable" target="_blank" rel="noopener noreferrer">Claude Fable</a> 5.1로 Style Advisor가 스타일리스트처럼 추론하는 방식을 설계한 다음, Claude Code에서 <a href="https://www.anthropic.com/claude/opus" target="_blank" rel="noopener noreferrer">Claude Opus</a> 5.5로 동작하는 프로토타입을 만들었습니다. J.Crew 엔지니어들은 그 프로토타입을 프로덕션으로 가져갔습니다. 각 대화에서 <a href="https://www.anthropic.com/claude/sonnet" target="_blank" rel="noopener noreferrer">Claude Sonnet</a> 5.5가 스타일리스트 역할을 맡아 응답의 각 단계를 결정하고, <a href="https://www.anthropic.com/claude/haiku" target="_blank" rel="noopener noreferrer">Claude Haiku</a> 5.5는 빠르고 초점이 분명한 작업을 처리해 Style Advisor가 빠르게 답하도록 합니다. 모든 룩은 J.Crew 스타일리스트에게서 나오므로, 추천은 J.Crew의 스타일링 관점과 일관성을 유지합니다.</p>
<h3>고객이 Style Advisor를 사용하는 방법</h3>
<ul>
  <li><strong>완성된 코디를 쇼핑합니다.</strong> 모든 추천은 J.Crew 스타일리스트가 브랜드 카탈로그 촬영을 위해 만든 룩에서 출발하며, Style Advisor는 이를 사진으로 보여 주어 고객이 전체 코디를 볼 수 있게 합니다.</li>
  <li><strong>아이템 하나에서 시작해 완성합니다.</strong> 고객은 아이템 하나로 시작해, 그 룩을 완성할 다른 아이템에 대한 제안을 받을 수 있습니다.</li>
  <li><strong>상황에 맞게 입습니다.</strong> 고객이 휴가, 연말 파티, 결혼식 등 어디에 가는지 말하면 그에 맞는 추천을 받을 수 있습니다.</li>
  <li><strong>J.Crew의 관점을 얻습니다.</strong> Style Advisor는 J.Crew 스타일리스트가 매장에서 사용하는 것과 같은 스타일링 원칙을 적용합니다.</li>
</ul>
<h2 id="what-s-next">다음 단계</h2>
<p>출시 시점의 Style Advisor는 고객이 새로운 코디 아이디어를 찾고 더 자신 있게 쇼핑하도록 돕습니다. J.Crew는 앞으로 고객 각자의 취향과 구매 이력에 맞춰 제안을 맞춤화해 더 개인화하고, 더 많은 시장과 제품 라인으로 확대할 계획입니다.</p>
<p>“소비자의 기대가 변하고 AI가 리테일에 새로운 가능성을 열어 가면서, J.Crew는 온라인 쇼핑의 전통적인 모델에 도전하고 있습니다. 개별 상품 검색을 넘어 더 연결되고 영감 중심적인 경험으로 나아가는 것입니다.” J.Crew Group의 최고경영자(CEO) Libby Wadle은 이렇게 말했습니다. “저희는 오랫동안 고객이 미래에 어떻게 쇼핑하고 싶어 할지, 그리고 그 변화에 반응하기보다 어떻게 그 변화를 이끌 수 있을지 고민해 왔습니다. 저희는 쇼핑 경험을 근본적으로 다시 생각할 기회를 봅니다. Anthropic과의 협업을 통해 수십 년에 걸친 J.Crew의 스타일링, 머천다이징, 크리에이티브 전문성을 한데 모아 고객 행동의 다음 모습을 만들어 가는 데 기여하고 있습니다.”</p>
<p>“J.Crew는 패션계에서 가장 알아보기 쉬운 관점 중 하나를 갖고 있으며, 그 팀은 Claude를 사용해 그 전문성을 새로운 방식으로 고객에게 전하고 있습니다.” Anthropic의 최고사업책임자(Chief Commercial Officer) Paul Smith는 이렇게 말했습니다. “그들은 프런티어 모델로 경험을 만들고, 더 빠르고 효율적인 모델로 이를 운영했습니다. 그래서 고객은 브랜드의 스타일링에 충실하면서도 빠른 답을 받습니다.”</p>
<p>지금 <a href="https://claude.com/product/claude-code" target="_blank" rel="noopener noreferrer">Claude Code</a>로 만들어 보세요.</p>
<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
