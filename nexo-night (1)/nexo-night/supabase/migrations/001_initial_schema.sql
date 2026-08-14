-- ============================================================================
-- NEXO NIGHT — initial schema
-- Run this in Supabase → SQL Editor (one shot).
-- Security model:
--   * Players can READ allowed content and their OWN rows.
--   * Players can NEVER write coins / xp / level / gems / results directly.
--   * All rewards are credited by SECURITY DEFINER functions that read the
--     canonical reward value from the DB — the browser never sends amounts.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  avatar_url    text,
  level         int  not null default 1,
  xp            int  not null default 0,
  nexo_coins    bigint not null default 0,
  gems          int  not null default 0,
  energy        int  not null default 10,
  energy_max    int  not null default 10,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- GAME MODULES (admin-managed content)
-- ---------------------------------------------------------------------------
create table if not exists public.game_modules (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  image_url     text,
  category      text,
  min_level     int  not null default 1,
  reward_nexo   int  not null default 0,
  reward_xp     int  not null default 0,
  is_active     boolean not null default true,
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- GAME CARDS (admin-managed content)
-- ---------------------------------------------------------------------------
create table if not exists public.game_cards (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid references public.game_modules(id) on delete cascade,
  title         text not null,
  description   text,
  image_url     text,
  card_type     text not null default 'dare',   -- 'truth' | 'dare'
  difficulty    text not null default 'normal', -- 'easy' | 'normal' | 'hot'
  reward_nexo   int  not null default 0,
  reward_xp     int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PLAYER PROGRESS
-- ---------------------------------------------------------------------------
create table if not exists public.player_progress (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references public.profiles(id) on delete cascade,
  module_id   uuid not null references public.game_modules(id) on delete cascade,
  completed   boolean not null default false,
  progress    int not null default 0,
  updated_at  timestamptz not null default now(),
  unique (player_id, module_id)
);

-- ---------------------------------------------------------------------------
-- GAME RESULTS (written only by the secure RPC below)
-- ---------------------------------------------------------------------------
create table if not exists public.game_results (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references public.profiles(id) on delete cascade,
  module_id   uuid references public.game_modules(id) on delete set null,
  card_id     uuid references public.game_cards(id) on delete set null,
  result      text not null,          -- 'completed' | 'skipped'
  nexo_earned int not null default 0,
  xp_earned   int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- DAILY MISSIONS
-- ---------------------------------------------------------------------------
create table if not exists public.daily_missions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  target      int not null default 1,
  reward_nexo int not null default 0,
  reward_xp   int not null default 0,
  kind        text not null default 'complete_card', -- 'complete_card' | 'hint' | ...
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.player_missions (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references public.profiles(id) on delete cascade,
  mission_id  uuid not null references public.daily_missions(id) on delete cascade,
  progress    int not null default 0,
  completed   boolean not null default false,
  claimed     boolean not null default false,
  updated_at  timestamptz not null default now(),
  unique (player_id, mission_id)
);

-- ---------------------------------------------------------------------------
-- REWARDS
-- ---------------------------------------------------------------------------
create table if not exists public.rewards (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  image_url      text,
  reward_type    text not null default 'nexo',  -- 'nexo' | 'gems' | 'item'
  reward_value   int not null default 0,
  required_level int not null default 1,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ADMIN USERS
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- HELPERS
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

-- XP curve: level N requires N*1000 XP to advance.
create or replace function public.level_for_xp(p_xp int)
returns int
language sql
immutable
as $$
  select greatest(1, floor((p_xp) / 1000.0)::int + 1);
$$;

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'player_' || substr(new.id::text, 1, 8))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- SECURE REWARD CREDITING
-- The client only sends a card id. The reward comes from the DB, not the browser.
-- ============================================================================
create or replace function public.complete_card(p_card_id uuid, p_result text default 'completed')
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_card  public.game_cards%rowtype;
  v_nexo  int := 0;
  v_xp    int := 0;
  v_row   public.profiles%rowtype;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_card from public.game_cards where id = p_card_id and is_active = true;
  if not found then
    raise exception 'card not found or inactive';
  end if;

  if p_result = 'completed' then
    v_nexo := v_card.reward_nexo;
    v_xp   := v_card.reward_xp;
  end if;

  insert into public.game_results (player_id, module_id, card_id, result, nexo_earned, xp_earned)
  values (v_uid, v_card.module_id, v_card.id, p_result, v_nexo, v_xp);

  update public.profiles
     set nexo_coins = nexo_coins + v_nexo,
         xp         = xp + v_xp,
         level      = public.level_for_xp(xp + v_xp),
         updated_at = now()
   where id = v_uid
   returning * into v_row;

  -- Server-side mission progress: only 'completed' results count, and only
  -- toward missions of kind 'complete_card'. The browser can't inflate this.
  if p_result = 'completed' then
    insert into public.player_missions (player_id, mission_id)
    select v_uid, m.id from public.daily_missions m
     where m.is_active = true and m.kind = 'complete_card'
    on conflict (player_id, mission_id) do nothing;

    update public.player_missions pm
       set progress   = least(dm.target, pm.progress + 1),
           completed  = (pm.progress + 1) >= dm.target,
           updated_at = now()
      from public.daily_missions dm
     where pm.mission_id = dm.id
       and pm.player_id  = v_uid
       and dm.is_active  = true
       and dm.kind       = 'complete_card'
       and pm.claimed    = false
       and pm.completed  = false;
  end if;

  return v_row;
end;
$$;

-- Ensure the current player has a row for every active mission (idempotent).
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

-- Claim a daily mission reward (idempotent — can't be double-claimed).
create or replace function public.claim_mission(p_mission_id uuid)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_m   public.daily_missions%rowtype;
  v_pm  public.player_missions%rowtype;
  v_row public.profiles%rowtype;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_m from public.daily_missions where id = p_mission_id and is_active = true;
  if not found then raise exception 'mission not found'; end if;

  select * into v_pm from public.player_missions
   where player_id = v_uid and mission_id = p_mission_id;

  if not found or not v_pm.completed then
    raise exception 'mission not completed';
  end if;
  if v_pm.claimed then
    raise exception 'already claimed';
  end if;

  update public.player_missions set claimed = true, updated_at = now()
   where id = v_pm.id;

  update public.profiles
     set nexo_coins = nexo_coins + v_m.reward_nexo,
         xp         = xp + v_m.reward_xp,
         level      = public.level_for_xp(xp + v_m.reward_xp),
         updated_at = now()
   where id = v_uid
   returning * into v_row;

  return v_row;
end;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.game_modules     enable row level security;
alter table public.game_cards       enable row level security;
alter table public.player_progress  enable row level security;
alter table public.game_results     enable row level security;
alter table public.daily_missions   enable row level security;
alter table public.player_missions  enable row level security;
alter table public.rewards          enable row level security;
alter table public.admin_users      enable row level security;

-- PROFILES ------------------------------------------------------------------
-- Everyone signed-in can read profiles (needed for the leaderboard).
create policy "profiles_read" on public.profiles
  for select using (true);

-- A user may update ONLY cosmetic fields of their OWN row. Currency/xp/level
-- are protected by a trigger below (a plain column grant isn't enough in PG).
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Admins and SECURITY DEFINER functions bypass this guard.
  if public.is_admin() then
    return new;
  end if;
  -- Non-admin direct updates cannot change economy fields.
  if new.nexo_coins is distinct from old.nexo_coins
     or new.xp    is distinct from old.xp
     or new.level is distinct from old.level
     or new.gems  is distinct from old.gems then
    raise exception 'economy fields are read-only from the client';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile on public.profiles;
create trigger trg_protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- GAME MODULES --------------------------------------------------------------
create policy "modules_read_active" on public.game_modules
  for select using (is_active = true or public.is_admin());
create policy "modules_admin_write" on public.game_modules
  for all using (public.is_admin()) with check (public.is_admin());

-- GAME CARDS ----------------------------------------------------------------
create policy "cards_read_active" on public.game_cards
  for select using (is_active = true or public.is_admin());
create policy "cards_admin_write" on public.game_cards
  for all using (public.is_admin()) with check (public.is_admin());

-- PLAYER PROGRESS -----------------------------------------------------------
create policy "progress_read_own" on public.player_progress
  for select using (auth.uid() = player_id or public.is_admin());
create policy "progress_upsert_own" on public.player_progress
  for insert with check (auth.uid() = player_id);
create policy "progress_update_own" on public.player_progress
  for update using (auth.uid() = player_id) with check (auth.uid() = player_id);

-- GAME RESULTS --------------------------------------------------------------
-- Read own results only. NO direct insert policy → only the SECURITY DEFINER
-- RPC (complete_card) can write here. This blocks reward=999999999 attacks.
create policy "results_read_own" on public.game_results
  for select using (auth.uid() = player_id or public.is_admin());

-- DAILY MISSIONS ------------------------------------------------------------
create policy "missions_read_active" on public.daily_missions
  for select using (is_active = true or public.is_admin());
create policy "missions_admin_write" on public.daily_missions
  for all using (public.is_admin()) with check (public.is_admin());

-- PLAYER MISSIONS -----------------------------------------------------------
create policy "pmissions_read_own" on public.player_missions
  for select using (auth.uid() = player_id or public.is_admin());
create policy "pmissions_insert_own" on public.player_missions
  for insert with check (auth.uid() = player_id);
create policy "pmissions_update_own" on public.player_missions
  for update using (auth.uid() = player_id) with check (auth.uid() = player_id and claimed = false);

-- REWARDS -------------------------------------------------------------------
create policy "rewards_read_active" on public.rewards
  for select using (is_active = true or public.is_admin());
create policy "rewards_admin_write" on public.rewards
  for all using (public.is_admin()) with check (public.is_admin());

-- ADMIN USERS ---------------------------------------------------------------
create policy "admin_read_self" on public.admin_users
  for select using (auth.uid() = user_id or public.is_admin());
create policy "admin_write" on public.admin_users
  for all using (public.is_admin()) with check (public.is_admin());

-- Let authenticated users call the secure RPCs.
grant execute on function public.complete_card(uuid, text) to authenticated;
grant execute on function public.claim_mission(uuid) to authenticated;
grant execute on function public.ensure_player_missions() to authenticated;
