// =============================================================================
// Home.jsx — the "Home" tab. A fixed logo/title header (which gains a drop
// shadow once the user scrolls) above a scrolling page. LIVE DATA from the
// database, for the logged-in person:
//   welcome line + locality  <- their profile
//   Events / Rating / Favorites  <- the profile_stats view
//   Trending Gimik           <- upcoming events, most people joined first
//   What People Are Saying   <- the newest reviews with a comment
//   Recommended Gimik        <- soonest upcoming events in THEIR locality
// It reloads every time the tab gains focus (so a save or join made in
// Discover shows up here) and supports pull-to-refresh.
// =============================================================================
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxCarousel from '../components/Carousel-Parallax.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchLatestReviews, fetchRecommendedEvents, fetchTrendingEvents } from '../services/events';
import { fetchMyStats } from '../services/account';

// Five star icons, filled up to `rating` (a whole number 1-5)
function Stars({ rating }) {
  return (
    <View style={styles.commentStars}>
      {[1, 2, 3, 4, 5].map((position) => (
        <Ionicons
          key={position}
          name={position <= rating ? 'star' : 'star-outline'}
          size={12}
          color={position <= rating ? '#FFD700' : '#ccc'}
        />
      ))}
    </View>
  );
}

export function Home() {
  const { profile } = useAuth();

  const [stats, setStats] = useState(null);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // first load only
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState(null);

  // Tracks whether the ScrollView has moved past its very top, so the
  // header below can show a drop shadow only once there's actually
  // content sliding underneath it.
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4); // small threshold avoids flicker right at y=0
  };

  // Fetches everything this screen shows, all four at the same time.
  // On failure whatever was already on screen stays.
  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [myStats, trendingList, recommendedList, reviewList] = await Promise.all([
        fetchMyStats(profile.id),
        fetchTrendingEvents(),
        fetchRecommendedEvents(profile.location_id),
        fetchLatestReviews(),
      ]);
      setStats(myStats);
      setTrending(trendingList);
      setRecommended(recommendedList);
      setReviews(reviewList);
    } catch (e) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [profile.id, profile.location_id]);

  // Runs each time this tab becomes active (and again if the person changes
  // their locality, since that changes what's recommended)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // The carousel wants a list of image sources. useMemo keeps the same list
  // between renders (e.g. while scrolling) so the carousel doesn't restart.
  const trendingImages = useMemo(
    () => trending.map((event) => ({ uri: event.image_url })),
    [trending]
  );
  const recommendedImages = useMemo(
    () => recommended.map((event) => ({ uri: event.image_url })),
    [recommended]
  );

  const localityText = profile.location
    ? `${profile.location.name}, ${profile.location.province}`
    : 'No locality set';

  // 0 means nobody has reviewed this person's events yet
  const ratingText = stats && stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : '–';

  // One carousel section: the title, then the carousel (or a short message if
  // there's nothing to show). With a single image it must not loop/autoplay.
  const renderCarousel = (title, images) => (
    <>
      <Text style={styles.subheading}>{title}</Text>
      {images.length > 0 ? (
        <ParallaxCarousel
          images={images}
          loop={images.length > 1}
          autoplay={images.length > 1}
        />
      ) : (
        <Text style={styles.emptyText}>No upcoming events yet.</Text>
      )}
    </>
  );

  const renderBody = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#05dd00" style={styles.spinner} />;
    }

    if (error && !stats) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Couldn't load your home page</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadData();
            }}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.welcome}>Welcome back {profile.display_name}!</Text>

        {/* Dashboard card */}
        <View style={styles.dashboard}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#05dd00" />
            <Text style={styles.locationText}>{localityText}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.joined_count}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{ratingText}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.saved_count}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        {renderCarousel('Trending Gimik', trendingImages)}

        {/* Reviews */}
        <Text style={styles.subheading}>What People Are Saying</Text>
        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>No reviews yet.</Text>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Ionicons name="person-circle" size={36} color="#05dd00" />
                <View style={styles.commentNameBlock}>
                  <Text style={styles.commentName}>{review.reviewer?.display_name ?? 'Someone'}</Text>
                  <Stars rating={review.rating} />
                </View>
              </View>
              <Text style={styles.commentText}>{review.comment}</Text>
              {review.event && <Text style={styles.commentEvent}>on {review.event.name}</Text>}
            </View>
          ))
        )}

        {renderCarousel('Recommended Gimik', recommendedImages)}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Sticky header — a sibling ABOVE the ScrollView, so it never scrolls */}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#05dd00']} />
        }
      >
        {renderBody()}
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

  // ---- Loading / error / empty ----
  spinner: {
    marginTop: 60,
  },
  emptyText: {
    width: '100%',
    paddingLeft: 20,
    marginBottom: 10,
    fontSize: 13,
    color: '#999',
  },
  errorBox: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 6,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  errorText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#05dd00',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
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
  commentEvent: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },
});
