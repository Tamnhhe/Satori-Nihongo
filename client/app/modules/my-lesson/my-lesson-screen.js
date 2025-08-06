import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MyLessonScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài học của tôi</Text>
      <Text style={styles.subtitle}>Xem các bài học đã học và đang học</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default MyLessonScreen;
