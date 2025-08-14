package com.satori.platform.service;

import com.satori.platform.domain.Lesson;
import com.satori.platform.repository.LessonRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RAGIngestionService {

    private static final Logger log = LoggerFactory.getLogger(RAGIngestionService.class);

    private final LessonRepository lessonRepository;
    private final RAGContentRetrievalService ragService;

    @Value("${app.rag.enabled:false}")
    private boolean ragEnabled;

    @Value("${app.rag.ingestion.enabled:false}")
    private boolean ingestionEnabled;

    public RAGIngestionService(LessonRepository lessonRepository, RAGContentRetrievalService ragService) {
        this.lessonRepository = lessonRepository;
        this.ragService = ragService;
    }

    public int ingestAllLessons() {
        if (!ragEnabled) {
            log.info("RAG disabled; skipping ingestion");
            return 0;
        }
        List<Lesson> lessons = lessonRepository.findAll();
        return ingestLessons(lessons);
    }

    public int ingestLessonsByCourse(Long courseId) {
        if (!ragEnabled) {
            log.info("RAG disabled; skipping ingestion");
            return 0;
        }
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        return ingestLessons(lessons);
    }

    private int ingestLessons(List<Lesson> lessons) {
        int count = 0;
        for (Lesson lesson : lessons) {
            try {
                String contentId = "lesson-" + lesson.getId();
                ragService.storeContent(
                    contentId,
                    lesson.getTitle(),
                    lesson.getContent() == null ? "" : lesson.getContent(),
                    "lesson",
                    "system",
                    null,
                    null,
                    lesson.getCourse() != null ? lesson.getCourse().getId() : null,
                    lesson.getId()
                );
                count++;
            } catch (Exception e) {
                log.warn("Failed to ingest lesson {}: {}", lesson.getId(), e.getMessage());
            }
        }
        log.info("Ingested {} lessons into vector store", count);
        return count;
    }

    // Daily schedule at 03:30 if enabled
    @Scheduled(cron = "${app.rag.ingestion.cron:0 30 3 * * *}")
    public void scheduledIngestion() {
        if (!ingestionEnabled) return;
        try {
            ingestAllLessons();
        } catch (Exception e) {
            log.warn("Scheduled ingestion failed: {}", e.getMessage());
        }
    }
}
