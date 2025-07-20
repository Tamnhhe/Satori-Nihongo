package com.satori.platform.web.rest;

import static com.satori.platform.domain.StudentQuizAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.service.dto.StudentQuizDTO;
import com.satori.platform.service.mapper.StudentQuizMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link StudentQuizResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StudentQuizResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Double DEFAULT_SCORE = 1D;
    private static final Double UPDATED_SCORE = 2D;

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final String ENTITY_API_URL = "/api/student-quizs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private StudentQuizMapper studentQuizMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudentQuizMockMvc;

    private StudentQuiz studentQuiz;

    private StudentQuiz insertedStudentQuiz;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentQuiz createEntity() {
        return new StudentQuiz().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME).score(DEFAULT_SCORE).completed(DEFAULT_COMPLETED);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentQuiz createUpdatedEntity() {
        return new StudentQuiz().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).score(UPDATED_SCORE).completed(UPDATED_COMPLETED);
    }

    @BeforeEach
    void initTest() {
        studentQuiz = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedStudentQuiz != null) {
            studentQuizRepository.delete(insertedStudentQuiz);
            insertedStudentQuiz = null;
        }
    }

    @Test
    @Transactional
    void createStudentQuiz() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);
        var returnedStudentQuizDTO = om.readValue(
            restStudentQuizMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentQuizDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            StudentQuizDTO.class
        );

        // Validate the StudentQuiz in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedStudentQuiz = studentQuizMapper.toEntity(returnedStudentQuizDTO);
        assertStudentQuizUpdatableFieldsEquals(returnedStudentQuiz, getPersistedStudentQuiz(returnedStudentQuiz));

        insertedStudentQuiz = returnedStudentQuiz;
    }

    @Test
    @Transactional
    void createStudentQuizWithExistingId() throws Exception {
        // Create the StudentQuiz with an existing ID
        studentQuiz.setId(1L);
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudentQuizMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentQuizDTO)))
            .andExpect(status().isBadRequest());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStudentQuizs() throws Exception {
        // Initialize the database
        insertedStudentQuiz = studentQuizRepository.saveAndFlush(studentQuiz);

        // Get all the studentQuizList
        restStudentQuizMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studentQuiz.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE)))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED)));
    }

    @Test
    @Transactional
    void getStudentQuiz() throws Exception {
        // Initialize the database
        insertedStudentQuiz = studentQuizRepository.saveAndFlush(studentQuiz);

        // Get the studentQuiz
        restStudentQuizMockMvc
            .perform(get(ENTITY_API_URL_ID, studentQuiz.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(studentQuiz.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED));
    }

    @Test
    @Transactional
    void getNonExistingStudentQuiz() throws Exception {
        // Get the studentQuiz
        restStudentQuizMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStudentQuiz() throws Exception {
        // Initialize the database
        insertedStudentQuiz = studentQuizRepository.saveAndFlush(studentQuiz);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the studentQuiz
        StudentQuiz updatedStudentQuiz = studentQuizRepository.findById(studentQuiz.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStudentQuiz are not directly saved in db
        em.detach(updatedStudentQuiz);
        updatedStudentQuiz.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).score(UPDATED_SCORE).completed(UPDATED_COMPLETED);
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(updatedStudentQuiz);

        restStudentQuizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentQuizDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(studentQuizDTO))
            )
            .andExpect(status().isOk());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedStudentQuizToMatchAllProperties(updatedStudentQuiz);
    }

    @Test
    @Transactional
    void putNonExistingStudentQuiz() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentQuiz.setId(longCount.incrementAndGet());

        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentQuizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentQuizDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(studentQuizDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStudentQuiz() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentQuiz.setId(longCount.incrementAndGet());

        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentQuizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(studentQuizDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStudentQuiz() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentQuiz.setId(longCount.incrementAndGet());

        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentQuizMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(studentQuizDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStudentQuizWithPatch() throws Exception {
        // Initialize the database
        insertedStudentQuiz = studentQuizRepository.saveAndFlush(studentQuiz);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the studentQuiz using partial update
        StudentQuiz partialUpdatedStudentQuiz = new StudentQuiz();
        partialUpdatedStudentQuiz.setId(studentQuiz.getId());

        partialUpdatedStudentQuiz.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restStudentQuizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentQuiz.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStudentQuiz))
            )
            .andExpect(status().isOk());

        // Validate the StudentQuiz in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStudentQuizUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedStudentQuiz, studentQuiz),
            getPersistedStudentQuiz(studentQuiz)
        );
    }

    @Test
    @Transactional
    void fullUpdateStudentQuizWithPatch() throws Exception {
        // Initialize the database
        insertedStudentQuiz = studentQuizRepository.saveAndFlush(studentQuiz);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the studentQuiz using partial update
        StudentQuiz partialUpdatedStudentQuiz = new StudentQuiz();
        partialUpdatedStudentQuiz.setId(studentQuiz.getId());

        partialUpdatedStudentQuiz.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).score(UPDATED_SCORE).completed(UPDATED_COMPLETED);

        restStudentQuizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentQuiz.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStudentQuiz))
            )
            .andExpect(status().isOk());

        // Validate the StudentQuiz in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStudentQuizUpdatableFieldsEquals(partialUpdatedStudentQuiz, getPersistedStudentQuiz(partialUpdatedStudentQuiz));
    }

    @Test
    @Transactional
    void patchNonExistingStudentQuiz() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentQuiz.setId(longCount.incrementAndGet());

        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentQuizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, studentQuizDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(studentQuizDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStudentQuiz() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentQuiz.setId(longCount.incrementAndGet());

        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentQuizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(studentQuizDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStudentQuiz() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        studentQuiz.setId(longCount.incrementAndGet());

        // Create the StudentQuiz
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(studentQuiz);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentQuizMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(studentQuizDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentQuiz in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStudentQuiz() throws Exception {
        // Initialize the database
        insertedStudentQuiz = studentQuizRepository.saveAndFlush(studentQuiz);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the studentQuiz
        restStudentQuizMockMvc
            .perform(delete(ENTITY_API_URL_ID, studentQuiz.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return studentQuizRepository.count();
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

    protected StudentQuiz getPersistedStudentQuiz(StudentQuiz studentQuiz) {
        return studentQuizRepository.findById(studentQuiz.getId()).orElseThrow();
    }

    protected void assertPersistedStudentQuizToMatchAllProperties(StudentQuiz expectedStudentQuiz) {
        assertStudentQuizAllPropertiesEquals(expectedStudentQuiz, getPersistedStudentQuiz(expectedStudentQuiz));
    }

    protected void assertPersistedStudentQuizToMatchUpdatableProperties(StudentQuiz expectedStudentQuiz) {
        assertStudentQuizAllUpdatablePropertiesEquals(expectedStudentQuiz, getPersistedStudentQuiz(expectedStudentQuiz));
    }
}
