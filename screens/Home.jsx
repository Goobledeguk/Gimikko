import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import ParallaxCarousel from '../components/Carousel-Parallax.jsx';

export function Home() {
  
  const [isScrolled, setIsScrolled] = useState(false); // 

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4);
  }; // handles the Scroll — calculation for content offeset when scrooled 

let user = { name: "Nigel", rating: 5, eventsAttended: 5 }
const {name, rating, eventsAttended } = user // Deconstructed data for passing 

  return (
    <View style={styles.container}>
      <View style={[styles.header, isScrolled && styles.headerShadow]}>
        <Image source={require('../assets/gimikko.png')} style={styles.logo} />
        <Text style={styles.h1font}>Anong Gimik Mo!</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} // hides the vertical scrollbar
        onScroll={handleScroll} //handles which content 
        scrollEventThrottle={16} // ~60fps 
        nestedScrollEnabled={true} // scrolling inside a ScrollView (for the carousel) works on Android
      >

          <Text style={[styles.welcome]}>
            Welcome {name}!
          </Text>
           

        <Text style={[styles.subheading]}>
          Trending Gimik
        </Text>
        <ParallaxCarousel
          images={[
            require('../assets/event/hadang.jpg'),
            require('../assets/event/pickle.jpg'),
            require('../assets/event/hanumduman.jpg'),
          ]}
        /><Text style={[styles.subheading]}> 
          Recommended Gimik
        </Text>
        <ParallaxCarousel
          images={[
            require('../assets/event/Hidden.jpg'),
            require('../assets/event/match.jpg'),  
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
    zIndex: 10, 
    borderRadius: 10, // keeps it visually above the ScrollView's content on Android
  },
  
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
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

  subheading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#05dd00',
    textAlign: 'left',
    width: '100%',
    paddingLeft: 20, 
    marginTop: 10, 
    marginBottom: 10 
  },
  
  welcome:{
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textAlign: 'left',
    color: '#05dd00',
    width: '100%',
    paddingLeft: 20,
    marginBottom: 10 
  }
});