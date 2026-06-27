-- Claude Blog KR — Supabase 동기화 스키마
-- 모델: 나 혼자, 비밀 sync_key 하나, 여러 기기.
-- 브라우저(anon 키)는 아래 RPC 함수로만 접근한다. 테이블 직접 접근은 RLS로 전면 차단.
-- AI 피드백 배치(내 맥, service_role 키)는 RLS를 우회해 feedback 컬럼을 채운다.

-- 1) 글 하나에 대한 내 상태 한 줄 (즐겨찾기 + 메모 + 평가 + AI 피드백)
create table if not exists public.cbk_items (
  id          bigint generated always as identity primary key,
  sync_key    text        not null,
  post_slug   text        not null,
  bookmarked  boolean     not null default false,
  note        text        not null default '',
  rating      smallint,                          -- 사용자 평가: 1(좋아요) | -1(싫어요) | NULL(중립)
  reason      text        not null default '',   -- 그 평가의 이유 (사용자 입력). feedback 과 다름!
  deleted     boolean     not null default false, -- 소프트 삭제(툼스톤). 삭제도 한 줄로 남겨 다른 기기에 전파.
  feedback    text,                              -- AI 배치가 채움 (NULL = 아직 피드백 없음). 사용자 입력 아님.
  feedback_at timestamptz,
  updated_at  timestamptz not null default now(),
  unique (sync_key, post_slug)
);

-- 기존 설치를 위한 멱등 마이그레이션.
alter table public.cbk_items add column if not exists deleted boolean not null default false;
alter table public.cbk_items add column if not exists rating  smallint;
alter table public.cbk_items add column if not exists reason  text not null default '';
-- 평가 값은 1/-1/NULL 만 허용.
alter table public.cbk_items drop constraint if exists cbk_items_rating_chk;
alter table public.cbk_items add  constraint cbk_items_rating_chk check (rating is null or rating in (-1, 1));

-- 2) RLS 켜기. anon/공개 역할용 정책을 두지 않음 = 테이블 직접 접근 전면 차단.
alter table public.cbk_items enable row level security;

-- 3) 내 항목 전체 읽기 (피드백 포함). 키를 모르면 빈 결과.
create or replace function public.cbk_get(p_key text)
returns setof public.cbk_items
language sql security definer set search_path = public as $$
  select * from public.cbk_items where sync_key = p_key order by updated_at desc;
$$;

-- 4) 메모/즐겨찾기/평가 저장. 내용을 쓰면 deleted=false 로 되살아남. feedback 은 건드리지 않음(배치 전용).
-- 시그니처가 4→6 인자로 바뀌므로 (create or replace 로는 못 바꿈) 먼저 drop.
drop function if exists public.cbk_upsert(text, text, boolean, text);
drop function if exists public.cbk_upsert(text, text, boolean, text, smallint, text);
create or replace function public.cbk_upsert(
  p_key text, p_slug text, p_bookmarked boolean, p_note text,
  p_rating smallint default null, p_reason text default ''
) returns public.cbk_items
language plpgsql security definer set search_path = public as $$
declare r public.cbk_items;
begin
  insert into public.cbk_items (sync_key, post_slug, bookmarked, note, rating, reason, deleted, updated_at)
  values (p_key, p_slug, p_bookmarked, p_note, p_rating, coalesce(p_reason, ''), false, now())
  on conflict (sync_key, post_slug) do update
    set bookmarked = excluded.bookmarked,
        note       = excluded.note,
        rating     = excluded.rating,
        reason     = excluded.reason,
        deleted    = false,
        updated_at = now()
  returning * into r;
  return r;
end;
$$;

-- 5) 항목 삭제 = 소프트 삭제(툼스톤). 행을 지우지 않고 deleted=true 로 남겨 다른 기기가 따라 지우게 함.
-- 반환 타입이 void → cbk_items 로 바뀌었으므로 (create or replace 로는 못 바꿈) 먼저 drop.
drop function if exists public.cbk_delete(text, text);
create or replace function public.cbk_delete(p_key text, p_slug text)
returns public.cbk_items
language plpgsql security definer set search_path = public as $$
declare r public.cbk_items;
begin
  insert into public.cbk_items (sync_key, post_slug, bookmarked, note, rating, reason, deleted, updated_at)
  values (p_key, p_slug, false, '', null, '', true, now())
  on conflict (sync_key, post_slug) do update
    set bookmarked = false,
        note       = '',
        rating     = null,
        reason     = '',
        deleted    = true,
        updated_at = now()
  returning * into r;
  return r;
end;
$$;

-- 6) 공개 역할엔 함수 실행 권한만 부여 (테이블 직접 권한은 없음).
revoke all on function public.cbk_get(text)                       from public;
revoke all on function public.cbk_upsert(text, text, boolean, text, smallint, text) from public;
revoke all on function public.cbk_delete(text, text)             from public;
grant execute on function public.cbk_get(text)                       to anon, authenticated;
grant execute on function public.cbk_upsert(text, text, boolean, text, smallint, text) to anon, authenticated;
grant execute on function public.cbk_delete(text, text)             to anon, authenticated;

-- PostgREST 스키마 캐시 갱신 (새 함수 시그니처 즉시 반영)
notify pgrst, 'reload schema';
