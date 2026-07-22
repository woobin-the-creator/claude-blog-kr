/* Single source of truth for the post catalog.
 * Loaded by index.html, library.html, and every post page (before nav.js).
 *
 * Add a post = add ONE entry below (newest first). Fields:
 *   file  : 파일명 (posts/ 기준 상대)
 *   date  : YYYY-MM-DD
 *   main  : 메인 카테고리 = 출처 (예: "Claude blog", "Cursor Youtube")
 *   cat   : 서브 카테고리 = 주제 (예: "Agents", "Claude Code · 해커톤", "세미나")
 *   title : 전체 제목 (index/library/breadcrumb 용)
 *   nav   : 사이드바용 짧은 제목
 */
(function () {
  window.CBK_POSTS = [
    { file: "how-outtake-built-a-cyber-investigator-on-claude.html", date: "2026-07-22", main: "Claude blog", cat: "Agents",
      title: "Outtake는 Claude로 어떻게 사이버 수사관을 만들었나", nav: "Outtake의 사이버 수사관 Recon Agent" },
    { file: "building-verification-loops-in-claude-code-with-skills.html", date: "2026-07-22", main: "Claude blog", cat: "Claude Code",
      title: "스킬로 Claude Code 안에 검증 루프 만들기", nav: "스킬로 만드는 검증 루프" },
    { file: "how-datadog-built-a-universal-machine-tool-for-claude-code.html", date: "2026-07-21", main: "Claude blog", cat: "Claude Code",
      title: "Datadog는 Claude Code를 위한 ‘범용 공작기계’를 어떻게 만들었나", nav: "Datadog의 범용 공작기계 Temper" },
    { file: "how-anthropic-secures-its-ai-native-software-development-lifecycle.html", date: "2026-07-21", main: "Claude blog", cat: "Claude Code",
      title: "Anthropic은 AI 네이티브 소프트웨어 개발 생명주기를 어떻게 안전하게 지키는가", nav: "AI 네이티브 SDLC 보안" },
    { file: "working-at-the-frontier-rakuten.html", date: "2026-07-20", main: "Claude blog", cat: "Enterprise AI",
      title: "프런티어에서 일하기: 라쿠텐은 Claude Fable 5로 밤새 에이전트를 만든다", nav: "라쿠텐의 밤샘 에이전트" },
    { file: "working-at-the-frontier-cursor.html", date: "2026-07-17", main: "Claude blog", cat: "Enterprise AI",
      title: "프런티어에서 일하기: Cursor는 Claude Fable 5가 가장 어려운 1% 문제를 풀 준비가 됐음을 어떻게 알았나", nav: "Cursor의 가장 어려운 1% 문제" },
    { file: "ciso-guide-to-agentic-ai.html", date: "2026-07-17", main: "Claude blog", cat: "Enterprise AI",
      title: "제로 리스크는 목표가 아니다: CISO를 위한 에이전틱 AI 가이드", nav: "CISO의 에이전틱 AI 가이드" },
    { file: "working-with-claude-fable-5-in-claude-cowork.html", date: "2026-07-16", main: "Claude blog", cat: "Claude Cowork",
      title: "Claude Cowork에서 Claude Fable 5와 함께 일하기", nav: "Cowork에서 Fable 5와 일하기" },
    { file: "ai-code-migration.html", date: "2026-07-16", main: "Claude blog", cat: "Claude Code",
      title: "Anthropic은 Claude Code로 대규모 코드 마이그레이션을 어떻게 진행하는가", nav: "대규모 코드 마이그레이션" },
    { file: "working-at-the-frontier-why-base44-trusts-claude-fable-5-with-their-most-challenging-engineering-work.html", date: "2026-07-15", main: "Claude blog", cat: "Enterprise AI",
      title: "프런티어에서 일하기: Base44는 왜 가장 까다로운 엔지니어링 작업을 Claude Fable 5에 맡기는가", nav: "Base44의 가장 까다로운 작업" },
    { file: "doordash-every-employee-claude-code.html", date: "2026-07-07", main: "Claude Youtube", cat: "Enterprise AI",
      title: "DoorDash는 전 직원에게 Claude Code를 쥐여줬다 — 앤디 팡 × 보리스 체르니", nav: "DoorDash, 전 직원에게 Claude Code" },
    { file: "working-at-the-frontier-how-hebbia-builds-ai-for-financial-diligence-that-cant-miss-a-detail.html", date: "2026-07-13", main: "Claude blog", cat: "Enterprise AI",
      title: "프런티어에서 일하기: Hebbia는 디테일 하나 놓칠 수 없는 금융 실사를 위한 AI를 어떻게 만드는가", nav: "Hebbia의 금융 실사 AI" },
    { file: "working-at-the-frontier-how-cognition-trusts-claude-fable-5-to-work-through-the-night.html", date: "2026-07-10", main: "Claude blog", cat: "Enterprise AI",
      title: "프런티어에서 일하기: Cognition은 밤새 일하는 Claude Fable 5를 어떻게 신뢰하게 됐는가", nav: "Cognition의 밤샘 Fable 5" },
    { file: "working-at-the-frontier-how-thomson-reuters-builds-ai-for-high--stakes-professional-work.html", date: "2026-07-08", main: "Claude blog", cat: "Enterprise AI",
      title: "프런티어에서 일하기: Thomson Reuters는 고위험 전문 업무를 위한 AI를 어떻게 만드는가", nav: "Thomson Reuters의 전문가급 AI" },
    { file: "how-anthropics-marketing-operations-team-uses-claude-cowork-to-automate-reporting-and-campaign-builds.html", date: "2026-07-08", main: "Claude blog", cat: "Claude Cowork",
      title: "Anthropic 마케팅 운영팀은 Claude Cowork로 리포팅과 캠페인 구축을 어떻게 자동화하는가", nav: "마케팅 운영팀의 Cowork 활용" },
    { file: "how-people-are-using-claude-cowork.html", date: "2026-07-07", main: "Claude blog", cat: "Claude Cowork",
      title: "사람들은 Claude Cowork를 어떻게 쓰고 있는가", nav: "사람들은 Cowork를 어떻게 쓰나" },
    { file: "cowork-web-mobile.html", date: "2026-07-07", main: "Claude blog", cat: "Claude Cowork",
      title: "Claude Cowork가 모바일과 웹으로 찾아옵니다", nav: "Cowork, 모바일·웹으로" },
    { file: "claude-model-and-effort-level-in-claude-code.html", date: "2026-07-07", main: "Claude blog", cat: "Claude Code",
      title: "Claude Code에서 Claude 모델과 노력(effort) 수준 고르기", nav: "모델·노력 수준 고르기" },
    { file: "bringing-claude-code-and-claude-cowork-to-government.html", date: "2026-07-07", main: "Claude blog", cat: "Enterprise AI",
      title: "Claude Code와 Claude Cowork를 정부 기관에 도입합니다", nav: "정부 기관용 Claude Code·Cowork" },
    { file: "a-field-guide-to-claude-fable-finding-your-unknowns.html", date: "2026-07-06", main: "Claude blog", cat: "Claude Code",
      title: "Claude Fable 필드 가이드: 당신의 '모르는 것'을 찾아내기", nav: "Fable 필드 가이드: 모르는 것 찾기" },
    { file: "meta-ai-codebase-tokens.html", date: "2026-06-30", main: "실밸개발자 Youtube", cat: "실전 테크닉",
      title: "Meta에서 배운 실전 테크닉: AI가 길 잃지 않는 코드베이스 & 토큰 비용 최적화", nav: "AI-Ready 코드베이스 & 토큰 비용" },
    { file: "spotify-agents-20m-lines.html", date: "2026-07-03", main: "Claude Youtube", cat: "Agents",
      title: "Spotify는 2,000만 줄 코드베이스에서 에이전트를 어떻게 굴리는가 — 니클라스 구스타브손", nav: "Spotify 2,000만 줄 에이전트" },
    { file: "giving-admins-more-visibility-and-control-over-claude-usage-and-spend.html", date: "2026-07-02", main: "Claude blog", cat: "Enterprise AI",
      title: "관리자에게 Claude 사용량·지출의 가시성과 통제권을 제공합니다", nav: "Claude 지출 가시성·통제" },
    { file: "getting-started-with-loops.html", date: "2026-06-30", main: "Claude blog", cat: "Claude Code",
      title: "루프(loop) 시작하기", nav: "루프 시작하기" },
    { file: "introducing-the-claude-apps-gateway.html", date: "2026-06-29", main: "Claude blog", cat: "Claude Code",
      title: "Amazon Bedrock과 Google Cloud를 위한 Claude apps gateway를 소개합니다", nav: "Claude apps gateway 소개" },
    { file: "claude-in-microsoft-foundry.html", date: "2026-06-29", main: "Claude blog", cat: "Enterprise AI",
      title: "이제 Microsoft Foundry에서 Claude를 정식으로 사용할 수 있습니다", nav: "Microsoft Foundry의 Claude" },
    { file: "ai-era-durable-skills.html", date: "2026-06-26", main: "AI 인사이트", cat: "역량·커리어",
      title: "RAG는 죽지 않았다 — AI 시대에 4~5년 살아남는 기술 역량", nav: "AI 시대 내구성 역량" },
    { file: "keep-claude-working-toward-a-goal.html", date: "2026-06-25", main: "Claude Code Docs", cat: "Claude Code",
      title: "목표를 향해 Claude를 계속 일하게 하기: /goal 명령어", nav: "/goal로 목표까지 일 시키기" },
    { file: "building-effective-human-agent-teams.html", date: "2026-06-24", main: "Claude blog", cat: "Enterprise AI",
      title: "효과적인 인간-에이전트 팀 만들기: Anthropic의 교훈", nav: "효과적인 인간-에이전트 팀" },
    { file: "agent-identity-access-model.html", date: "2026-06-24", main: "Claude blog", cat: "Claude Code",
      title: "Claude Tag의 에이전트 아이덴티티: 자율적이고 팀 전체가 함께 쓰는 AI를 위한 새로운 접근 모델", nav: "에이전트 아이덴티티 접근 모델" },
    { file: "the-full-claude-desktop-experience-on-aws-google-cloud-and-microsoft-foundry.html", date: "2026-06-22", main: "Claude blog", cat: "Enterprise AI",
      title: "AWS, Google Cloud, Microsoft Foundry에서 누리는 완전한 Claude Desktop 경험", nav: "완전한 Claude Desktop 경험" },
    { file: "artifacts-in-claude-code.html", date: "2026-06-18", main: "Claude blog", cat: "Product announcements",
      title: "Claude Code가 이제 아티팩트(artifacts)를 지원합니다", nav: "Claude Code 아티팩트" },
    { file: "enterprise-managed-auth.html", date: "2026-06-18", main: "Claude blog", cat: "Enterprise AI",
      title: "MCP 커넥터 권한을 중앙에서 관리하기", nav: "MCP 커넥터 중앙 권한 관리" },
    { file: "steering-claude-code.html", date: "2026-06-18", main: "Claude blog", cat: "Claude Code",
      title: "Claude Code 길들이기: CLAUDE.md, 스킬, 훅, 룰, 서브에이전트 그 외", nav: "Claude Code 길들이기" },
    { file: "claude-design-stays-on-brand-for-daily-work.html", date: "2026-06-17", main: "Claude blog", cat: "Product announcements",
      title: "이제 Claude Design은 일상 업무에서도 브랜드를 일관되게 유지합니다", nav: "Claude Design 브랜드 유지" },
    { file: "workload-identity-federation.html", date: "2026-06-17", main: "Claude blog", cat: "Product announcements",
      title: "워크로드 아이덴티티 페더레이션(WIF)으로 Claude 플랫폼에 안전하게 접근하기", nav: "워크로드 아이덴티티 페더레이션" },
    { file: "build-day-hackathon-winners.html", date: "2026-06-17", main: "Claude blog", cat: "Claude Code · 해커톤",
      title: "Claude Opus 4.8 빌드 데이 해커톤 우승팀을 소개합니다", nav: "Opus 4.8 빌드 데이 해커톤" },
    { file: "opus-4-7-hackathon-winners.html", date: "2026-06-15", main: "Claude blog", cat: "Claude Code · 해커톤",
      title: "Built with Opus 4.7 Claude Code 해커톤 우승팀을 소개합니다", nav: "Built with Opus 4.7 해커톤" },
    { file: "building-with-claude-managed-agents.html", date: "2026-06-10", main: "Claude blog", cat: "Agents",
      title: "에이전트 표면의 진화: Claude Managed Agents로 만들기", nav: "Managed Agents로 만들기" },
    { file: "whats-new-in-claude-managed-agents.html", date: "2026-06-09", main: "Claude blog", cat: "Product announcements",
      title: "Claude Managed Agents 새 기능: 일정 실행과 환경 변수 볼트", nav: "관리형 에이전트 새 기능" },
    { file: "how-we-claude-code.html", date: "2026-05-23", main: "Claude Youtube", cat: "Claude Code",
      title: "Claude 팀은 Claude Code를 이렇게 쓴다: 모호성 제거·HTML 기획·통합 검증", nav: "How we Claude Code" },
    { file: "opus-4-6-hackathon-winners.html", date: "2026-04-20", main: "Claude blog", cat: "Claude Code · 해커톤",
      title: "Built with Opus 4.6 Claude Code 해커톤 우승팀을 소개합니다", nav: "Built with Opus 4.6 해커톤" }
  ];

  /* file 또는 slug(확장자 없는 파일명)로 포스트 1건 조회. 없으면 null. */
  window.CBK_postBySlug = function (key) {
    if (!key) return null;
    var want = String(key).replace(/\.html$/, "");
    var list = window.CBK_POSTS;
    for (var i = 0; i < list.length; i++) {
      if (list[i].file.replace(/\.html$/, "") === want) return list[i];
    }
    return null;
  };
})();
