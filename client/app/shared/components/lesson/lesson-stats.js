import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './lesson-stats.styles';

const LessonStats = ({ lessons = [] }) => {
  const theme = useTheme();

  // Calculate statistics
  const totalLessons = lessons.length;
  const lessonsWithVideo = lessons.filter((lesson) => lesson.videoUrl).length;
  const lessonsWithSlide = lessons.filter((lesson) => lesson.slideUrl).length;
  const uniqueCourses = [
    ...new Set(lessons.filter((lesson) => lesson.course).map((lesson) => lesson.course.id)),
  ].length;

  const stats = [
    {
      icon: 'book-open-variant',
      label: 'Tổng số bài học',
      value: totalLessons,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer,
    },
    {
      icon: 'play-circle',
      label: 'Bài học có video',
      value: lessonsWithVideo,
      color: theme.colors.error,
      backgroundColor: theme.colors.errorContainer,
    },
    {
      icon: 'presentation',
      label: 'Bài học có slide',
      value: lessonsWithSlide,
      color: theme.colors.tertiary,
      backgroundColor: theme.colors.tertiaryContainer,
    },
    {
      icon: 'school',
      label: 'Khóa học',
      value: uniqueCourses,
      color: theme.colors.secondary,
      backgroundColor: theme.colors.secondaryContainer,
    },
  ];

  const renderStatCard = (stat, index) => (
    <Card
      key={index}
      style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}
      elevation={0}
    >
      <Card.Content style={styles.statContent}>
        <View style={styles.statHeader}>
          <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />
        </View>
        <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
        <Text style={[styles.statLabel, { color: stat.color }]} numberOfLines={2}>
          {stat.label}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stats.map(renderStatCard)}
      </ScrollView>
    </View>
  );
};

export default LessonStats;
