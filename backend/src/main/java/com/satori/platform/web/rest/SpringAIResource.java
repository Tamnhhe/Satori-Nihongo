package com.satori.platform.web.rest;

import com.satori.platform.service.SpringAIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for testing Spring AI functionality.
 * 
 * This controller provides endpoints to test the Spring AI implementation
 * and compare it with existing LangChain4J functionality.
 * 
 * @author Satori Platform Team
 */
@RestController
@RequestMapping("/api/spring-ai")
@ConditionalOnProperty(prefix = "app.ai.spring-ai", name = "enabled", havingValue = "true", matchIfMissing = false)
public class SpringAIResource {

    private static final Logger log = LoggerFactory.getLogger(SpringAIResource.class);

    private final SpringAIService springAIService;

    public SpringAIResource(SpringAIService springAIService) {
        this.springAIService = springAIService;
    }

    /**
     * Test basic chat functionality with Spring AI.
     * 
     * @param prompt the user prompt
     * @return the AI response
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        try {
            String prompt = request.get("prompt");
            if (prompt == null || prompt.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Prompt is required"));
            }

            log.info("Processing Spring AI chat request: {}", prompt);
            
            String response = springAIService.generateResponse(prompt);
            
            return ResponseEntity.ok(Map.of(
                "prompt", prompt,
                "response", response,
                "provider", "Spring AI"
            ));
            
        } catch (Exception e) {
            log.error("Error processing chat request", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to process request: " + e.getMessage()));
        }
    }

    /**
     * Test RAG functionality with Spring AI.
     * 
     * @param request containing question and optional topK parameter
     * @return the RAG-enhanced response
     */
    @PostMapping("/rag")
    public ResponseEntity<Map<String, Object>> ragQuery(@RequestBody Map<String, Object> request) {
        try {
            String question = (String) request.get("question");
            Integer topK = (Integer) request.getOrDefault("topK", 5);
            
            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Question is required"));
            }

            log.info("Processing Spring AI RAG request: {}", question);
            
            String response = springAIService.generateRAGResponse(question, topK);
            
            return ResponseEntity.ok(Map.of(
                "question", question,
                "response", response,
                "topK", topK,
                "provider", "Spring AI RAG"
            ));
            
        } catch (Exception e) {
            log.error("Error processing RAG request", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to process RAG request: " + e.getMessage()));
        }
    }

    /**
     * Search for similar documents in the vector store.
     * 
     * @param request containing query and optional topK parameter
     * @return list of similar documents
     */
    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> searchDocuments(@RequestBody Map<String, Object> request) {
        try {
            String query = (String) request.get("query");
            Integer topK = (Integer) request.getOrDefault("topK", 5);
            
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Query is required"));
            }

            log.info("Processing Spring AI document search: {}", query);
            
            List<Document> documents = springAIService.searchSimilarDocuments(query, topK);
            
            return ResponseEntity.ok(Map.of(
                "query", query,
                "documents", documents,
                "count", documents.size(),
                "provider", "Spring AI Vector Store"
            ));
            
        } catch (Exception e) {
            log.error("Error processing document search", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to search documents: " + e.getMessage()));
        }
    }

    /**
     * Add a document to the vector store.
     * 
     * @param request containing content and optional metadata
     * @return success response
     */
    @PostMapping("/documents")
    public ResponseEntity<Map<String, String>> addDocument(@RequestBody Map<String, Object> request) {
        try {
            String content = (String) request.get("content");
            @SuppressWarnings("unchecked")
            Map<String, Object> metadata = (Map<String, Object>) request.get("metadata");
            
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Content is required"));
            }

            log.info("Adding document to Spring AI vector store");
            
            springAIService.addDocument(content, metadata);
            
            return ResponseEntity.ok(Map.of(
                "message", "Document added successfully",
                "provider", "Spring AI Vector Store"
            ));
            
        } catch (Exception e) {
            log.error("Error adding document", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to add document: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint for Spring AI service.
     * 
     * @return health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            boolean isHealthy = springAIService.isHealthy();
            
            return ResponseEntity.ok(Map.of(
                "status", isHealthy ? "healthy" : "unhealthy",
                "provider", "Spring AI",
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("Health check failed", e);
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "status", "error",
                    "error", e.getMessage(),
                    "provider", "Spring AI"
                ));
        }
    }
}
