import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Same shared object Home.jsx uses — this is how "user data from Home"
// reaches this screen. See data/mockUser.js for why a shared file (not a
// direct prop) is the simple way to do this between sibling tabs.
import { user } from '../user/user.js';

// -----------------------------------------------------------------------
// CATEGORIES — the toggle icons shown on the right side of the header.
// Each one is just a label + an Ionicons name; add more by adding another
// object here, no other code needs to change.
// -----------------------------------------------------------------------
const CATEGORIES = [
  { key: 'sport', label: 'Sport', icon: 'basketball' },
  { key: 'market', label: 'Market', icon: 'storefront' },
  { key: 'music', label: 'Music', icon: 'musical-notes' },
];

// -----------------------------------------------------------------------
// MOCK EVENTS — stand-in data until this comes from a real backend.
// Each event needs: a name, date, type (must match a CATEGORIES key so
// filtering works), a background image, and a rating (0-5) for the stars.
//
// The 5th event below is the one built from the shared `user` data —
// its name and star rating come directly from `user.name` / `user.rating`
// instead of being hardcoded, so editing data/mockUser.js changes this
// card automatically.
// -----------------------------------------------------------------------
const EVENTS = [
  {
    id: '1',
    name: 'Hadang Championship',
    date: 'Oct 12, 2026',
    type: 'sport',
    image: require('../assets/event/hadang.jpg'),
    rating: 4,
  },
  {
    id: '2',
    name: 'Sunday Palengke Bazaar',
    date: 'Oct 15, 2026',
    type: 'market',
    image: require('../assets/event/pickle.jpg'),
    rating: 5,
  },
  {
    id: '3',
    name: 'Hanumduman Live Night',
    date: 'Oct 18, 2026',
    type: 'music',
    image: require('../assets/event/hanumduman.jpg'),
    rating: 3,
  },
  {
    id: '4',
    name: 'Hidden Talent Fair',
    date: 'Oct 20, 2026',
    type: 'market',
    image: require('../assets/event/Hidden.jpg'),
    rating: 4,
  },
  {
    id: '5',
    // Built from the shared user object instead of a hardcoded string —
    // this is the "at least one event uses Home's user data" example.
    name: `${user.name}'s Match Night`,
    date: 'Oct 22, 2026',
    type: 'sport',
    image: require('../assets/event/match.jpg'),
    rating: user.rating,
  },
];

// -----------------------------------------------------------------------
// StarRating — small helper component that turns a 0-5 number into 5
// star icons, filling in as many as the rating value.
// -----------------------------------------------------------------------
function StarRating({ rating }) {
  const stars = [1, 2, 3, 4, 5]; // just used to loop 5 times
  return (
    <View style={styles.starsRow}>
      {stars.map((position) => (
        <Ionicons
          key={position}
          // filled star if this position is within the rating, otherwise
          // an outline star — e.g. rating=3 → filled, filled, filled, outline, outline
          name={position <= rating ? 'star' : 'star-outline'}
          size={14}
          color={position <= rating ? '#FFD700' : 'rgba(255,255,255,0.6)'}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}

// -----------------------------------------------------------------------
// EventCard — one long bar per event: background image, dark overlay for
// readability, and the event's name/date/type/rating layered on top.
// -----------------------------------------------------------------------
function EventCard({ event }) {
  const category = CATEGORIES.find((c) => c.key === event.type);

  return (
    <ImageBackground
      source={event.image}
      style={styles.card}
      imageStyle={styles.cardImage} // rounds the IMAGE itself, not just the card container
    >
      {/* Semi-transparent black layer sitting between the image and the
          text, purely so white text stays readable over any photo. */}
      <View style={styles.cardOverlay} />

      <View style={styles.cardContent}>
        {/* Small colored tag showing the event's category */}
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>{category?.label ?? event.type}</Text>
        </View>

        <Text style={styles.eventName} numberOfLines={1}>
          {event.name}
        </Text>
        <Text style={styles.eventDate}>{event.date}</Text>

        <StarRating rating={event.rating} />
      </View>
    </ImageBackground>
  );
}

// -----------------------------------------------------------------------
// CalendarScreen — the actual screen: header with title + filter toggles,
// then the scrollable list of EventCards.
// -----------------------------------------------------------------------
export default function CalendarScreen() {
  // null = no filter active, show every event. Otherwise holds one of the
  // CATEGORIES keys ('sport' | 'market' | 'music').
  const [activeFilter, setActiveFilter] = useState(null);

  const toggleFilter = (key) => {
    // Tapping an already-active filter turns it back off (shows all again)
    // instead of getting stuck only being able to switch between filters.
    setActiveFilter((current) => (current === key ? null : key));
  };

  const visibleEvents = activeFilter
    ? EVENTS.filter((event) => event.type === activeFilter)
    : EVENTS;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>

        <View style={styles.filterGroup}>
          {CATEGORIES.map((category) => {
            const isActive = activeFilter === category.key;
            return (
              <TouchableOpacity
                key={category.key}
                onPress={() => toggleFilter(category.key)}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={isActive ? '#ffffff' : '#05dd00'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // ---- Header row: title on the left, filter icons on the right ----
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#05dd00',
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#05dd00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#05dd00',
  },

  // ---- Scrollable list ----
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // clearance so the last card isn't hidden behind the floating tab bar
  },

  // ---- Event card ----
  card: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden', // clips the image + overlay to the card's rounded corners
    marginBottom: 16,
    justifyContent: 'flex-end', // pushes cardContent to the bottom of the card
  },
  cardImage: {
    borderRadius: 16,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject, // stretches to cover the entire card
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  },
});