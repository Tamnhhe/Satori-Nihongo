package com.satori.platform.service;

import com.satori.platform.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportingService {

    private final Logger log = LoggerFactory.getLogger(ReportingService.class);

    @Autowired
    private StudentProgressAnalyticsService studentProgressService;

    @Autowired
    private ComprehensiveAnalyticsService comprehensiveAnalyticsService;

    @Autowired
    private QuizAnalyticsService quizAnalyticsService;

    @Autowired
    private ReportExportService reportExportService;

    @Autowired
    @Lazy
    private ReportSchedulingService reportSchedulingService;

    /**
     * Generate a report based on configuration
     */
    public ReportDataDTO generateReport(ReportConfigurationDTO config) {
        log.debug("Generating report: {}", config.getName());

        ReportDataDTO report = new ReportDataDTO();
        report.setReportId(UUID.randomUUID().toString());
        report.setTitle(config.getName());
        report.setDescription(config.getDescription());
        report.setGeneratedAt(LocalDateTime.now());
        report.setGeneratedBy(config.getCreatedBy());
        report.setReportType(config.getReportType());

        // Set metadata
        ReportDataDTO.ReportMetadata metadata = new ReportDataDTO.ReportMetadata();
        metadata.setDateRange(config.getStartDate() + " to " + config.getEndDate());
        metadata.setAppliedFilters(buildFilterList(config));
        report.setMetadata(metadata);

        // Generate sections based on report type
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        switch (config.getReportType()) {
            case STUDENT_PROGRESS:
                sections.addAll(generateStudentProgressSections(config));
                break;
            case COURSE_ANALYTICS:
                sections.addAll(generateCourseAnalyticsSections(config));
                break;
            case QUIZ_PERFORMANCE:
                sections.addAll(generateQuizPerformanceSections(config));
                break;
            case TEACHER_PERFORMANCE:
                sections.addAll(generateTeacherPerformanceSections(config));
                break;
            case SYSTEM_OVERVIEW:
                sections.addAll(generateSystemOverviewSections(config));
                break;
            case CUSTOM:
                sections.addAll(generateCustomSections(config));
                break;
        }

        report.setSections(sections);
        report.setSummary(generateReportSummary(sections));

        return report;
    }

    /**
     * Export report to specified format
     */
    public byte[] exportReport(ReportDataDTO report, ReportConfigurationDTO.ReportFormat format) {
        log.debug("Exporting report {} to format {}", report.getReportId(), format);

        switch (format) {
            case PDF:
                return reportExportService.exportToPdf(report);
            case EXCEL:
                return reportExportService.exportToExcel(report);
            case CSV:
                return reportExportService.exportToCsv(report);
            default:
                throw new IllegalArgumentException("Unsupported export format: " + format);
        }
    }

    /**
     * Schedule a report for automatic generation
     */
    public void scheduleReport(ReportConfigurationDTO config) {
        log.debug("Scheduling report: {}", config.getName());
        reportSchedulingService.scheduleReport(config);
    }

    /**
     * Get available report templates
     */
    public List<ReportConfigurationDTO> getReportTemplates() {
        List<ReportConfigurationDTO> templates = new ArrayList<>();

        // Student Progress Template
        ReportConfigurationDTO studentTemplate = new ReportConfigurationDTO();
        studentTemplate.setName("Student Progress Report");
        studentTemplate.setDescription("Comprehensive student learning progress and performance analysis");
        studentTemplate.setReportType(ReportConfigurationDTO.ReportType.STUDENT_PROGRESS);
        studentTemplate.setMetrics(Arrays.asList("completion_rate", "gpa", "quiz_scores", "engagement"));
        templates.add(studentTemplate);

        // Course Analytics Template
        ReportConfigurationDTO courseTemplate = new ReportConfigurationDTO();
        courseTemplate.setName("Course Analytics Report");
        courseTemplate.setDescription("Course performance metrics and student engagement analysis");
        courseTemplate.setReportType(ReportConfigurationDTO.ReportType.COURSE_ANALYTICS);
        courseTemplate.setMetrics(Arrays.asList("enrollment", "completion", "satisfaction", "difficulty"));
        templates.add(courseTemplate);

        // Quiz Performance Template
        ReportConfigurationDTO quizTemplate = new ReportConfigurationDTO();
        quizTemplate.setName("Quiz Performance Report");
        quizTemplate.setDescription("Quiz results analysis and question effectiveness metrics");
        quizTemplate.setReportType(ReportConfigurationDTO.ReportType.QUIZ_PERFORMANCE);
        quizTemplate.setMetrics(Arrays.asList("average_score", "completion_rate", "question_difficulty", "time_spent"));
        templates.add(quizTemplate);

        return templates;
    }

    private List<ReportDataDTO.ReportSection> generateStudentProgressSections(ReportConfigurationDTO config) {
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        // Overview Section
        ReportDataDTO.ReportSection overview = new ReportDataDTO.ReportSection();
        overview.setTitle("Student Progress Overview");
        overview.setType(ReportDataDTO.ReportSection.SectionType.OVERVIEW);

        // Get student progress data
        if (config.getStudentIds() != null && !config.getStudentIds().isEmpty()) {
            List<StudentProgressDTO> progressData = new ArrayList<>();
            for (String studentId : config.getStudentIds()) {
                try {
                    List<StudentProgressDTO> progress = studentProgressService.getDetailedStudentProgress(
                        Long.parseLong(studentId), null, config.getStartDate(), config.getEndDate());
                    progressData.addAll(progress);
                } catch (Exception e) {
                    log.warn("Could not fetch progress for student {}: {}", studentId, e.getMessage());
                }
            }

            // Create charts and tables from progress data
            overview.setCharts(createProgressCharts(progressData));
            overview.setTables(createProgressTables(progressData));
        }

        sections.add(overview);
        return sections;
    }

    private List<ReportDataDTO.ReportSection> generateCourseAnalyticsSections(ReportConfigurationDTO config) {
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        // Course Performance Section
        ReportDataDTO.ReportSection courseSection = new ReportDataDTO.ReportSection();
        courseSection.setTitle("Course Performance Analysis");
        courseSection.setType(ReportDataDTO.ReportSection.SectionType.DETAILED_ANALYSIS);

        if (config.getCourseIds() != null && !config.getCourseIds().isEmpty()) {
            try {
                // Use a default time range for now, could be made configurable
                String timeRange = "last_30_days";
                ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);

                courseSection.setCharts(createAnalyticsCharts(analytics));
                courseSection.setTables(createAnalyticsTables(analytics));
            } catch (Exception e) {
                log.warn("Could not fetch course analytics: {}", e.getMessage());
            }
        }

        sections.add(courseSection);
        return sections;
    }

    private List<ReportDataDTO.ReportSection> generateQuizPerformanceSections(ReportConfigurationDTO config) {
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        ReportDataDTO.ReportSection quizSection = new ReportDataDTO.ReportSection();
        quizSection.setTitle("Quiz Performance Analysis");
        quizSection.setType(ReportDataDTO.ReportSection.SectionType.DETAILED_ANALYSIS);

        // This would integrate with quiz analytics service
        // For now, create placeholder structure
        quizSection.setCharts(new ArrayList<>());
        quizSection.setTables(new ArrayList<>());

        sections.add(quizSection);
        return sections;
    }

    private List<ReportDataDTO.ReportSection> generateTeacherPerformanceSections(ReportConfigurationDTO config) {
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        ReportDataDTO.ReportSection teacherSection = new ReportDataDTO.ReportSection();
        teacherSection.setTitle("Teacher Performance Analysis");
        teacherSection.setType(ReportDataDTO.ReportSection.SectionType.DETAILED_ANALYSIS);

        // Placeholder for teacher performance metrics
        teacherSection.setCharts(new ArrayList<>());
        teacherSection.setTables(new ArrayList<>());

        sections.add(teacherSection);
        return sections;
    }

    private List<ReportDataDTO.ReportSection> generateSystemOverviewSections(ReportConfigurationDTO config) {
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        ReportDataDTO.ReportSection systemSection = new ReportDataDTO.ReportSection();
        systemSection.setTitle("System Overview");
        systemSection.setType(ReportDataDTO.ReportSection.SectionType.OVERVIEW);

        // Placeholder for system metrics
        systemSection.setCharts(new ArrayList<>());
        systemSection.setTables(new ArrayList<>());

        sections.add(systemSection);
        return sections;
    }

    private List<ReportDataDTO.ReportSection> generateCustomSections(ReportConfigurationDTO config) {
        List<ReportDataDTO.ReportSection> sections = new ArrayList<>();

        ReportDataDTO.ReportSection customSection = new ReportDataDTO.ReportSection();
        customSection.setTitle("Custom Analysis");
        customSection.setType(ReportDataDTO.ReportSection.SectionType.DETAILED_ANALYSIS);

        // Custom report logic based on selected metrics
        customSection.setCharts(new ArrayList<>());
        customSection.setTables(new ArrayList<>());

        sections.add(customSection);
        return sections;
    }

    private List<String> buildFilterList(ReportConfigurationDTO config) {
        List<String> filters = new ArrayList<>();

        if (config.getCourseIds() != null && !config.getCourseIds().isEmpty()) {
            filters.add("Courses: " + config.getCourseIds().size() + " selected");
        }
        if (config.getClassIds() != null && !config.getClassIds().isEmpty()) {
            filters.add("Classes: " + config.getClassIds().size() + " selected");
        }
        if (config.getStudentIds() != null && !config.getStudentIds().isEmpty()) {
            filters.add("Students: " + config.getStudentIds().size() + " selected");
        }

        return filters;
    }

    private List<ReportDataDTO.ReportChart> createProgressCharts(List<StudentProgressDTO> progressData) {
        List<ReportDataDTO.ReportChart> charts = new ArrayList<>();

        ReportDataDTO.ReportChart progressChart = new ReportDataDTO.ReportChart();
        progressChart.setTitle("Student Progress Distribution");
        progressChart.setChartType("bar");

        Map<String, Object> chartData = new HashMap<>();
        chartData.put("labels",
                progressData.stream().map(StudentProgressDTO::getStudentName).collect(Collectors.toList()));
        chartData.put("datasets", Arrays.asList(Map.of(
                "label", "Completion Rate",
                "data",
                progressData.stream()
                        .map(p -> p.getCompletionRate() != null ? p.getCompletionRate() : 0.0)
                        .collect(Collectors.toList()))));

        progressChart.setData(chartData);
        charts.add(progressChart);

        return charts;
    }

    private List<ReportDataDTO.ReportTable> createProgressTables(List<StudentProgressDTO> progressData) {
        List<ReportDataDTO.ReportTable> tables = new ArrayList<>();

        ReportDataDTO.ReportTable progressTable = new ReportDataDTO.ReportTable();
        progressTable.setTitle("Student Progress Details");
        progressTable.setHeaders(Arrays.asList("Student", "Course", "Completion Rate", "Quiz Score"));

        List<List<Object>> rows = progressData.stream()
                .map(p -> Arrays.<Object>asList(
                        p.getStudentName(),
                        p.getCourseName() != null ? p.getCourseName() : "N/A",
                        p.getCompletionRate() != null ? p.getCompletionRate() + "%" : "N/A",
                        p.getScore() != null ? p.getScore() : "N/A"))
                .collect(Collectors.toList());

        progressTable.setRows(rows);
        tables.add(progressTable);

        return tables;
    }

    private List<ReportDataDTO.ReportChart> createAnalyticsCharts(ComprehensiveAnalyticsDTO analytics) {
        List<ReportDataDTO.ReportChart> charts = new ArrayList<>();

        if (analytics.getCoursePerformance() != null && 
            analytics.getCoursePerformance().getCourseDetails() != null && 
            !analytics.getCoursePerformance().getCourseDetails().isEmpty()) {
            
            ReportDataDTO.ReportChart performanceChart = new ReportDataDTO.ReportChart();
            performanceChart.setTitle("Course Performance Overview");
            performanceChart.setChartType("line");

            Map<String, Object> chartData = new HashMap<>();
            chartData.put("labels", analytics.getCoursePerformance().getCourseDetails().stream()
                    .map(ComprehensiveAnalyticsDTO.CoursePerformanceDetail::getCourseTitle).collect(Collectors.toList()));
            chartData.put("datasets", Arrays.asList(Map.of(
                    "label", "Average Score",
                    "data", analytics.getCoursePerformance().getCourseDetails().stream()
                            .map(ComprehensiveAnalyticsDTO.CoursePerformanceDetail::getAverageScore).collect(Collectors.toList()))));

            performanceChart.setData(chartData);
            charts.add(performanceChart);
        }

        return charts;
    }

    private List<ReportDataDTO.ReportTable> createAnalyticsTables(ComprehensiveAnalyticsDTO analytics) {
        List<ReportDataDTO.ReportTable> tables = new ArrayList<>();

        if (analytics.getCoursePerformance() != null && 
            analytics.getCoursePerformance().getCourseDetails() != null && 
            !analytics.getCoursePerformance().getCourseDetails().isEmpty()) {
            
            ReportDataDTO.ReportTable performanceTable = new ReportDataDTO.ReportTable();
            performanceTable.setTitle("Course Performance Details");
            performanceTable.setHeaders(Arrays.asList("Course", "Enrollment", "Completion Rate", "Average Score"));

            List<List<Object>> rows = analytics.getCoursePerformance().getCourseDetails().stream()
                    .map(cp -> Arrays.<Object>asList(
                            cp.getCourseTitle(),
                            cp.getEnrollmentCount(),
                            cp.getCompletionRate() + "%",
                            cp.getAverageScore()))
                    .collect(Collectors.toList());

            performanceTable.setRows(rows);
            tables.add(performanceTable);
        }

        return tables;
    }

    private Map<String, Object> generateReportSummary(List<ReportDataDTO.ReportSection> sections) {
        Map<String, Object> summary = new HashMap<>();

        summary.put("totalSections", sections.size());
        summary.put("generatedAt", LocalDateTime.now());
        summary.put("dataPoints", sections.stream()
                .mapToInt(s -> (s.getTables() != null ? s.getTables().size() : 0) +
                        (s.getCharts() != null ? s.getCharts().size() : 0))
                .sum());

        return summary;
    }
}