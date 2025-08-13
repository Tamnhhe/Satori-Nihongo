package com.satori.platform.service.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * DTO for system monitoring data.
 */
public class SystemMonitoringDTO {

    private SystemHealthDTO health;
    private PerformanceMetricsDTO performance;
    private List<ErrorLogDTO> recentErrors;
    private List<AlertDTO> activeAlerts;
    private Map<String, Object> customMetrics;

    public SystemHealthDTO getHealth() {
        return health;
    }

    public void setHealth(SystemHealthDTO health) {
        this.health = health;
    }

    public PerformanceMetricsDTO getPerformance() {
        return performance;
    }

    public void setPerformance(PerformanceMetricsDTO performance) {
        this.performance = performance;
    }

    public List<ErrorLogDTO> getRecentErrors() {
        return recentErrors;
    }

    public void setRecentErrors(List<ErrorLogDTO> recentErrors) {
        this.recentErrors = recentErrors;
    }

    public List<AlertDTO> getActiveAlerts() {
        return activeAlerts;
    }

    public void setActiveAlerts(List<AlertDTO> activeAlerts) {
        this.activeAlerts = activeAlerts;
    }

    public Map<String, Object> getCustomMetrics() {
        return customMetrics;
    }

    public void setCustomMetrics(Map<String, Object> customMetrics) {
        this.customMetrics = customMetrics;
    }

    /**
     * DTO for system health information.
     */
    public static class SystemHealthDTO {
        private String status;
        private Map<String, ComponentHealthDTO> components;
        private Instant lastChecked;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Map<String, ComponentHealthDTO> getComponents() {
            return components;
        }

        public void setComponents(Map<String, ComponentHealthDTO> components) {
            this.components = components;
        }

        public Instant getLastChecked() {
            return lastChecked;
        }

        public void setLastChecked(Instant lastChecked) {
            this.lastChecked = lastChecked;
        }
    }

    /**
     * DTO for component health information.
     */
    public static class ComponentHealthDTO {
        private String status;
        private String description;
        private Map<String, Object> details;
        private Long responseTime;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Map<String, Object> getDetails() {
            return details;
        }

        public void setDetails(Map<String, Object> details) {
            this.details = details;
        }

        public Long getResponseTime() {
            return responseTime;
        }

        public void setResponseTime(Long responseTime) {
            this.responseTime = responseTime;
        }
    }

    /**
     * DTO for performance metrics.
     */
    public static class PerformanceMetricsDTO {
        private CpuMetricsDTO cpu;
        private MemoryMetricsDTO memory;
        private DiskMetricsDTO disk;
        private NetworkMetricsDTO network;
        private DatabaseMetricsDTO database;

        public CpuMetricsDTO getCpu() {
            return cpu;
        }

        public void setCpu(CpuMetricsDTO cpu) {
            this.cpu = cpu;
        }

        public MemoryMetricsDTO getMemory() {
            return memory;
        }

        public void setMemory(MemoryMetricsDTO memory) {
            this.memory = memory;
        }

        public DiskMetricsDTO getDisk() {
            return disk;
        }

        public void setDisk(DiskMetricsDTO disk) {
            this.disk = disk;
        }

        public NetworkMetricsDTO getNetwork() {
            return network;
        }

        public void setNetwork(NetworkMetricsDTO network) {
            this.network = network;
        }

        public DatabaseMetricsDTO getDatabase() {
            return database;
        }

        public void setDatabase(DatabaseMetricsDTO database) {
            this.database = database;
        }
    }

    /**
     * DTO for CPU metrics.
     */
    public static class CpuMetricsDTO {
        private double usage;
        private double loadAverage;
        private int cores;

        public double getUsage() {
            return usage;
        }

        public void setUsage(double usage) {
            this.usage = usage;
        }

        public double getLoadAverage() {
            return loadAverage;
        }

        public void setLoadAverage(double loadAverage) {
            this.loadAverage = loadAverage;
        }

        public int getCores() {
            return cores;
        }

        public void setCores(int cores) {
            this.cores = cores;
        }
    }

    /**
     * DTO for memory metrics.
     */
    public static class MemoryMetricsDTO {
        private long total;
        private long used;
        private long free;
        private double usagePercentage;

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public long getUsed() {
            return used;
        }

        public void setUsed(long used) {
            this.used = used;
        }

        public long getFree() {
            return free;
        }

        public void setFree(long free) {
            this.free = free;
        }

        public double getUsagePercentage() {
            return usagePercentage;
        }

        public void setUsagePercentage(double usagePercentage) {
            this.usagePercentage = usagePercentage;
        }
    }

    /**
     * DTO for disk metrics.
     */
    public static class DiskMetricsDTO {
        private long total;
        private long used;
        private long free;
        private double usagePercentage;

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public long getUsed() {
            return used;
        }

        public void setUsed(long used) {
            this.used = used;
        }

        public long getFree() {
            return free;
        }

        public void setFree(long free) {
            this.free = free;
        }

        public double getUsagePercentage() {
            return usagePercentage;
        }

        public void setUsagePercentage(double usagePercentage) {
            this.usagePercentage = usagePercentage;
        }
    }

    /**
     * DTO for network metrics.
     */
    public static class NetworkMetricsDTO {
        private long bytesReceived;
        private long bytesSent;
        private long packetsReceived;
        private long packetsSent;

        public long getBytesReceived() {
            return bytesReceived;
        }

        public void setBytesReceived(long bytesReceived) {
            this.bytesReceived = bytesReceived;
        }

        public long getBytesSent() {
            return bytesSent;
        }

        public void setBytesSent(long bytesSent) {
            this.bytesSent = bytesSent;
        }

        public long getPacketsReceived() {
            return packetsReceived;
        }

        public void setPacketsReceived(long packetsReceived) {
            this.packetsReceived = packetsReceived;
        }

        public long getPacketsSent() {
            return packetsSent;
        }

        public void setPacketsSent(long packetsSent) {
            this.packetsSent = packetsSent;
        }
    }

    /**
     * DTO for database metrics.
     */
    public static class DatabaseMetricsDTO {
        private int activeConnections;
        private int maxConnections;
        private double connectionUsagePercentage;
        private long queryCount;
        private double averageQueryTime;

        public int getActiveConnections() {
            return activeConnections;
        }

        public void setActiveConnections(int activeConnections) {
            this.activeConnections = activeConnections;
        }

        public int getMaxConnections() {
            return maxConnections;
        }

        public void setMaxConnections(int maxConnections) {
            this.maxConnections = maxConnections;
        }

        public double getConnectionUsagePercentage() {
            return connectionUsagePercentage;
        }

        public void setConnectionUsagePercentage(double connectionUsagePercentage) {
            this.connectionUsagePercentage = connectionUsagePercentage;
        }

        public long getQueryCount() {
            return queryCount;
        }

        public void setQueryCount(long queryCount) {
            this.queryCount = queryCount;
        }

        public double getAverageQueryTime() {
            return averageQueryTime;
        }

        public void setAverageQueryTime(double averageQueryTime) {
            this.averageQueryTime = averageQueryTime;
        }
    }

    /**
     * DTO for error log entries.
     */
    public static class ErrorLogDTO {
        private Instant timestamp;
        private String level;
        private String message;
        private String logger;
        private String exception;

        public Instant getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Instant timestamp) {
            this.timestamp = timestamp;
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getLogger() {
            return logger;
        }

        public void setLogger(String logger) {
            this.logger = logger;
        }

        public String getException() {
            return exception;
        }

        public void setException(String exception) {
            this.exception = exception;
        }
    }

    /**
     * DTO for system alerts.
     */
    public static class AlertDTO {
        private String id;
        private String type;
        private String severity;
        private String title;
        private String message;
        private Instant createdAt;
        private boolean acknowledged;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }

        public boolean isAcknowledged() {
            return acknowledged;
        }

        public void setAcknowledged(boolean acknowledged) {
            this.acknowledged = acknowledged;
        }
    }
}