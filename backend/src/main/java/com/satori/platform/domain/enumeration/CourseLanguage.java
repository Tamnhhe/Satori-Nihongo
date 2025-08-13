package com.satori.platform.domain.enumeration;

/**
 * The CourseLanguage enumeration.
 */
public enum CourseLanguage {
    JAPANESE("Japanese"),
    ENGLISH("English"),
    VIETNAMESE("Vietnamese"),
    KOREAN("Korean"),
    CHINESE("Chinese");

    private final String displayName;

    CourseLanguage(String displayName) {
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