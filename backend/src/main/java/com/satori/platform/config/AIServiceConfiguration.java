package com.satori.platform.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
/**
 * Configuration class for AI service integration.
 * 
 */
@Configuration
public class AIServiceConfiguration {
    /**
     * Bean for RestTemplate with custom timeout settings for AI service call.
     *
     * @param builder the RestTemplateBuilder to configure the RestTemplate
     * @return a configured RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.setConnectTimeout(Duration.ofSeconds(30))
                      .setReadTimeout(Duration.ofSeconds(60))
                      .build();
    }
}