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
    { file: "ai-era-durable-skills.html", date: "2026-06-26", main: "AI 인사이트", cat: "역량·커리어", title: "RAG는 죽지 않았다", nav: "내구성 역량" },
    { file: "opus46.html", date: "2026-05-01", main: "제품", cat: "모델", title: "Opus 4.6", nav: "Opus 4.6" }
  ];
  w.CBK_postBySlug = (k) => w.CBK_POSTS.find(p => p.file === k || p.file.replace(/\.html$/, "") === String(k).replace(/\.html$/, "")) || null;

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
  w2.localStorage.setItem("cbk:data:v1", w.localStorage.getItem("cbk:data:v1"));
  for (const src of [storeSrc, navSrc]) { const s = w2.document.createElement("script"); s.textContent = src; w2.document.body.appendChild(s); }
  ok("reload: like reflects saved rating", w2.document.getElementById("cbk-like").classList.contains("on"));
  ok("reload: reason box open (has reason)", w2.document.getElementById("cbk-reason-wrap").hidden === false);
  eq("reload: reason text restored", w2.document.getElementById("cbk-reason").value, "사례가 구체적이라 바로 적용 가능");

  console.log("\n=== nav.js: " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
}
main();
