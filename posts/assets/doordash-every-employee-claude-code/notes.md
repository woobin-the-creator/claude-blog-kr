# Raw materials — DoorDash gave every employee Claude Code

- Video: https://youtu.be/hyqLNX3VExQ
- Title: "DoorDash gave every employee Claude Code" (Anthropic "Office Hours" interview)
- Channel: Claude · Upload: 2026-07-07 · Duration: 25:11 · Chapters: none
- Speakers: Boris Cherny (Head of Claude Code, interviewer) × Andy Fang (Co-founder, DoorDash)
- Format: two-person interview, no screen-shares/slides → text-only post (zero informational stills; all frames were talking heads)

## Global summary (Gemini, detailed)

Interview on DoorDash's shift to an AI-driven dev environment, practical Claude Code use, and the cultural shifts to maximize AI.

Main topics: AI fluency & adoption; the return of the "coding leader"; infra & security (internal "Flux" platform); org transformation (smaller autonomous full-stack teams); measuring success (from code throughput to customer-value speed).

Key timestamps (reliable spine):
- 00:10 Raising the AI floor (beyond "AI = just a chat"; connect to Gmail/Calendar/Slack)
- 01:49 Andy returns to shipping production code, first time since 2013
- 02:15 Goal: never write code manually, act as orchestrator
- 04:37 Leadership by example — every eng manager should ship production code with AI
- 05:12 Token budgets & investment to encourage experimentation
- 06:13 New bottleneck: writing → merging (CI/CD + reviews)
- 07:56 Security first — non-negotiable
- 10:08 The "Flux" platform (secure Claude sessions + AI code-review agents)
- 11:00 Empowering designers/PMs to ship code
- 11:55 4 engineers × a quarter → 1 person × 3 weeks
- 13:02 Agent-friendly codebases (architectural principles in markdown)
- 16:07 Rise of generalists (full-stack; less need for deep niche experts)
- 19:10 Measuring ROI — deliver customer value 3–5x faster
- 20:44 Identifying AI champions organically (Sales, Marketing, …)

## Topic inventory (full, order)

Milestone raising AI fluency; Andy's coding journey + childhood camp (age 9); evolution since 2013 (Stanford dorm); current setup (terminal vs desktop); managing multiple sessions & worktrees; model inflection points & first experiments; unlearning affinity for manual systems; challenge for managers to ship production code; token budgets & investing in agents; anti-pattern: mental tax of context switching; Flux platform & AI code-review agents; security vulnerabilities & AI detection; IT security review & procurement; adoption curve & throughput; caveat: balancing freedom with security guardrails; identifying AI champions & internal artifacts; Q&A: identifying engineering blockers (product/design reviews); closing advice for leaders and new grads.

## Detail checklist (merged, by speaker)

Andy:
- Goal was to raise the FLOOR of AI fluency across the whole company, not just top performers.
- Many people (incl. executives) still see AI as "just a chat"; excitement comes when they connect it to Gmail/Google Calendar/Slack → knowledge workers much more efficient.
- Non-engineers took off with Claude Code — using terminal, coding, shipping projects.
- First exposure to coding at age 9 via a camp originally meant for his brother.
- In 2013 wrote all of DoorDash's code from a Stanford dorm; stopped coding as company scaled.
- Claude Code let him ship production code into the DoorDash codebase again.
- Uses terminal or the desktop app; personal goal: don't write code manually, let the agent write everything (orchestrator).
- Runs multiple sessions via multiple repos + git worktrees to avoid conflicts.
- First Claude Code attempt to ship a production feature (no asking anyone) failed — agent couldn't configure his local environment.
- Retried the same failed experiment in early 2026 → worked perfectly (better model).
- Has shipped production code in FIVE different languages using Claude.
- Hard to believe the power until you force yourself to play with the tools.
- Teams must "unlearn" strong affinity for things they built that currently work; reimagine setups & agents as capabilities change.
- Leaders should lean in and use the tools themselves.
- Every eng manager should set a goal to ship production code (not just a prototype); navigating the merge process reveals org hoops/bottlenecks firsthand.
- DoorDash provides token budgets + tools to encourage everyone to explore agents.
- High shipping volume → internal complaints about merge time; CI/CD needs overhaul; invested in AI code-review agents.
- Industry-wide security issues cropping up more; use AI to catch security issues before prod — a "cat and mouse game," humans must catch up as throughput rises.
- Claude Code first introduced to DoorDash in 2025; created a special fast-track procurement/review process for AI tools with IT security; real inflection late 2025/early 2026.
- Correlation between Claude Code adoption and team throughput.
- Get tools into hands fast; don't be overly stringent on budgets early; optimize for exploration.
- Security is non-negotiable; security teams should move fast with the industry to partner on new tools.
- Identify early adopters & success cases (projects or people) as advocates within teams.
- Emphasize written artifacts to share learnings company-wide; each team needs its own channels/forums.
- Showcase FAILURES as much as wins (e.g., an integration that wasted tokens) so others learn.
- Automation must make dev as frictionless as possible.
- Built Flux — internal platform providing cloud VMs; hosts security-cleared Claude sessions with the right tool access; AI code-review agents use the Agent SDK + Claude models on Flux.
- Set goal for designers to ship production code → they think about being embedded in the dev process; best teams have designers & PMs embedded in the cycle using Claude.
- Challenged the team to complete projects in 3x–5x less time; massive constraints reveal true challenges.
- Standardize skills across a team so everyone benefits from the most prolific people.
- One engineer did a migration in 3 weeks that historically took 4 engineers a full quarter; AI shaved launch timelines for massive products by more than half.
- Hand-picks specific teams to dive deep; smaller teams (3–5) are a great accelerant — individuals own entire domains, less coordination.
- Upfront investment in an "agent-friendly" codebase pays off; a tech lead documented 50+ architectural principles in markdown for agents to reference while coding.
- Standardized mobile dev "skills" for agents (simulator setup, workflow testing).
- Standard review processes (product/design/ship) have become major friction; questions the continued necessity of traditional product reviews.
- New workflow: engineers deliver a "workable state" UI, designers polish it self-sufficiently.
- AI-forward teams should use less process, fewer design docs, fewer reviews.
- AI reduces need for deep domain expertise in every member → favors generalists; encourages mobile engineers to become full-stack.
- Specialist experts (e.g., iOS architecture) still needed as gatekeepers & agent builders for hard problems (memory, latency).
- Recommends VP-level sponsorship for small teams so they feel safe reimagining their work.
- Measures Engineering ROI via directional code throughput and project-delivery speed.
- Identifies "AI Champions" in non-technical domains (Sales, Marketing) to find domain-specific pain points; e.g. AI helps Sales streamline manual Quarterly Business Reviews for tens of thousands of merchants.
- Knowledge-work ROI: raise the task-completion baseline and automate department workflows.
- Ultimate success metric: deliver customer value faster.
- Finds AI-capable talent by giving tools and seeing who picks them up with enthusiasm.
- Warns leaders: workflow changes can cause an "identity crisis" for engineers tied to manual coding.
- Written artifacts from human teams double as training/reference data for AI agents.
- Advice to new grads: stay curious, play with the tools; use your "native" AI understanding to surprise employers.

Boris:
- Major inflection point in the latest models' ability to figure things out.
- Before LLMs, retrying failed ideas was "dysfunctional"; now retrying an old idea on a newer model months later often works.
- Prototyping/building is faster and more fun with AI; prioritize the result/value over the act of writing code.
- Running many agents → constant, mentally taxing context switching.
- Improving speed = breaking down successive bottlenecks one at a time.
- Balance freedom to explore with the right guardrails (security non-negotiable).
- Engineering speed is now the limiting factor, forcing a rethink of all other processes.

## Selected verbatim quotes (≤15 words)

- Andy (~00:15): "Raise the floor in terms of the AI fluency of our company."
- Boris (~04:05): "Trying just that same exact idea with a newer model, sometimes it just works."
- Andy (~04:37): "Every engineering manager, you should try to set a goal to ship production code."
- Andy (adoption): "Give the tools to the people and see who the early adopters are."
- Andy (~11:55): "Try to get projects done in three to five X less time using AI."
- Andy (generalists): "You don't necessarily need everybody to be a domain expert."
- Boris: "The limiting factor used to be the speed of coding."
- Andy (closing): "Stay curious, play around with the tools."
