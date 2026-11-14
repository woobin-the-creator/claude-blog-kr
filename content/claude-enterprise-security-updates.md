---
slug: "claude-enterprise-security-updates"
title: "보안 팀을 위해 Claude Enterprise의 가시성과 제어 강화"
nav: "Claude Enterprise 보안 업데이트 · 보안 센터(베타), 추론 훅 GA, admin.claude.com 중앙 관리, Admin API 로그아웃·IP 허용 목록, Cowork VM EDR"
main: "Claude blog"
cat: "Product updates"
date: "2026-11-05"
author: "ai"
rev: 1
style_css: ":root { --fg:#1a1a1a; --muted:#666; --line:#e5e5e5; --accent:#c96442; --code-bg:#f6f6f4; }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Apple SD Gothic Neo\",\n      \"Malgun Gothic\", sans-serif;\n    color: var(--fg); line-height: 1.75; max-width: 760px;\n    margin: 0 auto; padding: 48px 24px 96px; background:#fff;\n  }\n  header { border-bottom: 2px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }\n  h1 { font-size: 1.9rem; line-height: 1.35; margin: 0 0 12px; }\n  .meta { color: var(--muted); font-size: 0.9rem; }\n  .meta .orig { display:block; margin-top:6px; }\n  .meta a { color: var(--accent); text-decoration: none; }\n  h2 { font-size: 1.4rem; margin: 44px 0 8px; padding-top: 8px; }\n  h3 { font-size: 1.15rem; margin: 30px 0 8px; color:#000; }\n  p { margin: 0 0 16px; }\n  a { color: var(--accent); }\n  ul, ol { margin: 0 0 16px; padding-left: 22px; }\n  li { margin-bottom: 8px; }\n  blockquote { margin: 16px 0; padding: 8px 18px; border-left:3px solid var(--line);\n    color:#333; font-style: italic; }\n  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }\n  code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    font-family: \"SF Mono\", Menlo, Consolas, monospace; font-size: 0.88em; }\n  figure { margin: 24px 0; }\n  figure img { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px;\n    background:#fff; }\n  figure video { width: 100%; height: auto; border:1px solid var(--line); border-radius: 8px; display:block; }\n  figure.hero img { border:none; max-width: 210px; display:block; margin: 0 auto 8px; }\n  figcaption { color: var(--muted); font-size: 0.85rem; text-align: center;\n    margin-top: 10px; line-height: 1.5; }\n  figcaption a { color: var(--accent); }\n  .video { position: relative; width: 100%; padding-top: 56.25%; margin: 24px 0 8px;\n    border-radius: 8px; overflow: hidden; background:#000; }\n  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }\n  .callout { background:#faf6f4; border-left:3px solid var(--accent);\n    padding: 12px 16px; border-radius: 0 6px 6px 0; margin: 16px 0; }\n  .callout strong { color: var(--accent); }\n  .lede { color:#333; font-size: 1.05rem; }\n  footer { margin-top: 64px; padding-top: 20px; border-top:1px solid var(--line);\n    color: var(--muted); font-size: 0.82rem; }\n  .testimonial { margin: 28px 0; padding: 18px 20px; border:1px solid var(--line); border-radius: 8px; }\n  .testimonial img { height: 30px; width: auto; max-width: 180px; display:block; margin-bottom: 12px; }\n  .testimonial blockquote { margin: 0 0 10px; padding: 0; border:none; }\n  .testimonial .who { color: var(--muted); font-size: 0.88rem; margin: 0; }"
has_markdown: false
markdown_length: 0
html_length: 6860
---

<!-- rendered HTML -->
<header>
  <h1>보안 팀을 위해 Claude Enterprise의 가시성과 제어 강화</h1>
  <div class="meta">
    2026년 11월 5일
    · 카테고리: <a href="https://claude.com/resources/articles">Product updates</a>
    · 제품: Claude Enterprise, Claude apps
    · 읽는 시간 9분
    <span class="orig">원문:
      <a href="https://claude.com/resources/articles/claude-enterprise-security-updates">More visibility and control over Claude Enterprise for security teams</a>
      (한글 번역본)</span>
  </div>
</header>

<p class="lede">Claude Enterprise에 새로운 보안·관리 기능이 추가되었습니다. 보안 센터(security center), 정식 출시(GA)된 추론 훅(inference hooks), 중앙 관리(centralized management), 그리고 추가 접근 제어 기능입니다.</p>

<p>Claude가 어떻게 설정되어 있는지 보려면, 보안 센터가 조직의 Claude 설정을 Anthropic의 권장 구성과 비교해 보여 줍니다. 정책을 적용하려면, 추론 훅이 프롬프트와 도구 호출(tool call)을 데이터 보안 도구로 보내 검사를 받게 합니다. 접근을 관리하려면, 중앙 관리가 회사 전체 설정을 위한 하나의 관리 콘솔을 제공하고, 새로운 접근 제어 기능으로 Admin API를 통해 구성원을 로그아웃시키고, IP 허용 목록(IP allowlist)을 직접 관리하며, 관리 대상 컴퓨터의 Claude Desktop에서 개인 계정과 기타 외부 Claude 계정을 차단해 섀도 IT(shadow IT)를 막는 데 도움을 받을 수 있습니다.</p>

<p>또한 최근에는 엔드포인트 탐지 및 대응(Endpoint Detection and Response, EDR) 통합도 발표했습니다. 이 통합은 사용자 컴퓨터에 있는 <a href="https://claude.com/resources/articles/unified-claude-enterprise">통합 Claude</a> 및 Cowork 가상 머신 안에서 조직의 센서를 실행합니다.</p>

<p>보안 팀은 Claude가 어떻게 구성되어 있는지, 회사 기기에서 무엇을 하는지, 사람들이 일하는 동안 데이터가 어떻게 처리되는지 알아야 합니다. 이번 기능들은 보안 팀에 바로 그 가시성과 제어 능력을 제공합니다.</p>

<h2>보안 센터: Claude 보안 설정을 한곳에서 검토</h2>

<figure>
  <img src="https://woobin-the-creator.github.io/claude-blog-kr/posts/assets/claude-enterprise-security-updates/security-center.png" width="1200" height="675" alt="Claude 조직 설정(Organization settings)의 보안 태세 대시보드. 16개 제어 항목 중 13개 통과." loading="lazy">
</figure>

<p>보안 팀은 이제 채팅, Cowork, Claude Code에 대한 Claude의 보안 설정을 설정 하나하나 따로 보는 대신 한 페이지에서 검토할 수 있습니다. 보안 센터는 조직 설정(Organization settings)에 새로 추가된 페이지로, 현재 설정을 Anthropic의 권장 구성과 비교해 주기 때문에 팀은 무엇을 바꿔야 하고 어디서 바꿀 수 있는지 알 수 있습니다.</p>

<p>보안 센터는 각 제어 항목마다 현재 값, (권장 값이 있는 경우) 권장 값, 그리고 해당 설정을 바꿀 수 있는 곳으로 가는 링크를 보여 줍니다. 어떤 설정이 새로 생겼거나 최근에 바뀌었는지도 표시합니다. 보안 센터는 페이지를 불러올 때마다 구성을 검사하므로, 자동으로 검사되는 제어 항목은 현재 설정을 반영합니다. Compliance API를 쓰는 조직은 같은 결과를 Compliance API로도 읽을 수 있습니다.</p>

<p>증명(attestation) 기능은 관리자들에게 보안 검토를 위한 공유 작업 공간을 제공합니다. 관리자들은 각 제어 항목의 현재 상태를 기록하고, 위험을 수용하고, 문제를 표시하는 과정을 한곳에서 함께 한 번에 진행할 수 있습니다.</p>

<p>보안 센터 페이지는 보고서로 내려받아 감사인(auditor) 및 관련 이해관계자와 공유할 수 있습니다. 보고서에는 페이지가 자동으로 검사한 제어 항목과 소유자(Owner)가 확인한 제어 항목이 구분되어 표시됩니다. 보안 센터는 Anthropic의 권장 사항에 기반한 가이드일 뿐, 어떤 법률이나 표준에 대한 인증이나 준수 보증이 아닙니다.</p>

<h2>추론 훅</h2>

<p>추론 훅(inference hooks)은 Claude를 조직이 이미 쓰고 있는 데이터 보안 도구와 연결해, 사람들이 일하는 동안 데이터 유출 방지(DLP) 및 보안 정책이 프롬프트와 도구 호출에 적용되도록 합니다.</p>

<p>훅에는 두 종류가 있으며, 둘 다 이제 정식 출시되었습니다.</p>
<ul>
  <li>프롬프트 훅(prompt hooks)은 지원되는 Claude 제품의 프롬프트를 보안 도구로 보내 검사를 받게 합니다.</li>
  <li>도구 호출 전 훅(pre-tool-call hooks)은 지원되는 Claude 제품에서 도구 호출이 실행되기 전에 이를 검사합니다.</li>
</ul>

<p>훅은 보안 벤더와 함께 동작합니다. 팀은 이미 작성해 둔 정책을 그대로 유지하면서 Claude에 적용할 수 있습니다.</p>

<h2>중앙 관리: 조직 전반의 ID와 접근을 위한 하나의 콘솔</h2>

<p>중앙 관리(centralized management)는 상위 조직(parent organization)에 admin.claude.com의 전용 관리 콘솔을 제공합니다. 상위 조직은 회사의 Claude Enterprise 조직과 Claude Platform 조직 전체에서 회사를 대표하는 단위입니다. 관리자는 개별 조직 설정에서 따로 관리하는 대신, 상위 조직 아래의 조직들에 대한 회사 전체 설정을 이곳에서 한 번에 관리합니다. 이런 설정에는 싱글 사인온(SSO), 디렉터리 동기화(SCIM), 도메인 인증, 그룹, Compliance API 키가 포함됩니다.</p>

<p>콘솔은 상위 조직 아래의 모든 조직을 한곳에 보여 주며, 두 가지 역할을 새로 추가합니다. 상위 조직 소유자(parent organization owner)는 누가 소유자와 관리자 역할을 갖는지를 포함해 상위 조직 수준의 모든 것을 관리할 수 있습니다. 상위 조직 관리자(parent organization admin)는 그 역할 지정을 제외한 모든 것을 관리할 수 있습니다.</p>

<p>회사는 ID 공급자(identity provider)를 둘 이상 연결할 수도 있으며, 각 공급자는 고유한 싱글 사인온 및 SCIM 구성을 가집니다. 인수한 회사는 기존 공급자를 그대로 쓸 수 있고, 팀이 도메인 하나씩 새 공급자로 옮겨 갈 수도 있습니다.</p>

<p>각 조직은 자체 구성원, 역할, 설정, 그리고 IP 허용 목록, 테넌트 제한(tenant restrictions), 세션 지속 시간 같은 조직 수준 보안 제어를 그대로 유지합니다. 상위 조직 역할은 기본적으로 개별 조직 내부에 대한 접근 권한을 부여하지 않지만, 상위 조직에서 만든 Compliance API 키는 여러 조직에 걸쳐 데이터를 읽을 수 있습니다.</p>

<h2>접근 제어: 구성원 로그아웃과 섀도 IT 방지</h2>

<p>보안 팀은 이제 Admin API 호출 한 번으로 구성원을 조직에서 제거하지 않고도 Claude에서 로그아웃시킬 수 있습니다. 이 호출은 모든 브라우저와 기기에서 해당 구성원의 로그인 세션을 종료하며, Claude Code 같은 앱은 다시 로그인해야 합니다. API 키, 이미 실행 중인 클라우드 세션, 예약된 루틴(scheduled routines)은 종료하지 않으며, 구성원은 이후 다시 로그인할 수 있습니다.</p>

<p>Enterprise 관리자는 이제 Anthropic을 거치지 않고 IP 허용 목록을 직접 설정하고 관리할 수 있습니다. IP 허용 목록은 대부분의 Claude 제품에 대한 접근을 조직이 승인한 IP 주소로 제한합니다.</p>

<p>관리자는 이제 기기 관리(device management) 배포 없이도 가장 많이 쓰이는 Claude Desktop 설정을 지정할 수 있습니다. 섀도 IT를 막는 데 도움이 되도록, 관리자는 관리 대상 컴퓨터의 Claude Desktop에서 개인 계정과 기타 외부 Claude 계정을 차단할 수도 있습니다. 소유자는 사람들이 Claude와 함께 쓸 수 있는 작업 공간 폴더를 제한할 수도 있습니다.</p>

<h2>Cowork와 통합 Claude의 엔드포인트 탐지 및 대응(EDR)</h2>

<p>Cowork와 통합 Claude가 로컬에서 작업할 때는 추가 보호를 위해 사용자 컴퓨터의 격리된 가상 머신 안에서 셸 명령과 코드를 실행합니다. 이 격리는 기기를 보호하는 데 도움이 되며, 보안 팀은 엔드포인트의 다른 모든 곳에서 갖고 있는 것과 같은 가시성을 이 가상 머신에서도 원해 왔습니다.</p>

<p>관리자는 이제 조직의 EDR 센서를 Cowork 가상 머신 안에서 실행할 수 있습니다. 센서는 그 안의 활동을 보안 팀이 이미 모니터링하고 있는 콘솔로 보고합니다. 이 기능은 사용자 컴퓨터의 가상 머신에 적용되며, 클라우드의 Cowork 세션에는 적용되지 않습니다.</p>

<p>관리자는 macOS와 Windows에서 기기 관리를 통해 이 통합을 설정합니다. 가상 머신이 시작될 때마다 Claude는 EDR 벤더가 제공한 센서 패키지의 서명을 확인한 뒤에 설치합니다. 센서는 탐지 모드(detection mode)로 실행됩니다. 즉, 활동을 보안 팀에 보고할 뿐 차단하지는 않습니다. 이 통합은 지원되는 EDR 벤더와 함께 동작하며, 지원 벤더 목록은 <a href="https://support.claude.com/en/articles/17828685-run-your-endpoint-detection-and-response-edr-sensor-in-claude-cowork-on-claude-desktop">고객 센터(Help Center)</a>에 있습니다.</p>

<h2>시작하기</h2>

<p>이 기능들은 Claude Enterprise에서 사용할 수 있으며, 베타 기간 중의 일부 예외 사항은 <a href="https://support.claude.com/en">고객 센터</a>에 나와 있습니다.</p>

<p><a href="https://support.claude.com/en/articles/18246629-review-your-organization-s-security-posture-with-the-security-center">보안 센터</a>는 베타입니다. 프롬프트 훅과 도구 호출 전 훅을 포함한 <a href="https://support.claude.com/en/articles/16059458-inference-hooks-overview">추론 훅</a>은 정식 출시되었습니다. 관리자는 조직 설정에서 추론 훅과 보안 센터를 모두 관리할 수 있습니다.</p>

<p><a href="https://support.claude.com/en/articles/18232924">중앙 관리</a>도 베타입니다. 설정을 시작하려면 상위 조직 아래 아무 조직의 관리자가 admin.claude.com에 가서 상위 조직 관리자를 제안합니다. 다른 조직의 관리자들이 이를 검토하고 승인하며, 마지막 승인이 이루어지면 설정이 완료됩니다. 설정은 되돌릴 수 없으므로, 시작하기 전에 상위 조직 관리자를 누구로 할지 정해 두세요.</p>

<p>Admin API를 통한 <a href="https://support.claude.com/en/articles/13133750-manage-members-on-team-and-enterprise-plans#h_3cba7d14e5">구성원 로그아웃</a>과 <a href="https://support.claude.com/en/articles/13200993-restrict-access-to-claude-with-ip-allowlisting">셀프서비스 IP 허용 목록</a>은 베타입니다. 소유자는 조직 설정에서 <a href="https://support.claude.com/en/articles/12622667-enterprise-configuration-for-claude-desktop#h_21135034c8">Claude Desktop 설정</a>을 관리할 수 있으며, 이 기능 역시 베타입니다.</p>

<p>Cowork의 <a href="https://support.claude.com/en/articles/17828685-run-your-endpoint-detection-and-response-edr-sensor-in-claude-cowork-on-claude-desktop">엔드포인트 탐지 및 대응</a>은 macOS와 Windows에서 Claude Team 및 Enterprise용으로, 그리고 Amazon Bedrock, Google Cloud Vertex AI, Microsoft Foundry의 Claude 데스크톱 앱용으로 베타 제공되며, 지원 벤더에 한해 MDM을 통해 배포됩니다.</p>

<footer>
  이 글은 Claude 공식 블로그 원문을 한국어로 옮긴 비공식 번역본입니다.
  내용의 정확한 의미는 위 원문 링크를 함께 참고하세요.
</footer>
