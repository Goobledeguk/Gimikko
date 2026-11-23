// =============================================================================
// components/Skeleton.jsx — a simple pulsing gray-green block used while
// real data is loading. Screens arrange a few of these into the shape of the
// content that is about to appear (a card, a row of text, a grid tile).
//
//   <Skeleton width="60%" height={24} />
//   <Skeleton width={120} height={16} radius={6} style={{ marginTop: 8 }} />
// =============================================================================
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.block, { width, height, borderRadius: radius, opacity }, style]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#e5f6e4',
  },
});
