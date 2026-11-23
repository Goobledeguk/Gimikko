-- =============================================================================
-- Gimikko — database schema (PostgreSQL on Supabase)
--
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> paste this whole file -> Run.
-- Run this FIRST, then supabase/seed.sql. Safe to re-run: it never wipes your
-- data, and re-running it is also how an existing database picks up changes.
--
-- RELATIONSHIPS (-> means "has a foreign key pointing to"):
--
--   locations  <-- profiles        a person lives in one locality
--   locations  <-- events          an event happens in one locality
--   categories <-- events          an event has one category (sport / market / music)
--   profiles   <-- events          an event was created by one person
--   events <-- event_reviews --> profiles     a person reviews an event (once each)
--   events <-- saved_events  --> profiles     many-to-many: who bookmarked what (private)
--   events <-- event_attendees --> profiles   many-to-many: who joined what (public)
--
-- ACCOUNTS: people sign up through Supabase Auth (the `auth.users` table that
-- Supabase manages). A trigger below then creates their matching row in
-- `profiles` automatically, using the details entered on the sign-up screen.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- LOOKUP TABLES — stored once, then pointed at by other tables.
-- To support a new area or event type, insert a row here from the dashboard;
-- the app picks it up with no code change.
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id    smallint generated always as identity primary key,
  key   text not null unique,   -- machine name, e.g. 'sport'
  label text not null           -- display name, e.g. 'Sport'
);

create table if not exists public.locations (
  id       smallint generated always as identity primary key,
  name     text not null check (char_length(btrim(name)) > 0),  -- 'Calbayog City'
  province text not null,                                       -- 'Samar'
  unique (name, province)
);


-- ---------------------------------------------------------------------------
-- PROFILES — one row per person (created by the sign-up trigger below).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  username     text not null unique check (char_length(username) between 3 and 30),
  display_name text not null,
  bio          text,
  location_id  smallint references public.locations (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- Upgrade path for databases created before accounts existed: profiles used
-- to keep a plain-text `location`; it now points into the locations table.
alter table public.profiles
  add column if not exists location_id smallint references public.locations (id) on delete set null;
alter table public.profiles drop column if exists location;


-- ---------------------------------------------------------------------------
-- EVENTS
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  event_date  date not null,
  image_url   text not null check (image_url ~ '^https?://'),
  category_id smallint references public.categories (id) on delete set null,
  location_id smallint references public.locations (id) on delete set null,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Older databases may predate location_id (no-op on a fresh one).
alter table public.events
  add column if not exists location_id smallint references public.locations (id) on delete set null;

-- The creator is filled in by the database itself: whoever is logged in when
-- the row is inserted. The app never has to (and can't lie about) who made it.
alter table public.events alter column created_by set default auth.uid();


-- ---------------------------------------------------------------------------
-- REVIEWS, SAVES, ATTENDANCE
-- ---------------------------------------------------------------------------

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

-- "Saved" bookmarks. The composite primary key means you can't save the same
-- event twice. Private: each person can only see their own.
create table if not exists public.saved_events (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_id   uuid not null references public.events (id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (profile_id, event_id)
);

-- "Joined" (going to) an event. Public, like a guest list, so the app can
-- rank events by how many people joined ("Trending").
create table if not exists public.event_attendees (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_id   uuid not null references public.events (id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (profile_id, event_id)
);


-- ---------------------------------------------------------------------------
-- INDEXES — speed up the lookups the app does (sorting, joins, and Postgres'
-- own checks when a parent row is deleted).
-- ---------------------------------------------------------------------------
create index if not exists events_created_at_idx      on public.events (created_at desc);
create index if not exists events_event_date_idx      on public.events (event_date);
create index if not exists events_category_id_idx     on public.events (category_id);
create index if not exists events_location_id_idx     on public.events (location_id);
create index if not exists events_created_by_idx      on public.events (created_by);
create index if not exists profiles_location_id_idx   on public.profiles (location_id);
create index if not exists event_reviews_event_idx    on public.event_reviews (event_id);
create index if not exists saved_events_event_idx     on public.saved_events (event_id);
create index if not exists event_attendees_event_idx  on public.event_attendees (event_id);


-- ---------------------------------------------------------------------------
-- SIGN-UP TRIGGER — when Supabase Auth creates an account, make the profile.
-- The sign-up screen passes display_name / username / location_id along as
-- "user metadata"; this copies them across. If something is missing (for
-- example an account created by hand in the dashboard) it falls back to
-- sensible values instead of failing.
-- security definer = runs with the owner's rights, because the person has no
-- permission to insert profiles themselves (and shouldn't).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, location_id)
  values (
    new.id,
    lower(coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), 'user_' || substr(new.id::text, 1, 8))),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(coalesce(new.email, 'new user'), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'location_id', '')::smallint
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- VIEWS — numbers calculated by the database, so the app just reads them.
-- security_invoker makes each view obey the caller's row-level security
-- instead of bypassing it.
-- ---------------------------------------------------------------------------

-- Per event: average stars, review count, how many joined — plus the date and
-- image, so "Trending" is a single query (most joined first).
-- (New columns are added at the END so an older version of this view can be
-- replaced in place.)
create or replace view public.event_stats
with (security_invoker = true) as
select
  e.id as event_id,
  coalesce((select round(avg(r.rating), 1) from public.event_reviews r where r.event_id = e.id), 0) as avg_rating,
  (select count(*) from public.event_reviews r where r.event_id = e.id)   as review_count,
  (select count(*) from public.event_attendees a where a.event_id = e.id) as join_count,
  e.event_date,
  e.image_url
from public.events e;

-- Per person: the four numbers on the Home dashboard and Profile screen.
-- avg_rating = the average stars on events THEY created (0 if none yet).
create or replace view public.profile_stats
with (security_invoker = true) as
select
  p.id as profile_id,
  (select count(*) from public.saved_events s     where s.profile_id = p.id) as saved_count,
  (select count(*) from public.event_attendees a  where a.profile_id = p.id) as joined_count,
  (select count(*) from public.events e           where e.created_by = p.id) as posted_count,
  coalesce((
    select round(avg(r.rating), 1)
    from public.event_reviews r
    join public.events e on e.id = r.event_id
    where e.created_by = p.id
  ), 0) as avg_rating
from public.profiles p;


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- The publishable key ships inside the app, so anyone can use it. RLS decides
-- what a visitor (anon) or a logged-in person (authenticated) may actually do.
-- With RLS on and no policy the answer is "nothing", so every policy below is
-- a deliberate permission. auth.uid() = the id of whoever is logged in.
-- ---------------------------------------------------------------------------
alter table public.categories      enable row level security;
alter table public.locations       enable row level security;
alter table public.profiles        enable row level security;
alter table public.events          enable row level security;
alter table public.event_reviews   enable row level security;
alter table public.saved_events    enable row level security;
alter table public.event_attendees enable row level security;

-- Readable by everyone (visitors too — the sign-up screen needs locations and
-- the username check). Nobody can write these through the app.
drop policy if exists "categories are publicly readable" on public.categories;
create policy "categories are publicly readable"
  on public.categories for select to anon, authenticated using (true);

drop policy if exists "locations are publicly readable" on public.locations;
create policy "locations are publicly readable"
  on public.locations for select to anon, authenticated using (true);

drop policy if exists "events are publicly readable" on public.events;
create policy "events are publicly readable"
  on public.events for select to anon, authenticated using (true);

drop policy if exists "reviews are publicly readable" on public.event_reviews;
create policy "reviews are publicly readable"
  on public.event_reviews for select to anon, authenticated using (true);

drop policy if exists "attendees are publicly readable" on public.event_attendees;
create policy "attendees are publicly readable"
  on public.event_attendees for select to anon, authenticated using (true);

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable"
  on public.profiles for select to anon, authenticated using (true);

-- Profiles: you can edit only your own. (They're created by the trigger, so
-- there is deliberately no insert policy.)
drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Events: any logged-in person can create one, as themselves. No update or
-- delete policy, so events can't be edited or removed through the app.
drop policy if exists "anyone can create events" on public.events;
drop policy if exists "signed-in users can create events" on public.events;
create policy "signed-in users can create events"
  on public.events for insert to authenticated
  with check (created_by = auth.uid());

-- Saved events: private to their owner, who can add and remove their own.
drop policy if exists "users can read their own saved events" on public.saved_events;
create policy "users can read their own saved events"
  on public.saved_events for select to authenticated using (profile_id = auth.uid());

drop policy if exists "users can save events" on public.saved_events;
create policy "users can save events"
  on public.saved_events for insert to authenticated with check (profile_id = auth.uid());

drop policy if exists "users can unsave events" on public.saved_events;
create policy "users can unsave events"
  on public.saved_events for delete to authenticated using (profile_id = auth.uid());

-- Attendance: anyone can see who joined; you can only join/leave as yourself.
drop policy if exists "users can join events" on public.event_attendees;
create policy "users can join events"
  on public.event_attendees for insert to authenticated with check (profile_id = auth.uid());

drop policy if exists "users can leave events" on public.event_attendees;
create policy "users can leave events"
  on public.event_attendees for delete to authenticated using (profile_id = auth.uid());

-- Reviews: a logged-in person can write one as themselves, and can edit or
-- remove only their own. The unique (event_id, reviewer_id) constraint keeps
-- it to one review per person per event; the app updates instead of adding.
drop policy if exists "users can write reviews" on public.event_reviews;
create policy "users can write reviews"
  on public.event_reviews for insert to authenticated
  with check (reviewer_id = auth.uid());

drop policy if exists "users can update their own reviews" on public.event_reviews;
create policy "users can update their own reviews"
  on public.event_reviews for update to authenticated
  using (reviewer_id = auth.uid()) with check (reviewer_id = auth.uid());

drop policy if exists "users can delete their own reviews" on public.event_reviews;
create policy "users can delete their own reviews"
  on public.event_reviews for delete to authenticated
  using (reviewer_id = auth.uid());


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

-- Upload only, and only for logged-in people — no update/delete policy, so
-- existing images can't be replaced or removed.
drop policy if exists "anyone can upload event images" on storage.objects;
drop policy if exists "signed-in users can upload event images" on storage.objects;
create policy "signed-in users can upload event images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'event-images');
