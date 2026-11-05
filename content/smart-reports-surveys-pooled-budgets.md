---
slug: "smart-reports-surveys-pooled-budgets"
title: "Claude Enterprise용 스마트 리포트, 설문, 그룹 공동 예산"
nav: "Enterprise 스마트 리포트·설문·공동 예산 · 팀별 워크스트림·지출·마찰 분석과 권장 사항, 가치 중심 인앱 설문, 그룹 공유 월간 예산, GA"
main: "Claude blog"
cat: "Announcements"
date: "2026-10-28"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 7003
---

<!-- rendered HTML -->
<header>
  <h1>메시지 스레드로 장시간 실행 에이전트를 더 빠르게</h1>
  <div class="meta">
    2026년 11월 2일
    · 카테고리: <a href="https://claude.com/resources/product-announcements">Announcements</a>
    · 제품: Claude Platform
<body>
<header>
  <h1>Claude Enterprise용 스마트 리포트, 설문, 그룹 공동 예산</h1>
  <div class="meta">
    2026년 10월 28일
    · 카테고리: <a href="https://claude.com/resources/product-announcements">Announcements</a>
    · 제품: Claude Enterprise
    · 읽는 시간 3분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/smart-reports-surveys-pooled-budgets">Smart reports, surveys, and pooled group budgets for Claude Enterprise</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/hero.svg" alt=""></figure>

<p class="lede">많은 조직에서 구성원들은 Claude가 열어 줄 수 있는 고유한 업무를 이미 찾아냈습니다. 다음 단계는 그 업무를 모든 팀으로 넓히는 것입니다.</p>

<p>스마트 리포트(smart reports)는 그 업무가 무엇이고 어디에서 일어나고 있는지 보여 주고, 인앱 설문(in-app surveys)은 Claude가 새로운 업무를 하는 데 어떻게 도움이 되고 있는지에 대한 구성원들의 피드백을 수집하며, 그룹 공동 예산(pooled group budgets)은 관리자가 팀마다 하나의 공유 예산을 설정할 수 있게 해 줍니다. 세 기능 모두 이제 Claude Enterprise에서 정식 출시(GA)되었습니다.</p>

<h2>스마트 리포트는 팀이 Claude로 어떻게 일하는지, 그리고 잘되는 방식을 어떻게 퍼뜨릴지 보여 줍니다</h2>

<figure><video src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/video.mp4" controls playsinline preload="metadata"></video></figure>

<p><a href="https://support.claude.com/en/articles/16893491-get-started-with-smart-reports">스마트 리포트</a>는 팀이 Claude로 무엇을 해내고 있는지, 그리고 그 업무에 드는 비용이 얼마인지 보여 줍니다. 리포트는 팀이 Claude로 하고 있는 야심 찬 업무와, Claude가 그것을 어떻게 가능하게 했는지를 보여 줍니다. 그런 다음 그 업무를 반복 가능한 워크플로로 바꾸는 방법을 알려 주어, 조직의 나머지 구성원들도 같은 일을 할 수 있게 합니다.</p>

<p>팀, 기간, 포함할 제품을 고르세요. Claude가 해당 팀의 대화 기록(transcript) 샘플을 분석해 업무를 워크스트림(workstream)으로 묶습니다. 워크스트림마다 지출, 만들어진 결과물, 그리고 커넥터 누락이나 도구 호출(tool call) 실패 같은 가장 흔한 마찰 지점을 확인할 수 있습니다.</p>

<p>각 리포트에는 하나로 통합된 권장 사항 목록이 있으며, 여기에는 스킬(skill)로 만들 만한 반복 워크플로와 코드 저장소에 추가할 규칙 등이 포함됩니다. 어떤 발견이든 그것을 실행에 옮길 수 있는 사람들에게 아티팩트(artifact)로 공유할 수 있습니다. 리포트는 모델 사용량과 비용에 관한 맞춤 질문에도 답하며, 관리자는 자신의 질문과 맞춤 인사이트를 템플릿으로 저장해 이후 리포트에서 다시 쓸 수 있습니다. <a href="https://claude.com/resources/articles/giving-admins-more-visibility-and-control-over-claude-usage-and-spend">지출 한도(spend limit)</a> 때문에 누군가의 업무가 막혀 있다면, 결제 권한이 있는 관리자가 리포트에서 바로 한도를 올릴 수 있습니다.</p>

<p>소유자(Owner)는 관리자가 아닌 팀 리더도 자기 그룹의 리포트를 실행할 수 있게 허용할 수 있습니다. 그러면 업무에 가장 가까운 사람들이 발견 사항을 바탕으로 행동할 수 있습니다. 스마트 리포트는 관리자가 도입 현황을 이해하고 투자 계획을 세우는 데 도움을 주지만, 개인의 성과를 평가하거나 인사 결정을 내리는 용도는 아닙니다.</p>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/monday.svg" alt="Monday">
  <blockquote>“우리는 여러 이니셔티브에 걸쳐 스마트 리포트를 사용합니다. 스마트 리포트는 응용 AI 팀에 회사 전반에서 Claude가 어떻게 쓰이고 있는지에 대한 근거 있는 시각을 제공하고, 덕분에 다음에 무엇을 할지 우선순위를 정하고 더 큰 영향을 만들어 낼 수 있습니다.”</blockquote>
  <p class="who">Keren Koshman, Head of Applied AI</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/slalom.svg" alt="Slalom">
  <blockquote>“Claude 스마트 리포트는 조직 전반에서 AI가 실제로 어떻게 쓰이고 있는지에 대해 새로운 수준의 가시성을 제공합니다. 특히 가치 있는 점은 그 인사이트를 행동으로 옮길 수 있다는 것입니다. 가치 높은 사용 사례를 찾고, 역량 강화(enablement) 전략을 세우고, 가장 큰 효과를 낼 수 있는 곳에 학습을 집중하는 데 도움이 됩니다.”</blockquote>
  <p class="who">Michele Bleser, VP, Business Transformation</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/wix.svg" alt="Wix">
  <blockquote>“스마트 리포트 하나하나가 수만 건의 세션을 바탕으로 하며, 가장 흔한 문제점과 스킬로 만들 만한 반복 워크플로를 드러내 줍니다. Claude에서 더 많은 가치를 얻기 위해 우리가 찾던 바로 그 가시성입니다.”</blockquote>
  <p class="who">Ran Yitzhaki, Software Engineer</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/deloitte.svg" alt="Deloitte">
  <blockquote>“스마트 리포트는 엔터프라이즈 전반에서 AI가 어떻게 쓰이는지에 대한 가시성을 높여, 배포와 거버넌스에 관한 의사 결정에 도움을 줍니다. 스마트 리포트에서 얻은 초기 인사이트는 효과적인 워크플로와 새롭게 떠오르는 스킬을 찾는 데 도움이 되고 있으며, 잘되는 방식을 조직 전체로 더 널리 공유하는 기반이 되고 있습니다.”</blockquote>
  <p class="who">Vivek Kulkarni, Managing Director, AI Transformation</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/doordash.svg" alt="DoorDash">
  <blockquote>“저는 우리 팀들이 Claude를 어떻게 쓰는지 아주 가까이에서 보고 있는데도, 스마트 리포트는 제가 몰랐던 것들을 드러내 주었습니다. 이건 중요한 일입니다. 우리 규모에서 역량 강화를 이끌려면 어느 팀이 잘하고 있고 어느 팀에 지원이 필요한지 알아야 하기 때문입니다. 이제 스마트 리포트는 DoorDash 전반의 리더들과 그런 대화를 나눌 때 제가 가장 먼저 꺼내 드는 도구가 되었습니다.”</blockquote>
  <p class="who">John Jannone, AI Enablement Lead, Engineering Enablement</p>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/docusign.svg" alt="Docusign">
  <blockquote>“스마트 리포트는 우리의 AI 네이티브 계약 플랫폼인 Docusign IAM을 코딩하는 일부터 일상 업무까지, 팀들이 Claude를 어떻게 쓰는지 보여 줍니다. 이 가시성 덕분에 경영진에게 실제 성과를 보여 주고, 커넥터 병목을 해결하고, 잘되는 방식을 여러 팀으로 확장할 수 있습니다.”</blockquote>
  <p class="who">Kamlesh Mallikarjunan, AI Employee Experience, Lead Product Manager</p>
</div>

<h2>인앱 설문으로 피드백을 수집합니다</h2>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/smart-reports-surveys-pooled-budgets/survey-editor.png" alt="주관식 질문 하나와 절약된 시간을 묻는 객관식 질문 하나가 있는 인앱 설문 편집기"></figure>

<p><a href="https://support.claude.com/en/articles/16764057-create-surveys-for-your-organization">인앱 설문</a>은 그 업무에 대한 팀 자신의 관점을 더해 줍니다. 기본 질문은 가치에 초점을 맞춥니다. 최근 Claude로 한 일 중 가장 가치 있었던 것은 무엇인지, Claude가 그 업무에 드는 시간을 어떻게 바꾸었는지, 동료가 따라 해야 할 Claude 활용법은 무엇인지, 그리고 내일 당장 팀이 Claude를 쓸 수 없게 된다면 무엇이 가장 먼저 멈추거나 느려질지를 묻습니다. 관리자는 질문을 수정하거나 삭제할 수 있고, 누가 설문을 받을지, 언제 진행할지, 어디에 표시할지를 정할 수 있습니다. 구성원은 이미 작업 중인 도구에서 응답이 끝난 뒤 짧은 카드 형태로 설문을 보게 됩니다.</p>

<p>응답은 들어오는 대로 설문 페이지에 표시되며, 관리자는 이를 스프레드시트로 내보낼 수 있습니다. 이제 고객 관리 암호화 키(customer-managed encryption keys)를 사용하는 조직에서도 인앱 설문을 켤 수 있으며, 모든 데이터에 하나의 보존 기간을 설정한 조직에서는 설문과 응답도 그 일정에 따라 삭제됩니다.</p>

<p>인앱 설문은 고객의 데이터로 취급되므로, Anthropic은 서비스를 운영하는 데 필요한 경우에만 여기에 접근합니다.</p>

<h2>그룹 공동 예산은 업무가 일어나는 곳에 지출을 배치합니다</h2>

<p><a href="https://support.claude.com/en/articles/17005973-manage-pooled-group-budgets-on-enterprise-plans">그룹 공동 예산</a>은 그룹에 하나의 공유 월간 예산을 부여합니다. 그래서 Claude를 많이 쓰는 사람이 월초에 개인 한도에 걸리고 다른 사람들은 예산을 쓰지 않고 남기는 일이 줄어듭니다. 구성원별 한도는 여전히 비정상적으로 많은 개인 사용을 막는 안전장치로 작동합니다. 모든 요청은 두 한도 모두에 차감되며, 구성원은 둘 중 먼저 소진되는 쪽에서 멈춥니다. 한도에 도달하면 Claude 안에서 바로 추가 한도를 요청할 수 있고, 그 요청은 관리자에게 전달되어 검토됩니다. 설정 화면은 그룹의 최근 사용량을 바탕으로 금액을 제안하며, 결제 권한이 있는 관리자는 예산의 50%, 75%, 95%, 100%에 도달할 때 이메일 알림을 받습니다.</p>

<h2>시작하기</h2>

<p>스마트 리포트, 인앱 설문, 그룹 공동 예산은 오늘부터 Claude Enterprise에서 정식으로 사용할 수 있습니다. 제공 여부는 HIPAA 구성이나 고객 관리 암호화 키를 사용하는 조직을 포함해 구성에 따라 다릅니다. 이용 자격과 자세한 설정 방법은 <a href="https://support.claude.com/en/">Help Center</a>를 참고하세요.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
