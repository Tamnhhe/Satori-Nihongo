package com.satori.platform.domain.enumeration;

/**
 * Enumaration for notification delivery statuses
 * Tracks the lifecycle of notification delivery attempts
 */
public enum DeliveryStatus {
    /**
     * Notification is queued and waiting to be sent
     */
    PENDING,
    /**
     * Notification is currently being processed/sent
     */
    PROCESSING,
    /**
     * Notification has been sent successfully
     */
    SENT,
    /**
     * Notification has been delivered and confirmed
     */
    DELIVERED,
    /**
     * Notification delivery failed
     */
    FAILED,
    /**
     * Notification was cancelled before delivery
     */
    CANCELLED,
    /**
     * Notification has expired before delivery
     */
    EXPIRED,
    /**
     * Notification has been scheduled for delivery
     */
    SCHEDULED,
}