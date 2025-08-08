package com.satori.platform.repository;

import com.satori.platform.domain.FileMetadata;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FileMetadata entity.
 */
@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {

        /**
         * Find all files by lesson
         */
        List<FileMetadata> findByLessonId(Long lessonId);

        /**
         * Find all files by lesson and file type
         */
        List<FileMetadata> findByLessonIdAndFileType(Long lessonId, String fileType);

        /**
         * Find all files uploaded by a specific user
         */
        List<FileMetadata> findByUploadedById(Long uploadedById);

        /**
         * Find file by lesson and original name (for duplicate checking)
         */
        Optional<FileMetadata> findByLessonIdAndOriginalName(Long lessonId, String originalName);

        /**
         * Find files by lesson with access control validation
         * Only returns files if the user has access to the lesson's course
         */
        @Query("SELECT fm FROM FileMetadata fm " +
                        "JOIN fm.lesson l " +
                        "JOIN l.course c " +
                        "LEFT JOIN c.teacher t " +
                        "LEFT JOIN StudentProfile sp ON sp.userProfile.id = :userId " +
                        "LEFT JOIN sp.classes cc " +
                        "WHERE fm.lesson.id = :lessonId " +
                        "AND (t.id = :userId OR cc.course.id = c.id)")
        List<FileMetadata> findByLessonIdWithAccessControl(@Param("lessonId") Long lessonId,
                        @Param("userId") Long userId);

        /**
         * Check if user has access to a specific file
         */
        @Query("SELECT CASE WHEN COUNT(fm) > 0 THEN true ELSE false END FROM FileMetadata fm " +
                        "JOIN fm.lesson l " +
                        "JOIN l.course c " +
                        "LEFT JOIN c.teacher t " +
                        "LEFT JOIN StudentProfile sp ON sp.userProfile.id = :userId " +
                        "LEFT JOIN sp.classes cc " +
                        "WHERE fm.id = :fileId " +
                        "AND (t.id = :userId OR cc.course.id = c.id)")
        boolean hasAccessToFile(@Param("fileId") Long fileId, @Param("userId") Long userId);

        /**
         * Find files by file type across all lessons
         */
        List<FileMetadata> findByFileTypeIn(List<String> fileTypes);

        /**
         * Find files larger than specified size
         */
        List<FileMetadata> findByFileSizeGreaterThan(Long fileSize);

        /**
         * Find files by checksum (for duplicate detection)
         */
        Optional<FileMetadata> findByChecksum(String checksum);

        /**
         * Count files by lesson
         */
        long countByLessonId(Long lessonId);

        /**
         * Get total file size for a lesson
         */
        @Query("SELECT COALESCE(SUM(fm.fileSize), 0) FROM FileMetadata fm WHERE fm.lesson.id = :lessonId")
        Long getTotalFileSizeByLesson(@Param("lessonId") Long lessonId);
}