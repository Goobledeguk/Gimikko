-- =============================================================================
-- Gimikko — sample data ("population")
--
-- HOW TO RUN: after schema.sql, paste this into the SQL Editor and Run.
-- Safe to re-run: every insert skips rows that already exist.
--
-- Rows use fixed IDs so they can point at each other (an event's creator, a
-- review's event, ...). Event dates are RELATIVE to today (current_date + N)
-- so the sample events always show up as upcoming, whenever you seed.
-- Image URLs are picsum.photos placeholders — swap in real photos anytime;
-- new events made through the app's form use real uploaded images instead.
-- =============================================================================


-- ---- Categories -----------------------------------------------------------
insert into public.categories (key, label) values
  ('sport',  'Sport'),
  ('market', 'Market'),
  ('music',  'Music')
on conflict (key) do nothing;


-- ---- Profiles -------------------------------------------------------------
insert into public.profiles (id, username, display_name, location, bio) values
  ('11111111-1111-4111-8111-111111111111', 'nigel_gimik', 'Nigel', 'Calbayog City, Samar', 'Always looking for new gimik and local events.'),
  ('22222222-2222-4222-8222-222222222222', 'maria',       'Maria', 'Calbayog City, Samar', null),
  ('33333333-3333-4333-8333-333333333333', 'jero',        'Jero',  'Calbayog City, Samar', null),
  ('44444444-4444-4444-8444-444444444444', 'dax',         'Dax',   'Calbayog City, Samar', null)
on conflict (id) do nothing;


-- ---- Events ---------------------------------------------------------------
-- category_id is looked up by key, so this works whatever ids Postgres assigned.
insert into public.events (id, name, event_date, image_url, category_id, created_by) values
  ('e0000000-0000-4000-8000-000000000001', 'Hadang Championship',
    current_date + 7,  'https://picsum.photos/seed/gimikko-hadang/800/600',
    (select id from public.categories where key = 'sport'),  '11111111-1111-4111-8111-111111111111'),

  ('e0000000-0000-4000-8000-000000000002', 'Sunday Palengke Bazaar',
    current_date + 10, 'https://picsum.photos/seed/gimikko-bazaar/800/600',
    (select id from public.categories where key = 'market'), '22222222-2222-4222-8222-222222222222'),

  ('e0000000-0000-4000-8000-000000000003', 'Hanumduman Live Night',
    current_date + 14, 'https://picsum.photos/seed/gimikko-live/800/600',
    (select id from public.categories where key = 'music'),  '33333333-3333-4333-8333-333333333333'),

  ('e0000000-0000-4000-8000-000000000004', 'Hidden Talent Fair',
    current_date + 18, 'https://picsum.photos/seed/gimikko-talent/800/600',
    (select id from public.categories where key = 'market'), '44444444-4444-4444-8444-444444444444'),

  ('e0000000-0000-4000-8000-000000000005', 'Nigel''s Match Night',
    current_date + 21, 'https://picsum.photos/seed/gimikko-match/800/600',
    (select id from public.categories where key = 'sport'),  '11111111-1111-4111-8111-111111111111'),

  ('e0000000-0000-4000-8000-000000000006', 'Food Festival',
    current_date + 25, 'https://picsum.photos/seed/gimikko-food/800/600',
    (select id from public.categories where key = 'market'), '22222222-2222-4222-8222-222222222222')
on conflict (id) do nothing;


-- ---- Reviews (one per person per event) -------------------------------------
insert into public.event_reviews (event_id, reviewer_id, rating, comment) values
  ('e0000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 5, 'Found a bazaar near my place I never knew about. Super helpful app!'),
  ('e0000000-0000-4000-8000-000000000005', '33333333-3333-4333-8333-333333333333', 4, 'The event reminders saved me from missing the match night last week.'),
  ('e0000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 3, 'Nice layout, would love to see more sports events added soon.'),
  ('e0000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 4, 'Great turnout and a really fun crowd.'),
  ('e0000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', 5, 'Best live night in town.'),
  ('e0000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 4, 'Lots of local talent worth watching.')
on conflict (event_id, reviewer_id) do nothing;


-- ---- Saved events (Nigel's "My Saved Gimik") -------------------------------
insert into public.saved_events (profile_id, event_id) values
  ('11111111-1111-4111-8111-111111111111', 'e0000000-0000-4000-8000-000000000003'),
  ('11111111-1111-4111-8111-111111111111', 'e0000000-0000-4000-8000-000000000002')
on conflict (profile_id, event_id) do nothing;
