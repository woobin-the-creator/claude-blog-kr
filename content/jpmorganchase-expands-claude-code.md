---
slug: "jpmorganchase-expands-claude-code"
title: "JPMorganChase, 더 많은 직원에게 Claude Code 확대"
nav: "JPMorganChase Claude Code 확대 · 엔지니어 넘어 전사 배포, PR 리뷰·자가 복구 에이전트, 제품 팀·자산관리, Devspace 격리·승인 게이트로 Claude 자기 승인 차단"
main: "Claude blog"
cat: "Enterprise"
date: "2026-11-09"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 2818
---

<!-- rendered HTML -->
<header>
  <h1>JPMorganChase, 더 많은 직원에게 Claude Code 확대</h1>
  <div class="meta">
    2026년 11월 9일
    · 카테고리: Enterprise
    · 제품: Claude Code
    · 읽는 시간 4분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/jpmorganchase-expands-claude-code">JPMorganChase expands Claude Code to more employees</a>
      (한글 번역본)</span>
  </div>
</header>
<p class="lede">JPMorganChase가 엔지니어를 넘어 더 많은 직원에게 Claude를 전사적으로 배포하고 있습니다. 기업·투자은행(Commercial and Investment Bank) 부문에서는 작업이 더 빠르게 프로덕션에 반영되고, 회사는 그렇게 확보한 역량을 비즈니스 우선순위에 다시 투입합니다.</p>
<p>팀들은 다른 레거시 시스템도 현대화하고 있으며, 엔지니어들은 풀 리퀘스트(pull request) 리뷰 에이전트와 자가 복구(self-healing) 에이전트를 비롯한 자체 에이전트를 만들고, 효과가 있는 방법을 서로 공유하고 있습니다.</p>
<p>인프라·운영 팀은 모니터링, 알림(alerting), 근본 원인 분석(root cause analysis)에 <a href="https://claude.com/product/claude-code" target="_blank" rel="noopener noreferrer">Claude Code</a>를 사용합니다. 회사의 보안 팀은 저희의 프런티어 모델을 사용해 취약점을 더 빠르게 찾고 고치고 있으며, 이 작업은 저희가 <a href="https://www.anthropic.com/glasswing" target="_blank" rel="noopener noreferrer">Project Glasswing</a>에서 처음 소개한 바 있습니다.</p>
<h2 id="reaching-product-teams-and-advisors">제품 팀과 어드바이저에게로 확대</h2>
<p>비즈니스에 가장 가까운 사람들도 Claude로 무언가를 만들고 있습니다. 제품 팀은 요구사항을 곧바로 엔지니어링 백로그로 바꾸고, 다른 팀들은 리스크·통제 평가(risk and controls assessments)와 프로그램 기획에 Claude Code를 사용합니다.</p>
<p>지식 업무(knowledge work)는 이미 진행 중입니다. 제품 개발 수명 주기의 상당 부분은 코드 바깥에서 일어납니다. 리서치, 요구사항 정의, 디자인, 기획이 그렇습니다.</p>
<p>자산·자산관리(Asset &amp; Wealth Management) 사업부에서 JPMorganChase는 가장 깊은 비즈니스 통찰과 가장 대담한 아이디어를 가진 사람들을 기술·제품 전문가와 함께 작고 권한 있는 팀으로 묶고 있습니다. 이렇게 하면 고객 맞춤형 투자 솔루션을 대규모로 더 쉽게 만들고 제공할 수 있습니다. Claude Code는 이제 이들의 엔지니어링 워크플로의 일부가 되었고, 팀들은 더 빠르게 움직이면서도 모든 변경 사항이 고객에게 닿기 전에 더 엄격한 테스트를 거치게 하고 있습니다.</p>
<p>지난달 J.P. Morgan Asset Management는 55ip의 ActiveTax Technology®를 <a href="https://claude.com/resources/articles/claude-for-financial-advisors" target="_blank" rel="noopener noreferrer">Claude for Financial Advisors</a>로 가져오는 커넥터를 발표해, 세금을 고려한 포트폴리오 전환 분석(tax-aware portfolio transition analysis)을 어드바이저의 일상 업무에 녹여 넣었습니다.</p>
<h2 id="built-for-a-regulated-firm">규제를 받는 금융사에 맞춘 설계</h2>
<p>Claude Code는 통제된 환경에서 실행됩니다. 여기에는 회사 자체 인프라 위에서 돌아가는 컨테이너 기반 개발 플랫폼인 Devspace도 포함됩니다. 에이전트가 직원 자격 증명(credentials)이나 내부 시스템에 직접 접근하지 못하게 하려는 것입니다. 접근 범위는 단계적으로 넓어지며, 새 Claude 모델은 회사 자체 승인 절차를 거친 뒤에야 사내에서 누구든 사용할 수 있습니다.</p>
<p>코드도 같은 규율 아래 배포됩니다. 수천 개의 자동화 테스트와 승인 게이트(approval gates)가 모든 변경 사항을 확인하고, 자동화 게이트는 파이프라인이 강제하는 명확한 통과 또는 중단(hard pass or halt) 판정을 내립니다. 그래서 Claude가 자기 작업을 스스로 승인할 수는 없습니다. 모든 프로덕션 변경의 책임은 사람에게 있습니다.</p>
<p>지난 1년 동안 JPMorganChase의 Claude 활용은 소프트웨어 엔지니어링에서 사이버 방어, 그리고 금융 어드바이저용 도구로까지 넓어졌으며, JPMorganChase가 저희에게 요구하는 것들이 저희가 다른 규제 대상 금융기관을 위해 만드는 것을 형성하고 있습니다. 세계 최대 금융기관 중 하나의 통제 안에서 일하는 Claude, 그것이 저희가 지향하는 방향입니다.</p>
<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
