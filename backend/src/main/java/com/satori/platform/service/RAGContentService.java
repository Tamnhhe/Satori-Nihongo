package com.satori.platform.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentBySentenceSplitter;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import com.satori.platform.domain.Course;
import com.satori.platform.domain.Lesson;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.service.exception.DocumentIndexingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing RAG (Retrieval-Augmented Generation) content ingestion and retrieval.
 * This service handles indexing learning content for enhanced AI question generation.
 */
@Service
@ConditionalOnProperty(value = "application.ai.langchain4j.enabled", havingValue = "true")
@Transactional
public class RAGContentService {

    private static final Logger log = LoggerFactory.getLogger(RAGContentService.class);
    
    private static final String LESSON_PREFIX = "lesson_";
    private static final String COURSE_PREFIX = "course_";
    private static final String SOURCE_KEY = "source";
    private static final String SEGMENT_INDEX_KEY = "segment_index";
    private static final String INDEXED_AT_KEY = "indexed_at";
    private static final String FILE_PATH_KEY = "file_path";

    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;
    private final DocumentBySentenceSplitter documentSplitter;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Value("${application.ai.rag.max-results:5}")
    private Integer maxResults;

    @Value("${application.ai.rag.min-score:0.6}")
    private Double minScore;

    public RAGContentService(EmbeddingStore<TextSegment> embeddingStore,
                           EmbeddingModel embeddingModel,
                           DocumentBySentenceSplitter documentSplitter,
                           CourseRepository courseRepository,
                           LessonRepository lessonRepository) {
        this.embeddingStore = embeddingStore;
        this.embeddingModel = embeddingModel;
        this.documentSplitter = documentSplitter;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
    }

    /**
     * Index course content for RAG retrieval.
     */
    public void indexCourseContent(Long courseId) {
        log.debug("Indexing content for course: {}", courseId);

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            log.warn("Course not found: {}", courseId);
            return;
        }

        Course course = courseOpt.get();
        
        // Index course description and overview
        if (course.getDescription() != null && !course.getDescription().trim().isEmpty()) {
            indexTextContent(course.getDescription(), COURSE_PREFIX + courseId + "_description");
        }

        // Index all lessons in the course
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        for (Lesson lesson : lessons) {
            indexLessonContent(lesson);
        }

        log.info("Successfully indexed content for course: {} with {} lessons", courseId, lessons.size());
    }

    /**
     * Index lesson content for RAG retrieval.
     */
    public void indexLessonContent(Lesson lesson) {
        log.debug("Indexing content for lesson: {}", lesson.getId());

        String lessonPrefix = LESSON_PREFIX + lesson.getId();

        // Index lesson content
        if (lesson.getContent() != null && !lesson.getContent().trim().isEmpty()) {
            String cleanContent = extractTextFromHtml(lesson.getContent());
            indexTextContent(cleanContent, lessonPrefix + "_content");
        }

        // Index lesson objectives (using content if available)
        // Note: Lesson entity doesn't have objectives field, skipping this section
        
        // Index lesson summary (using content if available)
        // Note: Lesson entity doesn't have summary field, skipping this section

        log.debug("Successfully indexed lesson: {}", lesson.getId());
    }

    /**
     * Index text content by splitting it into segments and storing embeddings.
     */
    public void indexTextContent(String content, String sourceId) {
        if (content == null || content.trim().isEmpty()) {
            return;
        }

        try {
            // Create document from text content
            Document document = Document.from(content);
            
            // Split document into segments
            List<TextSegment> segments = documentSplitter.split(document);

            // Create embeddings and store them
            for (int i = 0; i < segments.size(); i++) {
                TextSegment segment = segments.get(i);
                
                // Add metadata to segment
                segment.metadata().put(SOURCE_KEY, sourceId);
                segment.metadata().put(SEGMENT_INDEX_KEY, String.valueOf(i));
                segment.metadata().put(INDEXED_AT_KEY, String.valueOf(System.currentTimeMillis()));

                // Generate embedding
                Embedding embedding = embeddingModel.embed(segment).content();
                
                // Store in embedding store
                embeddingStore.add(embedding, segment);
            }

            log.debug("Indexed {} segments for source: {}", segments.size(), sourceId);

        } catch (Exception e) {
            log.error("Failed to index content for source: {}", sourceId, e);
        }
    }

    /**
     * Index document from file path.
     */
    public void indexDocumentFromFile(String filePath, String sourceId) {
        try {
            Path path = Paths.get(filePath);
            Document document = FileSystemDocumentLoader.loadDocument(path, new TextDocumentParser());
            
            // Split document into segments
            List<TextSegment> segments = documentSplitter.split(document);

            // Create embeddings and store them
            for (int i = 0; i < segments.size(); i++) {
                TextSegment segment = segments.get(i);
                
                // Add metadata
                segment.metadata().put(SOURCE_KEY, sourceId);
                segment.metadata().put(FILE_PATH_KEY, filePath);
                segment.metadata().put(SEGMENT_INDEX_KEY, String.valueOf(i));
                segment.metadata().put(INDEXED_AT_KEY, String.valueOf(System.currentTimeMillis()));

                Embedding embedding = embeddingModel.embed(segment).content();
                embeddingStore.add(embedding, segment);
            }

            log.info("Successfully indexed document: {} with {} segments", filePath, segments.size());

        } catch (Exception e) {
            log.error("Failed to index document: {}", filePath, e);
            throw new DocumentIndexingException("Failed to index document: " + filePath, e);
        }
    }

    /**
     * Retrieve relevant content for a given query.
     */
    public List<String> retrieveRelevantContent(String query) {
        return retrieveRelevantContent(query, maxResults, minScore);
    }

    /**
     * Retrieve relevant content with custom parameters.
     */
    public List<String> retrieveRelevantContent(String query, int maxResults, double minScore) {
        log.debug("Retrieving relevant content for query: {}", query);

        try {
            // Generate embedding for query
            Embedding queryEmbedding = embeddingModel.embed(query).content();

            // Search for similar content
            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(queryEmbedding)
                    .maxResults(maxResults)
                    .minScore(minScore)
                    .build();

            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);

            // Extract and return relevant text content
            List<String> relevantContent = searchResult.matches().stream()
                    .map(match -> {
                        TextSegment segment = match.embedded();
                        String source = segment.metadata().getString(SOURCE_KEY);
                        return String.format("[Source: %s] %s", source, segment.text());
                    })
                    .collect(Collectors.toList());

            log.debug("Retrieved {} relevant content segments", relevantContent.size());
            return relevantContent;

        } catch (Exception e) {
            log.error("Failed to retrieve relevant content for query: {}", query, e);
            return List.of();
        }
    }

    /**
     * Retrieve content specific to a course.
     */
    public List<String> retrieveCourseContent(Long courseId, String query) {
        log.debug("Retrieving course-specific content for course: {} and query: {}", courseId, query);

        try {
            Embedding queryEmbedding = embeddingModel.embed(query).content();

            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(queryEmbedding)
                    .maxResults(maxResults)
                    .minScore(minScore)
                    .build();

            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);

            // Filter results to only include content from the specified course
            String coursePrefix = COURSE_PREFIX + courseId;

            List<String> courseContent = searchResult.matches().stream()
                    .filter(match -> {
                        String source = match.embedded().metadata().getString(SOURCE_KEY);
                        return source != null && (source.startsWith(coursePrefix) || 
                                (source.startsWith(LESSON_PREFIX) && isLessonFromCourse(source, courseId)));
                    })
                    .map(match -> {
                        TextSegment segment = match.embedded();
                        String source = segment.metadata().getString(SOURCE_KEY);
                        return String.format("[%s] %s", source, segment.text());
                    })
                    .collect(Collectors.toList());

            log.debug("Retrieved {} course-specific content segments", courseContent.size());
            return courseContent;

        } catch (Exception e) {
            log.error("Failed to retrieve course content for course: {} and query: {}", courseId, query, e);
            return List.of();
        }
    }

    /**
     * Clear all indexed content.
     */
    public void clearAllContent() {
        log.info("Clearing all indexed content");
        embeddingStore.removeAll();
    }

    /**
     * Remove content for a specific source.
     */
    public void removeContent(String sourceId) {
        log.info("Removing content for source: {}", sourceId);
        // Note: This would require a more sophisticated embedding store implementation
        // that supports filtering by metadata for removal
        log.warn("Content removal by source not implemented for current embedding store");
    }

    /**
     * Extract text content from HTML.
     */
    private String extractTextFromHtml(String htmlContent) {
        if (htmlContent == null || htmlContent.trim().isEmpty()) {
            return "";
        }

        try {
            // Simple HTML tag removal
            return htmlContent.replaceAll("<[^>]+>", "").trim();
        } catch (Exception e) {
            log.warn("Failed to extract text from HTML, using content as-is: {}", e.getMessage());
            return htmlContent.replaceAll("<[^>]+>", "").trim();
        }
    }

    /**
     * Check if a lesson belongs to a specific course.
     */
    private boolean isLessonFromCourse(String source, Long courseId) {
        try {
            if (source.startsWith(LESSON_PREFIX)) {
                String lessonIdStr = source.substring(7).split("_")[0];
                Long lessonId = Long.parseLong(lessonIdStr);
                
                Optional<Lesson> lesson = lessonRepository.findById(lessonId);
                return lesson.isPresent() && courseId.equals(lesson.get().getCourse().getId());
            }
        } catch (Exception e) {
            log.debug("Could not determine course for lesson source: {}", source);
        }
        return false;
    }
}
