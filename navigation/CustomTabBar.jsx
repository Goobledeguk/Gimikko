import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// ---------------------------------------------------------------------
// THEME — change anything here to restyle the whole bar.
// ---------------------------------------------------------------------
const THEME = {
  barBackground: '#ffffff',
  activeColor: '#22cc00',
  inactiveColor: '#8e8e93',
  iconSize: 26,
  barHeight: 64,
  barRadius: 32,
  horizontalMargin: 20,   // gap between the pill and the screen edges
  bottomMargin: 20,       // gap between the pill and the bottom of the screen
  tabsHorizontalPadding: 12, // padding INSIDE the pill, before the first/after the last tab
  underlineWidth: 20,
  underlineHeight: 3,
  underlineAnimationMs: 250,
};

// React Navigation hands a custom tabBar exactly these three props:
// - state: which route/tab is currently active, and the list of routes
// - descriptors: per-route config (icon, label, etc. from <Tab.Screen options={...}>)
// - navigation: the object you call .navigate()/.emit() on to change screens
export default function CustomTabBar({ state, descriptors, navigation }) {
  const numTabs = state.routes.length;

  // We need to know how wide the row of tabs actually is on screen before
  // we can calculate where each tab's center sits — onLayout gives us that
  // real measured width once it's rendered.
  const [rowWidth, setRowWidth] = useState(0);
  // rowWidth includes the bar's own paddingHorizontal on both sides, but
  // the tabs themselves only occupy the space BETWEEN that padding — so
  // we have to subtract it before dividing, or every tab's center comes
  // out shifted by however much padding there is.
  const contentWidth = Math.max(rowWidth - THEME.tabsHorizontalPadding * 2, 0);
  const tabWidth = contentWidth / numTabs;

  // A shared value is Reanimated's version of state, but it lives on the
  // UI thread so animating it doesn't need to bounce through React/JS on
  // every frame — that's what keeps the slide smooth instead of janky.
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth === 0) return; // not measured yet
    const centeredX =
      THEME.tabsHorizontalPadding +
      state.index * tabWidth +
      (tabWidth - THEME.underlineWidth) / 2;
    // withTiming animates the value smoothly to its new target over time,
    // instead of jumping straight there like a plain assignment would.
    indicatorX.value = withTiming(centeredX, { duration: THEME.underlineAnimationMs });
  }, [state.index, tabWidth]);

  // useAnimatedStyle turns a shared value into a style object that
  // Reanimated updates every frame on the UI thread as indicatorX changes.
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.bar}
        onLayout={(event) => setRowWidth(event.nativeEvent.layout.width)}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? THEME.activeColor : THEME.inactiveColor;

          const onPress = () => {
            // Lets screens intercept/cancel the tab press if they need to
            // (e.g. block navigating away from an unsaved form).
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // *** This is the actual redirect. ***
              // route.name is whatever you named the <Tab.Screen name="..." />
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {/* React Navigation's convention: tabBarIcon is called with
                  { focused, color, size } so ONE icon definition can handle
                  both the active and inactive look — see RootTabs.jsx */}
              {options.tabBarIcon?.({
                focused: isFocused,
                color,
                size: THEME.iconSize,
              })}
            </TouchableOpacity>
          );
        })}

        {/* One single indicator, absolutely positioned, that slides under
            whichever tab is active — instead of each tab drawing its own. */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: THEME.bottomMargin,
    pointerEvents: 'box-none',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.barBackground,
    height: THEME.barHeight,
    borderRadius: THEME.barRadius,
    marginHorizontal: THEME.horizontalMargin,
    width: `${100 - (THEME.horizontalMargin / 4)}%`,
    paddingHorizontal: THEME.tabsHorizontalPadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: THEME.underlineWidth,
    height: THEME.underlineHeight,
    borderRadius: THEME.underlineHeight / 2,
    backgroundColor: THEME.activeColor,
  },
});