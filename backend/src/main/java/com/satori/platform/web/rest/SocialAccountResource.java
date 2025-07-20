package com.satori.platform.web.rest;

import com.satori.platform.repository.SocialAccountRepository;
import com.satori.platform.service.SocialAccountService;
import com.satori.platform.service.dto.SocialAccountDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.satori.platform.domain.SocialAccount}.
 */
@RestController
@RequestMapping("/api/social-accounts")
public class SocialAccountResource {

    private static final Logger LOG = LoggerFactory.getLogger(SocialAccountResource.class);

    private static final String ENTITY_NAME = "socialAccount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SocialAccountService socialAccountService;

    private final SocialAccountRepository socialAccountRepository;

    public SocialAccountResource(SocialAccountService socialAccountService, SocialAccountRepository socialAccountRepository) {
        this.socialAccountService = socialAccountService;
        this.socialAccountRepository = socialAccountRepository;
    }

    /**
     * {@code POST  /social-accounts} : Create a new socialAccount.
     *
     * @param socialAccountDTO the socialAccountDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new socialAccountDTO, or with status {@code 400 (Bad Request)} if the socialAccount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SocialAccountDTO> createSocialAccount(@Valid @RequestBody SocialAccountDTO socialAccountDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save SocialAccount : {}", socialAccountDTO);
        if (socialAccountDTO.getId() != null) {
            throw new BadRequestAlertException("A new socialAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        socialAccountDTO = socialAccountService.save(socialAccountDTO);
        return ResponseEntity.created(new URI("/api/social-accounts/" + socialAccountDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, socialAccountDTO.getId().toString()))
            .body(socialAccountDTO);
    }

    /**
     * {@code PUT  /social-accounts/:id} : Updates an existing socialAccount.
     *
     * @param id the id of the socialAccountDTO to save.
     * @param socialAccountDTO the socialAccountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialAccountDTO,
     * or with status {@code 400 (Bad Request)} if the socialAccountDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the socialAccountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SocialAccountDTO> updateSocialAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SocialAccountDTO socialAccountDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update SocialAccount : {}, {}", id, socialAccountDTO);
        if (socialAccountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialAccountDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        socialAccountDTO = socialAccountService.update(socialAccountDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, socialAccountDTO.getId().toString()))
            .body(socialAccountDTO);
    }

    /**
     * {@code PATCH  /social-accounts/:id} : Partial updates given fields of an existing socialAccount, field will ignore if it is null
     *
     * @param id the id of the socialAccountDTO to save.
     * @param socialAccountDTO the socialAccountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialAccountDTO,
     * or with status {@code 400 (Bad Request)} if the socialAccountDTO is not valid,
     * or with status {@code 404 (Not Found)} if the socialAccountDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the socialAccountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SocialAccountDTO> partialUpdateSocialAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SocialAccountDTO socialAccountDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update SocialAccount partially : {}, {}", id, socialAccountDTO);
        if (socialAccountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialAccountDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SocialAccountDTO> result = socialAccountService.partialUpdate(socialAccountDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, socialAccountDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /social-accounts} : get all the socialAccounts.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of socialAccounts in body.
     */
    @GetMapping("")
    public ResponseEntity<List<SocialAccountDTO>> getAllSocialAccounts(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of SocialAccounts");
        Page<SocialAccountDTO> page = socialAccountService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /social-accounts/:id} : get the "id" socialAccount.
     *
     * @param id the id of the socialAccountDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the socialAccountDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SocialAccountDTO> getSocialAccount(@PathVariable("id") Long id) {
        LOG.debug("REST request to get SocialAccount : {}", id);
        Optional<SocialAccountDTO> socialAccountDTO = socialAccountService.findOne(id);
        return ResponseUtil.wrapOrNotFound(socialAccountDTO);
    }

    /**
     * {@code DELETE  /social-accounts/:id} : delete the "id" socialAccount.
     *
     * @param id the id of the socialAccountDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocialAccount(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete SocialAccount : {}", id);
        socialAccountService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
