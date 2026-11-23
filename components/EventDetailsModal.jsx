// =============================================================================
// components/EventDetailsModal.jsx — the event popup. Opened by tapping an
// Upcoming card or a carousel image on Home. It shows the event photo, name,
// category, date, locality and rating, plus a small "who's going" badge with
// attendee initials (from event_attendees + profiles). Join and save buttons
// work right here and stay in sync with the rest of the app.
//
//   eventId   — which event to show (the sheet loads the details itself)
//   visible   — show/hide
//   onClose   — called by the X
//   onChanged — optional; called after a join/save so the screen can refresh
// =============================================================================
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchEventAttendees, fetchEventById } from '../services/events';
import { fetchMyFlagsForEvent, setJoined, setSaved } from '../services/account';
import { formatDate } from '../utils/date';

// 1-5 filled stars for the event's average
function Stars({ rating }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((position) => (
        <Ionicons
          key={position}
          name={rating >= position ? 'star' : 'star-outline'}
          size={14}
          color={rating >= position ? '#FFD700' : '#ccc'}
        />
      ))}
      <Text style={styles.ratingText}>
        {rating > 0 ? rating.toFixed(1) : 'No reviews yet'}
      </Text>
    </View>
  );
}

// "Maria Santos" -> "MS"
function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function EventDetailsModal({ eventId, visible, onClose, onChanged }) {
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [saved, setSaved] = useState(false);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Load everything the sheet shows whenever it opens for an event.
  useEffect(() => {
    if (!visible || !eventId || !user) return;

    let active = true;
    setLoading(true);
    setError('');
    setEvent(null);
    setAttendees([]);

    (async () => {
      try {
        const [details, people, flags] = await Promise.all([
          fetchEventById(eventId),
          fetchEventAttendees(eventId),
          fetchMyFlagsForEvent(user.id, eventId),
        ]);
        if (!active) return;
        setEvent(details);
        setAttendees(people);
        setSaved(flags.saved);
        setJoined(flags.joined);
      } catch (e) {
        if (active) setError(e.message || 'Could not load this event.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [visible, eventId, user]);

  // Join/leave or save/unsave. The server is asked first here because the
  // sheet is already a deliberate tap (no need for optimistic flips).
  const toggle = async (kind) => {
    const isSaved = kind === 'saved';
    const turnOn = !(isSaved ? saved : joined);
    setBusy(true);
    setError('');

    try {
      await (isSaved ? setSaved : setJoined)(user.id, eventId, turnOn);

      // Re-read the event so the "going" count and guest list are accurate.
      const [details, people] = await Promise.all([
        fetchEventById(eventId),
        fetchEventAttendees(eventId),
      ]);
      setEvent(details);
      setAttendees(people);
      if (isSaved) setSaved(turnOn);
      else setJoined(turnOn);
      onChanged?.();
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color="#05dd00" size="large" />
        </View>
      );
    }

    if (!event) {
      return (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={38} color="#bbb" />
          <Text style={styles.stateText}>{error || 'Event not found.'}</Text>
        </View>
      );
    }

    const visibleAttendees = attendees.slice(0, 6);

    return (
      <>
        <Image source={{ uri: event.image_url }} style={styles.image} />

        <View style={styles.titleRow}>
          {event.category && (
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>{event.category.label}</Text>
            </View>
          )}
          <Text style={styles.name}>{event.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#05dd00" />
          <Text style={styles.infoText}>{formatDate(event.event_date)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#05dd00" />
          <Text style={styles.infoText}>
            {event.location?.name || 'No locality set'}
          </Text>
        </View>

        <Stars rating={event.avg_rating} />

        {/* Who's going — green badge + overlapping initials */}
        <View style={styles.goingCard}>
          <View style={styles.goingHeader}>
            <Ionicons name="people" size={16} color="#05dd00" />
            <Text style={styles.goingText}>
              {event.join_count} {event.join_count === 1 ? 'person going' : 'people going'}
            </Text>
          </View>

          {attendees.length === 0 ? (
            <Text style={styles.goingEmpty}>Be the first to join.</Text>
          ) : (
            <View style={styles.avatarRow}>
              {visibleAttendees.map((person) => (
                <View key={person.id} style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(person.display_name)}</Text>
                </View>
              ))}
              {event.join_count > visibleAttendees.length && (
                <View style={[styles.avatar, styles.avatarMore]}>
                  <Text style={styles.avatarMoreText}>
                    +{event.join_count - visibleAttendees.length}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.joinButton, joined && styles.joinButtonOn, busy && styles.disabled]}
            onPress={() => toggle('joined')}
            disabled={busy}
          >
            <Ionicons
              name={joined ? 'checkmark-circle' : 'add-circle-outline'}
              size={18}
              color={joined ? '#ffffff' : '#05dd00'}
            />
            <Text style={[styles.joinText, joined && styles.joinTextOn]}>
              {joined ? 'Going' : 'Join Event'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, saved && styles.saveButtonOn, busy && styles.disabled]}
            onPress={() => toggle('saved')}
            disabled={busy}
            accessibilityLabel={saved ? 'Unsave event' : 'Save event'}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={saved ? '#ffffff' : '#05dd00'}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <BottomSheet visible={visible} title="Event Details" onClose={onClose}>
      {renderBody()}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  stateText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },

  image: {
    width: '100%',
    height: 170,
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: '#eee',
  },
  titleRow: {
    marginTop: 14,
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
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },

  goingCard: {
    backgroundColor: '#F2FDF1',
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
  },
  goingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0a8f00',
  },
  goingEmpty: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#05dd00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  avatarMore: {
    backgroundColor: '#d7f5d6',
  },
  avatarMoreText: {
    color: '#0a8f00',
    fontSize: 11,
    fontWeight: 'bold',
  },

  error: {
    color: '#d33',
    fontSize: 13,
    marginTop: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#05dd00',
    borderRadius: 24,
    paddingVertical: 12,
  },
  joinButtonOn: {
    backgroundColor: '#05dd00',
  },
  joinText: {
    color: '#05dd00',
    fontWeight: 'bold',
    fontSize: 15,
  },
  joinTextOn: {
    color: '#ffffff',
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#05dd00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonOn: {
    backgroundColor: '#05dd00',
  },
  disabled: {
    opacity: 0.6,
  },
});
