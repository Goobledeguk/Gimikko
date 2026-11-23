// =============================================================================
// services/events.js — every database/storage call for events lives here.
// Screens and components import these functions instead of talking to
// Supabase directly, so if a table or column changes, this is the only
// file that needs editing.
// =============================================================================
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { localTodayISO } from '../utils/date';

const BUCKET = 'event-images'; // created in supabase/schema.sql
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']; // must match the bucket's allowed types

// The columns every event query asks for. `category:categories(...)` and
// `location:locations(...)` are JOINs: because events.category_id and
// events.location_id are foreign keys, Supabase pulls the related row along
// in the same request. An event comes back shaped like:
//   { id, name, event_date, image_url,
//     category: { key, label } | null,  location: { name } | null }
const EVENT_COLUMNS =
  'id, name, event_date, image_url, category:categories(key, label), location:locations(name)';

// ---------------------------------------------------------------------------
// fetchLocations — the list of localities (cities/municipalities), used by
// the form's locality picker and the Calendar's filter chips. They almost
// never change, so it's fetched once per app launch and reused. (If you add
// a locality in the Supabase dashboard, it shows up the next time the app
// is reopened.)
// ---------------------------------------------------------------------------
let cachedLocations = null;

export async function fetchLocations() {
  if (cachedLocations) return cachedLocations;

  const { data, error } = await supabase
    .from('locations')
    .select('id, name, province')
    .order('name');

  if (error) throw error;
  cachedLocations = data;
  return data;
}

// ---------------------------------------------------------------------------
// fetchEvents — every event, newest first (the Discover grid).
// ---------------------------------------------------------------------------
export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// fetchUpcomingEvents — what the Calendar tab shows: events happening today
// or later, soonest first, each with its average star rating.
// Pass { locationId } to see only that locality; leave it out for all.
// Two requests: the events, then their rating summaries from the
// `event_stats` view (the database does the averaging), merged here.
// ---------------------------------------------------------------------------
export async function fetchUpcomingEvents({ locationId } = {}) {
  let query = supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .gte('event_date', localTodayISO()) // 'YYYY-MM-DD' strings compare correctly as dates
    .order('event_date', { ascending: true });

  if (locationId) query = query.eq('location_id', locationId);

  const { data: events, error } = await query;
  if (error) throw error;
  if (events.length === 0) return [];

  const { data: stats, error: statsError } = await supabase
    .from('event_stats')
    .select('event_id, avg_rating, review_count')
    .in('event_id', events.map((event) => event.id));

  if (statsError) throw statsError;

  const statsByEventId = Object.fromEntries(stats.map((row) => [row.event_id, row]));

  return events.map((event) => ({
    ...event,
    avg_rating: Number(statsByEventId[event.id]?.avg_rating ?? 0), // 0 = no reviews yet
    review_count: Number(statsByEventId[event.id]?.review_count ?? 0),
  }));
}

// ---------------------------------------------------------------------------
// uploadEventImage — sends the picked photo to Supabase Storage and returns
// its public URL. The database only stores that URL (text), never the image
// bytes themselves — that's the standard way to handle images with a database.
// ---------------------------------------------------------------------------
async function uploadEventImage(asset) {
  // Whatever the picker reports, only upload a type the bucket accepts.
  const contentType = ALLOWED_TYPES.includes(asset.mimeType) ? asset.mimeType : 'image/jpeg';
  const extension = contentType.split('/')[1]; // 'jpeg' | 'png' | 'webp'

  // Unique file name so two uploads can never overwrite each other.
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  // The picker hands back the image as base64 text; storage wants raw bytes.
  // (If base64 is missing — it can be on some platforms — read the file instead.)
  const body = asset.base64
    ? decode(asset.base64)
    : await (await fetch(asset.uri)).arrayBuffer();

  const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// createEvent — what the form calls. Two steps: upload the image, then
// insert the row that points at it.
// Note: if the insert fails after the upload succeeded, the image stays in
// the bucket (the app is deliberately not allowed to delete files). That's
// harmless for now; clean-up can be a scheduled job later.
// Who created the event isn't sent from here: the database fills it in with
// whoever is logged in (and refuses the insert if nobody is).
// ---------------------------------------------------------------------------
export async function createEvent({ name, eventDate, locationId, asset }) {
  const imageUrl = await uploadEventImage(asset);

  const { error } = await supabase.from('events').insert({
    name: name.trim(),
    event_date: eventDate, // 'YYYY-MM-DD' — maps to the Postgres `date` column
    location_id: locationId, // foreign key into the locations table
    image_url: imageUrl,
  });

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// HOME SCREEN FEEDS
// ---------------------------------------------------------------------------

// "Trending Gimik": upcoming events ranked by how many people joined (most
// first, soonest as the tie-break). One request — the `event_stats` view
// already carries the join count, the date and the image.
export async function fetchTrendingEvents(limit = 5) {
  const { data, error } = await supabase
    .from('event_stats')
    .select('event_id, image_url, join_count')
    .gte('event_date', localTodayISO())
    .order('join_count', { ascending: false })
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}

// "Recommended Gimik": the soonest upcoming events in the person's own
// locality (or anywhere, if they haven't set one).
export async function fetchRecommendedEvents(locationId, limit = 5) {
  let query = supabase
    .from('events')
    .select('id, image_url')
    .gte('event_date', localTodayISO())
    .order('event_date', { ascending: true })
    .limit(limit);

  if (locationId) query = query.eq('location_id', locationId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// "What People Are Saying": the newest reviews (comment optional), each with
// the reviewer's name and the event it was about (two JOINs).
export async function fetchLatestReviews(limit = 3) {
  const { data, error } = await supabase
    .from('event_reviews')
    .select('id, rating, comment, reviewer:profiles(display_name), event:events(name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// EVENT DETAILS — used by the popup that opens when a card or carousel image
// is tapped. One event with its category, locality and rating numbers.
// ---------------------------------------------------------------------------
export async function fetchEventById(eventId) {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .eq('id', eventId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: stats, error: statsError } = await supabase
    .from('event_stats')
    .select('avg_rating, review_count, join_count')
    .eq('event_id', eventId)
    .maybeSingle();

  if (statsError) throw statsError;

  return {
    ...data,
    avg_rating: Number(stats?.avg_rating ?? 0),
    review_count: Number(stats?.review_count ?? 0),
    join_count: Number(stats?.join_count ?? 0),
  };
}

// Who is going — a small guest list for the event popup. Only the fields the
// app shows (name + username) are selected.
export async function fetchEventAttendees(eventId, limit = 20) {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('profile:profiles(id, display_name, username)')
    .eq('event_id', eventId)
    .limit(limit);

  if (error) throw error;
  return data.map((row) => row.profile).filter(Boolean);
}

// Writes a review (1-5 stars, optional comment). Re-reviewing the same event
// updates the existing row instead of failing on the unique constraint.
export async function createEventReview({ eventId, reviewerId, rating, comment }) {
  const { error } = await supabase.from('event_reviews').upsert(
    {
      event_id: eventId,
      reviewer_id: reviewerId,
      rating,
      comment: comment.trim() === '' ? null : comment.trim(),
    },
    { onConflict: 'event_id,reviewer_id' }
  );

  if (error) throw error;
}
