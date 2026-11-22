// =============================================================================
// components/formStyles.js — the look shared by every form in the app
// (login, sign-up, edit profile, new event): labels, text boxes, the green
// button and the red error line. Change a value here and all forms follow.
// =============================================================================
import { StyleSheet } from 'react-native';

export const form = StyleSheet.create({
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top', // Android: start typing at the top of the box
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  error: {
    color: '#d33',
    fontSize: 13,
    marginTop: 12,
  },
  notice: {
    color: '#0a8f00',
    fontSize: 13,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#05dd00',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
