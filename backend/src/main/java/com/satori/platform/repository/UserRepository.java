package com.satori.platform.repository;

import com.satori.platform.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE, unless = "#result == null")
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE, unless = "#result == null")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    @EntityGraph(attributePaths = "authorities")
    @Query("SELECT u FROM User u")
    Page<User> findAllWithAuthorities(Pageable pageable);

    // New method without pagination to avoid collection fetch join issues
    @Query("SELECT u FROM User u")
    List<User> findAllUsersWithoutAuthorities();

    @Query("SELECT u FROM User u WHERE u.accountLockedUntil IS NOT NULL AND u.accountLockedUntil < :now")
    List<User> findUsersWithExpiredLocks(@Param("now") Instant now);

    @Query("SELECT u FROM User u WHERE u.profileCompleted = false AND u.activated = true")
    List<User> findUsersWithIncompleteProfiles();

    // Enhanced user management methods

    @Query("SELECT u FROM User u WHERE u.lastModifiedDate BETWEEN :startDate AND :endDate")
    List<User> findActiveUsersBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a.name = :authority")
    List<User> findByAuthorityWithoutPageable(@Param("authority") String authority);

    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a.name = :authority")
    List<User> findByAuthority(@Param("authority") String authority, Pageable pageable);

    long countByActivatedTrue();

    @Query("SELECT COUNT(u) FROM User u JOIN u.authorities a WHERE a.name = :authorityName")
    long countByAuthoritiesName(@Param("authorityName") String authorityName);
}
