import dayjs from 'dayjs';
import { ICourse } from 'app/shared/model/course.model';
import { ITeacherProfile } from 'app/shared/model/teacher-profile.model';
import { IStudentProfile } from 'app/shared/model/student-profile.model';

export interface ICourseClass {
  id?: number;
  code?: string;
  name?: string;
  description?: string | null;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  capacity?: number | null;
  course?: ICourse | null;
  teacher?: ITeacherProfile | null;
  students?: IStudentProfile[] | null;
}

export const defaultValue: Readonly<ICourseClass> = {};
