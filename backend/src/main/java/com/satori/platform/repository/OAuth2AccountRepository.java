package com.satori.platform.repository;

import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.User;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OAuth2Account entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OAuth2AccountRepository extends JpaRepository<OAuth2Account, Long> {

    /**
     * Find OAuth2 account by provider and provider user ID.
     */
    Optional<OAuth2Account> findByProviderAndProviderUserId(OAuth2Provider provider, String providerUserId);

    /**
     * Find all OAuth2 accounts for a user.
     */
    List<OAuth2Account> findByUserOrderByLinkedAtDesc(User user);

    /**
     * Find OAuth2 account by user and provider.
     */
    Optional<OAuth2Account> findByUserAndProvider(User user, OAuth2Provider provider);

    /**
     * Check if a provider account is already linked to any user.
     */
    boolean existsByProviderAndProviderUserId(OAuth2Provider provider, String providerUserId);

    /**
     * Find accounts that need token refresh (expired tokens).
     */
    @Query("SELECT o FROM OAuth2Account o WHERE o.tokenExpiresAt IS NOT NULL AND o.tokenExpiresAt < :now AND o.refreshToken IS NOT NULL")
    List<OAuth2Account> findAccountsWithExpiredTokens(@Param("now") Instant now);

    /**
     * Find accounts that haven't been used for a specified period (for cleanup).
     */
    @Query("SELECT o FROM OAuth2Account o WHERE o.lastUsedAt IS NOT NULL AND o.lastUsedAt < :cutoffDate")
    List<OAuth2Account> findUnusedAccountsOlderThan(@Param("cutoffDate") Instant cutoffDate);

    /**
     * Count OAuth2 accounts by provider.
     */
    long countByProvider(OAuth2Provider provider);

    /**
     * Delete all OAuth2 accounts for a user.
     */
    void deleteByUser(User user);
}