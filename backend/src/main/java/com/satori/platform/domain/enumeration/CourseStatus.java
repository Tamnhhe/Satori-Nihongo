package com.satori.platform.domain.enumeration;

/**
 * The CourseStatus enumeration for better course lifecycle management.
 */
public enum CourseStatus {
    DRAFT("Draft"),
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    ARCHIVED("Archived"),
    UNDER_REVIEW("Under Review");

    private final String displayName;

    CourseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isPubliclyVisible() {
        return this == ACTIVE;
    }

    public boolean canEnroll() {
        return this == ACTIVE;
    }

    public boolean canEdit() {
        return this == DRAFT || this == INACTIVE || this == UNDER_REVIEW;
    }

    @Override
    public String toString() {
        return displayName;
    }
}