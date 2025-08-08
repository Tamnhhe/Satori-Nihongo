package com.satori.platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for notification services.
 */
@Configuration
@EnableAsync
@EnableScheduling
public class NotificationConfiguration {

    /**
     * RestTemplate bean for HTTP requests (used by PushNotificationService)
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Configuration properties for Firebase
     */
    @ConfigurationProperties(prefix = "app.firebase")
    public static class FirebaseProperties {
        private String serverKey;
        private String fcmUrl = "https://fcm.googleapis.com/fcm/send";

        public String getServerKey() {
            return serverKey;
        }

        public void setServerKey(String serverKey) {
            this.serverKey = serverKey;
        }

        public String getFcmUrl() {
            return fcmUrl;
        }

        public void setFcmUrl(String fcmUrl) {
            this.fcmUrl = fcmUrl;
        }
    }
}