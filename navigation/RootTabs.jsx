import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CustomTabBar from './CustomTabBar';
import FadeScreen from './FadeScreen';
import { Home } from '../screens/Home';
import CalendarScreen from '../screens/CalendarScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
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
const FadeCalendar = (props) => <FadeScreen><CalendarScreen {...props} /></FadeScreen>;
const FadeFavorites = (props) => <FadeScreen><FavoritesScreen {...props} /></FadeScreen>;
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
        component={FadeCalendar}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FadeFavorites}
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