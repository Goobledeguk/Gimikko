// =============================================================================
// components/ReviewModal.jsx — "Write a Review" from the Home tab. Pick the
// event you attended, tap 1-5 stars, add an optional comment, and save. The
// review is tied to the chosen event (event_reviews.event_id) and to the
// logged-in person automatically.
//
//   visible     — show/hide
//   onClose     — called by the X
//   onSubmitted — called after a successful save so Home can refresh
// =============================================================================
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import { form } from './formStyles';
import { useAuth } from '../context/AuthContext.jsx';
import { createEventReview, fetchEvents } from '../services/events';
import { formatDate } from '../utils/date';

export default function ReviewModal({ visible, onClose, onSubmitted }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load the event list only when the sheet is opened (and reset the form).
  useEffect(() => {
    if (!visible) return;

    let active = true;
    setError('');
    setRating(0);
    setComment('');
    setEventId(null);
    setLoading(true);

    fetchEvents()
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch((e) => {
        if (active) setError(e.message || 'Could not load events.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [visible]);

  const handleSubmit = async () => {
    setError('');
    if (!eventId) return setError('Please choose the event you attended.');
    if (rating < 1) return setError('Please tap a star rating.');

    setSubmitting(true);
    try {
      await createEventReview({
        eventId,
        reviewerId: user.id,
        rating,
        comment,
      });
      onSubmitted?.();
    } catch (e) {
      setError(e.message || 'Could not save your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet visible={visible} title="Write a Review" onClose={onClose}>
      <Text style={form.label}>Which event did you attend?</Text>

      {loading ? (
        <ActivityIndicator color="#05dd00" style={styles.loading} />
      ) : events.length === 0 ? (
        <Text style={form.hint}>No events to review yet.</Text>
      ) : (
        <ScrollView style={styles.eventList} nestedScrollEnabled>
          {events.map((event) => {
            const selected = event.id === eventId;
            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventRow, selected && styles.eventRowSelected]}
                onPress={() => {
                  setEventId(event.id);
                  setError('');
                }}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color="#05dd00"
                />
                <View style={styles.eventTextBlock}>
                  <Text style={styles.eventName} numberOfLines={1}>
                    {event.name}
                  </Text>
                  <Text style={styles.eventMeta}>
                    {formatDate(event.event_date)}
                    {event.location?.name ? `  •  ${event.location.name}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Text style={form.label}>Your Rating</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((position) => (
          <TouchableOpacity
            key={position}
            onPress={() => setRating(position)}
            accessibilityLabel={`${position} star${position > 1 ? 's' : ''}`}
          >
            <Ionicons
              name={position <= rating ? 'star' : 'star-outline'}
              size={32}
              color="#FFD700"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={form.label}>Comment (optional)</Text>
      <TextInput
        style={[form.input, form.inputMultiline]}
        value={comment}
        onChangeText={setComment}
        placeholder="How was the event?"
        placeholderTextColor="#aaa"
        multiline
        maxLength={300}
      />

      {error ? <Text style={form.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[form.button, submitting && form.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={form.buttonText}>Post Review</Text>
        )}
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginVertical: 20,
  },
  eventList: {
    maxHeight: 190,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  eventRowSelected: {
    borderColor: '#05dd00',
    backgroundColor: '#F2FDF1',
  },
  eventTextBlock: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  eventMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  star: {
    marginRight: 2,
  },
});
