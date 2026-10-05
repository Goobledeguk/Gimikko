import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={styles.taskTouchArea} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.checkIcon}>
          {item.completed ? '✓' : '○'}
        </Text>
        <Text style={[styles.taskTitle, item.completed && styles.completedTitle]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}