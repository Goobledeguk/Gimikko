// =============================================================================
// App.js — the ROOT of the entire app. Every screen, every tab, every piece
// of UI eventually renders underneath what's returned here.
//
// Responsibilities, top to bottom:
//   1. Load custom fonts (Poppins) before showing anything real.
//   2. Hide Android's system navigation bar (home/back/recents).
//   3. Hide the top status bar entirely.
//   4. Set up gesture handling (required by the carousel/animations) and
//      React Navigation's container, then hand off to RootTabs.jsx for
//      everything screen/tab related.
//
// NOTE on system bars: react-native-edge-to-edge's <SystemBars> is the
// officially "correct" modern replacement for hiding status/nav bars, but
// it ships native code that ISN'T bundled into plain Expo Go — it only
// works in a custom dev client or EAS build. Since this project is being
// tested through Expo Go, we're back to expo-status-bar + expo-navigation-bar
// (which ARE bundled in Expo Go), while specifically avoiding
// setBehaviorAsync() — that one function is deprecated/removed under
// Android's edge-to-edge enforcement and throws "undefined is not a
// function" on real devices. setVisibilityAsync() is still functional.
// =============================================================================
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import RootTabs from './navigation/RootTabs.jsx';

// Called once, when this module first loads — not inside the component,
// and not inside a useEffect. This is the same pattern as
// SplashScreen.preventAutoHideAsync() used to be called earlier in this
// file: a fire-and-forget side effect that doesn't depend on anything the
// component renders, so it doesn't need to be tied to React's lifecycle
// at all. Only calls setVisibilityAsync — NOT setBehaviorAsync, which is
// the one that crashes on real devices under Android's edge-to-edge
// enforcement. Wrapped in try/catch so an unsupported future Android
// version just leaves the nav bar visible instead of crashing the app.
if (Platform.OS === 'android') {
  try {
    NavigationBar.setVisibilityAsync('hidden');
  } catch (error) {
    console.warn('NavigationBar.setVisibilityAsync unsupported:', error);
  }
}

export default function App() {
  // Loads the two font files so `fontFamily: 'Poppins-Bold'` /
  // 'Poppins-Regular' in your styles actually resolve to something real.
  // Without this, those style props silently fall back to the system
  // default font — no crash, no warning, just the wrong typeface.
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  // No custom loading screen component this time — just render nothing
  // at all until the font is ready. This is a very brief blank frame,
  // not a visible "screen" the way LoadingScreen.jsx was.
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* hidden={true} actually removes the status bar (clock, battery,
          signal icons) from the screen entirely — translucent alone just
          makes it see-through, it doesn't hide it. */}
      <StatusBar hidden={true} animated={true} />

      <View style={styles.container}>
        <NavigationContainer>
          <RootTabs />
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});