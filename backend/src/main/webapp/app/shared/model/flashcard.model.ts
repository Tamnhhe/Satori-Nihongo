import { ILesson } from 'app/shared/model/lesson.model';

export interface IFlashcard {
  id?: number;
  term?: string;
  definition?: string | null;
  imageUrl?: string | null;
  hint?: string | null;
  position?: number;
  lesson?: ILesson | null;
}

export const defaultValue: Readonly<IFlashcard> = {};
