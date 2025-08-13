package com.satori.platform.service;

import com.satori.platform.service.dto.ReportConfigurationDTO;
import com.satori.platform.service.dto.ReportDataDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportingServiceTest {

    @Mock
    private StudentProgressAnalyticsService studentProgressService;

    @Mock
    private ComprehensiveAnalyticsService comprehensiveAnalyticsService;

    @Mock
    private QuizAnalyticsService quizAnalyticsService;

    @Mock
    private ReportExportService reportExportService;

    @Mock
    private ReportSchedulingService reportSchedulingService;

    @InjectMocks
    private ReportingService reportingService;

    private ReportConfigurationDTO testConfig;

    @BeforeEach
    void setUp() {
        testConfig = new ReportConfigurationDTO();
        testConfig.setName("Test Report");
        testConfig.setDescription("Test report description");
        testConfig.setReportType(ReportConfigurationDTO.ReportType.STUDENT_PROGRESS);
        testConfig.setFormat(ReportConfigurationDTO.ReportFormat.PDF);
        testConfig.setStartDate(LocalDate.now().minusDays(30));
        testConfig.setEndDate(LocalDate.now());
        testConfig.setMetrics(Arrays.asList("completion_rate", "gpa"));
        testConfig.setCreatedBy("test-user");
    }

    @Test
    void shouldGenerateReport() {
        // When
        ReportDataDTO result = reportingService.generateReport(testConfig);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Report");
        assertThat(result.getDescription()).isEqualTo("Test report description");
        assertThat(result.getReportType()).isEqualTo(ReportConfigurationDTO.ReportType.STUDENT_PROGRESS);
        assertThat(result.getGeneratedBy()).isEqualTo("test-user");
        assertThat(result.getSections()).isNotNull();
    }

    @Test
    void shouldExportReportToPdf() {
        // Given
        ReportDataDTO report = reportingService.generateReport(testConfig);
        when(reportExportService.exportToPdf(any(ReportDataDTO.class)))
                .thenReturn("PDF content".getBytes());

        // When
        byte[] result = reportingService.exportReport(report, ReportConfigurationDTO.ReportFormat.PDF);

        // Then
        assertThat(result).isNotNull();
        assertThat(new String(result)).isEqualTo("PDF content");
    }

    @Test
    void shouldExportReportToExcel() {
        // Given
        ReportDataDTO report = reportingService.generateReport(testConfig);
        when(reportExportService.exportToExcel(any(ReportDataDTO.class)))
                .thenReturn("Excel content".getBytes());

        // When
        byte[] result = reportingService.exportReport(report, ReportConfigurationDTO.ReportFormat.EXCEL);

        // Then
        assertThat(result).isNotNull();
        assertThat(new String(result)).isEqualTo("Excel content");
    }

    @Test
    void shouldGetReportTemplates() {
        // When
        List<ReportConfigurationDTO> templates = reportingService.getReportTemplates();

        // Then
        assertThat(templates).isNotNull();
        assertThat(templates).hasSize(3); // Student Progress, Course Analytics, Quiz Performance

        assertThat(templates.stream()
                .anyMatch(t -> t.getReportType() == ReportConfigurationDTO.ReportType.STUDENT_PROGRESS)).isTrue();
        assertThat(templates.stream()
                .anyMatch(t -> t.getReportType() == ReportConfigurationDTO.ReportType.COURSE_ANALYTICS)).isTrue();
        assertThat(templates.stream()
                .anyMatch(t -> t.getReportType() == ReportConfigurationDTO.ReportType.QUIZ_PERFORMANCE)).isTrue();
    }

    @Test
    void shouldScheduleReport() {
        // Given
        testConfig.setScheduled(true);
        ReportConfigurationDTO.ReportSchedule schedule = new ReportConfigurationDTO.ReportSchedule();
        schedule.setFrequency(ReportConfigurationDTO.ReportSchedule.ScheduleFrequency.WEEKLY);
        schedule.setRecipients(Arrays.asList("test@example.com"));
        schedule.setActive(true);
        testConfig.setSchedule(schedule);

        // When & Then - should not throw exception
        reportingService.scheduleReport(testConfig);
    }
}