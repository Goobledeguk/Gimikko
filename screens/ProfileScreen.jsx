import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// This function creates the Profile Screen of our application.
export default function ProfileScreen({ navigation }) {
  // One boolean per popup — each controls whether its own <Modal> is
  // visible. This is a pure UI prototype: tapping a row just flips one of
  // these to true, there's no real editing/settings logic behind any of it.
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);

  return (
    <View style={styles.container}>

      {/* ScrollView allows the user to scroll through the profile content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Profile picture placeholder */}
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={65} color="#777" />
        </View>

        {/* Name + inline edit icon, side by side in one row */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>Nigel</Text>
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => setShowEditPopup(true)}
          >
            <Ionicons name="create-outline" size={20} color="#0BD318" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>@nigel_gimik</Text>

        {/* User's location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#0BD318" />
          <Text style={styles.location}>Calbayog City, Samar</Text>
        </View>

        {/* Short description or bio of the user */}
        <Text style={styles.bio}>
          Always looking for new gimik and local events.
        </Text>

        {/* Statistics section showing Saved, Joined, and Posted events */}
        <View style={styles.statsContainer}>

          {/* Saved events count */}
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          {/* Joined events count */}
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>

          {/* Posted events count */}
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>

        </View>


        {/* Section title for saved events */}
        <Text style={styles.sectionTitle}>My Saved Gimik</Text>

        {/* First saved event */}
        <TouchableOpacity style={styles.eventCard}>

          {/* Icon representing the event */}
          <View style={styles.eventIcon}>
            <Ionicons name="musical-notes" size={28} color="#0BD318" />
          </View>

          {/* Event information */}
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Live Music Night</Text>

            {/* Date and time of the event */}
            <Text style={styles.eventDetails}>
              📅 Sept 25 • 9:00 PM
            </Text>

            {/* Location of the event */}
            <Text style={styles.eventLocation}>
              📍 Local Venue
            </Text>
          </View>

          {/* Arrow indicates that the event can be opened */}
          <Ionicons name="chevron-forward" size={24} color="#999" />

        </TouchableOpacity>

        {/* Second saved event */}
        <TouchableOpacity style={styles.eventCard}>

          {/* Icon representing an art event */}
          <View style={styles.eventIcon}>
            <Ionicons name="color-palette" size={28} color="#0BD318" />
          </View>

          {/* Event information */}
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Art Exhibit</Text>

            {/* Date and time of the event */}
            <Text style={styles.eventDetails}>
              📅 Oct 2 • 6:00 PM
            </Text>

            {/* Location of the event */}
            <Text style={styles.eventLocation}>
              📍 Local Art Gallery
            </Text>
          </View>

          {/* Arrow indicates that the event can be opened */}
          <Ionicons name="chevron-forward" size={24} color="#999" />

        </TouchableOpacity>

        {/* Section title for the two menu rows below */}
        <Text style={styles.sectionTitle}>More</Text>

        {/* Settings row — opens the Settings popup */}
        <TouchableOpacity
          style={styles.eventCard}
          onPress={() => setShowSettingsPopup(true)}
        >
          <View style={styles.eventIcon}>
            <Ionicons name="settings-outline" size={28} color="#0BD318" />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        {/* About row — opens the About popup */}
        <TouchableOpacity
          style={styles.eventCard}
          onPress={() => setShowAboutPopup(true)}
        >
          <View style={styles.eventIcon}>
            <Ionicons name="information-circle-outline" size={28} color="#0BD318" />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

      </ScrollView>

      {/* ------------------------------------------------------------- */}
      {/* EDIT PROFILE POPUP — shown when the pencil icon beside the name
          is tapped. Pure prototype: just confirms "updated" visually,
          no real save/edit logic behind it. */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showEditPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Ionicons name="checkmark-circle" size={44} color="#0BD318" />
            <Text style={styles.popupTitle}>Updated Details</Text>
            <Text style={styles.popupText}>
              Your profile information has been updated.
            </Text>
            <TouchableOpacity
              style={styles.popupCloseButton}
              onPress={() => setShowEditPopup(false)}
            >
              <Text style={styles.popupCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* SETTINGS POPUP — three category buttons, typed directly, with
          NO onPress function attached (per request: visual only). */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showSettingsPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettingsPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.popupTitle}>Settings</Text>

            <TouchableOpacity style={styles.settingsOption}>
              <Ionicons name="time-outline" size={20} color="#333" />
              <Text style={styles.settingsOptionText}>Activity Log</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsOption}>
              <Ionicons name="lock-closed-outline" size={20} color="#333" />
              <Text style={styles.settingsOptionText}>Privacy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsOption}>
              <Ionicons name="options-outline" size={20} color="#333" />
              <Text style={styles.settingsOptionText}>Preference</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.popupCloseButton}
              onPress={() => setShowSettingsPopup(false)}
            >
              <Text style={styles.popupCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* ABOUT POPUP — each name/handle typed directly (no array/.map —
          same "hardcode everything" approach used elsewhere in this
          prototype), centered, with a divider line between entries. */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showAboutPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAboutPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.popupTitle}>About</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.aboutScroll}>
              <Text style={styles.aboutName}>Alizzander Cahusay</Text>
              <Text style={styles.aboutHandle}>@Goobledeguk</Text>
              <View style={styles.aboutDivider} />

              <Text style={styles.aboutName}>Gracia May Alpez</Text>
              <Text style={styles.aboutHandle}>@gm158</Text>
              <View style={styles.aboutDivider} />

              <Text style={styles.aboutName}>Mark Anthony Jubasan</Text>
              <Text style={styles.aboutHandle}>@MarkJubasan</Text>
              <View style={styles.aboutDivider} />

              <Text style={styles.aboutName}>Stephen Joriza</Text>
              <Text style={styles.aboutHandle}>@Baliwalo03</Text>
              <View style={styles.aboutDivider} />

              <Text style={styles.aboutName}>Liza Mae Timan</Text>
              <Text style={styles.aboutHandle}>@sheimaiii</Text>

              <Text style={styles.aboutCopyright}>Gimikko © 2026</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.popupCloseButton}
              onPress={() => setShowAboutPopup(false)}
            >
              <Text style={styles.popupCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}


// ----------------------------------------------------
// STYLES
// ----------------------------------------------------
// StyleSheet is used to control the appearance and layout
// of the different components in our Profile Screen.

const styles = StyleSheet.create({

  // Main container of the screen
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Controls the layout of the scrollable profile content
  content: {
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 130,
    paddingHorizontal: 25,
  },

  // Style for the settings button
  settingsButton: {
    position: "absolute",
    right: 30,
    top: 45,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#BDBDBD",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 5,
  },

  // Circular area used for the profile picture
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  // Name + edit icon sit side by side in this row
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Style for the user's name
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
  },

  // Small circular tap target for the pencil/edit icon beside the name
  editIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E9FFE9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Style for the username
  username: {
    fontSize: 16,
    color: "#888",
    marginTop: 3,
  },

  // Layout for the location icon and text
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  // Style for the location text
  location: {
    fontSize: 15,
    color: "#666",
    marginLeft: 5,
  },

  // Style for the profile description
  bio: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  // Places the three statistics beside each other
  statsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  // Style for each statistics box
  statBox: {
    width: "31%",
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },

  // Style for the statistic number
  statNumber: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#0BD318",
  },

  // Style for the statistic label
  statLabel: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  // Style for the "My Saved Gimik" / "More" section titles
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 23,
    fontWeight: "bold",
    color: "#0BD318",
    marginTop: 30,
    marginBottom: 12,
  },

  // Style for each saved event card AND the Settings/About menu rows
  // (same visual treatment, reused rather than duplicated)
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },

  // Background and size of the event/menu icon
  eventIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#E9FFE9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Controls the event/menu information area
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },

  // Style for the event/menu title
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  // Style for the event date and time
  eventDetails: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  // Style for the event location
  eventLocation: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
  },

  // ---- Popup (Modal) shared styles ----
  // Dark semi-transparent backdrop behind every popup
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  // The white rounded card itself, centered on screen
  popupCard: {
    width: "100%",
    maxHeight: "75%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginTop: 8,
    marginBottom: 10,
  },
  popupText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  popupCloseButton: {
    backgroundColor: "#0BD318",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 16,
  },
  popupCloseText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },

  // ---- Settings popup options ----
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
    gap: 12,
  },
  settingsOptionText: {
    fontSize: 15,
    color: "#333",
  },

  // ---- About popup list ----
  aboutScroll: {
    width: "100%",
    maxHeight: 280,
  },
  aboutName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  aboutHandle: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 12,
  },
  aboutDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  aboutCopyright: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
  },

  // Style for the bottom navigation bar
  bottomNav: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 95,
    backgroundColor: "white",
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,

    // Shadow settings for Android/iOS
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  // Green line that indicates the current active page
  activeLine: {
    width: 30,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#0BD318",
    marginTop: 3,
    alignSelf: "center",
  },
});