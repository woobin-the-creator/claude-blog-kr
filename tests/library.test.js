const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");
let html = fs.readFileSync(ROOT + "/library.html", "utf8");
const storeSrc = fs.readFileSync(ROOT + "/posts/assets/store.js", "utf8");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
function eq(n, a, b) { ok(n + " (got " + JSON.stringify(a) + ")", JSON.stringify(a) === JSON.stringify(b)); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const postsStub = `
window.CBK_POSTS = [
  { file:"a.html", date:"2026-06-26", main:"AI 인사이트", cat:"역량·커리어", title:"A 글", nav:"A" },
  { file:"b.html", date:"2026-05-01", main:"제품", cat:"모델", title:"B 글", nav:"B" },
  { file:"c.html", date:"2026-04-01", main:"엔지니어링", cat:"도구", title:"C 글", nav:"C" }
];
window.CBK_postBySlug = function(k){ k=String(k).replace(/\\.html$/,""); return window.CBK_POSTS.find(function(p){return p.file.replace(/\\.html$/,"")===k;})||null; };
`;

// inline the external scripts
html = html.replace('<script src="posts/assets/cbk-config.js"></script>', '<script>/* no sync config */</script>');
html = html.replace('<script src="posts/assets/posts.js"></script>', '<script>' + postsStub + '</script>');
html = html.replace('<script src="posts/assets/store.js"></script>', '<script>' + storeSrc + '</script>');

async function main() {
  const dom = new JSDOM(html, { url: "https://x.test/library.html", runScripts: "dangerously" });
  const w = dom.window;
  w.URL.createObjectURL = () => "blob:stub"; w.URL.revokeObjectURL = () => {};
  // seed data BEFORE scripts? scripts already ran on construction. Re-seed and re-render via clicks instead.
  await sleep(20);
  const doc = w.document, CBK = w.CBK;
  ok("CBK loaded in library", !!CBK);

  // seed: like A (with reason), dislike B, note+fav C
  CBK.setRating("a", 1); CBK.setReason("a", "구체적 사례");
  CBK.setRating("b", -1);
  CBK.toggleBookmark("c"); CBK.setNote("c", "나중에 읽기");

  // re-render by toggling a filter chip to 'all'
  function clickFilter(f) {
    const chip = [...doc.querySelectorAll(".chip")].find(c => c.getAttribute("data-filter") === f);
    chip.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  }
  clickFilter("all");
  await sleep(10);

  let cards = doc.querySelectorAll(".card");
  eq("all filter shows 3 cards", cards.length, 3);
  ok("summary has 👍 and 👎", /👍 1/.test(doc.getElementById("summary").textContent) && /👎 1/.test(doc.getElementById("summary").textContent));

  // like filter → only A
  clickFilter("like"); await sleep(10);
  cards = doc.querySelectorAll(".card");
  eq("like filter shows 1", cards.length, 1);
  ok("like card shows reason", cards[0].querySelector(".card-reason").value === "구체적 사례");
  ok("like card like-btn on", cards[0].querySelector(".card-like").classList.contains("on"));

  // dislike filter → only B
  clickFilter("dislike"); await sleep(10);
  cards = doc.querySelectorAll(".card");
  eq("dislike filter shows 1", cards.length, 1);
  ok("dislike card dislike-btn on", cards[0].querySelector(".card-dislike").classList.contains("on"));

  // search by reason text
  clickFilter("all"); await sleep(10);
  const q = doc.getElementById("q");
  q.value = "구체적"; q.dispatchEvent(new w.Event("input", { bubbles: true }));
  await sleep(10);
  eq("search by reason narrows to 1", doc.querySelectorAll(".card").length, 1);
  q.value = ""; q.dispatchEvent(new w.Event("input", { bubbles: true })); await sleep(10);

  // toggle a rating from within the library card
  clickFilter("all"); await sleep(10);
  const cCard = [...doc.querySelectorAll(".card")].find(c => /C 글/.test(c.textContent));
  cCard.querySelector(".card-like").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  eq("rating set from library card", CBK.getRating("c"), 1);
  ok("reason box opened on rate", cCard.querySelector(".card-reason").hidden === false);

  // delete clears all signals (auto-confirm)
  w.confirm = () => true;
  const aCard = [...doc.querySelectorAll(".card")].find(c => /A 글/.test(c.textContent));
  aCard.querySelector(".card-del").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await sleep(10);
  eq("delete cleared rating", CBK.getRating("a"), 0);
  eq("delete cleared reason", CBK.getReason("a"), "");

  // export-wiki produces records (spy on exportWiki via wikiRecords)
  const recs = CBK.wikiRecords();
  ok("wikiRecords reflects current rated posts", recs.length === 2); // b(-1), c(1) now
  const bRec = recs.find(x => x.slug === "b");
  ok("wiki record carries main/cat", bRec && bRec.main === "제품" && bRec.cat === "모델");

  console.log("\n=== library.html: " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
}
main();
