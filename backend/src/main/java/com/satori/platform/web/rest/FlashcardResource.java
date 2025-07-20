package com.satori.platform.web.rest;

import com.satori.platform.repository.FlashcardRepository;
import com.satori.platform.service.FlashcardService;
import com.satori.platform.service.dto.FlashcardDTO;
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
 * REST controller for managing {@link com.satori.platform.domain.Flashcard}.
 */
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardResource {

    private static final Logger LOG = LoggerFactory.getLogger(FlashcardResource.class);

    private static final String ENTITY_NAME = "flashcard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FlashcardService flashcardService;

    private final FlashcardRepository flashcardRepository;

    public FlashcardResource(FlashcardService flashcardService, FlashcardRepository flashcardRepository) {
        this.flashcardService = flashcardService;
        this.flashcardRepository = flashcardRepository;
    }

    /**
     * {@code POST  /flashcards} : Create a new flashcard.
     *
     * @param flashcardDTO the flashcardDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new flashcardDTO, or with status {@code 400 (Bad Request)} if the flashcard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<FlashcardDTO> createFlashcard(@Valid @RequestBody FlashcardDTO flashcardDTO) throws URISyntaxException {
        LOG.debug("REST request to save Flashcard : {}", flashcardDTO);
        if (flashcardDTO.getId() != null) {
            throw new BadRequestAlertException("A new flashcard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        flashcardDTO = flashcardService.save(flashcardDTO);
        return ResponseEntity.created(new URI("/api/flashcards/" + flashcardDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, flashcardDTO.getId().toString()))
            .body(flashcardDTO);
    }

    /**
     * {@code PUT  /flashcards/:id} : Updates an existing flashcard.
     *
     * @param id the id of the flashcardDTO to save.
     * @param flashcardDTO the flashcardDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated flashcardDTO,
     * or with status {@code 400 (Bad Request)} if the flashcardDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the flashcardDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<FlashcardDTO> updateFlashcard(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FlashcardDTO flashcardDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Flashcard : {}, {}", id, flashcardDTO);
        if (flashcardDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, flashcardDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!flashcardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        flashcardDTO = flashcardService.update(flashcardDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, flashcardDTO.getId().toString()))
            .body(flashcardDTO);
    }

    /**
     * {@code PATCH  /flashcards/:id} : Partial updates given fields of an existing flashcard, field will ignore if it is null
     *
     * @param id the id of the flashcardDTO to save.
     * @param flashcardDTO the flashcardDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated flashcardDTO,
     * or with status {@code 400 (Bad Request)} if the flashcardDTO is not valid,
     * or with status {@code 404 (Not Found)} if the flashcardDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the flashcardDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FlashcardDTO> partialUpdateFlashcard(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FlashcardDTO flashcardDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Flashcard partially : {}, {}", id, flashcardDTO);
        if (flashcardDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, flashcardDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!flashcardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FlashcardDTO> result = flashcardService.partialUpdate(flashcardDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, flashcardDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /flashcards} : get all the flashcards.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of flashcards in body.
     */
    @GetMapping("")
    public ResponseEntity<List<FlashcardDTO>> getAllFlashcards(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Flashcards");
        Page<FlashcardDTO> page = flashcardService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /flashcards/:id} : get the "id" flashcard.
     *
     * @param id the id of the flashcardDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the flashcardDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FlashcardDTO> getFlashcard(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Flashcard : {}", id);
        Optional<FlashcardDTO> flashcardDTO = flashcardService.findOne(id);
        return ResponseUtil.wrapOrNotFound(flashcardDTO);
    }

    /**
     * {@code DELETE  /flashcards/:id} : delete the "id" flashcard.
     *
     * @param id the id of the flashcardDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Flashcard : {}", id);
        flashcardService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
