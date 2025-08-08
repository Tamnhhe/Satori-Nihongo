package com.satori.platform.service;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for handling localization of dates, times, and messages
 * with cultural considerations for different locales.
 */
@Service
public class LocalizationService {

    private final MessageSource messageSource;
    private final Map<String, DateTimeFormatter> dateFormatterCache = new ConcurrentHashMap<>();
    private final Map<String, DateTimeFormatter> timeFormatterCache = new ConcurrentHashMap<>();

    public LocalizationService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Format date according to locale preferences
     */
    public String formatDate(LocalDateTime dateTime, Locale locale) {
        if (dateTime == null)
            return "";

        String cacheKey = locale.toString() + "_date";
        DateTimeFormatter formatter = dateFormatterCache.computeIfAbsent(cacheKey,
                k -> getLocalizedDateFormatter(locale));

        return dateTime.format(formatter);
    }

    /**
     * Format time according to locale preferences with cultural considerations
     */
    public String formatTime(LocalDateTime dateTime, Locale locale) {
        if (dateTime == null)
            return "";

        String cacheKey = locale.toString() + "_time";
        DateTimeFormatter formatter = timeFormatterCache.computeIfAbsent(cacheKey,
                k -> getLocalizedTimeFormatter(locale));

        return dateTime.format(formatter);
    }

    /**
     * Format date and time together
     */
    public String formatDateTime(LocalDateTime dateTime, Locale locale) {
        if (dateTime == null)
            return "";

        return formatDate(dateTime, locale) + " " + formatTime(dateTime, locale);
    }

    /**
     * Format date and time with timezone consideration
     */
    public String formatDateTimeWithZone(LocalDateTime dateTime, ZoneId zoneId, Locale locale) {
        if (dateTime == null)
            return "";

        ZonedDateTime zonedDateTime = dateTime.atZone(zoneId);
        return formatDateTime(zonedDateTime.toLocalDateTime(), locale);
    }

    /**
     * Get culturally appropriate greeting based on locale and time
     */
    public String getCulturalGreeting(Locale locale, boolean formal) {
        String key = formal ? "cultural.greeting.formal" : "cultural.greeting.informal";
        return messageSource.getMessage(key, null, locale);
    }

    /**
     * Get culturally appropriate closing based on locale
     */
    public String getCulturalClosing(Locale locale, boolean formal) {
        String key = formal ? "cultural.closing.formal" : "cultural.closing.informal";
        return messageSource.getMessage(key, null, locale);
    }

    /**
     * Get localized message with parameters
     */
    public String getMessage(String key, Object[] args, Locale locale) {
        return messageSource.getMessage(key, args, locale);
    }

    /**
     * Get localized message with current locale
     */
    public String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    /**
     * Determine appropriate notification timing based on cultural preferences
     */
    public NotificationTiming getOptimalNotificationTiming(Locale locale) {
        String language = locale.getLanguage();

        switch (language) {
            case "vi":
                // Vietnamese culture: prefer morning notifications, avoid late evening
                return new NotificationTiming(7, 21, true); // 7 AM to 9 PM, avoid weekends
            case "ja":
                // Japanese culture: respect work-life balance, avoid early morning and late
                // evening
                return new NotificationTiming(8, 20, true); // 8 AM to 8 PM, avoid weekends
            default:
                // Default Western timing
                return new NotificationTiming(8, 22, false); // 8 AM to 10 PM, weekends OK
        }
    }

    /**
     * Get appropriate advance notice period based on cultural preferences
     */
    public int getAdvanceNoticeHours(Locale locale, String notificationType) {
        String language = locale.getLanguage();

        switch (language) {
            case "vi":
                // Vietnamese culture: prefer longer advance notice for formal events
                return "schedule".equals(notificationType) ? 24 : 2;
            case "ja":
                // Japanese culture: very structured, prefer significant advance notice
                return "schedule".equals(notificationType) ? 48 : 4;
            default:
                return "schedule".equals(notificationType) ? 24 : 1;
        }
    }

    /**
     * Check if current time is appropriate for notifications based on cultural
     * preferences
     */
    public boolean isAppropriateNotificationTime(LocalDateTime dateTime, Locale locale, ZoneId userTimezone) {
        ZonedDateTime userTime = dateTime.atZone(userTimezone);
        NotificationTiming timing = getOptimalNotificationTiming(locale);

        int hour = userTime.getHour();
        boolean isWeekend = userTime.getDayOfWeek().getValue() >= 6;

        // Check if within acceptable hours
        if (hour < timing.getStartHour() || hour > timing.getEndHour()) {
            return false;
        }

        // Check weekend preferences
        if (isWeekend && timing.isAvoidWeekends()) {
            return false;
        }

        return true;
    }

    private DateTimeFormatter getLocalizedDateFormatter(Locale locale) {
        String language = locale.getLanguage();

        switch (language) {
            case "vi":
                // Vietnamese format: dd/MM/yyyy
                return DateTimeFormatter.ofPattern("dd/MM/yyyy", locale);
            case "ja":
                // Japanese format: yyyy年MM月dd日
                return DateTimeFormatter.ofPattern("yyyy年MM月dd日", locale);
            default:
                // Default format based on locale
                return DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM).withLocale(locale);
        }
    }

    private DateTimeFormatter getLocalizedTimeFormatter(Locale locale) {
        String language = locale.getLanguage();

        switch (language) {
            case "vi":
            case "ja":
                // 24-hour format for Vietnamese and Japanese
                return DateTimeFormatter.ofPattern("HH:mm", locale);
            default:
                // 12-hour format for English and others
                return DateTimeFormatter.ofPattern("h:mm a", locale);
        }
    }

    /**
     * Inner class to represent notification timing preferences
     */
    public static class NotificationTiming {
        private final int startHour;
        private final int endHour;
        private final boolean avoidWeekends;

        public NotificationTiming(int startHour, int endHour, boolean avoidWeekends) {
            this.startHour = startHour;
            this.endHour = endHour;
            this.avoidWeekends = avoidWeekends;
        }

        public int getStartHour() {
            return startHour;
        }

        public int getEndHour() {
            return endHour;
        }

        public boolean isAvoidWeekends() {
            return avoidWeekends;
        }
    }
}