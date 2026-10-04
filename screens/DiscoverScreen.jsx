import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';

// Pure UI prototype: 2-column image grid, no array/data file — each card
// is its own block with its own useState toggle. Tapping a card reveals
// its title + date on top of a dark semi-transparent cardOverlay; tapping again hides them.

export default function DiscoverScreen() {
  // One boolean per card — since nothing is looped/mapped, each card
  // needs its own piece of state to track whether IT is revealed.
  const [revealed1, setRevealed1] = useState(false);
  const [revealed2, setRevealed2] = useState(false);
  const [revealed3, setRevealed3] = useState(false);
  const [revealed4, setRevealed4] = useState(false);
  const [revealed5, setRevealed5] = useState(false);
  const [revealed6, setRevealed6] = useState(false);
  const [revealed7, setRevealed7] = useState(false);
  const [revealed8, setRevealed8] = useState(false);
  const [revealed9, setRevealed9] = useState(false);
  const [revealed10, setRevealed10] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header lives OUTSIDE the ScrollView below, as a plain sibling —
          same pattern as CalendarScreen's header. Since it's never placed
          inside the scrollable area, scrolling the grid can't move it. */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Discover Events</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {/* Card 1 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed1((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/hadang.jpg')}
              style={styles.cardImage}
            />
            {revealed1 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Hadang Championship</Text>
                <Text style={styles.cardDate}>Oct 12, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed2((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/Market.jpg')}
              style={styles.cardImage}
            />
            {revealed2 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Palengke Bazaar</Text>
                <Text style={styles.cardDate}>Oct 15, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed3((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/Hidden.jpg')}
              style={styles.cardImage}
            />
            {revealed3 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Live Music Night</Text>
                <Text style={styles.cardDate}>Oct 18, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed4((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/pickle.jpg')}
              style={styles.cardImage}
            />
            {revealed4 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>The Kitchen: Tournament</Text>
                <Text style={styles.cardDate}>Oct 20, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 5 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed5((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/match.jpg')}
              style={styles.cardImage}
            />
            {revealed5 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Matcha Night</Text>
                <Text style={styles.cardDate}>Oct 22, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 6 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed6((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/Palengke.jpg')}
              style={styles.cardImage}
            />
            {revealed6 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Food Festival</Text>
                <Text style={styles.cardDate}>Oct 25, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 7 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed7((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/Formal.jpg')}
              style={styles.cardImage}
            />
            {revealed7 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Remembrance Celebration</Text>
                <Text style={styles.cardDate}>Nov 1, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 8 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed8((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/Hackathon.jpg')}
              style={styles.cardImage}
            />
            {revealed8 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Regional Hackathon</Text>
                <Text style={styles.cardDate}>Nov 15, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 9 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed9((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/run.jpg')}
              style={styles.cardImage}
            />
            {revealed9 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Fun Run: 25k</Text>
                <Text style={styles.cardDate}>Nov 22, 2026</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Card 10 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setRevealed10((prev) => !prev)}
          >
            <Image
              source={require('../assets/event/Ponds.jpg')}
              style={styles.cardImage}
            />
            {revealed10 && (
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>Ponds Sponsorship</Text>
                <Text style={styles.cardDate}>Nov 25, 2026</Text>
              </View>
            )}
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // clearance for the floating tab bar
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00cc00',
  },

  // 2-column grid: wrap cards onto new rows, split them with space-between
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden', // clips the image + overlay to the card's rounded corners
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
  // Sits on top of the image once a card is tapped — semi-transparent dark
  // background ensures crisp text contrast and readability without expo-blur.
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.73)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
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
});
