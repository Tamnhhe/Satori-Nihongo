import { ITeacherProfile } from 'app/shared/model/teacher-profile.model';
import { IStudentProfile } from 'app/shared/model/student-profile.model';
import { Role } from 'app/shared/model/enumerations/role.model';

export interface IUserProfile {
  id?: number;
  username?: string;
  passwordHash?: string;
  email?: string;
  fullName?: string;
  gender?: boolean | null;
  role?: keyof typeof Role;
  teacherProfile?: ITeacherProfile | null;
  studentProfile?: IStudentProfile | null;
}

export const defaultValue: Readonly<IUserProfile> = {
  gender: false,
};
