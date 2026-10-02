---
slug: "building-with-claude-sonnet-5-5"
title: "Claude Sonnet 5.5로 개발하기"
nav: "Claude Sonnet 5.5로 개발하기 · Opus와 고르는 기준, 가격, Sonnet 5 마이그레이션, 튜닝"
main: "claude.dev"
cat: "Playbooks"
date: "2026-09-28"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.95rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  td.nw, th.nw { white-space: nowrap; }\n  td.num, th.num { text-align: right; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 16356
---

<!-- rendered HTML -->
<header>
  <h1>Claude Sonnet 5.5로 개발하기</h1>
  <div class="meta">
    2026년 9월 28일
    · 카테고리: Playbooks
    · 글쓴이: Addy Osmani
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/building-with-claude-sonnet-5-5">Building with Claude Sonnet 5.5</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">언제 Opus 대신 Sonnet을 고를지, 비용은 얼마인지, 어떻게 튜닝할지.</p>

<p>Claude Sonnet 5.5는 Opus 5.5에 이어 Claude 5.5 패밀리에 나온 두 번째 모델이다. Sonnet 5보다 확실히 나아져서 더 똑똑하고, 더 효율적이고, 30% 더 빠르다. 토큰당 가격은 그대로이고, Sonnet 5.5는 같은 일을 하는 데 보통 훨씬 적은 토큰을 쓰기 때문에 대부분의 작업에서 비용이 최대 30% 줄어든다.</p>

<figure>
  <video controls muted playsinline loop preload="metadata" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-with-claude-sonnet-5-5/code-to-painting.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-with-claude-sonnet-5-5/code-to-painting-poster.jpg" aria-label="Claude Sonnet 5와 Claude Sonnet 5.5라고 적힌 빈 캔버스 두 개가 붓질 한 번 한 번 채워진다. 각 캔버스 아래에는 brush-engine 호출 횟수가 실시간으로 올라가고, 각 모델이 쓴 코드가 도시 스카이라인의 노을 진 항공 사진을 그려 낸다. 마지막에는 네 패널이 나란히 놓인다. 사진, 그리고 Claude Sonnet 5, Claude Sonnet 5.5, Claude Opus 5.5가 그린 그림이다."></video>
  <figcaption><b>FIG A</b>Lance Martin의 code-to-painting 데모: 각 모델이 같은 사진을 다시 그리는 코드를 쓴다. 왼쪽부터 사진, Claude Sonnet 5, Claude Sonnet 5.5, Claude Opus 5.5.</figcaption>
</figure>

<p><em>code-to-painting 관련 아이디어는 <a href="https://x.com/jkeatn">@jkeatn</a>, 참고 이미지는 <a href="https://x.com/IceSolst">@IceSolst</a>에게 감사를 전한다.</em></p>

<p>이 가이드는 모델로 무언가를 만드는 방법에 관한 글이다. 직접 써 보려면 아래 요청을 그대로 실행하면 된다.</p>

<pre><code>import anthropic
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures",
        }
    ],
    output_config={"effort": "medium"},
)
for block in response.content:
    if block.type == "text":
        print(block.text)</code></pre>

<p>루프가 블록을 타입별로 읽는 이유는 Sonnet 5.5가 기본으로 생각(thinking)을 하기 때문이다. 응답이 <code>thinking</code> 블록으로 시작할 수 있어서, <code>content[0].text</code>를 읽는 코드는 깨진다.</p>

<h2 id="choosing-between-sonnet-55-and-opus-55">Sonnet 5.5와 Opus 5.5 중 고르기</h2>

<p>Claude 5.5 패밀리에서 Opus 5.5는 신중한 판단이 필요한 복잡한 일을 위해 만들어졌다. 버그 수정이나 기능을 빠르게 반복 개선하는 것처럼 범위가 잘 정해진 일상 작업에는 Sonnet 5.5를 쓰자. Sonnet 5.5는 깔끔한 문서, 슬라이드, 스프레드시트도 만들어 내고, 디자인 감각도 뛰어나다. 속도가 빨라서 빠른 반복 작업에 잘 맞는다. 대량·저지연 워크플로우를 위한 Claude Haiku 5.5도 몇 주 안에 패밀리에 합류할 예정이다.</p>

<table>
<tr><th scope="col">워크로드</th><th scope="col" class="nw">시작 모델</th></tr>
<tr><td>범위가 잘 정해진 일상 코딩: 버그 수정, 기능의 빠른 반복 개선, 요구사항 대비 검증</td><td class="nw">Sonnet 5.5</td></tr>
<tr><td>대량의 일상 개발 작업</td><td class="nw">Sonnet 5.5</td></tr>
<tr><td>디자인 감각이 도움이 되는 깔끔한 문서·슬라이드·스프레드시트: 원페이저, 다이어그램, 요약 슬라이드, 문서 편집, 스프레드시트 정리 등</td><td class="nw">Sonnet 5.5</td></tr>
<tr><td>반복해서 돌리는, 잘 정의된 에이전트 작업: 조사, 리뷰, 초안 작성</td><td class="nw">Sonnet 5.5</td></tr>
<tr><td>신중한 판단이 필요한 복잡한 일. 장기(long-horizon) 에이전틱 코딩과 지식 노동 포함</td><td class="nw">Opus 5.5</td></tr>
<tr><td>가장 높은 지능이 필요한 가장 어려운 문제</td><td class="nw">Opus 5.5</td></tr>
</table>

<blockquote>
<p>"Epic의 초기 테스트에서 Claude Sonnet 5.5는 상위 티어 모델에 기대할 만한 품질 기준을 그대로 통과했고, 시스템 설계 감사와 데이터 플로우 리뷰에서도 흔들리지 않았습니다. 새 모델은 게임플레이 시스템 아키텍처를 위한 수만 줄의 코드를 다루면서도 응답이 빠릿했고, 몇 시간짜리 작업도 처리했으며, 덜 세세한 프롬프트로도 결과를 냈습니다." (Daniel Vogel, Epic Games COO)</p>
</blockquote>

<p>Sonnet 5.5는 작업에 명확한 스펙과 결과를 확인할 방법이 있을 때 가장 잘 맞는다. <a href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5">프롬프팅 가이드</a>의 표현을 빌리면, "가장 어려운 장기 작업에는 Opus 모델이 더 나은 선택이다."</p>

<h2 id="pricing">가격</h2>

<table>
<tr><th scope="col">100만 토큰당</th><th scope="col" class="num nw">Sonnet 5.5</th><th scope="col" class="num nw">Opus 5.5</th></tr>
<tr><td>입력</td><td class="num nw">$2</td><td class="num nw">$4</td></tr>
<tr><td>출력</td><td class="num nw">$10</td><td class="num nw">$20</td></tr>
<tr><td>캐시 쓰기, 5분</td><td class="num nw">$2.50</td><td class="num nw">$5</td></tr>
<tr><td>캐시 쓰기, 1시간</td><td class="num nw">$4</td><td class="num nw">$8</td></tr>
<tr><td>캐시 읽기</td><td class="num nw">$0.20</td><td class="num nw">$0.20</td></tr>
</table>

<p>배치 처리와 프롬프트 캐싱을 포함해 Sonnet 5.5의 모든 가격은 Sonnet 5와 같다. 그래서 모델 ID만 바꿔도 토큰당 청구액은 바뀌지 않는다. 미국 내 추론만 쓰는 옵션(<code>inference_geo: "us"</code>)은 표준 가격의 1.1배다.</p>

<p>토큰당 가격은 그대로지만 전체 청구액은 달라진다. 앞서 말했듯 Sonnet 5.5는 작업당 토큰을 Sonnet 5보다 보통 덜 쓰기 때문이다.</p>

<p>표면(surface)마다 Sonnet의 기본 effort가 다를 수 있다는 점도 알아 두자. 예를 들어 Claude Platform에서는 high, Claude Code에서는 medium이다.</p>

<p>Sonnet 5.5는 긴 변의 길이가 최대 2576픽셀인 고해상도 이미지 티어를 쓴다. 그래서 2000×1500 이미지 한 장은 Sonnet 4.6, Sonnet 4.5, Haiku 4.5에서보다 약 2.5배의 토큰이 든다. 세부 묘사가 필요 없다면 보내기 전에 축소하자.</p>

<h2 id="model-details">모델 상세</h2>

<table>
<tr><th scope="col">항목</th><th scope="col">Sonnet 5.5</th></tr>
<tr><td><strong>모델 ID</strong></td><td>Claude API, AWS·Google Cloud·Microsoft Foundry의 Claude Platform에서는 <code>claude-sonnet-5-5</code>; Amazon Bedrock에서는 <code>anthropic.claude-sonnet-5-5</code></td></tr>
<tr><td><strong>컨텍스트 윈도우</strong></td><td>100만(1M) 토큰, 네이티브 지원, 베타 헤더 불필요</td></tr>
<tr><td><strong>최대 출력</strong></td><td>128k 토큰; Message Batches API에서 <code>output-300k-2026-03-24</code> 베타 헤더를 쓰면 최대 300k</td></tr>
<tr><td><strong>지식 컷오프</strong></td><td>2026년 6월</td></tr>
<tr><td><strong>Thinking</strong></td><td>기본 켜짐(adaptive thinking); <code>between_tools</code>로 사전(upfront) thinking을 끌 수 있음</td></tr>
<tr><td><strong>Effort 레벨</strong></td><td><code>low</code>, <code>medium</code>, <code>high</code>, <code>xhigh</code>, <code>max</code></td></tr>
<tr><td><strong>기본 effort</strong></td><td>Claude API에서는 <code>high</code>; Claude Code에서는 <code>medium</code></td></tr>
<tr><td><strong>토크나이저</strong></td><td>Sonnet 5와 동일</td></tr>
<tr><td><strong>최소 캐시 가능 프롬프트</strong></td><td>512 토큰(Sonnet 5는 1,024)</td></tr>
<tr><td><strong>속도 제한(rate limit)</strong></td><td>Sonnet 5와 별도이며, 기본 티어 값은 동일</td></tr>
<tr><td><strong>Priority Tier</strong></td><td>Claude API에서 사용 가능</td></tr>
<tr><td><strong>데이터 보존</strong></td><td>자격이 되는 고객은 zero data retention 사용 가능</td></tr>
</table>

<p>Claude API의 기본값은 <code>high</code>라서 처음부터 좋은 결과로 시작할 수 있다. 거기서 시작해 평가해 보고, 워크로드에 맞는 effort 레벨을 고르자. <code>xhigh</code>나 <code>max</code> effort를 쓰고 싶다면, Sonnet 5.5가 더 오래 생각하고 비용도 더 든다는 점을 기억하자. 어떤 작업에서는 Sonnet을 유용하게 만드는 것, 즉 품질·속도·비용의 균형을 일부 잃을 수 있다. 그런 경우라면 Opus 5.5를 고려하자.</p>

<h2 id="migrating-from-sonnet-5">Sonnet 5에서 마이그레이션하기</h2>

<p>Thinking은 기본으로 켜져 있다. Sonnet 5를 thinking을 끈 채로 돌렸다면 <code>between_tools</code>로 사전 thinking을 끌 수 있다. 아래 1단계에서 방법을 보여 준다.</p>

<p>모델 ID를 <code>claude-sonnet-5-5</code>로 바꾼 다음, 다섯 가지 호환성 깨짐(breaking change)과 응답 형태의 변화 한 가지를 차례로 처리하자. <a href="https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide">Sonnet 5.5 마이그레이션 가이드</a>가 각각을 자세히 다룬다.</p>

<p>Claude Code가 마이그레이션을 대신해 줄 수도 있다. <code>/claude-api migrate this project to claude-sonnet-5-5</code>를 실행하면 번들된 <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill#migrating-to-a-newer-claude-model">Claude API 스킬</a>이 호출되어, 코드베이스 전체에 모델 ID 교체와 호환성이 깨지는 파라미터 변경을 적용한다.</p>

<h3 id="1-turn-off-upfront-thinking-with-between_tools">1. between_tools로 사전 thinking 끄기</h3>

<p>Sonnet 5.5에서는 <code>thinking</code> 필드가 없는 요청은 adaptive thinking으로 실행되고, <code>thinking: {"type": "disabled"}</code>는 400 오류를 돌려준다. 대신 새로운 <code>between_tools</code> 설정을 보내자. <code>between_tools</code>를 쓰면 thinking은 툴 호출 사이에서만 일어나고, 전체 응답 시간은 같거나 더 빨라진다.</p>

<pre><code># Before: Claude Sonnet 5
client.messages.create(
    model="claude-sonnet-5",
    max_tokens=16000,
    thinking={"type": "disabled"},
    output_config={"effort": "xhigh"},
    messages=[{"role": "user", "content": "..."}],
)
# After: Claude Sonnet 5.5
client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=16000,
    thinking={"type": "between_tools"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)</code></pre>

<p>이 예시는 effort도 <code>xhigh</code>에서 <code>high</code>로 낮췄다. <code>between_tools</code>에는 다음과 같은 제한이 있기 때문이다.</p>

<ul>
<li><code>between_tools</code>는 <code>low</code>, <code>medium</code>, <code>high</code> effort에서 동작한다. <code>xhigh</code>나 <code>max</code>에서는 400 오류를 돌려준다. 그 레벨에서 돌리려면 adaptive thinking을 쓰자.</li>
<li>다른 필드를 받지 않는다. <code>display</code>, <code>budget_tokens</code>, <code>block_binding</code>을 함께 보내면 400 오류가 난다.</li>
<li><code>between_tools</code>를 쓰면 대화 도중에 effort를 바꿀 수 없다. 턴마다 effort를 다르게 주려면 adaptive thinking을 쓰자.</li>
<li>모델이 툴 호출 사이에 쓰는 짧은 진행 상황 업데이트는 여전히 요약 텍스트가 담긴 <code>thinking</code> 블록으로 돌아온다. 콘텐츠 블록을 타입별로 읽고, 이 블록들을 어시스턴트 턴의 나머지와 함께 그대로 다시 넘기자. 툴이 없으면 응답에는 텍스트만 담긴다.</li>
<li>Sonnet 5.5를 제공하는 모든 플랫폼에서 베타 헤더 없이 동작한다. 쓰는 SDK 버전에 <code>between_tools</code>가 정의되어 있지 않다면 업데이트하자.</li>
</ul>

<p><code>between_tools</code>로 사전 thinking을 껐다면, 툴 없이 몇 단계의 추론이 필요한 요청에는 adaptive thinking을 대신 쓰자.</p>

<h3 id="2-replace-forced-tool_choice-with-auto-plus-strict-tools">2. 강제 tool_choice를 auto와 strict 툴로 바꾸기</h3>

<p><code>any</code>나 <code>tool</code> 타입의 <code>tool_choice</code>는 400 오류를 돌려준다. 토큰 카운팅 엔드포인트에서도 마찬가지다. <code>auto</code>를 보내고, 입력이 스키마와 일치하도록 툴에 <code>strict: true</code>를 표시한 다음, 언제 그 툴을 쓸지 프롬프트에 적자.</p>

<pre><code>weather_tool = {
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "input_schema": {
        "type": "object",
        "properties": {"location": {"type": "string"}},
        "required": ["location"],
        "additionalProperties": False,
    },
    "strict": True,
}
client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    tools=[weather_tool],
    tool_choice={"type": "auto"},  # was {"type": "tool", "name": "get_weather"}
    messages=[
        {"role": "user", "content": "What's the weather in Paris? Use the get_weather tool."}
    ],
)</code></pre>

<p>strict 툴 사용에는 모든 객체에 <code>additionalProperties: false</code>가 필요하다.</p>

<h3 id="3-keep-conversations-append-only">3. 대화는 덧붙이기만(append-only) 하기</h3>

<p>Sonnet 5.5의 thinking 블록은 모델과 대화에 묶여 있다. Sonnet 5.5는 Sonnet 5의 thinking 블록을 읽을 수 있으므로, Sonnet 5에서 Sonnet 5.5로 전환한 대화는 추론을 그대로 유지한다. 다른 어떤 모델도 Sonnet 5.5의 블록을 읽지 못한다.</p>

<h3 id="4-move-computer-use-to-the-toolset">4. 컴퓨터 사용(computer use)을 toolset으로 옮기기</h3>

<p>Claude API와 Google Cloud에서 Sonnet 5.5는 <code>{"type": "computer_toolset_20260801"}</code>를 통해서만 컴퓨터 사용을 지원한다. <code>computer_20251124</code>를 선언한 요청은 400 오류를 돌려준다. 요청에서 <code>anthropic-beta: computer-use-2025-11-24</code> 헤더를 빼고, SDK에서는 <code>betas</code> 파라미터를 제거한 뒤 beta 네임스페이스가 아닌 표준 클라이언트로 Messages API를 호출하자. <code>tools</code> 항목을 교체하고, 멤버 <code>tool_use</code> 블록, 배치 액션, 결과의 <code>toolset_name</code>에 맞게 에이전트 루프를 업데이트하자. <code>fine-grained-tool-streaming-2025-05-14</code> 베타 헤더를 보내고 있다면 그것도 제거하자. toolset 항목과 함께 보내면 400 오류가 나기 때문이다. 대신 필요한 툴마다 <code>eager_input_streaming: true</code>를 설정하자. Amazon Bedrock은 여전히 <code>computer_20251124</code>를 받는다.</p>

<h3 id="5-check-your-advisor-pairing">5. advisor 조합 확인하기</h3>

<p>advisor 툴에서 Sonnet 5.5 실행자(executor)는 Opus 4.8, Opus 4.7, Sonnet 5를 advisor로 거부한다. 허용되는 advisor에는 Opus 5.5, Opus 5, 그리고 Sonnet 5.5 자신이 포함된다. 허용된 모든 advisor의 조언은 <code>advisor_redacted_result</code> 블록으로 암호화되어 돌아오므로, 코드에서 조언 텍스트를 읽을 수는 없다.</p>

<h3 id="6-read-text-between-tool-calls-from-thinking-blocks">6. 툴 호출 사이의 텍스트는 thinking 블록에서 읽기</h3>

<p>이 변화는 오류를 내지는 않지만, UI가 툴 호출 사이에 모델이 남기는 메모를 더 이상 보여 주지 않게 될 수 있다. 그 메모는 한두 문장보다 길면 진행 상황 업데이트용 <code>thinking</code> 블록으로 돌아오는데, 기본 <code>display</code> 설정에서는 이 블록이 비어 있다.</p>

<p>adaptive thinking에서는 <code>thinking.display</code>를 <code>"updates"</code>(베타, <code>thinking-display-updates-2026-08-18</code> 헤더 필요) 또는 <code>"summarized"</code>로 설정하고, 비어 있지 않은 각 <code>thinking</code> 블록을 그 뒤에 오는 <code>tool_use</code> 블록 앞에 렌더링하자. <code>between_tools</code>에서는 <code>display</code> 없이 텍스트가 돌아온다.</p>

<p>Sonnet 5.5는 메시지별 effort(베타), 대화 중 시스템 메시지, 대화 중 툴 변경(베타)도 추가했다. Sonnet 4.6 이하나 Haiku 4.5에서 옮겨 오는 경우라면, <a href="https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide">마이그레이션 가이드</a>에 시작 모델별 체크리스트가 있다.</p>

<h2 id="tuning">튜닝</h2>

<h3 id="re-run-your-effort-sweep">effort 스윕 다시 돌리기</h3>

<p>effort 레벨이 다시 보정되었기 때문에, 같은 레벨이라도 Sonnet 5에서만큼 생각하지 않으며 기존 설정이 그대로 옮겨지지 않는다. 워크로드가 에이전틱하거나 지연에 민감하지 않다면 <code>high</code>에서 시작하자. 에이전틱 코딩과 다단계 툴 사용에서는 잘 명세된 작업이면 <code>medium</code>에서 시작하고, 더 어렵거나 긴 작업이면 <code>high</code>로 올리자. 채팅처럼 지연에 민감한 작업은 <code>medium</code>이나 <code>low</code>에서 시작하자. <code>xhigh</code>나 <code>max</code>는 평가(eval)에서 품질 향상이 확인되는 곳에만 쓰자.</p>

<p>Thinking은 <code>max_tokens</code>에 포함되므로 여유를 두자. 에이전틱 코딩에서는 <code>max_tokens</code>를 모델 최대치인 128,000으로 설정하고 응답을 스트리밍하자. Thinking을 줄이고 싶다면 effort 레벨을 낮추자. 시스템 프롬프트에서 모델에게 덜 생각하라고 해도 확실하게 줄어들지는 않기 때문이다.</p>

<h3 id="remove-sonnet-5-workarounds">Sonnet 5용 우회책 제거하기</h3>

<p>기존 Sonnet 5 프롬프트는 바꾸지 않아도 잘 동작할 것이다. 프롬프트에 거부(refusal) 유도, 툴 호출 재시도 심(shim), "게으르게 굴지 마" 같은 우회책이 들어 있다면, 다른 튜닝을 하기 전에 먼저 그것들을 제거하고 평가를 다시 돌리자.</p>

<h3 id="ask-for-real-checks-at-low-effort">low effort에서는 실제 검사를 요구하기</h3>

<p>Sonnet 5.5는 대체로 변경을 완료했다고 보고하기 전에 자기 작업을 검사하지만, <code>low</code> effort에서는 변경을 실제로 실행해 보는 검사를 가끔 건너뛴다. 테스트나 빌드 출력 없이 변경이 완료됐다고 보고되는 일이 보인다면, 프롬프팅 가이드는 다음 시스템 프롬프트 문단을 권한다.</p>

<pre><code>When you change code that can be run, built, or type-checked, run a real
check that exercises the change before reporting it done: the project's
tests, type-checker, or build, or the changed command itself. A syntax-only
check, or a check command that failed to start, does not count; if all
that is missing is the project's declared dependencies, install them with
its own package manager and lockfile (e.g. npm install, pip
install -r requirements.txt), never via sudo or the system package manager,
unless told not to. Only if no real check can run here, say which one you
did not run and why instead of reporting the change as done.</code></pre>

<h3 id="use-thinkingdisplay-for-progress">진행 상황에는 thinking.display 쓰기</h3>

<p>모델에게 응답 안에 추론 과정을 써 달라고 하지 말자. 그러면 <code>reasoning_extraction</code> 거부를 부른다. 대신 요약된 thinking을 읽자.</p>

<pre><code>thinking={"type": "adaptive", "display": "summarized"}</code></pre>

<p>사용자에게 보여 줄 진행 메모만 따로 받으려면 <code>display: "updates"</code>(베타)를 쓰자. 첫 툴 호출 전에 한 줄, 끝에 짧은 요약처럼 예측 가능한 지점에서 업데이트를 받고 싶다면 시스템 프롬프트에 그렇게 적자.</p>

<h3 id="cache-more-of-your-prompt">프롬프트를 더 많이 캐시하기</h3>

<p>최소 캐시 가능 프롬프트가 512 토큰으로 줄어서, 더 짧은 시스템 프롬프트와 툴 정의도 이제 캐시 대상이 된다. 캐시 읽기는 입력 가격의 10분의 1이다. 요청 사이에 최상위 effort를 바꾸면 캐시가 무효화된다. 한 턴만 다른 레벨로 돌리려면 캐시를 유지하는 메시지별 effort(베타)를 쓰자.</p>

<h2 id="refusals-and-fallback">거부와 폴백</h2>

<p>자동화된 행동 감사(behavioral audit)에서 Sonnet 5.5는 정렬(alignment)과 정직성의 대부분 지표에서 Sonnet 5와 같거나 더 낫다. 또한 가장 뛰어난 모델들과 비슷한 사이버보안 안전장치를 갖춘 첫 Sonnet 모델이다. 대부분의 일상적인 소프트웨어 개발에는 영향이 없다.</p>

<p>거부된 요청은 HTTP 200과 함께 <code>stop_reason: "refusal"</code>을 돌려주고, <code>stop_details</code>에 다섯 가지 범주 중 하나가 적힌다. <code>cyber</code>, <code>bio</code>, <code>frontier_llm</code>, <code>reasoning_extraction</code>, <code>general_harms</code>다. 서버 측 폴백(<code>fallbacks: "default"</code>, 베타, Claude API)은 <code>cyber</code>와 <code>frontier_llm</code> 거부를 Sonnet 5에서 재시도한다. 나머지 세 범주는 재시도하지 않는다. SDK 미들웨어나 직접 만든 재시도 로직을 쓸 수도 있다.</p>

<p>정당한 보안 작업을 위해 Cyber Verification Program이 곧 Sonnet 5.5까지 확대될 예정이다.</p>

<h2 id="availability">제공 현황</h2>

<p>Claude Sonnet 5.5는 오늘부터 아래 플랫폼에서 사용할 수 있다. 개발자 플랫폼에서는 다음 모델 ID를 쓰자.</p>

<ul>
<li>Claude API: <code>claude-sonnet-5-5</code></li>
<li>Amazon Bedrock: <code>anthropic.claude-sonnet-5-5</code></li>
<li>AWS의 Claude Platform: <code>claude-sonnet-5-5</code></li>
<li>Google Cloud: <code>claude-sonnet-5-5</code></li>
<li>Microsoft Foundry: <code>claude-sonnet-5-5</code>, Global Standard 배포에서만</li>
</ul>

<h3 id="in-claude-code">Claude Code에서</h3>

<p>Claude Code v2.1.284(Agent SDK for TypeScript v0.3.284 이상)부터 <code>sonnet</code> 별칭은 Claude API에서 Sonnet 5.5로 해석된다. 기본으로 <code>medium</code> effort로 실행되며, 1M 컨텍스트 윈도우를 네이티브로 쓴다. Claude Code에서는 Sonnet 5.5의 thinking을 끌 수 없고, effort가 모델이 얼마나 생각할지를 정한다. Sonnet 5.5에는 fast mode가 없다. <code>default</code> 모델은 Opus 5.5로 유지되므로, 범위가 잘 정해진 작업에는 <code>/model sonnet</code>으로 전환하자.</p>

<p>Sonnet 5.5를 즐겁게 써 보시길 바라며, 언제나처럼 피드백을 자유롭게 보내 주시길.</p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
