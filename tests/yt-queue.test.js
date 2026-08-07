// schema-youtube-queue.sql 검증: 유튜브 URL과 일반 웹 문서 URL을 모두 받고,
// URL이 아닌 값은 계속 거부하는지 확인한다.
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { PGlite } = require("@electric-sql/pglite");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }

(async () => {
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated;");

  let schema = fs.readFileSync(ROOT + "/supabase/schema-youtube-queue.sql", "utf8");
  schema = schema.replace(/notify pgrst.*?;/gi, "");

  try {
    await db.exec(schema);
    ok("schema-youtube-queue.sql executes cleanly", true);
  } catch (e) {
    ok("schema-youtube-queue.sql executes cleanly", false);
    console.log("    ERROR:", e.message);
    process.exit(1);
  }

  const KEY = "sync-key-1234";
  async function enqueue(url) {
    return db.query("select * from cbk_yt_enqueue($1, $2)", [KEY, url]);
  }
  async function rejected(url) {
    try { await enqueue(url); return false; }
    catch (e) { return /not a http url/.test(e.message); }
  }

  // 받아야 하는 것들
  const accepted = [
    "https://www.youtube.com/watch?v=abc123",
    "https://youtu.be/abc123",
    "https://www.youtube.com/shorts/abc123",
    "https://simonwillison.net/2025/Jan/1/some-post/",   // 일반 블로그
    "https://claude.com/blog/some-post",
    "http://example.org/a?b=1#c",                        // http, 쿼리/프래그먼트
    "https://example.com",                               // 경로 없는 루트
  ];
  for (const url of accepted) {
    let row = null;
    try { row = (await enqueue(url)).rows[0]; } catch (e) { /* row stays null */ }
    ok("accepts " + url, row && row.url === url && row.status === "pending");
  }

  // 거부해야 하는 것들
  const bad = [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "ftp://example.com/file",
    "example.com/no-scheme",
    "https://localhost:3000/x",       // 점 없는 호스트
    "https://example.com/a b",        // 공백 포함
    "",
  ];
  for (const url of bad) ok("rejects " + JSON.stringify(url), await rejected(url));

  // 잘못된 sync key 는 여전히 거부
  let keyRejected = false;
  try { await db.query("select * from cbk_yt_enqueue($1,$2)", ["short", "https://example.com/x"]); }
  catch (e) { keyRejected = /invalid sync key/.test(e.message); }
  ok("rejects short sync key", keyRejected);

  // 같은 URL 중복 등록은 기존 줄을 그대로 돌려준다
  const first = (await enqueue("https://example.net/dup")).rows[0];
  const again = (await enqueue("https://example.net/dup")).rows[0];
  ok("duplicate enqueue returns the same row", first.id === again.id);
  const cnt = await db.query("select count(*)::int as n from cbk_yt_queue where url='https://example.net/dup'");
  ok("duplicate enqueue did not insert twice", cnt.rows[0].n === 1);

  // 워커 흐름: claim → finish(done) 이 일반 웹 URL 에도 그대로 동작
  const claimed = await db.query("select * from cbk_yt_claim($1)", [KEY]);
  ok("claim returns one row as processing", claimed.rows.length === 1 && claimed.rows[0].status === "processing");
  const fin = await db.query(
    "select * from cbk_yt_finish($1,$2,'done',$3,null)", [KEY, claimed.rows[0].id, "some-slug"]);
  ok("finish marks done with slug", fin.rows[0].status === "done" && fin.rows[0].post_slug === "some-slug");

  console.log("\n=== schema-youtube-queue.sql: " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
})();
