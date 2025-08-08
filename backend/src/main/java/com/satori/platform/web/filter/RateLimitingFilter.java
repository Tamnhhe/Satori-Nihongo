package com.satori.platform.web.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.security.RateLimitingService;
import com.satori.platform.service.AuditLogService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Filter for rate limiting HTTP requests.
 */
@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    private final RateLimitingService rateLimitingService;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(RateLimitingService rateLimitingService,
            AuditLogService auditLogService,
            ObjectMapper objectMapper) {
        this.rateLimitingService = rateLimitingService;
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String clientId = getClientIdentifier(httpRequest);
        RateLimitingService.RateLimitType limitType = determineRateLimitType(httpRequest);

        // Check rate limit
        if (!rateLimitingService.isRequestAllowed(clientId, limitType)) {
            handleRateLimitExceeded(httpRequest, httpResponse, clientId, limitType);
            return;
        }

        // Add rate limit headers
        addRateLimitHeaders(httpResponse, clientId, limitType);

        chain.doFilter(request, response);
    }

    private String getClientIdentifier(HttpServletRequest request) {
        // Try to get user-specific identifier first
        String username = request.getRemoteUser();
        if (username != null) {
            return "user:" + username;
        }

        // Fall back to IP address
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return "ip:" + xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return "ip:" + xRealIp;
        }

        return "ip:" + request.getRemoteAddr();
    }

    private RateLimitingService.RateLimitType determineRateLimitType(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (uri.contains("/api/authenticate") || uri.contains("/api/register")) {
            return RateLimitingService.RateLimitType.AUTH;
        }

        if (uri.contains("/api/file") && "POST".equals(method)) {
            return RateLimitingService.RateLimitType.FILE_UPLOAD;
        }

        if (uri.contains("/api/quiz") && "POST".equals(method) && uri.contains("submit")) {
            return RateLimitingService.RateLimitType.QUIZ_SUBMISSION;
        }

        if (uri.contains("/api/notification")) {
            return RateLimitingService.RateLimitType.NOTIFICATION;
        }

        if (uri.startsWith("/api/")) {
            return RateLimitingService.RateLimitType.API;
        }

        return RateLimitingService.RateLimitType.DEFAULT;
    }

    private void handleRateLimitExceeded(HttpServletRequest request, HttpServletResponse response,
            String clientId, RateLimitingService.RateLimitType limitType)
            throws IOException {

        RateLimitingService.RateLimitStatus status = rateLimitingService.getRateLimitStatus(clientId, limitType);

        // Log the rate limit violation
        auditLogService.logSecurityViolation(
                "Rate limit exceeded for " + limitType + " by " + clientId,
                "URI: " + request.getRequestURI() + ", Method: " + request.getMethod());

        response.setStatus(429); // HTTP 429 Too Many Requests
        response.setContentType("application/json");

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "RATE_LIMIT_EXCEEDED");
        errorResponse.put("message", "Too many requests. Please try again later.");
        errorResponse.put("type", limitType.name());

        if (status.isBanned()) {
            errorResponse.put("banned", true);
            errorResponse.put("banExpiry", status.getBanExpiry());
            response.setHeader("Retry-After", "900"); // 15 minutes
        } else {
            errorResponse.put("banned", false);
            response.setHeader("Retry-After", "60"); // 1 minute
        }

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));

        log.warn("Rate limit exceeded for {} on {} {}", clientId, request.getMethod(), request.getRequestURI());
    }

    private void addRateLimitHeaders(HttpServletResponse response, String clientId,
            RateLimitingService.RateLimitType limitType) {
        try {
            RateLimitingService.RateLimitStatus status = rateLimitingService.getRateLimitStatus(clientId, limitType);
            response.setHeader("X-RateLimit-Remaining", String.valueOf(status.getRemainingRequests()));
            response.setHeader("X-RateLimit-Type", limitType.name());
        } catch (Exception e) {
            log.debug("Failed to add rate limit headers", e);
        }
    }
}