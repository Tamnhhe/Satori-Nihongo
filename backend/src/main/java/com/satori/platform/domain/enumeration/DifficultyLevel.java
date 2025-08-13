package com.satori.platform.domain.enumeration;

/**
 * The DifficultyLevel enumeration.
 */
public enum DifficultyLevel {
    BEGINNER("Beginner"),
    ELEMENTARY("Elementary"),
    INTERMEDIATE("Intermediate"),
    UPPER_INTERMEDIATE("Upper Intermediate"),
    ADVANCED("Advanced"),
    PROFICIENT("Proficient"),
    EASY("Easy"),
    MEDIUM("Medium"),
    HARD("Hard");

    private final String displayName;

    DifficultyLevel(String displayName) {
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