---
slug: "how-healthcare-organizations-use-claude-tag"
title: "의료 기관은 Claude Tag를 어떻게 활용하고 있나"
nav: "의료 기관의 Claude Tag 활용 · Insight Health·Tennr·Medallion"
main: "Claude blog"
cat: "Enterprise AI"
date: "2026-09-14"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  .testimonial { border:1px solid var(--line); border-radius: 10px; padding: 20px 22px;\n    margin: 20px 0; background:#fcfcfb; }\n  .testimonial img { height: 28px; width: auto; max-width: 160px; display:block;\n    margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border: none; }\n  .testimonial .who { color: var(--muted); font-size: 0.85rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 7908
---

<!-- rendered HTML -->
<header>
<body>
<header>
  <h1>의료 기관은 Claude Tag를 어떻게 활용하고 있나</h1>
  <div class="meta">
    2026년 9월 14일 · 읽는 시간 5분
    · 카테고리: <a href="https://claude.com/blog/category/enterprise-ai">Enterprise AI</a>
    · 제품: <a href="https://claude.com/product/tag">Claude Tag</a>
    · 저자: Camy Pearson, Maria Howe, Araba Koomson
    <span class="orig">원문:
      <a href="https://claude.com/blog/how-healthcare-organizations-use-claude-tag">How healthcare organizations use Claude Tag</a>
      (한글 번역본)</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-healthcare-organizations-use-claude-tag/hero.svg" alt="의료 기관의 Claude Tag 활용 일러스트"></figure>

<p class="lede"><em>Insight Health, Tennr, Medallion이 Claude Tag로 사람-에이전트 팀(human-agent team)을 어떻게 구축하고 있는지 소개한다.</em></p>

<p>의료 기관들이 <a href="https://support.claude.com/en/articles/15594475-what-is-claude-tag">Claude Tag(베타)</a>를 활용해 프로덕션 알림을 분류(triage)하고, 사내 도구를 유지보수하고, 보험사(payer) 규정에 관한 질문에 답하고 있다. Claude Tag는 Claude를 Slack에 <a href="https://academy.claude.com/courses/building-effective-human-agent-teams">팀 동료</a>로 데려오는 제품이다. Claude Tag는 아직 Anthropic의 <a href="https://support.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers">비즈니스 어소시에이트 계약(Business Associate Agreement, BAA)</a> 적용 대상이 아니지만, 여러 의료 기관이 보호 대상 건강 정보(protected health information, PHI)를 전혀 다루지 않는 채널과 커넥터(connector)에서 오늘 이미 사용하고 있다. 채널에서 @Claude를 멘션하면 Claude가 스레드를 읽고, 연결해 둔 도구를 사용해 작업을 수행한 뒤 결과를 보고한다. 각 채널에서 일어난 일을 기억하기 때문에 장기간 이어지는 작업도 다시 설명할 필요가 없고, 허용해 두면 채널을 지켜보다가 스스로 끼어들 수도 있다.</p>

<p>관리자가 Claude Tag가 어디서 동작하고 무엇에 접근할 수 있는지 결정하므로, 의료 팀은 PHI를 보유한 채널과 시스템에서 Claude Tag를 떼어 놓을 수 있다.</p>
<ul>
  <li>Claude Tag는 기본적으로 꺼 두고 <strong>승인된 채널에서만 활성화</strong>할 수 있으며, DM을 비활성화하고 <strong>커넥터를 채널별로 범위 지정</strong>할 수 있다.</li>
  <li>Claude Tag는 Slack 전체를 읽지 않는다. 워크스페이스 구성원이 볼 수 있는 것만 본다. 워크스페이스의 공개 채널을 읽고 키워드로 검색할 수는 있지만, 초대받지 않은 비공개 채널에는 접근할 수 없다.</li>
  <li><strong>액세스 번들(access bundle)</strong>을 사용하면 한 채널에서는 코드베이스와 이슈 트래커 같은 데이터 소스를 연결하면서도, EHR(전자 건강 기록), 임상 시스템, 환자 커뮤니케이션에는 접근할 수 없게 할 수 있다. Claude Tag의 <a href="https://claude.com/blog/agent-identity-access-model">에이전트 아이덴티티 액세스 모델</a>과 전체 아키텍처는 <a href="https://claude.com/docs/claude-tag/concepts/security-and-data?open_in_browser=1">보안 및 데이터 처리 문서</a>에서, 의료 기관을 위한 모범 사례는 <a href="https://claude.com/docs/claude-tag/admins/healthcare">여기</a>에서 더 읽을 수 있다.</li>
</ul>

<p>Claude Tag를 활성화하고 GitHub에 연결한 Enterprise 조직은 25,000달러의 Claude Tag 크레딧을 받는다(좌석 10개 이상인 Team 조직은 2,500달러). 이 크레딧은 2026년 10월 1일에 만료된다는 점에 유의하자. 크레딧 상세 내용은 <a href="https://support.claude.com/en/articles/15575654-claude-tag-launch-promo-for-claude-team-and-enterprise">여기</a>에서 확인할 수 있다.</p>

<p>Insight Health, Tennr, Medallion이 오늘 Claude Tag로 <a href="https://claude.com/blog/building-effective-human-agent-teams">사람-에이전트 팀</a>을 어떻게 구축하고 있는지 살펴보자.</p>

<h2>Insight Health의 인시던트 대응 운영</h2>

<p>Insight Health는 전문 진료과를 위한 AI 의뢰(referral) 코디네이터인 MagicDocs를 만든다. MagicDocs는 들어오는 환자 문서(팩스, 의뢰서, 사전 승인 요청, 검사 결과, 진료 기록)를 읽고, 임상 세부 정보를 추출하고, 각 문서를 올바른 환자와 매칭한 뒤, 구조화된 데이터를 EHR에 기록한다. 이 회사는 56개 전문 분야에 걸쳐 1,100곳 이상의 진료 기관에 서비스를 제공한다.</p>

<p>Insight Health의 고객 기반이 커지면서, 프로덕션 알림 분류가 소규모 엔지니어링 팀이 더 가치 있는 일에 쓰고 싶어 하는 시간을 잠식해 왔다. 그래서 지난 3개월 동안 이 회사는 PHI가 없는 엔지니어링 및 지원 채널에서 Claude Tag를 운영해 왔다. 그곳에서 Claude Tag는 프로덕션 알림을 조사하고, 티켓을 생성하고 중복을 제거하고, PR을 리뷰하고, 한 스레드에서 다음 스레드로 맥락을 이어 간다.</p>

<p>알림이 대량으로 쏟아지는 프로덕션 알림 채널에서는 Claude Tag를 두 번째 에이전트인 Zeus(Insight Health가 Claude Agent SDK로 직접 만든 에이전트)와 짝지어, 인시던트를 첫 알림부터 테스트를 거친 수정까지 끌고 간다. 두 에이전트의 접근 권한은 의도적으로 다르다. Claude Tag는 코드베이스와 Linear를 볼 수 있어 코드 패턴과 티켓 이력을 알고 있고, Zeus는 회사의 BAA 적용을 받는 Claude API 조직에서 실행되므로 프로덕션 데이터를 조회하되 데이터가 Slack에 도달하기 전에 PHI를 마스킹한다. 알림이 도착하면 두 에이전트가 조사에 나선다. 프로덕션 데이터를 조회하고, 코드와 최근 배포에 대조하고, 과거 티켓과 비교하면서, 그 과정을 Slack 스레드에 보고한다. 근본 원인을 찾아내면 초안 PR을 열고 테스트를 모니터링하며, 마지막으로 엔지니어가 리뷰하고 머지한다. 여기서 Claude Tag의 채널 메모리가 큰 가치를 발휘한다. 새로 들어온 불만을 수정 대기 중인 알려진 이슈로 인식하고, 몇 주 전의 조사 내용을 떠올리고, 미리 정해 둔 지시를 따로 요청하지 않아도 따른다.</p>

<p>“Slack 채널에 있는 모두가 두 에이전트의 추론 과정과 업무를 나누는 방식을 봅니다.” Insight Health의 공동 창업자이자 CTO인 Saran Siva의 말이다. “그 투명성이 신뢰를 쌓고, 팀이 에이전트에서 최대의 가치를 끌어내는 방법을 배우게 합니다.” Claude Tag가 가동된 이후, Insight Health의 크리티컬 알림 채널에서 알림의 97%가 엔지니어의 개입 없이 종료되어, 팀이 핵심 제품 작업에 집중할 수 있게 되었다.</p>

<p>인시던트 외에도 Insight Health 팀은 채용, 벤더 협상 준비, 계약서 검토(통화 녹취록과 조건 대조), 일반적인 비즈니스 운영에 Claude Tag를 사용한다.</p>

<h2>Tennr의 사내 도구 유지보수</h2>

<p>Tennr는 접수, 문서화, 승인, 일정 예약처럼 진료를 지연시키는 작업을 자동화해 의료 제공자가 환자를 알맞은 진료 환경으로 더 빨리 보내도록 돕는 환자 오케스트레이션 플랫폼이다. Claude Tag는 Tennr의 사내 도구 안에 상주하며, 비기술 팀이 맞춤형 사내 애플리케이션을 만들고 유지보수하도록 돕는다.</p>

<p>Tennr처럼 빠르게 성장하는 회사에서는 사내 도구가 만들어지는 속도만큼 빠르게 죽는다. 아무도 유지보수할 여력이 없기 때문이다. 2026년 7월, Tennr는 사내 도구를 만들면서 다른 접근을 택했다. Claude Code로 만든 사내 오퍼(offer) 안내 포털인 recruiting.tennr.com을 출시하고, 전용 Slack 채널을 통해 Claude Tag를 이 도구의 주 유지보수 담당자로 삼은 것이다. 이제 이 도구를 실제로 사용하는 사람들(리크루터, People 팀원, 채용 매니저, RevOps)이 평이한 영어로 요청하며 Claude를 @멘션하면, Claude가 코드 변경을 만들고, 배포하고, 결과를 보고한다. 엔지니어를 제품 작업에서 빼내지 않고도 도구를 직접 개선할 수 있다.</p>

<p>약 한 달 만에 팀은 이 방식으로 15건 이상의 티켓을 처리했다. 업로드한 PDF 한 장짜리 자료로 만든 복리후생 상세 섹션, Dropbox Sign으로 연결되는 “여기서 오퍼에 서명하세요” 배너, 목표 보너스 필드, 셀프서비스 관리자 컨트롤 등이다. 외부에 노출된 복사 API가 발견되자 Claude는 같은 날 이를 차단했다. Ashby 가져오기 버그가 진행 중인 오퍼의 주식 보상을 계속 초기화하자, Claude가 버그를 고치고 수정된 값을 반영했다. 별개의 버그로 후보자에게 변동 보상이 잠시 잘못 표시되었을 때는, 요청받지 않았는데도 영향받은 기간과 조치 내용을 담은 채널 전체 공지를 올렸다. 온보딩 문서도 작성했고, 도구의 권한 관리도 맡고 있다.</p>

<p>팀은 채널 안에서 Claude에게 자체 운영 규칙을 가르쳤다. 이모지 상태 범례, 그리고 티켓 번호, 요청자, 커밋 링크, 스크린샷, 라이브 테스트 링크가 들어가는 티켓 형식 등이다. Claude는 이후 이를 그대로 따랐다. 리크루터들은 사실상 엔지니어링 티켓에 해당하는 요청을 자연어로, 때로는 스크린샷 한 장만으로 제출하고, 한 시간 안에 프로덕션 변경을 돌려받고 있었다. “Claude Tag가 있어야 사내 도구가 비로소 유지 가능해집니다.” Tennr의 비즈니스 운영 및 전략 부사장(VP) Abe Griffiths의 말이다. “Slack 채널을 통해 Claude가 도구의 관리자 역할을 맡으니, 도구를 실제로 쓰는 사람들이 엔지니어를 제품 작업에서 빼내지 않고도 직접 개선할 수 있습니다.”</p>

<p>기반이 갖춰져 있었기 때문에 도입은 빨랐다. Tennr는 제한된 몇몇 비공개 채널에서만 PHI를 허용하므로, Claude Tag를 폭넓게 추가해도 새로운 데이터 문제가 생기지 않았다. Claude Tag에 쉽게 “예”라고 답할 수 있었던 이유는 채널별 범위 지정이었다.</p>

<p>“오퍼 도구 채널에서는 Claude가 능동적이길 원합니다. 문제를 고치고, 코드를 수정하고, PR 리뷰를 건너뛰고, 배포하는 거죠.” Griffiths의 말이다. “그런 태도는 예컨대 Claude의 역할이 정보 수집이나 정리 보조에 가까운 제품 채널이나 엔지니어링 채널에서는 당연히 맞지 않습니다. 그 경계를 채널별로 그을 수 있었기 때문에, 모든 곳에 권한을 주지 않고도 위험이 낮은 곳에서는 Claude에게 진짜 자율성을 줄 수 있었습니다.”</p>

<h2>Medallion의 보험사 전문 지식 축적</h2>

<p>Medallion은 의료 기관을 위해 의료 제공자의 자격 심사(credentialing), 면허, 보험사 등록을 자동화한다. 이 업무의 상당 부분은 난해하고 문서화되지 않은 규칙에 좌우된다. 어떤 보험사는 그룹이 등록하기 전에 최소 몇 명의 자격 심사를 통과한 제공자를 요구하는지, 주(state)별 규제는 어떤지, 그리고 엔지니어가 프로세스를 제품으로 코드화하기 전에 답을 알아야 하는 수십 가지 유사한 질문들이다. 예전에는 그 답이 소수의 사내 의료 도메인 전문가에게 있었고, 이는 핵심 제품 개발 의사결정에서 지속적인 사람 병목을 만들었다.</p>

<p>이제 Claude Tag가 그 루프 안에 들어가 지식 사일로를 깨뜨린다. 엔지니어가 Slack에서 보험사 규칙에 관한 질문을 하면, Claude Tag가 과거 전문가의 답변, 이력 데이터, 비정형 사내 자료를 바탕으로 답한다. 전문 지식이 한 사람의 머릿속이 아니라 채널에 축적된다.</p>

<p>“확신이 없을 때는 적절한 전문가를 태그하고, 그 전문가의 답변이 관련 주제에 대한 향후 답변의 근거가 됩니다.” CTO Armaan Sarkar의 말이다.</p>

<p>이들이 Claude Tag 도입을 편하게 받아들인 이유는 무엇일까? Sarkar는 PHI가 없는 적절한 업무 흐름 선택, 전문가 검토, 자동화된 검증을 꼽는다. Claude Tag는 정책 수준에서 동작한다. 질문은 보험사 규칙과 프로세스에 관한 것이지 개별 환자나 제공자에 관한 것이 아니다. 혼자 답하지도 않는다. 전문가가 감독하고 교정하며, 모든 대화는 회사의 누구나 감사(audit)할 수 있는 Slack 채널에서 이루어진다. 그리고 결과물은 다운스트림에서 검증된다. Medallion의 시스템이 이 정책들을 사용해 수행하는 작업은 그 자체로 별도로 감사되고 검증되기 때문이다.</p>

<h2>시작하기</h2>

<p>위의 팀들은 모두 같은 지점에서 시작했다. 엔지니어링, 제품, 운영 또는 채용 채널에서, 커넥터 한두 개로, DM이 아니라 팀 전체가 검토하고 맥락을 이어받을 수 있는 공개 스레드에서 작업했다.</p>

<p>의료 기관을 위한 Claude Tag 모범 사례를 <a href="https://claude.com/docs/claude-tag/admins/healthcare">여기</a>에서 검토한 다음, 채널 하나로 시작하자. 알림 채널이나 지원 엔지니어링 채널에서 Claude Tag를 켜고, GitHub을 연결하고, 허용 목록(allowlist)을 넓히기 전에 2주 동안 팀이 함께 일해 보게 하자.</p>

<p><strong><a href="https://support.claude.com/en/articles/15594475-what-is-claude-tag">Claude Tag</a>로 시작하세요.</strong></p>

<div class="callout">
  <strong>Claude로 조직의 운영 방식을 바꿔 보세요.</strong>
  <a href="https://claude.com/pricing#api">요금 보기</a> ·
  <a href="https://claude.com/contact-sales">영업팀 문의</a>
</div>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
