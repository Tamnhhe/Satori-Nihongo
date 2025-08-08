package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.domain.enumeration.NotificationType;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * DTO for comprehensive notification analytics
 */
public class NotificationAnalyticsDTO {

    private Instant startDate;
    private Instant endDate;
    private Map<DeliveryStatus, Long> overallStats;
    private double overallDeliveryRate;
    private Map<NotificationType, DeliveryStatsDTO> statsByType;
    private Map<String, DeliveryStatsDTO> statsByChannel;
    private double averageDeliveryTimeSeconds;
    private Map<String, Long> failureReasons;
    private List<DeliveryStatsDTO> dailyTrends;

    // Constructors
    public NotificationAnalyticsDTO() {
    }

    // Getters and Setters
    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Map<DeliveryStatus, Long> getOverallStats() {
        return overallStats;
    }

    public void setOverallStats(Map<DeliveryStatus, Long> overallStats) {
        this.overallStats = overallStats;
    }

    public double getOverallDeliveryRate() {
        return overallDeliveryRate;
    }

    public void setOverallDeliveryRate(double overallDeliveryRate) {
        this.overallDeliveryRate = overallDeliveryRate;
    }

    public Map<NotificationType, DeliveryStatsDTO> getStatsByType() {
        return statsByType;
    }

    public void setStatsByType(Map<NotificationType, DeliveryStatsDTO> statsByType) {
        this.statsByType = statsByType;
    }

    public Map<String, DeliveryStatsDTO> getStatsByChannel() {
        return statsByChannel;
    }

    public void setStatsByChannel(Map<String, DeliveryStatsDTO> statsByChannel) {
        this.statsByChannel = statsByChannel;
    }

    public double getAverageDeliveryTimeSeconds() {
        return averageDeliveryTimeSeconds;
    }

    public void setAverageDeliveryTimeSeconds(double averageDeliveryTimeSeconds) {
        this.averageDeliveryTimeSeconds = averageDeliveryTimeSeconds;
    }

    public Map<String, Long> getFailureReasons() {
        return failureReasons;
    }

    public void setFailureReasons(Map<String, Long> failureReasons) {
        this.failureReasons = failureReasons;
    }

    public List<DeliveryStatsDTO> getDailyTrends() {
        return dailyTrends;
    }

    public void setDailyTrends(List<DeliveryStatsDTO> dailyTrends) {
        this.dailyTrends = dailyTrends;
    }

    @Override
    public String toString() {
        return "NotificationAnalyticsDTO{" +
                "startDate=" + startDate +
                ", endDate=" + endDate +
                ", overallDeliveryRate=" + overallDeliveryRate +
                ", averageDeliveryTimeSeconds=" + averageDeliveryTimeSeconds +
                '}';
    }
}