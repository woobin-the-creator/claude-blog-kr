---
slug: "giving-companies-more-control-over-their-ai-agents-with-nvidia"
title: "NVIDIA와 함께, 기업이 AI 에이전트를 더 강하게 통제할 수 있도록"
nav: "NVIDIA × Managed Agents · OpenShell로 에이전트 권한 통제"
main: "Claude blog"
cat: "Agents"
date: "2026-09-28"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 4100
---

<!-- rendered HTML -->
<header>
  <h1>NVIDIA와 함께, 기업이 AI 에이전트를 더 강하게 통제할 수 있도록</h1>
  <div class="meta">
    2026년 9월 28일
    · 카테고리: <a href="https://claude.com/blog/category/agents">Agents</a>
    · 제품: <a href="https://claude.com/platform/api">Claude Platform</a>
    · 읽는 시간: 5분
    <span class="orig">원문:
      <a href="https://claude.com/blog/giving-companies-more-control-over-their-ai-agents-with-nvidia">Giving companies more control over their AI agents, with NVIDIA by Anthropic</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/giving-companies-more-control-over-their-ai-agents-with-nvidia/hero.svg" alt="엔터프라이즈 에이전트 일러스트"></figure>

<p class="lede">NVIDIA는 오늘 AI 보안을 강화하기 위한 개방형 소프트웨어 플랫폼이자 레퍼런스 시스템 설계인 <a href="https://nvidianews.nvidia.com/news/open-agent-safety-platform">Open Agent Safety Platform</a>을 발표했습니다. Anthropic은 NVIDIA와 협력해 에이전트 스택에 보안과 통제의 층을 추가로 더했습니다.</p>

<p>프로덕션급 에이전트를 대규모로 구축·배포하기 위한 조합 가능한 API 모음인 Claude Managed Agents는 에이전트가 필요로 하는 자격 증명(credential)을 금고(vault)에 보관해 에이전트가 그것을 결코 볼 수 없게 합니다. 오픈소스 NVIDIA OpenShell 소프트웨어는 에이전트가 작업하는 동안 무엇을 실행하고 어디에 접근할 수 있는지를 통제하도록 설계되었습니다. Managed Agents를 OpenShell과 함께 쓰는 고객은 에이전트가 할 수 있는 일을 제한하고, 에이전트가 한 일을 검토하고, 그 제한이 실제로 적용되어 있음을 확인할 수 있습니다.</p>

<p>기업들은 AI로 질문에 답을 얻던 단계를 지나, 여러 사업 부문에 걸친 복잡한 업무를 처리하고, 독점 데이터를 사용하고, 사용자를 대신해 행동하는 에이전트를 배포하는 단계로 옮겨가고 있습니다. 모델이 좋아질수록 에이전트의 용도는 늘어나고 접근 권한도 커집니다. 에이전트의 접근 권한이 커질수록, 회사는 에이전트가 하는 일을 더 많이 통제하고 점검해야 합니다.</p>

<h2>층층이 쌓는 보호</h2>

<p>보호는 모델 내부의 안전장치에서 시작합니다. Managed Agents와 NVIDIA OpenShell은 모델 바깥에 자리 잡고 에이전트의 행동에 적용되는 제한을 더합니다. 각 층은 자신의 제한을 독립적으로 집행하도록 설계되어, 보호가 어느 한 층에만 의존하지 않습니다. 각 층은 모듈식이어서 회사는 자신의 환경에 맞는 층만 골라 도입할 수 있습니다.</p>

<h2>Claude Managed Agents는 일을 하고, 자격 증명을 보관합니다</h2>

<p>Managed Agents에서는 에이전트 루프가 샌드박스(작업이 실제로 이루어지는 격리된 환경)와는 별도의 서버에서 실행됩니다. 비밀번호와 액세스 키 같은 자격 증명은 별도의 금고에 보관되므로 에이전트는 그것을 결코 보지 못합니다.</p>

<p>Managed Agents는 또한 각 에이전트가 무엇을 했는지 기록하는 감사 추적(audit trail)과, 회사가 이미 갖춘 접근 제어와의 통합을 제공합니다. 회사는 자체 샌드박스 구성을 가져와 어디에서 어떻게 실행할지 선택할 수 있습니다.</p>

<h2>NVIDIA OpenShell은 에이전트가 닿을 수 있는 범위를 정합니다</h2>

<p><a href="https://www.nvidia.com/en-us/ai/openshell/">OpenShell</a>은 NVIDIA의 오픈소스 보안 런타임 소프트웨어입니다. 모든 AI 에이전트 행동을 관리·감시하고, 모든 행동에 정책을 집행합니다. OpenShell은 규칙이 허용하지 않는 한 모든 것을 차단합니다. 에이전트가 사용하려는 각 도구를 검사하고, 에이전트가 접근하는 파일·네트워크 연결·데이터에 규칙을 적용합니다. 규칙은 에이전트 바깥에서 집행되며, OpenShell은 허용하거나 차단한 모든 결정을 기록합니다.</p>

<p>팀은 좁은 권한으로 시작해 로그를 검토하고, Claude를 활용해 작업에 필요한 최소한의 접근 권한 쪽으로 규칙을 조여 갈 수 있습니다. 그런 다음 OpenShell의 정책 증명기(policy prover)가 수학적 증명을 통해, 팀이 작성한 규칙 아래에서 에이전트가 무엇에 닿을 수 있는지를 확인합니다.</p>

<h2>Claude Managed Agents에 포함된 것</h2>

<ul>
  <li>보안 샌드박싱, 인증, 도구 실행을 대신 처리해 주는 프로덕션급 에이전트.</li>
  <li>몇 시간 동안 자율적으로 동작하는 장기 실행 세션. 연결이 끊겨도 진행 상황과 산출물이 유지됩니다.</li>
  <li>에이전트가 다른 에이전트를 띄우고 지휘해 복잡한 작업을 병렬화하는 멀티 에이전트 오케스트레이션.</li>
  <li>범위가 한정된 권한, ID 관리, 실행 추적이 내장된 채로 에이전트에게 실제 시스템 접근을 부여하는 신뢰할 수 있는 거버넌스.</li>
</ul>

<h2>팀들은 Managed Agents를 어떻게 쓰고 있나</h2>

<p><a href="https://claude.com/customers/notion-qa">Notion</a>은 팀이 워크스페이스 안에서 Claude에게 일을 맡길 수 있게 합니다. 엔지니어는 이를 코드 출시에 쓰고, 다른 직원들은 웹사이트와 프레젠테이션을 만드는 데 씁니다. 팀이 결과물을 함께 다듬는 동안 수십 개의 작업이 병렬로 실행될 수 있습니다.</p>

<p><a href="https://claude.com/customers/rakuten-qa">Rakuten</a>은 엔지니어링, 제품, 영업, 마케팅, 재무 전반에 걸쳐 전문 에이전트를 운영하며, 각 에이전트를 1주일 안에 배포했습니다.</p>

<p><a href="https://claude.com/customers/asana-qa">Asana</a>는 Asana 프로젝트 안에서 사람과 나란히 일하며 작업을 맡고 산출물 초안을 작성하는 에이전트, AI Teammates를 만들었습니다. Managed Agents를 사용해 팀은 다른 방법으로 가능했을 것보다 더 빠르게 고급 기능을 추가했습니다.</p>

<h2>이용 안내</h2>

<p>Managed Agents는 오늘부터 사용할 수 있습니다. 여러분이 통제하는 샌드박스에서, 자체 인프라 위에서든 관리형 제공업체를 통해서든 동작할 수 있습니다. NVIDIA OpenShell은 Apache 2.0 라이선스의 오픈소스이며 <a href="https://github.com/NVIDIA/OpenShell">GitHub</a>과 NVIDIA의 <a href="https://docs.nvidia.com/openshell/latest/about/overview">개발자 리소스 페이지</a>에서 받을 수 있습니다.</p>

<div class="callout">
  <strong>Claude로 조직의 운영 방식을 바꿔 보세요.</strong>
  <a href="https://claude.com/pricing#api">요금 보기</a> ·
  <a href="https://claude.com/contact-sales">영업팀 문의</a>
</div>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
