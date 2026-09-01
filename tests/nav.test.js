const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const storeSrc = fs.readFileSync(ROOT + "/posts/assets/store.js", "utf8");
const navSrc = fs.readFileSync(ROOT + "/posts/assets/nav.js", "utf8");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
function eq(n, a, b) { ok(n + " (got " + JSON.stringify(a) + ")", JSON.stringify(a) === JSON.stringify(b)); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const html = '<!doctype html><html><head></head><body><header><h1>글</h1></header><div class="content">본문</div></body></html>';
  const dom = new JSDOM(html, { url: "https://x.test/posts/ai-era-durable-skills.html", runScripts: "dangerously" });
  const w = dom.window;
  w.URL.createObjectURL = () => "blob:stub"; w.URL.revokeObjectURL = () => {};
  w.CBK_POSTS = [
    { file: "ai-era-durable-skills.html", slug: "ai-era-durable-skills", date: "2026-06-26", main: "AI 인사이트", cat: "역량·커리어", title: "RAG는 죽지 않았다", nav: "내구성 역량" },
    { file: "opus46.html", slug: "opus46", date: "2026-05-01", main: "제품", cat: "모델", title: "Opus 4.6", nav: "Opus 4.6" }
  ];
  w.CBK_postBySlug = (k) => w.CBK_POSTS.find(p => p.file === k || p.slug === String(k).replace(/\.html$/, "")) || null;
  w.CBK_onCatalog = (fn) => fn(w.CBK_POSTS);
  w.CBK_currentSlug = () => "ai-era-durable-skills";

  // load store then nav
  for (const src of [storeSrc, navSrc]) {
    const s = w.document.createElement("script"); s.textContent = src; w.document.body.appendChild(s);
  }

  const doc = w.document;
  // bar injected?
  ok("cbk-bar injected", !!doc.querySelector(".cbk-bar"));
  const like = doc.getElementById("cbk-like");
  const dislike = doc.getElementById("cbk-dislike");
  const reasonWrap = doc.getElementById("cbk-reason-wrap");
  const reasonTa = doc.getElementById("cbk-reason");
  ok("like btn present", !!like);
  ok("dislike btn present", !!dislike);
  ok("reason wrap hidden initially", reasonWrap.hidden === true);

  const slug = "ai-era-durable-skills";

  // click like
  like.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  eq("after like → rating 1", w.CBK.getRating(slug), 1);
  ok("like btn on", like.classList.contains("on"));
  ok("reason wrap shown after rating", reasonWrap.hidden === false);

  // type a reason
  reasonTa.value = "사례가 구체적이라 바로 적용 가능";
  reasonTa.dispatchEvent(new w.Event("input", { bubbles: true }));
  await sleep(650);
  eq("reason autosaved", w.CBK.getReason(slug), "사례가 구체적이라 바로 적용 가능");

  // click like again → neutral, wrap collapses, reason preserved
  like.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  eq("toggle like off → neutral", w.CBK.getRating(slug), 0);
  ok("like btn off", !like.classList.contains("on"));
  ok("reason wrap hidden again", reasonWrap.hidden === true);
  eq("reason preserved after neutral", w.CBK.getReason(slug), "사례가 구체적이라 바로 적용 가능");

  // click dislike
  dislike.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  eq("after dislike → -1", w.CBK.getRating(slug), -1);
  ok("dislike btn on", dislike.classList.contains("on"));
  ok("like btn off while dislike on", !like.classList.contains("on"));

  // switch to like (mutual exclusion)
  like.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  eq("switch dislike→like", w.CBK.getRating(slug), 1);
  ok("dislike off after switching to like", !dislike.classList.contains("on"));

  // persistence: a fresh nav load should reflect saved state
  const dom2 = new JSDOM(html, { url: "https://x.test/posts/ai-era-durable-skills.html", runScripts: "dangerously" });
  const w2 = dom2.window;
  w2.URL.createObjectURL = () => "x"; w2.URL.revokeObjectURL = () => {};
  w2.CBK_POSTS = w.CBK_POSTS; w2.CBK_postBySlug = w.CBK_postBySlug;
  w2.CBK_onCatalog = (fn) => fn(w2.CBK_POSTS);
  w2.CBK_currentSlug = () => "ai-era-durable-skills";   // dom2 의 URL 과 같은 글이어야 저장된 평가가 복원된다
  w2.localStorage.setItem("cbk:data:v1", w.localStorage.getItem("cbk:data:v1"));
  for (const src of [storeSrc, navSrc]) { const s = w2.document.createElement("script"); s.textContent = src; w2.document.body.appendChild(s); }
  ok("reload: like reflects saved rating", w2.document.getElementById("cbk-like").classList.contains("on"));
  ok("reload: reason box open (has reason)", w2.document.getElementById("cbk-reason-wrap").hidden === false);
  eq("reload: reason text restored", w2.document.getElementById("cbk-reason").value, "사례가 구체적이라 바로 적용 가능");

  // --- 루트에서 서빙될 때(post.html / 404.html) 링크가 사이트 밖을 가리키지 않는다 ---
  // nav.js 는 원래 posts/ 안에서만 돌던 파일이라 "../index.html", "../library.html",
  // "assets/cbk.css" 가 하드코딩돼 있었다. post.html 은 저장소 루트에서 서빙되므로
  // 그대로 두면 전부 깨진다. CBK_AT_ROOT / CBK_ASSET_BASE 로 접두사를 바꾼다.
  async function bootNav(atRoot, url, assetBase, siteBase) {
    const d = new JSDOM(html, { url, runScripts: "dangerously" });
    const win = d.window;
    win.URL.createObjectURL = () => "x"; win.URL.revokeObjectURL = () => {};
    if (atRoot) {
      win.CBK_AT_ROOT = true;
      win.CBK_ASSET_BASE = assetBase;
      if (siteBase) win.CBK_SITE_BASE = siteBase;   // 404.html 만 세팅한다
    }
    win.CBK_POSTS = w.CBK_POSTS; win.CBK_postBySlug = w.CBK_postBySlug;
    win.CBK_onCatalog = (fn) => fn(win.CBK_POSTS);
    win.CBK_currentSlug = () => "ai-era-durable-skills";
    for (const src of [storeSrc, navSrc]) {
      const s = win.document.createElement("script"); s.textContent = src; win.document.body.appendChild(s);
    }
    return win.document;
  }
  const href = (d, sel) => (d.querySelector(sel) || {}).getAttribute
    ? d.querySelector(sel).getAttribute("href") : null;

  const inPosts = await bootNav(false, "https://x.test/posts/ai-era-durable-skills.html");
  eq("posts/: brand link unchanged", href(inPosts, ".nav-brand"), "../index.html");
  eq("posts/: library link unchanged", href(inPosts, ".nav-library"), "../library.html");
  eq("posts/: sidebar link is the bare filename", href(inPosts, "#site-nav ul a"), "ai-era-durable-skills.html");
  eq("posts/: stylesheet path unchanged",
     href(inPosts, 'link[rel="stylesheet"]'), "assets/cbk.css");

  const atRoot = await bootNav(true, "https://x.test/post.html?slug=ai-era-durable-skills", "posts/");
  eq("root: brand link stays inside the site", href(atRoot, ".nav-brand"), "index.html");
  eq("root: library link stays inside the site", href(atRoot, ".nav-library"), "library.html");
  eq("root: sidebar links go through post.html",
     href(atRoot, "#site-nav ul a"), "post.html?slug=ai-era-durable-skills");
  eq("root: stylesheet resolves under posts/",
     href(atRoot, 'link[rel="stylesheet"]'), "posts/assets/cbk.css");
  eq("root: breadcrumb link stays inside the site",
     href(atRoot, ".post-crumb a"), "index.html#m=" + encodeURIComponent("AI 인사이트"));

  // 404.html 은 GitHub Pages 가 /claude-blog-kr/posts/<slug>.html 주소를 그대로 둔 채
  // 돌려주는 파일이다. 여기서 BASE 를 "" 로 두면 index.html 이
  // /claude-blog-kr/posts/index.html 로 풀려 또 404 로 떨어지고, 그 404 는 slug
  // "index" 로 렌더를 시도해 "글을 찾을 수 없습니다: index" 를 띄운다 —
  // 옛 북마크로 들어온 방문자가 사이트 밖으로 나갈 길이 없어진다.
  // 그래서 CBK_AT_ROOT(어디서 서빙되나)와 CBK_SITE_BASE(링크 기준이 어디냐)를 분리한다.
  const at404 = await bootNav(true, "https://x.test/claude-blog-kr/posts/opus46.html",
                              "/claude-blog-kr/posts/", "/claude-blog-kr/");
  eq("404 fallback: stylesheet uses the absolute Pages base",
     href(at404, 'link[rel="stylesheet"]'), "/claude-blog-kr/posts/assets/cbk.css");
  eq("404 fallback: brand link goes to the site root, not /posts/index.html",
     href(at404, ".nav-brand"), "/claude-blog-kr/index.html");
  eq("404 fallback: home link goes to the site root",
     href(at404, ".nav-home"), "/claude-blog-kr/index.html");
  eq("404 fallback: library link goes to the site root",
     href(at404, ".nav-library"), "/claude-blog-kr/library.html");
  eq("404 fallback: sidebar links resolve to the real post.html, not a path under /posts/",
     href(at404, "#site-nav ul a"), "/claude-blog-kr/post.html?slug=ai-era-durable-skills");
  eq("404 fallback: breadcrumb link goes to the site root",
     href(at404, ".post-crumb a"), "/claude-blog-kr/index.html#m=" + encodeURIComponent("AI 인사이트"));
  eq("404 fallback: bar library link goes to the site root",
     href(at404, ".cbk-library"), "/claude-blog-kr/library.html");
  // post.html 은 /claude-blog-kr/post.html 로 서빙되므로 상대경로가 이미 맞다.
  // 여기에 SITE_BASE 를 박으면 로컬 파일로 열 때 깨지므로 세팅하지 않는 것이 맞다.
  eq("root without a site base: links stay relative", href(atRoot, ".nav-brand"), "index.html");

  console.log("\n=== nav.js: " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
}
main();
