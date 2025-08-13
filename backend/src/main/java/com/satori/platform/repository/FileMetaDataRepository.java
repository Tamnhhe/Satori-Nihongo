package com.satori.platform.repository;

import com.satori.platform.domain.FileMetaData;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the FileMetaData entity.
 */
@Repository
public interface FileMetaDataRepository extends JpaRepository<FileMetaData, Long> {

        @Query("SELECT f FROM FileMetaData f WHERE f.uploadedBy.id = :userId")
        List<FileMetaData> findByUploadedBy(@Param("userId") Long userId);

        @Query("SELECT f FROM FileMetaData f WHERE f.lesson.id = :lessonId")
        List<FileMetaData> findByLessonId(@Param("lessonId") Long lessonId);

        @Query("SELECT f FROM FileMetaData f WHERE f.lesson.id = :lessonId AND " +
                        "(f.isPublic = true OR f.uploadedBy.id = :userId OR " +
                        "f.lesson.course.teacher.id = :userId)")
        List<FileMetaData> findByLessonIdWithAccessControl(@Param("lessonId") Long lessonId,
                        @Param("userId") Long userId);

        @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM FileMetaData f WHERE " +
                        "f.id = :fileId AND (f.isPublic = true OR f.uploadedBy.id = :userId OR " +
                        "f.lesson.course.teacher.id = :userId)")
        boolean hasAccessToFile(@Param("fileId") Long fileId, @Param("userId") Long userId);

        Optional<FileMetaData> findByChecksum(String checksum);

        Optional<FileMetaData> findByFileName(String fileName);

        @Query("SELECT f FROM FileMetaData f WHERE f.folderPath = :folderPath")
        List<FileMetaData> findByFolderPath(@Param("folderPath") String folderPath);

        @Query("SELECT f FROM FileMetaData f WHERE " +
                        "(:query IS NULL OR LOWER(f.originalName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(f.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
                        "(:folder IS NULL OR f.folderPath = :folder) AND " +
                        "(:mimeType IS NULL OR f.mimeType LIKE CONCAT(:mimeType, '%')) AND " +
                        "(f.isPublic = true OR f.uploadedBy.id = :userId)")
        List<FileMetaData> searchFiles(@Param("query") String query,
                        @Param("folder") String folder,
                        @Param("mimeType") String mimeType,
                        @Param("userId") Long userId);

        @Query("SELECT f FROM FileMetaData f WHERE f.mimeType LIKE 'image/%'")
        List<FileMetaData> findAllImages();

        @Query("SELECT f FROM FileMetaData f WHERE f.mimeType LIKE 'video/%'")
        List<FileMetaData> findAllVideos();

        @Query("SELECT f FROM FileMetaData f WHERE f.mimeType LIKE 'audio/%'")
        List<FileMetaData> findAllAudio();

        @Query("SELECT f FROM FileMetaData f WHERE f.mimeType = 'application/pdf'")
        List<FileMetaData> findAllPdfs();

        @Query("SELECT COUNT(f) FROM FileMetaData f WHERE f.uploadedBy.id = :userId")
        long countByUploadedBy(@Param("userId") Long userId);

        @Query("SELECT SUM(f.fileSize) FROM FileMetaData f WHERE f.uploadedBy.id = :userId")
        Long getTotalFileSizeByUser(@Param("userId") Long userId);

        @Query("SELECT f FROM FileMetaData f WHERE f.uploadedBy.id = :userId ORDER BY f.uploadDate DESC")
        List<FileMetaData> findRecentFilesByUser(@Param("userId") Long userId,
                        org.springframework.data.domain.Pageable pageable);

        @Query("SELECT f FROM FileMetaData f WHERE f.lesson IS NULL AND f.folderPath IS NOT NULL")
        List<FileMetaData> findOrphanedFiles();

        @Modifying
        @Query("UPDATE FileMetaData f SET f.downloadCount = f.downloadCount + 1, f.lastAccessedDate = CURRENT_TIMESTAMP WHERE f.id = :fileId")
        void incrementDownloadCount(@Param("fileId") Long fileId);
}