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

// ---------------------------------------------------------------------------
// fetchEvents — newest first. The `category:categories(key, label)` part is a
// JOIN: because events.category_id is a foreign key to categories.id,
// Supabase can pull the related category row along in the same request.
// Returns e.g. { id, name, event_date, image_url, category: { key, label } | null }
// ---------------------------------------------------------------------------
export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, event_date, image_url, category:categories(key, label)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// fetchUpcomingEvents — what the Calendar tab shows: events happening today
// or later, soonest first, each with its average star rating.
// Two requests: the events (+ category join), then their rating summaries
// from the `event_stats` view (the database does the averaging), merged here.
// ---------------------------------------------------------------------------
export async function fetchUpcomingEvents() {
  const { data: events, error } = await supabase
    .from('events')
    .select('id, name, event_date, image_url, category:categories(key, label)')
    .gte('event_date', localTodayISO()) // 'YYYY-MM-DD' strings compare correctly as dates
    .order('event_date', { ascending: true });

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
// ---------------------------------------------------------------------------
export async function createEvent({ name, eventDate, asset }) {
  const imageUrl = await uploadEventImage(asset);

  const { error } = await supabase.from('events').insert({
    name: name.trim(),
    event_date: eventDate, // 'YYYY-MM-DD' — maps to the Postgres `date` column
    image_url: imageUrl,
  });

  if (error) throw error;
}
