#!/usr/bin/env node
/* LLM Wiki — lint (무결성 검증기)
 *
 * Karpathy 패턴의 lint 워크플로우를 결정론으로 자동화:
 *  - 끊긴 위키링크([[...]] → 없는 파일)
 *  - 평가된 글마다 source 페이지 존재
 *  - index/profile/profile.json 존재 + index가 모든 source·topic 링크
 *  - 고아 페이지(아무 데서도 링크 안 됨)
 *  - profile.json 집계가 raw 재계산과 일치
 *
 * 사용: node wiki/lint.mjs   (문제 있으면 exit 1)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRaw, tally, topicId } from "./ingest.mjs";

const WIKI = path.dirname(fileURLToPath(import.meta.url));
const issues = [];
const note = m => issues.push(m);

function allMd(dir = WIKI, base = "") {
  const out = [];
  for (const e of fs.readdirSync(path.join(dir), { withFileTypes: true })) {
    if (e.name === "raw" || e.name === "node_modules") continue;
    if (e.name === "CLAUDE.md") continue; // 운영 매뉴얼(예시 링크 포함) — 콘텐츠 페이지 아님
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...allMd(path.join(dir, e.name), rel));
    else if (e.name.endsWith(".md")) out.push(rel);
  }
  return out;
}

const mdFiles = allMd();
const mdSet = new Set(mdFiles.map(f => f.replace(/\.md$/, "")));

// 1) required files
for (const req of ["index.md", "profile.md", "profile.json"]) {
  if (!fs.existsSync(path.join(WIKI, req))) note(`필수 파일 누락: ${req}`);
}

// 2) wikilinks resolve + collect linked targets
const linked = new Set();
for (const f of mdFiles) {
  const txt = fs.readFileSync(path.join(WIKI, f), "utf8");
  const re = /\[\[([^\]]+)\]\]/g; let m;
  while ((m = re.exec(txt))) {
    const target = m[1].trim();
    linked.add(target);
    if (!mdSet.has(target)) note(`끊긴 위키링크: [[${target}]] (in ${f})`);
  }
}

// 3) every rated post has a source page; index links all sources & topics
const records = loadRaw();
const t = tally(records);
for (const r of records) {
  if (!mdSet.has(`sources/${r.slug}`)) note(`source 페이지 누락: sources/${r.slug}.md (평가된 글)`);
}
const indexTxt = fs.existsSync(path.join(WIKI, "index.md")) ? fs.readFileSync(path.join(WIKI, "index.md"), "utf8") : "";
for (const r of records) {
  if (!indexTxt.includes(`[[sources/${r.slug}]]`)) note(`index가 source 링크 안 함: sources/${r.slug}`);
}
for (const c of t.byCat) {
  if (!indexTxt.includes(`[[topics/${topicId(c.key)}]]`)) note(`index가 topic 링크 안 함: topics/${topicId(c.key)}`);
}

// 4) orphan pages (source/topic 페이지인데 아무도 링크 안 함). index/profile/log 는 허브라 제외.
for (const f of mdFiles) {
  const id = f.replace(/\.md$/, "");
  if (/^(index|profile|log)$/.test(id)) continue;
  if (!linked.has(id)) note(`고아 페이지(링크되지 않음): ${f}`);
}

// 5) profile.json 집계가 raw 재계산과 일치
if (fs.existsSync(path.join(WIKI, "profile.json"))) {
  const pj = JSON.parse(fs.readFileSync(path.join(WIKI, "profile.json"), "utf8"));
  if (pj.total !== records.length) note(`profile.total 불일치: ${pj.total} vs ${records.length}`);
  const recompLikes = records.filter(r => r.rating === 1).length;
  if (pj.likes !== recompLikes) note(`profile.likes 불일치: ${pj.likes} vs ${recompLikes}`);
  const catMap = Object.fromEntries(t.byCat.map(c => [c.key, c]));
  for (const c of (pj.byCat || [])) {
    const ref = catMap[c.key];
    if (!ref) { note(`profile.byCat에 없는 주제: ${c.key}`); continue; }
    if (c.net !== ref.net) note(`profile.byCat['${c.key}'].net 불일치: ${c.net} vs ${ref.net}`);
  }
  // rated_slugs 정확성
  const rs = new Set(pj.rated_slugs || []);
  for (const r of records) if (!rs.has(r.slug)) note(`profile.rated_slugs 누락: ${r.slug}`);
}

if (issues.length) {
  console.log(`✗ lint: ${issues.length} 문제\n` + issues.map(i => "  - " + i).join("\n"));
  process.exit(1);
} else {
  console.log(`✓ lint 통과 — ${mdFiles.length} 페이지, 끊긴 링크 0, 고아 0, profile 일치 (평가 ${records.length})`);
}
