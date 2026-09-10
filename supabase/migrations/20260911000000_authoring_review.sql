-- 웹 편집의 낙관적 잠금과 첨삭의 판본·실행 토큰 검증. 기존 migration은 불변이다.
alter table public.cbk_posts add column review_token text;

create function public.cbk_post_save(
  p_key text, p_slug text, p_title text, p_nav text, p_main text, p_cat text,
  p_date date, p_body_html text, p_body_md text, p_expected_rev integer
) returns public.cbk_posts
language plpgsql security definer set search_path = public as $$
declare old public.cbk_posts; r public.cbk_posts;
begin
  perform cbk_assert_owner(p_key);
  if p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{0,120}$' then raise exception 'invalid slug'; end if;
  if coalesce(trim(p_title),'') = '' or coalesce(trim(p_body_md),'') = '' or p_date is null then raise exception 'title, body and date required'; end if;
  if octet_length(p_body_html) > 1000000 or octet_length(p_body_md) > 1000000 then raise exception 'post too large'; end if;
  -- 신규 슬러그 동시 생성도 직렬화. 일반 UPDATE는 행 잠금으로 직렬화한다.
  perform pg_advisory_xact_lock(hashtextextended(p_slug, 0));
  select * into old from cbk_posts where slug = p_slug for update;
  if found then
    if old.author <> 'me' or old.body_md is null then raise exception 'translation is read only'; end if;
    if p_expected_rev is distinct from old.rev then raise exception 'revision conflict'; end if;
    update cbk_posts set title=p_title, nav=coalesce(p_nav,''), main=coalesce(p_main,''), cat=coalesce(p_cat,''),
      date=p_date, body_html=p_body_html, body_md=p_body_md, rev=rev+1,
      review_status='pending', review_token=null, review_at=null, review_error=null, updated_at=now()
      where slug=p_slug returning * into r;
  else
    if p_expected_rev is distinct from 0 then raise exception 'revision conflict'; end if;
    insert into cbk_posts(slug,title,nav,main,cat,date,body_html,body_md,author)
      values(p_slug,p_title,coalesce(p_nav,''),coalesce(p_main,''),coalesce(p_cat,''),p_date,p_body_html,p_body_md,'me') returning * into r;
  end if;
  return r;
end;
$$;

create function public.cbk_review_start(p_key text, p_slug text)
returns setof public.cbk_posts
language plpgsql security definer set search_path = public as $$
begin
  perform cbk_assert_owner(p_key);
  return query update cbk_posts set review_status='running', review_at=now(),
    review_token=gen_random_uuid()::text, review_error=null
    where id in (select id from cbk_posts where slug=p_slug and
      (review_status='pending' or (review_status='running' and (review_at is null or review_at < now()-interval '15 minutes'))) for update skip locked)
    returning *;
end;
$$;

create function public.cbk_review_complete(p_key text,p_slug text,p_rev integer,p_token text,p_findings jsonb,p_error text default null)
returns boolean
language plpgsql security definer set search_path = public as $$
declare r public.cbk_posts; f jsonb;
begin
  perform cbk_assert_owner(p_key);
  select * into r from cbk_posts where slug=p_slug for update;
  if not found or r.rev is distinct from p_rev or r.review_token is distinct from p_token or p_token is null or r.review_status <> 'running' then return false; end if;
  if p_error is not null then
    update cbk_posts set review_status='error', review_error=left(p_error,500), review_at=now(), review_token=null where slug=p_slug;
    return true;
  end if;
  if p_findings is null or jsonb_typeof(p_findings) <> 'array' then raise exception 'findings must be an array'; end if;
  if jsonb_array_length(p_findings) > 50 then raise exception 'too many findings'; end if;
  -- 한 transaction: 잘못된 지적 하나라도 있으면 부분 저장을 남기지 않는다.
  for f in select value from jsonb_array_elements(p_findings) loop
    if coalesce(trim(f->>'comment'),'') = '' or coalesce(trim(f->>'quote'),'') = '' then raise exception 'quote and comment required'; end if;
    insert into cbk_reviews(post_slug,post_rev,kind,severity,quote,comment,suggestion)
      values(p_slug,p_rev,f->>'kind',f->>'severity',f->>'quote',f->>'comment',coalesce(f->>'suggestion',''));
  end loop;
  update cbk_posts set review_status='done',review_error=null,review_at=now(),review_token=null where slug=p_slug;
  return true;
end;
$$;

create function public.cbk_review_retry(p_key text,p_slug text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  perform cbk_assert_owner(p_key);
  update cbk_posts set review_status='pending',review_error=null,review_token=null,review_at=null
    where slug=p_slug and review_status='error';
  return found;
end;
$$;

create or replace function public.cbk_review_pending(p_key text) returns setof public.cbk_posts
language plpgsql security definer set search_path = public as $$
begin
  perform cbk_assert_owner(p_key);
  return query select * from cbk_posts where review_status='pending' or
    (review_status='running' and (review_at is null or review_at < now()-interval '15 minutes')) order by updated_at;
end;
$$;

create function public.cbk_review_states(p_key text) returns table(slug text,title text,rev integer,review_status text,review_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  perform cbk_assert_owner(p_key);
  return query select p.slug,p.title,p.rev,p.review_status,p.review_at from cbk_posts p order by p.updated_at desc;
end;
$$;

-- 더 이상 사용하지 않는 판본 검증 없는 실행 RPC는 닫는다.
revoke execute on function public.cbk_review_claim(text,text), public.cbk_review_finish(text,text,text,text), public.cbk_review_add(text,text,integer,text,text,text,text,text) from anon,authenticated;
revoke all on function public.cbk_post_save(text,text,text,text,text,text,date,text,text,integer), public.cbk_review_start(text,text), public.cbk_review_complete(text,text,integer,text,jsonb,text), public.cbk_review_retry(text,text), public.cbk_review_states(text) from public;
grant execute on function public.cbk_post_save(text,text,text,text,text,text,date,text,text,integer), public.cbk_review_start(text,text), public.cbk_review_complete(text,text,integer,text,jsonb,text), public.cbk_review_retry(text,text), public.cbk_review_states(text) to anon,authenticated;
notify pgrst, 'reload schema';
