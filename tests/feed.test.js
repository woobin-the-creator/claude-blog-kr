const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(ROOT + "/my-feed.html", "utf8");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
function eq(n, a, b) { ok(n + " (got " + JSON.stringify(a) + ")", JSON.stringify(a) === JSON.stringify(b)); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const SAMPLE = [
  { id: "https://a.com/x", url: "https://a.com/x?utm=1", issue: "2026-06-26",
    section: "Big Tech & Startups", title_en: "Apple Raises Prices", title_ko: "애플, 가격 인상",
    summary_en: "...", summary_ko: "애플이 맥과 아이패드 가격을 올렸다.", read_min: 5,
    added_at: "2026-06-26T23:00:00.000Z" },
  { id: "https://b.com/y", url: "https://www.b.com/y", issue: "2026-06-25", section: "Science",
    title_en: "IBM chip", title_ko: "IBM 칩", summary_en: "", summary_ko: "IBM이 1나노 칩을 발표했다.",
    read_min: 3, added_at: "2026-06-25T23:00:00.000Z" }
];

// my-feed.html calls fetch(FEED_URL) on load; inject a stub before scripts run.
async function run(sample) {
  const dom = new JSDOM(html, {
    url: "https://x.test/my-feed.html",
    runScripts: "dangerously",
    beforeParse(window) {
      window.fetch = () => Promise.resolve({
        ok: true, status: 200, json: () => Promise.resolve(sample)
      });
    }
  });
  await sleep(30);
  return dom.window.document;
}

async function main() {
  const doc = await run(SAMPLE);

  const cards = doc.querySelectorAll(".card");
  eq("renders 2 cards", cards.length, 2);

  const labels = [...doc.querySelectorAll(".day-label")].map(e => e.textContent);
  eq("day groups newest first", labels, ["2026-06-26", "2026-06-25"]);

  ok("korean title shown", /애플, 가격 인상/.test(doc.body.textContent));
  ok("korean summary shown", /1나노 칩을 발표/.test(doc.body.textContent));
  ok("title links to original url (query preserved)",
    !![...doc.querySelectorAll(".card-title a")].find(a => a.href === "https://a.com/x?utm=1"));
  ok("section chip shown", /Big Tech/.test(doc.body.textContent));
  ok("read minutes shown", /5분 읽기/.test(doc.body.textContent));
  ok("source host shown (www stripped)", /원문\(b\.com\)/.test(doc.body.textContent));

  const doc2 = await run([]);
  ok("empty state shown", /아직 피드 항목이 없습니다/.test((doc2.querySelector(".empty") || {}).textContent || ""));

  const doc3 = await run([{ id: "https://c.com/z", url: "https://c.com/z", issue: "2026-06-20",
    title_en: "Only English Title", summary_en: "eng summary", added_at: "2026-06-20T00:00:00.000Z" }]);
  ok("falls back to english title when korean missing", /Only English Title/.test(doc3.body.textContent));
  ok("falls back to english summary when korean missing", /eng summary/.test(doc3.body.textContent));

  console.log("\n=== my-feed.html: " + pass + " passed, " + fail + " failed ===");
  if (fail) process.exit(1);
}
main();
