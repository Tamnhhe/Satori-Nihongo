package com.satori.platform.service.dto;

import java.time.Instant;

/**
 * DTO for delivery statistics
 */
public class DeliveryStatsDTO {

    private long total;
    private long successful;
    private long failed;
    private long pending;
    private double deliveryRate;
    private Instant date;

    // Constructors
    public DeliveryStatsDTO() {
    }

    public DeliveryStatsDTO(long total, long successful, long failed, long pending) {
        this.total = total;
        this.successful = successful;
        this.failed = failed;
        this.pending = pending;
        this.deliveryRate = total > 0 ? (double) successful / total * 100 : 0.0;
    }

    // Getters and Setters
    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getSuccessful() {
        return successful;
    }

    public void setSuccessful(long successful) {
        this.successful = successful;
    }

    public long getFailed() {
        return failed;
    }

    public void setFailed(long failed) {
        this.failed = failed;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public double getDeliveryRate() {
        return deliveryRate;
    }

    public void setDeliveryRate(double deliveryRate) {
        this.deliveryRate = deliveryRate;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "DeliveryStatsDTO{" +
                "total=" + total +
                ", successful=" + successful +
                ", failed=" + failed +
                ", pending=" + pending +
                ", deliveryRate=" + deliveryRate +
                ", date=" + date +
                '}';
    }
}