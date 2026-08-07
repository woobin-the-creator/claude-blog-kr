-- Claude Blog KR — 링크 자동 포스팅 큐 스키마 (유튜브 + 일반 웹 문서)
-- 모델: schema.sql 과 동일 — 비밀 sync_key 하나가 보안을 책임진다.
-- 브라우저(웹 폼)와 맥의 워커 둘 다 anon 키 + 아래 RPC로만 접근한다.
-- 테이블 직접 접근은 RLS로 전면 차단.
--
-- 흐름: youtube.html 폼이 cbk_yt_enqueue → 맥 launchd 워커가 cbk_yt_claim 으로
-- 한 건씩 가져가 처리(processing) → 성공/실패를 cbk_yt_finish 로 기록.
--
-- 이름은 과거 호환을 위해 cbk_yt_* 를 유지한다(유튜브 전용으로 시작한 큐).
-- 유튜브/일반 글 구분은 URL 모양으로 워커와 폼이 각자 판단한다.

-- 1) 큐 테이블: URL 하나 = 한 줄
create table if not exists public.cbk_yt_queue (
  id          bigint generated always as identity primary key,
  sync_key    text        not null,
  url         text        not null,
  status      text        not null default 'pending',  -- pending | processing | done | error
  post_slug   text,                                    -- 완료 시 생성된 포스트 slug
  error       text,                                    -- 실패 시 요약 메시지
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.cbk_yt_queue drop constraint if exists cbk_yt_queue_status_chk;
alter table public.cbk_yt_queue add  constraint cbk_yt_queue_status_chk
  check (status in ('pending','processing','done','error'));

-- 2) RLS 켜기. 정책 없음 = 직접 접근 전면 차단.
alter table public.cbk_yt_queue enable row level security;

-- 3) 등록: http(s) URL 검증 + 같은 URL의 대기/처리중 중복 방지.
--    유튜브 영상이든 일반 블로그/문서 페이지든 모두 받는다.
create or replace function public.cbk_yt_enqueue(p_key text, p_url text)
returns public.cbk_yt_queue
language plpgsql security definer set search_path = public as $$
declare r public.cbk_yt_queue;
begin
  if p_key is null or length(trim(p_key)) < 8 then
    raise exception 'invalid sync key';
  end if;
  -- 호스트에 점이 있는 http(s) 주소만 통과 (javascript:, data:, 사내 호스트 등 차단).
  if p_url !~* '^https?://[a-z0-9][a-z0-9._-]*\.[a-z]{2,}(:[0-9]{1,5})?([/?#]|$)' then
    raise exception 'not a http url';
  end if;
  if p_url ~ '\s' then
    raise exception 'not a http url';
  end if;
  -- 같은 URL이 아직 안 끝났으면 그 줄을 그대로 돌려준다 (중복 등록 방지).
  select * into r from public.cbk_yt_queue
    where sync_key = p_key and url = p_url and status in ('pending','processing')
    limit 1;
  if found then return r; end if;

  insert into public.cbk_yt_queue (sync_key, url)
    values (trim(p_key), trim(p_url))
    returning * into r;
  return r;
end;
$$;

-- 4) 목록: 폼 페이지의 상태 표시용. 최근 50건.
create or replace function public.cbk_yt_list(p_key text)
returns setof public.cbk_yt_queue
language sql security definer set search_path = public as $$
  select * from public.cbk_yt_queue
    where sync_key = p_key
    order by created_at desc
    limit 50;
$$;

-- 5) 워커가 한 건 집어가기: 가장 오래된 pending → processing.
--    2시간 넘게 processing 에 묶인 줄(워커 사망 등)은 다시 집어갈 수 있다.
--    for update skip locked 로 워커가 겹쳐 돌아도 같은 줄을 두 번 안 집는다.
create or replace function public.cbk_yt_claim(p_key text)
returns setof public.cbk_yt_queue
language plpgsql security definer set search_path = public as $$
declare r public.cbk_yt_queue;
begin
  select * into r from public.cbk_yt_queue
    where sync_key = p_key
      and (status = 'pending'
           or (status = 'processing' and updated_at < now() - interval '2 hours'))
    order by created_at
    limit 1
    for update skip locked;
  if not found then return; end if;

  update public.cbk_yt_queue
    set status = 'processing', error = null, updated_at = now()
    where id = r.id
    returning * into r;
  return next r;
end;
$$;

-- 6) 워커가 결과 기록: done(+slug) 또는 error(+메시지). 재시도는 pending 으로 되돌리기.
create or replace function public.cbk_yt_finish(
  p_key text, p_id bigint, p_status text,
  p_slug text default null, p_error text default null
) returns public.cbk_yt_queue
language plpgsql security definer set search_path = public as $$
declare r public.cbk_yt_queue;
begin
  if p_status not in ('done','error','pending') then
    raise exception 'invalid status %', p_status;
  end if;
  update public.cbk_yt_queue
    set status = p_status,
        post_slug = coalesce(p_slug, post_slug),
        error = p_error,
        updated_at = now()
    where sync_key = p_key and id = p_id
    returning * into r;
  if not found then raise exception 'row not found'; end if;
  return r;
end;
$$;

-- 7) 등록 취소/재시도: 폼에서 pending 삭제, error → pending 재시도.
create or replace function public.cbk_yt_remove(p_key text, p_id bigint)
returns void
language sql security definer set search_path = public as $$
  delete from public.cbk_yt_queue
    where sync_key = p_key and id = p_id and status in ('pending','error','done');
$$;

-- 8) 공개 역할엔 함수 실행 권한만 부여.
revoke all on function public.cbk_yt_enqueue(text, text)                      from public;
revoke all on function public.cbk_yt_list(text)                               from public;
revoke all on function public.cbk_yt_claim(text)                              from public;
revoke all on function public.cbk_yt_finish(text, bigint, text, text, text)   from public;
revoke all on function public.cbk_yt_remove(text, bigint)                     from public;
grant execute on function public.cbk_yt_enqueue(text, text)                    to anon, authenticated;
grant execute on function public.cbk_yt_list(text)                             to anon, authenticated;
grant execute on function public.cbk_yt_claim(text)                            to anon, authenticated;
grant execute on function public.cbk_yt_finish(text, bigint, text, text, text) to anon, authenticated;
grant execute on function public.cbk_yt_remove(text, bigint)                   to anon, authenticated;

-- PostgREST 스키마 캐시 갱신
notify pgrst, 'reload schema';
