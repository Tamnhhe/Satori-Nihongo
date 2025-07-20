import { ICourse } from 'app/shared/model/course.model';
import { ILesson } from 'app/shared/model/lesson.model';
import { QuizType } from 'app/shared/model/enumerations/quiz-type.model';

export interface IQuiz {
  id?: number;
  title?: string;
  description?: string | null;
  isTest?: boolean;
  isPractice?: boolean;
  quizType?: keyof typeof QuizType;
  courses?: ICourse[] | null;
  lessons?: ILesson[] | null;
}

export const defaultValue: Readonly<IQuiz> = {
  isTest: false,
  isPractice: false,
};
