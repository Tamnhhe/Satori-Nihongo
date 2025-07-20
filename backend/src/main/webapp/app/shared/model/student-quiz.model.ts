import dayjs from 'dayjs';
import { IQuiz } from 'app/shared/model/quiz.model';
import { IUserProfile } from 'app/shared/model/user-profile.model';

export interface IStudentQuiz {
  id?: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  score?: number | null;
  completed?: boolean | null;
  quiz?: IQuiz | null;
  student?: IUserProfile | null;
}

export const defaultValue: Readonly<IStudentQuiz> = {
  completed: false,
};
