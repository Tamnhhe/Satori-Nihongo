package com.satori.platform.domain.enumeration;

/**
 * The GradeLevel enumeration for academic grade levels.
 */
public enum GradeLevel {
    ELEMENTARY("Elementary"),
    MIDDLE_SCHOOL("Middle School"),
    HIGH_SCHOOL("High School"),
    UNIVERSITY("University"),
    GRADUATE("Graduate"),
    ADULT_LEARNER("Adult Learner");

    private final String displayName;

    GradeLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}