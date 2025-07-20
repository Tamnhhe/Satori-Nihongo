import { IQuiz } from 'app/shared/model/quiz.model';
import { IQuestion } from 'app/shared/model/question.model';

export interface IQuizQuestion {
  id?: number;
  position?: number;
  quiz?: IQuiz | null;
  question?: IQuestion | null;
}

export const defaultValue: Readonly<IQuizQuestion> = {};
