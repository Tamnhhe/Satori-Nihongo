package com.satori.platform.service;

import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.service.dto.QuizQuestionDTO;
import com.satori.platform.service.mapper.QuizQuestionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.QuizQuestion}.
 */
@Service
@Transactional
public class QuizQuestionService {

    private static final Logger LOG = LoggerFactory.getLogger(QuizQuestionService.class);

    private final QuizQuestionRepository quizQuestionRepository;

    private final QuizQuestionMapper quizQuestionMapper;

    public QuizQuestionService(QuizQuestionRepository quizQuestionRepository, QuizQuestionMapper quizQuestionMapper) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizQuestionMapper = quizQuestionMapper;
    }

    /**
     * Save a quizQuestion.
     *
     * @param quizQuestionDTO the entity to save.
     * @return the persisted entity.
     */
    public QuizQuestionDTO save(QuizQuestionDTO quizQuestionDTO) {
        LOG.debug("Request to save QuizQuestion : {}", quizQuestionDTO);
        QuizQuestion quizQuestion = quizQuestionMapper.toEntity(quizQuestionDTO);
        quizQuestion = quizQuestionRepository.save(quizQuestion);
        return quizQuestionMapper.toDto(quizQuestion);
    }

    /**
     * Update a quizQuestion.
     *
     * @param quizQuestionDTO the entity to save.
     * @return the persisted entity.
     */
    public QuizQuestionDTO update(QuizQuestionDTO quizQuestionDTO) {
        LOG.debug("Request to update QuizQuestion : {}", quizQuestionDTO);
        QuizQuestion quizQuestion = quizQuestionMapper.toEntity(quizQuestionDTO);
        quizQuestion = quizQuestionRepository.save(quizQuestion);
        return quizQuestionMapper.toDto(quizQuestion);
    }

    /**
     * Partially update a quizQuestion.
     *
     * @param quizQuestionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<QuizQuestionDTO> partialUpdate(QuizQuestionDTO quizQuestionDTO) {
        LOG.debug("Request to partially update QuizQuestion : {}", quizQuestionDTO);

        return quizQuestionRepository
            .findById(quizQuestionDTO.getId())
            .map(existingQuizQuestion -> {
                quizQuestionMapper.partialUpdate(existingQuizQuestion, quizQuestionDTO);

                return existingQuizQuestion;
            })
            .map(quizQuestionRepository::save)
            .map(quizQuestionMapper::toDto);
    }

    /**
     * Get all the quizQuestions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuizQuestionDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all QuizQuestions");
        return quizQuestionRepository.findAll(pageable).map(quizQuestionMapper::toDto);
    }

    /**
     * Get one quizQuestion by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuizQuestionDTO> findOne(Long id) {
        LOG.debug("Request to get QuizQuestion : {}", id);
        return quizQuestionRepository.findById(id).map(quizQuestionMapper::toDto);
    }

    /**
     * Delete the quizQuestion by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete QuizQuestion : {}", id);
        quizQuestionRepository.deleteById(id);
    }
}
