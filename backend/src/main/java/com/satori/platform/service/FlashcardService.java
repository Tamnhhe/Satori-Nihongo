package com.satori.platform.service;

import com.satori.platform.domain.Flashcard;
import com.satori.platform.repository.FlashcardRepository;
import com.satori.platform.service.dto.FlashcardDTO;
import com.satori.platform.service.mapper.FlashcardMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.Flashcard}.
 */
@Service
@Transactional
public class FlashcardService {

    private static final Logger LOG = LoggerFactory.getLogger(FlashcardService.class);

    private final FlashcardRepository flashcardRepository;

    private final FlashcardMapper flashcardMapper;

    public FlashcardService(FlashcardRepository flashcardRepository, FlashcardMapper flashcardMapper) {
        this.flashcardRepository = flashcardRepository;
        this.flashcardMapper = flashcardMapper;
    }

    /**
     * Save a flashcard.
     *
     * @param flashcardDTO the entity to save.
     * @return the persisted entity.
     */
    public FlashcardDTO save(FlashcardDTO flashcardDTO) {
        LOG.debug("Request to save Flashcard : {}", flashcardDTO);
        Flashcard flashcard = flashcardMapper.toEntity(flashcardDTO);
        flashcard = flashcardRepository.save(flashcard);
        return flashcardMapper.toDto(flashcard);
    }

    /**
     * Update a flashcard.
     *
     * @param flashcardDTO the entity to save.
     * @return the persisted entity.
     */
    public FlashcardDTO update(FlashcardDTO flashcardDTO) {
        LOG.debug("Request to update Flashcard : {}", flashcardDTO);
        Flashcard flashcard = flashcardMapper.toEntity(flashcardDTO);
        flashcard = flashcardRepository.save(flashcard);
        return flashcardMapper.toDto(flashcard);
    }

    /**
     * Partially update a flashcard.
     *
     * @param flashcardDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FlashcardDTO> partialUpdate(FlashcardDTO flashcardDTO) {
        LOG.debug("Request to partially update Flashcard : {}", flashcardDTO);

        return flashcardRepository
            .findById(flashcardDTO.getId())
            .map(existingFlashcard -> {
                flashcardMapper.partialUpdate(existingFlashcard, flashcardDTO);

                return existingFlashcard;
            })
            .map(flashcardRepository::save)
            .map(flashcardMapper::toDto);
    }

    /**
     * Get all the flashcards.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FlashcardDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Flashcards");
        return flashcardRepository.findAll(pageable).map(flashcardMapper::toDto);
    }

    /**
     * Get one flashcard by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FlashcardDTO> findOne(Long id) {
        LOG.debug("Request to get Flashcard : {}", id);
        return flashcardRepository.findById(id).map(flashcardMapper::toDto);
    }

    /**
     * Delete the flashcard by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Flashcard : {}", id);
        flashcardRepository.deleteById(id);
    }
}
