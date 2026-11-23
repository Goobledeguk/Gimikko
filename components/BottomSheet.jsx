// =============================================================================
// components/BottomSheet.jsx — the white panel that slides up from the bottom
// over a dimmed screen. Used by the new-event, edit-profile, review and event
// details sheets.
//   visible   — show or hide it
//   title     — heading text
//   onClose   — called by the X, the Android back button, or a downward swipe
//   children  — whatever goes inside (the form fields)
//
// Swipe-to-dismiss: drag the handle/header down past ~120px (or flick it) and
// the sheet slides away. Otherwise it springs back. The scrollable body is
// left alone so scrolling still works normally.
// =============================================================================
import { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomSheet({ visible, title, onClose, children }) {
  const translateY = useRef(new Animated.Value(0)).current;

  // Keep the latest onClose reachable from the PanResponder, which is created
  // only once and would otherwise capture a stale callback.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Every time the sheet opens, make sure it starts fully in place.
  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible, translateY]);

  const closeWithSlide = () => {
    Animated.timing(translateY, {
      toValue: 600, // far enough to leave the screen
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onCloseRef.current?.();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      // Only claim the gesture once the finger is clearly moving downward, so
      // taps on the close button still work.
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120 || gesture.vy > 1.2) {
          closeWithSlide();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Drag handle + header: this is the swipe-to-dismiss area */}
          <View {...panResponder.panHandlers}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
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
  // The little pill that tells the user this sheet can be dragged down
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginTop: -6,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
});
