// =============================================================================
// Home.jsx — the "Home" tab. A fixed logo/title header (which gains a drop
// shadow once the user scrolls) above a scrolling page containing: a
// welcome line, a stats dashboard, two ParallaxCarousel sections, a
// horizontal row of other-event thumbnails, and a few testimonial cards.
// Pure UI prototype — every value (names, numbers, comments) is typed
// directly below, nothing is loaded from a data file.
// =============================================================================
import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
// gesture-handler's ScrollView (NOT the plain React Native one) specifically
// for the horizontal row below — since the app is already wrapped in
// GestureHandlerRootView (see App.js), using its ScrollView for a scroll
// view nested inside another one lets both negotiate the gesture properly,
// which plain ScrollView + nestedScrollEnabled doesn't always manage.
import { ScrollView as HorizontalScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ParallaxCarousel from '../components/Carousel-Parallax.jsx';

export function Home() {
  // Tracks whether the ScrollView has moved past its very top, so the
  // header below can show a drop shadow only once there's actually
  // content sliding underneath it.
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4); // small threshold avoids flicker right at y=0
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
        <Text style={styles.welcome}>Welcome back Nigel!</Text>

        {/* Dashboard card — stats only, no repeated name */}
        <View style={styles.dashboard}>
          <View style={styles.dashboardHeader}>
            <Ionicons name="person-circle" size={48} color="#05dd00" />
            <Text style={styles.dashboardSubtitle}>Nigel De Vera</Text>
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

      {/* Comments / Review — each card*/}
      <Text style={styles.subheading}>Event Feed</Text>

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

        {/* Recommended carousel */}
        <Text style={styles.subheading}>Recommended Gimik</Text>
        <ParallaxCarousel
          images={[
            require('../assets/event/Hidden.jpg'),
            require('../assets/event/match.jpg'),
            require('../assets/event/Basketball.jpg'),
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