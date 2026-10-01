import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Import the Calendar component from the library
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  // Store the selected date string (format: 'YYYY-MM-DD')
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View>

      {/* Wrapper View to add border-radius, centering, and screen gaps */}
      <View style={styles.calendarWrapper}>
        <Calendar
          // Callback that gets called when a day is pressed
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            console.log('Selected day object:', day);
          }}
          
          // Month format in calendar title (e.g., 'January 2026')
          monthFormat={'MMMM yyyy'}
          
          // Hide selector arrows if wanted (default = false)
          hideArrows={false}
          
          // Do not show days of other months in current month page
          hideExtraDays={true}
          
          // Enable swiping to change months
          enableSwipeMonths={true}
          
          // Mark the selected day dynamically
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: '#007AFF', // Theme color
              selectedTextColor: '#ffffff',
            },
          }}
          
          // Theme customization (Fonts, Colors, Backgrounds)
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#007AFF',
            dayTextColor: '#2d4150',
            textDisabledColor: '#dd99ee',
            arrowColor: '#007AFF',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: '#2d4150',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
        />
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.selectionText}>
          {selectedDate ? `Selected Date: ${selectedDate}` : 'No date selected'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center', 
  },

  header: {
    top: -10,
    margin: 15,
    padding: 16,
    borderRadius: 16, 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#22cc00',
    //shadow
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,   
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  //STYLES FOR CALENDAR 
  calendarWrapper: {
    marginHorizontal: 16,      
    borderRadius: 16,          
    overflow: 'hidden',        
    backgroundColor: '#ffffff',
    //shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,              
  },
  selectionContainer: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 16,
    color: '#4a5568',
  },
});

//kon diri kam edita o tangala nala :)