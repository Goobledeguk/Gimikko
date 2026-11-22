// =============================================================================
// ProfileScreen.jsx — the "Profile" tab. LIVE DATA for the logged-in person:
//   name, @username, locality, bio  <- their profile (edit with the pencil)
//   Saved / Joined / Posted numbers <- the profile_stats view
//   My Saved Gimik                  <- the events they bookmarked in Discover
// Plus Settings and About popups (static info) and a Log out button.
// Reloads each time the tab gains focus, and supports pull-to-refresh.
// =============================================================================
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchMySavedEvents, fetchMyStats } from "../services/account";
import { formatDate } from "../utils/date";

// Which icon a saved event gets, by its category's key (calendar if it has none)
const CATEGORY_ICONS = {
  sport: "basketball",
  market: "storefront",
  music: "musical-notes",
};

// This function creates the Profile Screen of our application.
export default function ProfileScreen() {
  const { profile, refreshProfile, signOut } = useAuth();

  // Live data
  const [stats, setStats] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true); // first load only
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState("");

  // One boolean per popup — each controls whether its own <Modal> is visible.
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);

  // Loads the numbers and the saved list together. On failure, whatever was
  // already on screen stays and a message appears.
  const loadData = useCallback(async () => {
    try {
      setError("");
      const [myStats, saved] = await Promise.all([
        fetchMyStats(profile.id),
        fetchMySavedEvents(profile.id),
      ]);
      setStats(myStats);
      setSavedEvents(saved);
    } catch (e) {
      setError(e.message || "Could not load your profile data.");
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  // Runs each time this tab becomes active
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), refreshProfile()]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(); // App.js notices and swaps to the login screen
    } catch (e) {
      setError(e.message || "Could not log out.");
    }
  };

  const localityText = profile.location
    ? `${profile.location.name}, ${profile.location.province}`
    : "No locality set";

  // Shows "–" until the numbers have arrived
  const statValue = (key) => (stats ? stats[key] : "–");

  return (
    <View style={styles.container}>

      {/* ScrollView allows the user to scroll through the profile content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#0BD318"]} />
        }
      >

        {/* Profile picture placeholder */}
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={65} color="#777" />
        </View>

        {/* Name + inline edit icon, side by side in one row */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.display_name}</Text>
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => setShowEditPopup(true)}
          >
            <Ionicons name="create-outline" size={20} color="#0BD318" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>@{profile.username}</Text>

        {/* User's location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#0BD318" />
          <Text style={styles.location}>{localityText}</Text>
        </View>

        {/* Short description or bio of the user */}
        <Text style={styles.bio}>
          {profile.bio || "No bio yet — tap the pencil to add one."}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Statistics section showing Saved, Joined, and Posted events */}
        <View style={styles.statsContainer}>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{statValue("saved_count")}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{statValue("joined_count")}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{statValue("posted_count")}</Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>

        </View>


        {/* Section title for saved events */}
        <Text style={styles.sectionTitle}>My Saved Gimik</Text>

        {loading ? (
          <ActivityIndicator color="#0BD318" style={styles.savedLoading} />
        ) : savedEvents.length === 0 ? (
          <Text style={styles.emptyText}>
            Nothing saved yet. Tap an event in Discover, then the bookmark.
          </Text>
        ) : (
          savedEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>

              {/* Icon representing the event's category */}
              <View style={styles.eventIcon}>
                <Ionicons
                  name={CATEGORY_ICONS[event.category?.key] ?? "calendar"}
                  size={28}
                  color="#0BD318"
                />
              </View>

              {/* Event information */}
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>{event.name}</Text>
                <Text style={styles.eventDetails}>
                  📅 {formatDate(event.event_date)}
                </Text>
                <Text style={styles.eventLocation}>
                  📍 {event.location?.name ?? "No locality"}
                </Text>
              </View>

            </View>
          ))
        )}

        {/* Section title for the menu rows below */}
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

        {/* Log out row */}
        <TouchableOpacity style={styles.eventCard} onPress={handleLogout}>
          <View style={styles.eventIcon}>
            <Ionicons name="log-out-outline" size={28} color="#0BD318" />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Log out</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* EDIT PROFILE — a real form (name, bio, locality) that saves to the database */}
      <EditProfileModal visible={showEditPopup} onClose={() => setShowEditPopup(false)} />

      {/* ------------------------------------------------------------- */}
      {/* SETTINGS POPUP — three category buttons with NO onPress yet. */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showSettingsPopup}
        transparent
        animationType="slide"
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
      {/* ABOUT POPUP — the team, centered, with a divider between entries. */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={showAboutPopup}
        transparent
        animationType="slide"
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

  // Red message if loading the numbers/list failed
  errorText: {
    color: "#d33",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
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

  // Spinner / empty message in the saved list
  savedLoading: {
    marginVertical: 16,
  },
  emptyText: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },

  // Style for each saved event card AND the Settings/About/Log out rows
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

  // Style for the event date
  eventDetails: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  // Style for the event locality
  eventLocation: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
  },

  // ---- Popup (Modal) shared styles ----
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
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
});
