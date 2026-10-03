import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';

// Pure UI prototype: 2-column image grid, no array/data file — each card
// is its own block with its own useState toggle. Tapping a card blurs the
// photo and reveals its title + date on top; tapping again hides them.

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Discover Events</Text>
      </View>

      <View style={styles.grid}>
        {/* Card 1 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed1((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600' }}
            style={styles.cardImage}
          />
          {revealed1 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Hadang Championship</Text>
              <Text style={styles.cardDate}>Oct 12, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed2((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600' }}
            style={styles.cardImage}
          />
          {revealed2 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Palengke Bazaar</Text>
              <Text style={styles.cardDate}>Oct 15, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>

        {/* Card 3 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed3((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600' }}
            style={styles.cardImage}
          />
          {revealed3 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Live Music Night</Text>
              <Text style={styles.cardDate}>Oct 18, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>

        {/* Card 4 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed4((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600' }}
            style={styles.cardImage}
          />
          {revealed4 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Talent Fair</Text>
              <Text style={styles.cardDate}>Oct 20, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>

        {/* Card 5 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed5((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600' }}
            style={styles.cardImage}
          />
          {revealed5 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Match Night</Text>
              <Text style={styles.cardDate}>Oct 22, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>

        {/* Card 6 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed6((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600' }}
            style={styles.cardImage}
          />
          {revealed6 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Food Festival</Text>
              <Text style={styles.cardDate}>Oct 25, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => setRevealed7((prev) => !prev)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600' }}
            style={styles.cardImage}
          />
          {revealed7 && (
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.cardTitle}>Food Festival</Text>
              <Text style={styles.cardDate}>Oct 25, 2026</Text>
            </BlurView>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 100, // clearance for the floating tab bar
  },
  header: {
    marginBottom: 16,
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
    overflow: 'hidden', // clips the image + blur to the card's rounded corners
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
  // Sits on top of the image once a card is tapped — BlurView handles the
  // actual blur, this just also centers the title/date text over it.
  blurOverlay: {
   position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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