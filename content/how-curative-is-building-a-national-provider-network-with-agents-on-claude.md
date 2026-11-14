---
slug: "how-curative-is-building-a-national-provider-network-with-agents-on-claude"
title: "Curative는 Claude 위의 에이전트로 어떻게 전국 의료 공급자 네트워크를 만들고 있나"
nav: "Curative 계약 에이전트 Gwen · 주 2,000건+ 공급자 계약(작년 대비 약 50배), Opus 협상·Sonnet 요율 검토·Haiku 판정, Python 도구 하나·팩스·실행 격리·Claude Code 개선 루프"
main: "Claude blog"
cat: "Best practices"
date: "2026-11-10"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  table.quickpitch { width:100%; border-collapse: collapse; margin: 16px 0 24px; font-size: 0.92rem; }\n  table.quickpitch th, table.quickpitch td { border:1px solid var(--line); padding: 8px 12px; text-align:left; vertical-align: top; }\n  table.quickpitch th { background: var(--code-bg); width: 130px; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 8852
---

<!-- rendered HTML -->
<header>
  <h1>Curative는 Claude 위의 에이전트로 어떻게 전국 의료 공급자 네트워크를 만들고 있나</h1>
  <div class="meta">
    2026년 11월 10일
    · 카테고리: <a href="https://claude.com/resources/best-practices">Best practices</a>
    · 제품: Claude Platform, Claude Code
    · 글쓴이: Camy Pearson, Michael Segner
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/how-curative-is-building-a-national-provider-network-with-agents-on-claude">How Curative is building a national provider network with agents on Claude</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Curative의 계약 협상 에이전트는 매주 2,000건이 넘는 의료 공급자(provider) 계약을 협상한다.</p>

<p><strong>How startups build with Claude</strong> 시리즈에서는 스타트업들이 AI로 자기 산업을 어떻게 바꾸고 있는지 소개한다. 이번 글에서는 Curative가 Claude 위에 에이전트 계층 구조를 만들어, 2025년에 팀이 직접 하던 때보다 약 50배 빠르게 의료 공급자 계약을 체결하게 된 과정을 공유한다.</p>

<h2>한눈에 보는 Curative</h2>

<table class="quickpitch">
  <tr><th>이름</th><td>Curative</td></tr>
  <tr><th>창립</th><td>2020년, 건강보험 플랜은 2022년 출시</td></tr>
  <tr><th>창립자</th><td>Fred Turner(CEO), Isaac Turner(CTO), Tami Wilson-Ciranna(President)</td></tr>
  <tr><th>스택</th><td>Claude Platform, Claude Code, 자체 개발(bespoke) 청구(claims) 시스템</td></tr>
  <tr><th>성장</th><td><a href="https://www.businesswire.com/news/home/20251202857803/en/Curative-Raises-$150-Million-in-Series-B-Funding-to-Redefine-the-Future-of-Health-Insurance">기업가치 12억 7,500만 달러로 1억 5,000만 달러 규모 시리즈 B 유치. 가입자 165,000명 이상, 고용주 1,200곳 이상</a>(2025년 12월). Gwen으로 체결한 공급자 계약 23,000건. 2025년 한 해 전체 2,100건에서 이제는 매주 2,000~2,400건의 신규 계약.</td></tr>
</table>

<p><a href="https://curative.com/">Curative</a>는 고용주에게 건강보험을 판매한다. 가입자가 기초 검진(Baseline Visit)을 마치면 네트워크 내(in-network) 진료에 대해 본인부담금(copay)과 공제액(deductible)이 모두 0달러다. Curative는 처음부터 보험 회사였던 것은 아니다. 검사실(lab) 스타트업으로 시작했고, 내부 추정에 따르면 미국 전체 COVID-19 검사의 10%를 처리하는 데까지 이르렀다. 그 결과 미국 내 거의 모든 보험사와 함께 일하게 됐다.</p>

<p>환자가 진료비를 내지 않는 제도에 익숙했던 영국 출신 창립자들은 비효율을 목격했고, 예방에 초점을 둔 보험자(payer)를 만들기로 했다. 그리고 전국 네트워크를 구축하는 일이 얼마나 어려운지 크게 과소평가했다는 사실을 깨달았다.</p>

<blockquote>"스타트업에서는 가끔 순진함이 좋을 때가 있다. 그게 불가능하다는 걸 모르니까. 그러다 가는 길에 불가능하지 않게 만드는 방법을 찾아낸다." Curative CEO Fred Turner의 말이다. "작년에 우리는 2,100건의 계약을 체결했다. 전년의 두 배다. 하지만 1년에 2,000건이면 여전히 30년이 걸리는 일이라는 걸 깨달았다. 전국 네트워크가 손에 꼽을 만큼밖에 없고, 그마저 모두 30년쯤 전에 만들어진 데는 이유가 있다."</blockquote>

<p>Curative는 계약 체결 속도를 끌어올려야 했지만, 채용만으로는 그 정도 격차를 메울 수 없었다.</p>

<p>그들의 해법은 Gwen이다. Gwen은 공급자 한 곳과의 거래를 첫 연락부터 서명까지 맡아 처리하는 에이전트이고, 그 주위를 더 작은 에이전트들이 둘러싸고 있다. 이 에이전트들은 Gwen이 제시한 요율(rate)을 검토하고, 메시지를 점검하고, 질문에 답하고, 표준에서 벗어난 가격은 사람에게 에스컬레이션한다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-curative-is-building-a-national-provider-network-with-agents-on-claude/agent-hierarchy.png" alt="Gwen과 이를 둘러싼 보조 에이전트들로 이뤄진 Curative의 에이전트 계층 구조"></figure>

<p>다음은 그들이 이것을 어떻게 만들었는지, 그리고 그 과정에서 무엇이 망가졌는지에 대한 이야기다.</p>

<h2>Gwen: 공급자 계약 에이전트</h2>

<p>Gwen은 인바운드와 아웃바운드 리드를 모두 다룬다. Gwen의 각 실행(run)은 공급자 한 곳만 담당하며, 주로 Claude Opus 위에서 돌아간다. 그래서 다른 거래의 어떤 내용도 영향을 주지 않는다.</p>

<p>예를 들어 어떤 의원이 Curative 웹사이트의 양식을 작성하면, Gwen은 그 의원을 조사한 뒤 제안 요율을 담아 답장한다. 이 요율은 구입한 청구 데이터 세트와, 이제 보험자들이 의무적으로 공개해야 하는 가격 투명성(price-transparency) 파일을 바탕으로 한다. Gwen은 협상에 도움이 되도록 이 시장 요율 데이터를 공급자에게 보여 준다.</p>

<p>요율 검토 에이전트(rate reviewer)는 Sonnet 위에서 돌아간다. Gwen이 표준 요율 템플릿을 넘어서고 싶을 때는 그 이유를 적고, 검토 에이전트가 그 요율이 타당한지 판단한다.</p>

<blockquote>"오랫동안 큰 승인 대기열이 있었다. Gwen이 템플릿보다 일정 수준 이상 높이고 싶으면 요율 승인을 받아야 했는데, 시간이 지나면서 이를 완화했다. Gwen에게 권한을 더 주는 것보다 두 번째 에이전트가 요율을 검토하게 하는 편이 더 잘 통했다." Fred의 말이다.</blockquote>

<p>Sonnet 요율 검토 에이전트는 Gwen의 요청 중 약 3분의 2를 통과시키고, 표준에서 벗어나는 것은 모두 Fred에게 승인을 받으러 간다.</p>

<blockquote>"내가 보는 요청은 대형 의료 그룹이나 특이한 요구를 하는 곳에서 온 것이다. 에이전트가 주도하는 방식이 아니었더라도 어차피 나한테 왔을 요청들이다." Fred의 말이다.</blockquote>

<p>아웃바운드 거래는 의원들이 바쁘기 때문에 더 끈기가 필요하다. 어떤 공급자는 열네 번째 이메일과 아홉 번째 팩스를 보낸 뒤에야 답장이 온다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/how-curative-is-building-a-national-provider-network-with-agents-on-claude/outbound-outreach.png" alt="Gwen의 아웃바운드 연락 예시">
  <figcaption>Curative의 허가를 받아 사용한 이미지.</figcaption></figure>

<p>Haiku 위에서 돌아가는 판정 에이전트(judge)가 모든 커뮤니케이션을 발송 전에 읽는다. Curative는 Gwen이 요율을 어디까지 올릴 수 있는지에 관한 내부 메모를 공급자에게 참조로 보내 버린 일이 있은 뒤 이 판정 에이전트를 추가했다. 차단된 메시지는 이유와 함께 되돌아오므로, Gwen이 다시 써서 재시도할 수 있다.</p>

<p>계약 한 건을 완료하는 데 약 2,000만 토큰이 들며, 이는 처음 비용의 약 10분의 1이다. 이런 효율 덕분에 Curative의 핵심 전략 중 하나가 가능해진다. 대형 네트워크가 흔히 간과해 온 소규모 공급자들과 계약하는 것이다.</p>

<blockquote>"에이전트는 상대가 대형 병원 시스템이든 1인 개원의든 기꺼이 같은 수준의 관심을 기울인다." Fred는 이렇게 설명했다. "에이전트 입장에서는 이 공급자가 유일한 관심사다."</blockquote>

<p>협상 중에 Gwen은 의원 측의 수정 사항(redline)을 Curative의 정책 문서와 대조한 뒤, Python 코드를 작성해 양측의 변경 사항을 최종 문서로 병합한다.</p>

<p>양식 작성부터 서명까지 빠르면 한 시간이면 끝난다. 계약이 서명되면 별도의 자격 심사(credentialing) 에이전트가 공급자의 면허를 확인하고, 에이전트들이 공급자 데이터와 계약 내용을 시스템에 올려 청구 건이 그 계약 기준으로 가격이 매겨지게 한다.</p>

<p>Gwen 출시 이후 Curative의 계약팀은 45명에서 약 55명으로 늘었고, 한 사람당 생산성은 약 2.5배가 됐다. 팀원들은 콜드 아웃리치와 서류 작업을 Gwen에게 맡기고, 관심을 보인 웜 리드는 전화로 넘겨받는다. Curative는 Gwen이 성사시킨 거래에 대해서도 계약팀에 보상을 주기 때문에, 사람과 에이전트가 하나의 목표를 공유한다.</p>

<blockquote>"사람들의 일은 서류 작업보다는 관계 쪽으로 옮겨 간다." Fred의 말이다.</blockquote>

<p>Fred는 계약이 빨라지면 소규모 의원들이 독립성을 유지하는 데도 도움이 된다고 믿는다. "의원을 개업했는데 네트워크에 들어가고 자격 심사를 받는 데 석 달이 걸린다면, 석 달 동안 그냥 돈을 못 받는 거다." 그의 말이다.</p>

<p>Curative의 에이전트는 Gwen만이 아니다. 또 다른 Opus 기반 에이전트인 Brad는 주로 브로커를 통해 고용주에게 Curative의 플랜을 판매하는 일을 돕는다. Brad는 견적마다 브로커에게 후속 연락을 하고, 언더라이터(underwriter)가 예전에는 손으로 정리하던 스프레드시트에서 직원 데이터를 뽑아 내 언더라이터의 업무 속도를 높인다.</p>

<p>사람과 에이전트로 이뤄진 팀 덕분에 Curative는 이제 이메일이나 팩스로 들어온 청구 이의 제기(claims dispute)에 30분 안에, 해당 청구 건에 맞춘 서신으로 답할 수 있다. "청구 이의 제기에 답하는 데 예전에는 약 90일이 걸렸는데, 이제는 이메일이나 팩스로 30분이 안 걸린다." Fred의 말이다. "대부분의 보험자는 메일 머지(mail merge)로 이어 붙인 템플릿 묶음을 쓴다. 그러면 공급자는 크게 불만족스러워한다. 대개 템플릿은 실제로 무슨 일이 일어나고 있는지 설명하지 않기 때문이다. 이제 공급자는 개별 청구 건의 구체적인 사항과 무슨 일이 왜 일어나고 있는지를 설명하는 맞춤 서신을 받는다."</p>

<p>이들의 모든 에이전트는 자체 개발한 청구, 사전 승인(prior authorization), 재무 시스템 위에서 돌아간다. 엔지니어 13명이 올해 Claude Code로 다시 만든 시스템이다. 이 팀은 한때 청구 시스템 하나를 만드는 데만 엔지니어 100인년(engineer-years)이 든다고 추산했었다.</p>

<blockquote>"우리는 [이 에이전트들을] 청구 시스템에 끼워 넣으려는 게 아니다." Fred의 말이다. "청구 시스템은 AWS에서 돌아가는 Python이고, MCP와 API가 있고, Claude가 그걸 작성했으니 Claude가 이해한다."</blockquote>

<h2>사람과 협상하는 에이전트를 만들며 Curative가 배운 것</h2>

<p>다음은 Curative 팀이 사람과 협상하는 에이전트를 어떻게 만들어야 하는지에 대해 배운 것들이다.</p>

<p><strong>범용 도구 하나로 시작하라.</strong> "처음에는 '아, 도구들을 두자'라고 시작했는데, 수정 사항(redline) 작업은 꽤 복잡해서 그게 잘 통하지 않았다." Fred의 말이다. "가장 잘 통한 방법은 모델에게 도구를 딱 하나, Python 실행만 주는 것이었다. 모델이 docx 라이브러리로 수정 작업을 전부 한다. 아주 훌륭하게 돌아간다."</p>

<p><strong>상대가 쓰는 채널로 찾아가라.</strong> 팩스 도구 하나로 Gwen의 성사율이 두 배 넘게 올랐다. 이제 많은 공급자가 출력한 팩스에 손글씨로 적어 다시 팩스로 보내온다. "사람들이 있는 곳으로 찾아가는 거다." Curative CTO Isaac Turner의 말이다. "그들도 이메일이 있긴 하다. 하지만 정말로 편하게 느끼는 건 팩스다."</p>

<p><strong>각 실행을 격리하라.</strong> Gwen의 실행 하나는 공급자 한 곳만 보고, 거래 사이에 기억을 남기지 않는다. Curative의 영업 에이전트인 Brad는 기억을 유지하는데, 잘 돌아가긴 하지만 주의가 필요하다. "잘못된 메모를 남기게 되면, 지울 수 없는 나쁜 기억 때문에 파멸의 루프(doom loop)에 빠질 수 있다." Fred의 지적이다.</p>

<p><strong>실행 바깥에서 시스템을 개선하라.</strong> 며칠에 한 번씩 Fred는 Claude Code에 같은 프롬프트를 준다. 최근 실행 10,000건을 샘플링하고, 이상한 점을 표시하고, 그것을 고치는 PR을 열라는 것이다. "개선 루프는 과거 대화 기록 다수에 Claude Code를 돌려서, 어떻게 하면 더 나았을지 묻는 데서 나온다." 그의 말이다.</p>

<p><strong>PHI와 떨어진 곳에서 먼저 실험하라.</strong> 오랫동안 Gwen은 보호 대상 건강 정보(PHI, protected health information)에 접근할 수 없었기 때문에, 초기의 실수는 위험이 낮은 환경에서 일어났다. 이제 에이전트가 PHI를 다루는 곳에서는 백엔드 통제가 대화에 들어가는 내용을 제한하고, 에이전트 활동은 감사(audit)를 위해 기록된다. "거기서 방법을 익힌 다음 PHI 영역으로 옮겨 왔다." Fred의 말이다. 업무 제휴 계약(BAA, Business Associate Agreement), 즉 공급업체가 PHI를 다루기 전에 HIPAA가 요구하는 계약을 체결하는 일도 쉬워졌다. "특히 Anthropic은 최신 서비스의 HIPAA 준수 버전을 아주 빠르게 내놓는 데 정말 잘해 왔다." Isaac의 말이다. "규제 대상인데도 이런 새 기술을 아주 빠르게 도입할 수 있었다."</p>

<p><strong>에이전트가 스스로 하기 시작하는 일을 지켜보고, 그것이 여러분의 위험 성향(risk profile)에 맞는지 확인하라.</strong> 공급자들이 내부에 공유할 전단지를 요청했을 때, Gwen은 그러라는 정책이 없었는데도 Python 도구로 전단지를 만들었다. 네트워크 내 의원의 접수 창구가 가입자를 돌려보냈을 때는, Gwen이 그 의원에 직원 교육을 요청한 뒤 가입자가 진료를 받았는지 확인했다.</p>

<h2>Curative가 다음으로 향하는 곳</h2>

<p>다음으로 Curative는 가입자를 안내하고 코칭하는 130명의 역량을 넓히기 위해 케어 내비게이션(care navigation)에 에이전트를 도입할 계획이다.</p>

<p>Fred는 공급자 쪽에서도 에이전트가 등장하리라 본다. 청구 이의 제기의 상당 부분이 이미 에이전트가 쓴 것으로 보이며, 그는 공급자들이 에이전트를 써서 계약을 협상하기를 바란다. "시장 청산 가격(clearing price)이라는 게 있고, 그 가격을 빨리 찾을수록 모두가 진료라는 본업으로 돌아갈 수 있다." 그의 말이다.</p>

<div class="callout">
  <p><strong>Curative 팀이 전하는 모범 사례</strong></p>
  <p><strong>에이전트에게 처음에 권한을 얼마나 줘야 할까?</strong><br>
  감당할 수 있다고 생각하는 것보다 적게. Gwen은 템플릿보다 높은 모든 요율에 대해 사람의 승인 대기열을 거치는 것으로 시작했다. Curative는 단계적으로, 그리고 더 결정론적인(deterministic) 판단부터 제한을 풀었고, 그다음 요율 검토 에이전트를 추가했다. 검토 에이전트가 통과시키지 못한 건은 여전히 Fred가 승인한다.</p>
  <p><strong>에이전트가 틀리면 어떻게 될까?</strong><br>
  틀릴 것을 전제로 계획하고, 대안과 비교하라. "기준은 완벽함이 아니다." Isaac의 말이다. "기준은, 계약을 체결하는 사람이 천 명 있다면 그들이 후회할 실수를 몇 개나 하겠느냐는 것이다."</p>
  <p><strong>수십만 건의 메시지를 어떻게 감사할까?</strong><br>
  모든 것을 기록하고, 모든 발신 메시지에 판정 에이전트를 붙이고, Claude Code가 실행 기록을 샘플링하게 하라.</p>
</div>

<p>지금 바로 <a href="https://platform.claude.com">Claude Platform</a>으로 만들기 시작해 보자.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
