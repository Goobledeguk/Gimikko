// =============================================================================
// SignUpScreen.jsx — creates an account. Asks for name, username, email,
// password and locality. Supabase Auth makes the account; a database trigger
// then creates the matching profile row from these details.
//   onSwitch — called by the "Log in" link (App.js swaps back to LoginScreen)
//
// After a successful sign-up there is no "next screen" code: AuthContext sees
// the new session and App.js shows the app. The one exception is when your
// Supabase project requires email confirmation — then there is no session
// yet, so we tell the person to confirm and log in. (Easiest for development:
// turn "Confirm email" off in the Supabase dashboard — see SETUP.md.)
// =============================================================================
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LocalityPicker from '../components/LocalityPicker';
import { form } from '../components/formStyles';
import { isUsernameTaken, signUp } from '../services/account';

export default function SignUpScreen({ onSwitch }) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locationId, setLocationId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSignUp = async () => {
    setError('');
    setNotice('');

    // Check everything on the device first, so each mistake gets its own message
    if (!displayName.trim()) return setError('Please enter your name.');
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return setError('Username must be 3-30 letters, numbers or underscores.');
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (!locationId) return setError('Please choose your locality.');

    setSubmitting(true);
    try {
      if (await isUsernameTaken(username)) {
        setError('That username is already taken. Try another.');
        return;
      }

      const { session } = await signUp({
        email: email.trim().toLowerCase(),
        password,
        displayName: displayName.trim(),
        username,
        locationId,
      });

      // session = logged in already; App.js takes over from here.
      if (!session) {
        setNotice('Account created! Check your email to confirm it, then log in.');
      }
    } catch (e) {
      setError(e.message || 'Could not create the account. Please try again.');
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
        <Text style={styles.title}>Create your account</Text>

        <Text style={form.label}>Name</Text>
        <TextInput
          style={form.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          placeholderTextColor="#aaa"
          maxLength={40}
        />

        <Text style={form.label}>Username</Text>
        <TextInput
          style={form.input}
          value={username}
          // keep it lowercase and only the characters the database allows
          onChangeText={(text) => setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          placeholder="e.g. nigel_gimik"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={30}
        />
        <Text style={form.hint}>Letters, numbers and underscores, 3-30 characters.</Text>

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
          placeholder="At least 6 characters"
          placeholderTextColor="#aaa"
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={form.label}>Locality</Text>
        <LocalityPicker value={locationId} onChange={setLocationId} />
        <Text style={form.hint}>Your home area — it decides which events we show you first.</Text>

        {error ? <Text style={form.error}>{error}</Text> : null}
        {notice ? <Text style={form.notice}>{notice}</Text> : null}

        <TouchableOpacity
          style={[form.button, submitting && form.buttonDisabled]}
          onPress={handleSignUp}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={form.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchRow} onPress={onSwitch}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink}>Log in</Text>
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
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#05dd00',
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
