// =============================================================================
// services/account.js — everything about the logged-in PERSON: signing up,
// logging in/out, their profile, their numbers, and what they've saved/joined.
// (Event data itself lives in services/events.js.)
// =============================================================================
import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------

// Creates the account in Supabase Auth. The extra details ride along as
// "user metadata"; a database trigger (see supabase/schema.sql) copies them
// into the person's `profiles` row. Returns { user, session } — `session` is
// null when the project requires email confirmation first.
export async function signUp({ email, password, displayName, username, locationId }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, username, location_id: locationId },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Used by the sign-up screen to give a friendly "already taken" message
// instead of a database error. (Profiles are publicly readable, so even a
// visitor who isn't logged in yet can ask.)
export async function isUsernameTaken(username) {
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('username', username);

  if (error) throw error;
  return count > 0;
}

// ---------------------------------------------------------------------------
// PROFILE
// ---------------------------------------------------------------------------

// `location:locations(name, province)` is a JOIN — it brings the person's
// locality along, e.g. { ..., location: { name: 'Calbayog City', province: 'Samar' } }
const PROFILE_COLUMNS =
  'id, username, display_name, bio, location_id, location:locations(name, province)';

// Returns the profile, or null if there isn't one.
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Only touches your own row (the database refuses anything else). `.single()`
// makes a refused/missing row an error instead of a silent "nothing happened".
export async function updateProfile(userId, { displayName, bio, locationId }) {
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName.trim(),
      bio: bio.trim() === '' ? null : bio.trim(),
      location_id: locationId,
    })
    .eq('id', userId)
    .select('id')
    .single();

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// NUMBERS — read from the `profile_stats` view, which the database calculates.
// ---------------------------------------------------------------------------
export async function fetchMyStats(userId) {
  const { data, error } = await supabase
    .from('profile_stats')
    .select('saved_count, joined_count, posted_count, avg_rating')
    .eq('profile_id', userId)
    .maybeSingle();

  if (error) throw error;

  // Postgres sends counts/averages as numbers or numeric strings; make them numbers.
  return {
    saved_count: Number(data?.saved_count ?? 0),
    joined_count: Number(data?.joined_count ?? 0),
    posted_count: Number(data?.posted_count ?? 0),
    avg_rating: Number(data?.avg_rating ?? 0), // 0 = nobody has reviewed their events yet
  };
}

// ---------------------------------------------------------------------------
// SAVED + JOINED
// ---------------------------------------------------------------------------

// The events I bookmarked, newest bookmark first (the Profile list).
export async function fetchMySavedEvents(userId) {
  const { data, error } = await supabase
    .from('saved_events')
    .select('saved_at, event:events(id, name, event_date, category:categories(key), location:locations(name))')
    .eq('profile_id', userId)
    .order('saved_at', { ascending: false });

  if (error) throw error;
  return data.map((row) => row.event).filter(Boolean);
}

// Which events I saved / joined, as two Sets of ids — lets the Discover grid
// show the right button state for every card without a request per card.
export async function fetchMyEventFlags(userId) {
  const [saved, joined] = await Promise.all([
    supabase.from('saved_events').select('event_id').eq('profile_id', userId),
    supabase.from('event_attendees').select('event_id').eq('profile_id', userId),
  ]);

  if (saved.error) throw saved.error;
  if (joined.error) throw joined.error;

  return {
    savedIds: new Set(saved.data.map((row) => row.event_id)),
    joinedIds: new Set(joined.data.map((row) => row.event_id)),
  };
}

// Save / unsave one event (the same for "joined" below). `on` = true adds the
// row, false removes it.
async function setLink(table, userId, eventId, on) {
  const query = on
    ? supabase.from(table).insert({ profile_id: userId, event_id: eventId })
    : supabase.from(table).delete().eq('profile_id', userId).eq('event_id', eventId);

  const { error } = await query;
  if (error) throw error;
}

export const setSaved = (userId, eventId, on) => setLink('saved_events', userId, eventId, on);
export const setJoined = (userId, eventId, on) => setLink('event_attendees', userId, eventId, on);
