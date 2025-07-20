import { ICourseClass } from 'app/shared/model/course-class.model';

export interface IStudentProfile {
  id?: number;
  studentId?: string;
  gpa?: number | null;
  classes?: ICourseClass[] | null;
}

export const defaultValue: Readonly<IStudentProfile> = {};
