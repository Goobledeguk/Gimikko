import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// React Navigation automatically passes a `navigation` prop to any
// component registered as a <Tab.Screen /> or <Stack.Screen />.
// You call navigation.navigate('RouteName') from ANY button, not just
// the tab bar, to redirect the user to a different screen.
export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#05dd00',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
