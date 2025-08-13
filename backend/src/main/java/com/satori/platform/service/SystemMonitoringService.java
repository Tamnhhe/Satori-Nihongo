package com.satori.platform.service;

import com.satori.platform.service.dto.SystemMonitoringDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.time.Instant;
import java.util.*;

/**
 * Service for system monitoring and health checks.
 */
@Service
public class SystemMonitoringService {

    private final Logger log = LoggerFactory.getLogger(SystemMonitoringService.class);

    private final HealthEndpoint healthEndpoint;
    private final MeterRegistry meterRegistry;

    public SystemMonitoringService(HealthEndpoint healthEndpoint, MeterRegistry meterRegistry) {
        this.healthEndpoint = healthEndpoint;
        this.meterRegistry = meterRegistry;
    }

    /**
     * Get comprehensive system monitoring data.
     */
    public SystemMonitoringDTO getSystemMonitoring() {
        log.debug("Getting system monitoring data");

        SystemMonitoringDTO monitoring = new SystemMonitoringDTO();

        // System health
        monitoring.setHealth(getSystemHealth());

        // Performance metrics
        monitoring.setPerformance(getPerformanceMetrics());

        // Recent errors (mock data for demonstration)
        monitoring.setRecentErrors(getRecentErrors());

        // Active alerts (mock data for demonstration)
        monitoring.setActiveAlerts(getActiveAlerts());

        // Custom metrics
        monitoring.setCustomMetrics(getCustomMetrics());

        return monitoring;
    }

    /**
     * Get system health information.
     */
    private SystemMonitoringDTO.SystemHealthDTO getSystemHealth() {
        SystemMonitoringDTO.SystemHealthDTO health = new SystemMonitoringDTO.SystemHealthDTO();

        try {
            HealthComponent healthComponent = healthEndpoint.health();
            Health systemHealth = null;
            
            if (healthComponent instanceof Health) {
                systemHealth = (Health) healthComponent;
                health.setStatus(systemHealth.getStatus().getCode());
                health.setLastChecked(Instant.now());
            } else {
                health.setStatus("UNKNOWN");
                health.setLastChecked(Instant.now());
            }

            Map<String, SystemMonitoringDTO.ComponentHealthDTO> components = new HashMap<>();

            if (systemHealth != null && systemHealth.getDetails() != null) {
                systemHealth.getDetails().forEach((key, value) -> {
                    if (value instanceof Health) {
                        Health componentHealth = (Health) value;
                        SystemMonitoringDTO.ComponentHealthDTO component = new SystemMonitoringDTO.ComponentHealthDTO();
                        component.setStatus(componentHealth.getStatus().getCode());
                        component.setDetails(componentHealth.getDetails());
                        component.setResponseTime(System.currentTimeMillis() % 100); // Mock response time
                        components.put(key, component);
                    }
                });
            }

            health.setComponents(components);
        } catch (Exception e) {
            log.error("Error getting system health", e);
            health.setStatus("DOWN");
            health.setLastChecked(Instant.now());
            health.setComponents(new HashMap<>());
        }

        return health;
    }

    /**
     * Get performance metrics.
     */
    private SystemMonitoringDTO.PerformanceMetricsDTO getPerformanceMetrics() {
        SystemMonitoringDTO.PerformanceMetricsDTO performance = new SystemMonitoringDTO.PerformanceMetricsDTO();

        // CPU metrics
        performance.setCpu(getCpuMetrics());

        // Memory metrics
        performance.setMemory(getMemoryMetrics());

        // Disk metrics (mock data)
        performance.setDisk(getDiskMetrics());

        // Network metrics (mock data)
        performance.setNetwork(getNetworkMetrics());

        // Database metrics (mock data)
        performance.setDatabase(getDatabaseMetrics());

        return performance;
    }

    private SystemMonitoringDTO.CpuMetricsDTO getCpuMetrics() {
        SystemMonitoringDTO.CpuMetricsDTO cpu = new SystemMonitoringDTO.CpuMetricsDTO();

        try {
            OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
            cpu.setCores(osBean.getAvailableProcessors());
            cpu.setLoadAverage(osBean.getSystemLoadAverage());

            // Try to get CPU usage if available
            if (osBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsBean = (com.sun.management.OperatingSystemMXBean) osBean;
                cpu.setUsage(sunOsBean.getProcessCpuLoad() * 100);
            } else {
                cpu.setUsage(Math.random() * 100); // Mock data
            }
        } catch (Exception e) {
            log.warn("Could not get CPU metrics", e);
            cpu.setCores(Runtime.getRuntime().availableProcessors());
            cpu.setUsage(Math.random() * 100);
            cpu.setLoadAverage(-1);
        }

        return cpu;
    }

    private SystemMonitoringDTO.MemoryMetricsDTO getMemoryMetrics() {
        SystemMonitoringDTO.MemoryMetricsDTO memory = new SystemMonitoringDTO.MemoryMetricsDTO();

        try {
            MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
            long heapUsed = memoryBean.getHeapMemoryUsage().getUsed();
            long heapMax = memoryBean.getHeapMemoryUsage().getMax();

            memory.setUsed(heapUsed);
            memory.setTotal(heapMax);
            memory.setFree(heapMax - heapUsed);
            memory.setUsagePercentage((double) heapUsed / heapMax * 100);
        } catch (Exception e) {
            log.warn("Could not get memory metrics", e);
            Runtime runtime = Runtime.getRuntime();
            long total = runtime.totalMemory();
            long free = runtime.freeMemory();
            long used = total - free;

            memory.setTotal(total);
            memory.setUsed(used);
            memory.setFree(free);
            memory.setUsagePercentage((double) used / total * 100);
        }

        return memory;
    }

    private SystemMonitoringDTO.DiskMetricsDTO getDiskMetrics() {
        SystemMonitoringDTO.DiskMetricsDTO disk = new SystemMonitoringDTO.DiskMetricsDTO();

        // Mock data - in a real implementation, you would get actual disk metrics
        long total = 1000000000000L; // 1TB
        long used = (long) (total * (0.3 + Math.random() * 0.4)); // 30-70% usage
        long free = total - used;

        disk.setTotal(total);
        disk.setUsed(used);
        disk.setFree(free);
        disk.setUsagePercentage((double) used / total * 100);

        return disk;
    }

    private SystemMonitoringDTO.NetworkMetricsDTO getNetworkMetrics() {
        SystemMonitoringDTO.NetworkMetricsDTO network = new SystemMonitoringDTO.NetworkMetricsDTO();

        // Mock data - in a real implementation, you would get actual network metrics
        network.setBytesReceived((long) (Math.random() * 1000000000));
        network.setBytesSent((long) (Math.random() * 1000000000));
        network.setPacketsReceived((long) (Math.random() * 1000000));
        network.setPacketsSent((long) (Math.random() * 1000000));

        return network;
    }

    private SystemMonitoringDTO.DatabaseMetricsDTO getDatabaseMetrics() {
        SystemMonitoringDTO.DatabaseMetricsDTO database = new SystemMonitoringDTO.DatabaseMetricsDTO();

        // Mock data - in a real implementation, you would get actual database metrics
        int maxConnections = 20;
        int activeConnections = (int) (Math.random() * maxConnections);

        database.setMaxConnections(maxConnections);
        database.setActiveConnections(activeConnections);
        database.setConnectionUsagePercentage((double) activeConnections / maxConnections * 100);
        database.setQueryCount((long) (Math.random() * 10000));
        database.setAverageQueryTime(Math.random() * 100);

        return database;
    }

    private List<SystemMonitoringDTO.ErrorLogDTO> getRecentErrors() {
        List<SystemMonitoringDTO.ErrorLogDTO> errors = new ArrayList<>();

        // Mock error data
        String[] levels = { "ERROR", "WARN", "ERROR" };
        String[] messages = {
                "Database connection timeout",
                "High memory usage detected",
                "Failed to process user request"
        };
        String[] loggers = {
                "com.satori.platform.service.DatabaseService",
                "com.satori.platform.monitoring.MemoryMonitor",
                "com.satori.platform.web.rest.UserResource"
        };

        for (int i = 0; i < 3; i++) {
            SystemMonitoringDTO.ErrorLogDTO error = new SystemMonitoringDTO.ErrorLogDTO();
            error.setTimestamp(Instant.now().minusSeconds(i * 300)); // 5 minutes apart
            error.setLevel(levels[i]);
            error.setMessage(messages[i]);
            error.setLogger(loggers[i]);
            errors.add(error);
        }

        return errors;
    }

    private List<SystemMonitoringDTO.AlertDTO> getActiveAlerts() {
        List<SystemMonitoringDTO.AlertDTO> alerts = new ArrayList<>();

        // Mock alert data
        if (Math.random() > 0.5) {
            SystemMonitoringDTO.AlertDTO alert = new SystemMonitoringDTO.AlertDTO();
            alert.setId("alert-" + System.currentTimeMillis());
            alert.setType("PERFORMANCE");
            alert.setSeverity("WARNING");
            alert.setTitle("High CPU Usage");
            alert.setMessage("CPU usage has exceeded 80% for the last 5 minutes");
            alert.setCreatedAt(Instant.now().minusSeconds(300));
            alert.setAcknowledged(false);
            alerts.add(alert);
        }

        if (Math.random() > 0.7) {
            SystemMonitoringDTO.AlertDTO alert = new SystemMonitoringDTO.AlertDTO();
            alert.setId("alert-" + (System.currentTimeMillis() + 1));
            alert.setType("SECURITY");
            alert.setSeverity("CRITICAL");
            alert.setTitle("Multiple Failed Login Attempts");
            alert.setMessage("Detected multiple failed login attempts from IP 192.168.1.100");
            alert.setCreatedAt(Instant.now().minusSeconds(600));
            alert.setAcknowledged(false);
            alerts.add(alert);
        }

        return alerts;
    }

    private Map<String, Object> getCustomMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Mock custom metrics
        metrics.put("activeUsers", (int) (Math.random() * 1000));
        metrics.put("requestsPerMinute", (int) (Math.random() * 500));
        metrics.put("averageResponseTime", Math.round(Math.random() * 200 * 100.0) / 100.0);
        metrics.put("errorRate", Math.round(Math.random() * 5 * 100.0) / 100.0);
        metrics.put("cacheHitRatio", Math.round((0.8 + Math.random() * 0.2) * 100.0) / 100.0);

        return metrics;
    }

    /**
     * Acknowledge an alert.
     */
    public void acknowledgeAlert(String alertId) {
        log.debug("Acknowledging alert: {}", alertId);
        // In a real implementation, you would update the alert status in the database
    }

    /**
     * Get historical performance data.
     */
    public Map<String, List<Map<String, Object>>> getHistoricalMetrics(String timeRange) {
        log.debug("Getting historical metrics for time range: {}", timeRange);

        Map<String, List<Map<String, Object>>> historicalData = new HashMap<>();

        // Mock historical data
        List<Map<String, Object>> cpuHistory = new ArrayList<>();
        List<Map<String, Object>> memoryHistory = new ArrayList<>();

        int dataPoints = "1h".equals(timeRange) ? 60 : "24h".equals(timeRange) ? 24 : 7;

        for (int i = 0; i < dataPoints; i++) {
            Map<String, Object> cpuPoint = new HashMap<>();
            cpuPoint.put("timestamp", Instant.now().minusSeconds(i * 60));
            cpuPoint.put("value", Math.random() * 100);
            cpuHistory.add(cpuPoint);

            Map<String, Object> memoryPoint = new HashMap<>();
            memoryPoint.put("timestamp", Instant.now().minusSeconds(i * 60));
            memoryPoint.put("value", 60 + Math.random() * 30);
            memoryHistory.add(memoryPoint);
        }

        historicalData.put("cpu", cpuHistory);
        historicalData.put("memory", memoryHistory);

        return historicalData;
    }
}