package com.satori.platform.service;

import com.satori.platform.service.dto.RAGContentRequestDTO;
import com.satori.platform.service.dto.RAGContentResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Service for vector operations using PostgreSQL with pgvector extension.
 */
@Service
public class PostgreSQLVectorService {

    private static final Logger log = LoggerFactory.getLogger(PostgreSQLVectorService.class);

    private final JdbcTemplate vectorJdbcTemplate;

    @Value("${app.rag.vector-db.postgresql.table-name:content_embeddings}")
    private String tableName;

    @Value("${app.rag.embedding.gemini.dimensions:768}")
    private int embeddingDimensions;

    public PostgreSQLVectorService(DataSource dataSource) {
        this.vectorJdbcTemplate = new JdbcTemplate(dataSource);
    }

    /**
     * Initialize the vector database table and extension.
     */
    public void initializeVectorDatabase() {
        try {
            log.info("Initializing PostgreSQL vector database");

            // Create pgvector extension if not exists
            vectorJdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS vector");

            // Create the embeddings table
            String createTableSql = String.format("""
                    CREATE TABLE IF NOT EXISTS %s (
                        id SERIAL PRIMARY KEY,
                        content_id VARCHAR(255) UNIQUE NOT NULL,
                        title TEXT,
                        content TEXT NOT NULL,
                        content_type VARCHAR(100),
                        source VARCHAR(255),
                        difficulty_level VARCHAR(50),
                        topics TEXT[], -- Array of topic strings
                        course_id BIGINT,
                        lesson_id BIGINT,
                        embedding vector(%d),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """, tableName, embeddingDimensions);

            vectorJdbcTemplate.execute(createTableSql);

            // Create indexes for better performance
            String indexSql = String.format("""
                    CREATE INDEX IF NOT EXISTS %s_embedding_idx
                    ON %s USING ivfflat (embedding vector_cosine_ops)
                    WITH (lists = 100)
                    """, tableName, tableName);

            vectorJdbcTemplate.execute(indexSql);

            // Create additional indexes
            vectorJdbcTemplate.execute(String.format(
                    "CREATE INDEX IF NOT EXISTS %s_course_id_idx ON %s (course_id)",
                    tableName, tableName));

            vectorJdbcTemplate.execute(String.format(
                    "CREATE INDEX IF NOT EXISTS %s_content_type_idx ON %s (content_type)",
                    tableName, tableName));

            log.info("Vector database initialized successfully");

        } catch (Exception e) {
            log.error("Failed to initialize vector database: {}", e.getMessage(), e);
            throw new RuntimeException("Vector database initialization failed", e);
        }
    }

    /**
     * Store content with its embedding in the vector database.
     *
     * @param contentId       unique identifier for the content
     * @param title           content title
     * @param content         the actual content text
     * @param contentType     type of content (lesson, example, etc.)
     * @param source          source reference
     * @param difficultyLevel difficulty level
     * @param topics          list of topics
     * @param courseId        associated course ID
     * @param lessonId        associated lesson ID
     * @param embedding       the embedding vector
     */
    public void storeContent(String contentId, String title, String content,
            String contentType, String source, String difficultyLevel,
            List<String> topics, Long courseId, Long lessonId,
            List<Double> embedding) {

        log.debug("Storing content with ID: {}", contentId);

        try {
            String sql = String.format("""
                    INSERT INTO %s (content_id, title, content, content_type, source,
                                   difficulty_level, topics, course_id, lesson_id, embedding)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT (content_id)
                    DO UPDATE SET
                        title = EXCLUDED.title,
                        content = EXCLUDED.content,
                        content_type = EXCLUDED.content_type,
                        source = EXCLUDED.source,
                        difficulty_level = EXCLUDED.difficulty_level,
                        topics = EXCLUDED.topics,
                        course_id = EXCLUDED.course_id,
                        lesson_id = EXCLUDED.lesson_id,
                        embedding = EXCLUDED.embedding,
                        updated_at = CURRENT_TIMESTAMP
                    """, tableName);

            // Convert embedding to PostgreSQL vector format
            String vectorString = formatVectorForPostgreSQL(embedding);

            // Convert topics list to PostgreSQL array
            String topicsArray = topics != null
                    ? "{" + String.join(",", topics.stream().map(t -> "\"" + t + "\"").toArray(String[]::new)) + "}"
                    : null;

            vectorJdbcTemplate.update(sql,
                    contentId, title, content, contentType, source, difficultyLevel,
                    topicsArray, courseId, lessonId, vectorString);

            log.debug("Successfully stored content: {}", contentId);

        } catch (Exception e) {
            log.error("Failed to store content {}: {}", contentId, e.getMessage(), e);
            throw new RuntimeException("Failed to store content in vector database", e);
        }
    }

    /**
     * Search for similar content using vector similarity.
     *
     * @param queryEmbedding the query embedding vector
     * @param request        the search request with filters
     * @return list of similar content results
     */
    public List<RAGContentResultDTO> searchSimilarContent(List<Double> queryEmbedding,
            RAGContentRequestDTO request) {

        log.debug("Searching for similar content with {} filters",
                (request.getCourseId() != null ? 1 : 0) +
                        (request.getDifficultyLevel() != null ? 1 : 0));

        try {
            StringBuilder sql = new StringBuilder();
            sql.append(String.format("""
                    SELECT content_id, title, content, content_type, source,
                           difficulty_level, topics, course_id, lesson_id,
                           1 - (embedding <=> ?) as similarity_score
                    FROM %s
                    WHERE 1=1
                    """, tableName));

            List<Object> params = new ArrayList<>();
            params.add(formatVectorForPostgreSQL(queryEmbedding));

            // Add filters
            if (request.getCourseId() != null) {
                sql.append(" AND course_id = ?");
                params.add(request.getCourseId());
            }

            if (request.getDifficultyLevel() != null) {
                sql.append(" AND difficulty_level = ?");
                params.add(request.getDifficultyLevel());
            }

            // Add similarity threshold
            sql.append(" AND (1 - (embedding <=> ?)) >= ?");
            params.add(formatVectorForPostgreSQL(queryEmbedding));
            params.add(request.getSimilarityThreshold());

            // Order by similarity and limit results
            sql.append(" ORDER BY embedding <=> ? LIMIT ?");
            params.add(formatVectorForPostgreSQL(queryEmbedding));
            params.add(request.getMaxResults());

            return vectorJdbcTemplate.query(sql.toString(), params.toArray(), new ContentRowMapper());

        } catch (Exception e) {
            log.error("Failed to search similar content: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Delete content from the vector database.
     *
     * @param contentId the content ID to delete
     */
    public void deleteContent(String contentId) {
        log.debug("Deleting content: {}", contentId);

        try {
            String sql = String.format("DELETE FROM %s WHERE content_id = ?", tableName);
            int deleted = vectorJdbcTemplate.update(sql, contentId);

            if (deleted > 0) {
                log.debug("Successfully deleted content: {}", contentId);
            } else {
                log.warn("Content not found for deletion: {}", contentId);
            }

        } catch (Exception e) {
            log.error("Failed to delete content {}: {}", contentId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete content from vector database", e);
        }
    }

    /**
     * Get statistics about the vector database.
     *
     * @return map of statistics
     */
    public Map<String, Object> getDatabaseStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Total content count
            String countSql = String.format("SELECT COUNT(*) FROM %s", tableName);
            Integer totalCount = vectorJdbcTemplate.queryForObject(countSql, Integer.class);
            stats.put("total_content", totalCount);

            // Content by type
            String typeSql = String.format(
                    "SELECT content_type, COUNT(*) FROM %s GROUP BY content_type", tableName);
            List<Map<String, Object>> typeStats = vectorJdbcTemplate.queryForList(typeSql);
            stats.put("content_by_type", typeStats);

            // Content by difficulty
            String difficultySql = String.format(
                    "SELECT difficulty_level, COUNT(*) FROM %s GROUP BY difficulty_level", tableName);
            List<Map<String, Object>> difficultyStats = vectorJdbcTemplate.queryForList(difficultySql);
            stats.put("content_by_difficulty", difficultyStats);

            return stats;

        } catch (Exception e) {
            log.error("Failed to get database stats: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    // Private helper methods

    private String formatVectorForPostgreSQL(List<Double> embedding) {
        if (embedding == null || embedding.isEmpty()) {
            throw new IllegalArgumentException("Embedding cannot be null or empty");
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.size(); i++) {
            if (i > 0)
                sb.append(",");
            sb.append(embedding.get(i));
        }
        sb.append("]");
        return sb.toString();
    }

    private static class ContentRowMapper implements RowMapper<RAGContentResultDTO> {
        @Override
        public RAGContentResultDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            RAGContentResultDTO result = new RAGContentResultDTO();

            result.setContentId(rs.getString("content_id"));
            result.setTitle(rs.getString("title"));
            result.setContent(rs.getString("content"));
            result.setContentType(rs.getString("content_type"));
            result.setSource(rs.getString("source"));
            result.setDifficultyLevel(rs.getString("difficulty_level"));
            result.setRelevanceScore(rs.getDouble("similarity_score"));

            // Parse topics array
            String[] topicsArray = (String[]) rs.getArray("topics").getArray();
            if (topicsArray != null) {
                result.setTopics(Arrays.asList(topicsArray));
            }

            return result;
        }
    }
}