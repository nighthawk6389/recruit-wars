-- ════════════════════════════════════════════════════════════════
--  RECRUIT WARS — Supabase / Postgres schema
--  Run in Supabase SQL Editor (or `supabase db push`).
--  Mirrors the TypeScript shapes in src/lib/types.ts.
-- ════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── ENUMS ───────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('fan', 'athlete', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type support_tier as enum ('message', 'video', 'vip', 'captain');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('approved', 'pending', 'removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recruiting_status as enum ('Uncommitted', 'Committed', 'Signed', 'Enrolled');
exception when duplicate_object then null; end $$;

-- ── PROFILES (extends auth.users) ───────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'fan',
  full_name text,
  email text,
  banned boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── SCHOOLS ─────────────────────────────────────────────────────
create table if not exists schools (
  id text primary key,                 -- e.g. 'lsu'
  name text not null,                  -- 'LSU'
  full_name text not null,
  abbrev text not null,
  color text not null,                 -- hex
  state text not null,                 -- 2-letter
  created_at timestamptz not null default now()
);

-- ── ATHLETES ────────────────────────────────────────────────────
create table if not exists athletes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  slug text unique not null,
  name text not null,
  position text not null,
  class_year text not null,
  hometown text,
  state text,
  height text,
  weight text,
  stars int not null default 0 check (stars between 0 and 5),
  rating numeric(4,1) not null default 0,
  bio text,
  photo_url text,
  logo_url text,
  recruiting_status recruiting_status not null default 'Uncommitted',
  committed_to text references schools(id),
  nil_valuation bigint not null default 0,
  highlight_video_url text,
  offers text[] not null default '{}',          -- school ids
  socials jsonb not null default '{}'::jsonb,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists athletes_approved_idx on athletes(approved);
create index if not exists athletes_slug_idx on athletes(slug);

-- ── SUPPORTERS (purchases / engagements) ────────────────────────
create table if not exists supporters (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references athletes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  fan_name text not null,
  email text,
  school_id text not null references schools(id),
  tier support_tier not null,
  amount numeric(10,2) not null,
  message text,
  video_url text,
  city text,
  state text,
  vip boolean not null default false,
  status content_status not null default 'pending',
  stripe_session_id text,
  stripe_payment_intent text,
  promo_code text,
  created_at timestamptz not null default now()
);
create index if not exists supporters_athlete_idx on supporters(athlete_id);
create index if not exists supporters_school_idx on supporters(school_id);
create index if not exists supporters_status_idx on supporters(status);

-- ── ACTIVITY FEED ───────────────────────────────────────────────
create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references athletes(id) on delete cascade,
  type text not null,                  -- message|video|vip|captain|milestone|rank_change
  school_id text references schools(id),
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists activity_athlete_idx on activity(athlete_id, created_at desc);

-- ── PROMO CODES ─────────────────────────────────────────────────
create table if not exists promo_codes (
  code text primary key,
  percent_off int check (percent_off between 0 and 100),
  amount_off numeric(10,2),
  max_redemptions int,
  redemptions int not null default 0,
  active boolean not null default true,
  expires_at timestamptz
);

-- ── REFERRALS ───────────────────────────────────────────────────
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid references auth.users(id) on delete set null,
  code text unique not null,
  clicks int not null default 0,
  conversions int not null default 0,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════
--  LEADERBOARD VIEWS  (computed server-side, fast to query)
-- ════════════════════════════════════════════════════════════════

-- Per-athlete, per-school fanbase standings.
create or replace view fanbase_standings as
select
  s.athlete_id,
  s.school_id,
  sum(s.amount)                                   as total_dollars,
  count(*)                                        as supporters,
  count(*) filter (where s.message is not null)   as messages,
  count(*) filter (where s.video_url is not null) as videos,
  sum(case s.tier
        when 'message' then 1
        when 'video'   then 2
        when 'vip'     then 5
        when 'captain' then 10
      end)                                        as engagement_score
from supporters s
where s.status = 'approved'
group by s.athlete_id, s.school_id;

-- Global (cross-athlete) school standings for the public leaderboard.
create or replace view global_school_standings as
select
  s.school_id,
  sum(s.amount)                                   as total_dollars,
  count(*)                                        as supporters,
  count(*) filter (where s.video_url is not null) as videos,
  sum(case s.tier
        when 'message' then 1 when 'video' then 2
        when 'vip' then 5 when 'captain' then 10 end) as engagement_score
from supporters s
where s.status = 'approved'
group by s.school_id;

-- Per-athlete headline stats.
create or replace view athlete_stats as
select
  s.athlete_id,
  count(*)                                        as total_supporters,
  count(*) filter (where s.message is not null)   as total_messages,
  count(*) filter (where s.video_url is not null) as total_videos,
  sum(s.amount)                                   as total_revenue
from supporters s
where s.status = 'approved'
group by s.athlete_id;

-- State-level heatmap.
create or replace view supporter_heatmap as
select athlete_id, state, count(*) as supporters, sum(amount) as dollars
from supporters
where status = 'approved' and state is not null
group by athlete_id, state;

-- ════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════
alter table profiles    enable row level security;
alter table athletes    enable row level security;
alter table supporters  enable row level security;
alter table activity    enable row level security;
alter table schools     enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean language sql stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Schools: public read, admin write.
drop policy if exists schools_read on schools;
create policy schools_read on schools for select using (true);
drop policy if exists schools_admin on schools;
create policy schools_admin on schools for all using (is_admin()) with check (is_admin());

-- Athletes: public can read approved; owner & admin can read/write theirs.
drop policy if exists athletes_read on athletes;
create policy athletes_read on athletes for select using (approved or user_id = auth.uid() or is_admin());
drop policy if exists athletes_owner on athletes;
create policy athletes_owner on athletes for update using (user_id = auth.uid() or is_admin());
drop policy if exists athletes_admin on athletes;
create policy athletes_admin on athletes for all using (is_admin()) with check (is_admin());

-- Supporters: public can read approved; the athlete owner & admin see all;
-- inserts happen via service-role (webhook), so no public insert policy.
drop policy if exists supporters_read on supporters;
create policy supporters_read on supporters for select using (
  status = 'approved'
  or is_admin()
  or exists (select 1 from athletes a where a.id = supporters.athlete_id and a.user_id = auth.uid())
);
drop policy if exists supporters_admin on supporters;
create policy supporters_admin on supporters for all using (is_admin()) with check (is_admin());

-- Activity: public read, admin/service write.
drop policy if exists activity_read on activity;
create policy activity_read on activity for select using (true);
drop policy if exists activity_admin on activity;
create policy activity_admin on activity for all using (is_admin()) with check (is_admin());

-- Profiles: users read/update self; admins all.
drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles for select using (id = auth.uid() or is_admin());
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update using (id = auth.uid() or is_admin());

-- Auto-create a profile row on signup.
create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
