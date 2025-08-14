package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.GiftCode;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.GiftCodeRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.GiftCodeDTO;
import com.satori.platform.service.dto.GiftCodeRedemptionDTO;
import com.satori.platform.service.exception.GiftCodeException;
import com.satori.platform.service.exception.GiftCodeInvalidException;
import com.satori.platform.service.exception.GiftCodeUsageLimitException;
import com.satori.platform.service.mapper.GiftCodeMapper;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link GiftCode}.
 */
@Service
@Transactional
public class GiftCodeService {

    private static final Logger log = LoggerFactory.getLogger(GiftCodeService.class);

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int DEFAULT_CODE_LENGTH = 8;
    private static final SecureRandom random = new SecureRandom();

    private final GiftCodeRepository giftCodeRepository;
    private final CourseRepository courseRepository;
    private final CourseClassRepository courseClassRepository;
    private final UserProfileRepository userProfileRepository;
    private final GiftCodeMapper giftCodeMapper;

    public GiftCodeService(
        GiftCodeRepository giftCodeRepository,
        CourseRepository courseRepository,
        CourseClassRepository courseClassRepository,
        UserProfileRepository userProfileRepository,
        GiftCodeMapper giftCodeMapper
    ) {
        this.giftCodeRepository = giftCodeRepository;
        this.courseRepository = courseRepository;
        this.courseClassRepository = courseClassRepository;
        this.userProfileRepository = userProfileRepository;
        this.giftCodeMapper = giftCodeMapper;
    }

    /**
     * Save a gift code.
     *
     * @param giftCodeDTO the entity to save.
     * @return the persisted entity.
     */
    public GiftCodeDTO save(GiftCodeDTO giftCodeDTO) {
        log.debug("Request to save GiftCode : {}", giftCodeDTO);
        GiftCode giftCode = giftCodeMapper.toEntity(giftCodeDTO);
        giftCode = giftCodeRepository.save(giftCode);
        return giftCodeMapper.toDto(giftCode);
    }

    /**
     * Update a gift code.
     *
     * @param giftCodeDTO the entity to save.
     * @return the persisted entity.
     */
    public GiftCodeDTO update(GiftCodeDTO giftCodeDTO) {
        log.debug("Request to update GiftCode : {}", giftCodeDTO);
        GiftCode giftCode = giftCodeMapper.toEntity(giftCodeDTO);
        giftCode = giftCodeRepository.save(giftCode);
        return giftCodeMapper.toDto(giftCode);
    }

    /**
     * Partially update a gift code.
     *
     * @param giftCodeDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<GiftCodeDTO> partialUpdate(GiftCodeDTO giftCodeDTO) {
        log.debug("Request to partially update GiftCode : {}", giftCodeDTO);

        return giftCodeRepository
            .findById(giftCodeDTO.getId())
            .map(existingGiftCode -> {
                giftCodeMapper.partialUpdate(existingGiftCode, giftCodeDTO);
                return existingGiftCode;
            })
            .map(giftCodeRepository::save)
            .map(giftCodeMapper::toDto);
    }

    /**
     * Get all the gift codes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<GiftCodeDTO> findAll(Pageable pageable) {
        log.debug("Request to get all GiftCodes");
        return giftCodeRepository.findAll(pageable).map(giftCodeMapper::toDto);
    }

    /**
     * Get one gift code by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GiftCodeDTO> findOne(Long id) {
        log.debug("Request to get GiftCode : {}", id);
        return giftCodeRepository.findById(id).map(giftCodeMapper::toDto);
    }

    /**
     * Delete the gift code by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete GiftCode : {}", id);
        giftCodeRepository.deleteById(id);
    }

    /**
     * Generate a new gift code for course enrollment.
     *
     * @param courseId        the course ID
     * @param validityDays    number of days the code should be valid
     * @param maxUses         maximum number of uses (null for unlimited)
     * @param createdByUserId the user creating the code
     * @return the generated gift code
     */
    public GiftCodeDTO generateCourseAccessCode(Long courseId, Integer validityDays, Integer maxUses, Long createdByUserId) {
        log.debug("Request to generate gift code for course: {}", courseId);

        Course course = courseRepository
            .findById(courseId)
            .orElseThrow(() -> new GiftCodeException("Course not found with id: " + courseId));

        UserProfile createdBy = userProfileRepository
            .findById(createdByUserId)
            .orElseThrow(() -> new GiftCodeException("User not found with id: " + createdByUserId));

        String code = generateUniqueCode();
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(validityDays != null ? validityDays : 30);

        GiftCode giftCode = new GiftCode()
            .code(code)
            .expiryDate(expiryDate)
            .active(true)
            .maxUses(maxUses)
            .currentUses(0)
            .createdDate(LocalDateTime.now())
            .course(course)
            .createdBy(createdBy);

        giftCode = giftCodeRepository.save(giftCode);
        log.info("Generated gift code {} for course {}", code, course.getTitle());

        return giftCodeMapper.toDto(giftCode);
    }

    /**
     * Validate a gift code without redeeming it.
     *
     * @param code the gift code to validate
     * @return true if valid, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean validateGiftCode(String code) {
        log.debug("Request to validate gift code: {}", code);
        return giftCodeRepository.isCodeValidForRedemption(code, LocalDateTime.now());
    }

    /**
     * Redeem a gift code for student enrollment.
     *
     * @param code          the gift code
     * @param studentUserId the student's user ID
     * @return redemption result
     */
    public GiftCodeRedemptionDTO redeemGiftCode(String code, Long studentUserId) {
        log.debug("Request to redeem gift code: {} for user: {}", code, studentUserId);

        GiftCodeRedemptionDTO result = new GiftCodeRedemptionDTO(code);
        result.setRedemptionDate(LocalDateTime.now());

        try {
            // Find and validate the gift code
            GiftCode giftCode = giftCodeRepository
                .findValidByCode(code, LocalDateTime.now())
                .orElseThrow(() -> new GiftCodeInvalidException(code));

            // Check if code has reached usage limit
            if (giftCode.getMaxUses() != null && giftCode.getCurrentUses() >= giftCode.getMaxUses()) {
                throw new GiftCodeUsageLimitException(code);
            }

            // Find the student profile
            UserProfile userProfile = userProfileRepository
                .findById(studentUserId)
                .orElseThrow(() -> new GiftCodeException("User not found with id: " + studentUserId));

            StudentProfile studentProfile = userProfile.getStudentProfile();
            if (studentProfile == null) {
                throw new GiftCodeException("User is not a student");
            }

            // Check if student is already enrolled in the course
            Course course = giftCode.getCourse();
            boolean alreadyEnrolled = studentProfile
                .getClasses()
                .stream()
                .anyMatch(courseClass -> courseClass.getCourse().getId().equals(course.getId()));

            if (alreadyEnrolled) {
                result.setSuccess(false);
                result.setMessage("Student is already enrolled in this course");
                return result;
            }

            // Find an active course class for enrollment
            // For simplicity, we'll find the first available course class
            // In a real scenario, you might want more sophisticated logic
            List<CourseClass> availableClasses = courseClassRepository
                .findAll()
                .stream()
                .filter(cc -> cc.getCourse().getId().equals(course.getId()))
                .filter(cc -> cc.getCapacity() == null || cc.getStudents().size() < cc.getCapacity())
                .toList();

            if (availableClasses.isEmpty()) {
                result.setSuccess(false);
                result.setMessage("No available classes for this course");
                return result;
            }

            // Enroll student in the first available class
            CourseClass courseClass = availableClasses.get(0);
            courseClass.addStudents(studentProfile);
            courseClassRepository.save(courseClass);

            // Increment usage count
            giftCodeRepository.incrementUsageCount(giftCode.getId());

            // Set success result
            result.setSuccess(true);
            result.setMessage("Successfully enrolled in course");
            result.setStudentId(studentProfile.getId());
            result.setCourseId(course.getId());
            result.setCourseTitle(course.getTitle());

            log.info(
                "Successfully redeemed gift code {} for student {} in course {}",
                code,
                studentProfile.getStudentId(),
                course.getTitle()
            );
        } catch (GiftCodeException e) {
            result.setSuccess(false);
            result.setMessage(e.getMessage());
            log.warn("Failed to redeem gift code {}: {}", code, e.getMessage());
        }

        return result;
    }

    /**
     * Expire a gift code manually.
     *
     * @param code the gift code to expire
     */
    public void expireGiftCode(String code) {
        log.debug("Request to expire gift code: {}", code);

        Optional<GiftCode> giftCodeOpt = giftCodeRepository.findByCode(code);
        if (giftCodeOpt.isPresent()) {
            GiftCode giftCode = giftCodeOpt.orElseThrow();
            giftCode.setActive(false);
            giftCodeRepository.save(giftCode);
            log.info("Expired gift code: {}", code);
        }
    }

    /**
     * Get all gift codes created by a specific user.
     *
     * @param userId the user ID
     * @return list of gift codes
     */
    @Transactional(readOnly = true)
    public List<GiftCodeDTO> findByCreatedByUserId(Long userId) {
        log.debug("Request to get gift codes created by user: {}", userId);
        return giftCodeRepository.findByCreatedByUserId(userId).stream().map(giftCodeMapper::toDto).toList();
    }

    /**
     * Get all active gift codes for a specific course.
     *
     * @param courseId the course ID
     * @return list of active gift codes
     */
    @Transactional(readOnly = true)
    public List<GiftCodeDTO> findActiveByCourseId(Long courseId) {
        log.debug("Request to get active gift codes for course: {}", courseId);
        return giftCodeRepository.findActiveByCourseId(courseId).stream().map(giftCodeMapper::toDto).toList();
    }

    /**
     * Clean up expired gift codes.
     *
     * @return number of codes deactivated
     */
    public int cleanupExpiredCodes() {
        log.debug("Request to cleanup expired gift codes");
        int deactivated = giftCodeRepository.deactivateExpiredCodes(LocalDateTime.now());
        log.info("Deactivated {} expired gift codes", deactivated);
        return deactivated;
    }

    /**
     * Clean up gift codes that have reached their usage limit.
     *
     * @return number of codes deactivated
     */
    public int cleanupCodesAtUsageLimit() {
        log.debug("Request to cleanup gift codes at usage limit");
        int deactivated = giftCodeRepository.deactivateCodesAtUsageLimit();
        log.info("Deactivated {} gift codes at usage limit", deactivated);
        return deactivated;
    }

    /**
     * Generate a unique gift code.
     *
     * @return unique code string
     */
    private String generateUniqueCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (giftCodeRepository.findByCode(code).isPresent());
        return code;
    }

    /**
     * Generate a random code string.
     *
     * @return random code string
     */
    private String generateRandomCode() {
        StringBuilder code = new StringBuilder(DEFAULT_CODE_LENGTH);
        for (int i = 0; i < DEFAULT_CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }
}
