// =============================================================================
// RootTabs.jsx — the app's navigation map. Declares which screens exist as
// tabs, in what order, with which icons, and wires in CustomTabBar (the
// visual bar) and FadeScreen (the fade-in transition) around every screen.
// Rendered by App.js inside <NavigationContainer>, and is the ONLY file
// that needs editing to add, remove, or reorder tabs.
// =============================================================================


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CustomTabBar from './CustomTabBar';
import FadeScreen from './FadeScreen';
import { Home } from '../screens/Home';
import UpComingScreen from '../screens/UpComingScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Defined OUTSIDE the component (not inline in <Tab.Screen component={...} />)
// so each one is a stable reference. An inline arrow function would create a
// brand-new component type on every render, which React Navigation would
// then remount from scratch — losing scroll position, state, etc.
//
// Each wrapper takes `props` (which React Navigation supplies: navigation,
// route, etc.) and spreads it onto the real screen with {...props} — skip
// that step and the screen never receives `navigation`, so any
// navigation.navigate(...) call inside it throws "navigate is not a
// function" the moment you press a button.
const FadeHome = (props) => <FadeScreen><Home {...props} /></FadeScreen>;
const FadeUpComing = (props) => <FadeScreen><UpComingScreen {...props} /></FadeScreen>;
const FadeDiscover = (props) => <FadeScreen><DiscoverScreen {...props} /></FadeScreen>;
const FadeProfile = (props) => <FadeScreen><ProfileScreen {...props} /></FadeScreen>;

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // Swapping in our own component here is what replaces React
      // Navigation's default bar with our custom pill bar.
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={FadeHome}
        options={{
          // tabBarIcon receives { focused, color, size } from CustomTabBar —
          // color already flips between active/inactive, so one line handles both states.
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={FadeUpComing}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={FadeDiscover}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={FadeProfile}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}