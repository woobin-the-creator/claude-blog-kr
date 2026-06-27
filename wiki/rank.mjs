#!/usr/bin/env node
/* LLM Wiki — rank (선호 기반 검색/큐레이션 엔진)
 *
 * profile.json(취향 집계) + 글 카탈로그(posts/assets/posts.js)를 읽어, 후보 글을
 * 내 취향 점수로 재랭킹한다. "내가 좋아할 만한 글 가져와"의 결정론적 코어.
 * (Pistis-RAG 식 preference-aligned reranking 의 경량판.)
 *
 * 쿼리 워크플로우(wiki/CLAUDE.md)는: ① rank.mjs 로 후보를 점수순 정렬 →
 * ② profile.md 의 "해석/패턴"을 근거로 LLM 이 상위 후보를 골라 이유와 함께 제시.
 *
 * 사용: node wiki/rank.mjs ["키워드"] [--all] [--limit N]
 *   기본은 아직 평가 안 한 글만 후보로(추천). --all 이면 평가한 글도 포함.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WIKI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(WIKI, "..");

export function loadCatalog(postsJsPath = path.join(ROOT, "posts/assets/posts.js")) {
  const src = fs.readFileSync(postsJsPath, "utf8");
  const win = {};
  const fn = new Function("window", src);
  fn(win);
  return win.CBK_POSTS || [];
}

export function loadProfile(profilePath = path.join(WIKI, "profile.json")) {
  return JSON.parse(fs.readFileSync(profilePath, "utf8"));
}

function asMap(arr) { const m = {}; for (const o of arr) m[o.key] = o; return m; }

/* score in roughly [-1, +1]. cat(주제) 우선, main(출처) 보조. 표본이 적으면 약화. */
export function scorePost(post, profile) {
  const cat = asMap(profile.byCat), main = asMap(profile.byMain);
  const c = cat[post.cat], m = main[post.main];
  // confidence: 표본 1건이면 0.6, 2건 0.8, 3+건 1.0 로 가중
  const conf = o => o ? Math.min(1, 0.4 + 0.2 * o.n) : 0;
  const cTerm = c ? c.score * conf(c) : 0;
  const mTerm = m ? m.score * conf(m) : 0;
  const score = 0.7 * cTerm + 0.3 * mTerm;
  const why = [];
  if (c) why.push(`주제 '${post.cat}' ${c.net >= 0 ? "선호" : "회피"}(net ${c.net >= 0 ? "+" : ""}${c.net})`);
  if (m) why.push(`출처 '${post.main}' ${m.net >= 0 ? "선호" : "회피"}(net ${m.net >= 0 ? "+" : ""}${m.net})`);
  return { score, why };
}

export function rank({ query = "", includeRated = false, limit = 0 } = {}) {
  const profile = loadProfile();
  const rated = new Set(profile.rated_slugs || []);
  const q = query.trim().toLowerCase();
  let cands = loadCatalog().map(p => ({ ...p, slug: p.file.replace(/\.html$/, "") }));
  if (!includeRated) cands = cands.filter(p => !rated.has(p.slug));
  if (q) cands = cands.filter(p => (p.title + " " + p.cat + " " + p.main).toLowerCase().includes(q));
  const scored = cands.map(p => {
    const s = scorePost(p, profile);
    return { slug: p.slug, title: p.title, cat: p.cat, main: p.main, score: s.score, why: s.why };
  }).sort((a, b) => b.score - a.score);
  return limit > 0 ? scored.slice(0, limit) : scored;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const includeRated = args.includes("--all");
  const li = args.indexOf("--limit"); const limit = li > -1 ? parseInt(args[li + 1], 10) : 5;
  const query = args.filter(a => !a.startsWith("--") && a !== (li > -1 ? args[li + 1] : null)).join(" ");
  const res = rank({ query, includeRated, limit });
  console.log(`\n추천 후보 (query=${query || "전체"}, ${includeRated ? "평가글 포함" : "미평가만"}):\n`);
  res.forEach((r, i) => {
    console.log(`${i + 1}. [${r.score >= 0 ? "+" : ""}${r.score.toFixed(2)}] ${r.title}`);
    console.log(`     ${r.cat} · ${r.main} — ${r.why.join("; ") || "프로필 정보 없음"}`);
  });
  console.log("");
}
