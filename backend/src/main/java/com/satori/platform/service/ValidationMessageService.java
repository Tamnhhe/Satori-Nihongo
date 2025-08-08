package com.satori.platform.service;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import jakarta.validation.ConstraintViolation;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for handling localized validation messages and error feedback
 */
@Service
public class ValidationMessageService {

    private final MessageSource messageSource;

    public ValidationMessageService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Get localized validation error message
     */
    public String getValidationMessage(String key, Object[] args, Locale locale) {
        return messageSource.getMessage(key, args, locale);
    }

    /**
     * Get localized validation error message with current locale
     */
    public String getValidationMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    /**
     * Convert constraint violations to localized error messages
     */
    public Map<String, String> getLocalizedConstraintViolations(Set<ConstraintViolation<?>> violations, Locale locale) {
        return violations.stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        violation -> getLocalizedConstraintMessage(violation, locale)));
    }

    /**
     * Convert constraint violations to localized error messages with current locale
     */
    public Map<String, String> getLocalizedConstraintViolations(Set<ConstraintViolation<?>> violations) {
        return getLocalizedConstraintViolations(violations, LocaleContextHolder.getLocale());
    }

    /**
     * Get localized constraint violation message
     */
    private String getLocalizedConstraintMessage(ConstraintViolation<?> violation, Locale locale) {
        String annotationName = violation.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName();
        String messageKey = getMessageKeyForConstraint(annotationName);

        // Try to get localized message, fallback to original message
        try {
            return messageSource.getMessage(messageKey, new Object[] { violation.getInvalidValue() }, locale);
        } catch (Exception e) {
            return violation.getMessage();
        }
    }

    /**
     * Map constraint annotation names to message keys
     */
    private String getMessageKeyForConstraint(String annotationName) {
        switch (annotationName) {
            case "NotNull":
            case "NotEmpty":
            case "NotBlank":
                return "error.validation.required";
            case "Email":
                return "error.validation.email";
            case "Size":
                return "error.validation.size";
            case "Min":
                return "error.validation.min";
            case "Max":
                return "error.validation.max";
            case "Pattern":
                return "error.validation.pattern";
            case "Future":
                return "error.validation.future";
            case "Past":
                return "error.validation.past";
            case "DecimalMin":
                return "error.validation.decimal.min";
            case "DecimalMax":
                return "error.validation.decimal.max";
            default:
                return "error.validation.generic";
        }
    }

    /**
     * Get localized error message for specific validation scenarios
     */
    public String getPasswordValidationMessage(String field, Object value, Locale locale) {
        if (value == null || value.toString().length() < 8) {
            return messageSource.getMessage("error.validation.password.length", null, locale);
        }
        return null;
    }

    /**
     * Get localized error message for file validation
     */
    public String getFileValidationMessage(String errorType, Object[] args, Locale locale) {
        String messageKey = "error.validation.file." + errorType;
        return messageSource.getMessage(messageKey, args, locale);
    }

    /**
     * Get localized success message
     */
    public String getSuccessMessage(String operation, Locale locale) {
        String messageKey = "success." + operation;
        return messageSource.getMessage(messageKey, null, locale);
    }

    /**
     * Get localized success message with current locale
     */
    public String getSuccessMessage(String operation) {
        return getSuccessMessage(operation, LocaleContextHolder.getLocale());
    }

    /**
     * Get localized confirmation message
     */
    public String getConfirmationMessage(String action, Locale locale) {
        String messageKey = "confirm." + action;
        return messageSource.getMessage(messageKey, null, locale);
    }

    /**
     * Get localized confirmation message with current locale
     */
    public String getConfirmationMessage(String action) {
        return getConfirmationMessage(action, LocaleContextHolder.getLocale());
    }

    /**
     * Get localized error message for business logic errors
     */
    public String getBusinessErrorMessage(String errorCode, Object[] args, Locale locale) {
        String messageKey = "error.business." + errorCode;
        try {
            return messageSource.getMessage(messageKey, args, locale);
        } catch (Exception e) {
            return messageSource.getMessage("error.generic", null, locale);
        }
    }

    /**
     * Get localized error message for business logic errors with current locale
     */
    public String getBusinessErrorMessage(String errorCode, Object... args) {
        return getBusinessErrorMessage(errorCode, args, LocaleContextHolder.getLocale());
    }

    /**
     * Get culturally appropriate error message format
     */
    public String formatErrorMessage(String message, Locale locale) {
        String language = locale.getLanguage();

        switch (language) {
            case "vi":
                // Vietnamese: More formal and polite error messages
                return "Xin lỗi, " + message.toLowerCase() + ". Vui lòng thử lại.";
            case "ja":
                // Japanese: Very polite and formal
                return "申し訳ございませんが、" + message + "。もう一度お試しください。";
            default:
                return message;
        }
    }

    /**
     * Get culturally appropriate success message format
     */
    public String formatSuccessMessage(String message, Locale locale) {
        String language = locale.getLanguage();

        switch (language) {
            case "vi":
                // Vietnamese: Positive and encouraging
                return message + " thành công!";
            case "ja":
                // Japanese: Formal and respectful
                return message + "が正常に完了しました。";
            default:
                return message;
        }
    }
}