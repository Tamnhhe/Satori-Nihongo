import userProfile from 'app/entities/user-profile/user-profile.reducer';
import socialAccount from 'app/entities/social-account/social-account.reducer';
import teacherProfile from 'app/entities/teacher-profile/teacher-profile.reducer';
import studentProfile from 'app/entities/student-profile/student-profile.reducer';
import course from 'app/entities/course/course.reducer';
import courseClass from 'app/entities/course-class/course-class.reducer';
import lesson from 'app/entities/lesson/lesson.reducer';
import schedule from 'app/entities/schedule/schedule.reducer';
import quiz from 'app/entities/quiz/quiz.reducer';
import question from 'app/entities/question/question.reducer';
import quizQuestion from 'app/entities/quiz-question/quiz-question.reducer';
import studentQuiz from 'app/entities/student-quiz/student-quiz.reducer';
import flashcard from 'app/entities/flashcard/flashcard.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  userProfile,
  socialAccount,
  teacherProfile,
  studentProfile,
  course,
  courseClass,
  lesson,
  schedule,
  quiz,
  question,
  quizQuestion,
  studentQuiz,
  flashcard,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
