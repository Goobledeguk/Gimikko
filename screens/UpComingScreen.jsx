// =============================================================================
// UpComingScreen.jsx — the "Calendar" tab. DYNAMIC: shows the events stored
// in Supabase that are happening today or later, soonest first, for the
// chosen locality. Each is a long card with the event photo behind its
// name, date, locality, category tag and average star rating.
//
// A row of chips under the header filters by locality ("All" + one chip per
// row in the locations table). It starts on the LOGGED-IN PERSON'S OWN
// locality (from their profile), and follows along if they change it.
//
// Flow:  mount -> fetchUpcomingEvents() for their locality
//        tap a chip -> fetch again for that locality
// The list also reloads each time the tab gains focus, so an event you just
// created in the Discover tab is already here when you switch over.
// =============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// gesture-handler's ScrollView (not React Native's) for the chip row — same
// choice as Home.jsx's swipeable row, since the app runs inside
// GestureHandlerRootView and this one reliably receives horizontal swipes.
import { ScrollView as ChipScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EventDetailsModal from '../components/EventDetailsModal.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchLocations, fetchUpcomingEvents } from '../services/events';
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
function EventCard({ event, onPress }) {
  // "Oct 12, 2026  •  Calbayog City" — on one line so the card keeps its height
  const dateLine = [formatDate(event.event_date), event.location?.name]
    .filter(Boolean)
    .join('  •  ');

  return (
    <TouchableOpacity style={styles.cardWrap} activeOpacity={0.9} onPress={onPress}>
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
          <Text style={styles.eventDate} numberOfLines={1}>
            {dateLine}
          </Text>
          <StarRating rating={event.avg_rating} count={event.review_count} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default function UpComingScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // spinner for first load and filter changes
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState(null);

  const { profile } = useAuth();

  const [locations, setLocations] = useState([]);
  // Starts on the person's own locality; null = "All"
  const [selectedLocationId, setSelectedLocationId] = useState(profile.location_id ?? null);

  // Which event's detail popup is open (null = closed)
  const [detailEventId, setDetailEventId] = useState(null);

  // If they change their locality (Profile -> pencil), follow it
  useEffect(() => {
    setSelectedLocationId(profile.location_id ?? null);
  }, [profile.location_id]);

  // Counts requests so a slow, older response can never overwrite a newer one
  // (e.g. tapping through chips quickly).
  const latestRequest = useRef(0);

  // Load the localities once, for the chips. If that fails the screen still
  // works — just without chips.
  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => {});
  }, []);

  // On failure the previous list (if any) stays on screen.
  const loadEvents = useCallback(async () => {
    const requestId = ++latestRequest.current;
    try {
      setError(null);
      const data = await fetchUpcomingEvents({ locationId: selectedLocationId });
      if (requestId === latestRequest.current) setEvents(data);
    } catch (e) {
      if (requestId === latestRequest.current) setError(e.message || 'Unknown error');
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [selectedLocationId]);

  // Runs each time the tab becomes active — and again whenever loadEvents
  // changes, which is what happens when a different chip is selected.
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

  const selectLocality = (id) => {
    if (id === selectedLocationId) return;
    setLoading(true);
    setSelectedLocationId(id);
  };

  const selectedLocation = locations.find((location) => location.id === selectedLocationId);

  const renderChip = (label, id) => {
    const selected = id === selectedLocationId;
    return (
      <TouchableOpacity
        key={label}
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={() => selectLocality(id)}
      >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.skeletonList}>
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} width="100%" height={120} radius={16} style={styles.skeletonCard} />
          ))}
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
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => setDetailEventId(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="calendar-outline" size={44} color="#bbb" />
            <Text style={styles.stateTitle}>
              {selectedLocation
                ? `No upcoming events in ${selectedLocation.name}`
                : 'No upcoming events'}
            </Text>
            <Text style={styles.stateText}>
              {selectedLocation
                ? 'Try another locality, or add one from the Discover tab.'
                : 'Add one from the Discover tab.'}
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header and chips are siblings ABOVE the list (not inside it), so
          they stay fixed while the cards scroll */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      {locations.length > 0 && (
        <ChipScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {renderChip('All', null)}
          {locations.map((location) => renderChip(location.name, location.id))}
        </ChipScrollView>
      )}

      {renderBody()}

      <EventDetailsModal
        eventId={detailEventId}
        visible={detailEventId !== null}
        onClose={() => setDetailEventId(null)}
        onChanged={loadEvents}
      />
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
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#05dd00',
  },

  // ---- Locality chips ----
  // flexGrow: 0 matters: a horizontal ScrollView otherwise stretches to fill
  // the screen's height and squeezes the list out
  chipScroll: {
    flexGrow: 0,
    height: 46, // fixed so the row can never be measured shorter than its chips
  },
  chipRow: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
    alignItems: 'center', // keeps every chip (and its text) fully visible
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#05dd00',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#05dd00',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#05dd00',
    lineHeight: 17, // avoids clipped/half-height text on Android
  },
  chipTextSelected: {
    color: '#ffffff',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // clearance so the last card isn't hidden behind the floating tab bar
    flexGrow: 1,
  },

  // ---- Event card ----
  cardWrap: {
    marginBottom: 16,
  },
  card: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
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

  // ---- Skeleton ----
  skeletonList: {
    paddingHorizontal: 20,
  },
  skeletonCard: {
    marginBottom: 16,
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
    textAlign: 'center',
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
