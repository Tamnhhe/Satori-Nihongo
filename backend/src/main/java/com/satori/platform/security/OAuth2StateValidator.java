package com.satori.platform.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OAuth2 state parameter validator for CSRF protection.
 * Generates and validates state parameters to prevent CSRF attacks.
 */
@Component
public class OAuth2StateValidator {

    private static final Logger log = LoggerFactory.getLogger(OAuth2StateValidator.class);

    private static final String STATE_SESSION_ATTRIBUTE = "oauth2_state";
    private static final String STATE_TIMESTAMP_ATTRIBUTE = "oauth2_state_timestamp";
    private static final long STATE_VALIDITY_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    private final SecureRandom secureRandom;
    private final Map<String, StateInfo> stateCache;

    public OAuth2StateValidator() {
        this.secureRandom = new SecureRandom();
        this.stateCache = new ConcurrentHashMap<>();
    }

    /**
     * Generate a cryptographically secure state parameter.
     *
     * @param request the HTTP request
     * @return the generated state parameter
     */
    public String generateState(HttpServletRequest request) {
        // Generate random bytes
        byte[] stateBytes = new byte[32];
        secureRandom.nextBytes(stateBytes);
        String state = Base64.getUrlEncoder().withoutPadding().encodeToString(stateBytes);

        // Store state in session and cache
        HttpSession session = request.getSession(true);
        session.setAttribute(STATE_SESSION_ATTRIBUTE, state);
        session.setAttribute(STATE_TIMESTAMP_ATTRIBUTE, Instant.now().toEpochMilli());

        // Also store in cache for stateless validation
        stateCache.put(state, new StateInfo(session.getId(), Instant.now()));

        log.debug("Generated OAuth2 state parameter: {}", state);
        return state;
    }

    /**
     * Validate the state parameter to prevent CSRF attacks.
     *
     * @param request       the HTTP request
     * @param receivedState the state parameter received from OAuth2 provider
     * @return true if the state is valid, false otherwise
     */
    public boolean validateState(HttpServletRequest request, String receivedState) {
        if (!StringUtils.hasText(receivedState)) {
            log.warn("OAuth2 state parameter is missing");
            return false;
        }

        // Clean up expired states
        cleanupExpiredStates();

        // First try session-based validation
        if (validateStateFromSession(request, receivedState)) {
            return true;
        }

        // Fallback to cache-based validation for stateless scenarios
        return validateStateFromCache(receivedState);
    }

    /**
     * Validate state parameter from HTTP session.
     */
    private boolean validateStateFromSession(HttpServletRequest request, String receivedState) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            log.debug("No HTTP session found for state validation");
            return false;
        }

        String storedState = (String) session.getAttribute(STATE_SESSION_ATTRIBUTE);
        Long timestamp = (Long) session.getAttribute(STATE_TIMESTAMP_ATTRIBUTE);

        if (!StringUtils.hasText(storedState) || timestamp == null) {
            log.warn("OAuth2 state not found in session");
            return false;
        }

        // Check if state has expired
        if (Instant.now().toEpochMilli() - timestamp > STATE_VALIDITY_DURATION_MS) {
            log.warn("OAuth2 state parameter has expired");
            session.removeAttribute(STATE_SESSION_ATTRIBUTE);
            session.removeAttribute(STATE_TIMESTAMP_ATTRIBUTE);
            return false;
        }

        // Validate state parameter
        boolean isValid = storedState.equals(receivedState);
        if (isValid) {
            // Remove state from session after successful validation
            session.removeAttribute(STATE_SESSION_ATTRIBUTE);
            session.removeAttribute(STATE_TIMESTAMP_ATTRIBUTE);
            log.debug("OAuth2 state parameter validated successfully from session");
        } else {
            log.warn("OAuth2 state parameter mismatch. Expected: {}, Received: {}",
                    storedState, receivedState);
        }

        return isValid;
    }

    /**
     * Validate state parameter from cache (for stateless scenarios).
     */
    private boolean validateStateFromCache(String receivedState) {
        StateInfo stateInfo = stateCache.get(receivedState);
        if (stateInfo == null) {
            log.warn("OAuth2 state parameter not found in cache");
            return false;
        }

        // Check if state has expired
        if (Instant.now().toEpochMilli() - stateInfo.timestamp.toEpochMilli() > STATE_VALIDITY_DURATION_MS) {
            log.warn("OAuth2 state parameter has expired (cache)");
            stateCache.remove(receivedState);
            return false;
        }

        // Remove state from cache after successful validation
        stateCache.remove(receivedState);
        log.debug("OAuth2 state parameter validated successfully from cache");
        return true;
    }

    /**
     * Clean up expired state parameters from cache.
     */
    private void cleanupExpiredStates() {
        long currentTime = Instant.now().toEpochMilli();
        stateCache.entrySet().removeIf(
                entry -> currentTime - entry.getValue().timestamp.toEpochMilli() > STATE_VALIDITY_DURATION_MS);
    }

    /**
     * State information for cache storage.
     */
    private static class StateInfo {
        final String sessionId;
        final Instant timestamp;

        StateInfo(String sessionId, Instant timestamp) {
            this.sessionId = sessionId;
            this.timestamp = timestamp;
        }
    }
}