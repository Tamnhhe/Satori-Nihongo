package com.satori.platform.web.rest;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.service.RAGContentRetrievalService;
import com.satori.platform.service.RAGIngestionService;
import com.satori.platform.service.dto.RAGContentRequestDTO;
import com.satori.platform.service.dto.RAGContentResultDTO;
import com.satori.platform.service.dto.RAGStoreContentDTO;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
    controllers = RAGResource.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = com.satori.platform.web.filter.RateLimitingFilter.class
    )
)
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser
class RAGResourceIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RAGContentRetrievalService ragService;

    @MockBean
    private RAGIngestionService ingestionService;

    @Test
    void initialize_shouldReturnNoContent_andInvokeService() throws Exception {
        mockMvc.perform(post("/api/rag/init")).andExpect(status().isNoContent());
        verify(ragService, times(1)).initializeVectorDatabase();
    }

    @Test
    void stats_shouldReturnStatsMap() throws Exception {
        when(ragService.getDatabaseStats()).thenReturn(Map.of("vectors", 123, "dimension", 768));

        mockMvc
            .perform(get("/api/rag/stats"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.vectors").value(123))
            .andExpect(jsonPath("$.dimension").value(768));
    }

    @Test
    void store_shouldCreate_andPassPayloadToService() throws Exception {
        RAGStoreContentDTO dto = new RAGStoreContentDTO();
        dto.setContentId("c-001");
        dto.setTitle("Greetings Lesson");
        dto.setContent("こんにちは is 'Hello'.");
        dto.setContentType("lesson");
        dto.setSource("course:1/lesson:2");
        dto.setDifficultyLevel("beginner");
        dto.setTopics(List.of("greetings", "basic"));
        dto.setCourseId(1L);
        dto.setLessonId(2L);

        mockMvc
            .perform(post("/api/rag/store").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsBytes(dto)))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", org.hamcrest.Matchers.endsWith("/api/rag/store/" + dto.getContentId())));

        ArgumentCaptor<String> contentId = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> title = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> content = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> type = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> source = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> difficulty = ArgumentCaptor.forClass(String.class);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<String>> topics = ArgumentCaptor.forClass(List.class);
        ArgumentCaptor<Long> courseId = ArgumentCaptor.forClass(Long.class);
        ArgumentCaptor<Long> lessonId = ArgumentCaptor.forClass(Long.class);

        verify(ragService, times(1)).storeContent(
            contentId.capture(),
            title.capture(),
            content.capture(),
            type.capture(),
            source.capture(),
            difficulty.capture(),
            topics.capture(),
            courseId.capture(),
            lessonId.capture()
        );

        org.assertj.core.api.Assertions.assertThat(contentId.getValue()).isEqualTo("c-001");
        org.assertj.core.api.Assertions.assertThat(title.getValue()).isEqualTo("Greetings Lesson");
        org.assertj.core.api.Assertions.assertThat(type.getValue()).isEqualTo("lesson");
        org.assertj.core.api.Assertions.assertThat(courseId.getValue()).isEqualTo(1L);
        org.assertj.core.api.Assertions.assertThat(lessonId.getValue()).isEqualTo(2L);
    }

    @Test
    void search_shouldReturnListOfResults() throws Exception {
        RAGContentResultDTO r1 = new RAGContentResultDTO();
        r1.setContentId("c1");
        r1.setTitle("Lesson A");
        r1.setContentType("lesson");
        r1.setSource("course:1");
        r1.setRelevanceScore(0.92);

        RAGContentResultDTO r2 = new RAGContentResultDTO();
        r2.setContentId("c2");
        r2.setTitle("Example B");
        r2.setContentType("example");
        r2.setSource("course:1/lesson:2");
        r2.setRelevanceScore(0.81);

        when(ragService.retrieveRelevantContent(org.mockito.ArgumentMatchers.any(RAGContentRequestDTO.class))).thenReturn(List.of(r1, r2));

        RAGContentRequestDTO req = new RAGContentRequestDTO();
        req.setQuery("hello in japanese");
        req.setCourseId(1L);
        req.setMaxResults(5);

        mockMvc
            .perform(post("/api/rag/search").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsBytes(req)))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].contentId").value("c1"))
            .andExpect(jsonPath("$[0].title").value("Lesson A"))
            .andExpect(jsonPath("$[1].contentId").value("c2"))
            .andExpect(jsonPath("$[1].contentType").value("example"));
    }

    @Test
    void ingestAll_shouldReturnCount() throws Exception {
        when(ingestionService.ingestAllLessons()).thenReturn(7);
        mockMvc.perform(post("/api/rag/ingest/all")).andExpect(status().isOk()).andExpect(content().string("7"));
    }

    @Test
    void ingestCourse_shouldReturnCount() throws Exception {
        when(ingestionService.ingestLessonsByCourse(42L)).thenReturn(3);
        mockMvc.perform(post("/api/rag/ingest/course/{courseId}", 42L)).andExpect(status().isOk()).andExpect(content().string("3"));
    }
}
