import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import RootTabs from './navigation/RootTabs.jsx';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    async function hideSystemBars() {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("inset-swipe");
      } catch (e) {
        console.log(e);
      }
    }
    hideSystemBars();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <View style={styles.container}>
        <NavigationContainer>
          <RootTabs />
        </NavigationContainer>
        <StatusBar style="auto" hidden={true} translucent={true} animated={true} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {  
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1, 
  },
});