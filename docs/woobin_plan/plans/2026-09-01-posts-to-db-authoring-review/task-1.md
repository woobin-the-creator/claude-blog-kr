### Task 1: Posts + reviews schema and RPCs

**Files:**
- Create: `supabase/schema-posts.sql`
- Create: `tests/posts-schema.test.js`
- Modify: `tests/package.json` (add the test to the `test` script)

**Interfaces:**
- Consumes: nothing. This is the first task.
- Produces: the RPC surface every later task calls.
  - `cbk_posts_list()` → `setof cbk_post_meta` — **public**, no key. Columns: `slug, title, nav, main, cat, date, author, rev, updated_at` — this is the column order the `cbk_posts_list` SQL in Step 3 returns; keep the two in sync. No body (keeps the catalog payload small).
  - `cbk_post_get(p_slug text)` → `setof cbk_posts` — **public**, no key. Full row including `body_html`.
  - `cbk_post_upsert(p_key text, p_slug text, p_title text, p_nav text, p_main text, p_cat text, p_date date, p_body_html text, p_body_md text, p_style_css text, p_author text)` → `cbk_posts` — owner-gated. Bumps `rev` and sets `review_status='pending'` **only when `body_html` actually changed**.
  - `cbk_post_delete(p_key text, p_slug text)` → `void` — owner-gated.
  - `cbk_review_claim(p_key text, p_slug text)` → `setof cbk_posts` — owner-gated. `pending` → `running`. Returns nothing if the post is not claimable.
  - `cbk_review_finish(p_key text, p_slug text, p_status text, p_error text)` → `cbk_posts` — owner-gated. `p_status` in `('done','error','pending')`.
  - `cbk_review_pending(p_key text)` → `setof cbk_posts` — owner-gated. Startup catch-up: `review_status='pending'` OR (`'running'` AND `review_at < now() - interval '1 hour'`).
  - `cbk_review_add(p_key text, p_slug text, p_rev integer, p_kind text, p_severity text, p_quote text, p_comment text, p_suggestion text)` → `cbk_reviews` — owner-gated.
  - `cbk_reviews_list(p_key text, p_slug text)` → `setof cbk_reviews` — owner-gated. `p_slug` NULL means all posts.
  - `cbk_review_set_status(p_key text, p_id bigint, p_status text)` → `cbk_reviews` — owner-gated. `p_status` in `('open','applied','dismissed')`.
  - `cbk_owner_claim(p_key text)` → `boolean` — seeds `cbk_owner` on first call, then returns whether `p_key` is the owner. Idempotent.

**Background the implementer needs:**

`supabase/schema.sql` is the style reference — read it first. Its pattern is: table → `enable row level security` with **no policies** (which blocks all direct table access) → `security definer` functions with `set search_path = public` → `revoke all ... from public` → `grant execute ... to anon, authenticated`.

One thing differs from that file and it is the reason `cbk_owner` exists. `cbk_items` is *partitioned* by `sync_key` (`where sync_key = p_key`), so a stranger holding the public anon key can only ever read and write their own partition — harmless. `cbk_posts` is **publicly readable by design** (the site is public), so an ungated insert would put a stranger's post on the live site. Every write RPC therefore validates the key against a stored hash instead of using it as a partition.

Use the built-in `sha256()` (Postgres 11+, no extension needed — `pgcrypto` is not available in pglite without extra setup).

- [ ] **Step 1: Write the failing test**

Create `tests/posts-schema.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node posts-schema.test.js
```

Expected: FAIL — `ENOENT: no such file or directory, open '.../supabase/schema-posts.sql'`

- [ ] **Step 3: Write the schema**

Create `supabase/schema-posts.sql`:

```sql
-- Claude Blog KR — 포스트 본문 + AI 첨삭 스키마
-- 모델: 포스트는 누구나 읽고, 나만 쓴다.
--
-- schema.sql 의 cbk_items 와 다른 점 하나: cbk_items 는 sync_key 로 파티션되어
-- 남이 anon 키로 써봐야 자기 칸에만 쓴다. cbk_posts 는 공개 읽기라 파티션이
-- 방어가 안 된다 — 남이 넣은 글이 내 사이트에 뜬다. 그래서 쓰기는 전부
-- cbk_assert_owner() 로 키 해시를 검증한다.

-- 1) 소유자 키 해시 한 줄. 처음 cbk_owner_claim 을 부른 키가 주인이 된다.
create table if not exists public.cbk_owner (
  id       integer primary key default 1,
  key_hash text    not null,
  claimed_at timestamptz not null default now(),
  constraint cbk_owner_single_row check (id = 1)
);

-- 2) 포스트 한 줄 = 글 하나. body_html 이 사이트에 렌더되는 실체.
create table if not exists public.cbk_posts (
  id            bigint generated always as identity primary key,
  slug          text        not null unique,
  title         text        not null,
  nav           text        not null default '',   -- 사이드바용 짧은 제목
  main          text        not null default '',   -- 메인 카테고리 = 출처
  cat           text        not null default '',   -- 서브 카테고리 = 주제
  date          date        not null,
  body_html     text        not null,
  body_md       text,                              -- 마크다운 원본. 번역 이관분은 NULL
  style_css     text        not null default '',   -- 이 글 전용 <style> 블록. 79개 이관분이 서로 다른 CSS를 쓴다
  author        text        not null default 'ai', -- 'me' = 내가 쓴 글(편집 가능) | 'ai' = 파이프라인 산출물
  rev           integer     not null default 1,    -- body_html 이 바뀔 때만 증가. 리뷰가 이 값을 가리킨다
  review_status text        not null default 'pending',
  review_at     timestamptz,
  review_error  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.cbk_posts drop constraint if exists cbk_posts_author_chk;
alter table public.cbk_posts add  constraint cbk_posts_author_chk check (author in ('me','ai'));
alter table public.cbk_posts drop constraint if exists cbk_posts_review_status_chk;
alter table public.cbk_posts add  constraint cbk_posts_review_status_chk
  check (review_status in ('pending','running','done','error'));

create index if not exists cbk_posts_date_idx on public.cbk_posts (date desc);

-- 3) 첨삭 지적 한 줄. 글 하나에 여러 줄.
create table if not exists public.cbk_reviews (
  id         bigint generated always as identity primary key,
  post_slug  text        not null references public.cbk_posts(slug) on delete cascade,
  post_rev   integer     not null,                 -- 어느 판본을 보고 지적했나
  kind       text        not null,                 -- fact | logic | style
  severity   text        not null,                 -- high | medium | low
  quote      text        not null default '',      -- 지적 대상 구절
  comment    text        not null,                 -- 무엇이 문제인가
  suggestion text        not null default '',      -- 어떻게 고치면 되나
  status     text        not null default 'open',  -- open | applied | dismissed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cbk_reviews drop constraint if exists cbk_reviews_kind_chk;
alter table public.cbk_reviews add  constraint cbk_reviews_kind_chk check (kind in ('fact','logic','style'));
alter table public.cbk_reviews drop constraint if exists cbk_reviews_severity_chk;
alter table public.cbk_reviews add  constraint cbk_reviews_severity_chk check (severity in ('high','medium','low'));
alter table public.cbk_reviews drop constraint if exists cbk_reviews_status_chk;
alter table public.cbk_reviews add  constraint cbk_reviews_status_chk check (status in ('open','applied','dismissed'));

create index if not exists cbk_reviews_slug_idx on public.cbk_reviews (post_slug, status);

-- 4) RLS 켜기. 정책 없음 = 테이블 직접 접근 전면 차단.
alter table public.cbk_owner   enable row level security;
alter table public.cbk_posts   enable row level security;
alter table public.cbk_reviews enable row level security;

-- 5) 소유자 검증. sha256 은 PG11+ 내장이라 확장이 필요 없다.
create or replace function public.cbk_hash_key(p_key text)
returns text
language sql immutable set search_path = public as $$
  select encode(sha256(convert_to(coalesce(p_key,''), 'UTF8')), 'hex');
$$;

create or replace function public.cbk_owner_claim(p_key text)
returns boolean
language plpgsql security definer set search_path = public as $$
declare h text;
begin
  if p_key is null or length(trim(p_key)) < 8 then
    raise exception 'invalid sync key';
  end if;
  h := cbk_hash_key(trim(p_key));
  insert into public.cbk_owner (id, key_hash) values (1, h)
    on conflict (id) do nothing;
  return exists (select 1 from public.cbk_owner where id = 1 and key_hash = h);
end;
$$;

create or replace function public.cbk_assert_owner(p_key text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.cbk_owner
     where id = 1 and key_hash = cbk_hash_key(trim(coalesce(p_key, '')))
  ) then
    raise exception 'not the owner';
  end if;
end;
$$;

-- 6) 공개 읽기. 키가 필요 없다 — 사이트 방문자가 이걸로 글을 읽는다.
--    목록에는 body_html 을 넣지 않는다(카탈로그 페이로드를 작게 유지).
create or replace function public.cbk_posts_list()
returns table (
  slug text, title text, nav text, main text, cat text,
  date date, author text, rev integer, updated_at timestamptz
)
language sql security definer set search_path = public as $$
  select p.slug, p.title, p.nav, p.main, p.cat, p.date, p.author, p.rev, p.updated_at
    from public.cbk_posts p
   order by p.date desc, p.slug;
$$;

create or replace function public.cbk_post_get(p_slug text)
returns setof public.cbk_posts
language sql security definer set search_path = public as $$
  select * from public.cbk_posts where slug = p_slug;
$$;

-- 7) 발행/수정. 본문이 실제로 바뀐 경우에만 rev 를 올리고 첨삭을 재무장한다.
--    제목·카테고리만 고쳤다고 에이전트를 또 돌리지 않기 위해서다.
create or replace function public.cbk_post_upsert(
  p_key text, p_slug text, p_title text, p_nav text, p_main text, p_cat text,
  p_date date, p_body_html text, p_body_md text, p_style_css text, p_author text
) returns public.cbk_posts
language plpgsql security definer set search_path = public as $$
declare r public.cbk_posts; old_body text;
begin
  perform public.cbk_assert_owner(p_key);
  if p_slug !~ '^[a-z0-9][a-z0-9-]{0,120}$' then
    raise exception 'invalid slug: %', p_slug;
  end if;
  if coalesce(trim(p_title), '') = '' then
    raise exception 'title is required';
  end if;

  select body_html into old_body from public.cbk_posts where slug = p_slug;

  insert into public.cbk_posts
    (slug, title, nav, main, cat, date, body_html, body_md, style_css, author, rev, review_status, updated_at)
  values
    (p_slug, p_title, coalesce(p_nav, ''), coalesce(p_main, ''), coalesce(p_cat, ''),
     p_date, p_body_html, p_body_md, coalesce(p_style_css, ''), coalesce(p_author, 'ai'), 1, 'pending', now())
  on conflict (slug) do update
    set title      = excluded.title,
        nav        = excluded.nav,
        main       = excluded.main,
        cat        = excluded.cat,
        date       = excluded.date,
        body_html  = excluded.body_html,
        body_md    = excluded.body_md,
        style_css  = excluded.style_css,
        author     = excluded.author,
        rev        = case when old_body is distinct from excluded.body_html
                          then public.cbk_posts.rev + 1 else public.cbk_posts.rev end,
        review_status = case when old_body is distinct from excluded.body_html
                             then 'pending' else public.cbk_posts.review_status end,
        review_error  = case when old_body is distinct from excluded.body_html
                             then null else public.cbk_posts.review_error end,
        updated_at = now()
  returning * into r;
  return r;
end;
$$;

create or replace function public.cbk_post_delete(p_key text, p_slug text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public.cbk_assert_owner(p_key);
  delete from public.cbk_posts where slug = p_slug;   -- cbk_reviews 는 on delete cascade
end;
$$;

-- 8) 첨삭 실행 상태 기계. 리스너가 쓴다.
--    Realtime 이벤트는 내구성이 없다(맥이 자면 사라진다). 그래서 상태를 행에
--    남기고, 리스너가 켜질 때 cbk_review_pending 으로 놓친 것을 주워 담는다.
create or replace function public.cbk_review_claim(p_key text, p_slug text)
returns setof public.cbk_posts
language plpgsql security definer set search_path = public as $$
declare r public.cbk_posts;
begin
  perform public.cbk_assert_owner(p_key);
  select * into r from public.cbk_posts
    where slug = p_slug
      and (review_status = 'pending'
           or (review_status = 'running' and review_at < now() - interval '1 hour'))
    for update skip locked;
  if not found then return; end if;

  update public.cbk_posts
     set review_status = 'running', review_at = now(), review_error = null
   where id = r.id
  returning * into r;
  return next r;
end;
$$;

create or replace function public.cbk_review_finish(
  p_key text, p_slug text, p_status text, p_error text
) returns public.cbk_posts
language plpgsql security definer set search_path = public as $$
declare r public.cbk_posts;
begin
  perform public.cbk_assert_owner(p_key);
  if p_status not in ('done','error','pending') then
    raise exception 'invalid review status %', p_status;
  end if;
  update public.cbk_posts
     set review_status = p_status, review_at = now(), review_error = p_error
   where slug = p_slug
  returning * into r;
  if not found then raise exception 'post not found: %', p_slug; end if;
  return r;
end;
$$;

create or replace function public.cbk_review_pending(p_key text)
returns setof public.cbk_posts
language plpgsql security definer set search_path = public as $$
begin
  perform public.cbk_assert_owner(p_key);
  return query
    select * from public.cbk_posts
     where review_status = 'pending'
        or (review_status = 'running' and review_at < now() - interval '1 hour')
     order by updated_at;
end;
$$;

-- 9) 첨삭 지적 읽기/쓰기. 전부 소유자 전용 — 공개 리포지만 개인 기록이다.
create or replace function public.cbk_review_add(
  p_key text, p_slug text, p_rev integer, p_kind text, p_severity text,
  p_quote text, p_comment text, p_suggestion text
) returns public.cbk_reviews
language plpgsql security definer set search_path = public as $$
declare r public.cbk_reviews;
begin
  perform public.cbk_assert_owner(p_key);
  if coalesce(trim(p_comment), '') = '' then
    raise exception 'comment is required';
  end if;
  insert into public.cbk_reviews (post_slug, post_rev, kind, severity, quote, comment, suggestion)
  values (p_slug, p_rev, p_kind, p_severity, coalesce(p_quote, ''), p_comment, coalesce(p_suggestion, ''))
  returning * into r;
  return r;
end;
$$;

create or replace function public.cbk_reviews_list(p_key text, p_slug text)
returns setof public.cbk_reviews
language plpgsql security definer set search_path = public as $$
begin
  perform public.cbk_assert_owner(p_key);
  return query
    select * from public.cbk_reviews
     where (p_slug is null or post_slug = p_slug)
     order by
       case status when 'open' then 0 else 1 end,
       case severity when 'high' then 0 when 'medium' then 1 else 2 end,
       created_at desc;
end;
$$;

create or replace function public.cbk_review_set_status(p_key text, p_id bigint, p_status text)
returns public.cbk_reviews
language plpgsql security definer set search_path = public as $$
declare r public.cbk_reviews;
begin
  perform public.cbk_assert_owner(p_key);
  if p_status not in ('open','applied','dismissed') then
    raise exception 'invalid status %', p_status;
  end if;
  update public.cbk_reviews set status = p_status, updated_at = now()
   where id = p_id
  returning * into r;
  if not found then raise exception 'review not found'; end if;
  return r;
end;
$$;

-- 10) 공개 역할엔 함수 실행 권한만. 테이블 직접 권한은 없다.
revoke all on function public.cbk_hash_key(text)                                     from public;
revoke all on function public.cbk_owner_claim(text)                                  from public;
revoke all on function public.cbk_assert_owner(text)                                 from public;
revoke all on function public.cbk_posts_list()                                       from public;
revoke all on function public.cbk_post_get(text)                                     from public;
revoke all on function public.cbk_post_upsert(text,text,text,text,text,text,date,text,text,text,text) from public;
revoke all on function public.cbk_post_delete(text, text)                            from public;
revoke all on function public.cbk_review_claim(text, text)                           from public;
revoke all on function public.cbk_review_finish(text, text, text, text)              from public;
revoke all on function public.cbk_review_pending(text)                               from public;
revoke all on function public.cbk_review_add(text,text,integer,text,text,text,text,text) from public;
revoke all on function public.cbk_reviews_list(text, text)                           from public;
revoke all on function public.cbk_review_set_status(text, bigint, text)              from public;

grant execute on function public.cbk_owner_claim(text)                                to anon, authenticated;
grant execute on function public.cbk_posts_list()                                     to anon, authenticated;
grant execute on function public.cbk_post_get(text)                                   to anon, authenticated;
grant execute on function public.cbk_post_upsert(text,text,text,text,text,text,date,text,text,text,text) to anon, authenticated;
grant execute on function public.cbk_post_delete(text, text)                          to anon, authenticated;
grant execute on function public.cbk_review_claim(text, text)                         to anon, authenticated;
grant execute on function public.cbk_review_finish(text, text, text, text)            to anon, authenticated;
grant execute on function public.cbk_review_pending(text)                             to anon, authenticated;
grant execute on function public.cbk_review_add(text,text,integer,text,text,text,text,text) to anon, authenticated;
grant execute on function public.cbk_reviews_list(text, text)                         to anon, authenticated;
grant execute on function public.cbk_review_set_status(text, bigint, text)            to anon, authenticated;
-- cbk_hash_key / cbk_assert_owner 는 내부 전용이라 grant 하지 않는다.

-- PostgREST 스키마 캐시 갱신
notify pgrst, 'reload schema';

-- !! 선점 경쟁 주의 !!
-- anon 키는 저장소에 공개되어 있고 cbk_owner_claim 은 "처음 부른 키가 주인" 이다.
-- 이 스키마를 배포한 순간부터 소유자 행이 비어 있는 동안은 누구든 claim 할 수 있다.
-- 따라서 **같은 SQL 에디터 세션에서 위 스크립트 바로 다음에 이어서** 실행할 것:
--     select public.cbk_owner_claim('<내 24자 sync_key>');
-- 반환값이 true 여야 한다. false 면 이미 남이 선점한 것이므로
--     delete from public.cbk_owner where id = 1;
-- 로 지우고 다시 claim 한 뒤, 그 사이에 들어온 글이 없는지 cbk_posts 를 확인한다.
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd tests && node posts-schema.test.js
```

Expected: the final line reads `posts-schema: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

If `cbk_review_claim` fails with `for update` errors under pglite, note that `select ... for update skip locked` inside a plpgsql function is supported — the same construct already ships in `supabase/schema-youtube-queue.sql` and passes `tests/yt-queue.test.js`. Compare against that file before changing the approach.

- [ ] **Step 5: Register the test**

In `tests/package.json`, add `posts-schema.test.js` to the `test` script and add a `test:posts-schema` entry:

```json
    "test": "node store.test.js && node nav.test.js && node library.test.js && node schema.test.js && node posts-schema.test.js && node yt-queue.test.js && node yt-page.test.js && node wiki.test.mjs",
    "test:posts-schema": "node posts-schema.test.js",
```

- [ ] **Step 6: Run the whole suite**

```bash
cd tests && npm test
```

Expected: every existing test still passes plus the new one.

- [ ] **Step 7: Commit**

```bash
git add supabase/schema-posts.sql tests/posts-schema.test.js tests/package.json
git commit -m "feat(db): cbk_posts + cbk_reviews 스키마와 소유자 게이트 RPC 추가"
```

> ### STOP AND ASK — 사람이 해야 하는 배포 단계
>
> **구현 에이전트는 이 태스크를 여기서 멈추고 오케스트레이터에게 보고한다. Task 2 로 넘어가지 않는다.**
>
> `supabase/schema-posts.sql` 은 저장소에 커밋될 뿐, 어떤 스크립트도 이 SQL 을 실서비스 Supabase 에 실행하지 않는다. 사람이 직접 해야 한다:
>
> 1. Supabase 대시보드 → SQL Editor 에 `supabase/schema-posts.sql` 전문을 붙여넣고 실행한다.
> 2. **같은 세션에서 곧바로** `select public.cbk_owner_claim('<내 24자 sync_key>');` 를 실행하고 `true` 가 반환되는지 확인한다.
>
> 2번이 늦어지면 그 사이 아무나 anon 키로 소유자를 선점할 수 있고(anon 키는 `posts/assets/cbk-config.js` 에 공개되어 있다), 복구하려면 `delete from public.cbk_owner where id = 1;` 를 수동으로 실행해야 한다. 그래서 이건 "note" 가 아니라 **차단 지점**이다.
>
> 사람이 "스키마 실행 완료 + claim true 확인" 을 보고하기 전에는 Task 2 의 실제 업로드를 시작하지 않는다.
>
> (Task 6 의 첫 발행도 `cbk_owner_claim` 을 부르지만, 그건 위 선점 창을 열어둔 채 기다리는 것이므로 이 단계를 대체하지 못한다.)

**Why `style_css` is a column and not one shared file:** the 79 existing posts do not share a stylesheet. Hashing each file's `<style>` block yields many distinct values (the largest group is 24 posts; there are more than a dozen groups). Merging them into one `post.css` would silently restyle most of the archive, and selector collisions would be invisible until someone opened an old post. Carrying each post's own CSS in its row is lossless and costs nothing — the blocks are ~2 KB each.
