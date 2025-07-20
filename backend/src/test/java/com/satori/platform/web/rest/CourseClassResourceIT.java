package com.satori.platform.web.rest;

import static com.satori.platform.domain.CourseClassAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.service.CourseClassService;
import com.satori.platform.service.dto.CourseClassDTO;
import com.satori.platform.service.mapper.CourseClassMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CourseClassResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CourseClassResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    private static final String ENTITY_API_URL = "/api/course-classes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Mock
    private CourseClassRepository courseClassRepositoryMock;

    @Autowired
    private CourseClassMapper courseClassMapper;

    @Mock
    private CourseClassService courseClassServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCourseClassMockMvc;

    private CourseClass courseClass;

    private CourseClass insertedCourseClass;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseClass createEntity() {
        return new CourseClass()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .capacity(DEFAULT_CAPACITY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseClass createUpdatedEntity() {
        return new CourseClass()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .capacity(UPDATED_CAPACITY);
    }

    @BeforeEach
    void initTest() {
        courseClass = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCourseClass != null) {
            courseClassRepository.delete(insertedCourseClass);
            insertedCourseClass = null;
        }
    }

    @Test
    @Transactional
    void createCourseClass() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);
        var returnedCourseClassDTO = om.readValue(
            restCourseClassMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CourseClassDTO.class
        );

        // Validate the CourseClass in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedCourseClass = courseClassMapper.toEntity(returnedCourseClassDTO);
        assertCourseClassUpdatableFieldsEquals(returnedCourseClass, getPersistedCourseClass(returnedCourseClass));

        insertedCourseClass = returnedCourseClass;
    }

    @Test
    @Transactional
    void createCourseClassWithExistingId() throws Exception {
        // Create the CourseClass with an existing ID
        courseClass.setId(1L);
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCourseClassMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isBadRequest());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        courseClass.setCode(null);

        // Create the CourseClass, which fails.
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        restCourseClassMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        courseClass.setName(null);

        // Create the CourseClass, which fails.
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        restCourseClassMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        courseClass.setStartDate(null);

        // Create the CourseClass, which fails.
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        restCourseClassMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        courseClass.setEndDate(null);

        // Create the CourseClass, which fails.
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        restCourseClassMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCourseClasses() throws Exception {
        // Initialize the database
        insertedCourseClass = courseClassRepository.saveAndFlush(courseClass);

        // Get all the courseClassList
        restCourseClassMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(courseClass.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCourseClassesWithEagerRelationshipsIsEnabled() throws Exception {
        when(courseClassServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCourseClassMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(courseClassServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCourseClassesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(courseClassServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCourseClassMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(courseClassRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCourseClass() throws Exception {
        // Initialize the database
        insertedCourseClass = courseClassRepository.saveAndFlush(courseClass);

        // Get the courseClass
        restCourseClassMockMvc
            .perform(get(ENTITY_API_URL_ID, courseClass.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(courseClass.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY));
    }

    @Test
    @Transactional
    void getNonExistingCourseClass() throws Exception {
        // Get the courseClass
        restCourseClassMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCourseClass() throws Exception {
        // Initialize the database
        insertedCourseClass = courseClassRepository.saveAndFlush(courseClass);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the courseClass
        CourseClass updatedCourseClass = courseClassRepository.findById(courseClass.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCourseClass are not directly saved in db
        em.detach(updatedCourseClass);
        updatedCourseClass
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .capacity(UPDATED_CAPACITY);
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(updatedCourseClass);

        restCourseClassMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courseClassDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(courseClassDTO))
            )
            .andExpect(status().isOk());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCourseClassToMatchAllProperties(updatedCourseClass);
    }

    @Test
    @Transactional
    void putNonExistingCourseClass() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseClass.setId(longCount.incrementAndGet());

        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseClassMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courseClassDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(courseClassDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCourseClass() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseClass.setId(longCount.incrementAndGet());

        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseClassMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(courseClassDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCourseClass() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseClass.setId(longCount.incrementAndGet());

        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseClassMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCourseClassWithPatch() throws Exception {
        // Initialize the database
        insertedCourseClass = courseClassRepository.saveAndFlush(courseClass);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the courseClass using partial update
        CourseClass partialUpdatedCourseClass = new CourseClass();
        partialUpdatedCourseClass.setId(courseClass.getId());

        partialUpdatedCourseClass.code(UPDATED_CODE).description(UPDATED_DESCRIPTION).endDate(UPDATED_END_DATE);

        restCourseClassMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseClass.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCourseClass))
            )
            .andExpect(status().isOk());

        // Validate the CourseClass in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCourseClassUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCourseClass, courseClass),
            getPersistedCourseClass(courseClass)
        );
    }

    @Test
    @Transactional
    void fullUpdateCourseClassWithPatch() throws Exception {
        // Initialize the database
        insertedCourseClass = courseClassRepository.saveAndFlush(courseClass);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the courseClass using partial update
        CourseClass partialUpdatedCourseClass = new CourseClass();
        partialUpdatedCourseClass.setId(courseClass.getId());

        partialUpdatedCourseClass
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .capacity(UPDATED_CAPACITY);

        restCourseClassMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseClass.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCourseClass))
            )
            .andExpect(status().isOk());

        // Validate the CourseClass in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCourseClassUpdatableFieldsEquals(partialUpdatedCourseClass, getPersistedCourseClass(partialUpdatedCourseClass));
    }

    @Test
    @Transactional
    void patchNonExistingCourseClass() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseClass.setId(longCount.incrementAndGet());

        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseClassMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, courseClassDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(courseClassDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCourseClass() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseClass.setId(longCount.incrementAndGet());

        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseClassMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(courseClassDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCourseClass() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        courseClass.setId(longCount.incrementAndGet());

        // Create the CourseClass
        CourseClassDTO courseClassDTO = courseClassMapper.toDto(courseClass);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseClassMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(courseClassDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseClass in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCourseClass() throws Exception {
        // Initialize the database
        insertedCourseClass = courseClassRepository.saveAndFlush(courseClass);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the courseClass
        restCourseClassMockMvc
            .perform(delete(ENTITY_API_URL_ID, courseClass.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return courseClassRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected CourseClass getPersistedCourseClass(CourseClass courseClass) {
        return courseClassRepository.findById(courseClass.getId()).orElseThrow();
    }

    protected void assertPersistedCourseClassToMatchAllProperties(CourseClass expectedCourseClass) {
        assertCourseClassAllPropertiesEquals(expectedCourseClass, getPersistedCourseClass(expectedCourseClass));
    }

    protected void assertPersistedCourseClassToMatchUpdatableProperties(CourseClass expectedCourseClass) {
        assertCourseClassAllUpdatablePropertiesEquals(expectedCourseClass, getPersistedCourseClass(expectedCourseClass));
    }
}
