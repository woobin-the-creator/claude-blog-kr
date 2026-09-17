---
slug: "salesforce-in-claude"
title: "Claude 안의 Salesforce (Salesforce in Claude)"
nav: "Salesforce in Claude · 영업용 플러그인 베타 출시"
main: "Claude blog"
cat: "Enterprise AI"
date: "2026-09-15"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  .testimonial { border:1px solid var(--line); border-radius: 10px; padding: 20px 22px;\n    margin: 20px 0; background:#fcfcfb; }\n  .testimonial img { height: 28px; width: auto; max-width: 160px; display:block;\n    margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border: none; }\n  .testimonial .who { color: var(--muted); font-size: 0.85rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 5067
---

<!-- rendered HTML -->
<header>
  <h1>Claude 안의 Salesforce (Salesforce in Claude)</h1>
  <div class="meta">
    2026년 9월 15일 · 읽는 시간 5분
    · 카테고리: <a href="https://claude.com/blog/category/enterprise-ai">Enterprise AI</a>
    · 제품: <a href="https://claude.com/solutions/enterprise">Claude Enterprise</a>
    <span class="orig">원문:
      <a href="https://claude.com/blog/salesforce-in-claude">Salesforce in Claude</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/salesforce-in-claude/hero.svg" alt="Salesforce in Claude 일러스트"></figure>

<p class="lede"><em>새로 출시된 Salesforce in Claude 플러그인으로 영업 담당자는 이제 기업 조사, 통화 준비, 파이프라인 검토, CRM 업데이트 초안 작성을 Claude에서 할 수 있다.</em></p>

<p>오늘 우리는 Salesforce와 함께 만든 플러그인 <strong>Salesforce in Claude</strong>를 베타로 출시한다. 이 플러그인은 영업 담당자의 계정(account), 기회(opportunity), 파이프라인을 기존 Salesforce 권한 그대로 Claude 안으로 가져온다. 계정 조사, 통화 준비, 파이프라인 검토, CRM 업데이트 등 어카운트 이그제큐티브(account executive)가 매일 하는 업무를 위한 37개의 스킬(skill)이 포함되어 있다.</p>

<div class="video"><iframe src="https://www.youtube.com/embed/t6z0Ea0GwSk" title="Salesforce in Claude" allowfullscreen></iframe></div>

<p>영업 담당자는 Salesforce, 이메일, 통화 녹음, Slack에 흩어진 정보를 손으로 긁어모으느라 하루 중 몇 시간을 미팅 준비나 고객 미팅 후속 작업에 쓰곤 한다. 새 플러그인을 쓰면 Claude가 그 관리 업무를 대신 하고, 담당자가 승인하면 Salesforce를 업데이트한다.</p>

<p>플러그인에는 커넥터(connector) 두 개도 들어 있어서, 관리자가 Salesforce를 연결하고 담당자가 로그인하기만 하면 바로 쓸 수 있다. Salesforce 커넥터를 통해 Claude는 Salesforce 데이터를 읽고 그에 따라 행동할 수 있다. 계정 이력을 요약하고, 기회를 업데이트하고, 통화를 기록하거나 후속 작업을 만드는 식이다. Slack 커넥터는 딜 채널 요약과 계정 팀 스레드를 담당하며, 스킬이 이를 읽고 쓸 수 있다. 담당자가 플러그인을 처음 사용하면 설정 스킬이 사용 중인 도구와 커넥터를 파악하고, 그 사람의 역할과 담당 고객군(book of business)에 맞춘 Claude 아티팩트(Artifact)를 만들어 준다.</p>

<h2>영업 담당자가 오늘 바로 Salesforce in Claude를 활용하는 방법</h2>

<p><strong>브리핑으로 하루를 시작한다.</strong> 매일 아침 Claude는 그날의 미팅, 곧 마감되는 딜, 위험에 처한 기회, 답장이 필요한 읽지 않은 스레드를 담은 개인 맞춤 브리핑을 전달한다. 한번 예약해 두면 백그라운드에서 실행되며, Claude 앱을 통해 이동 중에도 어디서나 Claude에서 확인할 수 있다. 브리핑에서 바로 Claude에게 마감일을 미루거나, 단계(stage)를 바꾸거나, 후속 작업을 추가하라고 하면 Claude가 Salesforce에 그 업데이트를 반영한다. 금요일에는 브리핑이 한 주를 정리하고 담당자의 매니저에게 보낼 업데이트 초안을 작성한다.</p>

<p><strong>통화를 준비한다.</strong> 담당자가 Claude에게 다음 미팅을 준비해 달라고 하면 Claude는 Salesforce, Slack, 이메일에서 브리핑을 끌어온다. 열려 있는 기회와 각각의 현재 상태, 이번 주 계정 팀이 논의한 내용, 답하지 않은 스레드, 이전 통화에서 아직 열려 있는 질문들이다. 그 스레드에서 아직 Salesforce에 없는 이해관계자를 발견하면 Claude가 해당 계정의 연락처(contact)로 추가한다.</p>

<p><strong>딜을 검토하고 클로즈 플랜을 세운다.</strong> 기회 하나를 지정하면 Claude가 팀의 방법론에 따라 그 딜을 채점한다. 자격 요건(qualification)의 빈틈, 아직 만나지 못한 이해관계자, 마감일을 위태롭게 하는 요인을 고려한다. 계속하라고 하면 비즈니스 케이스와 날짜가 명시된 상호 클로즈 플랜(mutual close plan) 초안을 작성하고, 자격 요건 필드를 채우며, 누락된 이해관계자를 연락처 역할(contact role)로 추가한다. 이 모든 내용은 승인이 끝나면 해당 기회에 저장된다.</p>

<p><strong>모든 미팅을 Salesforce 업데이트 완료 상태로 마친다.</strong> 각 통화가 끝나면 Claude가 녹취록이나 담당자의 메모를 후속 이메일, Slack 딜 채널용 요약, 그리고 다음 단계·단계·마감일 같은 기회 업데이트 초안으로 바꿔 담당자가 검토할 수 있게 한다.</p>

<p><strong>파이프라인을 검토하고 예측을 공유한다.</strong> 담당자가 파이프라인 뷰를 요청하면 Claude가 단계별 커버리지, 밀릴 가능성이 가장 높은 딜과 그 이유, 계정별 드릴다운을 보여주는 인터랙티브 대시보드를 만든다. 대시보드에서 바로 Claude에게 마감일을 옮기거나 단계를 바꾸라고 하면 Claude가 Salesforce의 레코드를 업데이트한다. 대시보드는 경영진이나 팀과 공유할 수 있고, Claude가 경영진이 기대하는 형식으로 예측 내러티브(forecast narrative) 초안을 작성할 수도 있다. 영업 리더는 같은 뷰를 팀 전체에 걸쳐 실행할 수 있다.</p>

<h2>조직의 기존 권한 위에 구축</h2>

<p>Salesforce는 계속 기록 시스템(system of record)으로 남는다. 담당자는 자신의 Salesforce 자격 증명으로 로그인하고, Claude는 그 권한이 허용하는 범위만 읽는다. 기본적으로 Claude는 제안한 변경 사항을 기록하기 전에 매번 담당자의 승인을 요청한다. Team 및 Enterprise 플랜에서는 기본적으로 고객 데이터로 모델을 학습하지 않는다.</p>

<p>관리자는 조직 전체에 대해 Salesforce를 한 번만 연결하고, 어떤 그룹에 플러그인을 제공할지 선택한다.</p>

<h2>영업 팀은 Salesforce in Claude를 어떻게 쓰고 있나</h2>

<p>Anthropic 고객인 GitLab, Siemens, Legora가 조직에 Salesforce in Claude를 배포했고, 7,000명의 Salesforce 영업 담당자가 업무에 이를 사용하고 있다. 이들이 Salesforce in Claude 사용에 대해 들려준 이야기는 다음과 같다.</p>

<blockquote>"Salesforce in Claude 덕분에 우리 영업 담당자들은 실시간 데이터를 몇 시간이 아니라 몇 초 만에 미팅 브리핑으로 바꿉니다. 영업 팀이 커질수록, 새로 합류하는 담당자 모두가 우리가 서비스하는 로펌들의 전체 그림을 갖고 시작합니다." — David Eckstein, Legora 최고재무책임자(CFO)</blockquote>

<blockquote>"Salesforce in Claude가 있으면 담당자는 파이프라인 검토가 이미 끝나 있고 계정 이력도 이미 준비된 상태로 하루를 시작할 수 있습니다. 그 시간은 고스란히 고객과의 대화로 돌아갑니다." — Alexa Vignone, Salesforce 사장 겸 최고매출책임자(CRO)</blockquote>

<h2>시작하기</h2>

<p>Salesforce in Claude는 모든 유료 Claude 플랜에서 베타로 제공된다. <a href="https://claude.ai/directory/bundles/salesforce#directory/connectors/salesforce-headless-360">Salesforce MCP</a>는 오늘부터 마켓플레이스에서 바로 설치할 수 있다. 플러그인을 설치하려면 관리자가 <a href="https://agentexchange.salesforce.com/sales-cloud-in-claude-beta-access">AgentExchange</a>를 통해 액세스를 요청하고 조직 전체에 대해 Salesforce를 한 번 연결하면 된다. 관리자를 위해 조직에서 이 기능을 켜는 방법을 안내하는 <a href="https://support.claude.com/en/articles/16952184">설정 가이드</a>를 준비했다. 영업 리더를 위해서는 <a href="https://claude.com/blog/building-an-ai-native-revenue-organization">Claude로 효과적인 영업 조직을 운영하는 가이드</a>(<a href="building-an-ai-native-revenue-organization.html">한글 번역본</a>)를 준비했다.</p>

<div class="callout">
  <strong>Claude로 조직의 운영 방식을 바꿔 보세요.</strong>
  <a href="https://claude.com/pricing#api">요금 보기</a> ·
  <a href="https://claude.com/contact-sales">영업팀 문의</a>
</div>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
