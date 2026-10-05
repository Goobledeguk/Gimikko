# Gimikko — Project Documentation
*(Updated to reflect the Home/Calendar/Discover/Profile rebuild, the
status/navigation-bar fixes, and the Profile popups.)*

A React Native (Expo) app with a bottom tab navigator, a custom pill-shaped
tab bar, fade transitions between screens, and four prototype screens: Home,
Calendar, Favorites/Discover, and Profile.

---

## 1. File Structure

```
gimikko/
├── App.js                      Root component — fonts, status/nav bars, navigation setup
├── app.json                    Expo config — app name, icon, splash screen, plugins
│
├── assets/
│   ├── gimikko.png             App logo, used in Home's header
│   ├── fonts/
│   │   ├── Poppins-Bold.ttf
│   │   └── Poppins-Regular.ttf
│   └── event/                  Local photos used by Home's carousels + "Other Events" row
│       ├── hadang.jpg
│       ├── pickle.jpg
│       ├── hanumduman.jpg
│       ├── Hidden.jpg
│       └── match.jpg
│
├── components/
│   └── Carousel-Parallax.jsx   Reusable parallax image carousel (used by Home)
│
├── navigation/
│   ├── RootTabs.jsx            Declares the 4 tabs, their icons, and screen order
│   ├── CustomTabBar.jsx        The visual pill-shaped tab bar + sliding indicator
│   └── FadeScreen.jsx          Wrapper that fades a screen in when it becomes active
│
└── screens/
    ├── Home.jsx                 "Home" tab — dashboard, carousels, other events, testimonials
    ├── CalendarScreen.jsx        "Calendar" tab — upcoming events list
    ├── UpComing.jsx       "UpComing" tab — currently a bare placeholder (see Known Gaps)
    ├── DiscoverScreen.jsx        2-column event grid with tap-to-overlay reveal
    └── ProfileScreen.jsx         "Profile" tab — stats, saved events, Settings/About popups
```

## 2. How Everything Connects (data/control flow)

```
App.js
  └─ loads fonts, hides status bar, hides Android nav bar
  └─ <NavigationContainer>
        └─ <RootTabs />                         (navigation/RootTabs.jsx)
              ├─ <Tab.Navigator tabBar={CustomTabBar}>
              │     ├─ Tab.Screen "Home"      → FadeScreen → Home.jsx
              │     ├─ Tab.Screen "UpComing"  → FadeScreen → UpComing.jsx
              │     ├─ Tab.Screen "Discover" → FadeScreen → Discover.jsx
              │     └─ Tab.Screen "Profile"   → FadeScreen → ProfileScreen.jsx
              └─ CustomTabBar renders the actual pill bar UI,
                 reading `state`/`descriptors` from the Tab.Navigator
                 and calling `navigation.navigate(...)` on tap
```

**Key relationships (unchanged from before, still accurate):**

- **App.js → RootTabs.jsx** — App.js only handles app-wide setup (fonts,
  status/nav bars). Which screens exist lives entirely in RootTabs.jsx.
- **RootTabs.jsx → CustomTabBar.jsx** — `Tab.Navigator`'s `tabBar` prop
  swaps in our bar. React Navigation hands it `state`, `descriptors`, and
  `navigation`.
- **RootTabs.jsx → FadeScreen.jsx → each screen** — every screen is
  wrapped like `const FadeHome = (props) => <FadeScreen><Home {...props} />
  </FadeScreen>`. The `{...props}` spread is critical — without it,
  `navigation` would be `undefined` inside the real screen.
- **Screens are siblings, not parent/child** — no screen passes data to
  another directly. Every screen hardcodes its own content.

---

## 3. What Changed Since the Last Documentation Pass

### App.js / app.json — status bar & navigation bar
Android's mandatory "edge-to-edge" display mode (Android 15/16) broke the
original approach:
- `react-native-edge-to-edge`'s `<SystemBars>` was tried as the modern,
  declarative fix — but it ships **native code not bundled into Expo Go**,
  causing `Invariant Violation: TurboModuleRegistry.getEnforcing(...):
  'RNEdgeToEdge' could not be found`. Reverted.
- `expo-navigation-bar`'s `setBehaviorAsync()` is deprecated/removed under
  edge-to-edge and threw `undefined is not a function` on a real device
  (silently worked on web, since that code path is Android-only). Removed
  that one call; kept `setVisibilityAsync('hidden')`, which still works.
- The remaining nav-bar call was moved from inside a `useEffect` to plain
  **module-level code** (runs once when the file loads, same pattern
  `SplashScreen.preventAutoHideAsync()` used earlier) — functionally
  equivalent here since it doesn't depend on anything the component
  renders, but worth remembering this isn't a general substitute for
  `useEffect` when a side effect *does* depend on the mounted component.
- `app.json`'s plugins currently read: `expo-font`, `expo-splash-screen`
  (with the real logo configured), `expo-navigation-bar` (with
  `hidden: true`). `react-native-edge-to-edge` is NOT in the plugin list
  (reverted).

### Home.jsx — full rebuild
Now includes, top to bottom: fixed/sticky header with scroll-shadow,
welcome text, a dashboard card (avatar, **location row** — pin icon +
"Calbayog City, Samar" — and a 3-stat row), two `ParallaxCarousel`
sections, a horizontal "Other Events Near You" row, and three testimonial
cards. Every value is hardcoded directly in JSX.

- **Nested-scroll fix**: the horizontal "Other Events" row originally used
  the plain React Native `ScrollView` and wouldn't swipe at all on a real
  device. Fixed by importing `ScrollView` from `react-native-gesture-handler`
  instead (aliased `HorizontalScrollView`) — since the whole app already
  runs inside `GestureHandlerRootView`, using gesture-handler's own
  `ScrollView` for a view nested inside another scrollable view lets both
  properly negotiate the gesture, which plain `ScrollView` +
  `nestedScrollEnabled` didn't reliably do.

### CalendarScreen.jsx
Unchanged in structure since the last pass — fixed "Upcoming Events"
header above 5 hardcoded event cards.

### DiscoverScreen.jsx
2-column grid, 6 hardcoded cards, each with its own `useState` boolean.
Tapping a card is meant to blur its photo via `expo-blur`'s `<BlurView>`
and reveal title/date on top.

### ProfileScreen.jsx — rebuilt
- The old full-width "Edit Profile" button at the bottom is gone, replaced
  by a small circular pencil-icon button sitting **beside the name** in a
  row.
- Three `Modal`-based popups were added, each controlled by its own
  `useState` boolean:
  - **Edit popup** — tapping the pencil icon shows a "Updated Details"
    confirmation message. No real save logic; purely cosmetic.
  - **Settings popup** — opened via a new "Settings" row (under a "More"
    section, below the saved-events list). Contains three rows — Activity
    Log, Privacy, Preference — each with **no `onPress`** at all, exactly
    as requested (visual only, no function yet).
  - **About popup** — opened via a new "About" row next to Settings.
    Shows 5 hardcoded name/handle pairs, each centered with a divider line
    between entries, ending in a "Gimikko © 2026" line. Built as plain
    typed `<Text>` elements (not React Native's real `<FlatList>`
    component), to stay consistent with this project's "no data
    array/loop" prototype approach.

---

## 4. File-by-File Reference

### `App.js`
Loads fonts → hides Android nav bar (module-level, Android-only, guarded
with try/catch) → renders `<StatusBar hidden />` → wraps everything in
`GestureHandlerRootView` + `NavigationContainer` → hands off to `RootTabs`.

### `app.json`
Native-level config. `plugins` array uses the array form (`["plugin-name",
{...config}]`) for `expo-splash-screen` and `expo-navigation-bar`, since
this Expo SDK version removed the old flat top-level keys for both.
Changes here only take effect in a native build (dev client/EAS) — **not**
in plain Expo Go.

### `components/Carousel-Parallax.jsx`
Wraps `react-native-reanimated-carousel` v5 (named export, `style`-based
sizing, `layout={{ type: "parallax" }}` instead of older `mode`/`modeConfig`).

### `navigation/RootTabs.jsx`
The only file that needs editing to add/remove/reorder tabs.

### `navigation/CustomTabBar.jsx`
`THEME` object at the top controls all colors/sizes. Indicator position is
calculated from the bar's own measured width (`onLayout`), accounting for
its horizontal padding, and animated via Reanimated's `withTiming`.

### `navigation/FadeScreen.jsx`
Generic wrapper — fades a screen's opacity in via `useIsFocused()` +
Reanimated whenever it becomes the active tab.

### `screens/Home.jsx`
See "What Changed" above for the full rundown.

### `screens/UpComing.jsx`
Fixed header (same "render outside the ScrollView" trick as Home) above 5
individually typed event cards.

### `screens/DiscoverScreen.jsx`
2-column grid (`flexWrap: 'wrap'`, `width: '48%'` per card). Each card has
its own `useState` toggle and its own `<BlurView>` overlay.

### `screens/FavoritesScreen.jsx`
Minimal placeholder — currently what's actually wired into the
"Favorites" tab.

### `screens/ProfileScreen.jsx`
See "What Changed" above. Uses three `Modal` components, one per popup,
each gated by its own boolean state.

---