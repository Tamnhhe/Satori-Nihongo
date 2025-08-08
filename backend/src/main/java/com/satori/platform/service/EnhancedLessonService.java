package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.FileMetaData;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.repository.StudentProgressRepository;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.FileMetaDataRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.FileMetaDataDTO;
import com.satori.platform.service.dto.LessonDTO;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.service.mapper.LessonMapper;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Enhanced Service Implementation for managing {@link Lesson}.
 * Provides file attachment support and content management functionality.
 */
@Service
@Transactional
public class EnhancedLessonService {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedLessonService.class);

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserProfileRepository userProfileRepository;
    private final FileMetaDataRepository fileMetaDataRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final LessonMapper lessonMapper;
    private final FileManagementService fileManagementService;
    private final NotificationService notificationService;

    public EnhancedLessonService(
            LessonRepository lessonRepository,
            CourseRepository courseRepository,
            UserProfileRepository userProfileRepository,
            FileMetaDataRepository fileMetaDataRepository,
            StudentProgressRepository studentProgressRepository,
            LessonMapper lessonMapper,
            FileManagementService fileManagementService,
            NotificationService notificationService) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.userProfileRepository = userProfileRepository;
        this.fileMetaDataRepository = fileMetaDataRepository;
        this.studentProgressRepository = studentProgressRepository;
        this.lessonMapper = lessonMapper;
        this.fileManagementService = fileManagementService;
        this.notificationService = notificationService;
    }

    /**
     * Create a new lesson with teacher validation.
     *
     * @param lessonDTO the lesson to create
     * @param teacherId the teacher user ID
     * @return the created lesson
     * @throws InsufficientPermissionException if user is not teacher of the course
     */
    public LessonDTO createLesson(LessonDTO lessonDTO, Long teacherId) {
        LOG.debug("Request to create Lesson : {} by teacher: {}", lessonDTO, teacherId);

        validateTeacherPermission(teacherId, lessonDTO.getCourse().getId());
        validateLessonData(lessonDTO);

        Lesson lesson = lessonMapper.toEntity(lessonDTO);
        lesson.setId(null); // Ensure new entity

        lesson = lessonRepository.save(lesson);
        LOG.info("Created new lesson with ID: {} by teacher: {}", lesson.getId(), teacherId);

        // Notify enrolled students of new lesson
        notifyStudentsOfNewLesson(lesson);

        return lessonMapper.toDto(lesson);
    }

    /**
     * Update an existing lesson with teacher validation.
     *
     * @param lessonId  the lesson ID to update
     * @param lessonDTO the updated lesson data
     * @param teacherId the teacher user ID
     * @return the updated lesson
     * @throws EntityNotFoundException         if lesson not found
     * @throws InsufficientPermissionException if user is not teacher of the course
     */
    public LessonDTO updateLesson(Long lessonId, LessonDTO lessonDTO, Long teacherId) {
        LOG.debug("Request to update Lesson : {} by teacher: {}", lessonId, teacherId);

        Lesson existingLesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with id: " + lessonId));

        validateTeacherPermission(teacherId, existingLesson.getCourse().getId());
        validateLessonData(lessonDTO);

        // Update fields
        existingLesson.setTitle(lessonDTO.getTitle());
        existingLesson.setContent(lessonDTO.getContent());
        existingLesson.setVideoUrl(lessonDTO.getVideoUrl());
        existingLesson.setSlideUrl(lessonDTO.getSlideUrl());

        Lesson updatedLesson = lessonRepository.save(existingLesson);
        LOG.info("Updated lesson with ID: {} by teacher: {}", lessonId, teacherId);

        // Notify enrolled students of lesson update
        notifyStudentsOfLessonUpdate(updatedLesson);

        return lessonMapper.toDto(updatedLesson);
    }

    /**
     * Delete a lesson with teacher validation and dependency handling.
     *
     * @param lessonId  the lesson ID to delete
     * @param teacherId the teacher user ID
     * @throws EntityNotFoundException         if lesson not found
     * @throws InsufficientPermissionException if user is not teacher of the course
     */
    public void deleteLesson(Long lessonId, Long teacherId) {
        LOG.debug("Request to delete Lesson : {} by teacher: {}", lessonId, teacherId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with id: " + lessonId));

        validateTeacherPermission(teacherId, lesson.getCourse().getId());

        // Handle dependent data
        handleLessonDeletion(lesson);

        lessonRepository.delete(lesson);
        LOG.info("Deleted lesson with ID: {} by teacher: {}", lessonId, teacherId);
    }

    /**
     * Add file attachment to lesson.
     *
     * @param lessonId  the lesson ID
     * @param file      the file to attach
     * @param teacherId the teacher user ID
     * @return the file metadata
     */
    public FileMetaData addFileAttachment(Long lessonId, MultipartFile file, Long teacherId) {
        LOG.debug("Request to add file attachment to lesson: {} by teacher: {}", lessonId, teacherId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with id: " + lessonId));

        validateTeacherPermission(teacherId, lesson.getCourse().getId());

        // Upload file using FileManagementService
        FileMetaDataDTO fileMetaDataDTO = fileManagementService.uploadLessonFile(file, lessonId, teacherId);

        // Get the actual FileMetaData entity for return
        FileMetaData fileMetaData = fileMetaDataRepository.findById(fileMetaDataDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("File metadata not found after upload"));

        LOG.info("Added file attachment {} to lesson: {}", fileMetaData.getFileName(), lessonId);

        // Notify students of new content
        notifyStudentsOfNewContent(lesson);

        return fileMetaData;
    }

    /**
     * Remove file attachment from lesson.
     *
     * @param lessonId  the lesson ID
     * @param fileId    the file ID to remove
     * @param teacherId the teacher user ID
     */
    public void removeFileAttachment(Long lessonId, Long fileId, Long teacherId) {
        LOG.debug("Request to remove file attachment {} from lesson: {} by teacher: {}",
                fileId, lessonId, teacherId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with id: " + lessonId));

        validateTeacherPermission(teacherId, lesson.getCourse().getId());

        FileMetaData fileMetaData = fileMetaDataRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found with id: " + fileId));

        if (!fileMetaData.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("File does not belong to this lesson");
        }

        fileManagementService.deleteFile(fileId, teacherId);

        LOG.info("Removed file attachment {} from lesson: {}", fileId, lessonId);
    }

    /**
     * Get lessons by course with file attachments.
     *
     * @param courseId the course ID
     * @return list of lessons with file attachments
     */
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByCourseWithFiles(Long courseId) {
        LOG.debug("Request to get lessons with files for course: {}", courseId);

        List<Lesson> lessons = lessonRepository.findByCourseIdWithFileAttachments(courseId);
        return lessons.stream()
                .map(lessonMapper::toDto)
                .toList();
    }

    private void validateTeacherPermission(Long teacherId, Long courseId) {
        UserProfile teacher = userProfileRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        if (!course.getTeacher().getId().equals(teacherId)
                && teacher.getRole() != com.satori.platform.domain.enumeration.Role.ADMIN) {
            throw new InsufficientPermissionException("Only the course teacher or admin can perform this operation");
        }
    }

    private void validateLessonData(LessonDTO lessonDTO) {
        if (lessonDTO.getTitle() == null || lessonDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Lesson title is required");
        }

        if (lessonDTO.getCourse() == null || lessonDTO.getCourse().getId() == null) {
            throw new IllegalArgumentException("Course is required for lesson");
        }
    }

    private void handleLessonDeletion(Lesson lesson) {
        // Delete associated file attachments
        lesson.getFileAttachments().forEach(fileMetaData -> {
            try {
                // Use system user ID for cleanup operations
                fileManagementService.deleteFile(fileMetaData.getId(), lesson.getCourse().getTeacher().getId());
            } catch (Exception e) {
                LOG.warn("Failed to delete file attachment: {}", fileMetaData.getId(), e);
            }
        });

        // Handle flashcard sessions
        lesson.getFlashcardSessions().forEach(session -> {
            // Sessions will be cascade deleted with lesson
            LOG.debug("Flashcard session {} will be deleted with lesson", session.getId());
        });
    }

    private void notifyStudentsOfNewLesson(Lesson lesson) {
        Course course = lesson.getCourse();
        List<StudentProfile> enrolledStudents = studentProgressRepository.findStudentsByCourseId(course.getId());
        List<UserProfile> userProfiles = enrolledStudents.stream()
                .map(StudentProfile::getUserProfile)
                .toList();

        notificationService.sendContentUpdateNotification(userProfiles, lesson);
    }

    private void notifyStudentsOfLessonUpdate(Lesson lesson) {
        Course course = lesson.getCourse();
        List<StudentProfile> enrolledStudents = studentProgressRepository.findStudentsByCourseId(course.getId());
        List<UserProfile> userProfiles = enrolledStudents.stream()
                .map(StudentProfile::getUserProfile)
                .toList();

        notificationService.sendContentUpdateNotification(userProfiles, lesson);
    }

    private void notifyStudentsOfNewContent(Lesson lesson) {
        Course course = lesson.getCourse();
        List<StudentProfile> enrolledStudents = studentProgressRepository.findStudentsByCourseId(course.getId());
        List<UserProfile> userProfiles = enrolledStudents.stream()
                .map(StudentProfile::getUserProfile)
                .toList();

        notificationService.sendContentUpdateNotification(userProfiles, lesson);
    }
}
