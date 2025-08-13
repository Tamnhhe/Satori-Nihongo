package com.satori.platform.web.rest;

import com.satori.platform.config.OAuth2Properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Diagnostic controller to help debug OAuth2 configuration.
 */
@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Autowired
    private OAuth2Properties oauth2Properties;

    @GetMapping("/oauth2-config")
    public Map<String, Object> getOAuth2Config() {
        Map<String, Object> result = new HashMap<>();
        
        result.put("enabled", oauth2Properties.isEnabled());
        result.put("redirectBaseUrl", oauth2Properties.getRedirectBaseUrl());
        result.put("providerCount", oauth2Properties.getProviders().size());
        result.put("providerNames", oauth2Properties.getProviders().keySet());
        
        Map<String, Object> providers = new HashMap<>();
        oauth2Properties.getProviders().forEach((key, config) -> {
            Map<String, Object> providerInfo = new HashMap<>();
            providerInfo.put("enabled", config.isEnabled());
            providerInfo.put("clientId", config.getClientId());
            providerInfo.put("hasClientSecret", config.getClientSecret() != null && !config.getClientSecret().isEmpty());
            providerInfo.put("scope", config.getScope());
            providers.put(key, providerInfo);
        });
        result.put("providers", providers);
        
        return result;
    }
}
