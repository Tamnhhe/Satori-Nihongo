package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for calendar export functionality.
 */
public class CalendarExportDTO implements Serializable {

    private String format; // ICS, GOOGLE, OUTLOOK
    private String content;
    private String filename;
    private String mimeType;

    public CalendarExportDTO() {
    }

    public CalendarExportDTO(String format, String content, String filename, String mimeType) {
        this.format = format;
        this.content = content;
        this.filename = filename;
        this.mimeType = mimeType;
    }

    // Getters and Setters
    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CalendarExportDTO))
            return false;
        CalendarExportDTO that = (CalendarExportDTO) o;
        return Objects.equals(format, that.format) &&
                Objects.equals(filename, that.filename);
    }

    @Override
    public int hashCode() {
        return Objects.hash(format, filename);
    }

    @Override
    public String toString() {
        return "CalendarExportDTO{" +
                "format='" + format + '\'' +
                ", filename='" + filename + '\'' +
                ", mimeType='" + mimeType + '\'' +
                '}';
    }
}