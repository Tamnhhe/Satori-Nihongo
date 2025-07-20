package com.satori.platform.web.rest;

import static com.satori.platform.domain.TeacherProfileAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.service.dto.TeacherProfileDTO;
import com.satori.platform.service.mapper.TeacherProfileMapper;
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
 * Integration tests for the {@link TeacherProfileResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TeacherProfileResourceIT {

    private static final String DEFAULT_TEACHER_CODE = "AAAAAAAAAA";
    private static final String UPDATED_TEACHER_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/teacher-profiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private TeacherProfileMapper teacherProfileMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeacherProfileMockMvc;

    private TeacherProfile teacherProfile;

    private TeacherProfile insertedTeacherProfile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TeacherProfile createEntity() {
        return new TeacherProfile().teacherCode(DEFAULT_TEACHER_CODE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TeacherProfile createUpdatedEntity() {
        return new TeacherProfile().teacherCode(UPDATED_TEACHER_CODE);
    }

    @BeforeEach
    void initTest() {
        teacherProfile = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedTeacherProfile != null) {
            teacherProfileRepository.delete(insertedTeacherProfile);
            insertedTeacherProfile = null;
        }
    }

    @Test
    @Transactional
    void createTeacherProfile() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);
        var returnedTeacherProfileDTO = om.readValue(
            restTeacherProfileMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(teacherProfileDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TeacherProfileDTO.class
        );

        // Validate the TeacherProfile in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedTeacherProfile = teacherProfileMapper.toEntity(returnedTeacherProfileDTO);
        assertTeacherProfileUpdatableFieldsEquals(returnedTeacherProfile, getPersistedTeacherProfile(returnedTeacherProfile));

        insertedTeacherProfile = returnedTeacherProfile;
    }

    @Test
    @Transactional
    void createTeacherProfileWithExistingId() throws Exception {
        // Create the TeacherProfile with an existing ID
        teacherProfile.setId(1L);
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeacherProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(teacherProfileDTO)))
            .andExpect(status().isBadRequest());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTeacherCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        teacherProfile.setTeacherCode(null);

        // Create the TeacherProfile, which fails.
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        restTeacherProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(teacherProfileDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTeacherProfiles() throws Exception {
        // Initialize the database
        insertedTeacherProfile = teacherProfileRepository.saveAndFlush(teacherProfile);

        // Get all the teacherProfileList
        restTeacherProfileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teacherProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].teacherCode").value(hasItem(DEFAULT_TEACHER_CODE)));
    }

    @Test
    @Transactional
    void getTeacherProfile() throws Exception {
        // Initialize the database
        insertedTeacherProfile = teacherProfileRepository.saveAndFlush(teacherProfile);

        // Get the teacherProfile
        restTeacherProfileMockMvc
            .perform(get(ENTITY_API_URL_ID, teacherProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teacherProfile.getId().intValue()))
            .andExpect(jsonPath("$.teacherCode").value(DEFAULT_TEACHER_CODE));
    }

    @Test
    @Transactional
    void getNonExistingTeacherProfile() throws Exception {
        // Get the teacherProfile
        restTeacherProfileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTeacherProfile() throws Exception {
        // Initialize the database
        insertedTeacherProfile = teacherProfileRepository.saveAndFlush(teacherProfile);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the teacherProfile
        TeacherProfile updatedTeacherProfile = teacherProfileRepository.findById(teacherProfile.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTeacherProfile are not directly saved in db
        em.detach(updatedTeacherProfile);
        updatedTeacherProfile.teacherCode(UPDATED_TEACHER_CODE);
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(updatedTeacherProfile);

        restTeacherProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teacherProfileDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(teacherProfileDTO))
            )
            .andExpect(status().isOk());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTeacherProfileToMatchAllProperties(updatedTeacherProfile);
    }

    @Test
    @Transactional
    void putNonExistingTeacherProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        teacherProfile.setId(longCount.incrementAndGet());

        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeacherProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teacherProfileDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(teacherProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTeacherProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        teacherProfile.setId(longCount.incrementAndGet());

        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeacherProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(teacherProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTeacherProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        teacherProfile.setId(longCount.incrementAndGet());

        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeacherProfileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(teacherProfileDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTeacherProfileWithPatch() throws Exception {
        // Initialize the database
        insertedTeacherProfile = teacherProfileRepository.saveAndFlush(teacherProfile);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the teacherProfile using partial update
        TeacherProfile partialUpdatedTeacherProfile = new TeacherProfile();
        partialUpdatedTeacherProfile.setId(teacherProfile.getId());

        restTeacherProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeacherProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTeacherProfile))
            )
            .andExpect(status().isOk());

        // Validate the TeacherProfile in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTeacherProfileUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTeacherProfile, teacherProfile),
            getPersistedTeacherProfile(teacherProfile)
        );
    }

    @Test
    @Transactional
    void fullUpdateTeacherProfileWithPatch() throws Exception {
        // Initialize the database
        insertedTeacherProfile = teacherProfileRepository.saveAndFlush(teacherProfile);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the teacherProfile using partial update
        TeacherProfile partialUpdatedTeacherProfile = new TeacherProfile();
        partialUpdatedTeacherProfile.setId(teacherProfile.getId());

        partialUpdatedTeacherProfile.teacherCode(UPDATED_TEACHER_CODE);

        restTeacherProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeacherProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTeacherProfile))
            )
            .andExpect(status().isOk());

        // Validate the TeacherProfile in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTeacherProfileUpdatableFieldsEquals(partialUpdatedTeacherProfile, getPersistedTeacherProfile(partialUpdatedTeacherProfile));
    }

    @Test
    @Transactional
    void patchNonExistingTeacherProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        teacherProfile.setId(longCount.incrementAndGet());

        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeacherProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, teacherProfileDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(teacherProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTeacherProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        teacherProfile.setId(longCount.incrementAndGet());

        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeacherProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(teacherProfileDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTeacherProfile() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        teacherProfile.setId(longCount.incrementAndGet());

        // Create the TeacherProfile
        TeacherProfileDTO teacherProfileDTO = teacherProfileMapper.toDto(teacherProfile);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeacherProfileMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(teacherProfileDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TeacherProfile in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTeacherProfile() throws Exception {
        // Initialize the database
        insertedTeacherProfile = teacherProfileRepository.saveAndFlush(teacherProfile);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the teacherProfile
        restTeacherProfileMockMvc
            .perform(delete(ENTITY_API_URL_ID, teacherProfile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return teacherProfileRepository.count();
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

    protected TeacherProfile getPersistedTeacherProfile(TeacherProfile teacherProfile) {
        return teacherProfileRepository.findById(teacherProfile.getId()).orElseThrow();
    }

    protected void assertPersistedTeacherProfileToMatchAllProperties(TeacherProfile expectedTeacherProfile) {
        assertTeacherProfileAllPropertiesEquals(expectedTeacherProfile, getPersistedTeacherProfile(expectedTeacherProfile));
    }

    protected void assertPersistedTeacherProfileToMatchUpdatableProperties(TeacherProfile expectedTeacherProfile) {
        assertTeacherProfileAllUpdatablePropertiesEquals(expectedTeacherProfile, getPersistedTeacherProfile(expectedTeacherProfile));
    }
}
