package com.satori.platform.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.satori.platform.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * Configuration for JWT encoding and decoding.
 */
@Configuration
public class JWTConfiguration {

    @Value("${jhipster.security.authentication.jwt.base64-secret}")
    private String jwtSecret;

    @Bean
    public JwtEncoder jwtEncoder() {
        byte[] secretKey = Base64.getDecoder().decode(jwtSecret);
        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        byte[] secretKey = Base64.getDecoder().decode(jwtSecret);
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey, SecurityUtils.JWT_ALGORITHM.getName());
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(SecurityUtils.JWT_ALGORITHM)
                .build();
    }
}