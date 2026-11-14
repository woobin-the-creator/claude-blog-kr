---
slug: "claude-for-manufacturing"
title: "Claude for Manufacturing을 소개합니다"
nav: "Claude for Manufacturing · 17개 스킬(견적·검사 불합격 조사·고장 진단·조달·설계 비교·생산 보고), Fusion·Infor·M365·NetSuite 커넥터, Infor 자체 플러그인, 사람 검토로 끝나는 설계"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-12"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 5292
---

<!-- rendered HTML -->
<header>
  <h1>Claude for Manufacturing을 소개합니다</h1>
  <div class="meta">
    2026년 11월 12일
    · 카테고리: <a href="https://claude.com/resources/product-updates">Product updates</a>
    · 읽는 시간 6분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/claude-for-manufacturing">Introducing Claude for Manufacturing</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede"><em>17개의 스킬(skill)과 4개의 커넥터(connector)를 갖춘 새 플러그인으로, 제조업체는 이미 운영 중인 시스템에서 견적서, 품질 보고서, 공급업체 요청서 초안을 작성할 수 있습니다.</em></p>

<p>오늘 저희는 <a href="http://claude.com/solutions/manufacturing" target="_blank" rel="noopener noreferrer">Claude for Manufacturing</a>을 출시합니다. 신규 작업의 가격 책정부터 멈춘 기계의 고장 진단까지, 다양한 업무를 위한 스킬을 담은 플러그인입니다. 이제 견적 담당자(estimator)는 Claude에게 고객의 요청서를 읽고, 비슷한 작업들의 비용을 비교하고, 견적서 초안을 작성하게 할 수 있습니다. 이 플러그인은 Autodesk Fusion, Infor, Microsoft 365, Oracle NetSuite로 연결되는 커넥터를 통해 제조업체 자신의 기록을 바탕으로 작동합니다. Claude for Manufacturing은 작업 결과가 고객이나 공급업체에 전달되기 전에 책임자가 검토하고 승인할 수 있도록 설계되었습니다.</p>

<p>제조 팀은 하루의 상당 부분을 정보를 모으는 데 쓸 수 있습니다. 2025년 Manufacturing Leadership Council 설문조사에서 제조업체의 79%가 <a href="https://manufacturingleadershipcouncil.com/survey-october/" target="_blank" rel="noopener noreferrer">데이터를 수작업으로 입력</a>한다고 답했습니다. Claude가 각 프로세스를 검토 단계까지 끌고 가면, 견적 담당자는 가격에, 품질 엔지니어는 해결책에, 기술자는 무엇부터 점검할지에 집중할 수 있습니다.</p>

<h2 id="skills-built-for-manufacturers">제조업체를 위해 만든 스킬</h2>

<p>이 플러그인의 17개 스킬은 영업, 품질, 운영, 공급망, 설계, 설정(setup)을 다룹니다. 어떤 스킬은 단일 작업을 처리하고, 어떤 스킬은 여러 작업을 순서대로 실행합니다. 그래서 Claude는 사람이 검토해야 하는 시점까지 하나의 작업을 여러 단계에 걸쳐 진행할 수 있습니다. 스킬로 실행할 수 있는 프로세스는 다음과 같습니다.</p>

<ul>
  <li><strong>신규 작업 견적</strong>: 견적 담당자는 Claude에게 고객의 요청서를 읽고, 누락된 내용을 정리하고, 비슷한 작업들의 비용을 비교하고, 발행용 견적서 초안을 작성하도록 요청할 수 있습니다.</li>
  <li><strong>검사 불합격 조사</strong>: 품질 엔지니어는 Claude에게 불합격 내용을 문서화하고, 같은 문제에 대한 과거 보고서를 확인하고, 가능성이 높은 원인의 순위를 매기고, 시정 조치 보고서(corrective action report) 초안을 작성하게 할 수 있습니다.</li>
  <li><strong>고장 진단</strong>: 기술자는 Claude에게 센서 내보내기(export) 데이터, 수리 메모, 사진, 매뉴얼을 읽게 한 뒤, 가능성이 높은 원인의 순위를 매기게 할 수 있습니다. 기술자는 이를 바탕으로 점검하고 다음 단계를 결정합니다.</li>
  <li><strong>다른 공급업체로부터의 조달</strong>: 구매 담당자는 Claude에게 견적 요청서(request for quotes)를 준비하게 한 뒤, 돌아온 입찰들을 비교하게 할 수 있습니다.</li>
  <li><strong>Autodesk Fusion으로 설계 비교</strong>: 엔지니어는 Claude에게 기존 모델에서 변형 설계안을 생성하고, 엔지니어가 정한 목표에 비추어 점수를 매기고, 의사결정 메모 초안을 작성하게 할 수 있습니다.</li>
  <li><strong>생산 보고</strong>: 공장장은 Claude에게 생산 데이터를 하나의 보고서로 정리하게 할 수 있습니다. 이 보고서는 목표 대비 생산량, 설비 가동 중단 시간, 그리고 가동 중단과 미달 생산량으로 인한 비용을 보여줍니다.</li>
</ul>

<p>이 스킬들은 출발점입니다. 조직은 이를 바탕으로 자신들의 구체적인 운영 방식에 맞게 확장할 수 있으며, 저희는 앞으로 새로운 제조 스킬을 계속 추가할 계획입니다.</p>

<h2 id="connectors-to-manufacturing-systems">제조 시스템으로 연결되는 커넥터</h2>

<p>Claude for Manufacturing은 제조 운영의 핵심에 있는 소프트웨어와 함께 작동하며, 그 소프트웨어는 팀이 사업을 운영하는 방식의 중심에 그대로 남습니다.</p>

<ul>
  <li><strong>Autodesk Fusion</strong>: Claude가 엔지니어의 기존 모델에서 변형 설계안을 생성하므로, 엔지니어는 하나를 고르기 전에 더 많은 설계 옵션을 비교할 수 있습니다.</li>
  <li><strong>Infor</strong>: Claude가 Infor에서 구매 주문서와 재고를 조회하므로, 구매 담당자와 계획 담당자는 실행하기 전에 이를 확인할 수 있습니다.</li>
  <li><strong>Microsoft 365</strong>: Claude가 공유 폴더와 받은편지함에서 절차서, 공급업체 이메일, 내보낸 보고서를 찾아주므로, 품질 엔지니어는 이를 하나의 작업으로 모을 수 있습니다.</li>
  <li><strong>Oracle NetSuite</strong>: Claude가 견적서 초안을 작성할 때 실제 주문, 재고, 생산 공정, 작업 원가 기록을 가져오므로, 견적 담당자는 이를 기준으로 신규 작업의 가격을 책정할 수 있습니다.</li>
</ul>

<p>제조업체는 커넥터가 없는 시스템과도 이 플러그인을 함께 사용할 수 있습니다. 해당 시스템에서 정기적으로 내보낸 파일을 Microsoft 365에 저장하면, Claude가 그 파일을 바탕으로 견적서 초안을 작성하거나 생산 보고서를 정리합니다.</p>

<h2 id="making-changes-in-infor-with-claude">Claude로 Infor에서 변경 작업하기</h2>

<p>제조업체용 핵심 소프트웨어를 만드는 Infor도 <a href="https://claude.ai/directory/infor" target="_blank" rel="noopener noreferrer">자체 플러그인을 출시</a>합니다. Claude for Manufacturing의 Infor 커넥터로는 팀이 기록을 조회할 수 있습니다. Infor의 플러그인을 쓰면 Claude에서 Infor의 데이터를 변경하는 것까지 할 수 있습니다.</p>

<p>예를 들어 철강 출하가 2주 늦어지면, 구매 담당자는 Claude에게 어떤 고객 주문이 영향을 받는지, 다른 사업장에 철강이 얼마나 있는지 물어볼 수 있습니다. 구매 담당자가 승인하면 Claude는 다른 공급업체에 구매 주문서를 발행하고, 영향을 받는 생산 일정을 Infor에서 다시 잡을 수 있습니다. Claude의 접근 권한은 구매 담당자의 Infor 권한을 그대로 따릅니다.</p>

<h2 id="manufacturing-teams-stay-in-control">통제권은 제조 팀에 있습니다</h2>

<p>스킬은 사용자의 검토로 끝나도록 만들어졌습니다. 그래서 견적 담당자가 견적서를 확인하고 발행하며, 품질 엔지니어가 시정 조치 보고서에 담길 해결책을 검증합니다. 이런 검토를 돕기 위해 Claude는 수치와 주장을 그 근거가 되는 데이터와 문서에 연결해 보여줄 수 있습니다.</p>

<p>Claude for Manufacturing은 설비를 직접 조작하지 않습니다. 이를 위해 Anthropic은 <a href="https://www.anthropic.com/news/model-hardware-standard-research-preview" target="_blank" rel="noopener noreferrer">Model Hardware Standard</a>를 개발하고 있습니다. 이는 프로그래밍 가능한 설비가 자신의 측정값, 설정값, 안전 한계를 표준화된 방식으로 기술할 수 있게 해주는 연구 프리뷰(research preview)입니다.</p>

<h2 id="how-to-get-started">시작하는 방법</h2>

<p>Team 또는 Enterprise 플랜에서 <a href="https://claude.ai/customize/plugins/id/45112ff2-6233-4954-b8ec-c448ef2d1e59%40anthropic-plugin-directory" target="_blank" rel="noopener noreferrer">플러그인을 설치</a>하고 Claude에게 “Set us up(설정해 줘).”이라고 말하세요. Claude는 팀이 어떤 시스템을 쓰는지 묻고, 커넥터를 테스트한 뒤, 아직 완전히 실행할 수 없는 스킬이 무엇인지 알려줍니다.</p>

<p>플러그인이 실제로 작동하는 모습을 보려면 11월 17일 오전 11시(미국 동부 시간)에 열리는 <a href="https://claude.com/resources/webinars/claude-for-manufacturing-put-your-plants-know-how-to-work" target="_blank" rel="noopener noreferrer">기술 웨비나에 등록</a>하세요. 회사의 제조 시스템에 대해 상담하려면 <a href="https://claude.com/contact-sales" target="_blank" rel="noopener noreferrer">영업팀에 문의</a>하세요.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
