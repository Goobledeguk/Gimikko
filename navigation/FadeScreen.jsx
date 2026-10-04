// =============================================================================
// FadeScreen.jsx — a reusable wrapper, not a screen itself. RootTabs.jsx
// wraps every real screen (Home, CalendarScreen, etc.) in this component
// so that switching tabs fades the new screen in, instead of an instant
// hard cut. Nothing else in the app needs to know this exists — it's
// purely a presentation layer sitting between RootTabs and each screen.
// =============================================================================


import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const FADE_DURATION_MS = 300;

// Wrap any screen's contents in <FadeScreen> to fade it in whenever the
// user navigates to it. useIsFocused() re-renders this component each
// time this screen becomes (or stops being) the active tab.
export default function FadeScreen({ children }) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      opacity.value = 0; // reset so re-visiting the tab fades in again
      opacity.value = withTiming(1, { duration: FADE_DURATION_MS });
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>;
}
