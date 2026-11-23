// =============================================================================
// LoginScreen.jsx — shown when nobody is logged in. Email + password.
// There's no "go to the next screen" code here on purpose: when the login
// succeeds, AuthContext notices the new session and App.js swaps this screen
// for the real app by itself.
//   onSwitch — called by the "Sign up" link (App.js swaps to SignUpScreen)
// =============================================================================
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { form } from '../components/formStyles';
import { signIn } from '../services/account';

export default function LoginScreen({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) return setError('Enter your email and password.');

    setSubmitting(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (e) {
      setError(e.message || 'Could not log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('../assets/gimikko-1.png')} style={styles.logo} resizeMode="contain" />


        <Text style={form.label}>Email</Text>
        <TextInput
          style={form.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={form.label}>Password</Text>
        <TextInput
          style={form.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor="#aaa"
          secureTextEntry
          autoCapitalize="none"
        />

        {error ? <Text style={form.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[form.button, submitting && form.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={form.buttonText}>Log in</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchRow} onPress={onSwitch}>
          <Text style={styles.switchText}>
            No account yet? <Text style={styles.switchLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logo: {
    width: 180,
    height: 100,
    alignSelf: 'center',
  },
  tagline: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#05dd00',
    marginBottom: 28,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#222',
  },
  switchRow: {
    marginTop: 22,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#666',
  },
  switchLink: {
    color: '#05dd00',
    fontWeight: 'bold',
  },
});
