const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { PGlite } = require("@electric-sql/pglite");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }

(async () => {
  const db = new PGlite();
  // supabase-like roles so GRANT ... TO anon/authenticated resolve
  await db.exec("create role anon; create role authenticated;");

  let schema = fs.readFileSync(ROOT + "/supabase/schema.sql", "utf8");
  // pglite has no PostgREST listener; NOTIFY to that channel is harmless but skip to be safe
  schema = schema.replace(/notify pgrst.*?;/gi, "");

  try {
    await db.exec(schema);
    ok("schema.sql executes cleanly (DDL + functions + constraint + grants)", true);
  } catch (e) {
    ok("schema.sql executes cleanly", false);
    console.log("    ERROR:", e.message);
    process.exit(1);
  }

  // columns exist with right types
  const cols = await db.query(
    "select column_name, data_type from information_schema.columns where table_name='cbk_items' and column_name in ('rating','reason') order by column_name");
  ok("rating column exists (smallint)", cols.rows.some(r => r.column_name === "rating" && /smallint/.test(r.data_type)));
  ok("reason column exists (text)", cols.rows.some(r => r.column_name === "reason" && /text/.test(r.data_type)));

  // cbk_upsert with rating+reason
  const up = await db.query("select * from cbk_upsert('K','ai-era',true,'note',1::smallint,'구체적 사례')");
  ok("cbk_upsert returns row", up.rows.length === 1);
  ok("cbk_upsert stored rating=1", up.rows[0].rating === 1);
  ok("cbk_upsert stored reason", up.rows[0].reason === "구체적 사례");
  ok("cbk_upsert did not touch feedback (null)", up.rows[0].feedback === null);

  // cbk_upsert dislike + update path (on conflict)
  await db.query("select * from cbk_upsert('K','ai-era',true,'note',-1::smallint,'생각 바뀜')");
  const got = await db.query("select rating, reason from cbk_get('K') where post_slug='ai-era'");
  ok("on-conflict update changed rating to -1", got.rows[0].rating === -1);
  ok("on-conflict update changed reason", got.rows[0].reason === "생각 바뀜");

  // neutral rating via NULL
  await db.query("select * from cbk_upsert('K','ai-era',true,'note',null,'')");
  const neu = await db.query("select rating from cbk_get('K') where post_slug='ai-era'");
  ok("neutral stored as NULL rating", neu.rows[0].rating === null);

  // CHECK constraint rejects invalid rating
  let rejected = false;
  try { await db.query("select * from cbk_upsert('K','bad',false,'',5::smallint,'')"); }
  catch (e) { rejected = /cbk_items_rating_chk|check constraint/i.test(e.message); }
  ok("CHECK constraint rejects rating=5", rejected);

  // cbk_delete clears rating/reason and tombstones
  await db.query("select * from cbk_upsert('K','todel',true,'x',1::smallint,'r')");
  await db.query("select * from cbk_delete('K','todel')");
  const del = await db.query("select rating, reason, deleted, bookmarked from cbk_get('K') where post_slug='todel'");
  ok("cbk_delete tombstoned (deleted=true)", del.rows[0].deleted === true);
  ok("cbk_delete cleared rating", del.rows[0].rating === null);
  ok("cbk_delete cleared reason", del.rows[0].reason === "");
  ok("cbk_delete cleared bookmark", del.rows[0].bookmarked === false);

  console.log("\n=== schema.sql: " + pass + " passed, " + fail + " failed ===");
  process.exit(fail ? 1 : 0);
})();
