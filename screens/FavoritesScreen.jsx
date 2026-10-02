import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function FavoritesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Nigel!</Text>
      </View>

      {/* Trending Gimik Section */}
      <Text style={styles.sectionTitle}>Trending Gimik</Text>
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600' }} 
          style={styles.cardImage} 
        />
      </TouchableOpacity>

      {/* Recommended Gimik Section */}
      <Text style={styles.sectionTitle}>Recommended Gimik</Text>
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600' }} 
          style={styles.cardImage} 
        />
      </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00cc00',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00cc00',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
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
});