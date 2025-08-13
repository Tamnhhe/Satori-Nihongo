package com.satori.platform.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.domain.enumeration.AuditAction;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.service.AuditLogService;
import com.satori.platform.service.dto.OAuth2ErrorResponse;
import com.satori.platform.service.exception.OAuth2AccountLinkingException;
import com.satori.platform.service.exception.OAuth2AuthenticationException;
import com.satori.platform.service.exception.OAuth2ProviderDisabledException;
import com.satori.platform.service.exception.OAuth2TokenExpiredException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;

/**
 * OAuth2 authentication failure handler that processes failed OAuth2
 * authentication,
 * provides comprehensive error handling, and logs security events.
 */
@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public OAuth2AuthenticationFailureHandler(
            AuditLogService auditLogService,
            ObjectMapper objectMapper) {
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        log.warn("OAuth2 authentication failed: {}", exception.getMessage());

        String provider = extractProviderFromRequest(request);
        OAuth2Provider oAuth2Provider = parseProvider(provider);

        // Determine error details based on exception type
        ErrorDetails errorDetails = determineErrorDetails(exception);

        // Log authentication failure event
        logAuthenticationFailure(oAuth2Provider, errorDetails, exception);

        // Create error response
        OAuth2ErrorResponse errorResponse = createErrorResponse(
                errorDetails, oAuth2Provider, request.getRequestURI());

        // Set response headers and status
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(errorDetails.httpStatus);

        // Write JSON response
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        response.getWriter().flush();

        log.info("OAuth2 authentication failure response sent for provider: {} with error: {}",
                provider, errorDetails.error);
    }

    /**
     * Determine error details based on exception type.
     */
    private ErrorDetails determineErrorDetails(AuthenticationException exception) {
        // Check for Spring Security OAuth2 exceptions first
        if (exception instanceof org.springframework.security.oauth2.core.OAuth2AuthenticationException springOAuth2Exception) {
            OAuth2Error error = springOAuth2Exception.getError();
            return new ErrorDetails(
                    error.getErrorCode(),
                    error.getDescription(),
                    HttpServletResponse.SC_UNAUTHORIZED);
        }

        // Check for custom OAuth2 exceptions by examining the cause or message
        Throwable cause = exception.getCause();
        String message = exception.getMessage();

        if (cause instanceof com.satori.platform.service.exception.OAuth2AuthenticationException oAuth2Exception) {
            return handleCustomOAuth2AuthenticationException(oAuth2Exception);
        } else if (cause instanceof com.satori.platform.service.exception.OAuth2AccountLinkingException) {
            return new ErrorDetails(
                    "account_linking_failed",
                    cause.getMessage(),
                    HttpServletResponse.SC_CONFLICT);
        } else if (cause instanceof com.satori.platform.service.exception.OAuth2ProviderDisabledException) {
            return new ErrorDetails(
                    "provider_disabled",
                    cause.getMessage(),
                    HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        } else if (cause instanceof com.satori.platform.service.exception.OAuth2TokenExpiredException) {
            return new ErrorDetails(
                    "token_expired",
                    cause.getMessage(),
                    HttpServletResponse.SC_UNAUTHORIZED);
        }

        // Check message content for specific error types
        if (message != null) {
            if (message.contains("account_linking_failed") || message.contains("Account already linked")) {
                return new ErrorDetails(
                        "account_linking_failed",
                        message,
                        HttpServletResponse.SC_CONFLICT);
            } else if (message.contains("provider_disabled") || message.contains("OAuth2 provider is disabled")) {
                return new ErrorDetails(
                        "provider_disabled",
                        message,
                        HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            } else if (message.contains("token_expired") || message.contains("Token expired")) {
                return new ErrorDetails(
                        "token_expired",
                        message,
                        HttpServletResponse.SC_UNAUTHORIZED);
            }
        }

        // Default error handling
        return new ErrorDetails(
                "authentication_failed",
                "OAuth2 authentication failed: " + exception.getMessage(),
                HttpServletResponse.SC_UNAUTHORIZED);
    }

    /**
     * Handle OAuth2AuthenticationException and determine appropriate error
     * response.
     */
    private ErrorDetails handleCustomOAuth2AuthenticationException(
            com.satori.platform.service.exception.OAuth2AuthenticationException exception) {
        String errorCode = exception.getErrorCode();

        return switch (errorCode) {
            case "access_denied" -> new ErrorDetails(
                    "access_denied",
                    "User denied access to the application",
                    HttpServletResponse.SC_FORBIDDEN);
            case "invalid_request" -> new ErrorDetails(
                    "invalid_request",
                    "Invalid OAuth2 request parameters",
                    HttpServletResponse.SC_BAD_REQUEST);
            case "invalid_client" -> new ErrorDetails(
                    "invalid_client",
                    "Invalid OAuth2 client configuration",
                    HttpServletResponse.SC_UNAUTHORIZED);
            case "invalid_grant" -> new ErrorDetails(
                    "invalid_grant",
                    "Invalid authorization grant",
                    HttpServletResponse.SC_BAD_REQUEST);
            case "unsupported_response_type" -> new ErrorDetails(
                    "unsupported_response_type",
                    "Unsupported OAuth2 response type",
                    HttpServletResponse.SC_BAD_REQUEST);
            case "invalid_scope" -> new ErrorDetails(
                    "invalid_scope",
                    "Invalid OAuth2 scope",
                    HttpServletResponse.SC_BAD_REQUEST);
            case "server_error" -> new ErrorDetails(
                    "server_error",
                    "OAuth2 provider server error",
                    HttpServletResponse.SC_BAD_GATEWAY);
            case "temporarily_unavailable" -> new ErrorDetails(
                    "temporarily_unavailable",
                    "OAuth2 provider temporarily unavailable",
                    HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            default -> new ErrorDetails(
                    "authentication_failed",
                    exception.getMessage(),
                    HttpServletResponse.SC_UNAUTHORIZED);
        };
    }

    /**
     * Parse OAuth2Provider from string, handling unknown providers gracefully.
     */
    private OAuth2Provider parseProvider(String provider) {
        try {
            return OAuth2Provider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Unknown OAuth2 provider: {}", provider);
            return null;
        }
    }

    /**
     * Create OAuth2ErrorResponse from error details.
     */
    private OAuth2ErrorResponse createErrorResponse(ErrorDetails errorDetails, OAuth2Provider provider, String path) {
        OAuth2ErrorResponse errorResponse = new OAuth2ErrorResponse();
        errorResponse.setError(errorDetails.error);
        errorResponse.setErrorDescription(errorDetails.description);
        errorResponse.setProvider(provider);
        errorResponse.setTimestamp(Instant.now());
        errorResponse.setPath(path);
        return errorResponse;
    }

    /**
     * Log OAuth2 authentication failure event.
     */
    private void logAuthenticationFailure(OAuth2Provider provider, ErrorDetails errorDetails,
            AuthenticationException exception) {
        String providerName = provider != null ? provider.name() : "UNKNOWN";
        String description = String.format("OAuth2 authentication failed for provider %s: %s",
                providerName, errorDetails.error);

        // Log failed login attempt
        auditLogService.logFailedOperation(
                AuditAction.LOGIN_FAILED,
                "ANONYMOUS",
                null,
                description,
                getClientIpAddress());

        // Log security violation for suspicious activities
        if (isSuspiciousActivity(errorDetails.error)) {
            auditLogService.logSecurityViolation(
                    String.format("Suspicious OAuth2 activity detected: %s", errorDetails.error),
                    getClientIpAddress());
        }
    }

    /**
     * Determine if the error indicates suspicious activity.
     */
    private boolean isSuspiciousActivity(String errorCode) {
        return "invalid_client".equals(errorCode) ||
                "invalid_grant".equals(errorCode) ||
                "invalid_request".equals(errorCode) ||
                errorCode.contains("csrf") ||
                errorCode.contains("state");
    }

    /**
     * Extract OAuth2 provider from request path.
     */
    private String extractProviderFromRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path.contains("/oauth2/")) {
            String[] pathParts = path.split("/");
            for (int i = 0; i < pathParts.length - 1; i++) {
                if ("oauth2".equals(pathParts[i]) && i + 1 < pathParts.length) {
                    return pathParts[i + 1];
                }
            }
        }
        return "unknown";
    }

    /**
     * Inner class to hold error details.
     */
    private static class ErrorDetails {
        final String error;
        final String description;
        final int httpStatus;

        ErrorDetails(String error, String description, int httpStatus) {
            this.error = error;
            this.description = description;
            this.httpStatus = httpStatus;
        }
    }

    /**
     * Get client IP address from request context.
     */
    private String getClientIpAddress() {
        // In a real implementation, you would extract this from the HttpServletRequest
        // For now, return a placeholder
        return "127.0.0.1";
    }
}