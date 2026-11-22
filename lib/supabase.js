// =============================================================================
// lib/supabase.js — creates the ONE Supabase client the whole app shares.
// Every file that talks to the database or to login imports `supabase` from
// here, so the URL/key live in exactly one place (the .env file).
// =============================================================================

// supabase-js relies on the standard URL class; React Native's built-in one
// is incomplete, so this polyfill must load BEFORE the client is created.
import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Expo only replaces these when written as plain `process.env.EXPO_PUBLIC_X`
// (no destructuring, no dynamic keys) — that's why they're read this way.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Fail loudly and clearly instead of with a confusing network error later.
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase settings. Fill in EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env, then restart with: npx expo start -c'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage, // remembers the login on the phone between app launches
    autoRefreshToken: true, // quietly renews the login before it expires
    persistSession: true,
    detectSessionInUrl: false, // (that's for websites with redirect links; not used here)
  },
});

// Renew the login only while the app is actually on screen.
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
