// =============================================================================
// Carousel-Parallax.jsx — reusable image carousel with a parallax effect
// (side images are scaled down/offset, giving a sense of depth). Used by
// Home.jsx for the "Trending Gimik" and "Recommended Gimik" sections, each
// with its own `images` array passed in as a prop.
//
// Wraps `react-native-reanimated-carousel` v4 — the library uses a DEFAULT
// export (not named), and parallax is configured via `layout="parallax"` with
// `parallaxScrollingScale` / `parallaxScrollingOffset` as top-level props.
// =============================================================================
import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export default function ParallaxCarousel({
  images = [require("../assets/gimikko.png")], // the photos to show, in order
  height = 258,         // carousel height in px
  width,                // optional fixed width; falls back to screen width below
  autoplay = true,      // auto-advance through images without the user swiping
  autoplayInterval = 2000, // ms between auto-advances
  loop = true,          // wrap from the last image back to the first
  scale = 0.9,          // how much smaller the side (non-centered) images appear
  offset = 50,          // how far the side images shift away from center, in px
  rounded = true,        // rounded corners on each image
  onSnapToItem,          // optional callback fired when the centered image changes
  onPressItem,           // optional callback fired with the image's index when tapped
}) {
  // Measuring the real window width ourselves (rather than relying on a
  // fixed number) means this carousel sizes correctly on any device,
  // unless the caller explicitly passes a `width` prop to override it.
  const { width: screenWidth } = useWindowDimensions();
  const carouselWidth = width ?? screenWidth;

  // Guard against being called with no images (or a non-array) — render
  // nothing rather than letting the Carousel library crash on bad input.
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        width={carouselWidth}
        height={height}
        data={images}
        loop={loop}
        autoplay={autoplay}
        autoplayInterval={autoplayInterval}
        onSnapToItem={onSnapToItem}
        // v4 API: width/height are direct props, layout is a plain string,
        // parallax tuning uses parallaxScrollingScale / parallaxScrollingOffset.
        layout="parallax"
        parallaxScrollingScale={scale}
        parallaxScrollingOffset={offset}
        // How each individual image is rendered inside the carousel
        renderItem={({ item, index }) => {
          const content = (
            <Image
              source={item}
              style={[styles.image, rounded && styles.rounded]}
              resizeMode="cover"
            />
          );

          // Without a handler each image stays a plain, non-interactive view.
          if (!onPressItem) return <View style={styles.slide}>{content}</View>;

          return (
            <TouchableOpacity
              style={styles.slide}
              activeOpacity={0.9}
              onPress={() => onPressItem(index)}
            >
              {content}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Centers the whole carousel within whatever parent renders it
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Each individual slide fills its allotted space in the carousel
  slide: {
    flex: 1,
  },
  // The photo itself fills its slide completely
  image: {
    width: "100%",
    height: "100%",
  },
  // Applied conditionally when the `rounded` prop is true
  rounded: {
    borderRadius: 16,
  },
});