export default {
  // Functions return fixtures

  // entity fixtures
  updateUserProfile: _userProfile => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-user-profile.json'),
    };
  },
  getAllUserProfiles: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-user-profiles.json'),
    };
  },
  getUserProfile: _userProfileId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-user-profile.json'),
    };
  },
  deleteUserProfile: _userProfileId => {
    return {
      ok: true,
    };
  },
  updateSocialAccount: _socialAccount => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-social-account.json'),
    };
  },
  getAllSocialAccounts: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-social-accounts.json'),
    };
  },
  getSocialAccount: _socialAccountId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-social-account.json'),
    };
  },
  deleteSocialAccount: _socialAccountId => {
    return {
      ok: true,
    };
  },
  updateTeacherProfile: _teacherProfile => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-teacher-profile.json'),
    };
  },
  getAllTeacherProfiles: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-teacher-profiles.json'),
    };
  },
  getTeacherProfile: _teacherProfileId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-teacher-profile.json'),
    };
  },
  deleteTeacherProfile: _teacherProfileId => {
    return {
      ok: true,
    };
  },
  updateStudentProfile: _studentProfile => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-student-profile.json'),
    };
  },
  getAllStudentProfiles: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-student-profiles.json'),
    };
  },
  getStudentProfile: _studentProfileId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-student-profile.json'),
    };
  },
  deleteStudentProfile: _studentProfileId => {
    return {
      ok: true,
    };
  },
  updateCourse: _course => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-course.json'),
    };
  },
  getAllCourses: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-courses.json'),
    };
  },
  getCourse: _courseId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-course.json'),
    };
  },
  deleteCourse: _courseId => {
    return {
      ok: true,
    };
  },
  updateCourseClass: _courseClass => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-course-class.json'),
    };
  },
  getAllCourseClasses: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-course-classes.json'),
    };
  },
  getCourseClass: _courseClassId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-course-class.json'),
    };
  },
  deleteCourseClass: _courseClassId => {
    return {
      ok: true,
    };
  },
  updateLesson: _lesson => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-lesson.json'),
    };
  },
  getAllLessons: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-lessons.json'),
    };
  },
  getLesson: _lessonId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-lesson.json'),
    };
  },
  deleteLesson: _lessonId => {
    return {
      ok: true,
    };
  },
  updateSchedule: _schedule => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-schedule.json'),
    };
  },
  getAllSchedules: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-schedules.json'),
    };
  },
  getSchedule: _scheduleId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-schedule.json'),
    };
  },
  deleteSchedule: _scheduleId => {
    return {
      ok: true,
    };
  },
  updateQuiz: _quiz => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-quiz.json'),
    };
  },
  getAllQuizzes: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-quizzes.json'),
    };
  },
  getQuiz: _quizId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-quiz.json'),
    };
  },
  deleteQuiz: _quizId => {
    return {
      ok: true,
    };
  },
  updateQuestion: _question => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-question.json'),
    };
  },
  getAllQuestions: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-questions.json'),
    };
  },
  getQuestion: _questionId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-question.json'),
    };
  },
  deleteQuestion: _questionId => {
    return {
      ok: true,
    };
  },
  updateQuizQuestion: _quizQuestion => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-quiz-question.json'),
    };
  },
  getAllQuizQuestions: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-quiz-questions.json'),
    };
  },
  getQuizQuestion: _quizQuestionId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-quiz-question.json'),
    };
  },
  deleteQuizQuestion: _quizQuestionId => {
    return {
      ok: true,
    };
  },
  updateStudentQuiz: _studentQuiz => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-student-quiz.json'),
    };
  },
  getAllStudentQuizs: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-student-quizs.json'),
    };
  },
  getStudentQuiz: _studentQuizId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-student-quiz.json'),
    };
  },
  deleteStudentQuiz: _studentQuizId => {
    return {
      ok: true,
    };
  },
  updateFlashcard: _flashcard => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-flashcard.json'),
    };
  },
  getAllFlashcards: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-flashcards.json'),
    };
  },
  getFlashcard: _flashcardId => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-flashcard.json'),
    };
  },
  deleteFlashcard: _flashcardId => {
    return {
      ok: true,
    };
  },
  // jhipster-react-native-api-fixture-needle

  // user fixtures
  updateUser: _user => {
    return {
      ok: true,
      data: require('../fixtures/update-user.json'),
    };
  },
  getAllUsers: () => {
    return {
      ok: true,
      data: require('../fixtures/get-users.json'),
    };
  },
  getUser: _userId => {
    return {
      ok: true,
      data: require('../fixtures/get-user.json'),
    };
  },
  deleteUser: _userId => {
    return {
      ok: true,
    };
  },
  // auth fixtures
  setAuthToken: () => {},
  removeAuthToken: () => {},
  login: authObj => {
    if (authObj.username === 'user' && authObj.password === 'user') {
      return {
        ok: true,
        data: require('../fixtures/login.json'),
      };
    } else {
      return {
        ok: false,
        status: 400,
        data: 'Invalid credentials',
      };
    }
  },
  register: ({ user }) => {
    if (user === 'user') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: {
          title: 'Invalid email',
        },
      };
    }
  },
  forgotPassword: ({ email }) => {
    if (email === 'valid@gmail.com') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Invalid email',
      };
    }
  },
  getAccount: () => {
    return {
      ok: true,
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      data: require('../fixtures/get-account.json'),
    };
  },
  updateAccount: () => {
    return {
      ok: true,
    };
  },
  changePassword: ({ currentPassword }) => {
    if (currentPassword === 'valid-password') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Password error',
      };
    }
  },
};
