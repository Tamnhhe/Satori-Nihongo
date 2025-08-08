package com.satori.platform.service;

import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.service.dto.QuizQuestionDTO;
import com.satori.platform.service.mapper.QuizQuestionMapper;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing
 * {@link com.satori.platform.domain.QuizQuestion}.
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

    /**
     * Get all questions for a quiz ordered by position.
     *
     * @param quizId the quiz id.
     * @return the list of questions ordered by position.
     */
    @Transactional(readOnly = true)
    public List<QuizQuestionDTO> findByQuizIdOrderByPosition(Long quizId) {
        LOG.debug("Request to get QuizQuestions for quiz : {} ordered by position", quizId);
        return quizQuestionRepository.findByQuizIdOrderByPosition(quizId)
                .stream()
                .map(quizQuestionMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Add a question to a quiz at a specific position.
     *
     * @param quizQuestionDTO the question to add.
     * @return the saved question.
     */
    @Transactional
    public QuizQuestionDTO addQuestionAtPosition(QuizQuestionDTO quizQuestionDTO) {
        LOG.debug("Request to add QuizQuestion at position : {}", quizQuestionDTO);

        Long quizId = quizQuestionDTO.getQuiz().getId();
        Integer targetPosition = quizQuestionDTO.getPosition();

        // If no position specified, add at the end
        if (targetPosition == null) {
            Optional<Integer> maxPosition = quizQuestionRepository.findMaxPositionByQuizId(quizId);
            targetPosition = maxPosition.orElse(0) + 1;
            quizQuestionDTO.setPosition(targetPosition);
        } else {
            // Shift existing questions to make room
            shiftQuestionsDown(quizId, targetPosition);
        }

        QuizQuestion quizQuestion = quizQuestionMapper.toEntity(quizQuestionDTO);
        quizQuestion = quizQuestionRepository.save(quizQuestion);
        return quizQuestionMapper.toDto(quizQuestion);
    }

    /**
     * Move a question to a new position within the quiz.
     *
     * @param questionId  the question id.
     * @param newPosition the new position.
     * @return the updated question.
     */
    @Transactional
    public QuizQuestionDTO moveQuestionToPosition(Long questionId, Integer newPosition) {
        LOG.debug("Request to move QuizQuestion : {} to position : {}", questionId, newPosition);

        QuizQuestion question = quizQuestionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("QuizQuestion not found with id: " + questionId));

        Long quizId = question.getQuiz().getId();
        Integer currentPosition = question.getPosition();

        if (currentPosition.equals(newPosition)) {
            return quizQuestionMapper.toDto(question);
        }

        // Reorder questions
        reorderQuestions(quizId, currentPosition, newPosition);

        // Update the moved question
        question.setPosition(newPosition);
        question = quizQuestionRepository.save(question);

        return quizQuestionMapper.toDto(question);
    }

    /**
     * Remove a question and reorder remaining questions.
     *
     * @param questionId the question id to remove.
     */
    @Transactional
    public void removeQuestionAndReorder(Long questionId) {
        LOG.debug("Request to remove QuizQuestion and reorder : {}", questionId);

        QuizQuestion question = quizQuestionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("QuizQuestion not found with id: " + questionId));

        Long quizId = question.getQuiz().getId();
        Integer removedPosition = question.getPosition();

        // Delete the question
        quizQuestionRepository.deleteById(questionId);

        // Shift remaining questions up
        shiftQuestionsUp(quizId, removedPosition);
    }

    /**
     * Reorder all questions in a quiz based on provided question IDs.
     *
     * @param quizId             the quiz id.
     * @param orderedQuestionIds the list of question IDs in desired order.
     */
    @Transactional
    public void reorderQuestions(Long quizId, List<Long> orderedQuestionIds) {
        LOG.debug("Request to reorder questions for quiz : {} with order : {}", quizId, orderedQuestionIds);

        for (int i = 0; i < orderedQuestionIds.size(); i++) {
            Long questionId = orderedQuestionIds.get(i);
            Optional<QuizQuestion> questionOpt = quizQuestionRepository.findById(questionId);

            if (questionOpt.isPresent()) {
                QuizQuestion question = questionOpt.get();
                if (!question.getQuiz().getId().equals(quizId)) {
                    throw new IllegalArgumentException("Question " + questionId + " does not belong to quiz " + quizId);
                }
                question.setPosition(i + 1);
                quizQuestionRepository.save(question);
            }
        }
    }

    /**
     * Get the next available position for a quiz.
     *
     * @param quizId the quiz id.
     * @return the next available position.
     */
    @Transactional(readOnly = true)
    public Integer getNextPosition(Long quizId) {
        LOG.debug("Request to get next position for quiz : {}", quizId);
        Optional<Integer> maxPosition = quizQuestionRepository.findMaxPositionByQuizId(quizId);
        return maxPosition.orElse(0) + 1;
    }

    /**
     * Count questions in a quiz.
     *
     * @param quizId the quiz id.
     * @return the number of questions.
     */
    @Transactional(readOnly = true)
    public Long countByQuizId(Long quizId) {
        LOG.debug("Request to count questions for quiz : {}", quizId);
        return quizQuestionRepository.countByQuizId(quizId);
    }

    /**
     * Validate question ordering for a quiz.
     *
     * @param quizId the quiz id.
     * @return validation result with any ordering issues.
     */
    @Transactional(readOnly = true)
    public List<String> validateQuestionOrdering(Long quizId) {
        LOG.debug("Request to validate question ordering for quiz : {}", quizId);

        List<String> issues = new ArrayList<>();
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByPosition(quizId);

        if (questions.isEmpty()) {
            return issues;
        }

        // Check for duplicate positions
        Set<Integer> positions = new HashSet<>();
        for (QuizQuestion question : questions) {
            if (!positions.add(question.getPosition())) {
                issues.add("Duplicate position found: " + question.getPosition());
            }
        }

        // Check for gaps in positions
        List<Integer> sortedPositions = questions.stream()
                .map(QuizQuestion::getPosition)
                .sorted()
                .collect(Collectors.toList());

        for (int i = 0; i < sortedPositions.size(); i++) {
            if (sortedPositions.get(i) != i + 1) {
                issues.add("Gap in positions detected - expected position " + (i + 1) + " but found "
                        + sortedPositions.get(i));
            }
        }

        return issues;
    }

    /**
     * Fix question ordering by reassigning positions sequentially.
     *
     * @param quizId the quiz id.
     * @return the number of questions reordered.
     */
    @Transactional
    public int fixQuestionOrdering(Long quizId) {
        LOG.debug("Request to fix question ordering for quiz : {}", quizId);

        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByPosition(quizId);

        for (int i = 0; i < questions.size(); i++) {
            QuizQuestion question = questions.get(i);
            int expectedPosition = i + 1;
            if (question.getPosition() != expectedPosition) {
                question.setPosition(expectedPosition);
                quizQuestionRepository.save(question);
            }
        }

        return questions.size();
    }

    /**
     * Bulk update question positions.
     *
     * @param quizId          the quiz id.
     * @param positionUpdates map of question ID to new position.
     */
    @Transactional
    public void bulkUpdatePositions(Long quizId, Map<Long, Integer> positionUpdates) {
        LOG.debug("Request to bulk update positions for quiz : {} with updates : {}", quizId, positionUpdates);

        for (Map.Entry<Long, Integer> entry : positionUpdates.entrySet()) {
            Long questionId = entry.getKey();
            Integer newPosition = entry.getValue();

            Optional<QuizQuestion> questionOpt = quizQuestionRepository.findById(questionId);
            if (questionOpt.isPresent()) {
                QuizQuestion question = questionOpt.get();
                if (!question.getQuiz().getId().equals(quizId)) {
                    throw new IllegalArgumentException("Question " + questionId + " does not belong to quiz " + quizId);
                }
                question.setPosition(newPosition);
                quizQuestionRepository.save(question);
            }
        }
    }

    // Private helper methods

    private void shiftQuestionsDown(Long quizId, Integer fromPosition) {
        List<QuizQuestion> questionsToShift = quizQuestionRepository
                .findByQuizIdAndPositionGreaterThanEqual(quizId, fromPosition);

        for (QuizQuestion question : questionsToShift) {
            question.setPosition(question.getPosition() + 1);
            quizQuestionRepository.save(question);
        }
    }

    private void shiftQuestionsUp(Long quizId, Integer fromPosition) {
        List<QuizQuestion> questionsToShift = quizQuestionRepository
                .findByQuizIdAndPositionGreaterThanEqual(quizId, fromPosition + 1);

        for (QuizQuestion question : questionsToShift) {
            question.setPosition(question.getPosition() - 1);
            quizQuestionRepository.save(question);
        }
    }

    private void reorderQuestions(Long quizId, Integer oldPosition, Integer newPosition) {
        if (oldPosition < newPosition) {
            // Moving down: shift questions up between old and new position
            List<QuizQuestion> questionsToShift = quizQuestionRepository
                    .findByQuizIdAndPositionGreaterThanEqual(quizId, oldPosition + 1);

            for (QuizQuestion question : questionsToShift) {
                if (question.getPosition() <= newPosition) {
                    question.setPosition(question.getPosition() - 1);
                    quizQuestionRepository.save(question);
                }
            }
        } else {
            // Moving up: shift questions down between new and old position
            List<QuizQuestion> questionsToShift = quizQuestionRepository
                    .findByQuizIdAndPositionGreaterThanEqual(quizId, newPosition);

            for (QuizQuestion question : questionsToShift) {
                if (question.getPosition() < oldPosition) {
                    question.setPosition(question.getPosition() + 1);
                    quizQuestionRepository.save(question);
                }
            }
        }
    }
}
