package com.satori.platform.web.rest;

import com.satori.platform.service.ReportingService;
import com.satori.platform.service.ReportSchedulingService;
import com.satori.platform.service.dto.ReportConfigurationDTO;
import com.satori.platform.service.dto.ReportDataDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
public class ReportingResource {

    private final Logger log = LoggerFactory.getLogger(ReportingResource.class);

    @Autowired
    private ReportingService reportingService;

    @Autowired
    private ReportSchedulingService reportSchedulingService;

    /**
     * GET /api/admin/reports/templates : Get available report templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<ReportConfigurationDTO>> getReportTemplates() {
        log.debug("REST request to get report templates");

        List<ReportConfigurationDTO> templates = reportingService.getReportTemplates();
        return ResponseEntity.ok(templates);
    }

    /**
     * POST /api/admin/reports/generate : Generate a report
     */
    @PostMapping("/generate")
    public ResponseEntity<ReportDataDTO> generateReport(@Valid @RequestBody ReportConfigurationDTO config) {
        log.debug("REST request to generate report: {}", config.getName());

        try {
            ReportDataDTO report = reportingService.generateReport(config);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            log.error("Error generating report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/admin/reports/export : Export a report
     */
    @PostMapping("/export")
    public ResponseEntity<byte[]> exportReport(@RequestBody ExportRequest request) {
        log.debug("REST request to export report {} in format {}",
                request.getReport().getReportId(), request.getFormat());

        try {
            byte[] exportedData = reportingService.exportReport(request.getReport(), request.getFormat());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(getMediaType(request.getFormat()));
            headers.setContentDispositionFormData("attachment",
                    generateFilename(request.getReport(), request.getFormat()));

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(exportedData);

        } catch (Exception e) {
            log.error("Error exporting report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/admin/reports/schedule : Schedule a report
     */
    @PostMapping("/schedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> scheduleReport(@Valid @RequestBody ReportConfigurationDTO config) {
        log.debug("REST request to schedule report: {}", config.getName());

        try {
            reportingService.scheduleReport(config);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error scheduling report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/reports/scheduled : Get scheduled reports
     */
    @GetMapping("/scheduled")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportConfigurationDTO>> getScheduledReports() {
        log.debug("REST request to get scheduled reports");

        List<ReportConfigurationDTO> scheduledReports = reportSchedulingService.getScheduledReports();
        return ResponseEntity.ok(scheduledReports);
    }

    /**
     * DELETE /api/admin/reports/scheduled/{scheduleId} : Unschedule a report
     */
    @DeleteMapping("/scheduled/{scheduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unscheduleReport(@PathVariable String scheduleId) {
        log.debug("REST request to unschedule report: {}", scheduleId);

        try {
            reportSchedulingService.unscheduleReport(scheduleId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error unscheduling report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/reports/execution-history : Get report execution history
     */
    @GetMapping("/execution-history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportSchedulingService.ScheduledReportExecution>> getExecutionHistory() {
        log.debug("REST request to get report execution history");

        List<ReportSchedulingService.ScheduledReportExecution> history = reportSchedulingService.getExecutionHistory();
        return ResponseEntity.ok(history);
    }

    /**
     * POST /api/admin/reports/validate : Validate report configuration
     */
    @PostMapping("/validate")
    public ResponseEntity<ValidationResult> validateReportConfiguration(
            @Valid @RequestBody ReportConfigurationDTO config) {
        log.debug("REST request to validate report configuration: {}", config.getName());

        ValidationResult result = new ValidationResult();
        result.setValid(true);

        // Basic validation
        if (config.getName() == null || config.getName().trim().isEmpty()) {
            result.setValid(false);
            result.getErrors().add("Report name is required");
        }

        if (config.getReportType() == null) {
            result.setValid(false);
            result.getErrors().add("Report type is required");
        }

        if (config.getStartDate() != null && config.getEndDate() != null &&
                config.getStartDate().isAfter(config.getEndDate())) {
            result.setValid(false);
            result.getErrors().add("Start date must be before end date");
        }

        if (config.isScheduled() && config.getSchedule() == null) {
            result.setValid(false);
            result.getErrors().add("Schedule configuration is required for scheduled reports");
        }

        return ResponseEntity.ok(result);
    }

    private MediaType getMediaType(ReportConfigurationDTO.ReportFormat format) {
        switch (format) {
            case PDF:
                return MediaType.APPLICATION_PDF;
            case EXCEL:
                return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case CSV:
                return MediaType.parseMediaType("text/csv");
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    private String generateFilename(ReportDataDTO report, ReportConfigurationDTO.ReportFormat format) {
        String sanitizedTitle = report.getTitle().replaceAll("[^a-zA-Z0-9\\-_]", "_");
        String extension = getFileExtension(format);
        return String.format("%s.%s", sanitizedTitle, extension);
    }

    private String getFileExtension(ReportConfigurationDTO.ReportFormat format) {
        switch (format) {
            case PDF:
                return "pdf";
            case EXCEL:
                return "xlsx";
            case CSV:
                return "csv";
            default:
                return "txt";
        }
    }

    // Inner classes for request/response DTOs
    public static class ExportRequest {
        private ReportDataDTO report;
        private ReportConfigurationDTO.ReportFormat format;

        public ReportDataDTO getReport() {
            return report;
        }

        public void setReport(ReportDataDTO report) {
            this.report = report;
        }

        public ReportConfigurationDTO.ReportFormat getFormat() {
            return format;
        }

        public void setFormat(ReportConfigurationDTO.ReportFormat format) {
            this.format = format;
        }
    }

    public static class ValidationResult {
        private boolean valid;
        private List<String> errors = new java.util.ArrayList<>();

        public boolean isValid() {
            return valid;
        }

        public void setValid(boolean valid) {
            this.valid = valid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public void setErrors(List<String> errors) {
            this.errors = errors;
        }
    }
}