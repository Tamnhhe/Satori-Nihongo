package com.satori.platform.repository;

import com.satori.platform.domain.GiftCode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GiftCode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GiftCodeRepository extends JpaRepository<GiftCode, Long> {

    /**
     * Find a gift code by its code string
     */
    Optional<GiftCode> findByCode(String code);

    /**
     * Find all active gift codes for a specific course
     */
    @Query("SELECT g FROM GiftCode g WHERE g.course.id = :courseId AND g.active = true")
    List<GiftCode> findActiveByCourseId(@Param("courseId") Long courseId);

    /**
     * Find all expired gift codes
     */
    @Query("SELECT g FROM GiftCode g WHERE g.expiryDate < :currentTime")
    List<GiftCode> findExpiredCodes(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find all gift codes that are about to expire (within specified hours)
     */
    @Query("SELECT g FROM GiftCode g WHERE g.expiryDate BETWEEN :currentTime AND :expiryThreshold AND g.active = true")
    List<GiftCode> findCodesExpiringWithin(@Param("currentTime") LocalDateTime currentTime,
            @Param("expiryThreshold") LocalDateTime expiryThreshold);

    /**
     * Find valid gift codes (active and not expired)
     */
    @Query("SELECT g FROM GiftCode g WHERE g.code = :code AND g.active = true AND g.expiryDate > :currentTime")
    Optional<GiftCode> findValidByCode(@Param("code") String code, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find gift codes that have reached their usage limit
     */
    @Query("SELECT g FROM GiftCode g WHERE g.maxUses IS NOT NULL AND g.currentUses >= g.maxUses")
    List<GiftCode> findCodesAtUsageLimit();

    /**
     * Find all gift codes created by a specific user
     */
    @Query("SELECT g FROM GiftCode g WHERE g.createdBy.id = :userId ORDER BY g.createdDate DESC")
    List<GiftCode> findByCreatedByUserId(@Param("userId") Long userId);

    /**
     * Check if a gift code exists and is valid for redemption
     */
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM GiftCode g " +
            "WHERE g.code = :code AND g.active = true AND g.expiryDate > :currentTime " +
            "AND (g.maxUses IS NULL OR g.currentUses < g.maxUses)")
    boolean isCodeValidForRedemption(@Param("code") String code, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Update current uses count for a gift code
     */
    @Modifying
    @Query("UPDATE GiftCode g SET g.currentUses = g.currentUses + 1 WHERE g.id = :giftCodeId")
    void incrementUsageCount(@Param("giftCodeId") Long giftCodeId);

    /**
     * Deactivate expired gift codes
     */
    @Modifying
    @Query("UPDATE GiftCode g SET g.active = false WHERE g.expiryDate < :currentTime AND g.active = true")
    int deactivateExpiredCodes(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Deactivate gift codes that have reached their usage limit
     */
    @Modifying
    @Query("UPDATE GiftCode g SET g.active = false WHERE g.maxUses IS NOT NULL AND g.currentUses >= g.maxUses AND g.active = true")
    int deactivateCodesAtUsageLimit();
}