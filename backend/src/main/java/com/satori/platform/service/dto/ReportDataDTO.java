package com.satori.platform.service.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ReportDataDTO {

    private String reportId;
    private String title;
    private String description;
    private LocalDateTime generatedAt;
    private String generatedBy;
    private ReportConfigurationDTO.ReportType reportType;
    private ReportMetadata metadata;
    private List<ReportSection> sections;
    private Map<String, Object> summary;

    public static class ReportMetadata {
        private String dateRange;
        private int totalRecords;
        private List<String> includedCourses;
        private List<String> includedClasses;
        private List<String> appliedFilters;

        // Getters and setters
        public String getDateRange() {
            return dateRange;
        }

        public void setDateRange(String dateRange) {
            this.dateRange = dateRange;
        }

        public int getTotalRecords() {
            return totalRecords;
        }

        public void setTotalRecords(int totalRecords) {
            this.totalRecords = totalRecords;
        }

        public List<String> getIncludedCourses() {
            return includedCourses;
        }

        public void setIncludedCourses(List<String> includedCourses) {
            this.includedCourses = includedCourses;
        }

        public List<String> getIncludedClasses() {
            return includedClasses;
        }

        public void setIncludedClasses(List<String> includedClasses) {
            this.includedClasses = includedClasses;
        }

        public List<String> getAppliedFilters() {
            return appliedFilters;
        }

        public void setAppliedFilters(List<String> appliedFilters) {
            this.appliedFilters = appliedFilters;
        }
    }

    public static class ReportSection {
        private String title;
        private String description;
        private SectionType type;
        private List<ReportChart> charts;
        private List<ReportTable> tables;
        private Map<String, Object> data;

        public enum SectionType {
            OVERVIEW,
            DETAILED_ANALYSIS,
            CHARTS,
            TABLES,
            SUMMARY
        }

        // Getters and setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public SectionType getType() {
            return type;
        }

        public void setType(SectionType type) {
            this.type = type;
        }

        public List<ReportChart> getCharts() {
            return charts;
        }

        public void setCharts(List<ReportChart> charts) {
            this.charts = charts;
        }

        public List<ReportTable> getTables() {
            return tables;
        }

        public void setTables(List<ReportTable> tables) {
            this.tables = tables;
        }

        public Map<String, Object> getData() {
            return data;
        }

        public void setData(Map<String, Object> data) {
            this.data = data;
        }
    }

    public static class ReportChart {
        private String title;
        private String chartType;
        private Map<String, Object> data;
        private Map<String, Object> options;

        // Getters and setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getChartType() {
            return chartType;
        }

        public void setChartType(String chartType) {
            this.chartType = chartType;
        }

        public Map<String, Object> getData() {
            return data;
        }

        public void setData(Map<String, Object> data) {
            this.data = data;
        }

        public Map<String, Object> getOptions() {
            return options;
        }

        public void setOptions(Map<String, Object> options) {
            this.options = options;
        }
    }

    public static class ReportTable {
        private String title;
        private List<String> headers;
        private List<List<Object>> rows;
        private Map<String, Object> formatting;

        // Getters and setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public List<String> getHeaders() {
            return headers;
        }

        public void setHeaders(List<String> headers) {
            this.headers = headers;
        }

        public List<List<Object>> getRows() {
            return rows;
        }

        public void setRows(List<List<Object>> rows) {
            this.rows = rows;
        }

        public Map<String, Object> getFormatting() {
            return formatting;
        }

        public void setFormatting(Map<String, Object> formatting) {
            this.formatting = formatting;
        }
    }

    // Main class getters and setters
    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public ReportConfigurationDTO.ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportConfigurationDTO.ReportType reportType) {
        this.reportType = reportType;
    }

    public ReportMetadata getMetadata() {
        return metadata;
    }

    public void setMetadata(ReportMetadata metadata) {
        this.metadata = metadata;
    }

    public List<ReportSection> getSections() {
        return sections;
    }

    public void setSections(List<ReportSection> sections) {
        this.sections = sections;
    }

    public Map<String, Object> getSummary() {
        return summary;
    }

    public void setSummary(Map<String, Object> summary) {
        this.summary = summary;
    }
}