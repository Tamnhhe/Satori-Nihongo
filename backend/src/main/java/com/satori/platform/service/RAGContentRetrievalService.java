package com.satori.platform.service;

import com.satori.platform.service.dto.RAGContentRequestDTO;
import com.satori.platform.service.dto.RAGContentResultDTO;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service for RAG-based content retrieval.
 * Integrates with vector databases and embedding services for semantic content
 * search.
 */
@Service
public class RAGContentRetrievalService {

    private static final Logger log = LoggerFactory.getLogger(RAGContentRetrievalService.class);

    private final java.util.Optional<SpringAIEmbeddingService> springAIEmbeddingService;
    private final GeminiEmbeddingService geminiEmbeddingService;
    private final PostgreSQLVectorService postgreSQLVectorService;

    @Value("${app.rag.enabled:false}")
    private boolean ragEnabled;

    @Value("${app.rag.embedding.provider:gemini}")
    private String embeddingProvider;

    @Value("${app.rag.vector-db.type:postgresql}")
    private String vectorDbType;

    public RAGContentRetrievalService(
        java.util.Optional<SpringAIEmbeddingService> springAIEmbeddingService,
        GeminiEmbeddingService geminiEmbeddingService,
        PostgreSQLVectorService postgreSQLVectorService
    ) {
        this.springAIEmbeddingService = springAIEmbeddingService;
        this.geminiEmbeddingService = geminiEmbeddingService;
        this.postgreSQLVectorService = postgreSQLVectorService;
    }

    /**
     * Retrieve relevant content using RAG approach.
     *
     * @param request the content retrieval request
     * @return list of relevant content pieces
     */
    public List<RAGContentResultDTO> retrieveRelevantContent(RAGContentRequestDTO request) {
        log.debug("Retrieving relevant content using RAG for query: {}", request.getQuery());

        if (!ragEnabled) {
            log.warn("RAG is disabled, returning empty results");
            return new ArrayList<>();
        }

        try {
            // Step 1: Generate embedding for the query using Gemini
            List<Double> queryEmbedding = springAIEmbeddingService
                .map(s -> s.generateEmbedding(request.getQuery()))
                .orElseGet(() -> geminiEmbeddingService.generateEmbedding(request.getQuery()));

            // Step 2: Search PostgreSQL vector database for similar content
            List<RAGContentResultDTO> results = postgreSQLVectorService.searchSimilarContent(queryEmbedding, request);

            log.info("Retrieved {} relevant content pieces for query: {}", results.size(), request.getQuery());
            return results;
        } catch (Exception e) {
            log.error("Failed to retrieve content using RAG: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Retrieve content specifically for weak areas.
     *
     * @param weakAreas list of weak areas
     * @param courseId  course context
     * @return relevant content for weak areas
     */
    public List<RAGContentResultDTO> retrieveContentForWeakAreas(List<String> weakAreas, Long courseId) {
        log.debug("Retrieving content for weak areas: {}", weakAreas);

        List<RAGContentResultDTO> allResults = new ArrayList<>();

        for (String weakArea : weakAreas) {
            RAGContentRequestDTO request = new RAGContentRequestDTO();
            request.setQuery(weakArea);
            request.setCourseId(courseId);
            request.setMaxResults(5); // Limit per weak area
            request.setSimilarityThreshold(0.6); // Lower threshold for weak areas

            List<RAGContentResultDTO> results = retrieveRelevantContent(request);
            allResults.addAll(results);
        }

        // Remove duplicates and limit total results
        return deduplicateAndLimit(allResults, 20);
    }

    /**
     * Retrieve examples and explanations for specific topics.
     *
     * @param topics          list of topics
     * @param difficultyLevel target difficulty level
     * @return relevant examples and explanations
     */
    public List<RAGContentResultDTO> retrieveExamplesAndExplanations(List<String> topics, String difficultyLevel) {
        log.debug("Retrieving examples and explanations for topics: {}", topics);

        List<RAGContentResultDTO> allResults = new ArrayList<>();

        for (String topic : topics) {
            RAGContentRequestDTO request = new RAGContentRequestDTO();
            request.setQuery(topic + " examples explanations");
            request.setDifficultyLevel(difficultyLevel);
            request.setMaxResults(3);

            List<RAGContentResultDTO> results = retrieveRelevantContent(request);
            allResults.addAll(results);
        }

        return deduplicateAndLimit(allResults, 15);
    }

    /**
     * Store content in the vector database for future retrieval.
     *
     * @param contentId       unique identifier
     * @param title           content title
     * @param content         the content text
     * @param contentType     type of content
     * @param source          source reference
     * @param difficultyLevel difficulty level
     * @param topics          list of topics
     * @param courseId        course ID
     * @param lessonId        lesson ID
     */
    public void storeContent(
        String contentId,
        String title,
        String content,
        String contentType,
        String source,
        String difficultyLevel,
        List<String> topics,
        Long courseId,
        Long lessonId
    ) {
        if (!ragEnabled) {
            log.debug("RAG is disabled, skipping content storage");
            return;
        }

        try {
            // Generate embedding for the content
            List<Double> embedding = springAIEmbeddingService
                .map(s -> s.generateEmbedding(content))
                .orElseGet(() -> geminiEmbeddingService.generateEmbedding(content));

            // Store in PostgreSQL vector database
            postgreSQLVectorService.storeContent(
                contentId,
                title,
                content,
                contentType,
                source,
                difficultyLevel,
                topics,
                courseId,
                lessonId,
                embedding
            );

            log.debug("Successfully stored content: {}", contentId);
        } catch (Exception e) {
            log.error("Failed to store content {}: {}", contentId, e.getMessage(), e);
        }
    }

    /**
     * Initialize the vector database.
     */
    public void initializeVectorDatabase() {
        if (!ragEnabled) {
            log.debug("RAG is disabled, skipping vector database initialization");
            return;
        }

        try {
            postgreSQLVectorService.initializeVectorDatabase();
            log.info("Vector database initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize vector database: {}", e.getMessage(), e);
        }
    }

    /**
     * Get vector database statistics.
     *
     * @return database statistics
     */
    public Map<String, Object> getDatabaseStats() {
        if (!ragEnabled) {
            return new HashMap<>();
        }

        return postgreSQLVectorService.getDatabaseStats();
    }

    // Private helper methods

    private List<RAGContentResultDTO> deduplicateAndLimit(List<RAGContentResultDTO> results, int limit) {
        Set<String> seenContentIds = new HashSet<>();
        List<RAGContentResultDTO> deduplicated = new ArrayList<>();

        for (RAGContentResultDTO result : results) {
            if (seenContentIds.add(result.getContentId()) && deduplicated.size() < limit) {
                deduplicated.add(result);
            }
        }

        return deduplicated;
    }
}
