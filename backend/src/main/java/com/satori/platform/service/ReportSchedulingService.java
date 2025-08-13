package com.satori.platform.service;

import com.satori.platform.service.dto.ReportConfigurationDTO;
import com.satori.platform.service.dto.ReportDataDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ReportSchedulingService {

    private final Logger log = LoggerFactory.getLogger(ReportSchedulingService.class);

    @Autowired
    private ReportingService reportingService;

    @Autowired
    private ReportDeliveryService reportDeliveryService;

    // In-memory storage for scheduled reports (in production, use database)
    private final Map<String, ReportConfigurationDTO> scheduledReports = new ConcurrentHashMap<>();
    private final List<ScheduledReportExecution> executionHistory = new CopyOnWriteArrayList<>();

    /**
     * Schedule a report for automatic generation and delivery
     */
    public void scheduleReport(ReportConfigurationDTO config) {
        log.debug("Scheduling report: {}", config.getName());

        if (config.getSchedule() == null || !config.isScheduled()) {
            throw new IllegalArgumentException("Report configuration must have valid schedule settings");
        }

        // Calculate next run time
        LocalDateTime nextRun = calculateNextRunTime(config.getSchedule());
        config.getSchedule().setNextRun(nextRun);

        // Store scheduled report
        String scheduleId = generateScheduleId(config);
        scheduledReports.put(scheduleId, config);

        log.info("Report '{}' scheduled for next execution at: {}", config.getName(), nextRun);
    }

    /**
     * Remove a scheduled report
     */
    public void unscheduleReport(String scheduleId) {
        log.debug("Unscheduling report with ID: {}", scheduleId);

        ReportConfigurationDTO removed = scheduledReports.remove(scheduleId);
        if (removed != null) {
            log.info("Report '{}' unscheduled successfully", removed.getName());
        }
    }

    /**
     * Get all scheduled reports
     */
    public List<ReportConfigurationDTO> getScheduledReports() {
        return List.copyOf(scheduledReports.values());
    }

    /**
     * Get execution history
     */
    public List<ScheduledReportExecution> getExecutionHistory() {
        return List.copyOf(executionHistory);
    }

    /**
     * Scheduled task to check and execute due reports
     * Runs every 15 minutes
     */
    @Scheduled(fixedRate = 900000) // 15 minutes
    public void executeScheduledReports() {
        log.debug("Checking for due scheduled reports");

        LocalDateTime now = LocalDateTime.now();

        for (Map.Entry<String, ReportConfigurationDTO> entry : scheduledReports.entrySet()) {
            String scheduleId = entry.getKey();
            ReportConfigurationDTO config = entry.getValue();

            if (config.getSchedule().isActive() &&
                    config.getSchedule().getNextRun() != null &&
                    config.getSchedule().getNextRun().isBefore(now)) {

                log.info("Executing scheduled report: {}", config.getName());
                executeScheduledReportAsync(scheduleId, config);

                // Update next run time
                LocalDateTime nextRun = calculateNextRunTime(config.getSchedule());
                config.getSchedule().setNextRun(nextRun);
            }
        }
    }

    @Async
    public void executeScheduledReportAsync(String scheduleId, ReportConfigurationDTO config) {
        ScheduledReportExecution execution = new ScheduledReportExecution();
        execution.setScheduleId(scheduleId);
        execution.setReportName(config.getName());
        execution.setExecutionTime(LocalDateTime.now());
        execution.setStatus(ExecutionStatus.RUNNING);

        executionHistory.add(execution);

        try {
            // Generate report
            ReportDataDTO report = reportingService.generateReport(config);

            // Export report in configured format
            byte[] exportedReport = reportingService.exportReport(report, config.getFormat());

            // Deliver report to recipients
            if (config.getSchedule().getRecipients() != null && !config.getSchedule().getRecipients().isEmpty()) {
                reportDeliveryService.deliverReport(
                        report,
                        exportedReport,
                        config.getFormat(),
                        config.getSchedule().getRecipients());
            }

            execution.setStatus(ExecutionStatus.SUCCESS);
            execution.setCompletionTime(LocalDateTime.now());

            log.info("Scheduled report '{}' executed successfully", config.getName());

        } catch (Exception e) {
            execution.setStatus(ExecutionStatus.FAILED);
            execution.setErrorMessage(e.getMessage());
            execution.setCompletionTime(LocalDateTime.now());

            log.error("Failed to execute scheduled report '{}': {}", config.getName(), e.getMessage(), e);
        }
    }

    private LocalDateTime calculateNextRunTime(ReportConfigurationDTO.ReportSchedule schedule) {
        LocalDateTime now = LocalDateTime.now();

        switch (schedule.getFrequency()) {
            case DAILY:
                return now.plusDays(1);
            case WEEKLY:
                return now.plusWeeks(1);
            case MONTHLY:
                return now.plusMonths(1);
            case QUARTERLY:
                return now.plusMonths(3);
            default:
                throw new IllegalArgumentException("Unsupported schedule frequency: " + schedule.getFrequency());
        }
    }

    private String generateScheduleId(ReportConfigurationDTO config) {
        return config.getName().replaceAll("\\s+", "_").toLowerCase() + "_" +
                System.currentTimeMillis();
    }

    public static class ScheduledReportExecution {
        private String scheduleId;
        private String reportName;
        private LocalDateTime executionTime;
        private LocalDateTime completionTime;
        private ExecutionStatus status;
        private String errorMessage;

        // Getters and setters
        public String getScheduleId() {
            return scheduleId;
        }

        public void setScheduleId(String scheduleId) {
            this.scheduleId = scheduleId;
        }

        public String getReportName() {
            return reportName;
        }

        public void setReportName(String reportName) {
            this.reportName = reportName;
        }

        public LocalDateTime getExecutionTime() {
            return executionTime;
        }

        public void setExecutionTime(LocalDateTime executionTime) {
            this.executionTime = executionTime;
        }

        public LocalDateTime getCompletionTime() {
            return completionTime;
        }

        public void setCompletionTime(LocalDateTime completionTime) {
            this.completionTime = completionTime;
        }

        public ExecutionStatus getStatus() {
            return status;
        }

        public void setStatus(ExecutionStatus status) {
            this.status = status;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }
    }

    public enum ExecutionStatus {
        RUNNING,
        SUCCESS,
        FAILED
    }
}