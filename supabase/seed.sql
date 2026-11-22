-- =============================================================================
-- Gimikko — sample data ("population")
--
-- HOW TO RUN: after schema.sql, paste this into the SQL Editor and Run.
-- Safe to re-run: every insert skips rows that already exist.
--
-- This gives the app something to show on day one: localities, categories,
-- some events, a few "demo people" who reviewed and joined them.
-- The demo people are NOT real accounts (they have no login) — create your
-- own account in the app's sign-up screen. Your account starts empty: zero
-- saved, zero joined, zero posted.
--
-- Event dates are RELATIVE to today (current_date + N), so the samples
-- always show up as upcoming whenever you seed. Image URLs are picsum.photos
-- placeholders; events you create in the app use real uploaded photos.
-- =============================================================================


-- ---- Categories -----------------------------------------------------------
insert into public.categories (key, label) values
  ('sport',  'Sport'),
  ('market', 'Market'),
  ('music',  'Music')
on conflict (key) do nothing;


-- ---- Locations (localities events can happen in) ---------------------------
insert into public.locations (name, province) values
  ('Calbayog City',   'Samar'),
  ('Catbalogan City', 'Samar'),
  ('Borongan City',   'Eastern Samar'),
  ('Tacloban City',   'Leyte')
on conflict (name, province) do nothing;


-- ---- Demo people (fixed IDs so the rows below can point at them) -----------
insert into public.profiles (id, username, display_name, bio, location_id) values
  ('11111111-1111-4111-8111-111111111111', 'nigel_gimik', 'Nigel', 'Always looking for new gimik and local events.',
    (select id from public.locations where name = 'Calbayog City')),
  ('22222222-2222-4222-8222-222222222222', 'maria', 'Maria', null,
    (select id from public.locations where name = 'Calbayog City')),
  ('33333333-3333-4333-8333-333333333333', 'jero', 'Jero', null,
    (select id from public.locations where name = 'Catbalogan City')),
  ('44444444-4444-4444-8444-444444444444', 'dax', 'Dax', null,
    (select id from public.locations where name = 'Calbayog City'))
on conflict (id) do update
  set location_id = coalesce(public.profiles.location_id, excluded.location_id);


-- ---- Events ---------------------------------------------------------------
-- category_id and location_id are looked up by name, so this works whatever
-- ids Postgres assigned. Mixed localities so the filters have something to do.
insert into public.events (id, name, event_date, image_url, category_id, location_id, created_by) values
  ('e0000000-0000-4000-8000-000000000001', 'Hadang Championship',
    current_date + 7,  'https://picsum.photos/seed/gimikko-hadang/800/600',
    (select id from public.categories where key = 'sport'),
    (select id from public.locations where name = 'Calbayog City'),
    '11111111-1111-4111-8111-111111111111'),

  ('e0000000-0000-4000-8000-000000000002', 'Sunday Palengke Bazaar',
    current_date + 10, 'https://picsum.photos/seed/gimikko-bazaar/800/600',
    (select id from public.categories where key = 'market'),
    (select id from public.locations where name = 'Calbayog City'),
    '22222222-2222-4222-8222-222222222222'),

  ('e0000000-0000-4000-8000-000000000003', 'Hanumduman Live Night',
    current_date + 14, 'https://picsum.photos/seed/gimikko-live/800/600',
    (select id from public.categories where key = 'music'),
    (select id from public.locations where name = 'Catbalogan City'),
    '33333333-3333-4333-8333-333333333333'),

  ('e0000000-0000-4000-8000-000000000004', 'Hidden Talent Fair',
    current_date + 18, 'https://picsum.photos/seed/gimikko-talent/800/600',
    (select id from public.categories where key = 'market'),
    (select id from public.locations where name = 'Calbayog City'),
    '44444444-4444-4444-8444-444444444444'),

  ('e0000000-0000-4000-8000-000000000005', 'Nigel''s Match Night',
    current_date + 21, 'https://picsum.photos/seed/gimikko-match/800/600',
    (select id from public.categories where key = 'sport'),
    (select id from public.locations where name = 'Calbayog City'),
    '11111111-1111-4111-8111-111111111111'),

  ('e0000000-0000-4000-8000-000000000006', 'Food Festival',
    current_date + 25, 'https://picsum.photos/seed/gimikko-food/800/600',
    (select id from public.categories where key = 'market'),
    (select id from public.locations where name = 'Tacloban City'),
    '22222222-2222-4222-8222-222222222222')
-- If a row already exists, only fill in a missing locality — never overwrite real data.
on conflict (id) do update
  set location_id = coalesce(public.events.location_id, excluded.location_id);


-- ---- Reviews (one per person per event) -------------------------------------
insert into public.event_reviews (event_id, reviewer_id, rating, comment) values
  ('e0000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 5, 'Found a bazaar near my place I never knew about. Super helpful app!'),
  ('e0000000-0000-4000-8000-000000000005', '33333333-3333-4333-8333-333333333333', 4, 'The event reminders saved me from missing the match night last week.'),
  ('e0000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 3, 'Nice layout, would love to see more sports events added soon.'),
  ('e0000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 4, 'Great turnout and a really fun crowd.'),
  ('e0000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', 5, 'Best live night in town.'),
  ('e0000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 4, 'Lots of local talent worth watching.')
on conflict (event_id, reviewer_id) do nothing;


-- ---- Who joined what (drives the "Trending" ranking) -------------------------
-- Hadang 3, Bazaar 2, Match Night 2, Live Night 1, the rest 0.
insert into public.event_attendees (profile_id, event_id) values
  ('11111111-1111-4111-8111-111111111111', 'e0000000-0000-4000-8000-000000000001'),
  ('22222222-2222-4222-8222-222222222222', 'e0000000-0000-4000-8000-000000000001'),
  ('33333333-3333-4333-8333-333333333333', 'e0000000-0000-4000-8000-000000000001'),
  ('22222222-2222-4222-8222-222222222222', 'e0000000-0000-4000-8000-000000000002'),
  ('44444444-4444-4444-8444-444444444444', 'e0000000-0000-4000-8000-000000000002'),
  ('11111111-1111-4111-8111-111111111111', 'e0000000-0000-4000-8000-000000000005'),
  ('44444444-4444-4444-8444-444444444444', 'e0000000-0000-4000-8000-000000000005'),
  ('33333333-3333-4333-8333-333333333333', 'e0000000-0000-4000-8000-000000000003')
on conflict (profile_id, event_id) do nothing;
