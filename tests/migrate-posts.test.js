const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }

(async () => {
  const mod = await import(ROOT + "/scripts/migrate-posts.mjs");
  const { extractPost, absolutizeAssets, loadCatalog } = mod;
  const PAGES = "https://woobin-the-creator.github.io/claude-blog-kr";

  // --- absolutizeAssets ---
  const rewritten = absolutizeAssets('<img src="assets/my-slug/hero.png"><a href="https://x.test/a">x</a>', "my-slug", PAGES);
  ok("relative asset src becomes an absolute Pages URL",
     rewritten.includes('src="' + PAGES + '/posts/assets/my-slug/hero.png"'));
  ok("external links are left alone", rewritten.includes('href="https://x.test/a"'));
  const already = absolutizeAssets('<img src="' + PAGES + '/posts/assets/s/a.png">', "s", PAGES);
  ok("absolutizing twice is a no-op", already === '<img src="' + PAGES + '/posts/assets/s/a.png">');

  // --- catalog loads from the real posts.js ---
  const catalog = loadCatalog(ROOT + "/posts/assets/posts.js");
  ok("catalog has 79 entries", catalog.length === 79);
  ok("catalog entries carry file/date/main/cat/title/nav",
     catalog.every(e => e.file && e.date && e.main && e.cat && e.title && e.nav));

  // --- extractPost against every real post: lossless and script-free ---
  let bad = [];
  for (const entry of catalog) {
    const file = ROOT + "/posts/" + entry.file;
    if (!fs.existsSync(file)) { bad.push(entry.file + " missing"); continue; }
    const row = extractPost(fs.readFileSync(file, "utf8"), entry, PAGES);
    if (!row.body_html || row.body_html.length < 200) bad.push(entry.file + " body too short");
    if (/<script/i.test(row.body_html)) bad.push(entry.file + " body still has <script>");
    if (/<\/?body/i.test(row.body_html)) bad.push(entry.file + " body still has <body>");
    if (!row.style_css || row.style_css.length < 100) bad.push(entry.file + " style missing");
    if (/<style/i.test(row.style_css)) bad.push(entry.file + " style_css kept its tag");
    if (/src="assets\//.test(row.body_html)) bad.push(entry.file + " relative asset left");
    if (row.author !== "ai") bad.push(entry.file + " author should be ai");
    if (row.slug !== entry.file.replace(/\.html$/, "")) bad.push(entry.file + " slug mismatch");
  }
  ok("all 79 posts extract cleanly" + (bad.length ? " — " + bad.slice(0, 5).join("; ") : ""), bad.length === 0);

  // --- the header (title/meta) survives, since the renderer does not re-add it ---
  const one = catalog.find(e => e.file === "artifacts-in-claude-code.html");
  const row = extractPost(fs.readFileSync(ROOT + "/posts/" + one.file, "utf8"), one, PAGES);
  ok("body keeps its <header>", /<header>/.test(row.body_html));
  ok("body keeps its <footer>", /<footer>/.test(row.body_html));
  ok("body_md is null for migrated translations", row.body_md === null);

  // --- --dry 는 절대 네트워크를 건드리지 않는다 ---
  // 사람이 승인하는 STOP AND ASK 가 이 보장 위에 서 있다. Task 8 이 이 파일을
  // import 하므로, 여기서 회귀하면 사람 승인 없이 실서비스에 쓰게 된다.
  let fetchCalls = 0;
  const realFetch = globalThis.fetch;
  const realArgv = process.argv;
  const realWrite = process.stdout.write.bind(process.stdout);
  const realErr = console.error;
  let ndjsonLines = 0;
  globalThis.fetch = function () { fetchCalls++; return Promise.reject(new Error("--dry must not fetch")); };
  process.argv = [realArgv[0], ROOT + "/scripts/migrate-posts.mjs", "--dry"];
  process.stdout.write = function (chunk) { ndjsonLines += String(chunk).split("\n").length - 1; return true; };
  console.error = function () {};
  let dryErr = null;
  try { await mod.main(); } catch (e) { dryErr = e; }
  finally {
    globalThis.fetch = realFetch;
    process.argv = realArgv;
    process.stdout.write = realWrite;
    console.error = realErr;
  }
  ok("--dry runs without throwing" + (dryErr ? " — " + dryErr.message : ""), dryErr === null);
  ok("--dry never calls fetch", fetchCalls === 0);
  ok("--dry emits one NDJSON line per post", ndjsonLines === 79);

  console.log("migrate-posts: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
