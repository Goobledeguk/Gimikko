// =============================================================================
// CreateEventModal.jsx — the "new event" form, shown as a bottom sheet.
// Asks for the three things an event needs: name, date, and a cover image.
// It owns all of the form's own state; the screen that opens it only has to
// pass three props:
//   visible    — true/false, whether the sheet is showing
//   onClose    — called when the user cancels
//   onCreated  — called after the event was saved (screen then refreshes its list)
// =============================================================================
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { createEvent } from '../services/events';

// True only for real calendar dates written as YYYY-MM-DD. The round-trip
// through Date catches impossible dates like 2026-02-31 (JS would silently
// roll that over into March, so we compare the parts back).
function isRealDate(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Inserts the dashes while the user types, so they only press digits:
// "20261225" shows up as "2026-12-25". Also caps input at 8 digits.
function formatDateInput(text) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join('-');
}

export default function CreateEventModal({ visible, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [dateText, setDateText] = useState('');
  const [asset, setAsset] = useState(null); // the picked image (uri + base64 + mimeType)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setDateText('');
    setAsset(null);
    setError('');
  };

  const handleClose = () => {
    if (submitting) return; // don't let the sheet vanish mid-upload
    resetForm();
    onClose();
  };

  // Opens the photo library. `base64: true` makes the picker also return the
  // image as text, which is what gets uploaded to Supabase Storage.
  // Quality 0.7 + a 4:3 crop keeps uploads small without looking bad.
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      setAsset(result.assets[0]);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validate on the device first so the user gets instant, specific feedback.
    // (The database has matching CHECK constraints as a safety net.)
    if (!name.trim()) return setError('Please enter an event name.');
    if (!isRealDate(dateText)) return setError('Enter a valid date as YYYY-MM-DD.');
    if (!asset) return setError('Please choose an event image.');

    setSubmitting(true);
    try {
      await createEvent({ name, eventDate: dateText, asset });
      resetForm();
      onCreated();
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>New Event</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={10}>
              <Ionicons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          {/* keyboardShouldPersistTaps lets the buttons work with the keyboard open */}
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Sunday Palengke Bazaar"
              placeholderTextColor="#aaa"
              maxLength={80}
            />

            <Text style={styles.label}>Event Date</Text>
            <TextInput
              style={styles.input}
              value={dateText}
              onChangeText={(text) => setDateText(formatDateInput(text))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Event Image</Text>
            <TouchableOpacity style={styles.imageBox} onPress={pickImage} activeOpacity={0.8}>
              {asset ? (
                <Image source={{ uri: asset.uri }} style={styles.preview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={34} color="#05dd00" />
                  <Text style={styles.imagePlaceholderText}>Tap to choose a cover image</Text>
                </View>
              )}
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Create Event</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Dim backdrop; justifyContent: 'flex-end' pins the sheet to the bottom
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },
  // Dashed box that shows either the placeholder or the chosen photo
  imageBox: {
    height: 170,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#05dd00',
    backgroundColor: '#F2FDF1',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: '#666',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  error: {
    color: '#d33',
    fontSize: 13,
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#05dd00',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
