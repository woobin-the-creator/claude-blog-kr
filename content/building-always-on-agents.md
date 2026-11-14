---
slug: "building-always-on-agents"
title: "상시 가동 에이전트 만들기"
nav: "상시 가동 에이전트 만들기 · 잠들었다 깨는 실행(run)·세션 사이클, 5대 기본 요소(이벤트 인박스·타이머·메모리·권한·아웃박스), 워커 1개·이벤트 배치, 메모리 4종, 자격 증명 프록시·지연된 도구 호출"
main: "Claude blog"
cat: "Best practices"
date: "2026-11-13"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h2 .num { color: var(--accent); font-size: 0.85em; margin-right: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .video-title { color: var(--muted); font-size: 0.85rem; text-align: center; margin: 0 0 24px; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .callout h4 { margin: 4px 0 6px; font-size: 1rem; }\n  .callout p:last-child { margin-bottom: 0; }\n  .logos { display:flex; flex-wrap:wrap; gap:10px; margin:16px 0 24px; padding:0; list-style:none; }\n  .logos li { margin:0; }\n  .logos img { height:44px; width:auto; border:1px solid var(--line); border-radius:6px;\n    background:#fff; padding:8px 10px; display:block; }\n  table { border-collapse: collapse; width: 100%; margin: 16px 0 24px; font-size: 0.88rem; }\n  th, td { border: 1px solid var(--line); padding: 6px 8px; text-align: center; }\n  th { background: #faf8f6; font-weight: 600; }\n  td:first-child { text-align: left; font-weight: 600; }\n  .stats { display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px; margin: 20px 0 24px; }\n  .stat { border:1px solid var(--line); border-radius:8px; padding:14px 16px; }\n  .stat img { height:22px; width:auto; display:block; margin-bottom:10px; }\n  .stat b { display:block; font-size:1.5rem; color:var(--accent); line-height:1.3; }\n  .stat span { color:var(--muted); font-size:0.86rem; }\n  .toc { border:1px solid var(--line); border-radius:8px; padding:14px 18px; margin: 16px 0 24px; }\n  .toc p { margin:0 0 6px; font-weight:600; }\n  .toc ol { margin:0; }\n  .setup { border:1px solid var(--line); border-radius:10px; padding:16px 18px; margin: 16px 0 24px; background:#fcfcfb; }\n  .setup > p:first-child { font-weight:600; margin-bottom:10px; }\n  .setup dl { margin:0; }\n  .setup dt { font-weight:600; font-size:0.9rem; color:var(--accent); margin-top:10px; }\n  .setup dd { margin: 2px 0 0; }\n  .setup dd.instr { background:#fff; border:1px solid var(--line); border-radius:6px; padding:10px 12px; font-size:0.92rem; }\n  .setup details { margin-top:8px; font-size:0.85rem; color:var(--muted); }\n  .setup details p { margin:6px 0 0; font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size:0.8rem; line-height:1.55; }\n  .q { display:flex; gap:14px; align-items:flex-start; margin: 22px 0;\n    background:#fafafa; border:1px solid var(--line); border-radius:10px; padding:16px 18px; }\n  .q img { width:52px; height:52px; border-radius:50%; object-fit:cover; flex:0 0 52px;\n    border:1px solid var(--line); }\n  .q blockquote { margin:0 0 8px; padding:0; border:none; color:#222; }\n  .q .who { margin:0; font-size:0.86rem; color:var(--muted); }\n  .checklist { list-style:none; padding-left:0; }\n  .checklist li { position:relative; padding-left:30px; margin-bottom:14px; }\n  .checklist li::before { content:\"☐\"; position:absolute; left:0; top:0; color:var(--accent); font-size:1.1rem; }\n  .checklist li > strong { display:block; }\n  .checklist li p { margin: 4px 0 8px; }\n  .phase { font-weight:700; margin: 24px 0 8px; color:#000; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 12995
---

<!-- rendered HTML -->
<header>
  <h1>상시 가동 에이전트 만들기</h1>
  <div class="meta">
    2026년 11월 13일
    · 카테고리: <a href="https://claude.com/resources/best-practices">Best practices</a>
    · 제품: Claude Platform · 글: William Hu · 읽는 시간 14분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/building-always-on-agents">Building always-on agents by Anthropic</a>
      (한글 번역본)</span>
  </div>
</header>
<p><em>상시 가동 에이전트(always-on agent)는 무기한 실행되며, 여러 세션에 걸쳐 언제 어떻게 행동할지 스스로 결정합니다. 이 가이드는 상시 가동 에이전트의 핵심 기본 요소(primitive)와 그것들이 어떻게 맞물리는지 살펴봅니다.</em></p>

<p>지난 몇 달 동안 상시 가동 에이전트가 다시 주목받고 있습니다.</p>
<p>상시 가동 에이전트는 상태를 가지며(stateful) 능동적(proactive)입니다. 즉, 세션을 넘나들며 컨텍스트를 관리하고, 직접적인 감독 없이 행동합니다. 내부적으로는 다른 에이전트와 똑같은 <a href="https://www.anthropic.com/research/building-effective-agents">핵심 루프(core loop)</a>로 돌아갑니다. 차이는 그 주변 아키텍처에 있습니다. 이 아키텍처는 에이전트가 언제 깨어날지, 실행과 실행 사이에 무엇이 이어질지, 그리고 작업 결과가 어떻게 사용자에게 전달될지를 제어하는 기본 요소들로 이루어집니다.</p>
<p>이렇게 다시 주목받는 데는 최근 모델의 발전이 크게 작용했습니다. 모델이 발전하면서 상시 가동 에이전트를 실제로 운영하기가 훨씬 현실적이 되었기 때문입니다. 첫째, 최신 모델은 판단력이 더 좋습니다. 사용자의 의도를 더 정확히 이해하고, 언제 사용자에게 확인을 구해야 할지 더 잘 압니다. 둘째, 지능이 점점 저렴해지고 있으며, 그 혜택은 장기 과제(long-horizon task)에서 가장 큽니다. 예를 들어 <a href="https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence">한 장기 코딩 벤치마크</a>에서 Opus 5.5는 해결한 과제당 비용이 Opus 5보다 78% 낮았는데, 일반적인 워크로드에서는 40% 낮은 수준이었습니다.</p>
<p>고객들은 이런 경험을 자사 제품에 어떻게 통합할 수 있는지 묻기 시작했습니다. 기존 에이전트를 더 능동적으로 만들고 싶어 하는 회사도 있고, 처음부터 새로 만들려는 회사도 있습니다.</p>
<p>이 글에서는 상시 가동 에이전트를 이루는 기본 요소들을 하나씩 뜯어보고, 그것들이 어떻게 맞물리는지 살펴봅니다.</p>

<h2 id="the-cycle-behind-the-always-on-agent">상시 가동 에이전트를 움직이는 사이클</h2>
<p>상시 가동 에이전트는 실제로 "항상 켜져" 있지 않습니다. 이 말은 사용자 경험을 묘사한 것일 뿐입니다.</p>
<p>실제로 에이전트는 대부분의 시간을 잠든 상태로 보내고, 주기적으로 깨어나 일을 합니다. 한 번 일하는 구간을 <strong>실행(run)</strong>이라고 부릅니다. 에이전트는 이벤트를 받고, 작업을 완료한 다음, 무슨 일이 있었는지에 대한 정보를 저장합니다. 실행은 <strong>세션(session)</strong> 안에서 이루어지는데, 세션은 메시지와 도구 호출을 담은 기록(transcript)입니다. 실행이 끝나면 에이전트는 다시 잠들고, 이 사이클이 무기한 반복됩니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/run-cycle.gif" alt="상시 가동 에이전트의 타임라인 애니메이션: 토큰을 쓰지 않는 긴 수면 구간 사이사이에 짧은 실행이 끼어 있다. 각 실행은 이벤트 도착, 세션 시작, 에이전트 루프 실행, 그리고 실행 간에 이어지는 저장 상태에 기록하는 네 단계로 이루어진다." loading="lazy">
  <figcaption>상시 가동 에이전트의 타임라인: 토큰을 쓰지 않는 긴 수면 구간 사이에 짧은 실행이 있고, 각 실행은 이벤트 도착 → 세션 시작 → 에이전트 루프 실행 → 저장 상태 기록의 네 단계로 이루어집니다.</figcaption>
</figure>

<h2 id="the-core-primitives">핵심 기본 요소</h2>
<p>상시 가동 에이전트를 둘러싼 아키텍처에는 다섯 가지 핵심 기본 요소가 있습니다. 이벤트 인박스(event inbox), 타이머(timer), 메모리(memory), 권한(permission), 아웃박스(outbox)입니다. 하나씩 살펴보겠습니다.</p>

<h3>이벤트 인박스</h3>
<p>대부분의 AI 에이전트는 사용자가 메시지를 보낼 때만 실행됩니다. 반면 상시 가동 에이전트는 웹훅(webhook), 예약 작업(scheduled task), 백그라운드 잡(background job) 등 다양한 유형의 이벤트로 트리거될 수 있습니다.</p>
<p>각 이벤트 소스가 에이전트를 직접 호출하게 하고 싶은 유혹이 들지만, 이 방식에는 몇 가지 실패 양상이 있습니다. 예를 들어 두 이벤트가 동시에 도착하면 실행이 서로 경쟁할 수 있고, 크래시가 나면 이벤트가 통째로 사라질 수 있습니다.</p>
<p>여기서 이벤트 인박스가 등장합니다. 에이전트를 직접 호출하는 대신, 모든 소스는 이벤트를 인박스로 보내고, 워커(worker)가 그것을 가져갑니다.</p>
<p>가장 단순한 형태는 세 가지 구성 요소로 이루어집니다.</p>
<ul>
  <li>내구성 있는(durable) 이벤트 목록 — 보통 데이터베이스 테이블</li>
  <li>이벤트를 목록에 기록하는 핸들러(handler) — 보통 HTTP 엔드포인트</li>
  <li>목록에서 이벤트를 읽는 워커 — 보통 백그라운드 서비스</li>
</ul>
<p>인박스는 각 이벤트의 상태를 추적해야 하며, 이벤트는 소스가 제공하는 고유 식별자를 기준으로 중복을 제거할 수 있습니다. 인박스에는 관계형 데이터베이스가 잘 맞으며, 모든 이벤트를 새 행(row)으로 추가하면 됩니다. 처음에는 사용자당 인박스 하나로 시작하길 권하지만, 병렬성이 더 필요하면 더 잘게 나눌 수 있습니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/event-inbox.png" alt="이벤트 인박스 다이어그램. 핸들러(HTTP 엔드포인트)가 각 이벤트를 상태를 추적하고 중복을 버리는 데이터베이스 테이블인 인박스에 기록하고 워커를 깨운다. 워커는 대기 중인 것을 읽고 실행을 시작해 끝날 때까지 기다린 뒤 이벤트를 완료로 표시한다." loading="lazy">
  <figcaption>이벤트 인박스: 핸들러(HTTP 엔드포인트)가 이벤트를 인박스(상태 추적·중복 제거를 하는 DB 테이블)에 기록하고 워커를 깨웁니다. 워커는 대기 중인 이벤트를 읽어 실행을 시작하고, 끝나면 이벤트를 완료로 표시합니다.</figcaption>
</figure>
<p>새 이벤트가 들어오면 핸들러는 그 이벤트를 인박스에 기록하고 워커를 깨웁니다. 워커는 대기 중인 것을 모두 읽어 실행을 시작합니다. 사용자의 답장처럼 이전 작업을 이어가는 이벤트는 기존 세션을 재개하고, 그 밖의 모든 이벤트는 새 세션을 시작합니다.</p>
<p>그다음 워커는 이벤트를 에이전트 루프에 넘기고, 실행이 끝날 때까지 기다린 뒤, 해당 이벤트들을 완료로 표시합니다. 구현 세부 사항이 까다로울 수 있으니, 몇 가지 모범 사례를 소개합니다.</p>
<ul>
  <li><strong>핸들러는 이벤트를 빠르게 수신 확인(acknowledge)해야 합니다.</strong> 웹훅 제공자 같은 일부 소스는 느린 응답을 실패로 간주합니다. 핸들러가 가벼운 검사는 해도 되지만, 프롬프트 인젝션(prompt injection) 검사 같은 더 깊은 검증은 실행 중에 해야 합니다.</li>
  <li><strong>인박스가 진실의 원천(source of truth)이어야 합니다.</strong> 워커는 깨어나면 가장 먼저 인박스에서 최신 이벤트를 가져와야 합니다. 그래야 워커가 실행 도중 죽더라도 새 워커가 같은 이벤트를 가져가 재시도할 수 있습니다.</li>
  <li><strong>인박스 하나에는 활성 워커가 한 번에 하나만 있어야 합니다.</strong> 그래야 두 실행이 같은 작업을 중복하거나 서로의 결과를 덮어쓰지 않습니다. 실행 도중 새 이벤트가 나타나면, 다음 실행으로 넘기거나, 현재 실행에 합치거나, 중단하고 다시 시작하는 방법 중 하나를 고를 수 있습니다.</li>
  <li><strong>워커는 대기 중인 이벤트를 묶어서(batch) 처리해야 합니다.</strong> 예를 들어 사용자가 메시지를 연달아 여러 개 보내면, 워커는 이를 하나의 실행으로 합쳐 에이전트가 한 번만 답하도록 할 수 있습니다.</li>
</ul>

<h3>타이머</h3>
<p>이벤트 인박스와 함께 타이머는 상시 가동 에이전트를 능동적으로 만들어 줍니다. 타이머는 일반적으로 후속 확인(follow-up)과 일정(schedule) 두 범주 중 하나에 속합니다. 후속 확인은 답장이 왔는지 확인하는 것처럼 에이전트가 스스로 정하는 기한입니다. 반면 일정은 매일 보내는 뉴스레터처럼 정해진 주기로 반복되는 작업입니다.</p>
<p>타이머는 인박스와 분리된 자체 내구성 저장소에 둡니다. 보통 또 다른 데이터베이스 테이블입니다. 인박스에는 바로 작업할 준비가 된 이벤트만 있어야 합니다. 후속 확인과 일정은 비슷한 스키마를 공유할 수 있지만, 일정은 반복 주기도 추적해야 합니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/timers.png" alt="타이머 다이어그램. 실행이 데이터베이스 테이블에 타이머를 설정한다. 에이전트가 설정한 후속 확인이거나 사용자가 설정한 일정이다. 스케줄러가 기한이 된 것을 찾아 이벤트 인박스에 이벤트를 추가하고, 이것이 다음 실행을 시작한다." loading="lazy">
  <figcaption>타이머: 실행이 DB 테이블에 타이머(에이전트가 정한 후속 확인, 또는 사용자가 정한 일정)를 설정하고, 스케줄러가 기한이 된 타이머를 찾아 이벤트 인박스에 이벤트를 추가해 다음 실행을 시작합니다.</figcaption>
</figure>
<p>타이머는 스스로 실행을 시작하지 않습니다. 대신 스케줄러(scheduler, 보통 백그라운드 서비스)가 일정한 간격으로 저장소를 폴링(polling)하며 기한이 된 것을 발동시킵니다. 스케줄러는 매번 다음을 수행합니다.</p>
<ul>
  <li>저장소를 훑어 기한이 된 타이머를 찾습니다.</li>
  <li>각 타이머를 범주에 맞게 갱신합니다.
    <ul>
      <li>후속 확인은 완료로 표시합니다.</li>
      <li>일정은 기한을 다음 회차로 갱신합니다.</li>
    </ul>
  </li>
  <li>인박스에 이벤트를 추가하고 워커를 깨웁니다.</li>
</ul>
<p>스케줄러는 직접 서비스를 만들어도 되고, 내구성 있는 실행 엔진(durable execution engine)을 써도 됩니다.</p>

<h3>메모리</h3>
<p>상시 가동 에이전트는 서로 단절된 수많은 실행에 걸쳐 일하며, 연속성을 유지하기 위해 메모리에 의존합니다.</p>
<p>이벤트 인박스나 타이머와 마찬가지로 메모리도 자체 저장소를 가져야 합니다. Claude Code의 <a href="https://code.claude.com/docs/en/memory">자동 메모리(auto memory)</a>나 Messages API의 <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool">메모리 도구(memory tool)</a> 같은 저희 제품에서는 이를 파일 디렉터리로 구현합니다. 상시 가동 에이전트라면 이 디렉터리를 내구성 있는 저장소, 보통 데이터베이스나 오브젝트 스토어(object store)에 매핑해야 합니다. 그래야 메모리가 워커보다 오래 살아남습니다.</p>
<p>경험칙으로, 메모리에는 에이전트가 다시 찾아볼 수 없는 것만 담아야 합니다. 이슈 트래커처럼 이미 다른 시스템에 있는 정보라면 포인터(pointer)를 저장하세요. 상시 가동 에이전트가 저장해야 할 메모리 유형은 다음과 같습니다.</p>
<ul>
  <li><strong>사용자 지시:</strong> 에이전트 동작에 관한 사용자의 지시는 별도 파일에 저장하고 매 실행 시작 시 불러와야 합니다. 사용자가 늘 곁에서 에이전트를 이끌어 줄 수는 없으므로, 지시가 실행과 실행 사이에 이어져야 합니다.</li>
  <li><strong>사용자 노트:</strong> 에이전트는 사용자의 역할, 선호, 사용자가 해 준 수정 사항 등 사용자에 대해 알게 된 것을 저장해야 합니다. 처음에는 파일 하나로 시작하고, 노트가 늘어나면 작은 파일 여러 개로 옮기면 됩니다. 후자의 경우 매 실행 시작 시 인덱스만 불러오고, 에이전트는 더 자세한 내용이 필요할 때 개별 파일을 컨텍스트로 가져올 수 있습니다.</li>
  <li><strong>지난 메시지:</strong> 에이전트는 같은 말을 반복하지 않도록 사용자에게 이미 전한 내용을 기록해 두어야 합니다. 이를 매 실행 시작 시 불러오는 별도 파일에 저장해도 되고, 워커가 사용자와 주고받은 에이전트의 최근 메시지 몇 개를 불러오게 해도 됩니다.</li>
  <li><strong>작업 진행 상황:</strong> 진행 중인 각 작업마다 에이전트는 무엇을 했고 무엇이 남았는지 담은 진행 파일을 유지해야 합니다. 그러면 새 실행이 그 파일을 읽고 이전 실행이 멈춘 곳부터 이어갈 수 있습니다. 사용자 노트와 마찬가지로 매 실행 시작 시 인덱스만 불러오고, 에이전트는 더 자세한 내용이 필요할 때 개별 파일을 컨텍스트로 가져올 수 있습니다.</li>
</ul>
<p>아래 다이어그램은 구성 예시 하나를 보여 줍니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/memory.png" alt="파일 디렉터리로 구성한 메모리 예시 다이어그램. instructions.md, index.md, reported.md는 매 실행 시작 시 불러오고, notes/와 progress/ 폴더는 필요할 때 읽는다. 에이전트는 실행 중에 메모리에 기록한다." loading="lazy">
  <figcaption>메모리 구성 예시: <code>instructions.md</code>, <code>index.md</code>, <code>reported.md</code>는 매 실행 시작 시 불러오고, <code>notes/</code>와 <code>progress/</code> 폴더는 필요할 때 읽습니다. 에이전트는 실행 중에 메모리에 기록합니다.</figcaption>
</figure>
<p>지금까지 설명한 것은 모두 실행 중에 저장되는 메모리입니다. 여기에 지난 세션을 검토해 메모리를 정리하는 드리밍(dreaming)을 더할 수도 있습니다. 드리밍은 오래된 항목을 교체하고, 여러 실행에 걸쳐서만 드러나는 패턴을 찾아낼 수 있습니다. 더 알고 싶다면 <a href="https://www.anthropic.com/research/components-of-agent-memory">에이전트 메모리에 관한 글</a>에서 자세히 다룹니다.</p>

<h4>컨텍스트 윈도 안에서</h4>
<p>에이전트는 일을 시작하기 전에 시스템 프롬프트, 도구 정의, 메모리 파일을 불러옵니다. 이 초기 컨텍스트 "오버헤드"는 모든 실행에 포함되므로, 가볍게 유지하고 <a href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching">프롬프트 캐싱(prompt caching)</a>으로 비용을 낮추기를 권합니다.</p>
<p>새 세션은 이 컨텍스트 오버헤드와 실행을 트리거한 이벤트만 가지고 시작합니다. 반면 기존 세션은 이전 실행들의 메시지와 도구 호출을 다시 불러옵니다.</p>
<p>세션이 너무 길어지면 <a href="https://platform.claude.com/docs/en/build-with-claude/compaction">오래된 메시지를 압축(compaction)</a>하거나 새 세션을 시작할 수 있습니다. 두 방법 모두 세부 정보를 잃으므로, 유지해야 할 것은 그때그때 메모리에 저장해 두어야 합니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/context-window.gif" alt="시간에 따른 컨텍스트 사용량 애니메이션 차트. 시스템 프롬프트, 도구, 메모리로 이루어진 고정 구간이 모든 실행에 존재한다. 기존 세션은 기록 전체를 다시 불러오며, 압축이 오래된 기록을 요약으로 바꿀 때까지 커진다." loading="lazy">
  <figcaption>시간에 따른 컨텍스트 사용량: 시스템 프롬프트·도구·메모리로 이루어진 고정 구간은 모든 실행에 들어가고, 기존 세션은 기록 전체를 다시 불러와 압축이 오래된 기록을 요약으로 바꿀 때까지 커집니다.</figcaption>
</figure>

<h3>권한</h3>
<p>권한은 상시 가동 에이전트에서 위험이 가장 큰 부분입니다. 실행은 사용자의 접근 권한을 쥐고 있으며, 설계상 지켜보는 사람 없이 동작합니다. 에이전트는 각 도구 호출마다 스스로 진행할지, 차단할지, 승인을 기다릴지 결정해야 합니다.</p>
<p>권한을 구성하는 요소는 다른 에이전트가 쓰는 것과 같습니다.</p>
<ul>
  <li><strong>자격 증명 저장소(credential store):</strong> 상시 가동 에이전트가 쓸모 있으려면 비밀번호나 액세스 토큰 같은 민감한 사용자 자격 증명이 필요한 경우가 많습니다. <a href="https://code.claude.com/docs/en/agent-sdk/secure-deployment#credential-management">권장 패턴</a>은 에이전트 환경 바깥에 프록시를 두고, 이 프록시가 나가는 요청에 자격 증명을 붙이는 방식입니다. 에이전트는 자격 증명 없이 요청을 보내고, 프록시가 전달하기 전에 실제 자격 증명을 주입합니다.</li>
  <li><strong>자동 모드(auto mode):</strong> 상시 가동 에이전트는 사용자의 끊임없는 입력 없이도 일할 수 있어야 합니다. 저희는 Claude Code의 <a href="https://www.anthropic.com/research/claude-code-auto-mode">자동 모드</a>로 이 문제의 한 버전을 이미 다뤘습니다. 자동 모드는 분류기(classifier)로 위험도가 높은 행동을 검토하고, 위험하다고 판단한 것을 차단해 Claude가 더 안전한 방법을 찾도록 합니다. 그래도 가장 중요한 결정에는 여전히 사용자 검토가 필요합니다.</li>
  <li><strong>지연된 도구 호출(deferred tool call):</strong> Claude Code에서는 <a href="https://code.claude.com/docs/en/hooks#defer-a-tool-call-for-later">훅(hook)이 도구 호출을 지연</a>시키고 사용자의 추가 입력을 기다릴 수 있습니다. 같은 패턴이 상시 가동 에이전트에도 적용됩니다. 상시 가동 에이전트는 특정 행동을 하기 전에 확인이나 승인이 필요할 수 있기 때문입니다. 호출이 지연되면 실행은 끝나고 세션은 호출 도중 상태로 저장됩니다. 요청은 사용자에게 표시되고(예: <a href="https://modelcontextprotocol.io/extensions/apps/overview">MCP Apps</a>로 만든 인터랙티브 카드), 사용자의 답은 인박스에 이벤트로 돌아옵니다. 그 이벤트가 새 실행을 시작하고, 새 실행은 사용자의 입력과 함께 저장된 세션을 재개합니다. 지연된 호출이 응답을 기다리는 동안에도 워커는 다른 이벤트를 처리할 수 있으므로 에이전트가 막히지 않습니다.</li>
</ul>

<h3>아웃박스</h3>
<p>대부분의 AI 에이전트는 응답이 생성되는 대로 사용자에게 스트리밍됩니다. 그래서 사용자는 Claude가 문제를 추론하고, 도구를 호출하고, 답을 쓰는 과정을 따라갈 수 있습니다.</p>
<p>반면 상시 가동 에이전트는 대부분의 일을 백그라운드에서 합니다. 사용자는 단계별 전체 과정 대신 결과와 몇 가지 세부 사항을 받습니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/outbox.png" alt="아웃박스 다이어그램. 실행은 보낼 말이 없거나, send 도구 호출, 또는 사용자에게 묻는 지연된 도구 호출로 끝난다. 메시지는 데이터베이스 테이블인 아웃박스로 가고, 디스패처가 이를 사용자에게 전달한다. 지연된 요청은 아웃박스를 거치거나 자체 인터페이스에 바로 표시될 수 있다." loading="lazy">
  <figcaption>아웃박스: 실행은 보낼 것 없음, send 도구 호출, 사용자에게 묻는 지연된 도구 호출 중 하나로 끝납니다. 메시지는 아웃박스(DB 테이블)로 가고 디스패처가 사용자에게 전달합니다. 지연된 요청은 아웃박스를 거치거나 자체 인터페이스에 바로 표시될 수 있습니다.</figcaption>
</figure>
<p>실행은 세 가지 방식 중 하나로 끝날 수 있습니다.</p>
<ul>
  <li>에이전트가 아웃박스로 메시지를 보낸다.</li>
  <li>에이전트가 보낼 것이 없다고 판단한다.</li>
  <li>에이전트가 지연된 도구 호출로 권한이나 추가 입력을 요청한다.</li>
</ul>
<p>대부분의 상시 가동 에이전트는 메시지를 사용자에게 바로 전달하는 "send" 도구 하나로도 충분합니다. 정식 아웃박스는 에이전트의 메시지 속도를 조절하거나 에이전트가 오류에서 복구할 수 있게 하고 싶을 때만 필요합니다.</p>
<p>아웃박스는 나가는 메시지를 담은 별도 테이블로, 이벤트 인박스에 대응합니다. 워커에 대응하는 디스패처(dispatcher, 보통 백그라운드 서비스)도 있습니다. 디스패처는 대기 중인 메시지를 읽고, 무엇을 전달할지 결정해 사용자에게 보냅니다. 지연된 도구 호출에서 나온 요청은 아웃박스를 거칠 수도 있고, 인터페이스에 바로 표시될 수도 있습니다.</p>
<p>전달 외에도, 에이전트가 보내는 메시지의 양을 조율하는 것이 중요합니다. 너무 많이 보내는 에이전트는 시끄러워지고, 너무 적게 보내는 에이전트는 사용자가 알아야 할 것을 놓칩니다. 적절한 균형을 찾기 위해 평가(eval)를 만들기를 권합니다. 실제로는 에이전트가 조용하게 시작해서 시간이 지나며 사용자의 관심을 더 얻어 가는 편이 낫습니다.</p>

<h2 id="how-everything-fits-together">모든 것이 맞물리는 방식</h2>
<p>다섯 가지 기본 요소는 다음과 같이 맞물립니다.</p>
<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/building-always-on-agents/fits-together.gif" alt="다섯 가지 기본 요소가 맞물리는 방식을 보여 주는 애니메이션 다이어그램. 타이머와 이벤트 인박스가 실행을 시작하고, 실행은 세션 안에서 메모리와 권한을 사용해 일하며, 아웃박스가 사용자에게 메시지를 전달하고, 사용자의 답은 이벤트로 돌아온다." loading="lazy">
  <figcaption>다섯 가지 기본 요소의 연결: 타이머와 이벤트 인박스가 실행을 시작하고, 실행은 세션 안에서 메모리·권한과 함께 일하며, 아웃박스가 사용자에게 메시지를 전달하고, 사용자의 답은 다시 이벤트로 돌아옵니다.</figcaption>
</figure>
<p>모든 실행은 인박스의 이벤트로 시작합니다. 사용자 메시지든, 웹훅이든, 타이머든 마찬가지입니다. 워커가 이벤트를 가져가면 실행을 시작하고, 새 세션이나 기존 세션에서 에이전트를 깨웁니다. 에이전트는 메모리를 읽어 기준선을 잡고, 권한 범위 안에서 행동하며, 새로 알게 된 것으로 메모리를 갱신합니다. 실행이 끝나면 에이전트는 아웃박스에 행을 추가하고, 디스패처가 사용자에게 메시지를 전달합니다.</p>
<p>이것들이 함께 하나의 사이클을 이룹니다. 실행은 나중에 에이전트를 다시 깨울 타이머를 설정할 수 있고, 사용자가 메시지에 답하면 그 답은 인박스에 이벤트로 돌아옵니다. 각 실행은 짧지만 사이클은 무기한 이어지며, 바로 그것이 에이전트가 항상 켜져 있는 것처럼 느껴지게 만듭니다.</p>

<h2 id="acknowledgements">감사의 말</h2>
<p>William Hu가 썼습니다. 기여해 주신 Rodrigo Olivares와 Michael Segner에게 특별히 감사드립니다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
