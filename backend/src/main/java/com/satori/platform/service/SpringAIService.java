package com.satori.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service for Spring AI-powered content analysis and question generation.
 * 
 * This service provides an alternative implementation to LangChain4J using Spring AI.
 * It can be used side-by-side with the existing AI services during migration.
 * 
 * @author Satori Platform Team
 */
@Service
@ConditionalOnProperty(prefix = "app.ai.spring-ai", name = "enabled", havingValue = "true", matchIfMissing = false)
public class SpringAIService {

    private static final Logger log = LoggerFactory.getLogger(SpringAIService.class);

    private final ChatClient chatClient;
    private final ChatClient ragChatClient;
    private final VectorStore vectorStore;

    public SpringAIService(ChatClient chatClient, 
                          ChatClient ragChatClient, 
                          VectorStore vectorStore) {
        this.chatClient = chatClient;
        this.ragChatClient = ragChatClient;
        this.vectorStore = vectorStore;
        log.info("Spring AI Service initialized successfully");
    }

    /**
     * Generates a simple response using Spring AI ChatClient.
     * 
     * @param prompt the user prompt
     * @return the AI-generated response
     */
    public String generateResponse(String prompt) {
        try {
            log.debug("Generating response for prompt: {}", prompt);
            
            String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();
            
            log.debug("Generated response: {}", response);
            return response;
            
        } catch (Exception e) {
            log.error("Error generating response with Spring AI", e);
            throw new RuntimeException("Failed to generate AI response", e);
        }
    }

    /**
     * Searches for similar documents in the vector store.
     * 
     * @param query the search query
     * @param topK number of top results to return
     * @return list of similar documents
     */
    public List<Document> searchSimilarDocuments(String query, int topK) {
        try {
            log.debug("Searching for documents similar to: {}", query);
            
            SearchRequest searchRequest = SearchRequest.builder()
                .query(query)
                .topK(topK)
                .similarityThreshold(0.7)
                .build();
            
            List<Document> documents = vectorStore.similaritySearch(searchRequest);
            log.debug("Found {} similar documents", documents.size());
            
            return documents;
            
        } catch (Exception e) {
            log.error("Error searching similar documents", e);
            throw new RuntimeException("Failed to search documents", e);
        }
    }

    /**
     * Generates a response with RAG (Retrieval Augmented Generation).
     * 
     * This method first searches for relevant documents, then uses them as context
     * for generating a more informed response.
     * 
     * @param question the user question
     * @param topK number of documents to retrieve for context
     * @return the RAG-enhanced response
     */
    public String generateRAGResponse(String question, int topK) {
        try {
            log.debug("Generating RAG response for question: {}", question);
            
            // First, search for relevant documents
            List<Document> relevantDocs = searchSimilarDocuments(question, topK);
            
            if (relevantDocs.isEmpty()) {
                log.warn("No relevant documents found for question: {}", question);
                return "I don't have enough context to answer this question accurately. Please try a different question or provide more specific details.";
            }
            
            // Build context from retrieved documents
            StringBuilder context = new StringBuilder();
            for (Document doc : relevantDocs) {
                context.append(doc.getText()).append("\n\n");
            }
            
            // Generate response with context
            String response = ragChatClient.prompt()
                .system("Use the following context to answer the user's question. Context: " + context.toString())
                .user(question)
                .call()
                .content();
            
            log.debug("Generated RAG response: {}", response);
            return response;
            
        } catch (Exception e) {
            log.error("Error generating RAG response", e);
            throw new RuntimeException("Failed to generate RAG response", e);
        }
    }

    /**
     * Adds a document to the vector store.
     * 
     * @param content the document content
     * @param metadata optional metadata for the document
     */
    public void addDocument(String content, Map<String, Object> metadata) {
        try {
            log.debug("Adding document to vector store: {}", content.substring(0, Math.min(100, content.length())));
            
            Document document = new Document(content, metadata != null ? metadata : Map.of());
            vectorStore.add(List.of(document));
            
            log.debug("Document added successfully");
            
        } catch (Exception e) {
            log.error("Error adding document to vector store", e);
            throw new RuntimeException("Failed to add document", e);
        }
    }

    /**
     * Health check method to verify Spring AI functionality.
     * 
     * @return true if the service is working properly
     */
    public boolean isHealthy() {
        try {
            String testResponse = chatClient.prompt()
                .user("Say 'Spring AI is working!'")
                .call()
                .content();
            
            return testResponse != null && !testResponse.trim().isEmpty();
            
        } catch (Exception e) {
            log.error("Health check failed for Spring AI service", e);
            return false;
        }
    }
}
