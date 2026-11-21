// =============================================================================
// UpComingScreen.jsx — the "Calendar" tab. Now DYNAMIC: shows the events
// stored in Supabase that are happening today or later, soonest first, each
// as a long card with the event photo behind its name, date, category tag
// and average star rating.
//
// Flow:  tab gains focus -> fetchUpcomingEvents() -> list
// Reloading on every focus (not just the first) means an event you just
// created in the Discover tab is already here when you switch over.
// =============================================================================
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUpcomingEvents } from '../services/events';
import { formatDate } from '../utils/date';

// -----------------------------------------------------------------------
// StarRating — turns an average like 3.5 into five icons: full stars, a
// half star when the average is at least .5 past a whole number, then
// outlines. With no reviews it shows empty stars and "No reviews yet".
// -----------------------------------------------------------------------
function StarRating({ rating, count }) {
  const positions = [1, 2, 3, 4, 5];

  const iconFor = (position) => {
    if (rating >= position) return 'star';
    if (rating >= position - 0.5) return 'star-half';
    return 'star-outline';
  };

  return (
    <View style={styles.starsRow}>
      {positions.map((position) => (
        <Ionicons
          key={position}
          name={iconFor(position)}
          size={14}
          color={rating >= position - 0.5 ? '#FFD700' : 'rgba(255,255,255,0.6)'}
          style={styles.starIcon}
        />
      ))}
      <Text style={styles.reviewCount}>
        {count > 0 ? `${rating.toFixed(1)} (${count})` : 'No reviews yet'}
      </Text>
    </View>
  );
}

// -----------------------------------------------------------------------
// EventCard — one event: photo background, a dark overlay so the white
// text stays readable on any photo, then tag / name / date / stars on top.
// -----------------------------------------------------------------------
function EventCard({ event }) {
  return (
    <ImageBackground
      source={{ uri: event.image_url }}
      style={styles.card}
      imageStyle={styles.cardImage}
    >
      <View style={styles.cardOverlay} />
      <View style={styles.cardContent}>
        {/* Events made through the form have no category yet, so the tag is optional */}
        {event.category && (
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{event.category.label}</Text>
          </View>
        )}
        <Text style={styles.eventName} numberOfLines={1}>
          {event.name}
        </Text>
        <Text style={styles.eventDate}>{formatDate(event.event_date)}</Text>
        <StarRating rating={event.avg_rating} count={event.review_count} />
      </View>
    </ImageBackground>
  );
}

export default function UpComingScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // spinner only until the first load finishes
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState(null);

  // On failure the previous list (if any) stays on screen.
  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      setEvents(await fetchUpcomingEvents());
    } catch (e) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs each time this tab becomes the active one
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleRetry = () => {
    setLoading(true);
    loadEvents();
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#05dd00" />
        </View>
      );
    }

    if (error && events.length === 0) {
      return (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={44} color="#bbb" />
          <Text style={styles.stateTitle}>Couldn't load events</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={events}
        keyExtractor={(event) => event.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="calendar-outline" size={44} color="#bbb" />
            <Text style={styles.stateTitle}>No upcoming events</Text>
            <Text style={styles.stateText}>Add one from the Discover tab.</Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Sibling ABOVE the list (not inside it), so it stays fixed while the cards scroll */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#05dd00',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // clearance so the last card isn't hidden behind the floating tab bar
    flexGrow: 1,
  },

  // ---- Event card ----
  card: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'flex-end',
    backgroundColor: '#e8e8e8', // shows while the photo is still loading
  },
  cardImage: {
    borderRadius: 16,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },
  cardContent: {
    padding: 12,
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#05dd00',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  typeTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  eventName: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  eventDate: {
    color: '#eeeeee',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  reviewCount: {
    color: '#dddddd',
    fontSize: 11,
    marginLeft: 6,
  },

  // ---- Loading / error / empty states ----
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 6,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 6,
  },
  stateText: {
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
});
