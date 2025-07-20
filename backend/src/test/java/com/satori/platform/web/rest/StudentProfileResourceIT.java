package com.satori.platform.web.rest;

import static com.satori.platform.domain.StudentProfileAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.mapper.StudentProfileMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StudentProfileResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StudentProfileResourceIT {

    private static final String DEFAULT_STUDENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_STUDENT_ID = "BBBBBBBBBB";

    private static final Double DEFAULT_GPA = 1D;
    private static final Double UPDATED_GPA = 2D;

    private static final String ENTITY_API_URL = "/api/student-profiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentProfileMapper studentProfileMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudentProfileMockMvc;

    private StudentProfile studentProfile;

    private StudentProfile insertedStudentProfile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentProfile createEntity() {
        return new StudentProfile().studentId(DEFAULT_STUDENT_ID).gpa(DEFAULT_GPA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentProfile createUpdatedEntity() {
        return new StudentProfile().studentId(UPDATED_STUDENT_ID).gpa(UPDATED_GPA);
    }

    @BeforeEach
    void initTest() {
        studentProfile = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedStudentProfile != null) {
            studentProfileRepository.delete(insertedStudentProfile);
            insertedStudentProfile = null;
        }
    }

    @Test
    @Transactional
    void createStudentProfile() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);
        var returnedStudentProfileDTO = om.readValue(
            restStudentProfileMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentProfileDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            StudentProfileDTO.class
        );

        // Validate the StudentProfile in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedStudentProfile = studentProfileMapper.toEntity(returnedStudentProfileDTO);
        assertStudentProfileUpdatableFieldsEquals(returnedStudentProfile, getPersistedStudentProfile(returnedStudentProfile));

        insertedStudentProfile = returnedStudentProfile;
    }

    @Test
    @Transactional
    void createStudentProfileWithExistingId() throws Exception {
        // Create the StudentProfile with an existing ID
        studentProfile.setId(1L);
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudentProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentProfileDTO)))
            .andExpect(status().isBadRequest());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStudentIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        studentProfile.setStudentId(null);

        // Create the StudentProfile, which fails.
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        restStudentProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentProfileDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStudentProfiles() throws Exception {
        // Initialize the database
        insertedStudentProfile = studentProfileRepository.saveAndFlush(studentProfile);

        // Get all the studentProfileList
        restStudentProfileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studentProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].studentId").value(hasItem(DEFAULT_STUDENT_ID)))
            .andExpect(jsonPath("$.[*].gpa").value(hasItem(DEFAULT_GPA)));
    }

    @Test
    @Transactional
    void getStudentProfile() throws Exception {
        // Initialize the database
        insertedStudentProfile = studentProfileRepository.saveAndFlush(studentProfile);

        // Get the studentProfile
        restStudentProfileMockMvc
            .perform(get(ENTITY_API_URL_ID, studentProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(studentProfile.getId().intValue()))
            .andExpect(jsonPath("$.studentId").value(DEFAULT_STUDENT_ID))
            .andExpect(jsonPath("$.gpa").value(DEFAULT_GPA));
    }

    @Test
    @Transactional
    void getNonExistingStudentProfile() throws Exception {
        // Get the studentProfile
        restStudentProfileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStudentProfile() throws Exception {
        // Initialize the database
        insertedStudentProfile = studentProfileRepository.saveAndFlush(studentProfile);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the studentProfile
        StudentProfile updatedStudentProfile = studentProfileRepository.findById(studentProfile.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStudentProfile are not directly saved in db
        em.detach(updatedStudentProfile);
        updatedStudentProfile.studentId(UPDATED_STUDENT_ID).gpa(UPDATED_GPA);
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(updatedStudentProfile);

        restStudentProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentProfileDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(studentProfileDTO))
            )
            .andExpect(status().isOk());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedStudentProfileToMatchAllProperties(updatedStudentProfile);
    }

    @Test
    @Transactional
    void putNonExistingStudentProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentProfile.setId(longCount.incrementAndGet());

        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentProfileDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(studentProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStudentProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentProfile.setId(longCount.incrementAndGet());

        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(studentProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStudentProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentProfile.setId(longCount.incrementAndGet());

        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentProfileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentProfileDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStudentProfileWithPatch() throws Exception {
        // Initialize the database
        insertedStudentProfile = studentProfileRepository.saveAndFlush(studentProfile);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the studentProfile using partial update
        StudentProfile partialUpdatedStudentProfile = new StudentProfile();
        partialUpdatedStudentProfile.setId(studentProfile.getId());

        restStudentProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStudentProfile))
            )
            .andExpect(status().isOk());

        // Validate the StudentProfile in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStudentProfileUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedStudentProfile, studentProfile),
            getPersistedStudentProfile(studentProfile)
        );
    }

    @Test
    @Transactional
    void fullUpdateStudentProfileWithPatch() throws Exception {
        // Initialize the database
        insertedStudentProfile = studentProfileRepository.saveAndFlush(studentProfile);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the studentProfile using partial update
        StudentProfile partialUpdatedStudentProfile = new StudentProfile();
        partialUpdatedStudentProfile.setId(studentProfile.getId());

        partialUpdatedStudentProfile.studentId(UPDATED_STUDENT_ID).gpa(UPDATED_GPA);

        restStudentProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStudentProfile))
            )
            .andExpect(status().isOk());

        // Validate the StudentProfile in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStudentProfileUpdatableFieldsEquals(partialUpdatedStudentProfile, getPersistedStudentProfile(partialUpdatedStudentProfile));
    }

    @Test
    @Transactional
    void patchNonExistingStudentProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentProfile.setId(longCount.incrementAndGet());

        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, studentProfileDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(studentProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStudentProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentProfile.setId(longCount.incrementAndGet());

        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(studentProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStudentProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentProfile.setId(longCount.incrementAndGet());

        // Create the StudentProfile
        StudentProfileDTO studentProfileDTO = studentProfileMapper.toDto(studentProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentProfileMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(studentProfileDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStudentProfile() throws Exception {
        // Initialize the database
        insertedStudentProfile = studentProfileRepository.saveAndFlush(studentProfile);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the studentProfile
        restStudentProfileMockMvc
            .perform(delete(ENTITY_API_URL_ID, studentProfile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return studentProfileRepository.count();
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

    protected StudentProfile getPersistedStudentProfile(StudentProfile studentProfile) {
        return studentProfileRepository.findById(studentProfile.getId()).orElseThrow();
    }

    protected void assertPersistedStudentProfileToMatchAllProperties(StudentProfile expectedStudentProfile) {
        assertStudentProfileAllPropertiesEquals(expectedStudentProfile, getPersistedStudentProfile(expectedStudentProfile));
    }

    protected void assertPersistedStudentProfileToMatchUpdatableProperties(StudentProfile expectedStudentProfile) {
        assertStudentProfileAllUpdatablePropertiesEquals(expectedStudentProfile, getPersistedStudentProfile(expectedStudentProfile));
    }
}
