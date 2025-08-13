import axios from 'axios';

export interface ComprehensiveAnalyticsData {
  coursePerformance: CoursePerformanceMetrics;
  studentEngagement: StudentEngagementMetrics;
  learningPath: LearningPathAnalytics;
  comparative: ComparativeAnalytics;
  generatedAt: string;
}

export interface CoursePerformanceMetrics {
  averageCompletionRate: number;
  averageQuizScore: number;
  totalEnrollments: number;
  activeStudents: number;
  courseDetails: CoursePerformanceDetail[];
}

export interface CoursePerformanceDetail {
  courseId: string;
  courseTitle: string;
  completionRate: number;
  averageScore: number;
  enrollmentCount: number;
  difficulty: string;
}

export interface StudentEngagementMetrics {
  averageSessionDuration: number;
  dailyActiveUsers: number;
  weeklyRetentionRate: number;
  engagementTrends: EngagementTrend[];
  activityPatterns: ActivityPattern[];
}

export interface EngagementTrend {
  date: string;
  activeUsers: number;
  averageSessionTime: number;
  completedLessons: number;
}

export interface ActivityPattern {
  timeSlot: string;
  userCount: number;
  activityType: string;
}

export interface LearningPathAnalytics {
  pathProgress: PathProgressMetric[];
  commonDropoffPoints: DropoffPoint[];
  averagePathCompletion: number;
  learningVelocities: LearningVelocity[];
}

export interface PathProgressMetric {
  courseId: string;
  courseName: string;
  totalLessons: number;
  averageProgress: number;
  studentsEnrolled: number;
}

export interface DropoffPoint {
  lessonId: string;
  lessonTitle: string;
  dropoffCount: number;
  dropoffRate: number;
}

export interface LearningVelocity {
  studentId: string;
  studentName: string;
  lessonsPerWeek: number;
  averageQuizScore: number;
  learningStyle: string;
}

export interface ComparativeAnalytics {
  courseComparisons: CourseComparison[];
  classComparisons: ClassComparison[];
  benchmarks: BenchmarkMetrics;
}

export interface CourseComparison {
  courseId: string;
  courseTitle: string;
  completionRate: number;
  averageScore: number;
  enrollmentCount: number;
  performanceRank: string;
}

export interface ClassComparison {
  classId: string;
  className: string;
  courseTitle: string;
  averageGPA: number;
  studentCount: number;
  engagementScore: number;
}

export interface BenchmarkMetrics {
  platformAverageCompletion: number;
  platformAverageScore: number;
  platformEngagementRate: number;
  topPerformingCourse: string;
  mostEngagingClass: string;
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

class ComprehensiveAnalyticsService {
  private apiUrl = '/api/analytics';

  async getComprehensiveAnalytics(timeRange: TimeRange = 'month'): Promise<ComprehensiveAnalyticsData> {
    const response = await axios.get(`${this.apiUrl}/comprehensive`, {
      params: { timeRange },
    });
    return response.data;
  }

  async getTeacherAnalytics(timeRange: TimeRange = 'month'): Promise<ComprehensiveAnalyticsData> {
    const response = await axios.get(`${this.apiUrl}/comprehensive/teacher`, {
      params: { timeRange },
    });
    return response.data;
  }

  async getSpecificTeacherAnalytics(teacherId: string, timeRange: TimeRange = 'month'): Promise<ComprehensiveAnalyticsData> {
    const response = await axios.get(`${this.apiUrl}/comprehensive/teacher/${teacherId}`, {
      params: { timeRange },
    });
    return response.data;
  }

  async getCoursePerformanceMetrics(timeRange: TimeRange = 'month'): Promise<CoursePerformanceMetrics> {
    const response = await axios.get(`${this.apiUrl}/comprehensive/course-performance`, {
      params: { timeRange },
    });
    return response.data;
  }

  async getStudentEngagementMetrics(timeRange: TimeRange = 'month'): Promise<StudentEngagementMetrics> {
    const response = await axios.get(`${this.apiUrl}/comprehensive/student-engagement`, {
      params: { timeRange },
    });
    return response.data;
  }

  async getLearningPathAnalytics(timeRange: TimeRange = 'month'): Promise<LearningPathAnalytics> {
    const response = await axios.get(`${this.apiUrl}/comprehensive/learning-path`, {
      params: { timeRange },
    });
    return response.data;
  }

  async getComparativeAnalytics(timeRange: TimeRange = 'month'): Promise<ComparativeAnalytics> {
    const response = await axios.get(`${this.apiUrl}/comprehensive/comparative`, {
      params: { timeRange },
    });
    return response.data;
  }
}

export default new ComprehensiveAnalyticsService();
