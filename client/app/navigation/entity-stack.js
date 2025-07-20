import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';

import { DrawerButton } from './drawer/drawer-button';
import { navigate, goBackOrIfParamsOrDefault } from './nav-ref';

// import screens
import EntitiesScreen from '../modules/entities/entities-screen';
import UserProfileScreen from '../modules/entities/user-profile/user-profile-screen';
import UserProfileDetailScreen from '../modules/entities/user-profile/user-profile-detail-screen';
import UserProfileEditScreen from '../modules/entities/user-profile/user-profile-edit-screen';
import SocialAccountScreen from '../modules/entities/social-account/social-account-screen';
import SocialAccountDetailScreen from '../modules/entities/social-account/social-account-detail-screen';
import SocialAccountEditScreen from '../modules/entities/social-account/social-account-edit-screen';
import TeacherProfileScreen from '../modules/entities/teacher-profile/teacher-profile-screen';
import TeacherProfileDetailScreen from '../modules/entities/teacher-profile/teacher-profile-detail-screen';
import TeacherProfileEditScreen from '../modules/entities/teacher-profile/teacher-profile-edit-screen';
import StudentProfileScreen from '../modules/entities/student-profile/student-profile-screen';
import StudentProfileDetailScreen from '../modules/entities/student-profile/student-profile-detail-screen';
import StudentProfileEditScreen from '../modules/entities/student-profile/student-profile-edit-screen';
import CourseScreen from '../modules/entities/course/course-screen';
import CourseDetailScreen from '../modules/entities/course/course-detail-screen';
import CourseEditScreen from '../modules/entities/course/course-edit-screen';
import CourseClassScreen from '../modules/entities/course-class/course-class-screen';
import CourseClassDetailScreen from '../modules/entities/course-class/course-class-detail-screen';
import CourseClassEditScreen from '../modules/entities/course-class/course-class-edit-screen';
import LessonScreen from '../modules/entities/lesson/lesson-screen';
import LessonDetailScreen from '../modules/entities/lesson/lesson-detail-screen';
import LessonEditScreen from '../modules/entities/lesson/lesson-edit-screen';
import ScheduleScreen from '../modules/entities/schedule/schedule-screen';
import ScheduleDetailScreen from '../modules/entities/schedule/schedule-detail-screen';
import ScheduleEditScreen from '../modules/entities/schedule/schedule-edit-screen';
import QuizScreen from '../modules/entities/quiz/quiz-screen';
import QuizDetailScreen from '../modules/entities/quiz/quiz-detail-screen';
import QuizEditScreen from '../modules/entities/quiz/quiz-edit-screen';
import QuestionScreen from '../modules/entities/question/question-screen';
import QuestionDetailScreen from '../modules/entities/question/question-detail-screen';
import QuestionEditScreen from '../modules/entities/question/question-edit-screen';
import QuizQuestionScreen from '../modules/entities/quiz-question/quiz-question-screen';
import QuizQuestionDetailScreen from '../modules/entities/quiz-question/quiz-question-detail-screen';
import QuizQuestionEditScreen from '../modules/entities/quiz-question/quiz-question-edit-screen';
import StudentQuizScreen from '../modules/entities/student-quiz/student-quiz-screen';
import StudentQuizDetailScreen from '../modules/entities/student-quiz/student-quiz-detail-screen';
import StudentQuizEditScreen from '../modules/entities/student-quiz/student-quiz-edit-screen';
import FlashcardScreen from '../modules/entities/flashcard/flashcard-screen';
import FlashcardDetailScreen from '../modules/entities/flashcard/flashcard-detail-screen';
import FlashcardEditScreen from '../modules/entities/flashcard/flashcard-edit-screen';
// jhipster-react-native-navigation-import-needle

export const entityScreens = [
  {
    name: 'Entities',
    route: '',
    component: EntitiesScreen,
    options: {
      headerLeft: DrawerButton,
    },
  },
  {
    name: 'UserProfile',
    route: 'user-profile',
    component: UserProfileScreen,
    options: {
      title: 'UserProfiles',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('UserProfileEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'UserProfileDetail',
    route: 'user-profile/detail',
    component: UserProfileDetailScreen,
    options: { title: 'View UserProfile', headerLeft: () => <HeaderBackButton onPress={() => navigate('UserProfile')} /> },
  },
  {
    name: 'UserProfileEdit',
    route: 'user-profile/edit',
    component: UserProfileEditScreen,
    options: {
      title: 'Edit UserProfile',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('UserProfileDetail', 'UserProfile')} />,
    },
  },
  {
    name: 'SocialAccount',
    route: 'social-account',
    component: SocialAccountScreen,
    options: {
      title: 'SocialAccounts',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('SocialAccountEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'SocialAccountDetail',
    route: 'social-account/detail',
    component: SocialAccountDetailScreen,
    options: { title: 'View SocialAccount', headerLeft: () => <HeaderBackButton onPress={() => navigate('SocialAccount')} /> },
  },
  {
    name: 'SocialAccountEdit',
    route: 'social-account/edit',
    component: SocialAccountEditScreen,
    options: {
      title: 'Edit SocialAccount',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('SocialAccountDetail', 'SocialAccount')} />,
    },
  },
  {
    name: 'TeacherProfile',
    route: 'teacher-profile',
    component: TeacherProfileScreen,
    options: {
      title: 'TeacherProfiles',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('TeacherProfileEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'TeacherProfileDetail',
    route: 'teacher-profile/detail',
    component: TeacherProfileDetailScreen,
    options: { title: 'View TeacherProfile', headerLeft: () => <HeaderBackButton onPress={() => navigate('TeacherProfile')} /> },
  },
  {
    name: 'TeacherProfileEdit',
    route: 'teacher-profile/edit',
    component: TeacherProfileEditScreen,
    options: {
      title: 'Edit TeacherProfile',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('TeacherProfileDetail', 'TeacherProfile')} />,
    },
  },
  {
    name: 'StudentProfile',
    route: 'student-profile',
    component: StudentProfileScreen,
    options: {
      title: 'StudentProfiles',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('StudentProfileEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'StudentProfileDetail',
    route: 'student-profile/detail',
    component: StudentProfileDetailScreen,
    options: { title: 'View StudentProfile', headerLeft: () => <HeaderBackButton onPress={() => navigate('StudentProfile')} /> },
  },
  {
    name: 'StudentProfileEdit',
    route: 'student-profile/edit',
    component: StudentProfileEditScreen,
    options: {
      title: 'Edit StudentProfile',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('StudentProfileDetail', 'StudentProfile')} />,
    },
  },
  {
    name: 'Course',
    route: 'course',
    component: CourseScreen,
    options: {
      title: 'Courses',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('CourseEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'CourseDetail',
    route: 'course/detail',
    component: CourseDetailScreen,
    options: { title: 'View Course', headerLeft: () => <HeaderBackButton onPress={() => navigate('Course')} /> },
  },
  {
    name: 'CourseEdit',
    route: 'course/edit',
    component: CourseEditScreen,
    options: {
      title: 'Edit Course',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('CourseDetail', 'Course')} />,
    },
  },
  {
    name: 'CourseClass',
    route: 'course-class',
    component: CourseClassScreen,
    options: {
      title: 'CourseClasses',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('CourseClassEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'CourseClassDetail',
    route: 'course-class/detail',
    component: CourseClassDetailScreen,
    options: { title: 'View CourseClass', headerLeft: () => <HeaderBackButton onPress={() => navigate('CourseClass')} /> },
  },
  {
    name: 'CourseClassEdit',
    route: 'course-class/edit',
    component: CourseClassEditScreen,
    options: {
      title: 'Edit CourseClass',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('CourseClassDetail', 'CourseClass')} />,
    },
  },
  {
    name: 'Lesson',
    route: 'lesson',
    component: LessonScreen,
    options: {
      title: 'Lessons',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('LessonEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'LessonDetail',
    route: 'lesson/detail',
    component: LessonDetailScreen,
    options: { title: 'View Lesson', headerLeft: () => <HeaderBackButton onPress={() => navigate('Lesson')} /> },
  },
  {
    name: 'LessonEdit',
    route: 'lesson/edit',
    component: LessonEditScreen,
    options: {
      title: 'Edit Lesson',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('LessonDetail', 'Lesson')} />,
    },
  },
  {
    name: 'Schedule',
    route: 'schedule',
    component: ScheduleScreen,
    options: {
      title: 'Schedules',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('ScheduleEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'ScheduleDetail',
    route: 'schedule/detail',
    component: ScheduleDetailScreen,
    options: { title: 'View Schedule', headerLeft: () => <HeaderBackButton onPress={() => navigate('Schedule')} /> },
  },
  {
    name: 'ScheduleEdit',
    route: 'schedule/edit',
    component: ScheduleEditScreen,
    options: {
      title: 'Edit Schedule',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('ScheduleDetail', 'Schedule')} />,
    },
  },
  {
    name: 'Quiz',
    route: 'quiz',
    component: QuizScreen,
    options: {
      title: 'Quizzes',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('QuizEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'QuizDetail',
    route: 'quiz/detail',
    component: QuizDetailScreen,
    options: { title: 'View Quiz', headerLeft: () => <HeaderBackButton onPress={() => navigate('Quiz')} /> },
  },
  {
    name: 'QuizEdit',
    route: 'quiz/edit',
    component: QuizEditScreen,
    options: { title: 'Edit Quiz', headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('QuizDetail', 'Quiz')} /> },
  },
  {
    name: 'Question',
    route: 'question',
    component: QuestionScreen,
    options: {
      title: 'Questions',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('QuestionEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'QuestionDetail',
    route: 'question/detail',
    component: QuestionDetailScreen,
    options: { title: 'View Question', headerLeft: () => <HeaderBackButton onPress={() => navigate('Question')} /> },
  },
  {
    name: 'QuestionEdit',
    route: 'question/edit',
    component: QuestionEditScreen,
    options: {
      title: 'Edit Question',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('QuestionDetail', 'Question')} />,
    },
  },
  {
    name: 'QuizQuestion',
    route: 'quiz-question',
    component: QuizQuestionScreen,
    options: {
      title: 'QuizQuestions',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('QuizQuestionEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'QuizQuestionDetail',
    route: 'quiz-question/detail',
    component: QuizQuestionDetailScreen,
    options: { title: 'View QuizQuestion', headerLeft: () => <HeaderBackButton onPress={() => navigate('QuizQuestion')} /> },
  },
  {
    name: 'QuizQuestionEdit',
    route: 'quiz-question/edit',
    component: QuizQuestionEditScreen,
    options: {
      title: 'Edit QuizQuestion',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('QuizQuestionDetail', 'QuizQuestion')} />,
    },
  },
  {
    name: 'StudentQuiz',
    route: 'student-quiz',
    component: StudentQuizScreen,
    options: {
      title: 'StudentQuizs',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('StudentQuizEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'StudentQuizDetail',
    route: 'student-quiz/detail',
    component: StudentQuizDetailScreen,
    options: { title: 'View StudentQuiz', headerLeft: () => <HeaderBackButton onPress={() => navigate('StudentQuiz')} /> },
  },
  {
    name: 'StudentQuizEdit',
    route: 'student-quiz/edit',
    component: StudentQuizEditScreen,
    options: {
      title: 'Edit StudentQuiz',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('StudentQuizDetail', 'StudentQuiz')} />,
    },
  },
  {
    name: 'Flashcard',
    route: 'flashcard',
    component: FlashcardScreen,
    options: {
      title: 'Flashcards',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('FlashcardEdit', { id: undefined })}
          backImage={props => <Ionicons name="add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'FlashcardDetail',
    route: 'flashcard/detail',
    component: FlashcardDetailScreen,
    options: { title: 'View Flashcard', headerLeft: () => <HeaderBackButton onPress={() => navigate('Flashcard')} /> },
  },
  {
    name: 'FlashcardEdit',
    route: 'flashcard/edit',
    component: FlashcardEditScreen,
    options: {
      title: 'Edit Flashcard',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('FlashcardDetail', 'Flashcard')} />,
    },
  },
  // jhipster-react-native-navigation-declaration-needle
];

export const getEntityRoutes = () => {
  const routes = {};
  entityScreens.forEach(screen => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const EntityStack = createStackNavigator();

export default function EntityStackScreen() {
  return (
    <EntityStack.Navigator>
      {entityScreens.map((screen, index) => {
        return <EntityStack.Screen name={screen.name} component={screen.component} key={index} options={screen.options} />;
      })}
    </EntityStack.Navigator>
  );
}
