package com.satori.platform.service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

/**
 * Embedding service backed by Spring AI EmbeddingModel (OpenAI-compatible).
 * Works with local providers like Ollama.
 */
@Service
public class SpringAIEmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(SpringAIEmbeddingService.class);

    private final EmbeddingModel embeddingModel;

    public SpringAIEmbeddingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public List<Double> generateEmbedding(String text) {
        log.debug("Generating embedding via Spring AI for text length: {}", text != null ? text.length() : 0);
        float[] vec = embeddingModel.embed(text == null ? "" : text);
        java.util.List<Double> result = new java.util.ArrayList<>(vec.length);
        for (float v : vec) {
            result.add((double) v);
        }
        return result;
    }

    public List<List<Double>> generateEmbeddings(List<String> texts) {
        java.util.List<float[]> vectors = embeddingModel.embed(texts);
        java.util.List<java.util.List<Double>> out = new java.util.ArrayList<>(vectors.size());
        for (float[] vec : vectors) {
            java.util.List<Double> list = new java.util.ArrayList<>(vec.length);
            for (float v : vec) list.add((double) v);
            out.add(list);
        }
        return out;
    }
}
