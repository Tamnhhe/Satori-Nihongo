package com.satori.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service for generating embeddings using Google Gemini API.
 */
@Service
public class GeminiEmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(GeminiEmbeddingService.class);

    private final RestTemplate restTemplate;

    @Value("${app.rag.embedding.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.rag.embedding.gemini.model:text-embedding-004}")
    private String geminiModel;

    @Value("${app.rag.embedding.gemini.base-url:https://generativelanguage.googleapis.com}")
    private String geminiBaseUrl;

    @Value("${app.rag.embedding.gemini.dimensions:768}")
    private int embeddingDimensions;

    public GeminiEmbeddingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Generate embedding for a single text using Gemini API.
     *
     * @param text the text to embed
     * @return the embedding vector
     */
    public List<Double> generateEmbedding(String text) {
        log.debug("Generating Gemini embedding for text of length: {}", text.length());

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            log.warn("Gemini API key not configured, using mock embedding");
            return generateMockEmbedding(text);
        }

        try {
            String url = String.format("%s/v1/models/%s:embedContent?key=%s",
                    geminiBaseUrl, geminiModel, geminiApiKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();

            // Gemini API request format
            Map<String, Object> content = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", text);
            parts.add(part);
            content.put("parts", parts);

            requestBody.put("content", content);
            requestBody.put("model", "models/" + geminiModel);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                    url, entity,
                    (Class<Map<String, Object>>) (Class<?>) Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseGeminiEmbeddingResponse(response.getBody());
            }

            throw new RuntimeException("Failed to generate Gemini embedding: " + response.getStatusCode());

        } catch (Exception e) {
            log.warn("Failed to generate Gemini embedding, using mock: {}", e.getMessage());
            return generateMockEmbedding(text);
        }
    }

    /**
     * Generate embeddings for multiple texts in batch.
     *
     * @param texts the texts to embed
     * @return list of embedding vectors
     */
    public List<List<Double>> generateEmbeddings(List<String> texts) {
        log.debug("Generating Gemini embeddings for {} texts", texts.size());

        List<List<Double>> embeddings = new ArrayList<>();

        // Gemini API doesn't support batch embedding in the same way as OpenAI
        // So we'll process them individually
        for (String text : texts) {
            embeddings.add(generateEmbedding(text));
        }

        return embeddings;
    }

    /**
     * Get the embedding dimensions for this model.
     *
     * @return the number of dimensions
     */
    public int getEmbeddingDimensions() {
        return embeddingDimensions;
    }

    /**
     * Check if the service is properly configured.
     *
     * @return true if configured
     */
    public boolean isConfigured() {
        return geminiApiKey != null && !geminiApiKey.trim().isEmpty();
    }

    // Private helper methods

    private List<Double> parseGeminiEmbeddingResponse(Map<String, Object> response) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> embedding = (Map<String, Object>) response.get("embedding");

            if (embedding != null && embedding.containsKey("values")) {
                @SuppressWarnings("unchecked")
                List<Double> values = (List<Double>) embedding.get("values");

                if (values != null && !values.isEmpty()) {
                    return values;
                }
            }

            throw new RuntimeException("Invalid Gemini embedding response format");

        } catch (Exception e) {
            log.error("Failed to parse Gemini embedding response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse Gemini embedding response", e);
        }
    }

    private List<Double> generateMockEmbedding(String text) {
        // Generate a simple mock embedding based on text hash
        Random random = new Random(text.hashCode());
        List<Double> embedding = new ArrayList<>();

        for (int i = 0; i < embeddingDimensions; i++) {
            embedding.add(random.nextGaussian());
        }

        return embedding;
    }
}