import axios from 'axios';

export interface CoursePerformanceDTO {
  courseName?: string;
  completionRate?: number;
  averageScore?: number;
  [key: string]: any;
}

export interface StudentAnalyticsDTO {
  totalLessons?: number;
  completedLessons?: number;
  averageScore?: number;
  studyHours?: number;
  recentActivities?: Array<{ timestamp: string; activity: string }>;
  [key: string]: any;
}

export interface ProgressReportDTO {
  studentId?: number;
  period?: { start?: string; end?: string };
  summary?: Record<string, any>;
  details?: Array<Record<string, any>>;
  [key: string]: any;
}

const baseUrl = 'api/student-analytics';

export async function getStudentAnalytics(studentId: number) {
  const response = await axios.get<StudentAnalyticsDTO>(`${baseUrl}/${studentId}`);
  return response.data;
}

export async function getCoursePerformance(studentId: number) {
  const response = await axios.get<Record<string, CoursePerformanceDTO>>(`${baseUrl}/${studentId}/course-performance`);
  return response.data;
}

export async function getCurrentProgressReport(studentId: number) {
  const response = await axios.get<ProgressReportDTO>(`${baseUrl}/${studentId}/progress-report/current`);
  return response.data;
}

export async function getSemesterProgressReport(studentId: number) {
  const response = await axios.get<ProgressReportDTO>(`${baseUrl}/${studentId}/progress-report/semester`);
  return response.data;
}

export async function getProgressReport(studentId: number, startDateIso: string, endDateIso: string) {
  const response = await axios.get<ProgressReportDTO>(`${baseUrl}/${studentId}/progress-report`, {
    params: { startDate: startDateIso, endDate: endDateIso },
  });
  return response.data;
}
