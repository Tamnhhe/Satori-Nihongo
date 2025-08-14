package com.satori.platform.web.rest;

import com.satori.platform.service.RAGContentRetrievalService;
import com.satori.platform.service.RAGIngestionService;
import com.satori.platform.service.dto.RAGContentRequestDTO;
import com.satori.platform.service.dto.RAGContentResultDTO;
import com.satori.platform.service.dto.RAGStoreContentDTO;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rag")
public class RAGResource {

    private static final Logger log = LoggerFactory.getLogger(RAGResource.class);

    private final RAGContentRetrievalService ragService;
    private final RAGIngestionService ingestionService;

    public RAGResource(RAGContentRetrievalService ragService, RAGIngestionService ingestionService) {
        this.ragService = ragService;
        this.ingestionService = ingestionService;
    }

    @PostMapping("/init")
    public ResponseEntity<Void> initialize() {
        ragService.initializeVectorDatabase();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(ragService.getDatabaseStats());
    }

    @PostMapping("/store")
    public ResponseEntity<Void> store(@RequestBody RAGStoreContentDTO dto) throws URISyntaxException {
        ragService.storeContent(
            dto.getContentId(),
            dto.getTitle(),
            dto.getContent(),
            dto.getContentType(),
            dto.getSource(),
            dto.getDifficultyLevel(),
            dto.getTopics(),
            dto.getCourseId(),
            dto.getLessonId()
        );
        return ResponseEntity.created(new URI("/api/rag/store/" + dto.getContentId())).build();
    }

    @PostMapping("/search")
    public ResponseEntity<List<RAGContentResultDTO>> search(@RequestBody RAGContentRequestDTO request) {
        List<RAGContentResultDTO> results = ragService.retrieveRelevantContent(request);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/ingest/all")
    public ResponseEntity<Integer> ingestAll() {
        int count = ingestionService.ingestAllLessons();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/ingest/course/{courseId}")
    public ResponseEntity<Integer> ingestCourse(@PathVariable Long courseId) {
        int count = ingestionService.ingestLessonsByCourse(courseId);
        return ResponseEntity.ok(count);
    }
}
