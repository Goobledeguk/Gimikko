import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import RootTabs from './navigation/RootTabs.jsx';

export default function App() {
  // Loads the two font files so `fontFamily: 'Poppins-Bold'` /
  // 'Poppins-Regular' in your styles actually resolve to something real.
  // Without this, those style props silently fall back to the system
  // default font — no crash, no warning, just the wrong typeface.
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  // The Android nav bar (home/back/recents) is a completely separate API
  // from the top StatusBar — it doesn't exist at all on iOS, so this is
  // guarded to only run on Android (calling it on iOS would just throw,
  // same as the "only available on Android" warning you saw earlier).
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      // 'overlay-swipe' lets the user swipe up from the bottom edge to
      // briefly reveal the nav bar again (so they're never fully locked
      // out of Home/Back) instead of it being permanently unreachable.
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

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