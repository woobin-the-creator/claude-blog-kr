# Raw materials — meta-ai-codebase-tokens

> 이 파일은 사이트에서 링크되지 않는다. 포스트 재생성용 원천 자료(Gemini 분석 결과 + 챕터 + 인벤토리 + 퀴트)를 보관한다.

- **Video URL**: https://youtu.be/Wlt7GhA_14s
- **Title (원본)**: Meta에서 배운 실전 테크닉 - AI가 길 잃지 않는 코드베이스 & 토큰 비용 최적화
- **Channel**: 실밸개발자
- **Duration**: 46:03 (2763s)
- **Slug**: meta-ai-codebase-tokens · main=실밸개발자 Youtube · cat=실전 테크닉
- **Regenerated**: 2026-07-03 (per updated claude-youtube-to-blog SKILL: per-section depth, two-level coverage gate, notes.md archive, timestamped caption links)

## 재생성 시 파이프라인 메모 (중요)
Gemini(yt-analysis MCP) 무료 티어 **일일 쿼터가 소진**되어 이번 재생성에서는
per-section 상세 체크리스트 range 호출이 반복적으로 `API quota exceeded`로 막혔다.
성공한 두 호출(아래 detailed summary + topic inventory)과, 직전 풀 패스로 이미
9개 챕터를 전량 커버해 둔 기존 포스트 본문을 depth 체크리스트의 원천으로 사용했다.
다음 재생성 때 쿼터가 살아 있으면, 아래 인벤토리의 각 range로
`ask_about_video("Between MM:SS and MM:SS, list EVERY distinct point…")`를 돌려
이 파일의 "Per-section detail checklist" 섹션을 채워 넣을 것.

## Chapters (yt-dlp --dump-json, 크리에이터 설정)
1. 00:00 인트로 — 무료 공개 ② 실리콘밸리(Meta)에서 배운 실전 테크닉
2. 00:37 Part 1. AI-Ready 코드베이스 — 지침(CLAUDE.md)이 좋아도 지형이 미로면 Agent는 길을 잃는다
3. 02:18 Agent 실패는 탐색 비용 문제 — 토큰 80%가 '길찾기'에 낭비된다
4. 03:36 두 단계 — Codebase Sanity(건강) → Cartography(지도) + Agent 시대에 더 중요한 이유
5. 07:21 [데모] AI Readiness 채점 스킬 — 100점·7개 카테고리 → HTML 대시보드 + ROI 액션(주기화·PR까지)
6. 16:30 Part 2. Token Efficiency — 자산이 늘수록 토큰·비용이 폭증한다
7. 19:24 비용을 숫자로 + Prompt Caching — 5분 TTL, cache read는 1/10 가격
8. 24:40 캐시를 날리는 실수 + 6가지 최적화 기법 / 안티패턴
9. 31:51 [데모] Token Efficiency 채점 스킬 + Cost Gate — 팀의 공유 자산으로 박아두기

## Topic inventory (ask_about_video, 전 구간 체크리스트)
- 00:00-00:37 Introduction and Course Overview
- 00:38-01:33 Importance of Terrain (Codebase) vs. Instructions (CLAUDE.md)
- 01:34-02:17 Definition of AI-Ready Codebase
- 02:18-03:35 Agent Failure Analysis: Search/Understanding vs. Code Quality (80/20 Rule)
- 03:36-04:42 The 2-Step Model: Codebase Sanity and Cartography
- 04:43-06:29 Step 1: Codebase Sanity (Tests, Conventions, Dead Code, Code Smells)
- 06:30-07:20 Step 2: Cartography (Entry Points, Graphs, Terminology, Gotchas)
- 07:21-08:31 AI-Readiness Score Rubric and Categories
- 08:32-10:00 Demo: Running AI-Readiness Cartography Skill
- 10:01-12:00 Python Script Logic and Rubric Breakdown
- 12:01-13:38 Interpreting the AI-Readiness Dashboard Report
- 13:39-14:07 ROI Action Items for Optimization
- 14:08-15:13 Automation: Weekly and Pre-commit Hooks
- 15:14-15:19 Plugin Integration Strategy
- 15:20-16:30 Summary of AI-Ready Codebase
- 16:31-17:53 Introduction to Token Efficiency and Cost management
- 17:54-19:24 Token Definitions and Regional Variations (English, Code, Korean)
- 19:25-21:18 Cost Metrics: Anchor Values for Input, Output, and Caching
- 21:19-22:17 Personal vs. Corporate Cost Perspectives
- 22:18-23:14 Caching: The Primary Cost-Cutting Tool
- 23:15-24:41 Cache Mechanics: TTL (5 Minutes), Prefix Reuse, and Pricing
- 24:42-27:03 Warning: Impact of Mid-Session Model or Instruction Changes
- 27:04-28:16 Cache-Friendly Prompt Design
- 28:17-29:45 Best Practices for ROI Optimization
- 29:46-31:43 Anti-Patterns: Inefficient Context Usage and Caching Mistakes
- 31:44-32:57 Token Efficiency Dashboard Skill Architecture
- 32:58-34:27 Scoring Logic for Efficiency Rubric
- 34:28-36:00 Demo: Generating Token Usage Analytics
- 36:01-38:10 Interpreting Token Efficiency and Cache Hit Ratios
- 38:11-38:59 Specific Optimization Advice for Improved Grades
- 39:00-39:58 Cost Gates vs. Dashboards: Prevention vs. Post-Analysis
- 39:59-41:54 Final Summary and Closing Advice (Automation over Slogans)

## Detailed summary (summarize_video detail_level=detailed)

호스트: 실밸개발자. Claude Code agentic engineering 시리즈 2편. Meta(실리콘밸리) 경험 기반.
두 축: (1) AI-ready 코드베이스 설계 — agent가 길 잃지 않게, (2) 토큰 효율/비용 관리 — 데이터 기반.

### 1. AI-Ready 코드베이스
- 정의·중요성(00:38-01:34): CLAUDE.md 같은 지침이 명확해도 코드베이스가 "미로"면 agent는 실패. AI-ready = agent가 길 잃지 않도록 설계된 환경.
- "첫 1분" 규칙(01:34-02:18): 사람은 시간 들여 멘탈맵을 쌓지만 agent는 매 세션 fresh 시작. 진입점·로직 흐름을 첫 1분 안에 파악할 만큼 명확해야.
- 탐색 비용 vs 코드 품질(02:18-03:36): agent 실패 대부분은 코딩 실력이 아니라 탐색 비용. 정돈 안 된 repo에선 토큰 80%를 "파일 찾기·deprecated 코드 이해"에 낭비. AI-readiness는 이 균형을 실제 작업 실행 쪽으로 이동.
- 2단계 모델(03:36-04:43): Step1 Codebase Sanity(높은 테스트 커버리지·일관 컨벤션·code smell/dead code 제거) → Step2 Cartography(진입점·의존 그래프·도메인 용어집).
- 전통 엔지니어링 가치의 재해석(04:43-06:30): 테스트 = agent의 self-validation 신호, 일관 컨벤션 = agent가 패턴을 더 잘 일반화.
- 준비도 측정(07:21-13:58): repo를 7개 카테고리(Navigation, Context Quality, Tribal Knowledge 등)로 감사하는 커스텀 스킬 → "AI-Readiness Score" + ROI 제안.
- 자동화(13:58-15:20): pre-commit hook 또는 스케줄 잡으로 준비도 체크를 자동화해 코드베이스 진화에도 기준 유지.

### 2. 토큰 효율 & 비용
- 커지는 컨텍스트 문제(16:30-17:54): AI용 가이드·자산이 늘수록 컨텍스트 크기↑ → 토큰·비용↑.
- 토큰 이해(17:54-19:25): 토큰 = 텍스트 처리 단위. 영어가 한국어보다 토큰 효율적(영어 0.75 words/token vs 한국어 ~1.5-2 chars/token). 기술 지침은 영어로 쓰는 게 유리할 수 있음.
- Prompt Caching의 힘(22:19-24:43): 비용 절감 최강 도구. 정적 prefix(system prompt·지침 파일)를 반복하면 처리 결과를 ~1/10 비용에 재사용.
- 캐시 친화 습관(24:43-26:17): 정적 지침 파일 수정, 세션 도중 모델 변경 = 캐시 무효화 → 이후 모든 turn 비용 급증.
- 최적화 기법 & 안티패턴(26:17-28:57): 6가지 핵심 기법(예: 무거운 탐색은 sub-agent에), 흔한 실수(같은 큰 파일을 수동 반복 주입).
- 효율 대시보드 & Cost Gate(28:57-33:14): 대시보드 = 세션 로그를 분석해 Cache Hit Ratio·총 지출 표시(사후). Cost Gate = 세션/PR 단위 한도 초과 시 경고/정지(사전).

### 주요 진술(Gemini 영문 렌더링 — 원 발화는 한국어)
- (01:13) 지침은 좋아도 지형(코드베이스)이 험하면 agent는 넘어질 수밖에 없다.
- (03:14) 토큰의 80%가 흔히 탐색에 낭비된다.
- (34:11) 토큰을 아끼는 건 단지 아끼는 문제가 아니라, 지출을 팀의 누적 자산으로 바꾸는 문제다.

### 결론
성공적 agent 개발 환경 = "AI-ready" 코드 기반 + 규율 있는 토큰 사용. Codebase Sanity·Cartography 원칙 + Prompt Caching·Cost Gate로 agent 성능↑·운영비용 관리. 다음 편(09)은 AI 자동 코드 리뷰.

## Per-section detail checklist
> 쿼터 소진으로 이번 회차에는 range별 상세 호출을 채우지 못함. 위 detailed summary +
> topic inventory + 본문에 재구성된 슬라이드/코드 디테일이 depth 원천. 다음 회차에서 보강.

## Frames on disk (초 단위 = 파일명, 캡션 링크 ?t=초)
194(3:14 80/20), 245(4:05 2-step), 360(6:00 Sanity 비교표), 490(8:10 7카테고리 배점),
690(11:30 score.py 정규식), 725(12:05 54/100 대시보드), 875(14:35 hook 3트리거),
1110(18:30 토큰 BPE·언어별 밀도), 1225(20:25 1M당 단가·팀 비용), 1560(26:00 캐시 3구조),
1740(29:00 6기법 표), 2245(37:25 analyze_sessions.py·PRICING), 2470(41:10 4축 Rubric·등급),
2600(43:20 Cost Gate 세션·PR), 2735(45:35 plugin 8자산 요약)

## Quotes 사용 방침
발표자는 한국어로 말한다. Gemini 영문 라인은 번역이므로 "영어 원문 blockquote"를 만들지 않고
한국어 패러프레이즈 blockquote만 사용(짧게). 긴 자막 축자 인용 금지.
