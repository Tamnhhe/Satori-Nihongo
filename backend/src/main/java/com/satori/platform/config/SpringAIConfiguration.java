package com.satori.platform.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuration class for Spring AI integration.
 * 
 * This configuration sets up Spring AI components to work alongside existing LangChain4J setup.
 * It provides a gradual migration path from LangChain4J to Spring AI.
 * 
 * @author Satori Platform Team
 */
@Configuration
@ConditionalOnProperty(prefix = "app.ai.spring-ai", name = "enabled", havingValue = "true", matchIfMissing = false)
public class SpringAIConfiguration {

    @Value("${app.ai.spring-ai.provider:openai}")
    private String preferredProvider;

    /**
     * Creates a ChatClient bean for Spring AI interactions.
     * 
     * This ChatClient can be used for simple chat interactions and will be extended
     * for RAG functionality in the next phase of migration.
     *
     * @param openAiChatModel the OpenAI chat model
     * @param ollamaChatModel the Ollama chat model
     * @return a configured ChatClient instance
     */
    @Bean
    @ConditionalOnProperty(prefix = "app.ai.spring-ai", name = "enabled", havingValue = "true")
    public ChatClient chatClient(
            @Qualifier("openAiChatModel") ChatModel openAiChatModel,
            @Qualifier("ollamaChatModel") ChatModel ollamaChatModel) {
        ChatModel selectedModel = "ollama".equals(preferredProvider) ? ollamaChatModel : openAiChatModel;
        return ChatClient.builder(selectedModel)
                .defaultSystem("You are a helpful AI assistant for the Satori Japanese Learning Platform. " +
                              "Provide accurate, educational responses about Japanese language learning.")
                .build();
    }

    /**
     * Creates a RAG-enabled ChatClient for document-based question answering.
     * 
     * This bean is only created when both Spring AI and vector store are enabled.
     * It integrates with the vector store for Retrieval Augmented Generation.
     *
     * @param openAiChatModel the OpenAI chat model
     * @param ollamaChatModel the Ollama chat model
     * @param vectorStore the vector store for document retrieval
     * @return a RAG-enabled ChatClient instance
     */
    @Bean
    @ConditionalOnProperty(prefix = "app.ai.spring-ai.rag", name = "enabled", havingValue = "true")
    public ChatClient ragChatClient(
            @Qualifier("openAiChatModel") ChatModel openAiChatModel,
            @Qualifier("ollamaChatModel") ChatModel ollamaChatModel,
            VectorStore vectorStore) {
        ChatModel selectedModel = "ollama".equals(preferredProvider) ? ollamaChatModel : openAiChatModel;
        return ChatClient.builder(selectedModel)
                .defaultSystem("You are an expert Japanese language tutor. Use the provided context " +
                              "to answer questions about Japanese language learning. If you don't find " +
                              "relevant information in the context, say so clearly.")
                .build();
    }

    /**
     * Make OpenAI embedding model primary to resolve bean conflicts.
     * This ensures that when multiple embedding models are available, OpenAI is used by default.
     */
    @Bean
    @Primary
    @ConditionalOnProperty(prefix = "app.ai.spring-ai", name = "enabled", havingValue = "true")
    public EmbeddingModel primaryEmbeddingModel(@Qualifier("openAiEmbeddingModel") EmbeddingModel openAiEmbeddingModel) {
        return openAiEmbeddingModel;
    }
}
