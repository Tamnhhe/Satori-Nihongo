package com.satori.platform.web.rest.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator for ValidatedInput annotation.
 */
public class ValidatedInputValidator implements ConstraintValidator<ValidatedInput, String> {

    @Override
    public void initialize(ValidatedInput constraintAnnotation) {
        // Initialization logic if needed
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Let @NotNull handle null validation
        }

        // Basic validation - no script tags or dangerous characters
        return !value.contains("<script>") &&
                !value.contains("</script>") &&
                !value.contains("javascript:") &&
                !value.contains("onload=") &&
                !value.contains("onerror=");
    }
}