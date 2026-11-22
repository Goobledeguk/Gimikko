// =============================================================================
// components/LocalityPicker.jsx — tap-to-select chips of localities, loaded
// from the `locations` table. Used by the sign-up, edit-profile and new-event
// forms. It does its own loading, so a form only has to give it two props:
//   value     — the chosen locality's id (or null)
//   onChange  — called with the new id when a chip is tapped
// Chips wrap onto extra lines (instead of scrolling sideways) because this
// always sits inside a form that already scrolls vertically.
// =============================================================================
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchLocations } from '../services/events';
import { form } from './formStyles';

export default function LocalityPicker({ value, onChange }) {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setLocations(await fetchLocations());
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading') {
    return <ActivityIndicator color="#05dd00" style={styles.loading} />;
  }

  if (status === 'error') {
    return (
      <TouchableOpacity onPress={load}>
        <Text style={form.error}>Couldn't load localities. Tap to retry.</Text>
      </TouchableOpacity>
    );
  }

  if (locations.length === 0) {
    return <Text style={form.hint}>No localities are set up yet.</Text>;
  }

  return (
    <View style={styles.wrap}>
      {locations.map((location) => {
        const selected = location.id === value;
        return (
          <TouchableOpacity
            key={location.id}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(location.id)}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {location.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#05dd00',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipSelected: {
    backgroundColor: '#05dd00',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#05dd00',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  loading: {
    alignSelf: 'flex-start',
  },
});
