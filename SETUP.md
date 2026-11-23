# Gimikko — Setup & Running Guide

Gimikko is an Expo (React Native) app backed by Supabase. People create an
account, log in, and everything on screen — events, ratings, saved items,
profile — comes from (and is saved to) the database.

---

## 1. File structure

```
gimikko/
├── .env                          Supabase URL + publishable key (you fill this in)
├── App.js                        Root: fonts, bars, login gate  ← updated
├── app.json                      Expo config (unchanged)
│
├── context/
│   └── AuthContext.jsx           "Who is logged in?" for every screen        NEW
│
├── lib/
│   └── supabase.js               The one shared Supabase client              updated
│
├── services/                     ALL database calls live here
│   ├── account.js                sign up / log in / profile / stats / save / join   NEW
│   └── events.js                 events, localities, Home feeds, image upload       updated
│
├── utils/
│   └── date.js                   formatDate + localTodayISO (unchanged)
│
├── components/
│   ├── Carousel-Parallax.jsx     Parallax carousel (unchanged — use yours)
│   ├── BottomSheet.jsx           Slide-up panel used by the two forms         NEW
│   ├── formStyles.js             Shared look for every form                    NEW
│   ├── LocalityPicker.jsx        Tap-to-select locality chips (from the DB)    NEW
│   ├── CreateEventModal.jsx      "New event" form                              updated
│   └── EditProfileModal.jsx      "Edit profile" form                           NEW
│
├── navigation/                   (unchanged)
│   ├── RootTabs.jsx
│   ├── CustomTabBar.jsx
│   └── FadeScreen.jsx
│
├── screens/
│   ├── LoginScreen.jsx           NEW
│   ├── SignUpScreen.jsx          NEW
│   ├── Home.jsx                  live data                                     rewritten
│   ├── UpComingScreen.jsx        Calendar tab, starts on YOUR locality         updated
│   ├── DiscoverScreen.jsx        grid + Save/Join buttons + "+" form           updated
│   └── ProfileScreen.jsx         live data, real edit form, Log out            rewritten
│
└── supabase/                     (paste these into Supabase — the app never reads them)
    ├── schema.sql                tables, sign-up trigger, views, security rules   updated
    └── seed.sql                  sample data                                       updated
```

Files you can now delete (nothing uses them): `screens/CalendarScreen.jsx`,
`screens/FavoritesScreen.jsx`. `DOCUMENTATION.md` is out of date — this file
replaces it.

---

## 2. One-time setup

### Step 1 — Create the Supabase project
1. Sign in at supabase.com and create a **New project** (any name; remember the
   database password, though the app never needs it).
2. Wait for it to finish starting (about a minute).

### Step 2 — Build the database
1. Open **SQL Editor** → **New query**.
2. Paste all of `supabase/schema.sql` → **Run**. You should see "Success".
3. New query → paste all of `supabase/seed.sql` → **Run**.

Both files are safe to run again at any time. If you already ran an older
version, just run both again — it upgrades your database in place and keeps
your data. (Heads up: it removes the old text `location` column on profiles,
replacing it with the locality link, and from now on only logged-in people
can post events.)

Check **Table Editor**: you should see `events` (6 rows), `locations` (4),
`categories` (3), `profiles` (4 demo people), and so on.

### Step 3 — Let people sign up without an email link
By default Supabase makes new accounts click a link in an email before they can
log in. That's awkward while you're developing, so switch it off:
**Authentication → Sign In / Providers → Email → turn OFF "Confirm email"** → Save.
(The exact menu names move around a little between dashboard versions; it's
the Email provider settings under Authentication.)

If you leave it on, sign-up still works, but the app will say "Check your email
to confirm" and you'll have to confirm before logging in.

### Step 4 — Connect the app
1. Dashboard → **Project Settings → Data API**: copy the **Project URL**.
2. Dashboard → **Project Settings → API Keys**: copy the **Publishable key**
   (starts with `sb_publishable_`). Never use the *secret* key in the app.
3. Put both into the `.env` file in the project root:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY_HERE
   ```
4. Make sure `.env` is listed in `.gitignore`.

### Step 5 — Install the packages
From the project folder (safe to run even if some are already installed):
```
npx expo install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage base64-arraybuffer expo-image-picker
```
All of these work in plain Expo Go — no custom build needed.

---

## 3. Running it

```
npx expo start -c
```
`-c` clears the cache; always use it after changing `.env`. Then press `w`
for the web preview, or scan the QR code with Expo Go on your phone.

### Try it out (a 5-minute tour)
1. **Sign up** — name, username, email, password, locality. You land on Home.
   Your stats all read 0: it's a brand-new account.
2. **Home** shows Trending, Recommended (events in *your* locality) and reviews,
   all from the database.
3. **Discover** → tap a card → it shows its details over a dark overlay. Tap
   the **bookmark** (save) and the **checkmark** (join).
4. Go back to **Home** and **Profile**: Favorites / Saved / Events / Joined
   went up, and the event appears under *My Saved Gimik*.
5. **Discover → +** → add an event (name, date, locality, photo). It appears in
   the grid, in **Calendar** (if its date is today or later), and your **Posted**
   number goes up.
6. **Profile → pencil** → change your name, bio or locality. Everything updates;
   change your locality and the Calendar and Home follow.
7. **Profile → Log out**, then log back in — you stay logged in even after
   closing the app.

To watch the data change, keep the dashboard's **Table Editor** open next to the
app and refresh it.

---

## 4. How it fits together

```
App.js
 └─ <AuthProvider>              (context/AuthContext.jsx)  knows the logged-in person + their profile
     └─ login gate
         ├─ nobody logged in  →  LoginScreen / SignUpScreen
         └─ logged in         →  RootTabs → Home | Calendar | Discover | Profile
```

- **Screens never talk to Supabase directly.** They call functions in
  `services/`, which talk to the database through `lib/supabase.js`.
- **Screens share the logged-in person through `useAuth()`**, because sibling
  tabs can't pass data to each other.
- **The database does the maths.** Averages, counts and "most joined first"
  are views (`event_stats`, `profile_stats`), so the app just reads numbers.
- **The database also enforces the rules** (Row Level Security): you can only
  edit your own profile, only save/join as yourself, and only the logged-in
  can post. The app can't cheat even if it wanted to.
- **Accounts → profiles:** signing up creates a row in Supabase's own
  `auth.users`; a trigger in `schema.sql` then creates your `profiles` row from
  the details you typed.
- **Pull down to refresh** on Home, Profile, Calendar and Discover. Home,
  Profile and Calendar also reload by themselves each time you open the tab.

---

## 5. When something goes wrong

| What you see | Why / fix |
|---|---|
| Red box: "Missing Supabase settings" | `.env` is empty or has the wrong names. Fill it in, then `npx expo start -c`. |
| "Invalid login credentials" | Wrong email/password — or the account was never confirmed (Step 3). |
| "Check your email to confirm it" after sign-up | "Confirm email" is still on (Step 3). |
| Sign-up says "Database error saving new user" | `schema.sql` hasn't been run (the trigger is missing), or run it again. |
| "That username is already taken" | Pick another; usernames are unique. |
| Home/Discover show "Couldn't load…" | Check the internet and the URL/key in `.env`; confirm both SQL files ran without errors. |
| Empty Discover / Home | You didn't run `seed.sql`, or no events exist yet — add one with **+**. |
| "Couldn't load your profile" screen | The account exists but has no profile row (created before the trigger existed). Log out and sign up again, or insert the row in Table Editor. |
| New event says "new row violates row-level security" | You're logged out, or `schema.sql` wasn't re-run after updating. |
| Edited `.env` but nothing changed | Restart with `npx expo start -c`. |

---

## 6. Good to know

- The 4 demo people in the seed (Nigel, Maria, Jero, Dax) are **not real
  accounts** — they exist only so the sample reviews and join counts have
  names. Create your own account to log in.
- **Rating** on Home = the average stars on events *you* posted. It shows "–"
  until someone reviews one.
- **Write a Review** (Home → "What People Are Saying") lets you pick an event,
  tap 1-5 stars and leave a comment. Re-reviewing the same event updates your
  existing review. Make sure you re-ran `schema.sql` so the review policies are
  in place.
- New localities: add a row to the `locations` table in the dashboard. It shows
  up in the sign-up, edit and new-event pickers and the Calendar chips the next
  time the app is opened.
- Event dates seeded by `seed.sql` are relative to the day you ran it, so
  they're always upcoming.
