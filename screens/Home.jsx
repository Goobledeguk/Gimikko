import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import ParallaxCarousel from '../components/Carousel-Parallax.jsx';

export function Home() {
  
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isScrolled && styles.headerShadow]}>
        <Image source={require('../assets/gimikko.png')} style={styles.logo} />
        <Text style={styles.h1font}>Anong Gimik Mo!</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} 
        nestedScrollEnabled={true}// ~60fps 
      >

        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#05dd00', textAlign: 'left', width: '100%', paddingLeft: 20, marginTop: 20, marginBottom: 10 }}>
          Trending Gimik
        </Text>
        <ParallaxCarousel
          images={[
            require('../assets/gimikko.png'),
            require('../assets/gimikko.png'),
          ]}
        />
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#05dd00', textAlign: 'left', width: '100%', paddingLeft: 20, marginTop: 20, marginBottom: 10 }}>
          Recommended Gimik
        </Text>
        <ParallaxCarousel
          images={[
            require('../assets/gimikko.png'),
            require('../assets/gimikko.png'),
          ]}
        /><Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#05dd00', textAlign: 'left', width: '100%', paddingLeft: 20, marginTop: 20, marginBottom: 10 }}>
          Nearby Gimik
        </Text>
        <ParallaxCarousel
          images={[
            require('../assets/gimikko.png'),
            require('../assets/gimikko.png'),
          ]}
        />
      
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    zIndex: 10, // keeps it visually above the ScrollView's content on Android
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android's shadow system is separate from iOS's shadow* props
  },
  logo: {
    height: 50,
    width: 150,
  },
  h1font: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    textAlign: 'center',
    color: '#05dd00',
    marginTop: -5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 100,
  },
});