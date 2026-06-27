import { ingest, tally, loadRaw, topicId } from "../wiki/ingest.mjs";
import { rank, scorePost, loadProfile, loadCatalog } from "../wiki/rank.mjs";

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } };
const eq = (n, a, b) => ok(`${n} (got ${JSON.stringify(a)})`, JSON.stringify(a) === JSON.stringify(b));

// fresh ingest (deterministic timestamp)
const { records, profile } = ingest();

// 1) counts
eq("ingest rated count", records.length, 11);
eq("likes", profile.likes, 6);
eq("dislikes", profile.dislikes, 5);

// 2) tallies
const cat = Object.fromEntries(profile.byCat.map(c => [c.key, c]));
eq("Claude Code net", cat["Claude Code"].net, 4);
eq("Enterprise AI net", cat["Enterprise AI"].net, -3);
eq("Product announcements net", cat["Product announcements"].net, -2);
eq("역량·커리어 net", cat["역량·커리어"].net, 1);
ok("byCat sorted by net desc", profile.byCat.every((c, i, a) => i === 0 || a[i - 1].net >= c.net));

// 3) topicId mapping stable & filename-safe
eq("topicId 해커톤", topicId("Claude Code · 해커톤"), "Claude-Code-해커톤");
eq("topicId 역량", topicId("역량·커리어"), "역량-커리어");

// 4) scorePost: liked cat positive, disliked cat negative
const prof = loadProfile();
const sLiked = scorePost({ cat: "Claude Code", main: "Claude Code Docs" }, prof);
const sDisliked = scorePost({ cat: "Product announcements", main: "Claude blog" }, prof);
ok("liked-cat post scores positive", sLiked.score > 0);
ok("disliked-cat post scores negative", sDisliked.score < 0);
ok("liked > disliked", sLiked.score > sDisliked.score);

// 5) rank: unrated recommendation ordering
const recs = rank({ limit: 0 }); // unrated only
const idx = slug => recs.findIndex(r => r.slug === slug);
ok("해커톤(liked cat) ranked above artifacts(disliked cat)",
   idx("opus-4-7-hackathon-winners") < idx("artifacts-in-claude-code"));
ok("해커톤 ranked above Product-announcement post",
   idx("opus-4-7-hackathon-winners") < idx("whats-new-in-claude-managed-agents"));
ok("rank excludes already-rated posts by default",
   !recs.some(r => profile.rated_slugs.includes(r.slug)));
ok("rank scores are monotonically non-increasing",
   recs.every((r, i, a) => i === 0 || a[i - 1].score >= r.score));

// 6) query filter
const q = rank({ query: "해커톤", includeRated: true });
ok("query '해커톤' returns only matching", q.length > 0 && q.every(r => /해커톤/.test(r.title)));

// 7) every rated slug exists in the real catalog (no typos in sample)
const catalogSlugs = new Set(loadCatalog().map(p => p.file.replace(/\.html$/, "")));
ok("all rated slugs exist in catalog", records.every(r => catalogSlugs.has(r.slug)));

console.log(`\n=== wiki (Phase B): ${pass} passed, ${fail} failed ===`);
process.exit(fail ? 1 : 0);
