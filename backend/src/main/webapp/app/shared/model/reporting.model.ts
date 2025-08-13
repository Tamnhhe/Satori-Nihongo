export interface IReportConfiguration {
  id?: string;
  name: string;
  description?: string;
  reportType: ReportType;
  format: ReportFormat;
  startDate?: string;
  endDate?: string;
  courseIds?: string[];
  classIds?: string[];
  studentIds?: string[];
  teacherIds?: string[];
  metrics?: string[];
  createdBy?: string;
  createdDate?: string;
  schedule?: IReportSchedule;
  isScheduled?: boolean;
}

export interface IReportSchedule {
  frequency: ScheduleFrequency;
  nextRun?: string;
  recipients?: string[];
  isActive?: boolean;
}

export interface IReportData {
  reportId: string;
  title: string;
  description?: string;
  generatedAt: string;
  generatedBy: string;
  reportType: ReportType;
  metadata?: IReportMetadata;
  sections: IReportSection[];
  summary?: { [key: string]: any };
}

export interface IReportMetadata {
  dateRange?: string;
  totalRecords?: number;
  includedCourses?: string[];
  includedClasses?: string[];
  appliedFilters?: string[];
}

export interface IReportSection {
  title: string;
  description?: string;
  type: SectionType;
  charts?: IReportChart[];
  tables?: IReportTable[];
  data?: { [key: string]: any };
}

export interface IReportChart {
  title: string;
  chartType: string;
  data: { [key: string]: any };
  options?: { [key: string]: any };
}

export interface IReportTable {
  title: string;
  headers: string[];
  rows: any[][];
  formatting?: { [key: string]: any };
}

export interface IScheduledReportExecution {
  scheduleId: string;
  reportName: string;
  executionTime: string;
  completionTime?: string;
  status: ExecutionStatus;
  errorMessage?: string;
}

export enum ReportType {
  STUDENT_PROGRESS = 'STUDENT_PROGRESS',
  COURSE_ANALYTICS = 'COURSE_ANALYTICS',
  QUIZ_PERFORMANCE = 'QUIZ_PERFORMANCE',
  TEACHER_PERFORMANCE = 'TEACHER_PERFORMANCE',
  SYSTEM_OVERVIEW = 'SYSTEM_OVERVIEW',
  CUSTOM = 'CUSTOM',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export enum ScheduleFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum SectionType {
  OVERVIEW = 'OVERVIEW',
  DETAILED_ANALYSIS = 'DETAILED_ANALYSIS',
  CHARTS = 'CHARTS',
  TABLES = 'TABLES',
  SUMMARY = 'SUMMARY',
}

export enum ExecutionStatus {
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
