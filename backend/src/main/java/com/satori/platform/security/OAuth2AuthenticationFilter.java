package com.satori.platform.security;

import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.service.OAuth2Service;
import com.satori.platform.service.dto.OAuth2AuthenticationResult;
import com.satori.platform.service.exception.OAuth2AuthenticationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StringUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;

/**
 * OAuth2 authentication filter that processes OAuth2 callback requests
 * and integrates with the existing JWT-based authentication system.
 */
public class OAuth2AuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFilter.class);

    private final OAuth2Service oAuth2Service;
    private final OAuth2StateValidator stateValidator;

    public OAuth2AuthenticationFilter(
            OAuth2Service oAuth2Service,
            OAuth2StateValidator stateValidator,
            AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher("/api/oauth2/callback/**"));
        this.oAuth2Service = oAuth2Service;
        this.stateValidator = stateValidator;
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request,
            HttpServletResponse response) throws AuthenticationException, IOException, ServletException {

        log.debug("Processing OAuth2 callback request: {}", request.getRequestURI());

        try {
            // Extract provider from URL path
            String provider = extractProviderFromPath(request.getRequestURI());
            if (!StringUtils.hasText(provider)) {
                throw new OAuth2AuthenticationException("Invalid OAuth2 provider in callback URL",
                        OAuth2Provider.GOOGLE, "INVALID_PROVIDER");
            }

            // Extract authorization code and state from request
            String code = request.getParameter("code");
            String state = request.getParameter("state");
            String error = request.getParameter("error");

            OAuth2Provider oAuth2Provider = OAuth2Provider.valueOf(provider.toUpperCase());

            // Check for OAuth2 provider errors
            if (StringUtils.hasText(error)) {
                String errorDescription = request.getParameter("error_description");
                throw new OAuth2AuthenticationException(
                        String.format("OAuth2 provider error: %s - %s", error, errorDescription),
                        oAuth2Provider, error);
            }

            // Validate required parameters
            if (!StringUtils.hasText(code)) {
                throw new OAuth2AuthenticationException("Authorization code is missing",
                        oAuth2Provider, "MISSING_CODE");
            }

            if (!StringUtils.hasText(state)) {
                throw new OAuth2AuthenticationException("State parameter is missing",
                        oAuth2Provider, "MISSING_STATE");
            }

            // Validate state parameter for CSRF protection
            if (!stateValidator.validateState(request, state)) {
                throw new OAuth2AuthenticationException("Invalid state parameter - possible CSRF attack",
                        oAuth2Provider, "INVALID_STATE");
            }

            // Process OAuth2 authentication
            OAuth2AuthenticationResult authResult = oAuth2Service.handleCallback(oAuth2Provider, code, state);

            // Create OAuth2 user principal
            Map<String, Object> attributes = Map.of(
                    "sub", authResult.getUserProfile().getId(),
                    "email", authResult.getUserProfile().getEmail(),
                    "name", authResult.getUserProfile().getDisplayName(),
                    "picture",
                    authResult.getUserProfile().getProfilePictureUrl() != null
                            ? authResult.getUserProfile().getProfilePictureUrl()
                            : "");

            OAuth2User oAuth2User = new DefaultOAuth2User(
                    Collections.emptyList(),
                    attributes,
                    "sub");

            // Create authentication token
            OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                    oAuth2User,
                    Collections.emptyList(),
                    provider);

            log.info("OAuth2 authentication successful for user: {} (provider: {})",
                    authResult.getUser().getLogin(), provider);

            return authToken;

        } catch (OAuth2AuthenticationException e) {
            // Re-throw OAuth2 specific exceptions
            throw e;
        } catch (Exception e) {
            log.error("OAuth2 authentication failed", e);
            throw new OAuth2AuthenticationException("OAuth2 authentication failed: " + e.getMessage(),
                    OAuth2Provider.GOOGLE, "AUTHENTICATION_FAILED", e);
        }
    }

    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult) throws IOException, ServletException {

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authResult);

        // Continue with success handler
        getSuccessHandler().onAuthenticationSuccess(request, response, authResult);
    }

    @Override
    protected void unsuccessfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {

        // Clear security context
        SecurityContextHolder.clearContext();

        // Continue with failure handler
        getFailureHandler().onAuthenticationFailure(request, response, failed);
    }

    /**
     * Extract OAuth2 provider from callback URL path.
     */
    private String extractProviderFromPath(String path) {
        if (path.contains("/api/oauth2/callback/")) {
            String[] pathParts = path.split("/");
            for (int i = 0; i < pathParts.length - 1; i++) {
                if ("callback".equals(pathParts[i]) && i + 1 < pathParts.length) {
                    return pathParts[i + 1];
                }
            }
        }
        return null;
    }
}