// =============================================================================
// App.js — the ROOT of the entire app. Every screen eventually renders
// underneath what's returned here.
//
// Responsibilities, top to bottom:
//   1. Load custom fonts (Poppins) before showing anything real.
//   2. Hide Android's system navigation bar (home/back/recents) and the
//      top status bar.
//   3. Provide "who is logged in" to the whole app (AuthProvider).
//   4. Decide WHICH screen to show — the login gate:
//        still checking  -> spinner
//        nobody logged in -> Login or Sign-up screen
//        logged in, profile missing -> small "couldn't load" screen
//        logged in       -> the real app (tabs)
// =============================================================================
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import RootTabs from './navigation/RootTabs.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import SignUpScreen from './screens/SignUpScreen.jsx';

// Called once, when this module first loads — not inside the component.
// Only calls setVisibilityAsync — NOT setBehaviorAsync, which crashes on real
// devices under Android's edge-to-edge enforcement. Wrapped in try/catch so an
// unsupported Android version just leaves the nav bar visible instead of
// crashing the app.
if (Platform.OS === 'android') {
  try {
    NavigationBar.setVisibilityAsync('hidden');
  } catch (error) {
    console.warn('NavigationBar.setVisibilityAsync unsupported:', error);
  }
}

// The login gate. Lives inside <AuthProvider> so it can call useAuth().
function AppContent() {
  const { session, profile, loading, refreshProfile, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false); // which logged-out screen: login or sign-up

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#05dd00" />
      </View>
    );
  }

  if (!session) {
    return showSignUp ? (
      <SignUpScreen onSwitch={() => setShowSignUp(false)} />
    ) : (
      <LoginScreen onSwitch={() => setShowSignUp(true)} />
    );
  }

  // Logged in, but no profile row could be read (e.g. no internet right now,
  // or an account created before the profile trigger existed).
  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.problemTitle}>Couldn't load your profile</Text>
        <Text style={styles.problemText}>Check your connection and try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshProfile}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logoutLink}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootTabs />
    </NavigationContainer>
  );
}

export default function App() {
  // Loads the two font files so `fontFamily: 'Poppins-Bold'` /
  // 'Poppins-Regular' in your styles actually resolve to something real.
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  // Render nothing for the brief moment before the font is ready
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* hidden={true} removes the status bar (clock, battery, signal) entirely */}
      <StatusBar hidden={true} animated={true} />

      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    gap: 8,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  problemText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#05dd00',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  logoutLink: {
    marginTop: 16,
    color: '#888',
    textDecorationLine: 'underline',
  },
});
