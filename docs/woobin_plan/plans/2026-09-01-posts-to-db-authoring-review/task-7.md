### Task 7: Image upload to Supabase Storage

**Files:**
- Create: `supabase/storage-post-media.sql`
- Create: `tests/storage-policy.test.js`
- Modify: `write.html` (upload control inside `#tab-edit`)
- Modify: `tests/package.json`

**Interfaces:**
- Consumes: `write.html`'s `#w-body` and `#w-slug` from Task 6; `cbk_assert_owner(p_key)` from Task 1; `CBK.sync.getKey()`.
- Produces: `cbk_media_token(p_key text)` -> `text`. Owner-gated. Returns the literal string `ok` when the caller is the owner and raises otherwise. The editor calls it before an upload so a non-owner gets a clear Korean error instead of an opaque Storage 403.

**Background the implementer needs:**

The 79 MB of existing media stays on GitHub Pages and is **not** touched (spec Decision 3). This task only covers images the user attaches to their own new posts, which have nowhere else to go because publishing no longer makes a commit.

Supabase Storage buckets are ordinary tables under the hood (`storage.objects`) and are governed by RLS policies, not by the RPC pattern the rest of this project uses. That is a deliberate exception: an image upload is a multipart body, which a PostgREST RPC cannot carry. The bucket is public for reads (the site is public) and insert/update/delete are restricted.

Because the browser only ever holds the `anon` role, a policy cannot check the `sync_key` — Postgres RLS on `storage.objects` has no access to it. **This is a real limitation and the plan accepts it explicitly:** the bucket allows `anon` inserts confined to the `post-media/` prefix with a size and MIME restriction, which means a stranger holding the public anon key could upload a file into that bucket. They could not attach it to a post (that needs `cbk_post_upsert`, which is owner-gated), so the exposure is bounded to storage consumption. `cbk_media_token` gives the editor a friendly pre-check but is not a security boundary. Note this trade-off in the SQL comments so the next reader does not mistake it for an oversight.

Free-tier headroom: the bucket starts empty and only receives images the user attaches by hand. Per-file cap is set to 5 MB, well under the 50 MB platform limit.

- [ ] **Step 1: Write the failing test**

Create `tests/storage-policy.test.js`. This one asserts on the SQL text and on the owner-check function, because pglite does not ship the `storage` schema:

```js
const path = require('path'); const ROOT = path.resolve(__dirname, '..');
const fs = require("fs");
const { PGlite } = require("@electric-sql/pglite");

let pass = 0, fail = 0;
function ok(n, c) { if (c) pass++; else { fail++; console.log("  x FAIL:", n); } }

(async () => {
  const sql = fs.readFileSync(ROOT + "/supabase/storage-post-media.sql", "utf8");

  ok("bucket is named post-media", /'post-media'/.test(sql));
  ok("bucket is public for reads", /public\s*=?\s*true|,\s*true\s*\)/.test(sql));
  ok("a size limit is set", /file_size_limit/.test(sql));
  ok("mime types are restricted", /allowed_mime_types/.test(sql));
  /* 주의: 아래는 `!/re/.test(x)[0]` 로 쓰면 boolean 에 [0] 을 적용해 undefined 가 되고
   * !undefined === true 라 SQL 내용과 무관하게 항상 통과한다. 매치를 먼저 꺼낸다. */
  const mimes = (sql.match(/allowed_mime_types[\s\S]*?\]/) || [""])[0];
  ok("only image mime types are allowed",
     /image\//.test(mimes) && !/application\/|text\//.test(mimes));
  ok("svg is not allowed (스크립트를 품을 수 있다)", !/svg/.test(mimes));
  ok("insert policy is scoped to the bucket",
     /create policy[\s\S]*insert[\s\S]*bucket_id\s*=\s*'post-media'/i.test(sql));
  ok("the anon-upload trade-off is documented in a comment", /anon/.test(sql) && /--/.test(sql));

  // cbk_media_token needs Task 1's owner machinery, so load both files
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated;");
  let base = fs.readFileSync(ROOT + "/supabase/schema-posts.sql", "utf8").replace(/notify pgrst.*?;/gi, "");
  await db.exec(base);
  // take only the function definition out of the storage file (the storage.* DDL cannot run here)
  const fnMatch = sql.match(/create or replace function public\.cbk_media_token[\s\S]*?\$\$;/);
  ok("cbk_media_token is defined in the file", !!fnMatch);
  await db.exec(fnMatch[0]);

  await db.query("select cbk_owner_claim('OWNERKEY123456789')");
  const good = await db.query("select cbk_media_token('OWNERKEY123456789') as v");
  ok("owner gets ok", good.rows[0].v === "ok");

  let denied = false;
  try { await db.query("select cbk_media_token('INTRUDERKEY000000')"); }
  catch (e) { denied = /not the owner/.test(e.message); }
  ok("non-owner is rejected", denied);

  console.log("storage-policy: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tests && node storage-policy.test.js
```

Expected: FAIL — `ENOENT ... supabase/storage-post-media.sql`

- [ ] **Step 3: Write the storage SQL**

Create `supabase/storage-post-media.sql`:

```sql
-- Claude Blog KR — 내가 쓴 글에 붙일 이미지 버킷
--
-- 기존 79개 포스트의 미디어 79MB 는 여기로 오지 않는다. GitHub Pages 에 그대로
-- 두고 본문이 절대 URL 로 가리킨다(설계 결정 3). 이 버킷은 발행에서 커밋이
-- 사라진 뒤 "내 글에 붙일 새 이미지"가 갈 곳이 없어서 만든다.
--
-- 알려진 한계 (실수가 아니라 선택):
--   브라우저는 anon 역할만 쥐고 있고, storage.objects 의 RLS 정책은 sync_key 를
--   볼 수 없다. 그래서 이 버킷의 업로드는 anon 에게 열려 있다 — 공개 anon 키를
--   가진 남이 파일을 올릴 수는 있다. 다만 그 파일을 글에 붙이려면 소유자 게이트가
--   걸린 cbk_post_upsert 를 통과해야 하므로, 노출은 "스토리지 용량 소모 + 무단
--   호스팅"까지다. 그래서 allowed_mime_types 에서 image/svg+xml 은 뺐다 —
--   SVG 는 <script> 를 품을 수 있고 이 버킷은 공개 URL 로 서빙되므로, 그것까지
--   허용하면 노출 범위가 "용량"이 아니라 "우리 도메인에서 실행되는 스크립트"가
--   된다. 래스터 이미지만 받는다.
--   아래 cbk_media_token 은 에디터가 미리 친절한 한국어 에러를 내기 위한 것이지
--   보안 경계가 아니다.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-media', 'post-media', true, 5242880,
        array['image/png','image/jpeg','image/gif','image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 읽기: 공개 사이트라 누구나 본다.
drop policy if exists "post-media public read" on storage.objects;
create policy "post-media public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'post-media');

-- 쓰기: 이 버킷 안으로만. (위 한계 주석 참고)
drop policy if exists "post-media insert" on storage.objects;
create policy "post-media insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'post-media');

drop policy if exists "post-media update" on storage.objects;
create policy "post-media update" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'post-media')
  with check (bucket_id = 'post-media');

-- 삭제는 열지 않는다. 잘못 올린 파일은 Supabase 대시보드에서 지운다.

-- 에디터용 사전 확인. 보안 경계가 아니라 에러 메시지를 위한 것.
create or replace function public.cbk_media_token(p_key text)
returns text
language plpgsql security definer set search_path = public as $$
begin
  perform public.cbk_assert_owner(p_key);
  return 'ok';
end;
$$;

revoke all on function public.cbk_media_token(text) from public;
grant execute on function public.cbk_media_token(text) to anon, authenticated;

notify pgrst, 'reload schema';
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd tests && node storage-policy.test.js
```

Expected: the final line reads `storage-policy: <n> passed, 0 failed`. The pass count is whatever the test file contains; **`0 failed` is the check**.

- [ ] **Step 5: Add the upload control to `write.html`**

Inside `#tab-edit`, immediately above the `.split` div, add:

```html
    <div class="actions" style="margin:0 0 12px">
      <input type="file" id="w-image" accept="image/*" style="width:auto">
      <span id="w-image-msg" style="font-size:0.85rem;color:#666"></span>
    </div>
```

In the page script, add an upload handler. It uploads straight to the Storage REST endpoint (not through PostgREST) and then inserts a markdown image line at the cursor in `#w-body`:

```js
    var imgEl = document.getElementById("w-image");
    var imgMsg = document.getElementById("w-image-msg");

    imgEl.addEventListener("change", function () {
      var file = imgEl.files && imgEl.files[0];
      if (!file) return;
      var slug = (document.getElementById("w-slug").value || "").trim();
      if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(slug)) {
        imgMsg.textContent = "먼저 슬러그를 정하세요.";
        imgEl.value = ""; return;
      }
      var c = cfgSupabase();
      var name = Date.now() + "-" + file.name.replace(/[^A-Za-z0-9._-]/g, "_");
      var objectPath = slug + "/" + name;
      imgMsg.textContent = "올리는 중…";

      rpc("cbk_media_token", { p_key: syncKey })
        .then(function () {
          return fetch(c.url + "/storage/v1/object/post-media/" + objectPath, {
            method: "POST",
            headers: {
              "apikey": c.key,
              "Authorization": "Bearer " + c.key,
              "Content-Type": file.type || "application/octet-stream"
            },
            body: file
          });
        })
        .then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error(r.status + " " + t); });
          var url = c.url + "/storage/v1/object/public/post-media/" + objectPath;
          var body = document.getElementById("w-body");
          var at = body.selectionStart || body.value.length;
          var snippet = "\n\n![" + file.name.replace(/\.[a-z0-9]+$/i, "") + "](" + url + ")\n\n";
          body.value = body.value.slice(0, at) + snippet + body.value.slice(at);
          body.dispatchEvent(new Event("input", { bubbles: true }));
          imgMsg.textContent = "올렸습니다.";
        })
        .catch(function (e) {
          imgMsg.textContent = /not the owner/.test(e.message)
            ? "이 사이트의 소유자 키가 아닙니다."
            : "업로드 실패: " + e.message;
        })
        .then(function () { imgEl.value = ""; });
    });
```

`cfgSupabase()` is the same `cfg()` helper the page already has from Task 6 — rename it there if the name collides, and keep one definition.

- [ ] **Step 6: Confirm the editor tests still pass**

```bash
cd tests && node write-page.test.js && node storage-policy.test.js
```

Expected: both pass. Task 6's test does not stub the Storage endpoint, but it never fires a `change` event on `#w-image`, so nothing new is exercised.

- [ ] **Step 7: Register the test and commit**

Add `storage-policy.test.js` to `tests/package.json`'s `test` script and a `test:storage` entry.

```bash
git add supabase/storage-post-media.sql write.html tests/storage-policy.test.js tests/package.json
git commit -m "feat(media): 내 글에 붙일 이미지용 post-media 버킷과 에디터 업로드"
```

**Deployment note:** `supabase/storage-post-media.sql` has to be run once in the Supabase SQL editor, same as Task 1's schema. Mention it in the commit body.
