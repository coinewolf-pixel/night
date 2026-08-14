-- ============================================================================
-- NEXO NIGHT — mission economy upgrade
-- Run this ONLY if you already ran an older 001 that lacked mission progress.
-- Fresh installs of the current 001 already include everything here.
-- Safe to run multiple times.
-- ============================================================================

alter table public.daily_missions
  add column if not exists kind text not null default 'complete_card';

-- Classify the seeded missions.
update public.daily_missions set kind = 'complete_card'
  where title in ('Win 1 Game', 'Play 3 Games');
update public.daily_missions set kind = 'hint'
  where title = 'Use 2 Hints';

-- (Re)create ensure_player_missions in case the old 001 didn't have it.
create or replace function public.ensure_player_missions()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.player_missions (player_id, mission_id)
  select auth.uid(), m.id from public.daily_missions m where m.is_active = true
  on conflict (player_id, mission_id) do nothing;
end;
$$;

grant execute on function public.ensure_player_missions() to authenticated;

-- NOTE: the updated complete_card() (with mission progress) ships in the
-- current 001_initial_schema.sql. If you're upgrading, re-run the
-- complete_card function block from 001 to pick up mission tracking.
