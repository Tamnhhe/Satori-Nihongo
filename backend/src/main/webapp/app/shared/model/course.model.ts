import { IUserProfile } from 'app/shared/model/user-profile.model';
import { IQuiz } from 'app/shared/model/quiz.model';

export interface ICourse {
  id?: number;
  title?: string;
  description?: string | null;
  courseCode?: string | null;
  teacher?: IUserProfile | null;
  quizzes?: IQuiz[] | null;
}

export const defaultValue: Readonly<ICourse> = {};
