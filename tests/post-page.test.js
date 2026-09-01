const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ROW = {
  slug: "my-first", title: "내 첫 글", nav: "첫 글", main: "내 글", cat: "에세이",
  date: "2026-09-01", author: "me", rev: 1,
  body_html: '<header><h1>내 첫 글</h1></header><p>본문입니다.</p>',
  style_css: "body{color:#123456}"
};

const RENDER_SRC = fs.readFileSync(ROOT + "/posts/assets/render-post.js", "utf8");

/* JSDOM 은 resources 로더를 붙이지 않으면 <script src> 를 가져오지 않는다.
 * runScripts:"dangerously" 는 "인라인 스크립트를 실행한다" 는 뜻일 뿐이다.
 * 그리고 fetch/CBK_CONFIG 스텁은 문서 파싱이 끝난 뒤에야 꽂을 수 있다.
 * 그래서 (1) 외부 스크립트 태그를 전부 걷어낸 HTML 을 파싱하고
 *        (2) 스텁을 주입하고
 *        (3) render-post.js 소스를 textContent 로 직접 실행한다.
 * 실행 순서를 테스트가 통제하게 되므로 이 방식이 실제 브라우저 순서와 같다. */
function boot(file, url, found) {
  let html = fs.readFileSync(ROOT + "/" + file, "utf8");
  html = html.replace(/<script src="[^"]*"><\/script>/g, "");
  const dom = new JSDOM(html, { url: url, runScripts: "dangerously" });
  const w = dom.window;
  w.CBK_CONFIG = { supabaseUrl: "https://db.test", supabaseAnonKey: "anon" };
  w.CBK_ASSET_BASE = "posts/";
  w.fetch = function (u, init) {
    const body = JSON.parse((init && init.body) || "{}");
    if (String(u).endsWith("/cbk_post_get")) {
      const hit = (found !== false && body.p_slug === ROW.slug) ? [ROW] : [];
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(hit) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
  };
  const s = w.document.createElement("script");
  s.textContent = RENDER_SRC;
  w.document.body.appendChild(s);
  return w;
}

(async () => {
  // post.html renders from ?slug=
  let w = boot("post.html", "https://x.test/post.html?slug=my-first");
  await sleep(30);
  const doc = w.document;
  ok("body container exists", !!doc.getElementById("post-body"));
  ok("body_html rendered", /본문입니다/.test(doc.getElementById("post-body").innerHTML));
  ok("post's own header kept", !!doc.querySelector("#post-body header h1"));
  ok("style injected", (doc.getElementById("post-style") || {}).textContent === "body{color:#123456}");
  ok("document title set from the post", doc.title === "내 첫 글");
  ok("no error state shown", doc.getElementById("post-error").hidden === true);
  ok("root pages flag themselves for nav.js", w.CBK_AT_ROOT === true);
  ok("nav.js is loaded from the asset base, not a bare relative path",
     [].slice.call(doc.querySelectorAll("script[src]"))
       .some(s => /^posts\/assets\/nav\.js$/.test(s.getAttribute("src"))));

  // missing post shows an error rather than a blank page
  w = boot("post.html", "https://x.test/post.html?slug=nope", false);
  await sleep(30);
  ok("missing post reveals the error block", w.document.getElementById("post-error").hidden === false);
  ok("missing post error is in Korean", /찾을 수 없/.test(w.document.getElementById("post-error").textContent));

  // 404.html recovers the slug from a legacy /posts/<slug>.html path
  w = boot("404.html", "https://x.test/claude-blog-kr/posts/my-first.html");
  await sleep(30);
  ok("404 fallback renders the post", /본문입니다/.test(w.document.getElementById("post-body").innerHTML));
  ok("404 fallback sets the title", w.document.title === "내 첫 글");

  // a genuinely unknown path is not treated as a post
  w = boot("404.html", "https://x.test/claude-blog-kr/nothing/here", false);
  await sleep(30);
  ok("non-post 404 shows the error block", w.document.getElementById("post-error").hidden === false);

  console.log("post-page: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
