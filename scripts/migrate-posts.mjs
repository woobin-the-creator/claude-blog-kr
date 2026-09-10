#!/usr/bin/env node
/* 기존 posts/*.html을 cbk_posts 로 이관한다. 이미 있는 글은 보존한다.
 *
 * 미디어(posts/assets/<slug>/, 79MB)는 옮기지 않는다 — GitHub Pages 에 그대로 두고
 * 본문의 상대 경로만 절대 URL 로 바꾼다.
 *
 *   node scripts/migrate-posts.mjs --dry        # 무엇이 올라갈지 NDJSON 으로 출력
 *   node scripts/migrate-posts.mjs   # Keychain/환경변수 인증으로 실제 이관
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { apiClient, loadManifest, localSecret, seedOwner } from "./supabase-admin.mjs";

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

/* src="assets/…" / href="assets/…" → Pages 절대 URL. 이미 절대면 건드리지 않는다.
 * slug 는 지금 쓰이지 않는다 — Task 8(publish.mjs) / Task 12(snapshot.mjs) 가
 * 이 시그니처로 호출하므로 호환을 위해 인자만 남겨둔다. */
export function absolutizeAssets(html, slug, pagesBase) {
  return html.replace(/(src|href|poster)="assets\//g, '$1="' + pagesBase + '/posts/assets/');
}

/* 한 파일 → 한 행. <body> 와 첫 <script 사이가 본문이다. */
export function extractPost(html, entry, pagesBase) {
  const slug = entry.file.replace(/\.html$/, "");

  const styleM = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i);
  const style_css = styleM ? styleM[1].trim() : "";

  const bodyStart = html.indexOf("<body>");
  if (bodyStart === -1) throw new Error(entry.file + " 에 <body> 가 없습니다");
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
export async function main() {
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
    console.error(rows.length + "건 준비 완료 (드라이런 — 아무것도 업로드하지 않았습니다)");
    return;
  }

  const manifest = loadManifest();
  const query = apiClient({ token: localSecret("SUPABASE_ACCESS_TOKEN"), projectRef: manifest.projectRef });
  await seedOwner(query, localSecret("CBK_SYNC_KEY"));
  const inserted = await importMissingPosts(query, rows);
  console.error("완료: " + inserted + "건 추가, " + (rows.length - inserted) + "건 기존 DB 내용 유지");
}

// 재실행·동시 발행 시에도 DB의 본문, 판본, 첨삭 상태를 덮어쓰지 않는다.
// 최초 삽입과 done 상태 기록은 한 문장으로 처리한다.
export async function importMissingPosts(query, posts) {
  const result = await query(`
    insert into public.cbk_posts
      (slug, title, nav, main, cat, date, body_html, body_md, style_css, author, review_status)
    select slug, title, nav, main, cat, date, body_html, body_md, style_css, author, 'done'
    from jsonb_to_recordset($1::jsonb) as p(
      slug text, title text, nav text, main text, cat text, date date,
      body_html text, body_md text, style_css text, author text)
    on conflict (slug) do nothing
    returning slug
  `, [JSON.stringify(posts)]);
  const inserted = Array.isArray(result) ? result : (result?.result || result?.data);
  if (!Array.isArray(inserted)) throw new Error("이관 결과 형식이 올바르지 않습니다");
  return inserted.length;
}

if (process.argv[1] && process.argv[1].endsWith("migrate-posts.mjs")) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
