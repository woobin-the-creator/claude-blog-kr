---
slug: "claude-for-financial-advisors"
title: "Claude for Financial Advisors"
nav: "Claude for Financial Advisors · 금융 자문가용 커넥터·스킬"
main: "Claude blog"
cat: "Product announcements"
date: "2026-09-14"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  .testimonial { border:1px solid var(--line); border-radius: 10px; padding: 20px 22px;\n    margin: 20px 0; background:#fcfcfb; }\n  .testimonial img { height: 28px; width: auto; max-width: 160px; display:block;\n    margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border: none; }\n  .testimonial .who { color: var(--muted); font-size: 0.85rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 16606
---

<!-- rendered HTML -->
<header>
  <h1>Claude for Financial Advisors</h1>
  <div class="meta">
    2026년 9월 14일 · 읽는 시간 5분
    · 카테고리: <a href="https://claude.com/blog/category/announcements">Product announcements</a>
    <span class="orig">원문:
      <a href="https://claude.com/blog/claude-for-financial-advisors">Claude for Financial Advisors</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/hero.svg" alt="Claude for Financial Advisors 일러스트"></figure>

<p class="lede"><em>이제 금융 자문가(financial advisor)는 자신이 의존하는 커스터디언(custodian), 포트폴리오 플랫폼, CRM, 재무 설계 도구에 Claude를 연결할 수 있으며, 금융 자문가의 일상 업무에 맞춘 새로운 스킬도 함께 쓸 수 있다.</em></p>

<p>오늘 우리는 Claude for Financial Advisors를 출시한다. 자문가의 시간을 잡아먹고 고객을 직접 상대하는 일에서 멀어지게 만드는 리서치, 준비, 문서화 작업을 돕도록 설계된 커넥터(connector)와 워크플로 스킬(skill) 묶음이다.</p>

<p>금융 자문가에게 시간은 늘 부족하다. <a href="https://www.kitces.com/kitces-report-how-financial-planners-actually-do-financial-planning/">Kitces 리서치</a>에 따르면, 일반적인 자문 사무소는 전체 시간의 6분의 1만을 고객 미팅에 쓴다. 나머지는 그 미팅을 둘러싼 일, 즉 여러 시스템에 흩어진 정보를 짜맞춰 준비하고, 계획하고, 논의한 내용을 기록하는 데 들어간다. 한편 <a href="https://www.ebri.org/docs/default-source/rcs/2026-rcs/rcs_26-fs-3_prep.pdf">EBRI의 2026년 은퇴 자신감 조사(Retirement Confidence Survey)</a>에 따르면, 미국 근로자 10명 중 4명 이상이 좋은 재무·은퇴 설계 조언을 누구에게 구해야 할지 모르겠다고 답했다. 자문가가 준비와 서류 작업에서 아낀 시간은, 기존 고객이나 아직 여력이 없어 맡지 못하던 새 가구(household)에게 돌아갈 수 있다.</p>

<p>Claude for Financial Advisors에는 다음이 포함된다.</p>
<ul>
  <li><strong>커넥터(Connectors).</strong> 자문가가 가장 많이 의존하는 커스터디언, 자산운용사, 웰스테크(wealth technology) 제공업체에 Claude가 접근할 수 있게 해 준다. 그래서 자문가는 고객 정보를 한곳에서 다룰 수 있다.</li>
  <li><strong>스킬(Skills).</strong> 그 정보를 활용해 미팅 준비, 포트폴리오 분석, 컴플라이언스 점검 같은 특정 작업을 돕는다. 언제나 자문가 본인의 판단과 스타일을 뒷받침하는 방향으로 작동한다.</li>
</ul>

<div class="video"><iframe src="https://www.youtube.com/embed/65RpbnLyEhs" title="Claude For Financial Advisors" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
<figcaption>영상: Claude For Financial Advisors</figcaption>

<h2>자문가가 이미 쓰는 도구와 이어지는 커넥터</h2>

<p>새 커넥터는 자문가가 의존하는 CRM, 커스터디언, 포트폴리오 리포팅, 재무 설계 소프트웨어, 상속·유산(estate) 도구, 미팅 기록 도구를 Claude 안으로 가져온다.</p>

<ul>
  <li><strong>Addepar</strong>는 투자 인텔리전스를 Claude에 가져와, 자문가가 공모·사모 시장 전반의 포트폴리오 데이터, 분석, 워크플로에 거버넌스가 적용된 방식으로 접근할 수 있게 한다.</li>
  <li><strong>BlackRock</strong>은 Advisor Center를 통해 포트폴리오 구성 전문성, 모델 포트폴리오, 기관급 분석을 Claude에 가져와, 자문가가 공모·사모 시장을 아우르는 종합적인 조언을 제공할 수 있게 한다.</li>
  <li><strong>Charles Schwab</strong>은 Claude를 Schwab Advisor Services 커스터디 데이터에 연결한다. 잔고, 포지션, 거래, 취득원가(cost basis), 알림, 자금 이동 상태가 포함되어, 자문가가 고객 정보를 검토하고, 어떤 고객에게 주의가 필요한지 파악하고, 리뷰를 준비할 수 있다.</li>
  <li><strong>Envestnet</strong>은 자문가가 Tamarac의 계좌와 가구를 자연어로 요약하고, MoneyGuide의 재무 계획 스냅샷을 함께 볼 수 있게 한다.</li>
  <li><strong>iCapital</strong>은 고객의 대체투자(alternative investment) 보유 내역을 Claude에 가져와, 자문가가 NAV, 약정액(commitment), 미납입 자본(unfunded capital), 최근 자본 활동, 성과를 확인하고, 그 인사이트를 고객의 전체 포트폴리오와 더 쉽게 연결할 수 있게 한다.</li>
  <li><strong>Orion</strong>은 포트폴리오 리포팅과 Redtail CRM 인사이트를 Claude에 가져와 가구 리뷰, 기회 분석, 미팅 준비와 후속 조치에 쓸 수 있게 한다.</li>
  <li><strong>SS&amp;C Black Diamond</strong>는 포트폴리오, 성과, 보유 종목, 리밸런싱 데이터를 Claude에 가져온다. 자문가는 자신의 고객 장부(book)를 검토하고, 허용 범위를 벗어난 고객을 찾아내고, 세금 손실 수확(tax loss harvesting) 기회를 발굴하고, 승인 하에 고객 보고서·작업·리밸런스 세션을 생성할 수 있다.</li>
  <li><strong>Wealthbox</strong>는 Claude를 고객 기록과 미팅 이력에 연결해 온보딩, 미팅 준비, 후속 조치를 뒷받침한다.</li>
  <li><strong>Wealth.com</strong>은 신탁·유언 요약, 세금 신고서 인사이트, 전체 대차대조표를 포함해 각 고객의 상속·세금 상황을 구조화된 형태로 Claude에 보여 준다. 그래서 자문가는 여러 시스템에 흩어진 문서 대신, 가용 정보가 정리된 요약본에서 설계를 시작할 수 있다.</li>
  <li><strong>Vanguard</strong>는 모델 포트폴리오와 자문가용 투자 솔루션 정보를 Claude에 가져와, 자문가가 고객을 위한 결정을 내릴 때 Vanguard의 신뢰받는 리서치, 포트폴리오 구성, 자산 배분 전문성을 활용할 수 있게 한다.</li>
  <li><strong>Zocks</strong>는 금융 자문가를 위한 AI 미팅 어시스턴트로, 모든 대화에서 포착한 고객 인텔리전스(프로필, 목표, 인생 사건, 약속 사항 등)를 Claude에 가져온다.</li>
</ul>

<p>이들은 Microsoft 365, Salesforce, DocuSign, Box, FactSet, S&amp;P Global, Morningstar 등 Claude에서 이미 쓸 수 있는 다른 <a href="https://claude.com/connectors">커넥터</a>에 합류한다.</p>

<p>자문가용 스킬과 커넥터를 한 번의 설치로 묶어 주는 Claude for Financial Advisors 플러그인은 BlackRock, Charles Schwab, Addepar, Envestnet, iCapital, Orion, Wealthbox, Wealth.com, Zocks와 함께 작동하며, 자문가는 안내형 설정 과정에서 이 중 무엇을 연결할지 고른다. 일부 파트너는 자체 플러그인도 제공한다. BlackRock은 Advisor Center용 플러그인을 출시하며, S&amp;P Global과 LSEG의 기존 플러그인에 합류한다.</p>

<h2>자문가의 하루를 중심으로 만든 스킬</h2>

<p>Claude for Financial Advisors 플러그인의 각 스킬은 고객 미팅 준비부터 목표 배분에서 벗어난(drifted) 포트폴리오 설명까지, 자문가의 하루 중 특정 순간을 뒷받침하고, 회사가 이미 사업 운영에 쓰는 도구로 연결된다. 회사는 우리의 Claude for financial advisors 스킬 저장소(repository)에서 이 스킬들을 그대로 도입할 수도 있고, 자사의 워크플로, 서비스 모델, 하우스 스타일에 맞게 고쳐 쓸 수도 있다.</p>

<ul>
  <li><strong>자문가 온보딩(Advisor onboarding)</strong>은 회사의 도구를 연결하고 첫 미팅 준비를 자동으로 실행해, 새로 온 자문가가 3주 차가 아니라 첫날부터 생산적으로 일하게 돕는다.</li>
  <li><strong>대체투자 브리프(Alternative investments brief)</strong>는 iCapital이나 Addepar에서 가구의 대체투자 내역을 가져와, 자문가가 별도의 명세서를 손으로 대조하는 대신, 나머지 포트폴리오와 나란히 놓인 미팅용 요약본으로 만든다.</li>
  <li><strong>컴플라이언스 및 AI 정책(Compliance and AI policy)</strong>은 사용자가 설정한 기준에 따라 추가 컴플라이언스 검토가 필요할 수 있는 콘텐츠를 표시하고, 회사가 검토 워크플로를 문서화하도록 지원하며, AI 거버넌스 문서화 절차를 뒷받침한다.</li>
  <li><strong>상속·세금 브리프(Estate and tax brief)</strong>는 고객의 상속 계획을 실제 계좌 명의(titling)와 수익자 지정과 대조하고, 전년도 세금을 돌아보며, CRM 후속 작업을 만들 수 있다. 그래서 불일치가 드러나면 자문가가 검토하게 된다.</li>
  <li><strong>포트폴리오 리밸런스 검토(Portfolio rebalance review)</strong>는 고객의 목표 배분 대비 드리프트(drift)와 집중 포지션을 표시하고, 자문가가 처음부터 써야 했을 설명의 초안을 만든다.</li>
  <li><strong>미팅 후 노트 및 후속 조치(Post-meeting notes and follow-up)</strong>는 자문가가 통화 후 하나하나 손으로 하는 대신, 녹취록을 고객 요약, 요약 이메일, CRM 작업으로 한 번에 바꿔 준다.</li>
  <li><strong>미팅 전 준비(Pre-meeting prep)</strong>는 연결된 시스템의 정보(고객의 보유 종목, 최근 계좌 활동, 이전 미팅의 미결 사항 등)를 자문가가 검토할 단일 브리프로 통합한다. 그래서 세 개의 시스템에서 맥락을 재구성하는 대신, 그 고객의 구체적인 상황에 관한 대화를 준비하고 바로 들어갈 수 있다.</li>
  <li><strong>잠재 고객 접수(Prospect intake)</strong>는 잠재 고객이 공유한 내용을 요약본, 애널리스트 인계 자료, 안내 메모(what-to-expect memo)로 정리해, 첫 미팅이 기본 사항이 이미 갖춰진 상태에서 시작되게 한다.</li>
</ul>

<p>이 스킬들은 함께 자문가의 하루 전반에 걸쳐 정보를 모으고, 요약하고, 고객 커뮤니케이션 초안을 작성한다. 투자 추천, 고객 커뮤니케이션, 컴플라이언스 판단, 그 밖의 규제 대상 활동은 여전히 사람의 검토와 승인을 거친다.</p>

<h2>규제 대상 전문가를 위해 만들었다</h2>

<p>Claude for Financial Advisors는 자문가가 통제권을 유지하도록 설계되었으며, 중요한 작업에는 승인이 필요하다. Claude는 자문가가 검토할 브리프, 요약, 분석 초안을 준비하고, CRM 업데이트나 고객 커뮤니케이션 초안 같은 관리 작업을 자문가의 검토와 승인을 위해 대기(stage)시킨다. 컴플라이언스 스킬은 고객 대상 문구를 SEC 마케팅 규칙(Marketing Rule)에 비추어 잠재적 문제를 표시하고, 회사가 기존 거버넌스와 기록 보관 절차 안에서 검토 활동을 문서화하도록 도우며, 회사가 SEC 규정에 따라 AI 사용을 문서화하도록 돕는 자율 진행형 AI 정책 워크플로를 포함한다. 워크플로 활동은 회사가 적절한 기록과 감독 절차를 유지하는 데 도움이 되도록 문서화할 수 있다.</p>

<h2>더 많은 가구를 더 잘 돌본다</h2>

<p>Claude가 미팅 준비, 후속 조치 초안, 파이프라인 검토 같은 관리 업무를 처리하면, 자문가는 더 많은 시간을 고객을 돌보는 데 쓸 수 있다. 사무소는 고객 기반을 넓히고, 세금, 상속, 보험, 은퇴 설계처럼 고객이 필요로 하는 서비스를 더 많이 제공할 수 있다.</p>

<p>고객과 생태계 파트너들이 Claude와 함께 일한 경험에 대해 들려준 이야기는 다음과 같다.</p>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/blackrock.svg" alt="BlackRock 로고">
  <blockquote>“자문가들은 시장과 기술 전반에서 변화 속도가 빨라지는 가운데, 점점 더 복잡해지는 고객의 요구를 헤쳐 나가고 있습니다. Anthropic과의 협력은 BlackRock의 포트폴리오 인텔리전스와 자산 배분 전문성을 더 많은 자문가에게 전달해, 그들이 사업을 키우고 더 나은 포트폴리오를 만들도록 돕는다는 우리의 더 큰 노력에서 중요한 한 걸음입니다. 기관급 포트폴리오 분석을 더 쉽게 접근할 수 있게 함으로써, 우리는 더 많은 자문가가 우리의 포트폴리오 인텔리전스를 활용해 고객 관계에 더 많은 시간을 집중하도록 돕고 있습니다.”</blockquote>
  <div class="who">Jaime Magyera, 미국 웰스 및 은퇴 사업 총괄(Head of US Wealth &amp; Retirement Businesses)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/mercer.svg" alt="Mercer Advisors 로고">
  <blockquote>“Anthropic은 인간의 가치에 맞춘 AI를 만듭니다. Mercer Advisors는 고객의 이익에 맞춘 패밀리 오피스를 만듭니다. 이 공통된 집념이 두 회사의 핵심이며 우리 파트너십의 닻입니다. Claude는 우리 팀이 고객의 재무 생활 전반에 걸쳐 매끄럽게 일하도록 돕는 한편, 판단과 책임은 자문가에게 남습니다. 신뢰 위에 세워진 어떤 직업에서든 AI는 이렇게 작동해야 합니다.”</blockquote>
  <div class="who">Daniel Gourvitch, 사장(President)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/rockefeller.svg" alt="Rockefeller 로고">
  <blockquote>“Anthropic이 금융 자문가의 고유한 요구에 맞춘 역량에 지속적으로 투자하는 것을 보게 되어 기쁩니다. 우리의 협력은 기술이 자문가를 대체하는 것이 아니라 뒷받침해야 하며, 인간의 판단과 재량을 최전선에 두면서 복잡성을 헤쳐 나가고 고객을 더 효율적으로 돌보도록 도와야 한다는 공통된 믿음에 뿌리를 두고 있습니다.”</blockquote>
  <div class="who">Ashley McCarthy, 최고운영책임자 겸 법률고문·전무이사(Chief Operating Officer &amp; Counsel-Managing Director)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/vanguard.png" alt="Vanguard 로고">
  <blockquote>“Vanguard는 자문가가 복잡함을 헤치는 데 쓰는 시간을 줄이고 고객과 보내는 시간을 늘리도록 돕는 데 전념하고 있습니다. Claude와의 통합은 Vanguard 투자 솔루션에 대한 접근을 넓혀, 자문가가 더 개인화된 서비스를 제공할 시간을 확보해 줍니다.”</blockquote>
  <div class="who">Sid Ratna, 금융자문가 서비스 디지털·분석 총괄(Head of Digital and Analytics, Financial Advisor Services)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/charlesschwab.svg" alt="Charles Schwab 로고">
  <blockquote>“자문가 기술의 미래는 회사가 신뢰할 수 있는 데이터, 강력한 인텔리전스, 일상 워크플로를 얼마나 잘 연결하느냐로 결정될 것입니다. Anthropic과의 협력은 등록 투자자문사(RIA)가 이미 쓰는 도구 안에서 혁신을 활용해, 고객을 더 쉽게 돌보고, 사업을 확장하고, 자신 있게 성장하도록 돕겠다는 Schwab의 의지를 반영합니다.”</blockquote>
  <div class="who">Jon Beatty, Schwab Advisor Services 총괄(Head of Schwab Advisor Services)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/ritholtz.png" alt="Ritholtz Wealth Management 로고">
  <blockquote>“AI는 이미 자문 업계의 일상 워크플로의 일부입니다. 저는 우리 CFP들이 매주 몇 시간씩 CRM 업데이트와 작업 배정에 매달리는 것을 원치 않습니다. 고객이 진정으로 가치 있게 여기는 부분은 바로 그것이기 때문에, 그들이 고객과 대화하고 설계 자체에 몰입하기를 바랍니다. Claude for Financial Advisors는 전체 스택 위에 올라앉아 그 일을 스택 전반에 걸쳐 처리하는, 그것도 우리에게 필요한 컴플라이언스 통제가 내장된 채로 그렇게 하는, 제가 본 첫 번째 제품입니다.”</blockquote>
  <div class="who">Josh Brown, CEO</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/ritholtz.png" alt="Ritholtz Wealth Management 로고">
  <blockquote>“Ritholtz의 누구도 챗봇으로 대체되지 않을 것입니다. 이 사업의 산수는 인원수가 아니라 시간입니다. 자문가에게는 유한한 시간이 있고, 그 대부분이 실제로 우리에게 돈을 내는 사람들 대신 준비와 서류 작업에 들어가고 있었습니다. Claude for Financial Advisors는 우리가 이미 쓰는 시스템 전반에서 그 잡무를 진행시키되, 고객에게 닿는 모든 것에는 자문가가 계속 관여합니다. 그 덕분에 회사 전체적으로 의미 있는 시간을 되찾고, 고객은 더 빠른 응답과 더 집중된 관심을 받게 됩니다.”</blockquote>
  <div class="who">Michael Batnick, 매니징 파트너(Managing Partner)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/dynasty.png" alt="Dynasty Financial Partners 로고">
  <blockquote>“지금은 업계가 AI에 적응하기를 멈추고 AI 위에서 돌아가기 시작하는 순간입니다. 우리가 보기에 Anthropic은 엔진이고, Dynasty는 비행기이며, 자문가는 언제나 조종사입니다. 우리는 자문가가 아래의 기계 장치를 전혀 건드리지 않고도 안전하게, 대규모로 비행할 수 있도록 비행기를 만듭니다. 그 결과, 우리는 자문가에게 또 하나의 대시보드를 주는 것이 아니라, 그들의 시간을 돌려주고 있습니다!”</blockquote>
  <div class="who">Shirl Penney, 최고경영자 겸 창업자(Chief Executive Officer and Founder)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/envestnet.svg" alt="Envestnet 로고">
  <blockquote>“자문가가 정보를 모으는 데 쓰는 한 시간은 고객과 보내지 못한 한 시간입니다. Claude를 Tamarac, MoneyGuide와 결합하면, 자문가는 질문하는 데 걸리는 시간 안에 가구나 재무 계획의 특정 요소를 이해할 수 있습니다.”</blockquote>
  <div class="who">Andrew Stavaridis, 최고관계책임자(Chief Relationship Officer)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/icapital.svg" alt="iCapital 로고">
  <blockquote>“사모 시장이 고객 포트폴리오에서 더 큰 비중을 차지하게 되면서, 자문가에게는 복잡성을 헤쳐 나갈 더 쉬운 방법이 필요합니다. iCapital은 포괄적인 마켓플레이스와 특수 투자를 관리하는 데이터·인프라를 결합하고 있으며, 그 데이터를 Claude를 통해 연결하면 투자 인텔리전스를 실행 가능한 인사이트로 바꾸는 데 도움이 됩니다.”</blockquote>
  <div class="who">Gary Gallagher, 사장(President)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/ssc.svg" alt="SS&C 로고">
  <blockquote>“AI는 자문가가 이미 쓰는 데이터와 시스템과 함께 작동할 때 가장 효과적입니다. Claude를 SS&amp;C Black Diamond Wealth Solutions와 연결하면, 자문가는 고객과 포트폴리오 정보를 자신의 워크플로 안으로 가져와 준비 시간을 줄이면서도 통제권을 유지할 수 있습니다.”</blockquote>
  <div class="who">Steve Leivent, 수석 부사장 겸 공동 총괄(Senior VP &amp; Co-Head)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/addepar.svg" alt="Addepar 로고">
  <blockquote>“Addepar는 세계 최고의 투자 전문가들이 약 10조 달러의 자산을 관리하는 데 의존하는 데이터·인텔리전스 기반을 구축했으며, 거버넌스, 엄격함, 통제가 플랫폼에 기본으로 내장되어 있습니다. Addepar와 Anthropic의 협력은 정교한 투자 포트폴리오에 대한 우리만의 깊은 이해를 Claude 안으로 가져와, 고객이 어디서 일하든 Addepar의 업계 최고 수준 포트폴리오 인텔리전스에 접근할 수 있게 합니다.”</blockquote>
  <div class="who">Eric Poirier, CEO</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/wealthcom.svg" alt="Wealth.com 로고">
  <blockquote>“상속과 세금은 고객 계획에서 정확해야만 하는 층위입니다. 자문가들은 이미 고객이 실제로 보유한 상속·세금 포지션의 기록 시스템(system of record)으로 Wealth.com을 신뢰하고 있습니다. Claude 안에서 그 기록은 질문에 직접 답할 수 있으며, 모든 수치는 그것을 만들어 낸 원본 문서로 거슬러 올라갑니다.”</blockquote>
  <div class="who">Rafael Loureiro, CEO</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/salesforce.svg" alt="Salesforce 로고">
  <blockquote>“자문가는 고객의 전체 그림이 눈앞에 있을 때 최고의 일을 합니다. Salesforce를 Claude에 연결하면, 회사가 우리 플랫폼 위에 쌓아 온 관계가 이미 갖춰진 권한과 통제 범위 안에서 자문가와 함께 이동합니다. 우리는 Anthropic과 함께, 회사가 신뢰할 수 있는 고객 데이터를 자신이 돌보는 사람들을 위해 활용할 더 많은 방법을 제공하고 있습니다.”</blockquote>
  <div class="who">Eran Agrios, 금융 서비스 수석 부사장 겸 총괄 매니저(SVP &amp; GM, Financial Services)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/orion.svg" alt="Orion 로고">
  <blockquote>“고객은 좋은 미팅 뒤에 있는 작업을 결코 보지 못하지만, 그것이 빠져 있으면 느낍니다. Anthropic과의 협력을 통해, Orion의 Claude for Financial Advisors용 플러그인은 회사의 포트폴리오와 CRM 데이터를 미팅 준비, 후속 조치 초안, 파이프라인 검토에 가져오되, 모두 회사의 기존 권한과 통제 안에서 이루어집니다. 기술이 백그라운드에서 준비의 더 많은 부분을 처리하므로, 자문가는 고객과 대화에 집중할 수 있습니다. 자문가는 몇 시간씩 모든 것을 끌어모으지 않고도 준비된 채로 들어갑니다.”</blockquote>
  <div class="who">Reed Colley, 사장(President)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/zocks.png" alt="Zocks 로고">
  <blockquote>“좋은 재무 조언은 고객의 계좌에 무엇이 있는지뿐 아니라 고객의 삶에 무슨 일이 일어나고 있는지를 아는 데 달려 있습니다.” Zocks의 CEO 겸 공동창업자 Mark Gilbert는 이렇게 말했다. “Claude와 Zocks의 확대된 협력은 여러 소스와 시스템에 흩어져 있던 데이터와 개인적인 고객 맥락을 하나로 모읍니다. 이제 Claude를 통한 모든 작업과 분석은 고객에 대한 더 완전한 이해에 기반합니다. 또한 기업 고객사는 자사 자문가가 실제로 일하는 방식을 중심으로 AI 워크플로를 구축할 더 큰 유연성을 얻습니다.”</blockquote>
  <div class="who">Mark Gilbert, CEO 겸 공동창업자(CEO and Co-founder)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/rfg.png" alt="RFG Advisory 로고">
  <blockquote>“MCP는 우리가 자문가를 위한 기술을 만드는 방식을 근본적으로 바꾸고 있습니다. Claude와 Zocks가 우리 스택에 직접 통합되면서, 한때 몇 달의 설정과 외부 파트너 의존이 필요했던 문제들을 점점 더 우리 자체 개발팀이 해결할 수 있게 되었습니다. 그 덕분에 우리는 더 빠르게 움직이고, 최고 수준의 파트너와 협력하며, 자문가가 실제로 일하는 방식을 중심으로 구축할 자유를 얻습니다. 자문가에게 기술에 적응하라고 요구하는 대신, 기술이 자문가에게 적응하게 만들 수 있습니다.”</blockquote>
  <div class="who">Dr. Jordan Hutchison, 기술·운영 부사장(Vice President of Technology and Operations)</div>
</div>

<div class="testimonial">
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-for-financial-advisors/wealthbox.svg" alt="Wealthbox 로고">
  <blockquote>“자문가들은 수년에 걸쳐 Wealthbox 안에 깊은 고객 맥락을 쌓아 왔습니다. 이제 그 맥락을 곧바로 Claude로 가져와 프런티어 모델이 그 위에서 일하게 할 수 있습니다. 미팅 준비, 후속 조치 처리, 커뮤니케이션 초안 작성 같은 일을 하면서도, 모든 것이 사무소가 운영되는 CRM과 계속 연결되어 있습니다.”</blockquote>
  <div class="who">John Rourke, CEO 겸 공동창업자(CEO and Co-Founder)</div>
</div>

<h2>시작하기</h2>

<p>자문가용 플러그인은 오늘부터 쓸 수 있다. 등록 투자자문사(registered investment adviser)에게는 Enterprise 플랜을 권장한다. 기록 보관을 뒷받침하는 감사 로그(audit log)가 포함되어 있기 때문이다. 이미 Enterprise 라이선스가 있다면 Cowork를 열고 플러그인 브라우저에서 “Claude for Financial Advisors”를 찾아 설치한 뒤, 안내형 설정을 따라 도구를 연결하면 된다.</p>

<p>Enterprise 라이선스가 없다면 이 <a href="https://forms.gle/y9YmFF2j4moRinJA7">양식</a>으로 요청하면 Anthropic 팀원이 다음 단계를 안내한다. 2026년 9월 말 이전에 새 라이선스를 요청하는 회사는 플러그인을 시작하는 데 도움이 되는 일회성 사용 크레딧도 받게 된다.</p>

<p><a href="https://claude.com/solutions/financial-services#financial-advisors">솔루션 페이지</a>에서 더 알아보고, 이번 주 금요일 9월 18일 오전 11시(미국 동부시간)에 열리는 <a href="http://anthropic.com/webinars/inside-claude-for-financial-advisors">웨비나</a>에 참여하기 바란다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
