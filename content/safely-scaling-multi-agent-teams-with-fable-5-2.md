---
slug: "safely-scaling-multi-agent-teams-with-fable-5-2"
title: "Claude Fable 5.2로 멀티 에이전트 팀을 안전하게 확장하기"
nav: "Fable 5.2 에이전트 1,000개 팀 · 페르마의 마지막 정리 Lean 증명 28.7시간 재현, 공유 Postgres로 자기 조율(리드·헬퍼·작업 트리), 샌드박스·실시간 분류기·오프라인 모니터"
main: "claude.dev"
cat: "Agents"
date: "2026-11-09"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  pre { background: var(--code-bg); padding: 16px 18px; border-radius: 8px;\n    overflow-x: auto; margin: 0 0 16px; line-height: 1.5; }\n  pre code { background: none; padding: 0; font-size: 0.85rem; white-space: pre; }\n  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 0.92rem; }\n  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; vertical-align: top; }\n  th { background: var(--code-bg); }\n  .table-wrap { overflow-x: auto; margin: 0 0 20px; }\n  .table-wrap table { margin: 0; min-width: 560px; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure img.phone { max-width: 360px; display:block; margin: 0 auto; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#000; display:block; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption b { color: var(--accent); margin-right: 6px; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }"
has_markdown: false
markdown_length: 0
html_length: 16901
---

<!-- rendered HTML -->
<header>
  <h1>Claude Fable 5.2로 멀티 에이전트 팀을 안전하게 확장하기</h1>
  <div class="meta">
    2026년 11월 9일
    · 카테고리: Agents
    · 글쓴이: Barry Zhang, Tianyi Peng, Elle Najt, Keller Scholl, Lance Martin
    · 출처: <a href="https://claude.dev/blog">claude.dev</a>
    <span class="orig">원문:
      <a href="https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2">Safely scaling multi-agent teams with Claude Fable 5.2</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">초기 버전의 Claude Fable 5.2로 돌아가는 에이전트 1,000개로 이뤄진 팀이 범용 도구, 공유 데이터베이스, 여러 겹의 안전 통제만으로 페르마의 마지막 정리(Fermat's Last Theorem)의 형식 증명을 재현한 과정.</p>

<p>멀티 에이전트 팀은 어렵고 긴 호흡(long-horizon)의 문제를 풀 수 있다. <a href="https://www.anthropic.com/research/formalizing-fermats-last-theorem">9월에</a> 우리는 페르마의 마지막 정리를 처음부터 끝까지 형식화(formalization)한 최초의 결과를 발표했다. 이 증명은 Claude Fable 5.1과 대략 비슷한 수준의 내부 연구용 모델로 돌아가는 에이전트 수십 개가 작성했다. 그 작업은 수학 형식화 플랫폼인 Prove2Me와 연구자 한 명의 지휘에 기대고 있었다. 이번 새 장난감 실험(toy experiment)에서는 초기 버전의 Claude Fable 5.2로 돌아가는 에이전트 1,000개 팀이 Prove2Me가 제공하던 발판(scaffolding)도, 연구자의 방향 제시도 없이 이 증명을 재현했다. 팀은 28.7시간이 걸렸고, 출력 토큰은 3분의 1만 썼으며, 원래 증명의 7분의 1 길이로 증명을 써냈다.</p>

<p>각 에이전트는 인터넷 접속이 없는 샌드박스에서 일했다. 분류기(classifier)가 모든 셸 명령과 파일 편집을 실행 전에 검사했고, 오프라인 모니터가 팀의 행동을 하나하나 검토했다. 우리는 에이전트들에게 명제(statement) 60개의 목록, 고전적인 증명 경로를 한 문장으로 요약한 스케치, 그 명제들이 쓰는 정의, 그리고 이전 형식화에서 이미 증명된 보조정리(lemma) 47개를 주고, 리드(lead)와 헬퍼(helper) 역할을 배정했다. 정리를 어떻게 증명할지, 스스로를 어떻게 조직할지에 대해서는 그 밖에 아무런 지침도 주지 않았다.</p>

<p>이 장난감 실험은 Fable 5.2 같은 모델로 돌아가는 에이전트 팀이, 신중하게 설계된 안전 경계 안에서 야심 차고 긴 호흡의 목표를 해낼 수 있음을 시사한다.</p>

<h2 id="problem">문제</h2>

<p>페르마의 마지막 정리는 n이 2보다 큰 어떤 경우에도 aⁿ + bⁿ = cⁿ을 만족하는 양의 정수 a, b, c가 없다는 정리다. 이 정리는 1995년 앤드루 와일스(Andrew Wiles) 경의 129쪽짜리 증명이 나오기까지 350년 넘게 증명되지 않은 채 남아 있었다. 이 증명을 형식화하는 것, 즉 모든 단계를 컴퓨터가 검사할 수 있게 만드는 것은 수학계의 <a href="https://lean-lang.org/use-cases/flt/">오랜 목표</a>였다.</p>

<p>9월의 형식화에는 연구자 한 명과 에이전트 수십 개가 11일 동안 약 60억 출력 토큰을 썼다. 이들은 Lean으로 1,300만 줄의 코드를 작성했다. Lean은 증명의 모든 단계를 컴퓨터가 검사하는 프로그래밍 언어다.</p>

<p>에이전트들은 Prove2Me를 통해 협업했다. Prove2Me는 Tianyi Peng(현재 Anthropic의 기술 스태프)과 컬럼비아 대학교의 공동 연구자들이 설계한 플랫폼이다. Prove2Me는 증명할 각 명제를 그것이 쪼개진 더 작은 명제들과 잇는 공유 그래프를 쓴다. 어떤 에이전트든 명제를 쪼갤 수 있었고, 다른 에이전트들은 그래프에 아직 증명되지 않은 조각 중 바로 작업할 수 있는 게 무엇인지 물을 수 있었다. 덕분에 에이전트들이 프로젝트 상태를 놓치지 않았다. 각 명제와 그 증명은 독립적으로 컴파일되는 별도 파일에 담겼기 때문에, 여러 에이전트가 같은 파일을 편집하지 않고 병렬로 일할 수 있었다.</p>

<h2 id="harness">하네스</h2>

<p>우리는 Fable 5.2 같은 모델로 돌아가는 에이전트 팀이 Prove2Me도, 작업을 지휘하는 연구자도 없이, 범용 도구로 만든 하네스(harness)만으로 이 결과를 낼 수 있는지 보고 싶었다.</p>

<h3 id="tools">도구</h3>

<p>이 작업을 위해 우리는 에이전트 1,000개 팀에 증명할 명제 60개를 주었다. 최종 정리와 중간 이정표 59개다. 각 명제마다 에이전트는 Lean으로 증명을 쓰고, Lean 도구로 빌드·검사한 다음, Git의 공유 main 브랜치에 제출해야 했고, 그곳에서 채점기(grader)가 증명을 검사했다. 각 에이전트에게 준 도구는 다음과 같다.</p>

<ul>
  <li>네트워크 접속이 없는 자기만의 샌드박스 안에서 쓰는 셸과 파일 편집기.</li>
  <li>샌드박스 이미지에 내장된 Lean 툴체인과 <a href="https://github.com/leanprover-community/mathlib4">Mathlib</a>.</li>
  <li>자기만의 Git 브랜치, 그리고 main으로 머지 요청(merge request)을 여는 권한.</li>
  <li>셸에서 접근하는 공유 Postgres 데이터베이스.</li>
</ul>

<h3 id="collaboration">협업</h3>

<p>이 증명 작업은 나눠서 할 수 있어서 멀티 에이전트 팀에 잘 맞는 과제다. 하지만 에이전트들은 서로의 작업 위에 쌓아 올리고 중복을 피하기 위해 조율도 해야 한다. <a href="https://www.anthropic.com/research/formalizing-fermats-last-theorem">원래의 형식화</a>에서 Claude의 초기 시도는 실패했는데, 에이전트들이 프로젝트 상태를 놓치고 효과적으로 협업하지 못했기 때문이다. Prove2Me 플랫폼으로 옮기면서 이 문제가 해결됐다.</p>

<p>이번 실행에서는 각 에이전트가 자기만의 경량 가상 머신 위에 샌드박스를 가졌다. 공유 머신 한 대는 에이전트 100개 정도에서 한계에 부딪혔다. 에이전트 100개로 돌린 실행 중 절반 넘게가 메모리, 디스크, CPU가 바닥나서 중단하거나 다시 시작해야 했다.</p>

<p>샌드박스가 1,000개로 나뉘어 있으니 에이전트들에겐 작업을 공유할 방법이 필요했고, 그래서 우리는 SQL 데이터베이스를 주었다(그림 1). SQL을 고른 이유는 정보를 조직하는 범용 기본 요소(primitive)를 제공하고, 트랜잭션이 에이전트 1,000개의 동시 쓰기를 처리하며, Claude가 이미 익숙하게 다루기 때문이다. 에이전트들은 이 데이터베이스로 작업을 가져가고(claim), 노트를 공유하고, 끝낸 작업을 기록했다.</p>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig1-harness.png" alt="하네스 아키텍처. 에이전트 샌드박스 1,000개(리드 1개와 헬퍼 999개)가 쌓여 있고, 각각 샌드박스 안의 하네스 코드인 에이전트 루프를 돌리며, 도구로 셸과 파일 편집기를, 파일로 저장소·Lean·수학 라이브러리를 갖는다. API 요청과 응답은 에이전트 루프와 샌드박스 밖의 게이트웨이 사이를 오가며, 게이트웨이가 Claude API를 호출한다. Git과 SQL 요청 및 그 결과도 같은 게이트웨이를 거쳐 역시 샌드박스 밖에 있는 팀 인프라로 간다. Lean 파일과 계획이 담긴 Git 저장소, 그리고 지시·작업·노트가 담긴 Postgres 데이터베이스다." loading="lazy" width="2400" height="1272">
  <figcaption><b>FIG 1</b>에이전트 1,000개는 각자 자기 샌드박스에서 돌았고, 바깥과는 게이트웨이로 가는 파이프 하나로만 연결됐다. 게이트웨이는 Claude API를 호출하고, Git과 SQL 요청을 공유 저장소와 데이터베이스로 전달했다.</figcaption>
</figure>

<h3 id="prompting">프롬프팅</h3>

<p>프롬프트에서는 Claude에게 증명할 명제 60개의 목록을 각각 한 줄짜리 비형식 설명과 함께 주고, 사용할 수 있는 도구(위에 나열한 것)를 설명했다.</p>

<p>팀에 준 구조는 위계(hierarchy) 하나뿐이었다. 리드 1개와 헬퍼 999개다. 리드에게는 문제를 여러 부분으로 쪼개 헬퍼들에게 배정하라고 했다. 헬퍼들에게는 리드에게서 일이 올 것을 기대하고, 작업이 불분명하면 리드에게 확인하라고 했다.</p>

<p>실행 중 하네스는 리드에게 남은 시간을 알려 주는 자동 리마인더를 19번 보냈고, 매번 리드에게 계속 진행하라고 독려했다.</p>

<h2 id="safety">안전</h2>

<p><a href="https://www.anthropic.com/news/improving-alignment-security-efforts">앞서 공유했듯이</a>, 방어 계층 하나만으로는 에이전트 팀을 가둬 둘 수 없다. 이 실험에서 우리는 샌드박싱에 실시간 모니터링과 오프라인 모니터링을 결합해, 각 에이전트를 네트워크 접속이 없는 자기만의 가상 머신 안에 두고, 샌드박스를 탈출하거나 모니터링을 조작하려는 시도를 탐지했다.</p>

<h3 id="sandboxing">샌드박싱</h3>

<p>각 에이전트의 샌드박스는 다음과 같은 방식으로 보호했다(그림 2).</p>

<ul>
  <li><strong>통신</strong>: 에이전트에게는 전용 메시징 도구가 없었고, 데이터베이스와 Git을 통해서만 조율했다.</li>
  <li><strong>코드 변경</strong>: 에이전트는 자기 Git 브랜치에만 push할 수 있었고 main으로 머지 요청을 열 수 있었다. 그러면 별도의 잡(job)이 변경을 main에 머지했고, 충돌이 나거나 관련 없는 히스토리 같은 결함이 있을 때만 거부했다.</li>
  <li><strong>데이터베이스 접근</strong>: 데이터베이스 호출은 권한 없는 공유 역할(role)로 실행됐다. SQL 문 하나마다 5초 시간 제한이 있었고, 256 MiB를 넘는 쓰기는 거부됐다.</li>
  <li><strong>네트워크 통제</strong>: 샌드박스에는 네트워크 접속이 없었다. 밖으로 나가는 유일한 연결은 게이트웨이로 가는 파이프였고, 게이트웨이가 요청을 중계했다.</li>
  <li><strong>신원</strong>: 게이트웨이가 샌드박스 바깥에서 각 요청에 에이전트의 신원을 붙여, 한 에이전트가 다른 에이전트를 사칭하지 못하게 했다.</li>
  <li><strong>커널</strong>: 각 샌드박스의 커널은 루트 사용자가 커널로 직접 들어갈 수 있게 해 주는 기능, 예를 들어 적재 가능 모듈(loadable modules), kexec, 원시 메모리 접근, 커널 프로브 없이 빌드됐다. 그리고 커널 잠금 모드(kernel lockdown mode)로 돌았다.</li>
  <li><strong>최소 권한</strong>: 각 에이전트의 명령은 샌드박스 안에서 권한 없는 사용자로 실행됐고, sudo처럼 루트 권한을 되찾을 수 있는 도구는 제거됐다. 에이전트의 도구는 자기를 실행하는 에이전트 루프를 읽거나 바꿀 수 없도록 설계됐다.</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig2-safety.png" alt="하네스 아키텍처에 안전 조치를 세 그룹으로 표시한 그림. 샌드박싱: 각 에이전트는 네트워크 접속이 없는 자기만의 경량 VM을 받고, API 키나 자격 증명이 없으며, 다른 샌드박스로 가는 직접 경로가 없고, 권한 없는 사용자 계정을 쓰며, 하네스 코드에 도구로 접근할 수 없다. 실시간 모니터링: 게이트웨이는 각 도구 호출마다 차단형 분류기를 실패 시 닫힘(fail-closed) 설계로 돌리고, 각 에이전트의 신원을 설정하며, 모든 push와 쿼리를 기록한다. Git 저장소는 자기 브랜치로의 push만 받고 main은 머지 잡이 처리하며, Postgres 데이터베이스는 시간·크기 제한이 있는 권한 없는 공유 역할을 쓴다. 오프라인 모니터링: 샌드박스 밖에 보관된 실행 기록이 오프라인 모니터링으로 들어가고, 심각한 발견은 실행 담당자에게 알린다." loading="lazy" width="2400" height="2220">
  <figcaption><b>FIG 2</b>팀을 세 겹의 안전 계층이 둘러쌌다. 샌드박싱, 실시간 모니터링, 오프라인 모니터링이다. 분류기가 각 도구 호출을 실행 전에 검사했고, 오프라인 모니터가 팀의 행동을 검토했다.</figcaption>
</figure>

<h3 id="real-time-monitoring">실시간 모니터링</h3>

<p>이런 실행을 더 안전하게 만들기 위해, 우리는 셸 명령과 파일 편집을 포함한 각 도구 호출을 차단할 수 있는 프롬프트 기반 LLM 분류기를 쓴다. 이 분류기는 샌드박스를 탈출하거나, 샌드박스의 경계를 탐색하거나, 모니터링을 조작하려는 시도를 감시하고, 모델이 샌드박스를 빠져나가는 데 성공했을 때 할 수 있는 해로운 행동도 감시한다. 분류기가 도구 호출을 차단하면 에이전트 팀 전체가 멈추고, 팀이 다시 시작하려면 사람이 그 차단을 검토해야 한다. 차단된 행동을 다른 에이전트가 대신 실행하지 못하게 하려는 것이다.</p>

<p>분류기가 정교한 사보타주(sabotage)를 탐지할 수 있는지 시험하기 위해, 우리는 멀티 에이전트 부수 과제(side-task) 및 사보타주 평가를 돌렸다. 여기서 레드팀 에이전트들은 분해 공격(decomposition attack) 같은 전략으로 분류기를 속여 샌드박스 탈출을 허용하게 만들려 했다. 그 결과 에이전트의 사고 사슬(chain of thought, CoT)과 에이전트 간 통신을 보는 모니터는 이 평가의 사보타주 시도를 모두 탐지할 수 있었고, 그래서 지금은 이런 모니터로 멀티 에이전트 실행을 감시한다. 이와 병행해, 같은 모니터의 행동 기반 버전(CoT는 보지 않고 행동만 보는 버전)도 돌린다. 에이전트의 추론이 모니터를 설득해 해로운 행동을 허용하게 만드는 일을 막기 위해서다.</p>

<p>우리는 사람이 이끄는 레드티밍과 자동 레드티밍, 과거 사고를 포함한 실제 운영 기록(production transcript)에 대한 평가, 그리고 위협 모델링 확대를 통해 모니터링 스택을 계속 개선하고 있다. 이 글에서 다룬 실행에서는 행동 기반 모니터만 썼다. 실행을 끝낼 수 있었던 건 리드에 대한 차단뿐이었고, 헬퍼에 대한 차단은 그 헬퍼 하나만 빼냈다.</p>

<p>이 실행 직후 우리는 병렬 CoT 모니터를 추가했다. 이런 실험은 출시 전 정렬(alignment) 평가를 아직 마치지 않았을 수 있는 모델로 돌리기 때문에, 모델이 정렬되지 않았을(misaligned) 가능성을 전제로 모니터링을 설계한다. 우리가 출시하는 모델은 그 평가를 먼저 마치는데, 이렇게 하면 이 위험이 줄지만 없어지지는 않는다.</p>

<p>이 실행에서 100만 건이 넘는 도구 호출 가운데 차단 기준에 걸린 것은 하나도 없었다. 이 호출들을 CoT 모니터와 오늘의 루브릭(rubric)으로 다시 돌려 봤을 때, 차단에 가까웠던 것은 루트 접근 권한을 확인하는 호출 하나뿐이었다.</p>

<h3 id="offline-monitoring">오프라인 모니터링</h3>

<p>실시간 모니터링 외에, 우리는 오프라인 모니터도 돌린다. 이 모니터는 실시간 모니터와 같은 위협 모델에 비춰 에이전트 팀의 행동을 분석하지만, 다른 에이전트의 행동을 조회할 수 있는 것 같은 추가 수단을 갖는다.</p>

<h2 id="results">결과</h2>

<h3 id="without-prove2me-the-team-built-its-own-coordination-system">Prove2Me 없이, 팀은 자기만의 조율 시스템을 만들었다</h3>

<p>이 증명 작업은 여러 수준에서 일어난다.</p>

<ul>
  <li><strong>증명:</strong> n이 2보다 큰 어떤 경우에도 aⁿ + bⁿ = cⁿ을 만족하는 양의 정수 a, b, c는 없다.</li>
  <li><strong>명제:</strong> 팀에 증명할 명제 60개를 주었다. 최종 정리와 중간 이정표 59개다.</li>
  <li><strong>더 작은 명제:</strong> 에이전트들은 어려운 명제를 더 작은 명제, 즉 보조정리로 쪼갰다.</li>
  <li><strong>Lean:</strong> 모든 명제와 보조정리는 Lean의 정리(theorem)다.</li>
</ul>

<p>각 명제는 <a href="https://lean-lang.org/use-cases/flt/">Lean</a>에서 증명 자리에 플레이스홀더를 둔 채로 시작했고, Lean 검사기가 완성된 증명을 받아들여야만 증명된 것으로 쳤다. 우리는 증명에 어떻게 달려들지, 그리고 이 여러 수준의 작업에 걸쳐 팀을 어떻게 조율할지를 리드가 정하게 했다.</p>

<p>처음 10분 동안 리드는 데이터베이스에 테이블 다섯 개를 만들었다(그림 3).</p>

<ul>
  <li><strong>Announce:</strong> 팀 전체에 내리는 리드의 지시(예: 작업을 어떻게 나눌지).</li>
  <li><strong>Assign:</strong> 누가 무엇을 맡는지(예: 각 명제를 어느 헬퍼가 맡거나 대리하는지).</li>
  <li><strong>Notes:</strong> 열린 게시판(예: 작업 한 조각을 가져간다고 알리거나 진척을 보고).</li>
  <li><strong>Subtasks:</strong> 어떤 에이전트든 작업을 추가할 수 있고, 가장 먼저 가져간 헬퍼가 그 작업을 맡는 할 일 목록.</li>
  <li><strong>Landed:</strong> 끝낸 작업의 기록.</li>
</ul>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig3-tables.png" alt="리드 1개와 헬퍼 999개 사이의 공유 데이터베이스 테이블 다섯 개. Announce는 작업 분할 방법이나 데이터베이스 부하를 줄이라는 것 같은 모두에게 내리는 리드의 지시로, 리드가 쓰고 읽으며 헬퍼는 읽는다(헬퍼 쓰기 1건). Assign은 각 명제를 어느 헬퍼가 맡거나 대리하는지 같은 누가 무엇을 맡는지로, 리드가 쓰고 읽으며 헬퍼는 읽는다(헬퍼 쓰기 1건). Notes는 헬퍼가 어떤 조각을 맡는지 말하거나 진척을 보고하는 열린 게시판으로, 리드와 헬퍼가 모두 쓰고 읽는다. Subtasks는 누구나 작업을 추가하고 처음 가져간 헬퍼가 맡는 공유 할 일 목록으로, 헬퍼가 쓰고 읽으며 리드는 읽는다(리드 쓰기 2건). Landed는 어떤 명제나 조각이 들어갔는지, 그 commit, 팀 검사 통과 여부를 기록한 끝낸 작업의 로그로, 헬퍼가 쓰고 읽으며 리드는 읽는다." loading="lazy" width="2400" height="1234">
  <figcaption><b>FIG 3</b>처음 10분 동안 리드는 팀을 조율하기 위해 공유 데이터베이스 테이블 다섯 개를 만들었다. 리드는 지시와 배정을 썼고, 헬퍼는 끝낸 작업을 기록하고 subtasks 테이블을 관리했으며, 둘 다 notes 테이블에 썼다.</figcaption>
</figure>

<h3 id="the-lead-dealt-out-the-statements">리드가 명제를 나눠 주었다</h3>

<p>테이블을 만든 뒤 리드는 세 가지를 했다. 첫째, assign 테이블에 헬퍼마다 한 행씩 999행을 써서 각 명제를 헬퍼 16~17개로 된 크루(crew)에 배정했다. 둘째, 크루마다 헬퍼 하나를 캡틴(captain)으로 정했다. 캡틴은 notes 테이블에 계획을 올리고, 크루가 subtasks 테이블에서 가져갈 수 있게 작업을 쪼개는 책임을 맡았다. 셋째, announce 테이블에 지시를 올려, 모든 헬퍼가 먼저 자기 명제의 난이도를 판단하고 notes 테이블에 판정을 올리게 했다.</p>

<p>헬퍼들은 프롬프트를 통해 데이터베이스가 있다는 걸 알고 있었다. 그들은 announce 테이블을 찾아 평가를 시작했다. 대부분이 notes 테이블에 판정을 올렸다. 약 27분이 지났을 때 이미 명제 세 개가 증명됐고, 리드는 올라온 판정들을 읽은 상태였다. 그러자 리드는 대부분의 헬퍼가 실행 예산 안에서 불가능하다고 판단한 명제 47개를 제쳐 두고, 거의 모든 헬퍼를 끝낼 수 있다고 본 나머지 10개로 재배정했다. 크루는 헬퍼 약 17개에서 46~139개로 커졌다.</p>

<p>각 헬퍼는 루프를 돌며 일했고, 그 대부분은 리드의 지시에 정해져 있었다.</p>

<ul>
  <li>notes 테이블에서 명제의 계획을 찾는다.</li>
  <li>subtasks 테이블에서 작업 하나를 가져간다.</li>
  <li>Lean으로 증명을 쓰고, Lean 도구로 검사한 뒤, Git의 main 브랜치에 제출한다.</li>
  <li>작업을 완료로 표시한다.</li>
  <li>notes 테이블에 업데이트를 올린다.</li>
</ul>

<p>45분쯤 지나 명제 10개 중 다섯 개 정도가 증명됐을 때, 리드는 이렇게 썼다.</p>

<blockquote>
  <p>"팀의 처리량이 초기의 '예산 안에서는 불가능' 판정이 가정한 것보다 훨씬 높다"</p>
</blockquote>

<p>명제 10개는 모두 약 70분 안에 증명됐다.</p>

<h3 id="the-lead-then-moved-helpers-to-harder-statements">그다음 리드는 헬퍼들을 더 어려운 명제로 옮겼다</h3>

<p>첫 명제 10개가 끝나자 리드는 "놀고 있을 이유가 없다"고 쓰고, 처음에 버렸던 더 어려운 명제들로 헬퍼들을 재배정했다. 명제가 더 증명될수록 리드는 계속 헬퍼들을 새 배정으로 옮겼고, 대부분은 처음 6시간 동안 일어났다(그림 4에서 빨간색으로 표시된 assign 테이블 쓰기 참고).</p>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig4-db-activity.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig4-poster.png" width="1280" height="592" aria-label="0시간부터 30시간까지 에이전트 1,000개와 공유 데이터베이스 테이블(announce, assign, notes, subtasks, landed, 그리고 기타 테이블 묶음) 사이의 읽기·쓰기를 담은 타임랩스. 쓰기는 위쪽 줄의 리드와 헬퍼 1~999에서 테이블로 내려가는 빨간 선, 읽기는 테이블에서 아래쪽 줄의 같은 에이전트들로 내려가는 초록 선이다. 30시간까지 쓰기는 36,612건, 읽기는 311,734건으로 늘어난다. 거의 모든 쓰기가 notes 테이블(약 20,600건)과 subtasks 테이블(약 14,800건)로 가며, 실행을 다시 시작한 18시간 무렵에 선들이 잠잠해진다."></video>
  <figcaption><b>FIG 4</b>실행 동안 공유 테이블에서의 읽기(초록)와 쓰기(빨강). 쓰기의 거의 전부는 헬퍼의 노트와 작업 업데이트(작업 가져가기 포함)다. 합계에는 스크립트 호출 대부분이 빠져 있다. 18시간 무렵 활동이 멈추는데, 이때 우리가 마지막 저장 지점에서 실행을 다시 시작하고 에이전트들에게 12시간을 더 주었다.</figcaption>
</figure>

<p>처음에 리드는 캡틴들에게 subtasks 테이블에서 작업을 쪼개라고 지시했다. 작업이 진행되면서 헬퍼들이 각 명제를 푸는 데 더 많은 책임을 떠맡았다. 그들은 때로는 캡틴이 도움을 요청한 뒤에, 직접 작업을 쓰기 시작했다. 5.6시간째까지 헬퍼 73개가 작업 756개를 썼고, 그중 캡틴은 16개뿐이었다. 그림 4에는 많은 헬퍼가 subtasks 테이블에 쓰는 모습(빨강)이 보이는데, 이 쓰기 대부분은 작업을 가져가거나 완료로 표시하는 것이었다. 작업을 끝낸 헬퍼들은 더 하겠다고 자원하기도 했다.</p>

<blockquote>
  <p>"한가함(FREE) … 나는 조각을 처음부터 끝까지 마무리한다 … 깊은 조각 하나만 지정해 달라 … 바로 시작하겠다"</p>
</blockquote>

<p>처음에는 리드가 헬퍼들을 특정 명제에 배정하기도 했다. 이는 첫 1시간 안에 바뀌기 시작했고, 3시간째에 리드는 한가한 헬퍼들에게 "나를 기다리지 말라"고 말했다. 덕분에 리드가 계속 새 배정을 쓰는 동안에도, 한가한 헬퍼들은 리드를 기다리지 않고 다른 명제의 작업을 가져갈 수 있었다.</p>

<h3 id="the-lead-assigned-the-team-to-langlandstunnell">리드가 팀을 랭글랜즈–터넬에 투입했다</h3>

<p>18시간 무렵 남은 것은 와일스의 증명이 기대는 고전적 결과인 랭글랜즈–터넬(Langlands–Tunnell) 정리, 그리고 그에 의존하는 명제들과 다른 명제 하나뿐이었다(그 명제는 팀이 도중에 증명했다). 실행 초기에 랭글랜즈–터넬 작업의 캡틴은 비관적이었다. 증명에 적어도 70만~100만 줄의 Lean 코드가 들 것이고, 시간 안에 끝낼 확률은 1% 미만이라고 추정했다. 리드는 이 명제를 제쳐 두었다.</p>

<p>다른 작업이 거의 다 끝나자 리드는 팀의 초점을 랭글랜즈–터넬로 다시 돌렸다. 마지막 하향식 배정에서 리드는 헬퍼 약 750개를 이 명제로 옮기고 "솔직히 승산은 낮다"고 썼다.</p>

<p>랭글랜즈–터넬은 에이전트들이 다룬 다른 어떤 명제보다 훨씬 컸다. 작업 수는 약 9배, 새 코드는 두 배가 넘었다. 헬퍼들은 다시 subtasks 테이블로 일을 나눴지만, 초기 작업 중 상당수는 헬퍼 하나가 혼자 끝내기에는 너무 컸다.</p>

<p>그래서 팀은 작업을 트리로 조직했다. 캡틴은 명제를 10개 영역으로 나누는 계획을 세우고 각 조각을 작업으로 올렸다. 혼자 다루기엔 너무 큰 조각을 만난 헬퍼는 그 조각을 쪼개 그 아래에 더 작은 작업들을 추가할 수 있었다. 트리는 조각 하나가 에이전트 하나에게 너무 어렵다고 드러날 때마다 자랐고, 결국 최대 10단계 깊이에 작업 2,418개에 이르렀다(그림 5). 각 조각은 자기 아래 조각들을 (증명된 것으로) 가정할 수 있었기 때문에, 그 조각들이 증명되기 전에도 헬퍼 수백 개가 병렬로 일할 수 있었다.</p>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig5-task-tree.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig5-poster.png" width="1280" height="668" aria-label="20.5시간부터 28.9시간까지 랭글랜즈–터넬 아래 작업 트리의 타임랩스. 트리는 명제를 둘러싼 동심원으로 그려지며, 하위 영역은 중심 근처의 검은 점이다. 작업은 헬퍼가 쓸 때 나타나고, 처음 완료로 표시되면 회색에서 주황, 진한 빨강으로 바뀌며 늦은 시간일수록 색이 진하다. 28.9시간에 트리는 작업 2,418개를 모두 담고, 그중 2,364개가 시간이 알려진 완료 표시를 가지며, 가장 깊은 가지는 바깥 고리까지 닿는다."></video>
  <figcaption><b>FIG 5</b>랭글랜즈–터넬 아래의 작업 트리. 20.5시간부터 이 명제가 증명된 28.4시간까지 자라는 모습이다. 바깥쪽 고리 하나가 한 단계 더 깊은 수준이며, 작업은 처음 완료로 표시될 때 회색에서 색으로 바뀐다. 선은 작업이 어떻게 쪼개졌는지 보여 준다. 이 연결 대부분은 헬퍼들의 작업 라벨을 보고 나중에 추론한 것이다.</figcaption>
</figure>

<p>그림 6은 전체 실행 동안 모든 헬퍼가 무엇을 했는지 보여 준다. 초반에는 헬퍼들이 여러 명제에 흩어져 있고, 끝에는 랭글랜즈–터넬에 모여 있다. 랭글랜즈–터넬은 28.4시간에 증명됐고, 최종 정리가 28.7시간에 뒤따랐다. 그러자 리드는 이렇게 썼다.</p>

<blockquote>
  <p>"모두 고맙다. 페르마의 마지막 정리가 main에 올라갔고, 공식 검사기로 커널 검사를 통과했다."</p>
</blockquote>

<figure>
  <video controls muted playsinline loop preload="none" src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig6-helpers.mp4" poster="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/safely-scaling-multi-agent-teams-with-fable-5-2/fig6-poster.png" width="1280" height="668" aria-label="0시간부터 30시간까지 헬퍼 999개 각각이 어디서 일했는지를 5분마다 샘플링한 타임랩스. 명제 60개는 리드가 인력을 배치한 방식에 따라 묶인 점들이다. 가장 먼저 들어간 것, 할 만하다고 판정된 것, 제쳐 뒀지만 1.2시간까지 인력이 배치된 것, 제쳐 뒀다가 1.5시간부터 다룬 것, 모듈성 리프팅(modularity lifting), 랭글랜즈–터넬, 그리고 페르마의 마지막 정리까지 이어지는 마지막 연결 고리. 헬퍼들은 자기가 작업하는 명제 주위에 주황색 점으로 모인다. 처음 몇 시간에는 여러 명제에 흩어지고, 8시간 무렵부터 모듈성 리프팅에 몰리며, 18시간 무렵 멈췄다가, 재시작 뒤에 랭글랜즈–터넬에 모인다. 30시간에 명제 60개 중 54개가 증명되어 검게 채워진다."></video>
  <figcaption><b>FIG 6</b>점 하나가 헬퍼 하나이며, 5분마다 그 헬퍼 자신의 기록이 보여 준 작업 중인 명제나 작업 흐름의 위치에 놓인다. 빌드를 기다리는 동안도 포함된다. 헬퍼들은 명제들에 흩어졌다가 랭글랜즈–터넬로 모여들었다. 집계가 60개 중 54개로 끝나는 이유는, 대안 다섯 개가 더는 필요 없어졌고 명제 하나가 빠졌기 때문이다.</figcaption>
</figure>

<h2 id="conclusions">결론</h2>

<p>이 장난감 실험으로 우리는 에이전트 1,000개 팀이 길고 어려운 과제를 어떻게 해 나가는지 연구할 수 있었다. Git과 공유 데이터베이스만으로, 에이전트들은 역할을 배정하고 결과를 공유하는 테이블을 설계하고, 팀을 꾸리고, 가장 어려운 명제를 쪼개기 위한 작업 트리를 만들었다. 그 명제는 정작 그 캡틴이 시간 안에 끝낼 확률을 1% 미만으로 봤던 것이었다.</p>

<p>이 결과가 도메인 특화 하네스나 플랫폼의 필요성을 없애지는 않는다. 예를 들어 Prove2Me는 에이전트가 Lean 코드를 더 빨리 컴파일하도록 돕고, 사람이 만든 결과를 검색해 재사용하게 해 주어 여전히 효율을 높일 수 있다.</p>

<p>사람의 방향 제시도 특정 시점에는 여전히 유용할 수 있다. 에이전트는 어려운 문제에서 포기하거나 난이도를 잘못 판단하는 경향이 있다. 초반에 헬퍼들은 명제 60개 중 47개를 실행 예산 안에서 불가능하다고 판정했지만, 팀은 결국 그 대부분을 증명해 냈다. 그런 순간에 사람이 격려해 주면 에이전트가 너무 일찍 멈추는 것을 막을 수 있다.</p>

<p>애초에 이 실험을 돌릴 자신감을 준 것은 신중하게 설계된 안전 경계였다. Claude는 우리가 준 도구로 원하는 방식대로 문제에 달려들 수 있었지만, 오직 네트워크 접속이 없는 샌드박스 안에서, 두 개의 독립된 모니터 아래에서만 그럴 수 있었다.</p>

<p>우리는 이런 방법들이 빠르게 진화할 것으로 예상하며, 이번 같은 팀이 더 어려운 일을 맡을수록 그 주변의 안전 경계도 보조를 맞춰야 할 것이다. 우리는 안전하게 확장된 멀티 에이전트 팀이 앞으로 몇 년 동안 가장 어려운 문제 중 일부를 푸는 데 도움이 될 것이라고 믿는다.</p>

<footer>
  이 글은 claude.dev(Anthropic 개발자 블로그) 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
