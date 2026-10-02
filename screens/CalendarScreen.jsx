import { StyleSheet, Text, View, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Pure UI prototype — everything below is typed out directly (no shared
// data file, no array you loop over, no separate card component). Each
// event is its own block of JSX so the layout is easy to read top to
// bottom and easy to tweak per-card without affecting the others.

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event 1 */}
        <ImageBackground
          source={require('../assets/event/hadang.jpg')}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>Sport</Text>
            </View>
            <Text style={styles.eventName} numberOfLines={1}>
              Hadang Championship
            </Text>
            <Text style={styles.eventDate}>Oct 12, 2026</Text>
            <View style={styles.starsRow}>
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star-outline" size={14} color="rgba(255,255,255,0.6)" />
            </View>
          </View>
        </ImageBackground>

        {/* Event 2 */}
        <ImageBackground
          source={require('../assets/event/pickle.jpg')}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>Market</Text>
            </View>
            <Text style={styles.eventName} numberOfLines={1}>
              Sunday Palengke Bazaar
            </Text>
            <Text style={styles.eventDate}>Oct 15, 2026</Text>
            <View style={styles.starsRow}>
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" />
            </View>
          </View>
        </ImageBackground>

        {/* Event 3 */}
        <ImageBackground
          source={require('../assets/event/hanumduman.jpg')}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>Music</Text>
            </View>
            <Text style={styles.eventName} numberOfLines={1}>
              Hanumduman Live Night
            </Text>
            <Text style={styles.eventDate}>Oct 18, 2026</Text>
            <View style={styles.starsRow}>
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star-outline" size={14} color="rgba(255,255,255,0.6)" style={styles.starIcon} />
              <Ionicons name="star-outline" size={14} color="rgba(255,255,255,0.6)" />
            </View>
          </View>
        </ImageBackground>

        {/* Event 4 */}
        <ImageBackground
          source={require('../assets/event/Hidden.jpg')}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>Market</Text>
            </View>
            <Text style={styles.eventName} numberOfLines={1}>
              Hidden Talent Fair
            </Text>
            <Text style={styles.eventDate}>Oct 20, 2026</Text>
            <View style={styles.starsRow}>
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star-outline" size={14} color="rgba(255,255,255,0.6)" />
            </View>
          </View>
        </ImageBackground>

        {/* Event 5 */}
        <ImageBackground
          source={require('../assets/event/match.jpg')}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>Sport</Text>
            </View>
            <Text style={styles.eventName} numberOfLines={1}>
              Nigel's Match Night
            </Text>
            <Text style={styles.eventDate}>Oct 22, 2026</Text>
            <View style={styles.starsRow}>
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
              <Ionicons name="star" size={14} color="#FFD700" />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
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
  },
  card: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'flex-end',
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
  },
  starIcon: {
    marginRight: 2,
  },
});