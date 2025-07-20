import { ICourse } from 'app/shared/model/course.model';
import { IQuiz } from 'app/shared/model/quiz.model';

export interface ILesson {
  id?: number;
  title?: string;
  content?: string | null;
  videoUrl?: string | null;
  slideUrl?: string | null;
  course?: ICourse | null;
  quizzes?: IQuiz[] | null;
}

export const defaultValue: Readonly<ILesson> = {};
