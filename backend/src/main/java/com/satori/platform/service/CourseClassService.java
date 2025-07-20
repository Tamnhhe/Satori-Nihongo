package com.satori.platform.service;

import com.satori.platform.domain.CourseClass;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.service.dto.CourseClassDTO;
import com.satori.platform.service.mapper.CourseClassMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.CourseClass}.
 */
@Service
@Transactional
public class CourseClassService {

    private static final Logger LOG = LoggerFactory.getLogger(CourseClassService.class);

    private final CourseClassRepository courseClassRepository;

    private final CourseClassMapper courseClassMapper;

    public CourseClassService(CourseClassRepository courseClassRepository, CourseClassMapper courseClassMapper) {
        this.courseClassRepository = courseClassRepository;
        this.courseClassMapper = courseClassMapper;
    }

    /**
     * Save a courseClass.
     *
     * @param courseClassDTO the entity to save.
     * @return the persisted entity.
     */
    public CourseClassDTO save(CourseClassDTO courseClassDTO) {
        LOG.debug("Request to save CourseClass : {}", courseClassDTO);
        CourseClass courseClass = courseClassMapper.toEntity(courseClassDTO);
        courseClass = courseClassRepository.save(courseClass);
        return courseClassMapper.toDto(courseClass);
    }

    /**
     * Update a courseClass.
     *
     * @param courseClassDTO the entity to save.
     * @return the persisted entity.
     */
    public CourseClassDTO update(CourseClassDTO courseClassDTO) {
        LOG.debug("Request to update CourseClass : {}", courseClassDTO);
        CourseClass courseClass = courseClassMapper.toEntity(courseClassDTO);
        courseClass = courseClassRepository.save(courseClass);
        return courseClassMapper.toDto(courseClass);
    }

    /**
     * Partially update a courseClass.
     *
     * @param courseClassDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CourseClassDTO> partialUpdate(CourseClassDTO courseClassDTO) {
        LOG.debug("Request to partially update CourseClass : {}", courseClassDTO);

        return courseClassRepository
            .findById(courseClassDTO.getId())
            .map(existingCourseClass -> {
                courseClassMapper.partialUpdate(existingCourseClass, courseClassDTO);

                return existingCourseClass;
            })
            .map(courseClassRepository::save)
            .map(courseClassMapper::toDto);
    }

    /**
     * Get all the courseClasses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CourseClassDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all CourseClasses");
        return courseClassRepository.findAll(pageable).map(courseClassMapper::toDto);
    }

    /**
     * Get all the courseClasses with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<CourseClassDTO> findAllWithEagerRelationships(Pageable pageable) {
        return courseClassRepository.findAllWithEagerRelationships(pageable).map(courseClassMapper::toDto);
    }

    /**
     * Get one courseClass by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CourseClassDTO> findOne(Long id) {
        LOG.debug("Request to get CourseClass : {}", id);
        return courseClassRepository.findOneWithEagerRelationships(id).map(courseClassMapper::toDto);
    }

    /**
     * Delete the courseClass by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete CourseClass : {}", id);
        courseClassRepository.deleteById(id);
    }
}
