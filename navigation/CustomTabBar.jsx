import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// ---------------------------------------------------------------------
// THEME — change anything here to restyle the whole bar.
// ---------------------------------------------------------------------
const THEME = {
  barHeight: 70,
  curveDepth: 25,
  curveWidth: 80,          // how wide the dip is, in px
  barColor: '#ffffff',
  activeColor: '#05dd00',
  inactiveColor: '#999999',
  labelFontSize: 11,
  iconFontSize: 20,
  centerButtonSize: 60,
  centerButtonColor: '#05dd00',
  centerIconColor: '#ffffff',
  centerIconFontSize: 26,
};

// Builds the SVG outline for the bar: a flat rectangle with a dip
// carved out of the top-middle, so the floating button can "sit in" it.
function getBarPath(width, height) {
  const { curveWidth, curveDepth } = THEME;
  const centerX = width / 2;
  return `
    M0,0
    H${centerX - curveWidth}
    C${centerX - curveWidth / 2},0 ${centerX - curveWidth / 2},${curveDepth} ${centerX},${curveDepth}
    C${centerX + curveWidth / 2},${curveDepth} ${centerX + curveWidth / 2},0 ${centerX + curveWidth},0
    H${width}
    V${height}
    H0
    Z
  `;
}

// React Navigation hands a custom tabBar exactly these three props:
// - state: which route/tab is currently active, and the list of routes
// - descriptors: per-route config (title, icon, etc. from <Tab.Screen options={...}>)
// - navigation: the object you call .navigate()/.emit() on to change screens
export default function CustomTabBar({ state, descriptors, navigation }) {
  // Measuring our own rendered width (instead of trusting the browser
  // window / device screen width) keeps this correct inside embedded
  // previews, split editors, or any container narrower than the full
  // window — cases where useWindowDimensions() reports the wrong number.
  const [barWidth, setBarWidth] = useState(0);
  const centerIndex = Math.floor(state.routes.length / 2);

  return (
    <View
      style={styles.wrapper}
      onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
    >
      {barWidth > 0 && (
        <Svg width={barWidth} height={THEME.barHeight} style={styles.svg}>
          <Path fill={THEME.barColor} d={getBarPath(barWidth, THEME.barHeight)} />
        </Svg>
      )}

      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;
          const isCenter = index === centerIndex;

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

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.centerButton}
              >
                <Text style={styles.centerIcon}>
                  {options.tabBarIcon ? options.tabBarIcon() : '+'}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
              <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                {options.tabBarIcon ? options.tabBarIcon() : '•'}
              </Text>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {label}
              </Text>
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
    height: THEME.barHeight,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
  tabRow: {
    flexDirection: 'row',
    height: THEME.barHeight,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: THEME.iconFontSize,
    color: THEME.inactiveColor,
  },
  tabIconActive: {
    color: THEME.activeColor,
  },
  tabLabel: {
    fontSize: THEME.labelFontSize,
    color: THEME.inactiveColor,
    marginTop: 2,
  },
  tabLabelActive: {
    color: THEME.activeColor,
    fontWeight: '600',
  },
  centerButton: {
    width: THEME.centerButtonSize,
    height: THEME.centerButtonSize,
    borderRadius: THEME.centerButtonSize / 2,
    backgroundColor: THEME.centerButtonColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -(THEME.curveDepth + THEME.centerButtonSize / 2 - 10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  centerIcon: {
    fontSize: THEME.centerIconFontSize,
    color: THEME.centerIconColor,
  },
});