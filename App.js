import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import RootTabs from './navigation/RootTabs.jsx';

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