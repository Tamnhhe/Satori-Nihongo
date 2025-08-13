package com.satori.platform.service.event;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Lesson;
import com.satori.platform.service.RAGContentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Event listener for automatically indexing content in the RAG system
 * when courses and lessons are created or updated.
 */
@Component
@ConditionalOnProperty(value = "application.ai.langchain4j.enabled", havingValue = "true")
public class RAGContentIndexingEventListener {

    private static final Logger log = LoggerFactory.getLogger(RAGContentIndexingEventListener.class);

    private final RAGContentService ragContentService;

    @Autowired(required = false)
    public RAGContentIndexingEventListener(RAGContentService ragContentService) {
        this.ragContentService = ragContentService;
    }

    /**
     * Handle course created event.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleCourseCreated(CourseCreatedEvent event) {
        if (ragContentService == null) {
            return;
        }

        log.debug("Handling course created event: {}", event.getCourse().getId());
        
        try {
            ragContentService.indexCourseContent(event.getCourse().getId());
            log.info("Successfully indexed new course: {}", event.getCourse().getId());
        } catch (Exception e) {
            log.error("Failed to index new course: {}", event.getCourse().getId(), e);
        }
    }

    /**
     * Handle course updated event.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleCourseUpdated(CourseUpdatedEvent event) {
        if (ragContentService == null) {
            return;
        }

        log.debug("Handling course updated event: {}", event.getCourse().getId());
        
        try {
            // Re-index the course content
            ragContentService.indexCourseContent(event.getCourse().getId());
            log.info("Successfully re-indexed updated course: {}", event.getCourse().getId());
        } catch (Exception e) {
            log.error("Failed to re-index updated course: {}", event.getCourse().getId(), e);
        }
    }

    /**
     * Handle lesson created event.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleLessonCreated(LessonCreatedEvent event) {
        if (ragContentService == null) {
            return;
        }

        log.debug("Handling lesson created event: {}", event.getLesson().getId());
        
        try {
            ragContentService.indexLessonContent(event.getLesson());
            log.info("Successfully indexed new lesson: {}", event.getLesson().getId());
        } catch (Exception e) {
            log.error("Failed to index new lesson: {}", event.getLesson().getId(), e);
        }
    }

    /**
     * Handle lesson updated event.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handleLessonUpdated(LessonUpdatedEvent event) {
        if (ragContentService == null) {
            return;
        }

        log.debug("Handling lesson updated event: {}", event.getLesson().getId());
        
        try {
            // Re-index the lesson content
            ragContentService.indexLessonContent(event.getLesson());
            log.info("Successfully re-indexed updated lesson: {}", event.getLesson().getId());
        } catch (Exception e) {
            log.error("Failed to re-index updated lesson: {}", event.getLesson().getId(), e);
        }
    }

    /**
     * Event for course creation.
     */
    public static class CourseCreatedEvent {
        private final Course course;

        public CourseCreatedEvent(Course course) {
            this.course = course;
        }

        public Course getCourse() {
            return course;
        }
    }

    /**
     * Event for course update.
     */
    public static class CourseUpdatedEvent {
        private final Course course;

        public CourseUpdatedEvent(Course course) {
            this.course = course;
        }

        public Course getCourse() {
            return course;
        }
    }

    /**
     * Event for lesson creation.
     */
    public static class LessonCreatedEvent {
        private final Lesson lesson;

        public LessonCreatedEvent(Lesson lesson) {
            this.lesson = lesson;
        }

        public Lesson getLesson() {
            return lesson;
        }
    }

    /**
     * Event for lesson update.
     */
    public static class LessonUpdatedEvent {
        private final Lesson lesson;

        public LessonUpdatedEvent(Lesson lesson) {
            this.lesson = lesson;
        }

        public Lesson getLesson() {
            return lesson;
        }
    }
}
