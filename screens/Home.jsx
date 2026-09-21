import { StyleSheet, Text, View, Image } from 'react-native';
import ParallaxCarousel from '../components/Carousel-Parallax.jsx';

export function Home() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/gimikko.png')} style={{ height: 50, width: 150, marginTop: 30 }} />
      <Text style={styles.h1font}>Anong Gimik Mo!</Text>

      <ParallaxCarousel
        images={[
          require('../assets/splash-icon.png'),
          require('../assets/splash-icon.png'),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  h1font: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10, // 7 was likely a typo — nearly invisible
    textAlign: 'center',
    color: '#05dd00',
    marginTop: -5,
  },
});