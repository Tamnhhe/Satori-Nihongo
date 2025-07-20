package com.satori.platform.service;

import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.service.dto.StudentQuizDTO;
import com.satori.platform.service.mapper.StudentQuizMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.StudentQuiz}.
 */
@Service
@Transactional
public class StudentQuizService {

    private static final Logger LOG = LoggerFactory.getLogger(StudentQuizService.class);

    private final StudentQuizRepository studentQuizRepository;

    private final StudentQuizMapper studentQuizMapper;

    public StudentQuizService(StudentQuizRepository studentQuizRepository, StudentQuizMapper studentQuizMapper) {
        this.studentQuizRepository = studentQuizRepository;
        this.studentQuizMapper = studentQuizMapper;
    }

    /**
     * Save a studentQuiz.
     *
     * @param studentQuizDTO the entity to save.
     * @return the persisted entity.
     */
    public StudentQuizDTO save(StudentQuizDTO studentQuizDTO) {
        LOG.debug("Request to save StudentQuiz : {}", studentQuizDTO);
        StudentQuiz studentQuiz = studentQuizMapper.toEntity(studentQuizDTO);
        studentQuiz = studentQuizRepository.save(studentQuiz);
        return studentQuizMapper.toDto(studentQuiz);
    }

    /**
     * Update a studentQuiz.
     *
     * @param studentQuizDTO the entity to save.
     * @return the persisted entity.
     */
    public StudentQuizDTO update(StudentQuizDTO studentQuizDTO) {
        LOG.debug("Request to update StudentQuiz : {}", studentQuizDTO);
        StudentQuiz studentQuiz = studentQuizMapper.toEntity(studentQuizDTO);
        studentQuiz = studentQuizRepository.save(studentQuiz);
        return studentQuizMapper.toDto(studentQuiz);
    }

    /**
     * Partially update a studentQuiz.
     *
     * @param studentQuizDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StudentQuizDTO> partialUpdate(StudentQuizDTO studentQuizDTO) {
        LOG.debug("Request to partially update StudentQuiz : {}", studentQuizDTO);

        return studentQuizRepository
            .findById(studentQuizDTO.getId())
            .map(existingStudentQuiz -> {
                studentQuizMapper.partialUpdate(existingStudentQuiz, studentQuizDTO);

                return existingStudentQuiz;
            })
            .map(studentQuizRepository::save)
            .map(studentQuizMapper::toDto);
    }

    /**
     * Get all the studentQuizs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudentQuizDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StudentQuizs");
        return studentQuizRepository.findAll(pageable).map(studentQuizMapper::toDto);
    }

    /**
     * Get one studentQuiz by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StudentQuizDTO> findOne(Long id) {
        LOG.debug("Request to get StudentQuiz : {}", id);
        return studentQuizRepository.findById(id).map(studentQuizMapper::toDto);
    }

    /**
     * Delete the studentQuiz by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete StudentQuiz : {}", id);
        studentQuizRepository.deleteById(id);
    }
}
