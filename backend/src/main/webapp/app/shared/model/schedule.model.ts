import dayjs from 'dayjs';
import { ICourse } from 'app/shared/model/course.model';

export interface ISchedule {
  id?: number;
  date?: dayjs.Dayjs;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  location?: string | null;
  course?: ICourse | null;
}

export const defaultValue: Readonly<ISchedule> = {};
