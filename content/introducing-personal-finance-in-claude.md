---
slug: "introducing-personal-finance-in-claude"
title: "Claude의 개인 금융(Personal Finance) 기능을 소개합니다"
nav: "Claude Personal Finance · Plaid로 은행·카드 계좌 읽기 전용 연결, 지출 분류·월급날까지 잔액·이상 결제 탐지, 미국 Pro·Max·Ultra 베타"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-05"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 3919
---

<!-- rendered HTML -->
<header>
  <h1>Claude의 개인 금융(Personal Finance) 기능을 소개합니다</h1>
  <div class="meta">
    2026년 11월 5일
    · 카테고리: <a href="https://claude.com/resources/articles">Product updates</a>
    · 읽는 시간 5분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/introducing-personal-finance-in-claude">Introducing Personal Finance in Claude</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">이제 내 돈에 대한 답을 얻으려고 은행 앱을 하나하나 열어 직접 계산할 필요가 없습니다. Claude의 개인 금융(Personal Finance) 기능을 사용하면 은행 계좌와 카드 계좌를 안전하게 연결하고 평소 쓰는 말로 질문할 수 있습니다. 접근 권한은 읽기 전용(read-only)이며, Personal Finance는 돈을 이체하거나 관리하거나 투자할 수 없습니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/introducing-personal-finance-in-claude/personal-finance-overview.png" alt="Claude의 Personal Finance 화면" loading="lazy">
</figure>

<p>Claude는 잔액과 거래 내역을 바탕으로 일상적인 말로 답해 주고, 처음 보는 용어가 있으면 설명해 줍니다. <a href="https://www.anthropic.com/news/claude-is-a-space-to-think">Claude의 다른 모든 부분</a>과 마찬가지로 Personal Finance에는 광고나 스폰서 추천이 없고, 자체 신용카드·대출·예금 상품도 제공하지 않습니다. 그래서 돈에 관한 질문에 꾸밈없는 답을 얻을 수 있습니다.</p>

<p>Personal Finance는 이번 주부터 미국의 Pro, Max, Ultra 플랜에서 베타로 순차 출시됩니다.</p>

<h2 id="what-it-looks-like">어떤 모습인가요</h2>

<p>월말이 다가오는데 월급날은 아직 10일이나 남았다고 해 봅시다. Claude에게 “이번 달에 내 돈이 다 어디로 갔지?”라고 물으면, 연결한 계좌 전체의 지출을 합산해 카테고리별로 분류해 줍니다. 이 예시에서는 합계가 4,309.37달러이고, 그중 절반 이상이 집세와 공과금에, 1,024.51달러가 식비와 음료에 쓰였습니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/introducing-personal-finance-in-claude/spending-by-category.png" alt="카테고리별 이번 달 지출 합계" loading="lazy">
</figure>

<p>여기서 더 깊이 파고들 수 있습니다. “평소보다 많은 거야?” “내가 놓친 건 없어?” “그럼 월급날까지 얼마나 남지?” Claude는 이전 달들을 확인해 멤버십 갱신 결제를 짚어 줍니다. 이어서 월급날 전에 입출금 계좌(checking account)에서 빠져나갈 결제 네 건과, 그 뒤 남게 될 금액인 1,393.22달러를 알려 줍니다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/introducing-personal-finance-in-claude/left-before-payday.png" alt="월급날 전 예정된 결제와 남는 금액" loading="lazy">
</figure>

<p>뭔가 이상해 보이는 게 있는지 물으면, Claude는 연결한 모든 계좌를 두루 살펴 놓치기 쉬운 것들을 짚어 줍니다. 두 번 청구된 결제, 예상치 못한 수수료, 1년 내내 슬금슬금 오른 청구서 같은 것들입니다. “내가 버는 것보다 더 많이 쓰고 있어?”나 “APR이 뭐고, 올해 내 APR로 얼마가 나갔어?” 같은 더 큰 질문도 할 수 있습니다. 그러면 Claude가 용어를 설명한 다음, 지금까지 부과된 이자를 합산해 줍니다.</p>

<p>주간 지출 차트, 납부 일정 캘린더, 또는 원하는 숫자만 모은 대시보드를 요청하면 Claude가 만들어 주고, 이후에도 계속 수정해 나갈 수 있습니다.</p>

<h2 id="security-and-privacy">보안과 프라이버시</h2>

<p>Claude의 접근 권한은 읽기 전용입니다. Personal Finance는 돈 상황을 이해하도록 돕는 기능이며, 투자 조언을 하도록 설계되지 않았습니다. Claude는 답변에서 실수를 할 수 있으므로, 어떤 거래들이 그 숫자의 근거인지 물어보고 중요한 수치는 은행에서 확인하세요.</p>

<p>계좌는 사용자가 <a href="https://plaid.com/">Plaid</a>(앱과 은행을 연결해 주는 서비스)를 통해 직접 은행에 로그인해야만 연결됩니다. 그 과정에서 Plaid의 약관에 동의하고 Claude의 읽기 전용 접근을 승인하게 되므로, Claude는 은행 비밀번호를 요구하지도 보지도 않습니다.</p>

<p>사용자가 연결하기로 선택한 계좌에 대해서만(그리고 그 계좌에 한해서) Claude는 은행 이름, 각 계좌의 이름·유형·끝 네 자리, 잔액과 신용 한도, 그리고 최대 2년치 거래 내역을 볼 수 있습니다. Personal Finance 허브에서 Claude와 나눈 대화는 모델 학습에 사용되지 않습니다. 허브 밖에서 Claude와 공유하는 내용에는 사용자의 <a href="https://claude.ai/settings/privacy">프라이버시 설정</a>이 적용됩니다. 계좌 연결은 언제든 해제할 수 있으며, 해제하면 Claude는 더 이상 그 계좌의 데이터를 볼 수 없습니다. 자세한 내용은 <a href="https://privacy.claude.com/en/collections/10663362-consumers">프라이버시 센터(Privacy Center)</a>에서 확인할 수 있습니다.</p>

<h2 id="getting-started">시작하기</h2>

<p>Claude 사이드바에 Personal Finance가 보이면, 열어서 계좌 하나를 연결하고 질문 하나를 던져 보세요. 예를 들어 “올봄에 여행 갈 여유가 있을까?”나 “매달 얼마나 저축할 수 있을까?” 같은 질문입니다. 설정 방법과 데이터가 어떻게 사용·보관되는지는 <a href="https://support.claude.com/en/articles/18185620-use-personal-finance-with-claude" target="_blank" rel="noopener noreferrer">도움말 센터(Help Center)</a>에서 확인할 수 있습니다.</p>

<h2 id="what-s-next">다음 단계</h2>

<p>Personal Finance는 첫걸음입니다. 인생에서 더 큰 돈 문제를 결정할 때는, 사람들이 신뢰하는 공인 전문가 및 규제를 받는 금융 회사와 Claude가 함께 일할 때 가장 도움이 된다고 생각합니다. 저희는 이를 Claude 안에서 어떻게 가능하게 할지 모색하고 있으며, 이를 함께 만들어 가고 싶은 은행, 자산 관리사, 금융 서비스 회사의 의견을 듣고 싶습니다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
