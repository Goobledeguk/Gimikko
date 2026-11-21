// =============================================================================
// lib/supabase.js — creates the ONE Supabase client the whole app shares.
// Every file that talks to the database imports `supabase` from here, so the
// URL/key live in exactly one place (the .env file) and nothing else needs
// to know how the connection is configured.
// =============================================================================

// supabase-js relies on the standard URL class; React Native's built-in one
// is incomplete, so this polyfill must load BEFORE the client is created.
import 'react-native-url-polyfill/auto';
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
  // The app has no login yet, so there is no session to store or refresh.
  // When you add Supabase Auth, switch these on and pass
  // `storage: AsyncStorage` (from @react-native-async-storage/async-storage).
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
