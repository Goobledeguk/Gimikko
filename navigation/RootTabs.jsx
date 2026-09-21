import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import { Home } from '../screens/Home';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // Swapping in our own component here is what replaces React
      // Navigation's default bar with the curved one.
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => <Ionicons name="home" size={22} color={'#999'} />,
          }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: () => <Ionicons name="search" size={22} color={'#999'} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => <Ionicons name="person" size={22} color={'#999'} />,
        }}
      />
    </Tab.Navigator>
  );
}
