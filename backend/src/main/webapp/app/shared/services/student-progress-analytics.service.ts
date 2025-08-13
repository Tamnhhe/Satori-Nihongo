import axios from 'axios';
import { StudentProgressData, CourseProgress } from '../components/charts';

const apiUrl = 'api/analytics';

export interface ProgressSummary {
  averageScore: number;
  averageCompletion: number;
  totalQuizzes: number;
  activeStudents: number;
  totalCourses: number;
  progressData: StudentProgressData[];
  courseData: CourseProgress[];
}

export interface StudentProgressParams {
  startDate: string;
  endDate: string;
  courseId?: number;
  studentId?: number;
}

export interface CourseProgressParams {
  teacherId?: number;
}

export interface DetailedProgressParams {
  studentId: number;
  courseId?: number;
  startDate: string;
  endDate: string;
}

export interface ProgressSummaryParams {
  startDate: string;
  endDate: string;
  courseId?: number;
  teacherId?: number;
}

class StudentProgressAnalyticsService {
  /**
   * Get student progress data for charts
   */
  getStudentProgressData(params: StudentProgressParams): Promise<StudentProgressData[]> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    if (params.courseId) {
      queryParams.append('courseId', params.courseId.toString());
    }

    if (params.studentId) {
      queryParams.append('studentId', params.studentId.toString());
    }

    return axios.get<StudentProgressData[]>(`${apiUrl}/student-progress?${queryParams.toString()}`).then(response => response.data);
  }

  /**
   * Get course progress data
   */
  getCourseProgressData(params: CourseProgressParams = {}): Promise<CourseProgress[]> {
    const queryParams = new URLSearchParams();

    if (params.teacherId) {
      queryParams.append('teacherId', params.teacherId.toString());
    }

    const url = queryParams.toString() ? `${apiUrl}/course-progress?${queryParams.toString()}` : `${apiUrl}/course-progress`;

    return axios.get<CourseProgress[]>(url).then(response => response.data);
  }

  /**
   * Get detailed student progress for drill-down analysis
   */
  getDetailedStudentProgress(params: DetailedProgressParams): Promise<StudentProgressData[]> {
    const queryParams = new URLSearchParams({
      studentId: params.studentId.toString(),
      startDate: params.startDate,
      endDate: params.endDate,
    });

    if (params.courseId) {
      queryParams.append('courseId', params.courseId.toString());
    }

    return axios
      .get<StudentProgressData[]>(`${apiUrl}/student-progress/detailed?${queryParams.toString()}`)
      .then(response => response.data);
  }

  /**
   * Get progress summary statistics
   */
  getProgressSummary(params: ProgressSummaryParams): Promise<ProgressSummary> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    if (params.courseId) {
      queryParams.append('courseId', params.courseId.toString());
    }

    if (params.teacherId) {
      queryParams.append('teacherId', params.teacherId.toString());
    }

    return axios.get<ProgressSummary>(`${apiUrl}/progress-summary?${queryParams.toString()}`).then(response => response.data);
  }
}

export default new StudentProgressAnalyticsService();
