package com.satori.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.ai.embedding.EmbeddingModel;

class SpringAIEmbeddingServiceTest {

    @Test
    void generateEmbedding_convertsFloatArrayToDoubleList() {
        EmbeddingModel model = mock(EmbeddingModel.class);
        when(model.embed("hello")).thenReturn(new float[] { 1.0f, -2.5f, 0.125f });

        SpringAIEmbeddingService service = new SpringAIEmbeddingService(model);
        List<Double> result = service.generateEmbedding("hello");

        assertThat(result).containsExactly(1.0, -2.5, 0.125);
    }

    @Test
    void generateEmbeddings_convertsBatchToDoubleLists() {
        EmbeddingModel model = mock(EmbeddingModel.class);
        when(model.embed(List.of("a", "b"))).thenReturn(List.of(new float[] { 0.0f, 1.0f }, new float[] { -1.0f, 2.0f }));

        SpringAIEmbeddingService service = new SpringAIEmbeddingService(model);
        List<List<Double>> result = service.generateEmbeddings(List.of("a", "b"));

        assertThat(result).hasSize(2);
        assertThat(result.get(0)).containsExactly(0.0, 1.0);
        assertThat(result.get(1)).containsExactly(-1.0, 2.0);
    }
}
