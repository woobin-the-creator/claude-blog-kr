-- Realtime publication membership is production schema, not a dashboard toggle.
-- The catalog still reads through RPC; this publication wakes the resident reviewer.
do $$
begin
  if not exists (
    select 1
      from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'cbk_posts'
  ) then
    alter publication supabase_realtime add table public.cbk_posts;
  end if;

  if to_regclass('public.cbk_yt_queue') is not null and not exists (
    select 1
      from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'cbk_yt_queue'
  ) then
    alter publication supabase_realtime add table public.cbk_yt_queue;
  end if;
end;
$$;
