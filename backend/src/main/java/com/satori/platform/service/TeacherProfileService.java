package com.satori.platform.service;

import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.service.dto.TeacherProfileDTO;
import com.satori.platform.service.mapper.TeacherProfileMapper;
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
 * Service Implementation for managing {@link com.satori.platform.domain.TeacherProfile}.
 */
@Service
@Transactional
public class TeacherProfileService {

    private static final Logger LOG = LoggerFactory.getLogger(TeacherProfileService.class);

    private final TeacherProfileRepository teacherProfileRepository;

    private final TeacherProfileMapper teacherProfileMapper;

    public TeacherProfileService(TeacherProfileRepository teacherProfileRepository, TeacherProfileMapper teacherProfileMapper) {
        this.teacherProfileRepository = teacherProfileRepository;
        this.teacherProfileMapper = teacherProfileMapper;
    }

    /**
     * Save a teacherProfile.
     *
     * @param teacherProfileDTO the entity to save.
     * @return the persisted entity.
     */
    public TeacherProfileDTO save(TeacherProfileDTO teacherProfileDTO) {
        LOG.debug("Request to save TeacherProfile : {}", teacherProfileDTO);
        TeacherProfile teacherProfile = teacherProfileMapper.toEntity(teacherProfileDTO);
        teacherProfile = teacherProfileRepository.save(teacherProfile);
        return teacherProfileMapper.toDto(teacherProfile);
    }

    /**
     * Update a teacherProfile.
     *
     * @param teacherProfileDTO the entity to save.
     * @return the persisted entity.
     */
    public TeacherProfileDTO update(TeacherProfileDTO teacherProfileDTO) {
        LOG.debug("Request to update TeacherProfile : {}", teacherProfileDTO);
        TeacherProfile teacherProfile = teacherProfileMapper.toEntity(teacherProfileDTO);
        teacherProfile = teacherProfileRepository.save(teacherProfile);
        return teacherProfileMapper.toDto(teacherProfile);
    }

    /**
     * Partially update a teacherProfile.
     *
     * @param teacherProfileDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TeacherProfileDTO> partialUpdate(TeacherProfileDTO teacherProfileDTO) {
        LOG.debug("Request to partially update TeacherProfile : {}", teacherProfileDTO);

        return teacherProfileRepository
            .findById(teacherProfileDTO.getId())
            .map(existingTeacherProfile -> {
                teacherProfileMapper.partialUpdate(existingTeacherProfile, teacherProfileDTO);

                return existingTeacherProfile;
            })
            .map(teacherProfileRepository::save)
            .map(teacherProfileMapper::toDto);
    }

    /**
     * Get all the teacherProfiles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TeacherProfileDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all TeacherProfiles");
        return teacherProfileRepository.findAll(pageable).map(teacherProfileMapper::toDto);
    }

    /**
     *  Get all the teacherProfiles where UserProfile is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TeacherProfileDTO> findAllWhereUserProfileIsNull() {
        LOG.debug("Request to get all teacherProfiles where UserProfile is null");
        return StreamSupport.stream(teacherProfileRepository.findAll().spliterator(), false)
            .filter(teacherProfile -> teacherProfile.getUserProfile() == null)
            .map(teacherProfileMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one teacherProfile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TeacherProfileDTO> findOne(Long id) {
        LOG.debug("Request to get TeacherProfile : {}", id);
        return teacherProfileRepository.findById(id).map(teacherProfileMapper::toDto);
    }

    /**
     * Delete the teacherProfile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TeacherProfile : {}", id);
        teacherProfileRepository.deleteById(id);
    }
}
