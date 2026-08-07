// youtube.html 등록 에러 문구 검증.
// 특히 옛 DB 함수가 던지는 'not a youtube url' 이 "주소 형식이 틀렸다"는 문구로
// 뭉개지지 않고, 스키마가 안 올라갔다는 사실을 그대로 알려주는지 확인한다.
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { JSDOM } = require("jsdom");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const SYNC_KEY = "sync-key-1234";
const storeStub = `
window.CBK = { sync: {
  getKey: function () { return ${JSON.stringify(SYNC_KEY)}; },
  isConfigured: function () { return true; }
} };
`;
const configStub = `window.CBK_CONFIG = { supabaseUrl: "https://db.test", supabaseAnonKey: "anon" };`;

let html = fs.readFileSync(ROOT + "/youtube.html", "utf8");
html = html.replace('<script src="posts/assets/cbk-config.js"></script>', '<script>' + configStub + '</script>');
html = html.replace('<script src="posts/assets/store.js"></script>', '<script>' + storeStub + '</script>');

// enqueue 는 서버 에러, list 는 빈 배열을 돌려주는 fetch 스텁.
function makeDom(enqueueError) {
  const dom = new JSDOM(html, { url: "https://x.test/youtube.html", runScripts: "outside-only" });
  const w = dom.window;
  w.fetch = function (url) {
    if (/cbk_yt_enqueue/.test(url)) {
      return Promise.resolve({
        ok: false, status: 400,
        text: () => Promise.resolve(JSON.stringify({ message: enqueueError }))
      });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
  };
  // 페이지 스크립트를 스텁이 설치된 뒤에 실행
  dom.window.eval(configStub + storeStub);
  const inline = [...dom.window.document.querySelectorAll("script")]
    .filter(s => !s.src && /cbk_yt_enqueue/.test(s.textContent))
    .map(s => s.textContent).join("\n");
  dom.window.eval(inline);
  return dom;
}

async function submit(dom, url) {
  const w = dom.window, d = w.document;
  d.getElementById("yt-url").value = url;
  d.getElementById("yt-add").dispatchEvent(new w.Event("click"));
  await sleep(30);
  return d.getElementById("yt-msg").textContent;
}

(async () => {
  // 1) 옛 스키마(유튜브 전용)가 남아 있을 때 — 원인을 정확히 짚어야 한다
  let msg = await submit(makeDom("not a youtube url"),
    "https://platform.claude.com/docs/en/build-with-claude/effort#how-effort-works");
  ok("옛 스키마 에러를 스키마 미적용으로 안내", /스키마|schema-youtube-queue\.sql/.test(msg));
  ok("옛 스키마 에러를 주소 형식 문제로 오인하지 않음", !/http\(s\)로 시작하는/.test(msg));

  // 2) 새 스키마가 진짜 형식 문제로 거부할 때
  msg = await submit(makeDom("not a http url"), "javascript:alert(1)");
  ok("형식 오류는 형식 문구로 안내", /http\(s\)로 시작하는 주소만/.test(msg));

  // 3) 동기화 코드 문제
  msg = await submit(makeDom("invalid sync key"), "https://example.com/x");
  ok("sync key 오류 안내", /동기화 코드/.test(msg));

  // 4) 모르는 에러는 원문 그대로 보여준다 (삼켜서 감추지 않기)
  msg = await submit(makeDom("some unexpected db failure"), "https://example.com/y");
  ok("알 수 없는 에러는 원문 노출", /some unexpected db failure/.test(msg));

  console.log("\n=== youtube.html: " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
})();
