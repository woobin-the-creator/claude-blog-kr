#!/usr/bin/env node
/* 기존 posts/*.html 79개를 cbk_posts 로 이관한다.
 *
 * 미디어(posts/assets/<slug>/, 79MB)는 옮기지 않는다 — GitHub Pages 에 그대로 두고
 * 본문의 상대 경로만 절대 URL 로 바꾼다.
 *
 *   node scripts/migrate-posts.mjs --dry        # 무엇이 올라갈지 NDJSON 으로 출력
 *   CBK_SYNC_KEY=... node scripts/migrate-posts.mjs   # 실제 업로드
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PAGES_BASE = "https://woobin-the-creator.github.io/claude-blog-kr";

/* posts.js 는 window.CBK_POSTS 를 세팅하는 IIFE 다. 정규식으로 뜯지 말고 실행한다. */
export function loadCatalog(file) {
  const src = fs.readFileSync(file, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.window.CBK_POSTS || [];
}

/* src="assets/…" / href="assets/…" → Pages 절대 URL. 이미 절대면 건드리지 않는다. */
export function absolutizeAssets(html, slug, pagesBase) {
  return html.replace(/(src|href|poster)="assets\//g, '$1="' + pagesBase + '/posts/assets/');
}

/* 한 파일 → 한 행. <body> 와 첫 <script 사이가 본문이다. */
export function extractPost(html, entry, pagesBase) {
  const slug = entry.file.replace(/\.html$/, "");

  const styleM = html.match(/<style>([\s\S]*?)<\/style>/i);
  const style_css = styleM ? styleM[1].trim() : "";

  const bodyStart = html.indexOf("<body>");
  if (bodyStart === -1) throw new Error("no <body> in " + entry.file);
  let body = html.slice(bodyStart + "<body>".length);

  const scriptAt = body.search(/<script\b/i);
  if (scriptAt !== -1) body = body.slice(0, scriptAt);
  body = body.replace(/<\/body>[\s\S]*$/i, "").trim();

  return {
    slug,
    title: entry.title,
    nav: entry.nav || entry.title,
    main: entry.main || "",
    cat: entry.cat || "",
    date: entry.date,
    body_html: absolutizeAssets(body, slug, pagesBase),
    style_css,
    body_md: null,          // 번역 이관분은 마크다운 원본이 없다
    author: "ai"
  };
}

/* ---- CLI ---- */
function cfg() {
  const src = fs.readFileSync(ROOT + "/posts/assets/cbk-config.js", "utf8");
  const url = (src.match(/supabaseUrl:\s*"([^"]*)"/) || [])[1];
  const key = (src.match(/supabaseAnonKey:\s*"([^"]*)"/) || [])[1];
  if (!url || !key) throw new Error("could not parse posts/assets/cbk-config.js");
  return { url: url.replace(/\/+$/, ""), key };
}

async function rpc(fn, body) {
  const c = cfg();
  const r = await fetch(c.url + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: { apikey: c.key, Authorization: "Bearer " + c.key, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error("RPC " + fn + " " + r.status + ": " + (await r.text()));
  return r.status === 204 ? null : r.json();
}

async function main() {
  const dry = process.argv.includes("--dry");
  const catalog = loadCatalog(ROOT + "/posts/assets/posts.js");
  const rows = catalog.map(e =>
    extractPost(fs.readFileSync(ROOT + "/posts/" + e.file, "utf8"), e, PAGES_BASE));

  if (dry) {
    for (const r of rows) {
      process.stdout.write(JSON.stringify({
        slug: r.slug, title: r.title, date: r.date, main: r.main, cat: r.cat,
        body_bytes: r.body_html.length, style_bytes: r.style_css.length
      }) + "\n");
    }
    console.error(rows.length + " posts ready (dry run, nothing uploaded)");
    return;
  }

  const key = process.env.CBK_SYNC_KEY;
  if (!key) { console.error("CBK_SYNC_KEY 가 없습니다"); process.exit(1); }
  await rpc("cbk_owner_claim", { p_key: key });

  let n = 0;
  for (const r of rows) {
    await rpc("cbk_post_upsert", {
      p_key: key, p_slug: r.slug, p_title: r.title, p_nav: r.nav,
      p_main: r.main, p_cat: r.cat, p_date: r.date,
      p_body_html: r.body_html, p_body_md: r.body_md,
      p_style_css: r.style_css, p_author: r.author
    });
    n++;
    console.error("[" + n + "/" + rows.length + "] " + r.slug);
  }
  // 이관분은 이미 검수된 번역이라 첨삭 대상이 아니다. pending 을 전부 내린다.
  for (const r of rows) {
    await rpc("cbk_review_finish", { p_key: key, p_slug: r.slug, p_status: "done", p_error: null });
  }
  console.error("done: " + n + " posts");
}

if (process.argv[1] && process.argv[1].endsWith("migrate-posts.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
