import * as React from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { Carousel } from "react-native-reanimated-carousel";

export default function ParallaxCarousel({
  images = [require("../assets/placeholder.png")],
  height = 258,
  width,
  autoplay = true,
  autoplayInterval = 2000,
  loop = true,
  scale = 0.9,
  offset = 50,
  rounded = true,
  onSnapToItem,
}) {
  const { width: screenWidth } = useWindowDimensions();
  const carouselWidth = width ?? screenWidth;

  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        style={{ width: carouselWidth, height }}
        data={images}
        loop={loop}
        autoplay={autoplay}
        autoplayInterval={autoplayInterval}
        onSnapToItem={onSnapToItem}
        layout={{ type: "parallax", offset, scale }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item}
              style={[styles.image, rounded && styles.rounded]}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  rounded: {
    borderRadius: 16,
  },
});