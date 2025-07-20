import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/api';
import FixtureAPI from '../services/fixture-api';
import AppConfig from '../../config/app-config';

/* ------------- Types ------------- */

import { StartupTypes } from '../reducers/startup.reducer';
import { LoginTypes } from '../../modules/login/login.reducer';
import { AccountTypes } from '../../shared/reducers/account.reducer';
import { RegisterTypes } from '../../modules/account/register/register.reducer';
import { ForgotPasswordTypes } from '../../modules/account/password-reset/forgot-password.reducer';
import { ChangePasswordTypes } from '../../modules/account/password/change-password.reducer';
import { UserTypes } from '../../shared/reducers/user.reducer';
import { UserProfileTypes } from '../../modules/entities/user-profile/user-profile.reducer';
import { SocialAccountTypes } from '../../modules/entities/social-account/social-account.reducer';
import { TeacherProfileTypes } from '../../modules/entities/teacher-profile/teacher-profile.reducer';
import { StudentProfileTypes } from '../../modules/entities/student-profile/student-profile.reducer';
import { CourseTypes } from '../../modules/entities/course/course.reducer';
import { CourseClassTypes } from '../../modules/entities/course-class/course-class.reducer';
import { LessonTypes } from '../../modules/entities/lesson/lesson.reducer';
import { ScheduleTypes } from '../../modules/entities/schedule/schedule.reducer';
import { QuizTypes } from '../../modules/entities/quiz/quiz.reducer';
import { QuestionTypes } from '../../modules/entities/question/question.reducer';
import { QuizQuestionTypes } from '../../modules/entities/quiz-question/quiz-question.reducer';
import { StudentQuizTypes } from '../../modules/entities/student-quiz/student-quiz.reducer';
import { FlashcardTypes } from '../../modules/entities/flashcard/flashcard.reducer';
// jhipster-react-native-saga-redux-import-needle

/* ------------- Sagas ------------- */

import { startup } from './startup.saga';
import { login, logout, loginLoad } from '../../modules/login/login.sagas';
import { register } from '../../modules/account/register/register.sagas';
import { forgotPassword } from '../../modules/account/password-reset/forgot-password.sagas';
import { changePassword } from '../../modules/account/password/change-password.sagas';
import { getAccount, updateAccount } from '../../shared/sagas/account.sagas';
import UserSagas from '../../shared/sagas/user.sagas';
import UserProfileSagas from '../../modules/entities/user-profile/user-profile.sagas';
import SocialAccountSagas from '../../modules/entities/social-account/social-account.sagas';
import TeacherProfileSagas from '../../modules/entities/teacher-profile/teacher-profile.sagas';
import StudentProfileSagas from '../../modules/entities/student-profile/student-profile.sagas';
import CourseSagas from '../../modules/entities/course/course.sagas';
import CourseClassSagas from '../../modules/entities/course-class/course-class.sagas';
import LessonSagas from '../../modules/entities/lesson/lesson.sagas';
import ScheduleSagas from '../../modules/entities/schedule/schedule.sagas';
import QuizSagas from '../../modules/entities/quiz/quiz.sagas';
import QuestionSagas from '../../modules/entities/question/question.sagas';
import QuizQuestionSagas from '../../modules/entities/quiz-question/quiz-question.sagas';
import StudentQuizSagas from '../../modules/entities/student-quiz/student-quiz.sagas';
import FlashcardSagas from '../../modules/entities/flashcard/flashcard.sagas';
// jhipster-react-native-saga-method-import-needle

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = AppConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // JHipster accounts
    takeLatest(LoginTypes.LOGIN_LOAD, loginLoad, api),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),

    takeLatest(UserProfileTypes.USER_PROFILE_REQUEST, UserProfileSagas.getUserProfile, api),
    takeLatest(UserProfileTypes.USER_PROFILE_ALL_REQUEST, UserProfileSagas.getAllUserProfiles, api),
    takeLatest(UserProfileTypes.USER_PROFILE_UPDATE_REQUEST, UserProfileSagas.updateUserProfile, api),
    takeLatest(UserProfileTypes.USER_PROFILE_DELETE_REQUEST, UserProfileSagas.deleteUserProfile, api),

    takeLatest(SocialAccountTypes.SOCIAL_ACCOUNT_REQUEST, SocialAccountSagas.getSocialAccount, api),
    takeLatest(SocialAccountTypes.SOCIAL_ACCOUNT_ALL_REQUEST, SocialAccountSagas.getAllSocialAccounts, api),
    takeLatest(SocialAccountTypes.SOCIAL_ACCOUNT_UPDATE_REQUEST, SocialAccountSagas.updateSocialAccount, api),
    takeLatest(SocialAccountTypes.SOCIAL_ACCOUNT_DELETE_REQUEST, SocialAccountSagas.deleteSocialAccount, api),

    takeLatest(TeacherProfileTypes.TEACHER_PROFILE_REQUEST, TeacherProfileSagas.getTeacherProfile, api),
    takeLatest(TeacherProfileTypes.TEACHER_PROFILE_ALL_REQUEST, TeacherProfileSagas.getAllTeacherProfiles, api),
    takeLatest(TeacherProfileTypes.TEACHER_PROFILE_UPDATE_REQUEST, TeacherProfileSagas.updateTeacherProfile, api),
    takeLatest(TeacherProfileTypes.TEACHER_PROFILE_DELETE_REQUEST, TeacherProfileSagas.deleteTeacherProfile, api),

    takeLatest(StudentProfileTypes.STUDENT_PROFILE_REQUEST, StudentProfileSagas.getStudentProfile, api),
    takeLatest(StudentProfileTypes.STUDENT_PROFILE_ALL_REQUEST, StudentProfileSagas.getAllStudentProfiles, api),
    takeLatest(StudentProfileTypes.STUDENT_PROFILE_UPDATE_REQUEST, StudentProfileSagas.updateStudentProfile, api),
    takeLatest(StudentProfileTypes.STUDENT_PROFILE_DELETE_REQUEST, StudentProfileSagas.deleteStudentProfile, api),

    takeLatest(CourseTypes.COURSE_REQUEST, CourseSagas.getCourse, api),
    takeLatest(CourseTypes.COURSE_ALL_REQUEST, CourseSagas.getAllCourses, api),
    takeLatest(CourseTypes.COURSE_UPDATE_REQUEST, CourseSagas.updateCourse, api),
    takeLatest(CourseTypes.COURSE_DELETE_REQUEST, CourseSagas.deleteCourse, api),

    takeLatest(CourseClassTypes.COURSE_CLASS_REQUEST, CourseClassSagas.getCourseClass, api),
    takeLatest(CourseClassTypes.COURSE_CLASS_ALL_REQUEST, CourseClassSagas.getAllCourseClasses, api),
    takeLatest(CourseClassTypes.COURSE_CLASS_UPDATE_REQUEST, CourseClassSagas.updateCourseClass, api),
    takeLatest(CourseClassTypes.COURSE_CLASS_DELETE_REQUEST, CourseClassSagas.deleteCourseClass, api),

    takeLatest(LessonTypes.LESSON_REQUEST, LessonSagas.getLesson, api),
    takeLatest(LessonTypes.LESSON_ALL_REQUEST, LessonSagas.getAllLessons, api),
    takeLatest(LessonTypes.LESSON_UPDATE_REQUEST, LessonSagas.updateLesson, api),
    takeLatest(LessonTypes.LESSON_DELETE_REQUEST, LessonSagas.deleteLesson, api),

    takeLatest(ScheduleTypes.SCHEDULE_REQUEST, ScheduleSagas.getSchedule, api),
    takeLatest(ScheduleTypes.SCHEDULE_ALL_REQUEST, ScheduleSagas.getAllSchedules, api),
    takeLatest(ScheduleTypes.SCHEDULE_UPDATE_REQUEST, ScheduleSagas.updateSchedule, api),
    takeLatest(ScheduleTypes.SCHEDULE_DELETE_REQUEST, ScheduleSagas.deleteSchedule, api),

    takeLatest(QuizTypes.QUIZ_REQUEST, QuizSagas.getQuiz, api),
    takeLatest(QuizTypes.QUIZ_ALL_REQUEST, QuizSagas.getAllQuizzes, api),
    takeLatest(QuizTypes.QUIZ_UPDATE_REQUEST, QuizSagas.updateQuiz, api),
    takeLatest(QuizTypes.QUIZ_DELETE_REQUEST, QuizSagas.deleteQuiz, api),

    takeLatest(QuestionTypes.QUESTION_REQUEST, QuestionSagas.getQuestion, api),
    takeLatest(QuestionTypes.QUESTION_ALL_REQUEST, QuestionSagas.getAllQuestions, api),
    takeLatest(QuestionTypes.QUESTION_UPDATE_REQUEST, QuestionSagas.updateQuestion, api),
    takeLatest(QuestionTypes.QUESTION_DELETE_REQUEST, QuestionSagas.deleteQuestion, api),

    takeLatest(QuizQuestionTypes.QUIZ_QUESTION_REQUEST, QuizQuestionSagas.getQuizQuestion, api),
    takeLatest(QuizQuestionTypes.QUIZ_QUESTION_ALL_REQUEST, QuizQuestionSagas.getAllQuizQuestions, api),
    takeLatest(QuizQuestionTypes.QUIZ_QUESTION_UPDATE_REQUEST, QuizQuestionSagas.updateQuizQuestion, api),
    takeLatest(QuizQuestionTypes.QUIZ_QUESTION_DELETE_REQUEST, QuizQuestionSagas.deleteQuizQuestion, api),

    takeLatest(StudentQuizTypes.STUDENT_QUIZ_REQUEST, StudentQuizSagas.getStudentQuiz, api),
    takeLatest(StudentQuizTypes.STUDENT_QUIZ_ALL_REQUEST, StudentQuizSagas.getAllStudentQuizs, api),
    takeLatest(StudentQuizTypes.STUDENT_QUIZ_UPDATE_REQUEST, StudentQuizSagas.updateStudentQuiz, api),
    takeLatest(StudentQuizTypes.STUDENT_QUIZ_DELETE_REQUEST, StudentQuizSagas.deleteStudentQuiz, api),

    takeLatest(FlashcardTypes.FLASHCARD_REQUEST, FlashcardSagas.getFlashcard, api),
    takeLatest(FlashcardTypes.FLASHCARD_ALL_REQUEST, FlashcardSagas.getAllFlashcards, api),
    takeLatest(FlashcardTypes.FLASHCARD_UPDATE_REQUEST, FlashcardSagas.updateFlashcard, api),
    takeLatest(FlashcardTypes.FLASHCARD_DELETE_REQUEST, FlashcardSagas.deleteFlashcard, api),
    // jhipster-react-native-saga-redux-connect-needle

    takeLatest(RegisterTypes.REGISTER_REQUEST, register, api),
    takeLatest(ForgotPasswordTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, api),
    takeLatest(ChangePasswordTypes.CHANGE_PASSWORD_REQUEST, changePassword, api),
    takeLatest(UserTypes.USER_REQUEST, UserSagas.getUser, api),
    takeLatest(UserTypes.USER_UPDATE_REQUEST, UserSagas.updateUser, api),
    takeLatest(UserTypes.USER_DELETE_REQUEST, UserSagas.deleteUser, api),
    takeLatest(UserTypes.USER_ALL_REQUEST, UserSagas.getAllUsers, api),

    takeLatest(AccountTypes.ACCOUNT_REQUEST, getAccount, api),
    takeLatest(AccountTypes.ACCOUNT_UPDATE_REQUEST, updateAccount, api),
  ]);
}
