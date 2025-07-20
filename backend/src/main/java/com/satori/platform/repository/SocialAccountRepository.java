package com.satori.platform.repository;

import com.satori.platform.domain.SocialAccount;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SocialAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {}
