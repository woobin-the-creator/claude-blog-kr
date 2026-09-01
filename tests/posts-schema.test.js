const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { PGlite } = require("@electric-sql/pglite");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  ✗ FAIL:", n); } }

(async () => {
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated;");

  let schema = fs.readFileSync(ROOT + "/supabase/schema-posts.sql", "utf8");
  schema = schema.replace(/notify pgrst.*?;/gi, "");
  try {
    await db.exec(schema);
    ok("schema-posts.sql executes cleanly", true);
  } catch (e) {
    ok("schema-posts.sql executes cleanly", false);
    console.log("    ERROR:", e.message);
    process.exit(1);
  }

  // --- owner claim is idempotent and exclusive ---
  const c1 = await db.query("select cbk_owner_claim('OWNERKEY123456789') as v");
  ok("first cbk_owner_claim returns true", c1.rows[0].v === true);
  const c2 = await db.query("select cbk_owner_claim('OWNERKEY123456789') as v");
  ok("same key claims again (idempotent)", c2.rows[0].v === true);
  const c3 = await db.query("select cbk_owner_claim('INTRUDERKEY000000') as v");
  ok("a different key is rejected", c3.rows[0].v === false);

  // --- writes require the owner key ---
  let denied = false;
  try {
    await db.query("select * from cbk_post_upsert('INTRUDERKEY000000','x','T','N','M','C','2026-09-01'::date,'<p>hi</p>',null,'','me')");
  } catch (e) { denied = /not the owner/.test(e.message); }
  ok("cbk_post_upsert rejects a non-owner key", denied);

  // --- publish a post ---
  const up = await db.query("select * from cbk_post_upsert('OWNERKEY123456789','my-first','제목','짧은 제목','내 글','에세이','2026-09-01'::date,'<p>본문</p>','본문','body{color:#111}','me')");
  ok("cbk_post_upsert returns a row", up.rows.length === 1);
  ok("rev starts at 1", up.rows[0].rev === 1);
  ok("review_status starts pending", up.rows[0].review_status === "pending");
  ok("author stored", up.rows[0].author === "me");

  // --- public reads need no key ---
  const list = await db.query("select * from cbk_posts_list()");
  ok("cbk_posts_list returns the post", list.rows.length === 1 && list.rows[0].slug === "my-first");
  ok("cbk_posts_list omits body_html", !("body_html" in list.rows[0]));
  const one = await db.query("select * from cbk_post_get('my-first')");
  ok("cbk_post_get returns body_html", one.rows[0].body_html === "<p>본문</p>");
  ok("cbk_post_get returns style_css", one.rows[0].style_css === "body{color:#111}");

  // --- editing the body bumps rev and re-arms review ---
  await db.query("select cbk_review_finish('OWNERKEY123456789','my-first','done',null)");
  const same = await db.query("select * from cbk_post_upsert('OWNERKEY123456789','my-first','제목 수정','짧은 제목','내 글','에세이','2026-09-01'::date,'<p>본문</p>','본문','body{color:#111}','me')");
  ok("metadata-only edit does not bump rev", same.rows[0].rev === 1);
  ok("metadata-only edit leaves review_status done", same.rows[0].review_status === "done");
  const edited = await db.query("select * from cbk_post_upsert('OWNERKEY123456789','my-first','제목','짧은 제목','내 글','에세이','2026-09-01'::date,'<p>고친 본문</p>','고친 본문','body{color:#111}','me')");
  ok("body edit bumps rev to 2", edited.rows[0].rev === 2);
  ok("body edit re-arms review_status to pending", edited.rows[0].review_status === "pending");

  // --- claim / finish / catch-up ---
  const claimed = await db.query("select * from cbk_review_claim('OWNERKEY123456789','my-first')");
  ok("cbk_review_claim returns the post", claimed.rows.length === 1 && claimed.rows[0].review_status === "running");
  const twice = await db.query("select * from cbk_review_claim('OWNERKEY123456789','my-first')");
  ok("cbk_review_claim is not re-claimable while running", twice.rows.length === 0);
  const catchup = await db.query("select * from cbk_review_pending('OWNERKEY123456789')");
  ok("fresh running post is not in the catch-up set", catchup.rows.length === 0);
  await db.query("update cbk_posts set review_at = now() - interval '2 hours' where slug='my-first'");
  const stale = await db.query("select * from cbk_review_pending('OWNERKEY123456789')");
  ok("a stale running post reappears in the catch-up set", stale.rows.length === 1);

  // --- reviews ---
  const rv = await db.query("select * from cbk_review_add('OWNERKEY123456789','my-first',2,'fact','high','고친 본문','2026년 수치가 아닙니다','2025년으로 고치세요')");
  ok("cbk_review_add returns a row", rv.rows.length === 1);
  ok("review starts open", rv.rows[0].status === "open");
  ok("review records post_rev", rv.rows[0].post_rev === 2);

  let badKind = false;
  try { await db.query("select * from cbk_review_add('OWNERKEY123456789','my-first',2,'nonsense','high','q','c','s')"); }
  catch (e) { badKind = true; }
  ok("cbk_review_add rejects an unknown kind", badKind);

  const rl = await db.query("select * from cbk_reviews_list('OWNERKEY123456789','my-first')");
  ok("cbk_reviews_list returns the review", rl.rows.length === 1);
  const rlAll = await db.query("select * from cbk_reviews_list('OWNERKEY123456789',null)");
  ok("cbk_reviews_list with null slug returns all", rlAll.rows.length === 1);

  const done = await db.query("select * from cbk_review_set_status('OWNERKEY123456789'," + rv.rows[0].id + ",'applied')");
  ok("cbk_review_set_status marks applied", done.rows[0].status === "applied");

  let readerBlocked = false;
  try { await db.query("select * from cbk_reviews_list('INTRUDERKEY000000','my-first')"); }
  catch (e) { readerBlocked = /not the owner/.test(e.message); }
  ok("cbk_reviews_list rejects a non-owner key", readerBlocked);

  // --- delete ---
  await db.query("select cbk_post_delete('OWNERKEY123456789','my-first')");
  const gone = await db.query("select * from cbk_posts_list()");
  ok("cbk_post_delete removes the post", gone.rows.length === 0);
  const orphan = await db.query("select count(*)::int as n from cbk_reviews where post_slug='my-first'");
  ok("deleting a post removes its reviews", orphan.rows[0].n === 0);

  // --- RLS is on with no policies ---
  const rls = await db.query("select relrowsecurity from pg_class where relname in ('cbk_posts','cbk_reviews','cbk_owner')");
  ok("RLS enabled on all three tables", rls.rows.length === 3 && rls.rows.every(r => r.relrowsecurity === true));
  const pol = await db.query("select count(*)::int as n from pg_policies where tablename in ('cbk_posts','cbk_reviews','cbk_owner')");
  ok("no policies exist (direct access fully blocked)", pol.rows[0].n === 0);

  console.log("posts-schema: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
