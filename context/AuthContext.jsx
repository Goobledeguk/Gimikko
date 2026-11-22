// =============================================================================
// context/AuthContext.jsx — "who is logged in?", available to every screen.
//
// Home, Calendar, Discover and Profile are sibling tabs, so they can't hand
// data to each other directly. Instead App.js wraps everything in
// <AuthProvider>, and any screen can ask:   const { user, profile } = useAuth();
//
//   session  — the login itself (null = nobody logged in)
//   user     — session.user (its `id` is what the database calls auth.uid())
//   profile  — that person's row from the `profiles` table (name, locality…)
//   loading  — true until we know whether someone is logged in AND their
//              profile has been fetched
//   refreshProfile() — re-read the profile (call after editing it)
//   signOut()
// =============================================================================
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile, signOut } from '../services/account';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false); // have we looked yet?
  const [profile, setProfile] = useState(null);
  const [profileFor, setProfileFor] = useState(null); // which user the loaded profile belongs to

  // 1) Find out if someone is already logged in (the login is remembered on
  //    the phone), and keep listening: logging in or out later fires this too.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionChecked(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setSessionChecked(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  // 2) Whenever the logged-in person changes, load their profile.
  const loadProfile = useCallback(async (id) => {
    try {
      setProfile(await fetchProfile(id));
    } catch (e) {
      setProfile(null);
    }
    setProfileFor(id);
  }, []);

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    } else {
      setProfile(null);
      setProfileFor(null);
    }
  }, [userId, loadProfile]);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading: !sessionChecked || (userId !== null && profileFor !== userId),
    refreshProfile: () => loadProfile(userId),
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
