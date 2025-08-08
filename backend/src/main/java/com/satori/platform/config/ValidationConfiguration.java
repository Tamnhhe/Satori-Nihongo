package com.satori.platform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

import jakarta.validation.Validator;

/**
 * Configuration for input validation and sanitization.
 */
@Configuration
public class ValidationConfiguration {

    /**
     * Bean for creating a Validator instance.
     *
     * @return a Validator instance
     */
    @Bean
    public Validator validator() {
        return new LocalValidatorFactoryBean();
    }

    /**
     * Bean for creating a MethodValidationPostProcessor instance.
     * This bean is used to enable method-level validation in Spring applications.
     *
     * @return a MethodValidationPostProcessor instance
     */
    @Bean
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        MethodValidationPostProcessor processor = new MethodValidationPostProcessor();
        processor.setValidator(validator());
        return processor;
    }
}
