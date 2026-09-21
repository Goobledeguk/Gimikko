import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

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
  underlineWidth: 20,
  underlineHeight: 3,
};

// React Navigation hands a custom tabBar exactly these three props:
// - state: which route/tab is currently active, and the list of routes
// - descriptors: per-route config (icon, label, etc. from <Tab.Screen options={...}>)
// - navigation: the object you call .navigate()/.emit() on to change screens
export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bar}>
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
              <View style={[styles.underline, isFocused && styles.underlineActive]} />
            </TouchableOpacity>
          );
        })}
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
    paddingHorizontal: 12,
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
  underline: {
    marginTop: 6,
    width: THEME.underlineWidth,
    height: THEME.underlineHeight,
    borderRadius: THEME.underlineHeight / 2,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: THEME.activeColor,
  },
});