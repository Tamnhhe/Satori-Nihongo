package com.satori.platform.web.rest;

import static com.satori.platform.domain.QuizQuestionAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.service.dto.QuizQuestionDTO;
import com.satori.platform.service.mapper.QuizQuestionMapper;
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
 * Integration tests for the {@link QuizQuestionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class QuizQuestionResourceIT {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String ENTITY_API_URL = "/api/quiz-questions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizQuestionMapper quizQuestionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQuizQuestionMockMvc;

    private QuizQuestion quizQuestion;

    private QuizQuestion insertedQuizQuestion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuizQuestion createEntity() {
        return new QuizQuestion().position(DEFAULT_POSITION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuizQuestion createUpdatedEntity() {
        return new QuizQuestion().position(UPDATED_POSITION);
    }

    @BeforeEach
    void initTest() {
        quizQuestion = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedQuizQuestion != null) {
            quizQuestionRepository.delete(insertedQuizQuestion);
            insertedQuizQuestion = null;
        }
    }

    @Test
    @Transactional
    void createQuizQuestion() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);
        var returnedQuizQuestionDTO = om.readValue(
            restQuizQuestionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(quizQuestionDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            QuizQuestionDTO.class
        );

        // Validate the QuizQuestion in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedQuizQuestion = quizQuestionMapper.toEntity(returnedQuizQuestionDTO);
        assertQuizQuestionUpdatableFieldsEquals(returnedQuizQuestion, getPersistedQuizQuestion(returnedQuizQuestion));

        insertedQuizQuestion = returnedQuizQuestion;
    }

    @Test
    @Transactional
    void createQuizQuestionWithExistingId() throws Exception {
        // Create the QuizQuestion with an existing ID
        quizQuestion.setId(1L);
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuizQuestionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(quizQuestionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPositionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        quizQuestion.setPosition(null);

        // Create the QuizQuestion, which fails.
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        restQuizQuestionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(quizQuestionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllQuizQuestions() throws Exception {
        // Initialize the database
        insertedQuizQuestion = quizQuestionRepository.saveAndFlush(quizQuestion);

        // Get all the quizQuestionList
        restQuizQuestionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(quizQuestion.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    void getQuizQuestion() throws Exception {
        // Initialize the database
        insertedQuizQuestion = quizQuestionRepository.saveAndFlush(quizQuestion);

        // Get the quizQuestion
        restQuizQuestionMockMvc
            .perform(get(ENTITY_API_URL_ID, quizQuestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(quizQuestion.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION));
    }

    @Test
    @Transactional
    void getNonExistingQuizQuestion() throws Exception {
        // Get the quizQuestion
        restQuizQuestionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingQuizQuestion() throws Exception {
        // Initialize the database
        insertedQuizQuestion = quizQuestionRepository.saveAndFlush(quizQuestion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the quizQuestion
        QuizQuestion updatedQuizQuestion = quizQuestionRepository.findById(quizQuestion.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedQuizQuestion are not directly saved in db
        em.detach(updatedQuizQuestion);
        updatedQuizQuestion.position(UPDATED_POSITION);
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(updatedQuizQuestion);

        restQuizQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, quizQuestionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(quizQuestionDTO))
            )
            .andExpect(status().isOk());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedQuizQuestionToMatchAllProperties(updatedQuizQuestion);
    }

    @Test
    @Transactional
    void putNonExistingQuizQuestion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        quizQuestion.setId(longCount.incrementAndGet());

        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuizQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, quizQuestionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(quizQuestionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQuizQuestion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        quizQuestion.setId(longCount.incrementAndGet());

        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuizQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(quizQuestionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQuizQuestion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        quizQuestion.setId(longCount.incrementAndGet());

        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuizQuestionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(quizQuestionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQuizQuestionWithPatch() throws Exception {
        // Initialize the database
        insertedQuizQuestion = quizQuestionRepository.saveAndFlush(quizQuestion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the quizQuestion using partial update
        QuizQuestion partialUpdatedQuizQuestion = new QuizQuestion();
        partialUpdatedQuizQuestion.setId(quizQuestion.getId());

        partialUpdatedQuizQuestion.position(UPDATED_POSITION);

        restQuizQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuizQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedQuizQuestion))
            )
            .andExpect(status().isOk());

        // Validate the QuizQuestion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertQuizQuestionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedQuizQuestion, quizQuestion),
            getPersistedQuizQuestion(quizQuestion)
        );
    }

    @Test
    @Transactional
    void fullUpdateQuizQuestionWithPatch() throws Exception {
        // Initialize the database
        insertedQuizQuestion = quizQuestionRepository.saveAndFlush(quizQuestion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the quizQuestion using partial update
        QuizQuestion partialUpdatedQuizQuestion = new QuizQuestion();
        partialUpdatedQuizQuestion.setId(quizQuestion.getId());

        partialUpdatedQuizQuestion.position(UPDATED_POSITION);

        restQuizQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuizQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedQuizQuestion))
            )
            .andExpect(status().isOk());

        // Validate the QuizQuestion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertQuizQuestionUpdatableFieldsEquals(partialUpdatedQuizQuestion, getPersistedQuizQuestion(partialUpdatedQuizQuestion));
    }

    @Test
    @Transactional
    void patchNonExistingQuizQuestion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        quizQuestion.setId(longCount.incrementAndGet());

        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuizQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, quizQuestionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(quizQuestionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQuizQuestion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        quizQuestion.setId(longCount.incrementAndGet());

        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuizQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(quizQuestionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQuizQuestion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        quizQuestion.setId(longCount.incrementAndGet());

        // Create the QuizQuestion
        QuizQuestionDTO quizQuestionDTO = quizQuestionMapper.toDto(quizQuestion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuizQuestionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(quizQuestionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the QuizQuestion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQuizQuestion() throws Exception {
        // Initialize the database
        insertedQuizQuestion = quizQuestionRepository.saveAndFlush(quizQuestion);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the quizQuestion
        restQuizQuestionMockMvc
            .perform(delete(ENTITY_API_URL_ID, quizQuestion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return quizQuestionRepository.count();
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

    protected QuizQuestion getPersistedQuizQuestion(QuizQuestion quizQuestion) {
        return quizQuestionRepository.findById(quizQuestion.getId()).orElseThrow();
    }

    protected void assertPersistedQuizQuestionToMatchAllProperties(QuizQuestion expectedQuizQuestion) {
        assertQuizQuestionAllPropertiesEquals(expectedQuizQuestion, getPersistedQuizQuestion(expectedQuizQuestion));
    }

    protected void assertPersistedQuizQuestionToMatchUpdatableProperties(QuizQuestion expectedQuizQuestion) {
        assertQuizQuestionAllUpdatablePropertiesEquals(expectedQuizQuestion, getPersistedQuizQuestion(expectedQuizQuestion));
    }
}
