---
slug: "reducing-cost-and-improving-performance-with-claude-platform"
title: "Claude Platform으로 비용은 줄이고 성능은 끌어올리기"
nav: "비용 절감·성능 향상 · 캐싱·지시문·effort"
main: "Claude blog"
cat: "Agents"
date: "2026-09-08"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; border:1px solid var(--line); }\n  pre code { background: none; padding: 0; font-size: 0.85rem; line-height:1.5; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; aspect-ratio: 16 / 9; margin: 22px 0; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%;\n    border: 0; border-radius: 8px; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 7709
---

<!-- rendered HTML -->
<header>
  <h1>Claude Platform으로 비용은 줄이고 성능은 끌어올리기</h1>
  <div class="meta">
    2026년 9월 8일 · 카테고리: 에이전트 · 제품: Claude Platform · 읽는 시간 5분
    <span class="orig">원문:
      <a href="https://claude.com/blog/reducing-cost-and-improving-performance-with-claude-platform">Reducing cost and improving performance with Claude Platform</a>
      (한글 번역본)</span>
    <span class="orig">글쓴이: Lance Martin</span>
  </div>
</header>

<figure class="hero"><img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/hero.svg" alt="벽돌을 쌓는 손 일러스트"></figure>

<h2>개요</h2>
<p>성능과 비용은 반드시 맞바꿔야 하는 관계가 아니다. 조직은 품질을 유지하면서도 Claude Platform 비용을 줄일 수 있다. 핵심은 세 가지다 — 프롬프트 캐시 적중률을 최적화하고, 모델을 업그레이드할 때 낡은 지시문을 제거하고, effort(노력) 수준을 상황에 맞게 조정하는 것이다.</p>

<hr>

<h2>프롬프트 캐시</h2>
<p>Claude가 응답을 생성하기 전, 프롬프트는 "프리필(prefill)" 단계를 거쳐 내부 작업 상태로 처리된다. 이 프리필이 입력 처리 과정에서 가장 비용이 큰 단계다. 프롬프트 캐싱은 이 상태를 보존해 두었다가, 요청이 동일한 접두부(prefix)로 시작하면 다시 계산하는 대신 캐시된 상태를 그대로 가져다 쓴다. 캐시를 읽는 비용은 전체 입력 처리 비용의 극히 일부만 청구된다.</p>

<h3>실무에서 고려할 점</h3>
<ul>
  <li>캐시는 특정 모델에 고정되어 있다</li>
  <li>캐시를 읽으려면 프롬프트 전체 구간이 바이트 단위로 정확히 일치해야 한다</li>
  <li>캐시에는 제한된 TTL(유효 시간)이 있다</li>
</ul>

<h3>모범 사례</h3>
<ul>
  <li>대화 도중에 effort나 thinking 설정을 바꾸지 않는다. 이 설정들은 프롬프트 접두부에 함께 렌더링되기 때문이다</li>
  <li>타임스탬프·ID처럼 자주 바뀌는 값은 접두부 바깥에 둔다</li>
  <li>도구(tool) 정의의 순서가 스스로 바뀌지 않도록 막는다</li>
  <li>대화를 포크(fork)할 때는 주의를 기울인다</li>
  <li>캐시 TTL을 넘기는 동기식 도구 호출은 피한다</li>
  <li>Claude Console에서 캐시 적중률을 모니터링한다</li>
  <li>자주 쓰지 않는 도구는 defer_loading으로 지연 로드한다</li>
  <li>시스템 프롬프트를 수정할 때는 편집이 아니라 메시지 형태로 적용한다</li>
  <li>요청을 구성할 때 안정적인 내용을 앞에, 변동이 잦은 내용을 뒤에 배치한다</li>
  <li>모델이나 effort를 바꿔야 한다면, 캐시가 어차피 깨지는 시점에 맞춰 바꾼다</li>
  <li>자동 캐싱을 사용할 때는 대화가 길어짐에 따라 캐시 브레이크포인트를 옮겨 준다</li>
  <li><code>max_tokens: 0</code> 요청을 보내 캐시를 미리 데워 둔다</li>
  <li>기본 5분짜리 캐시 TTL을 존중하되, 오래 걸리는 작업에는 1시간짜리 TTL을 고려한다</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/cache-diagnostics.png" alt="Claude Console의 캐시 진단 화면">
  <figcaption>그림 1. Claude Console은 연속된 두 요청을 비교해 프롬프트 접두부가 어디서 갈라졌는지 정확히 짚어냄으로써, 예상치 못한 프롬프트 캐시 미스를 진단할 수 있다.</figcaption>
</figure>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/prompt-structure.png" alt="안정적인 접두부 뒤에 동적 콘텐츠를 붙이는 프롬프트 구조 다이어그램">
  <figcaption>그림 2. 안정적인 접두부(prefix) 뒤에 동적인 콘텐츠가 붙는 형태로 프롬프트를 구성한다.</figcaption>
</figure>

<hr>

<h2>지시문(Instructions)</h2>
<p>시간이 지나며 쌓인 지시문은 프런티어 모델의 역량에 비추어 보면 어느새 낡은 것이 되어 있는 경우가 많다. 흔히 나타나는 "안티패턴"은 다음과 같다.</p>
<ul>
  <li><strong>검증 의식(verification rituals):</strong> "결과를 다시 한번 확인하라" 같은 지시는 토큰을 낭비한다</li>
  <li><strong>과도한 꼼꼼함 강요:</strong> "최대한 꼼꼼하게 하라"는 지시는 불필요한 장황함으로 이어진다</li>
  <li><strong>고정된 절차 강제:</strong> 고정된 단계별 프로세스나 스크래치패드 구조는 이제 불필요한 경우가 많다</li>
  <li><strong>낡은 예시:</strong> 과거 모델에 맞춰 다듬어진 few-shot 예시는 불필요한 패턴을 도리어 학습시킨다</li>
  <li><strong>상충하는 규칙:</strong> 서로 모순되는 지시는 성능을 떨어뜨린다</li>
  <li><strong>오래된 설정값:</strong> 이전 세대 Claude에 맞춰졌던 설정이 그대로 남아 있는 경우</li>
</ul>

<h3>안티패턴 고치기</h3>
<p>Claude Code에서 <code>/claude-api prompt-audit</code>를 실행하면 이런 패턴을 찾아내 제거할 수 있다. 고객 지원 벤치마크로 테스트한 결과, Opus 4.8에서 Opus 5로 마이그레이션하는 프롬프트에 prompt-audit을 돌렸더니 평균적으로 비용은 14.6% 줄고 정확도는 5.3% 올랐다. 이때 해결된 문제로는 다음이 있었다.</p>
<ul>
  <li>더 이상 쓰이지 않는 thinking 설정이 API 요청을 거부당하게 만드는 문제</li>
  <li>서로 모순되는 환불 규칙 때문에 정당한 환불 요청이 거부되는 문제</li>
  <li>수동으로 만든 스크래치패드가 내장 thinking 기능과 충돌하는 문제</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/antipatterns.png" alt="Opus 4.8에서 Opus 5로 마이그레이션할 때 프롬프트 안티패턴이 미친 영향 그래프">
  <figcaption>그림 3. Opus 4.8에서 Opus 5로 모델을 마이그레이션할 때 프롬프트 안티패턴이 미치는 영향.</figcaption>
</figure>

<hr>

<h2>Effort(노력) 수준</h2>
<p>"effort" 설정은 Claude가 얼마나 공들여 작업할지를 결정한다. effort가 낮으면 더 빠르게 결론에 도달하고, 높으면 더 많은 숙고와 검증을 거친다. 비용과 성능 사이의 트레이드오프는 작업에 따라 크게 달라진다.</p>

<h3>성능 예시</h3>
<p><strong>FrontierCode Diamond에서의 Claude Fable 5:</strong> effort를 낮게 설정하면 작업당 5.35달러로 11.5%의 점수를 기록하고, effort를 최대로 올리면 작업당 19.00달러로 30.9%의 점수를 기록한다. 비용은 약 3.5배 늘지만 점수는 약 2.7배 오르는 셈이다.</p>
<p><strong>Humanity's Last Exam에서의 Claude Fable 5.1:</strong> effort를 낮게 설정하면 질문당 0.30달러로 정확도 약 53%, effort를 최대로 올리면 질문당 2.23달러로 정확도 약 61%를 기록한다. 마지막 단계는 비용을 46% 더 쓰지만 얻는 정확도 향상은 미미하다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/fable5-frontiercode.png" alt="FrontierCode Diamond에서 effort 수준별 Fable 5 성능 대 비용 그래프">
  <figcaption>그림 4. FrontierCode Diamond에서 effort 수준에 따른 Fable 5의 성능 대 비용.</figcaption>
</figure>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/fable5-vs-51-cursorbench.png" alt="CursorBench 3.2에서 effort 수준별 Fable 5와 Fable 5.1 비교 그래프">
  <figcaption>그림 5. CursorBench 3.2에서 effort 수준에 따른 Fable 5 대 Fable 5.1 비교.</figcaption>
</figure>

<h3>보정 전략</h3>
<ul>
  <li>더 강한 모델을 낮은 effort로 테스트해 본다. 더 약한 모델을 힘겹게 돌리는 것보다 오히려 저렴할 수 있다</li>
  <li>effort 수준을 스윕(sweep)하며 성능을 측정해, 작업별 트레이드오프를 파악한다</li>
  <li>비용과 성능을 반복적으로 최적화하려면 <code>/claude-api hillclimb</code>를 사용한다</li>
</ul>

<h3>예시 결과</h3>
<p>Opus 4.8 기준선에서 고객 지원 벤치마크를 힐클라이밍한 결과, Opus 5를 낮은 effort로 돌렸을 때 티켓당 2.6센트로 98.9%의 정확도를 기록했다. Sonnet 5를 낮은 effort로 돌리면 정확도가 88.9%까지 떨어졌지만, 프롬프트를 목표에 맞게 개선하자 티켓당 1센트로 98.9%의 정확도를 다시 회복했다. 최종적으로 홀드아웃 데이터에서의 성능은 원래의 78.6%에서 90.5%로 올랐고, 비용은 원래의 5분의 1 수준이었다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/hillclimbing.png" alt="힐클라이밍이 모델·effort·프롬프트를 업데이트해 비용과 성능을 함께 개선하는 과정 다이어그램">
  <figcaption>그림 6. 힐클라이밍은 모델 선택, effort, 프롬프트를 갱신해 나가며 비용과 성능을 함께 개선한다.</figcaption>
</figure>

<hr>

<h2>비용 절감 자동화</h2>
<p><code>/claude-api cost-optimize</code> 명령은 다음과 같은 방식으로 전체적인 비용 감사를 수행한다.</p>
<ul>
  <li>사용량 리포트나 API 응답에서 토큰 지출을 분석한다</li>
  <li>가능한 절감 기회의 우선순위를 매긴다</li>
  <li>(평가 데이터가 있다면) effort 수준과 모델 전반에 걸쳐 비용 대비 성능 트레이드오프를 계산한다</li>
</ul>

<h3>벤치마크 결과</h3>
<ul>
  <li><strong>LegalBench:</strong> 프롬프트 캐싱, 낮은 effort, 배치 처리를 통해 비용 약 58% 절감</li>
  <li><strong>tau2-bench 소매(retail):</strong> 프롬프트 캐시 브레이크포인트를 명시적으로 배치해 비용 약 73% 절감</li>
  <li><strong>OfficeQA Pro:</strong> 배치 처리와 문서 캐싱을 활용해 비용 약 52% 절감</li>
  <li><strong>SWE-bench Verified:</strong> effort를 중간 수준으로 설정하고 출력을 제한해 비용 약 55% 절감</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/reducing-cost-and-improving-performance-with-claude-platform/cost-optimize-benchmarks.png" alt="cost-optimize 적용 전후 벤치마크별 비용·성능 변화 그래프">
  <figcaption>그림 7. <code>/claude-api cost-optimize</code> 적용 전후로 벤치마크별 비용과 성능이 어떻게 달라지는지 보여준다.</figcaption>
</figure>

<hr>

<h2>시작하는 방법</h2>
<ol>
  <li><strong>프런티어 모델로 마이그레이션할 때는 <code>/claude-api prompt-audit</code>부터 시작한다.</strong> 프롬프트, 스킬, 도구 설명이 현재의 모범 사례에 부합하는지 점검한다</li>
  <li><strong><code>/claude-api cost-optimize</code>로 Claude API 사용량을 감사한다.</strong> 지출을 분석하고, prompt-audit·캐싱·배치 처리·출력 제한 같은 레버들을 테스트한다</li>
  <li><strong><code>/claude-api hillclimb</code>을 적용한다.</strong> 평가 데이터셋을 활용해 비용과 성능을 반복적으로 함께 최적화한다</li>
</ol>

<p><strong>더 알아보기:</strong></p>
<ul>
  <li><a href="https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence#cut-spend-without-losing-quality">공식 문서</a></li>
  <li><a href="https://platform.claude.com/cookbook/cost-optimization-cost-optimization#prompt-caching">쿡북(Cookbook)</a></li>
</ul>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
