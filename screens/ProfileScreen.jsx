import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// This function creates the Profile Screen of our application.
export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Settings button - placed at the top-right corner */}
      <TouchableOpacity style={styles.settingsButton}>
        <Ionicons name="settings" size={32} color="white" />
      </TouchableOpacity>

      {/* ScrollView allows the user to scroll through the profile content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Profile picture placeholder */}
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={65} color="#777" />
        </View>

        {/* User's name and username */}
        <Text style={styles.name}>Nigel</Text>
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

        {/* Edit Profile button */}
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

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

      </ScrollView>

      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>

        {/* Home navigation button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={35} color="#999" />
        </TouchableOpacity>

        {/* Events navigation button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Events")}
        >
          <Ionicons name="calendar" size={35} color="#999" />
        </TouchableOpacity>

        {/* Saved navigation button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Saved")}
        >
          <Ionicons name="star" size={35} color="#999" />
        </TouchableOpacity>

        {/* Profile navigation button - currently active */}
        <TouchableOpacity>
          <Ionicons
            name="person-circle"
            size={38}
            color="#0BD318"
          />

          {/* Green line shows that Profile is the active screen */}
          <View style={styles.activeLine} />
        </TouchableOpacity>

      </View>

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

  // Style for the user's name
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
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

  // Style for the Edit Profile button
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0BD318",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
  },

  // Style for the Edit Profile text
  editText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // Style for the "My Saved Gimik" title
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 23,
    fontWeight: "bold",
    color: "#0BD318",
    marginTop: 30,
    marginBottom: 12,
  },

  // Style for each saved event card
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },

  // Background and size of the event icon
  eventIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#E9FFE9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Controls the event information area
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },

  // Style for the event title
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