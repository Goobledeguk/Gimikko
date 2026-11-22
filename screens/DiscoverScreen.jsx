// =============================================================================
// DiscoverScreen.jsx — the "Discover" tab. DYNAMIC: every event comes from
// Supabase and is shown in a 2-column grid. Tap a card to blur it and reveal
// its title, category, date and locality, plus two buttons:
//   bookmark  = Save it   (shows up in Profile -> My Saved Gimik)
//   checkmark = Join it   (counts toward "Trending" and your Events number)
// The "+" button in the header opens a form (CreateEventModal) that saves a
// new event to the database as the logged-in person.
//
// Flow:  mount -> fetchEvents() + my saved/joined ids -> grid
//        tap a button -> screen updates instantly -> database call (undone if it fails)
//        "+" -> form -> createEvent() -> onCreated -> reload -> new event appears
// =============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// BlurTargetView is how expo-blur (SDK 55+) knows WHAT to blur on Android.
import { BlurView, BlurTargetView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import CreateEventModal from '../components/CreateEventModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchEvents } from '../services/events';
import { fetchMyEventFlags, setJoined, setSaved } from '../services/account';
import { formatDate } from '../utils/date';

// A copy of a Set with `id` added (on = true) or removed (on = false).
// (State must be replaced with a NEW Set, not changed in place, or React
// wouldn't notice the change.)
function withToggled(set, id, on) {
  const copy = new Set(set);
  if (on) copy.add(id);
  else copy.delete(id);
  return copy;
}

// -----------------------------------------------------------------------
// EventCard — one grid cell. It's its own component only because each card
// needs its own ref (blurTargetRef) for the Android blur, and hooks can't be
// called inside a list's renderItem directly.
// -----------------------------------------------------------------------
function EventCard({ event, revealed, saved, joined, onPress, onToggleSaved, onToggleJoined }) {
  const blurTargetRef = useRef(null);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {/* The thing being blurred must live inside a BlurTargetView */}
      <BlurTargetView ref={blurTargetRef} style={StyleSheet.absoluteFill}>
        <Image source={{ uri: event.image_url }} style={styles.cardImage} />
      </BlurTargetView>

      {revealed && (
        <BlurView
          blurTarget={blurTargetRef}
          blurMethod="dimezisBlurView" // real blur on Android (default is just a tint)
          intensity={60}
          tint="dark"
          style={styles.blurOverlay}
        >
          {event.category && <Text style={styles.cardTag}>{event.category.label}</Text>}
          <Text style={styles.cardTitle} numberOfLines={2}>
            {event.name}
          </Text>
          <Text style={styles.cardDate}>{formatDate(event.event_date)}</Text>
          {event.location && <Text style={styles.cardLocation}>{event.location.name}</Text>}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, saved && styles.actionButtonOn]}
              onPress={onToggleSaved}
              accessibilityLabel={saved ? 'Unsave event' : 'Save event'}
            >
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={16} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, joined && styles.actionButtonOn]}
              onPress={onToggleJoined}
              accessibilityLabel={joined ? 'Leave event' : 'Join event'}
            >
              <Ionicons
                name={joined ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={16}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </TouchableOpacity>
  );
}

export default function DiscoverScreen() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set()); // ids of events I saved
  const [joinedIds, setJoinedIds] = useState(new Set()); // ids of events I joined
  const [loading, setLoading] = useState(true); // first load only
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(''); // a save/join that didn't go through
  const [revealedId, setRevealedId] = useState(null); // which card is showing its blur (one at a time)
  const [formVisible, setFormVisible] = useState(false);

  // Fetches the events and my saved/joined ids together; on failure keeps
  // whatever was already on screen.
  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const [list, flags] = await Promise.all([fetchEvents(), fetchMyEventFlags(user.id)]);
      setEvents(list);
      setSavedIds(flags.savedIds);
      setJoinedIds(flags.joinedIds);
    } catch (e) {
      setError(e.message || 'Unknown error');
    }
  }, [user.id]);

  // Runs once when the screen first mounts
  useEffect(() => {
    loadEvents().finally(() => setLoading(false));
  }, [loadEvents]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleRetry = () => {
    setLoading(true);
    loadEvents().finally(() => setLoading(false));
  };

  // Called by the form after a successful save
  const handleCreated = async () => {
    setFormVisible(false);
    await loadEvents();
  };

  // Save/unsave or join/leave one event. The button changes IMMEDIATELY (so
  // the app feels instant); then the database is told. If the database says
  // no (e.g. no internet), the change is undone and a message is shown.
  const toggle = async (ids, setIds, saveToDatabase, eventId) => {
    const turnOn = !ids.has(eventId);
    setActionError('');
    setIds((prev) => withToggled(prev, eventId, turnOn));
    try {
      await saveToDatabase(user.id, eventId, turnOn);
    } catch (e) {
      setIds((prev) => withToggled(prev, eventId, !turnOn));
      setActionError(e.message || 'Something went wrong. Please try again.');
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#05dd00" />
        </View>
      );
    }

    // Only show the full-screen error when there's nothing to show instead
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
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        extraData={{ revealedId, savedIds, joinedIds }} // re-render the list when any of these change
        renderItem={({ item }) => (
          <EventCard
            event={item}
            revealed={revealedId === item.id}
            saved={savedIds.has(item.id)}
            joined={joinedIds.has(item.id)}
            // tap again on the open card to close it; tap another to switch
            onPress={() => setRevealedId((prev) => (prev === item.id ? null : item.id))}
            onToggleSaved={() => toggle(savedIds, setSavedIds, setSaved, item.id)}
            onToggleJoined={() => toggle(joinedIds, setJoinedIds, setJoined, item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="calendar-outline" size={44} color="#bbb" />
            <Text style={styles.stateTitle}>No events yet</Text>
            <Text style={styles.stateText}>Tap the + button to add the first one.</Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header is a sibling ABOVE the list (not inside it), so it stays put
          while the grid scrolls. The + button sits inline on the right. */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Discover Events</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setFormVisible(true)}
          accessibilityLabel="Add event"
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {actionError ? <Text style={styles.actionError}>{actionError}</Text> : null}

      {renderBody()}

      <CreateEventModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onCreated={handleCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Title on the left, + button on the right, vertically centered together
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00cc00',
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#05dd00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionError: {
    color: '#d33',
    fontSize: 13,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // clearance for the floating tab bar
    flexGrow: 1,
  },
  // Two cards per row; space-between keeps a lone last card at 48% width
  row: {
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden', // clips the image + blur to the rounded corners
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cardTag: {
    color: '#05dd00',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  cardDate: {
    color: '#eeeeee',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  cardLocation: {
    color: '#dddddd',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },

  // The save / join buttons under the text. They turn green once switched on.
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOn: {
    backgroundColor: '#05dd00',
  },

  // Loading / error / empty states
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
