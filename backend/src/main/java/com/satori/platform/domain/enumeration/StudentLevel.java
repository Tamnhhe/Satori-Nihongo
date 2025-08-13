package com.satori.platform.domain.enumeration;

/**
 * The StudentLevel enumeration for Japanese language proficiency levels.
 */
public enum StudentLevel {
    N5("N5 - Beginner"),
    N4("N4 - Elementary"),
    N3("N3 - Intermediate"),
    N2("N2 - Upper Intermediate"),
    N1("N1 - Advanced"),
    NATIVE("Native Level");

    private final String displayName;

    StudentLevel(String displayName) {
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