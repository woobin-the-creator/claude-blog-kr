#!/usr/bin/env node
/* LLM Wiki — ingest (결정론 레이어)
 *
 * raw/*.json (store.js exportWiki 산출물: {slug,title,main,cat,date,rating,reason,bookmarked,rated_at})
 * 을 읽어 구조 신호를 위키로 컴파일한다:
 *   sources/<slug>.md   글 1건 = 평가 + 이유 (frontmatter)
 *   topics/<cat>.md     주제별 좋아요/싫어요 묶음
 *   profile.json        머신용 취향 집계 (rank.mjs 가 읽음)
 *   profile.md          사람/LLM용 프로필 (서사는 LLM 이 덧씀)
 *   index.md            전체 페이지 카탈로그
 *   log.md              append-only 인제스트 로그
 *
 * 서사(왜 좋아하는지의 해석·패턴)는 LLM 레이어가 profile.md 에 덧쓴다. 이 스크립트는
 * "장부(bookkeeping)"만 담당한다 — Karpathy LLM Wiki 패턴을 구조화 데이터에 맞게 적응.
 *
 * 사용: node wiki/ingest.mjs [--at <ISO timestamp>]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WIKI = path.dirname(fileURLToPath(import.meta.url));
const argAt = (() => { const i = process.argv.indexOf("--at"); return i > -1 ? process.argv[i + 1] : null; })();
const NOW = argAt || new Date().toISOString();

export function topicId(cat) {
  return String(cat).replace(/[·/\\:*?"<>|]/g, " ").trim().replace(/\s+/g, "-") || "기타";
}
function esc(s) { return String(s == null ? "" : s); }
function fm(obj) {
  return "---\n" + Object.entries(obj).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n") + "\n---\n";
}

export function loadRaw(dir = path.join(WIKI, "raw")) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".json")) : [];
  const bySlug = new Map();
  for (const f of files) {
    let arr;
    try { arr = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch { continue; }
    if (!Array.isArray(arr)) continue;
    for (const r of arr) {
      if (!r || !r.slug || (r.rating !== 1 && r.rating !== -1)) continue; // rating 필수
      const prev = bySlug.get(r.slug);
      if (!prev || String(r.rated_at || "") >= String(prev.rated_at || "")) bySlug.set(r.slug, r);
    }
  }
  return [...bySlug.values()].sort((a, b) => String(b.rated_at || "").localeCompare(String(a.rated_at || "")));
}

export function tally(records) {
  const byCat = {}, byMain = {};
  const bump = (m, key, rating) => {
    if (!key) return;
    m[key] = m[key] || { key, likes: 0, dislikes: 0 };
    if (rating === 1) m[key].likes++; else m[key].dislikes++;
  };
  for (const r of records) { bump(byCat, r.cat, r.rating); bump(byMain, r.main, r.rating); }
  const finish = (m) => Object.values(m).map(o => ({
    ...o, n: o.likes + o.dislikes, net: o.likes - o.dislikes,
    score: (o.likes - o.dislikes) / (o.likes + o.dislikes)   // -1..+1
  })).sort((a, b) => b.net - a.net || b.n - a.n);
  return { byCat: finish(byCat), byMain: finish(byMain) };
}

function writeFile(rel, content) {
  const p = path.join(WIKI, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return rel;
}

export function ingest() {
  const records = loadRaw();
  const t = tally(records);
  const written = [];

  // ---- source pages ----
  for (const r of records) {
    const tid = topicId(r.cat);
    const body =
      fm({ type: "source", slug: r.slug, title: r.title, main: r.main, cat: r.cat,
           date: r.date, rating: r.rating, bookmarked: !!r.bookmarked, rated_at: r.rated_at }) +
      `\n# ${esc(r.title)}\n\n` +
      `- 평가: **${r.rating === 1 ? "👍 좋아요" : "👎 싫어요"}**\n` +
      `- 출처(main): ${esc(r.main)} · 주제(cat): [[topics/${tid}]]\n` +
      `- 날짜: ${esc(r.date)}${r.bookmarked ? " · ⭐ 즐겨찾기" : ""}\n\n` +
      `## 이유\n${esc(r.reason) || "_(이유 없음)_"}\n\n` +
      `## 원문\nposts/${r.slug}.html\n\n` +
      `관련: [[profile]] · [[index]]\n`;
    written.push(writeFile(`sources/${r.slug}.md`, body));
  }

  // ---- topic pages ----
  const catGroups = {};
  for (const r of records) { (catGroups[r.cat] = catGroups[r.cat] || []).push(r); }
  for (const [cat, rs] of Object.entries(catGroups)) {
    const tid = topicId(cat);
    const likes = rs.filter(r => r.rating === 1), dis = rs.filter(r => r.rating === -1);
    const line = r => `- [[sources/${r.slug}]] — ${esc(r.reason)}`;
    const body =
      fm({ type: "topic", cat, topic_id: tid,
           likes: likes.length, dislikes: dis.length, net: likes.length - dis.length }) +
      `\n# 주제: ${esc(cat)}\n\n` +
      `좋아요 ${likes.length} · 싫어요 ${dis.length} · net ${likes.length - dis.length}\n\n` +
      `## 👍 좋아한 글\n${likes.length ? likes.map(line).join("\n") : "_(없음)_"}\n\n` +
      `## 👎 별로였던 글\n${dis.length ? dis.map(line).join("\n") : "_(없음)_"}\n\n` +
      `관련: [[profile]] · [[index]]\n`;
    written.push(writeFile(`topics/${tid}.md`, body));
  }

  // ---- profile.json (machine, for rank.mjs) ----
  const profile = {
    generated_at: NOW,
    total: records.length,
    likes: records.filter(r => r.rating === 1).length,
    dislikes: records.filter(r => r.rating === -1).length,
    byCat: t.byCat,
    byMain: t.byMain,
    rated_slugs: records.map(r => r.slug)
  };
  written.push(writeFile("profile.json", JSON.stringify(profile, null, 2) + "\n"));

  // ---- profile.md (human/LLM narrative scaffold) ----
  const catLine = c => `| ${esc(c.key)} | ${c.likes} | ${c.dislikes} | ${c.net >= 0 ? "+" : ""}${c.net} | ${c.score.toFixed(2)} |`;
  const preferred = t.byCat.filter(c => c.net > 0).map(c => c.key);
  const avoided = t.byCat.filter(c => c.net < 0).map(c => c.key);
  // Preserve the LLM-authored "해석 · 패턴" section across re-ingests. Everything
  // from the NARR_MARKER onward is owned by the LLM, not this script.
  const NARR_MARKER = "## 해석 · 패턴 (LLM 작성)";
  const DEFAULT_NARR = NARR_MARKER + "\n" +
    `<!-- LLM: 이유(reason)들을 읽고 "왜" 이런 선호가 생겼는지, 반복되는 속성(예: 구체성·실전성)을\n` +
    `     2~4줄로 적는다. 쿼리 재랭킹의 근거가 된다. -->\n`;
  let narrative = DEFAULT_NARR;
  const profMdPath = path.join(WIKI, "profile.md");
  if (fs.existsSync(profMdPath)) {
    const old = fs.readFileSync(profMdPath, "utf8");
    const i = old.indexOf(NARR_MARKER);
    if (i > -1) narrative = old.slice(i).trimEnd() + "\n";
  }
  const profileMd =
    fm({ type: "profile", generated_at: NOW, total: records.length }) +
    `\n# 내 취향 프로필\n\n` +
    `> 구조 집계는 \`ingest.mjs\`가 생성(재실행 시 갱신). **해석/패턴** 절은 LLM이 소유하며 보존된다.\n\n` +
    `평가한 글 ${records.length} (👍 ${profile.likes} · 👎 ${profile.dislikes})\n\n` +
    `## 주제(cat)별 선호\n\n| 주제 | 👍 | 👎 | net | score |\n|---|---|---|---|---|\n` +
    t.byCat.map(catLine).join("\n") + "\n\n" +
    `## 출처(main)별 선호\n\n| 출처 | 👍 | 👎 | net | score |\n|---|---|---|---|---|\n` +
    t.byMain.map(catLine).join("\n") + "\n\n" +
    `## 요약(자동)\n` +
    `- 선호 주제: ${preferred.length ? preferred.join(", ") : "_(없음)_"}\n` +
    `- 회피 주제: ${avoided.length ? avoided.join(", ") : "_(없음)_"}\n\n` +
    `관련: ${t.byCat.map(c => `[[topics/${topicId(c.key)}]]`).join(" · ")} · [[index]]\n\n` +
    narrative;
  written.push(writeFile("profile.md", profileMd));

  // ---- index.md ----
  const idx =
    fm({ type: "index", generated_at: NOW, pages: written.length + 1 }) +
    `\n# 위키 인덱스\n\n항상 컨텍스트에 두는 카탈로그. 쿼리는 여기서 후보를 찾는다.\n\n` +
    `## 핵심\n- [[profile]] — 내 취향 프로필 (선호/회피 주제)\n\n` +
    `## 주제 (topics/)\n` +
    t.byCat.map(c => `- [[topics/${topicId(c.key)}]] — 👍${c.likes}/👎${c.dislikes} (net ${c.net >= 0 ? "+" : ""}${c.net})`).join("\n") + "\n\n" +
    `## 글 (sources/)\n` +
    records.map(r => `- [[sources/${r.slug}]] — ${r.rating === 1 ? "👍" : "👎"} ${esc(r.title)}`).join("\n") + "\n";
  written.push(writeFile("index.md", idx));

  // ---- log.md (append) ----
  const logPath = path.join(WIKI, "log.md");
  const head = fs.existsSync(logPath) ? "" : "# 인제스트 로그\n\n";
  fs.appendFileSync(logPath, head +
    `## [${NOW}] ingest | ${records.length} rated (👍${profile.likes}/👎${profile.dislikes}) → ${written.length} pages\n`);

  return { records, profile, written };
}

// run when invoked directly
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { records, written } = ingest();
  console.log(`ingested ${records.length} rated posts → ${written.length} pages`);
}
