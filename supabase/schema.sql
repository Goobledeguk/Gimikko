-- =============================================================================
-- Gimikko — database schema (PostgreSQL on Supabase)
--
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> paste this whole file -> Run.
-- Run this FIRST, then supabase/seed.sql. Safe to re-run (it won't duplicate
-- or wipe anything).
--
-- RELATIONSHIPS (-> means "has a foreign key pointing to"):
--
--   categories <-- events --> profiles          an event has one category + one creator
--   events <-- event_reviews --> profiles       a profile reviews an event (1 review each)
--   profiles <-- saved_events --> events        many-to-many: who saved which events
--
-- The app currently reads/writes `events` + the `categories` join + Storage.
-- The other tables are ready for the Calendar stars, Home comments and the
-- Profile "saved" list when those screens get wired up.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- People. (No login yet, so `id` is a plain generated uuid. When you add
-- Supabase Auth, change it to:  id uuid primary key references auth.users(id) on delete cascade)
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  username     text not null unique check (char_length(username) between 3 and 30),
  display_name text not null,
  location     text,
  bio          text,
  created_at   timestamptz not null default now()
);

-- Lookup table for event types (Sport / Market / Music). Keeping these in
-- their own table means a category is stored once and events just point to it.
create table if not exists public.categories (
  id    smallint generated always as identity primary key,
  key   text not null unique,   -- machine name, e.g. 'sport'
  label text not null           -- display name, e.g. 'Sport'
);

-- The main table — one row per event. The create-event form fills name,
-- event_date and image_url.
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  event_date  date not null,
  image_url   text not null check (image_url ~ '^https?://'),
  category_id smallint references public.categories (id) on delete set null,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- One review (1-5 stars + optional comment) per person per event.
create table if not exists public.event_reviews (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (event_id, reviewer_id)
);

-- Junction table for the many-to-many "saved events". The composite primary
-- key means a profile can't save the same event twice.
create table if not exists public.saved_events (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_id   uuid not null references public.events (id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (profile_id, event_id)
);


-- ---------------------------------------------------------------------------
-- INDEXES — speed up the lookups the app does (sorting events, joins, and
-- Postgres' own checks when a parent row is deleted).
-- ---------------------------------------------------------------------------
create index if not exists events_created_at_idx   on public.events (created_at desc);
create index if not exists events_event_date_idx   on public.events (event_date);
create index if not exists events_category_id_idx  on public.events (category_id);
create index if not exists events_created_by_idx   on public.events (created_by);
create index if not exists event_reviews_event_idx on public.event_reviews (event_id);
create index if not exists saved_events_event_idx  on public.saved_events (event_id);


-- ---------------------------------------------------------------------------
-- VIEW — average stars + review count per event, ready for the Calendar cards.
-- security_invoker makes the view obey the caller's row-level security
-- instead of bypassing it.
-- ---------------------------------------------------------------------------
create or replace view public.event_stats
with (security_invoker = true) as
select
  e.id                              as event_id,
  coalesce(round(avg(r.rating), 1), 0) as avg_rating,
  count(r.id)                       as review_count
from public.events e
left join public.event_reviews r on r.event_id = e.id
group by e.id;


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- The publishable key ships inside the app, so anyone can use it. RLS is what
-- decides what that key is actually allowed to do. With RLS on and no policy,
-- the answer is "nothing" — so each policy below is a deliberate permission.
-- ---------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.events        enable row level security;
alter table public.event_reviews enable row level security;
alter table public.saved_events  enable row level security;

-- Anyone can READ profiles, categories, events and reviews.
drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable"
  on public.profiles for select to anon, authenticated using (true);

drop policy if exists "categories are publicly readable" on public.categories;
create policy "categories are publicly readable"
  on public.categories for select to anon, authenticated using (true);

drop policy if exists "events are publicly readable" on public.events;
create policy "events are publicly readable"
  on public.events for select to anon, authenticated using (true);

drop policy if exists "reviews are publicly readable" on public.event_reviews;
create policy "reviews are publicly readable"
  on public.event_reviews for select to anon, authenticated using (true);

-- Anyone can CREATE an event (this is what the form needs). There is
-- intentionally NO update or delete policy, so nobody can edit or remove
-- events through the app. The CHECK constraints on the table still apply.
-- NOTE: until the app has logins, "anyone" means anyone with the app's key.
-- When you add auth, tighten this to:  to authenticated with check (created_by = auth.uid())
drop policy if exists "anyone can create events" on public.events;
create policy "anyone can create events"
  on public.events for insert to anon, authenticated with check (true);

-- event_reviews (writes) and saved_events (everything) have no policies yet,
-- so they're locked until you build those features with real user logins.


-- ---------------------------------------------------------------------------
-- STORAGE — the bucket that holds event cover images.
-- public = true means each file gets a URL anyone can load (that's the URL
-- saved in events.image_url). Limits: 5 MB, jpeg/png/webp only.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "event images are publicly readable" on storage.objects;
create policy "event images are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'event-images');

-- Upload only — no update/delete policy, so existing images can't be replaced or removed.
drop policy if exists "anyone can upload event images" on storage.objects;
create policy "anyone can upload event images"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'event-images');
