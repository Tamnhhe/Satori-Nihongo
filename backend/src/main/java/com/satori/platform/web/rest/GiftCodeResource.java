package com.satori.platform.web.rest;

import com.satori.platform.repository.GiftCodeRepository;
import com.satori.platform.service.GiftCodeService;
import com.satori.platform.service.dto.GiftCodeDTO;
import com.satori.platform.service.dto.GiftCodeRedemptionDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.satori.platform.domain.GiftCode}.
 */
@RestController
@RequestMapping("/api/gift-codes")
public class GiftCodeResource {

    private static final Logger log = LoggerFactory.getLogger(GiftCodeResource.class);

    private static final String ENTITY_NAME = "giftCode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GiftCodeService giftCodeService;

    private final GiftCodeRepository giftCodeRepository;

    public GiftCodeResource(GiftCodeService giftCodeService, GiftCodeRepository giftCodeRepository) {
        this.giftCodeService = giftCodeService;
        this.giftCodeRepository = giftCodeRepository;
    }

    /**
     * {@code POST  /gift-codes} : Create a new giftCode.
     *
     * @param giftCodeDTO the giftCodeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new giftCodeDTO, or with status {@code 400 (Bad Request)} if
     *         the giftCode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<GiftCodeDTO> createGiftCode(@Valid @RequestBody GiftCodeDTO giftCodeDTO)
            throws URISyntaxException {
        log.debug("REST request to save GiftCode : {}", giftCodeDTO);
        if (giftCodeDTO.getId() != null) {
            throw new BadRequestAlertException("A new giftCode cannot already have an ID", ENTITY_NAME, "idexists");
        }

        giftCodeDTO = giftCodeService.save(giftCodeDTO);
        return ResponseEntity.created(new URI("/api/gift-codes/" + giftCodeDTO.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        giftCodeDTO.getId().toString()))
                .body(giftCodeDTO);
    }

    /**
     * {@code PUT  /gift-codes/:id} : Updates an existing giftCode.
     *
     * @param id          the id of the giftCodeDTO to save.
     * @param giftCodeDTO the giftCodeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated giftCodeDTO,
     *         or with status {@code 400 (Bad Request)} if the giftCodeDTO is not
     *         valid,
     *         or with status {@code 500 (Internal Server Error)} if the giftCodeDTO
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<GiftCodeDTO> updateGiftCode(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody GiftCodeDTO giftCodeDTO) throws URISyntaxException {
        log.debug("REST request to update GiftCode : {}, {}", id, giftCodeDTO);
        if (giftCodeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, giftCodeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!giftCodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        giftCodeDTO = giftCodeService.update(giftCodeDTO);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        giftCodeDTO.getId().toString()))
                .body(giftCodeDTO);
    }

    /**
     * {@code PATCH  /gift-codes/:id} : Partial updates given fields of an existing
     * giftCode, field will ignore if it is null
     *
     * @param id          the id of the giftCodeDTO to save.
     * @param giftCodeDTO the giftCodeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated giftCodeDTO,
     *         or with status {@code 404 (Not Found)} if the giftCodeDTO is not
     *         found,
     *         or with status {@code 400 (Bad Request)} if the giftCodeDTO is not
     *         valid,
     *         or with status {@code 500 (Internal Server Error)} if the giftCodeDTO
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<GiftCodeDTO> partialUpdateGiftCode(
            @PathVariable(value = "id", required = false) final Long id,
            @NotNull @RequestBody GiftCodeDTO giftCodeDTO) throws URISyntaxException {
        log.debug("REST request to partial update GiftCode partially : {}, {}", id, giftCodeDTO);
        if (giftCodeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, giftCodeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!giftCodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GiftCodeDTO> result = giftCodeService.partialUpdate(giftCodeDTO);

        return ResponseUtil.wrapOrNotFound(
                result,
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, giftCodeDTO.getId().toString()));
    }

    /**
     * {@code GET  /gift-codes} : get all the giftCodes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of giftCodes in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<List<GiftCodeDTO>> getAllGiftCodes(
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of GiftCodes");
        Page<GiftCodeDTO> page = giftCodeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /gift-codes/:id} : get the "id" giftCode.
     *
     * @param id the id of the giftCodeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the giftCodeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<GiftCodeDTO> getGiftCode(@PathVariable("id") Long id) {
        log.debug("REST request to get GiftCode : {}", id);
        Optional<GiftCodeDTO> giftCodeDTO = giftCodeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(giftCodeDTO);
    }

    /**
     * {@code DELETE  /gift-codes/:id} : delete the "id" giftCode.
     *
     * @param id the id of the giftCodeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (No Content)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteGiftCode(@PathVariable("id") Long id) {
        log.debug("REST request to delete GiftCode : {}", id);
        giftCodeService.delete(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    /**
     * {@code POST  /gift-codes/generate} : Generate a new gift code for course
     * enrollment.
     *
     * @param courseId     the course ID
     * @param validityDays number of days the code should be valid
     * @param maxUses      maximum number of uses (optional)
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new giftCodeDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/generate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<GiftCodeDTO> generateGiftCode(
            @RequestParam Long courseId,
            @RequestParam(defaultValue = "30") Integer validityDays,
            @RequestParam(required = false) Integer maxUses,
            @RequestParam Long createdByUserId) throws URISyntaxException {
        log.debug("REST request to generate GiftCode for course: {}", courseId);

        GiftCodeDTO giftCodeDTO = giftCodeService.generateCourseAccessCode(courseId, validityDays, maxUses,
                createdByUserId);

        return ResponseEntity.created(new URI("/api/gift-codes/" + giftCodeDTO.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        giftCodeDTO.getId().toString()))
                .body(giftCodeDTO);
    }

    /**
     * {@code POST  /gift-codes/redeem} : Redeem a gift code for student enrollment.
     *
     * @param redemptionRequest the redemption request containing code and student
     *                          info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the redemption result.
     */
    @PostMapping("/redeem")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<GiftCodeRedemptionDTO> redeemGiftCode(
            @Valid @RequestBody GiftCodeRedemptionDTO redemptionRequest) {
        log.debug("REST request to redeem GiftCode: {}", redemptionRequest.getCode());

        // For now, we'll extract student ID from the request
        // In a real implementation, you might get this from the security context
        GiftCodeRedemptionDTO result = giftCodeService.redeemGiftCode(
                redemptionRequest.getCode(),
                redemptionRequest.getStudentId());

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /gift-codes/validate/:code} : Validate a gift code without
     * redeeming it.
     *
     * @param code the gift code to validate
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the validation result.
     */
    @GetMapping("/validate/{code}")
    public ResponseEntity<Boolean> validateGiftCode(@PathVariable String code) {
        log.debug("REST request to validate GiftCode: {}", code);
        boolean isValid = giftCodeService.validateGiftCode(code);
        return ResponseEntity.ok().body(isValid);
    }

    /**
     * {@code PUT  /gift-codes/expire/:code} : Expire a gift code manually.
     *
     * @param code the gift code to expire
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/expire/{code}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<Void> expireGiftCode(@PathVariable String code) {
        log.debug("REST request to expire GiftCode: {}", code);
        giftCodeService.expireGiftCode(code);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Gift code expired successfully", code))
                .build();
    }

    /**
     * {@code GET  /gift-codes/by-user/:userId} : Get all gift codes created by a
     * specific user.
     *
     * @param userId the user ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the list of gift codes.
     */
    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<List<GiftCodeDTO>> getGiftCodesByUser(@PathVariable Long userId) {
        log.debug("REST request to get GiftCodes by user: {}", userId);
        List<GiftCodeDTO> giftCodes = giftCodeService.findByCreatedByUserId(userId);
        return ResponseEntity.ok().body(giftCodes);
    }

    /**
     * {@code GET  /gift-codes/by-course/:courseId} : Get all active gift codes for
     * a specific course.
     *
     * @param courseId the course ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the list of gift codes.
     */
    @GetMapping("/by-course/{courseId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<List<GiftCodeDTO>> getGiftCodesByCourse(@PathVariable Long courseId) {
        log.debug("REST request to get GiftCodes by course: {}", courseId);
        List<GiftCodeDTO> giftCodes = giftCodeService.findActiveByCourseId(courseId);
        return ResponseEntity.ok().body(giftCodes);
    }

    /**
     * {@code POST  /gift-codes/cleanup/expired} : Clean up expired gift codes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the number of codes cleaned up.
     */
    @PostMapping("/cleanup/expired")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Integer> cleanupExpiredCodes() {
        log.debug("REST request to cleanup expired GiftCodes");
        int cleanedUp = giftCodeService.cleanupExpiredCodes();
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Cleaned up expired gift codes",
                        String.valueOf(cleanedUp)))
                .body(cleanedUp);
    }

    /**
     * {@code POST  /gift-codes/cleanup/usage-limit} : Clean up gift codes that have
     * reached their usage limit.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the number of codes cleaned up.
     */
    @PostMapping("/cleanup/usage-limit")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Integer> cleanupCodesAtUsageLimit() {
        log.debug("REST request to cleanup GiftCodes at usage limit");
        int cleanedUp = giftCodeService.cleanupCodesAtUsageLimit();
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Cleaned up gift codes at usage limit",
                        String.valueOf(cleanedUp)))
                .body(cleanedUp);
    }
}