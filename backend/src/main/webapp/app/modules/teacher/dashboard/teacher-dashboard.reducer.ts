import axios from 'axios';
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

export interface AssignedCourse {
  id: string;
  title: string;
  courseCode: string;
  description?: string;
  enrollmentCount: number;
  lessonsCount: number;
  status: string;
}

export interface ActiveClass {
  id: string;
  code: string;
  name: string;
  courseName: string;
  currentEnrollment: number;
  capacity: number;
  startDate: string;
  endDate: string;
  nextSession?: string;
}

export interface StudentProgressSummary {
  studentId: string;
  studentName: string;
  courseName: string;
  completionRate: number;
  averageScore: number;
  lastActivity: string;
}

export interface PendingQuiz {
  id: string;
  title: string;
  courseName: string;
  dueDate?: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface TeacherDashboardStats {
  assignedCourses: AssignedCourse[];
  activeClasses: ActiveClass[];
  studentProgress: StudentProgressSummary[];
  pendingQuizzes: PendingQuiz[];
  totalStudents: number;
  totalCourses: number;
  totalClasses: number;
  averageClassCompletion: number;
}

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  stats: null as TeacherDashboardStats | null,
};

export type TeacherDashboardState = Readonly<typeof initialState>;

// Actions
export const getTeacherDashboardStats = createAsyncThunk(
  'teacherDashboard/fetch_stats',
  async () => {
    // For now, we'll use existing endpoints and mock some data
    // In a real implementation, you'd create dedicated teacher dashboard endpoints

    try {
      // Get teacher profile first to get teacher ID
      const accountResponse = await axios.get<any>('api/account');
      const teacherProfileResponse = await axios.get<any>(`api/teacher-profiles`);

      // Get courses (mock data for now since we need teacher-specific filtering)
      const coursesResponse = await axios.get<any>('api/courses?size=20');

      // Get course classes (mock data for now)
      const classesResponse = await axios.get<any>('api/course-classes?size=20');

      // Mock data for demonstration - replace with real API calls
      const mockStats: TeacherDashboardStats = {
        assignedCourses: [
          {
            id: '1',
            title: 'Japanese Beginner Level 1',
            courseCode: 'JP101',
            description: 'Introduction to Japanese language',
            enrollmentCount: 25,
            lessonsCount: 12,
            status: 'ACTIVE',
          },
          {
            id: '2',
            title: 'Japanese Intermediate Level 1',
            courseCode: 'JP201',
            description: 'Intermediate Japanese language',
            enrollmentCount: 18,
            lessonsCount: 15,
            status: 'ACTIVE',
          },
          {
            id: '3',
            title: 'Japanese Business Communication',
            courseCode: 'JP301',
            description: 'Business Japanese communication',
            enrollmentCount: 12,
            lessonsCount: 10,
            status: 'DRAFT',
          },
        ],
        activeClasses: [
          {
            id: '1',
            code: 'JP101-A',
            name: 'Japanese Beginner Morning Class',
            courseName: 'Japanese Beginner Level 1',
            currentEnrollment: 15,
            capacity: 20,
            startDate: '2025-01-15',
            endDate: '2025-03-15',
            nextSession: '2025-01-20T09:00:00',
          },
          {
            id: '2',
            code: 'JP101-B',
            name: 'Japanese Beginner Evening Class',
            courseName: 'Japanese Beginner Level 1',
            currentEnrollment: 10,
            capacity: 15,
            startDate: '2025-01-15',
            endDate: '2025-03-15',
            nextSession: '2025-01-20T18:00:00',
          },
        ],
        studentProgress: [
          {
            studentId: '1',
            studentName: 'Nguyen Van A',
            courseName: 'Japanese Beginner Level 1',
            completionRate: 75,
            averageScore: 85,
            lastActivity: '2025-01-18T14:30:00',
          },
          {
            studentId: '2',
            studentName: 'Tran Thi B',
            courseName: 'Japanese Beginner Level 1',
            completionRate: 60,
            averageScore: 78,
            lastActivity: '2025-01-17T16:45:00',
          },
          {
            studentId: '3',
            studentName: 'Le Van C',
            courseName: 'Japanese Intermediate Level 1',
            completionRate: 90,
            averageScore: 92,
            lastActivity: '2025-01-18T10:15:00',
          },
        ],
        pendingQuizzes: [
          {
            id: '1',
            title: 'Hiragana Quiz 1',
            courseName: 'Japanese Beginner Level 1',
            dueDate: '2025-01-25T23:59:59',
            submissionsCount: 12,
            totalStudents: 25,
          },
          {
            id: '2',
            title: 'Vocabulary Test Chapter 3',
            courseName: 'Japanese Intermediate Level 1',
            submissionsCount: 8,
            totalStudents: 18,
          },
        ],
        totalStudents: 55,
        totalCourses: 3,
        totalClasses: 2,
        averageClassCompletion: 72,
      };

      return { data: mockStats };
    } catch (error) {
      // Fallback to mock data if API calls fail
      const fallbackStats: TeacherDashboardStats = {
        assignedCourses: [],
        activeClasses: [],
        studentProgress: [],
        pendingQuizzes: [],
        totalStudents: 0,
        totalCourses: 0,
        totalClasses: 0,
        averageClassCompletion: 0,
      };

      return { data: fallbackStats };
    }
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const TeacherDashboardSlice = createSlice({
  name: 'teacherDashboard',
  initialState: initialState as TeacherDashboardState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getTeacherDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addMatcher(isPending(getTeacherDashboardStats), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(isRejected(getTeacherDashboardStats), (state, action) => {
        state.errorMessage = action.error.message;
        state.loading = false;
      });
  },
});

export const { reset } = TeacherDashboardSlice.actions;

// Reducer
export default TeacherDashboardSlice.reducer;
