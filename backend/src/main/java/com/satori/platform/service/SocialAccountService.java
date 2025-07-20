package com.satori.platform.service;

import com.satori.platform.domain.SocialAccount;
import com.satori.platform.repository.SocialAccountRepository;
import com.satori.platform.service.dto.SocialAccountDTO;
import com.satori.platform.service.mapper.SocialAccountMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.SocialAccount}.
 */
@Service
@Transactional
public class SocialAccountService {

    private static final Logger LOG = LoggerFactory.getLogger(SocialAccountService.class);

    private final SocialAccountRepository socialAccountRepository;

    private final SocialAccountMapper socialAccountMapper;

    public SocialAccountService(SocialAccountRepository socialAccountRepository, SocialAccountMapper socialAccountMapper) {
        this.socialAccountRepository = socialAccountRepository;
        this.socialAccountMapper = socialAccountMapper;
    }

    /**
     * Save a socialAccount.
     *
     * @param socialAccountDTO the entity to save.
     * @return the persisted entity.
     */
    public SocialAccountDTO save(SocialAccountDTO socialAccountDTO) {
        LOG.debug("Request to save SocialAccount : {}", socialAccountDTO);
        SocialAccount socialAccount = socialAccountMapper.toEntity(socialAccountDTO);
        socialAccount = socialAccountRepository.save(socialAccount);
        return socialAccountMapper.toDto(socialAccount);
    }

    /**
     * Update a socialAccount.
     *
     * @param socialAccountDTO the entity to save.
     * @return the persisted entity.
     */
    public SocialAccountDTO update(SocialAccountDTO socialAccountDTO) {
        LOG.debug("Request to update SocialAccount : {}", socialAccountDTO);
        SocialAccount socialAccount = socialAccountMapper.toEntity(socialAccountDTO);
        socialAccount = socialAccountRepository.save(socialAccount);
        return socialAccountMapper.toDto(socialAccount);
    }

    /**
     * Partially update a socialAccount.
     *
     * @param socialAccountDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SocialAccountDTO> partialUpdate(SocialAccountDTO socialAccountDTO) {
        LOG.debug("Request to partially update SocialAccount : {}", socialAccountDTO);

        return socialAccountRepository
            .findById(socialAccountDTO.getId())
            .map(existingSocialAccount -> {
                socialAccountMapper.partialUpdate(existingSocialAccount, socialAccountDTO);

                return existingSocialAccount;
            })
            .map(socialAccountRepository::save)
            .map(socialAccountMapper::toDto);
    }

    /**
     * Get all the socialAccounts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<SocialAccountDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all SocialAccounts");
        return socialAccountRepository.findAll(pageable).map(socialAccountMapper::toDto);
    }

    /**
     * Get one socialAccount by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SocialAccountDTO> findOne(Long id) {
        LOG.debug("Request to get SocialAccount : {}", id);
        return socialAccountRepository.findById(id).map(socialAccountMapper::toDto);
    }

    /**
     * Delete the socialAccount by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete SocialAccount : {}", id);
        socialAccountRepository.deleteById(id);
    }
}
