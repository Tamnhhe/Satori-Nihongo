package com.satori.platform.service;

import com.satori.platform.domain.StudentProfile;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.mapper.StudentProfileMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.StudentProfile}.
 */
@Service
@Transactional
public class StudentProfileService {

    private static final Logger LOG = LoggerFactory.getLogger(StudentProfileService.class);

    private final StudentProfileRepository studentProfileRepository;

    private final StudentProfileMapper studentProfileMapper;

    public StudentProfileService(StudentProfileRepository studentProfileRepository, StudentProfileMapper studentProfileMapper) {
        this.studentProfileRepository = studentProfileRepository;
        this.studentProfileMapper = studentProfileMapper;
    }

    /**
     * Save a studentProfile.
     *
     * @param studentProfileDTO the entity to save.
     * @return the persisted entity.
     */
    public StudentProfileDTO save(StudentProfileDTO studentProfileDTO) {
        LOG.debug("Request to save StudentProfile : {}", studentProfileDTO);
        StudentProfile studentProfile = studentProfileMapper.toEntity(studentProfileDTO);
        studentProfile = studentProfileRepository.save(studentProfile);
        return studentProfileMapper.toDto(studentProfile);
    }

    /**
     * Update a studentProfile.
     *
     * @param studentProfileDTO the entity to save.
     * @return the persisted entity.
     */
    public StudentProfileDTO update(StudentProfileDTO studentProfileDTO) {
        LOG.debug("Request to update StudentProfile : {}", studentProfileDTO);
        StudentProfile studentProfile = studentProfileMapper.toEntity(studentProfileDTO);
        studentProfile = studentProfileRepository.save(studentProfile);
        return studentProfileMapper.toDto(studentProfile);
    }

    /**
     * Partially update a studentProfile.
     *
     * @param studentProfileDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StudentProfileDTO> partialUpdate(StudentProfileDTO studentProfileDTO) {
        LOG.debug("Request to partially update StudentProfile : {}", studentProfileDTO);

        return studentProfileRepository
            .findById(studentProfileDTO.getId())
            .map(existingStudentProfile -> {
                studentProfileMapper.partialUpdate(existingStudentProfile, studentProfileDTO);

                return existingStudentProfile;
            })
            .map(studentProfileRepository::save)
            .map(studentProfileMapper::toDto);
    }

    /**
     * Get all the studentProfiles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudentProfileDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StudentProfiles");
        return studentProfileRepository.findAll(pageable).map(studentProfileMapper::toDto);
    }

    /**
     *  Get all the studentProfiles where UserProfile is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<StudentProfileDTO> findAllWhereUserProfileIsNull() {
        LOG.debug("Request to get all studentProfiles where UserProfile is null");
        return StreamSupport.stream(studentProfileRepository.findAll().spliterator(), false)
            .filter(studentProfile -> studentProfile.getUserProfile() == null)
            .map(studentProfileMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one studentProfile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StudentProfileDTO> findOne(Long id) {
        LOG.debug("Request to get StudentProfile : {}", id);
        return studentProfileRepository.findById(id).map(studentProfileMapper::toDto);
    }

    /**
     * Delete the studentProfile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete StudentProfile : {}", id);
        studentProfileRepository.deleteById(id);
    }
}
