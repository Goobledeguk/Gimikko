import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxCarousel from '../components/Carousel-Parallax.jsx';

export function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4);
  };

  return (
    <View style={styles.container}>
      {/* Sticky header — stays fixed above the ScrollView, see earlier notes */}
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
        nestedScrollEnabled={true}
      >
        {/* Welcome line — typed directly, no name variable */}
        <Text style={styles.welcome}>Welcome back Juan!</Text>

        {/* Short info blurb — tells a new user what this screen/app is for */}
        <View style={styles.infoCard}>
          <Ionicons name="sparkles" size={20} color="#05dd00" />
          <Text style={styles.infoText}>
            Discover local events, see what's trending nearby, and find your next gimik.
          </Text>
        </View>

        {/* Dashboard card — stats only, no repeated name */}
        <View style={styles.dashboard}>
          <View style={styles.dashboardHeader}>
            <Ionicons name="person-circle" size={48} color="#05dd00" />
            <Text style={styles.dashboardSubtitle}>Your Gimik Profile</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        {/* Trending carousel */}
        <Text style={styles.subheading}>Trending Gimik</Text>
        <ParallaxCarousel
          images={[
            require('../assets/event/hadang.jpg'),
            require('../assets/event/pickle.jpg'),
            require('../assets/event/hanumduman.jpg'),
          ]}
        />

        {/* Recommended carousel */}
        <Text style={styles.subheading}>Recommended Gimik</Text>
        <ParallaxCarousel
          images={[
            require('../assets/event/Hidden.jpg'),
            require('../assets/event/match.jpg'),
          ]}
        />

        {/* Other events — small horizontal row of thumbnails, typed one by one */}
        <Text style={styles.subheading}>Other Events Near You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.otherEventsRow}
        >
          <View style={styles.otherEventCard}>
            <Image source={require('../assets/event/hadang.jpg')} style={styles.otherEventImage} />
            <Text style={styles.otherEventLabel} numberOfLines={1}>Hadang Championship</Text>
          </View>

          <View style={styles.otherEventCard}>
            <Image source={require('../assets/event/pickle.jpg')} style={styles.otherEventImage} />
            <Text style={styles.otherEventLabel} numberOfLines={1}>Palengke Bazaar</Text>
          </View>

          <View style={styles.otherEventCard}>
            <Image source={require('../assets/event/hanumduman.jpg')} style={styles.otherEventImage} />
            <Text style={styles.otherEventLabel} numberOfLines={1}>Live Night</Text>
          </View>

          <View style={styles.otherEventCard}>
            <Image source={require('../assets/event/Hidden.jpg')} style={styles.otherEventImage} />
            <Text style={styles.otherEventLabel} numberOfLines={1}>Talent Fair</Text>
          </View>
        </ScrollView>

        {/* Comments / testimonials — each card typed out directly */}
        <Text style={styles.subheading}>What People Are Saying</Text>

        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Ionicons name="person-circle" size={36} color="#05dd00" />
            <View style={styles.commentNameBlock}>
              <Text style={styles.commentName}>Maria</Text>
              <View style={styles.commentStars}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
            </View>
          </View>
          <Text style={styles.commentText}>
            Found a bazaar near my place I never knew about. Super helpful app!
          </Text>
        </View>

        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Ionicons name="person-circle" size={36} color="#05dd00" />
            <View style={styles.commentNameBlock}>
              <Text style={styles.commentName}>Jero</Text>
              <View style={styles.commentStars}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star-outline" size={12} color="#ccc" />
              </View>
            </View>
          </View>
          <Text style={styles.commentText}>
            The event reminders saved me from missing the match night last week.
          </Text>
        </View>

        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Ionicons name="person-circle" size={36} color="#05dd00" />
            <View style={styles.commentNameBlock}>
              <Text style={styles.commentName}>Jax</Text>
              <View style={styles.commentStars}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Ionicons name="star-outline" size={12} color="#ccc" />
                <Ionicons name="star-outline" size={12} color="#ccc" />
              </View>
            </View>
          </View>
          <Text style={styles.commentText}>
            Nice layout, would love to see more sports events added soon.
          </Text>
        </View>
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
    borderRadius: 10,
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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

  welcome: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textAlign: 'left',
    color: '#05dd00',
    width: '100%',
    paddingLeft: 20,
    marginBottom: 10,
  },

  subheading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#05dd00',
    textAlign: 'left',
    width: '100%',
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  // ---- Info blurb ----
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#f2fdf1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#444',
    lineHeight: 17,
  },

  // ---- Dashboard card ----
  dashboard: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dashboardSubtitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#222',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#05dd00',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#eee',
  },

  // ---- Other events row ----
  otherEventsRow: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 12,
  },
  otherEventCard: {
    width: 110,
  },
  otherEventImage: {
    width: 110,
    height: 80,
    borderRadius: 12,
    marginBottom: 6,
  },
  otherEventLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },

  // ---- Comments ----
  commentCard: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  commentNameBlock: {
    justifyContent: 'center',
  },
  commentName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#222',
  },
  commentStars: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 1,
  },
  commentText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 17,
  },
});