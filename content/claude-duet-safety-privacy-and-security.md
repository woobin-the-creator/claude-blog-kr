---
slug: "claude-duet-safety-privacy-and-security"
title: "Claude Duet의 안전, 프라이버시, 보안"
nav: "Claude Duet의 안전·프라이버시·보안 · 중요한 행동은 승인, 민감 정보 분류기, 자격 증명·브라우저 격리, 레드 팀·버그 바운티"
main: "Claude blog"
cat: "Announcements"
date: "2026-10-23"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 9795
---

<!-- rendered HTML -->
<header>
  <h1>Claude Duet의 안전, 프라이버시, 보안</h1>
  <div class="meta">
    2026년 10월 23일
    · 카테고리: <a href="https://claude.com/resources/product-announcements">Announcements</a>
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/claude-duet-safety-privacy-and-security">Claude Duet Safety, Privacy, and Security</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Claude Duet은 사용자가 자리를 비운 동안에도 사용자를 위해 일하는 능동형(proactive) 에이전트다. Claude Duet은 두 겹의 보호 위에 만들어졌다. Claude 모델 자체에 들어간 안전 학습(safety training), 그리고 Claude Code와 Claude Managed Agents 같은 제품에 이미 있는 안전장치(safeguard)다. 여기에 더해, 여러 계정을 넘나들며 일하고 사용자를 대신해 행동하는 데 필요한 새로운 보호 장치를 추가했다.</p>

<p><a href="https://claude.com/resources/articles/claude-duet">Claude Duet</a>은 현재 리서치 프리뷰(research preview) 단계에 있는 에이전트로, 클라우드 기반 컴퓨터를 사용해 사용자 대신 일한다. 사용자가 Claude에 연결하기로 선택한 모든 앱과 서비스를 쓸 수 있고, 앱을 닫은 뒤에도 계속 실행된다. 사용자가 자리를 비운 동안 받은편지함을 읽고, 답장 초안을 쓰고, 예약을 하고, 루틴(routine)을 실행할 수 있다. 우리 팀도 자기 계정으로 Claude Duet을 돌리며 매일 업무에 쓰고 있다.</p>

<p>우리는 에이전트의 행동을 이끄는 세 가지 원칙 위에 Claude Duet을 만들었다.</p>
<ol>
  <li>사용자의 정보, 그리고 다른 사람들이 사용자의 연결된 앱에서 공유한 정보는 신중하게(with discretion) 다뤄진다. 이를 위해 Claude Duet이 작성한 메시지를 내보내기 전에 검사하는 새로운 분류기(classifier)를 쓴다.</li>
  <li>Claude Duet이 사용자를 대신해 하는 일은 사용자가 통제한다.</li>
  <li>Claude Duet은 사용자의 비밀번호, 브라우저 쿠키, 로그인 토큰, 그 밖의 자격 증명(credential)을 절대 보지 않는다.</li>
</ol>

<p>Claude Duet은 새롭지만 그 바탕에 깔린 생각은 새롭지 않다. 2025년에 우리는 <a href="https://www.anthropic.com/news/our-framework-for-developing-safe-and-trustworthy-agents">안전하고 신뢰할 수 있는 에이전트를 위한 프레임워크를 발표했다</a>. 이 프레임워크는 사람에게 통제권을 두고, 프라이버시와 안전한 상호작용을 기본 요건으로 다룬다. 그 뒤로 우리는 왜 <a href="https://www.anthropic.com/research/trustworthy-agents">단 하나의 방어로는 충분하지 않은지</a>, 그리고 왜 <a href="https://www.anthropic.com/engineering/how-we-contain-claude">모델 내부의 보호만으로는 버틸 수 없는지</a>에 대해 글을 써 왔다. 또한 기업들이 <a href="https://www.anthropic.com/engineering/managed-agents">Claude Managed Agents</a>를 통해 프로덕션에서 에이전트를 운영하는 데 쓰는 인프라를 직접 만들고 운영하고 있으며, Claude Duet도 같은 방식으로 자격 증명을 에이전트와 분리해 둔다. Claude Duet은 이 작업들 위에, 사용자를 대신해 행동하는 에이전트에게 필요한 보호 장치를 더한 것이다. 이 글에서는 우리가 무엇을 추가했고 무엇을 아직 작업 중인지 살펴본다.</p>

<h2>중요한 행동은 사용자가 승인한다</h2>

<p>사용자가 자리를 비운 사이에 행동하는 에이전트는 언제 멈추고 진행 전에 허락을 구해야 하는지 알아야 하고, 그것도 적절한 빈도로 해야 한다. 민감할 수 있는 메시지를 보내거나, 무언가를 결제하거나, 무엇이든 삭제하는 일 같은 행동을 하기 전에 Claude Duet은 그 행동, 대상, 내용을 모든 수신자까지 포함해 사용자에게 보여 준다. 그런 다음 사용자가 그 행동을 승인할 때까지 기다린다.</p>

<p>각 행동과 함께 별도의 자동 검사가 실행된다. 이 검사는 <a href="https://www.anthropic.com/engineering/claude-code-auto-mode">Claude Code의 auto mode 분류기</a>를 바탕으로 Claude Duet에 맞게 확장한 것이다. 이 검사는 그 행동이 사용자의 의도와 맞는지 평가한다. 검사는 작업을 하는 모델 바깥에서 실행되므로, 페이지에 숨겨진 지시가 결과에 영향을 줄 수 없다.</p>

<p>어떤 행동은 사용자가 승인하더라도 금지된다. 증권 거래, 계좌 간 이체 같은 은행 업무, 다른 사람의 계정에 접근하는 일 등이다. 또 어떤 단계는 사용자가 아무리 자주 승인했더라도 "다시 묻지 않기" 규칙이 적용되지 않는다. 결제나 송금, 주문 삭제, 계정 생성 같은 것이다. 사용자가 자리를 비운 동안 실행되는 루틴에도 같은 안전장치가 적용된다.</p>

<p>우리는 Claude Duet이 얼마나 자주 승인을 요청할지 조정(calibration)하는 데 많은 시간을 들였다. 승인 피로(approval fatigue)는 심각한 문제다. 요청이 너무 많으면 사람들은 때로 충분히 생각하지 않고 습관적으로 눌러 넘기게 되기 때문이다. 우리는 앞으로도 이 조정을 계속 다듬어 나갈 것이다.</p>

<p>구매할 때 Claude Duet은 Link from Stripe 같은 지갑에서 발급한 일회용 카드로 결제한다. 이 카드는 해당 판매처와 금액으로 제한된다. 사용자는 상품과 총액을 확인하고, Link 앱에서 구매를 승인한다. 사용자의 실제 카드 번호는 Claude Duet에도 판매처에도 공유되지 않는다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-duet-safety-privacy-and-security/approval-flow.png" alt="Claude Duet의 승인 흐름을 보여 주는 그림"><figcaption>그림 1. 승인 흐름: 승인 카드와 별도의 검사는 모델 바깥에 있으므로, 에이전트가 읽는 어떤 내용도 그 카드에 대신 응답할 수 없다.</figcaption></figure>

<h2>사용자의 정보는 신중하게 다뤄진다</h2>

<p>사용자의 이메일을 읽고 대신 메시지를 보내는 에이전트는 서로 다른 종류의 정보가 어디로 가야 하는지 끊임없이 판단한다. 사용자가 Claude Duet에게 팀에 주간 요약을 보내 달라고 하면, 그 요약에는 팀원 모두가 이미 접근할 수 있는 내용만 들어가야 하고, 성과 평가 면담 같은 사적인 세부 내용은 절대 들어가서는 안 된다.</p>

<p>이를 해결하기 위해 우리는 메인 모델과 별도로 실행되는 새로운 안전 분류기를 만들었다. 이 분류기는 Claude Duet이 보내려는 각 메시지에 민감할 수 있는 정보가 들어 있는지 검사한다. 우리는 이런 정보를 두 단계로 나눈다.</p>
<ul>
  <li><strong>절대 공유 금지: </strong>로그인 자격 증명, 전체 카드 번호와 은행 계좌 번호, 정부 발급 신분증 번호 같은 정보에는 가장 강한 보호를 적용한다. Claude Duet은 사용자가 요청하더라도 이런 정보를 누구와도 절대 공유하지 않도록 지시받는다.</li>
  <li><strong>공유하려면 동의 필요: </strong>건강이나 재정 같은 그 밖의 사적인 정보는 사용자가 명시적으로 승인한 경우에만 Claude Duet이 공유한다. 사용자 자신의 요청도 동의로 간주되므로, "치과에 내 치통에 대해 메모를 보내 줘" 같은 요청에는 대개 추가 승인이 필요하지 않다.</li>
</ul>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-duet-safety-privacy-and-security/where-information-goes.png" alt="Claude Duet에서 사용자의 정보가 어디로 갈 수 있는지 보여 주는 그림"><figcaption>그림 2. 사용자의 정보가 갈 수 있는 곳: 무엇이든 보내기 전에, 검사가 정보의 민감도와 사용자의 동의 여부를 따진다.</figcaption></figure>

<p>둘 중 어느 이유로든 차단되면, Claude Duet은 민감한 정보를 빼고 메시지를 다시 써서 사용자에게 승인을 요청할 수 있다.</p>

<p>Claude Duet은 아직 리서치 프리뷰 단계이며, 이 안전장치는 가끔 무언가를 놓치거나 무해한 메시지를 걸러 낼 수 있다. 그래서 이 안전장치는 앞에서 설명한 승인 메커니즘과 함께 작동한다. 승인 메커니즘은 Claude Duet이 사용자를 대신해 보내는 내용을 사용자가 통제하도록 설계됐다. 사람들이 Claude Duet을 어떻게 쓰는지 더 알게 되면서 분류기도 계속 개선해 나갈 계획이다.</p>

<h2>작업과 연결된 앱을 사용자가 볼 수 있다</h2>

<p>Claude Duet이 무엇을 했고 무엇을 하고 있는지는 작업 목록(task list)에서 볼 수 있다. 작업마다 각자의 페이지가 있고, 작업 도중에 방향을 바꿀 수도 있다. Claude Duet은 작업 사이에 맥락을 이어 가기 위해 대화 기록과 메모리를 보관하며, 이는 사용자가 기록을 삭제하거나 초기화할 때까지 유지된다. 계정을 삭제하면 Claude Duet이 저장한 모든 것이 지워진다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-duet-safety-privacy-and-security/task-list.png" alt="Claude Duet 작업 목록 화면 캡처"></figure>

<p>사용자가 Claude에 연결한 앱은 Claude Duet에도 그대로 이어지며, 한쪽에서 앱을 끄면 양쪽 모두에서 꺼진다. 앱 연결을 끊으면 그 순간부터 새로운 접근은 멈추지만, Claude Duet이 이미 그 앱에서 알게 된 내용은 사용자가 메모리를 초기화할 때까지 남아 있다. 메모리 초기화는 앱 설정에서 언제든 할 수 있다. Claude Duet은 사용자의 Claude 계정 메모리도 사용하므로, Claude가 이전 채팅에서 기억한 세부 내용도 보인다.</p>

<h2>자격 증명과 브라우저는 모델과 격리된다</h2>

<p>Claude Duet은 사용자의 비밀번호, 브라우저 쿠키, 연결된 앱의 로그인 토큰을 절대 보지 않으며, 이를 메모리에 저장할 수도 없다. 이것들은 모델이 접근할 수 없는 별도의 머신만 거쳐 가고, Claude Duet의 행동을 통제하는 승인과 안전 검사도 그곳에서 실행된다.</p>

<p><strong>비밀번호</strong></p>

<p>사이트가 비밀번호를 요구하면, 사용자는 Claude 앱 안의 입력 양식(form)에 비밀번호를 입력한다. 이 양식은 우리의 보안 클라우드 브라우저 머신에만, 그것도 그 한 번의 사용을 위해서만 존재하는 일회용 키로 비밀번호를 암호화한다. 암호화된 비밀번호는 열리지 않은 채로 브라우저에 전달되고, 브라우저가 이를 사이트에 입력한다. 모델은 비밀번호를 보지 못하고, 저장하거나 반복할 수도 없다. 곧 1Password로도 로그인할 수 있게 된다. Claude Duet이 자격 증명을 요청하면 사용자가 1Password에서 그 요청을 승인하고, 자격 증명은 모델을 거치지 않고 브라우저로 전달된다.</p>

<p>사용자를 대신해 로그인하는 에이전트는 피싱(phishing)을 두 가지 방식으로 바꿔 놓는다. 한편으로, Claude Duet은 사용자를 위해 자격 증명을 보관하지 않으므로 비밀번호를 피싱당할 수 없고, 어떤 숨겨진 지시도 Claude Duet이 갖고 있지 않은 비밀을 털어놓게 만들 수 없다. 다른 한편으로, 로그인 양식 자체가 표적이 된다. 비밀번호를 요구하는 것은 무엇이든 흉내 낼 수 있기 때문이다. 그래서 Claude Duet의 로그인 양식은 사용자가 요청한 로그인 과정 중에, 앱 안에서만 나타난다. 링크, 문자 메시지, 이메일, 또는 claude.ai가 아닌 웹사이트로 오는 일은 절대 없다. Claude Duet처럼 보이는 무언가가 다른 곳에서 비밀번호를 요구한다면, 그것은 진짜가 아니다.</p>

<p><strong>로그인 토큰</strong></p>

<p>연결된 앱에서 작업할 때 Claude Duet은 <a href="https://www.anthropic.com/engineering/managed-agents">우리의 Claude Managed Agents 설계</a>를 따르므로, 자격 증명은 에이전트의 작업이 닿지 않는 곳에 있다. 연결된 서비스의 로그인 토큰처럼 에이전트가 사용자를 대신해 쓰는 자격 증명은 에이전트가 작업하는 머신에 절대 들어가지 않는다. 그 대신 그 머신에는 자격 증명의 자리 표시자(placeholder)가 놓이고, 그 머신 바깥의 프록시(proxy)가 요청이 이뤄지는 순간에만 실제 값을 넣는다.</p>

<p><strong>브라우저</strong></p>

<p>Claude Duet의 브라우저는 클라우드에 있는 전용 가상 머신에서 실행되며, 모델과도, 에이전트가 작업하는 클라우드 컴퓨터와도 분리되어 있다. 에이전트는 정해진 명령어 집합으로만 브라우저를 조작한다. <em>이 페이지를 열어라, 여기를 클릭하라, 이것을 입력하라</em> 같은 것이다. 사이트가 실행하는 것은 무엇이든 <a href="https://www.anthropic.com/engineering/managed-agents">브라우저 머신에 머문다</a>. 사이트의 코드와 쿠키는 Claude Duet의 메모리에도, 사용자의 연결된 앱에도 닿지 않으며, 에이전트의 어떤 명령으로도 브라우저에서 쿠키를 읽어 낼 수 없다. 돌아오는 것은 페이지의 텍스트와 다운로드 파일인데, 에이전트가 일을 하려면 이것을 읽어야 하기 때문이다. 다른 검사들이 존재하는 이유가 바로 이것이고, Claude Duet이 우리의 <a href="https://www.anthropic.com/research/prompt-injection-defenses">브라우저 사용 연구</a>에서 설명한 프롬프트 인젝션(prompt injection) 안전장치도 함께 쓰는 이유이기도 하다. 브라우저를 통해 업로드하는 파일에도 메시지와 똑같은 민감 정보 검사가 적용된다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-duet-safety-privacy-and-security/browser-boundary.png" alt="Claude의 컴퓨터에서 일어나는 일과 사용자의 컴퓨터에 남는 것을 보여 주는 그림"><figcaption>그림 3. 브라우저 경계: 정해진 명령은 경계를 넘어가고 페이지 텍스트는 돌아오지만, 사이트의 코드·쿠키·다운로드는 브라우저 머신에 머문다.</figcaption></figure>

<p>Claude Duet은 또한 스스로를 에이전트라고 밝히도록 설계됐다. 현재 Claude Duet의 웹 브라우저가 보내는 요청에는 고유한 User-Agent 헤더가 포함되며, 우리는 Claude Duet이 웹을 탐색할 때 쓰는 공인 IP 주소를 공개한다. 그래서 사이트들은 Claude Duet을 알아보고 어떻게 대할지 정할 수 있다. 출시 전에 우리는 여러 대형 웹사이트에 연락해 Claude Duet의 방문을 막을 수 있는 선택권을 주었고, 일부는 실제로 막기로 했다. 리서치 프리뷰에서 배우는 것을 바탕으로 Claude Duet이 스스로를 밝히는 방식을 계속 다듬어 나갈 것이다.</p>

<figure><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-duet-safety-privacy-and-security/credential-path.png" alt="비밀번호의 자격 증명 경로를 보여 주는 그림"><figcaption>그림 4. 자격 증명 경로: 비밀번호는 사용자의 휴대폰에서 암호화되고, 브라우저 머신에서만 열리며, 모델을 절대 거치지 않는다.</figcaption></figure>

<h2>Claude Duet을 어떻게 테스트했나</h2>

<p>테스트는 리서치 프리뷰 훨씬 전에 시작됐고 지금도 계속되고 있다. 우리의 Safeguards 팀은 루틴 형태의 작업으로 평가(evaluation)를 만들었는데, 각 작업은 세 가지 변형으로 되어 있다. 무해한 버전, 지시가 주입된(injected) 버전, 그리고 에이전트가 요청받은 것보다 더 많은 일을 하도록 유혹하는 버전이다. 이 평가들은 실제 사용에서 나온 섀도 트래픽(shadow traffic)과 함께 실행된다.</p>

<p>레드 팀(red team)은 Claude Duet이 정보를 유출하는지, 승인 없이 행동하는지, 악의적인 프롬프트를 따르는지를 추가로 테스트했다. 우리는 시스템이 닿는 저장소(repository)와 신뢰 경계(trust boundary) 전반에 걸쳐 시스템 전체의 위협 모델(threat model)을 만들었다. 외부 침투 테스트(penetration testing) 업체가 우리 소스 코드에 접근한 상태로 Claude Duet을 테스트했고, 클라우드 브라우저와 로그인 양식을 다루는 후속 작업이 지금 진행 중이다. 새로운 자격 증명 기능은 누구에게든 출시되기 전에 각각 격리된 환경에서 레드 팀 테스트를 거친다.</p>

<p>Claude Duet은 Anthropic의 공개 버그 바운티(bug bounty) 프로그램 대상에도 포함된다. 이 프로그램은 우리의 책임 있는 공개 정책(responsible disclosure policy)에 따라 유효한 보고에 보상하고 선의의 연구에 대해 면책(safe harbor)을 제공한다. 보안 취약점을 발견했다면 꼭 알려 주길 바란다. <a href="https://hackerone.com/anthropic">HackerOne</a>의 Anthropic 버그 바운티 프로그램을 통해 보고하면 된다.</p>

<h2>여러분과 함께 만들어 가기</h2>

<p>우리가 Claude Duet을 리서치 프리뷰로 공개하는 이유는, 사람들이 개인용 에이전트에서 무엇을 중요하게 여기는지, 다음에 보고 싶은 보호 장치와 통제 기능은 무엇인지 배우고 싶기 때문이다. 여기서 설명한 내용 중 일부는 아직 바뀌는 중이다. 얼마나 자주 승인을 요청하는지, 어떻게 로그인하는지, 그리고 민감 정보 검사가 사적인 것과 무해한 것을 얼마나 잘 구분하는지 같은 것들이다. 보고 싶은 것이나 잘못된 점을 Claude Duet에게 평범한 말로 이야기하면, Claude Duet이 우리 팀에 보고서를 제출한다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
