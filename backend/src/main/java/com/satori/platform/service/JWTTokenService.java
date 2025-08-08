package com.satori.platform.service;

import com.satori.platform.domain.User;
import com.satori.platform.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

/**
 * Service for creating JWT tokens.
 */
@Service
public class JWTTokenService {

    private final JwtEncoder jwtEncoder;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds:86400}")
    private long tokenValidityInSeconds;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds-for-remember-me:2592000}")
    private long tokenValidityInSecondsForRememberMe;

    public JWTTokenService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    /**
     * Create JWT token for user.
     *
     * @param user       the user
     * @param rememberMe whether to use extended validity
     * @return the JWT token
     */
    public String createToken(User user, boolean rememberMe) {
        long validity = rememberMe ? tokenValidityInSecondsForRememberMe : tokenValidityInSeconds;

        Instant now = Instant.now();
        Instant expiresAt = now.plus(validity, ChronoUnit.SECONDS);

        // Build authorities string
        String authorities = user.getAuthorities().stream()
                .map(authority -> authority.getName())
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(user.getLogin())
                .claim(SecurityUtils.AUTHORITIES_CLAIM, authorities)
                .claim(SecurityUtils.USER_ID_CLAIM, user.getId())
                .build();

        JwsHeader jwsHeader = JwsHeader.with(SecurityUtils.JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    /**
     * Create JWT token for user with default validity.
     *
     * @param user the user
     * @return the JWT token
     */
    public String createToken(User user) {
        return createToken(user, false);
    }

    /**
     * Get token validity in seconds.
     *
     * @param rememberMe whether to use extended validity
     * @return token validity in seconds
     */
    public long getTokenValidityInSeconds(boolean rememberMe) {
        return rememberMe ? tokenValidityInSecondsForRememberMe : tokenValidityInSeconds;
    }
}