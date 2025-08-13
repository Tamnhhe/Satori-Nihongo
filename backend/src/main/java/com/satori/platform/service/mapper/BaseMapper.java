package com.satori.platform.service.mapper;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * Utility class for common mapping conversions.
 */
public class BaseMapper {

    /**
     * Convert Instant to LocalDateTime
     */
    public static LocalDateTime instantToLocalDateTime(Instant instant) {
        return instant != null ? LocalDateTime.ofInstant(instant, ZoneOffset.UTC) : null;
    }

    /**
     * Convert LocalDateTime to Instant
     */
    public static Instant localDateTimeToInstant(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.toInstant(ZoneOffset.UTC) : null;
    }
}
