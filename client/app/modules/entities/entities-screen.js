import React from 'react';
import { ScrollView, Text } from 'react-native';
// Styles
import RoundedButton from '../../shared/components/rounded-button/rounded-button';

import styles from './entities-screen.styles';

export default function EntitiesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="entityScreenScrollList">
      <Text style={styles.centerText}>JHipster Entities will appear below</Text>
      <RoundedButton text="UserProfile" onPress={() => navigation.navigate('UserProfile')} testID="userProfileEntityScreenButton" />
      <RoundedButton text="SocialAccount" onPress={() => navigation.navigate('SocialAccount')} testID="socialAccountEntityScreenButton" />
      <RoundedButton
        text="TeacherProfile"
        onPress={() => navigation.navigate('TeacherProfile')}
        testID="teacherProfileEntityScreenButton"
      />
      <RoundedButton
        text="StudentProfile"
        onPress={() => navigation.navigate('StudentProfile')}
        testID="studentProfileEntityScreenButton"
      />
      <RoundedButton text="Course" onPress={() => navigation.navigate('Course')} testID="courseEntityScreenButton" />
      <RoundedButton text="CourseClass" onPress={() => navigation.navigate('CourseClass')} testID="courseClassEntityScreenButton" />
      <RoundedButton text="Lesson" onPress={() => navigation.navigate('Lesson')} testID="lessonEntityScreenButton" />
      <RoundedButton text="Schedule" onPress={() => navigation.navigate('Schedule')} testID="scheduleEntityScreenButton" />
      <RoundedButton text="Quiz" onPress={() => navigation.navigate('Quiz')} testID="quizEntityScreenButton" />
      <RoundedButton text="Question" onPress={() => navigation.navigate('Question')} testID="questionEntityScreenButton" />
      <RoundedButton text="QuizQuestion" onPress={() => navigation.navigate('QuizQuestion')} testID="quizQuestionEntityScreenButton" />
      <RoundedButton text="StudentQuiz" onPress={() => navigation.navigate('StudentQuiz')} testID="studentQuizEntityScreenButton" />
      <RoundedButton text="Flashcard" onPress={() => navigation.navigate('Flashcard')} testID="flashcardEntityScreenButton" />
      {/* jhipster-react-native-entity-screen-needle */}
    </ScrollView>
  );
}
