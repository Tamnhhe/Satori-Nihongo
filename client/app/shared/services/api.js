// a library to wrap and simplify api calls
import apisauce from 'apisauce';

import AppConfig from '../../config/app-config';

// our "constructor"
const create = (baseURL = AppConfig.apiUrl) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
    },
    // 10 second timeout...
    timeout: 10000,
  });

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const setAuthToken = (userAuth) => api.setHeader('Authorization', 'Bearer ' + userAuth);
  const removeAuthToken = () => api.deleteHeader('Authorization');
  const login = (userAuth) => api.post('api/authenticate', userAuth);
  const register = (user) => api.post('api/register', user);
  const forgotPassword = (data) =>
    api.post('api/account/reset-password/init', data, {
      headers: { 'Content-Type': 'text/plain', Accept: 'application/json, text/plain, */*' },
    });

  const getAccount = () => api.get('api/account');
  const updateAccount = (account) => api.post('api/account', account);
  const changePassword = (currentPassword, newPassword) =>
    api.post(
      'api/account/change-password',
      { currentPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
      }
    );

  const getUser = (userId) => api.get('api/users/' + userId);
  const getAllUsers = (options) => api.get('api/users', options);
  const createUser = (user) => api.post('api/users', user);
  const updateUser = (user) => api.put('api/users', user);
  const deleteUser = (userId) => api.delete('api/users/' + userId);

  const getUserProfile = (userProfileId) => api.get('api/user-profiles/' + userProfileId);
  const getUserProfileByUserId = (userId) => api.get('api/user-profiles/by-user/' + userId);
  const getAllUserProfiles = (options) => api.get('api/user-profiles', options);
  const createUserProfile = (userProfile) => api.post('api/user-profiles', userProfile);
  const updateUserProfile = (userProfile) =>
    api.put(`api/user-profiles/${userProfile.id}`, userProfile);
  const deleteUserProfile = (userProfileId) => api.delete('api/user-profiles/' + userProfileId);

  const getSocialAccount = (socialAccountId) => api.get('api/social-accounts/' + socialAccountId);
  const getAllSocialAccounts = (options) => api.get('api/social-accounts', options);
  const createSocialAccount = (socialAccount) => api.post('api/social-accounts', socialAccount);
  const updateSocialAccount = (socialAccount) =>
    api.put(`api/social-accounts/${socialAccount.id}`, socialAccount);
  const deleteSocialAccount = (socialAccountId) =>
    api.delete('api/social-accounts/' + socialAccountId);

  const getTeacherProfile = (teacherProfileId) =>
    api.get('api/teacher-profiles/' + teacherProfileId);
  const getAllTeacherProfiles = (options) => api.get('api/teacher-profiles', options);
  const createTeacherProfile = (teacherProfile) => api.post('api/teacher-profiles', teacherProfile);
  const updateTeacherProfile = (teacherProfile) =>
    api.put(`api/teacher-profiles/${teacherProfile.id}`, teacherProfile);
  const deleteTeacherProfile = (teacherProfileId) =>
    api.delete('api/teacher-profiles/' + teacherProfileId);

  const getStudentProfile = (studentProfileId) =>
    api.get('api/student-profiles/' + studentProfileId);
  const getAllStudentProfiles = (options) => api.get('api/student-profiles', options);
  const createStudentProfile = (studentProfile) => api.post('api/student-profiles', studentProfile);
  const updateStudentProfile = (studentProfile) =>
    api.put(`api/student-profiles/${studentProfile.id}`, studentProfile);
  const deleteStudentProfile = (studentProfileId) =>
    api.delete('api/student-profiles/' + studentProfileId);

  const getCourse = (courseId) => api.get('api/courses/' + courseId);
  const getAllCourses = (options) => api.get('api/courses', options);
  const createCourse = (course) => api.post('api/courses', course);
  const updateCourse = (course) => api.put(`api/courses/${course.id}`, course);
  const deleteCourse = (courseId) => api.delete('api/courses/' + courseId);

  const getCourseClass = (courseClassId) => api.get('api/course-classes/' + courseClassId);
  const getAllCourseClasses = (options) => api.get('api/course-classes', options);
  const createCourseClass = (courseClass) => api.post('api/course-classes', courseClass);
  const updateCourseClass = (courseClass) =>
    api.put(`api/course-classes/${courseClass.id}`, courseClass);
  const deleteCourseClass = (courseClassId) => api.delete('api/course-classes/' + courseClassId);

  const getLesson = (lessonId) => api.get('api/lessons/' + lessonId);
  const getAllLessons = (options) => api.get('api/lessons', options);
  const createLesson = (lesson) => api.post('api/lessons', lesson);
  const updateLesson = (lesson) => api.put(`api/lessons/${lesson.id}`, lesson);
  const deleteLesson = (lessonId) => api.delete('api/lessons/' + lessonId);

  const getSchedule = (scheduleId) => api.get('api/schedules/' + scheduleId);
  const getAllSchedules = (options) => api.get('api/schedules', options);
  const createSchedule = (schedule) => api.post('api/schedules', schedule);
  const updateSchedule = (schedule) => api.put(`api/schedules/${schedule.id}`, schedule);
  const deleteSchedule = (scheduleId) => api.delete('api/schedules/' + scheduleId);

  const getQuiz = (quizId) => api.get('api/quizzes/' + quizId);
  const getAllQuizzes = (options) => api.get('api/quizzes', options);
  const createQuiz = (quiz) => api.post('api/quizzes', quiz);
  const updateQuiz = (quiz) => api.put(`api/quizzes/${quiz.id}`, quiz);
  const deleteQuiz = (quizId) => api.delete('api/quizzes/' + quizId);

  const getQuestion = (questionId) => api.get('api/questions/' + questionId);
  const getAllQuestions = (options) => api.get('api/questions', options);
  const createQuestion = (question) => api.post('api/questions', question);
  const updateQuestion = (question) => api.put(`api/questions/${question.id}`, question);
  const deleteQuestion = (questionId) => api.delete('api/questions/' + questionId);

  const getQuizQuestion = (quizQuestionId) => api.get('api/quiz-questions/' + quizQuestionId);
  const getAllQuizQuestions = (options) => api.get('api/quiz-questions', options);
  const createQuizQuestion = (quizQuestion) => api.post('api/quiz-questions', quizQuestion);
  const updateQuizQuestion = (quizQuestion) =>
    api.put(`api/quiz-questions/${quizQuestion.id}`, quizQuestion);
  const deleteQuizQuestion = (quizQuestionId) => api.delete('api/quiz-questions/' + quizQuestionId);

  const getStudentQuiz = (studentQuizId) => api.get('api/student-quizs/' + studentQuizId);
  const getAllStudentQuizs = (options) => api.get('api/student-quizs', options);
  const createStudentQuiz = (studentQuiz) => api.post('api/student-quizs', studentQuiz);
  const updateStudentQuiz = (studentQuiz) =>
    api.put(`api/student-quizs/${studentQuiz.id}`, studentQuiz);
  const deleteStudentQuiz = (studentQuizId) => api.delete('api/student-quizs/' + studentQuizId);

  const getFlashcard = (flashcardId) => api.get('api/flashcards/' + flashcardId);
  const getAllFlashcards = (options) => api.get('api/flashcards', options);
  const createFlashcard = (flashcard) => api.post('api/flashcards', flashcard);
  const updateFlashcard = (flashcard) => api.put(`api/flashcards/${flashcard.id}`, flashcard);
  const deleteFlashcard = (flashcardId) => api.delete('api/flashcards/' + flashcardId);
  // jhipster-react-native-api-method-needle

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    createUser,
    updateUser,
    getAllUsers,
    getUser,
    deleteUser,

    createUserProfile,
    updateUserProfile,
    getAllUserProfiles,
    getUserProfile,
    getUserProfileByUserId,
    deleteUserProfile,

    createSocialAccount,
    updateSocialAccount,
    getAllSocialAccounts,
    getSocialAccount,
    deleteSocialAccount,

    createTeacherProfile,
    updateTeacherProfile,
    getAllTeacherProfiles,
    getTeacherProfile,
    deleteTeacherProfile,

    createStudentProfile,
    updateStudentProfile,
    getAllStudentProfiles,
    getStudentProfile,
    deleteStudentProfile,

    createCourse,
    updateCourse,
    getAllCourses,
    getCourse,
    deleteCourse,

    createCourseClass,
    updateCourseClass,
    getAllCourseClasses,
    getCourseClass,
    deleteCourseClass,

    createLesson,
    updateLesson,
    getAllLessons,
    getLesson,
    deleteLesson,

    createSchedule,
    updateSchedule,
    getAllSchedules,
    getSchedule,
    deleteSchedule,

    createQuiz,
    updateQuiz,
    getAllQuizzes,
    getQuiz,
    deleteQuiz,

    createQuestion,
    updateQuestion,
    getAllQuestions,
    getQuestion,
    deleteQuestion,

    createQuizQuestion,
    updateQuizQuestion,
    getAllQuizQuestions,
    getQuizQuestion,
    deleteQuizQuestion,

    createStudentQuiz,
    updateStudentQuiz,
    getAllStudentQuizs,
    getStudentQuiz,
    deleteStudentQuiz,

    createFlashcard,
    updateFlashcard,
    getAllFlashcards,
    getFlashcard,
    deleteFlashcard,
    // jhipster-react-native-api-export-needle
    setAuthToken,
    removeAuthToken,
    login,
    register,
    forgotPassword,
    getAccount,
    updateAccount,
    changePassword,
  };
};

// let's return back our create method as the default.
export default {
  create,
};
