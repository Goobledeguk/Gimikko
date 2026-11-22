// =============================================================================
// components/EditProfileModal.jsx — the form behind the pencil icon on the
// Profile screen. Edits the logged-in person's display name, bio and locality,
// saves them to the `profiles` table, then reloads the profile so every
// screen (Home, Calendar, Profile) shows the new values straight away.
// (The username stays fixed after sign-up.)
// =============================================================================
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet from './BottomSheet';
import LocalityPicker from './LocalityPicker';
import { form } from './formStyles';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile } from '../services/account';

export default function EditProfileModal({ visible, onClose }) {
  const { profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [locationId, setLocationId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Every time the sheet opens, start from what's currently saved
  useEffect(() => {
    if (visible) {
      setDisplayName(profile.display_name);
      setBio(profile.bio ?? '');
      setLocationId(profile.location_id ?? null);
      setError('');
    }
  }, [visible]);

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSave = async () => {
    setError('');
    if (!displayName.trim()) return setError('Please enter your name.');

    setSaving(true);
    try {
      await updateProfile(profile.id, { displayName, bio, locationId });
      await refreshProfile();
      onClose();
    } catch (e) {
      setError(e.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet visible={visible} title="Edit Profile" onClose={handleClose}>
      <Text style={form.label}>Name</Text>
      <TextInput
        style={form.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your name"
        placeholderTextColor="#aaa"
        maxLength={40}
      />

      <Text style={form.label}>Bio</Text>
      <TextInput
        style={[form.input, form.inputMultiline]}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell people a little about you"
        placeholderTextColor="#aaa"
        maxLength={160}
        multiline
      />

      <Text style={form.label}>Locality</Text>
      <LocalityPicker value={locationId} onChange={setLocationId} />

      {error ? <Text style={form.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[form.button, saving && form.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={form.buttonText}>Save</Text>}
      </TouchableOpacity>
    </BottomSheet>
  );
}
