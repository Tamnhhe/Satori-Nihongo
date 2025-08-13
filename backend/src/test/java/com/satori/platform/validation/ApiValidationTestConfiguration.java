package com.satori.platform.validation;

import com.satori.platform.config.AsyncSyncConfiguration;
import com.satori.platform.config.EmbeddedSQL;
import com.satori.platform.config.JacksonConfiguration;
import com.satori.platform.OnlineSatoriPlatformApp;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Base composite annotation for comprehensive API validation tests.
 * This annotation configures the complete test environment including:
 * - Spring Boot application context with all configurations
 * - Embedded test database with all Liquibase migrations
 * - Test security context and authentication
 * - Test data fixtures and cleanup
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = {
        OnlineSatoriPlatformApp.class,
        JacksonConfiguration.class,
        AsyncSyncConfiguration.class,
        ApiValidationTestConfiguration.TestConfig.class
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EmbeddedSQL
@ActiveProfiles({ "test", "api-validation" })
@TestPropertySource(properties = {
        "spring.liquibase.contexts=test,api-validation",
        "spring.jpa.hibernate.ddl-auto=validate",
        "logging.level.com.satori.platform.validation=DEBUG",
        "jhipster.security.authentication.jwt.token-validity-in-seconds=86400"
})
@Transactional
public @interface ApiValidationTestConfiguration {

    @org.springframework.boot.test.context.TestConfiguration
    class TestConfig {
        // Additional test configuration beans will be added here
    }
}