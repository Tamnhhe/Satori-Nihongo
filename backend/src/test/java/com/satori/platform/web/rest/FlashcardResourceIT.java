package com.satori.platform.web.rest;

import static com.satori.platform.domain.FlashcardAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.Flashcard;
import com.satori.platform.repository.FlashcardRepository;
import com.satori.platform.service.dto.FlashcardDTO;
import com.satori.platform.service.mapper.FlashcardMapper;
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
 * Integration tests for the {@link FlashcardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FlashcardResourceIT {

    private static final String DEFAULT_TERM = "AAAAAAAAAA";
    private static final String UPDATED_TERM = "BBBBBBBBBB";

    private static final String DEFAULT_DEFINITION = "AAAAAAAAAA";
    private static final String UPDATED_DEFINITION = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    private static final String DEFAULT_HINT = "AAAAAAAAAA";
    private static final String UPDATED_HINT = "BBBBBBBBBB";

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String ENTITY_API_URL = "/api/flashcards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private FlashcardMapper flashcardMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFlashcardMockMvc;

    private Flashcard flashcard;

    private Flashcard insertedFlashcard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Flashcard createEntity() {
        return new Flashcard()
            .term(DEFAULT_TERM)
            .definition(DEFAULT_DEFINITION)
            .imageUrl(DEFAULT_IMAGE_URL)
            .hint(DEFAULT_HINT)
            .position(DEFAULT_POSITION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Flashcard createUpdatedEntity() {
        return new Flashcard()
            .term(UPDATED_TERM)
            .definition(UPDATED_DEFINITION)
            .imageUrl(UPDATED_IMAGE_URL)
            .hint(UPDATED_HINT)
            .position(UPDATED_POSITION);
    }

    @BeforeEach
    void initTest() {
        flashcard = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedFlashcard != null) {
            flashcardRepository.delete(insertedFlashcard);
            insertedFlashcard = null;
        }
    }

    @Test
    @Transactional
    void createFlashcard() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);
        var returnedFlashcardDTO = om.readValue(
            restFlashcardMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(flashcardDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            FlashcardDTO.class
        );

        // Validate the Flashcard in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedFlashcard = flashcardMapper.toEntity(returnedFlashcardDTO);
        assertFlashcardUpdatableFieldsEquals(returnedFlashcard, getPersistedFlashcard(returnedFlashcard));

        insertedFlashcard = returnedFlashcard;
    }

    @Test
    @Transactional
    void createFlashcardWithExistingId() throws Exception {
        // Create the Flashcard with an existing ID
        flashcard.setId(1L);
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(flashcardDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTermIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        flashcard.setTerm(null);

        // Create the Flashcard, which fails.
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(flashcardDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPositionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        flashcard.setPosition(null);

        // Create the Flashcard, which fails.
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(flashcardDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFlashcards() throws Exception {
        // Initialize the database
        insertedFlashcard = flashcardRepository.saveAndFlush(flashcard);

        // Get all the flashcardList
        restFlashcardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(flashcard.getId().intValue())))
            .andExpect(jsonPath("$.[*].term").value(hasItem(DEFAULT_TERM)))
            .andExpect(jsonPath("$.[*].definition").value(hasItem(DEFAULT_DEFINITION)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL)))
            .andExpect(jsonPath("$.[*].hint").value(hasItem(DEFAULT_HINT)))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    void getFlashcard() throws Exception {
        // Initialize the database
        insertedFlashcard = flashcardRepository.saveAndFlush(flashcard);

        // Get the flashcard
        restFlashcardMockMvc
            .perform(get(ENTITY_API_URL_ID, flashcard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(flashcard.getId().intValue()))
            .andExpect(jsonPath("$.term").value(DEFAULT_TERM))
            .andExpect(jsonPath("$.definition").value(DEFAULT_DEFINITION))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGE_URL))
            .andExpect(jsonPath("$.hint").value(DEFAULT_HINT))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION));
    }

    @Test
    @Transactional
    void getNonExistingFlashcard() throws Exception {
        // Get the flashcard
        restFlashcardMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFlashcard() throws Exception {
        // Initialize the database
        insertedFlashcard = flashcardRepository.saveAndFlush(flashcard);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the flashcard
        Flashcard updatedFlashcard = flashcardRepository.findById(flashcard.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFlashcard are not directly saved in db
        em.detach(updatedFlashcard);
        updatedFlashcard
            .term(UPDATED_TERM)
            .definition(UPDATED_DEFINITION)
            .imageUrl(UPDATED_IMAGE_URL)
            .hint(UPDATED_HINT)
            .position(UPDATED_POSITION);
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(updatedFlashcard);

        restFlashcardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, flashcardDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(flashcardDTO))
            )
            .andExpect(status().isOk());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedFlashcardToMatchAllProperties(updatedFlashcard);
    }

    @Test
    @Transactional
    void putNonExistingFlashcard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        flashcard.setId(longCount.incrementAndGet());

        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, flashcardDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(flashcardDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFlashcard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        flashcard.setId(longCount.incrementAndGet());

        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(flashcardDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFlashcard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        flashcard.setId(longCount.incrementAndGet());

        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(flashcardDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFlashcardWithPatch() throws Exception {
        // Initialize the database
        insertedFlashcard = flashcardRepository.saveAndFlush(flashcard);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the flashcard using partial update
        Flashcard partialUpdatedFlashcard = new Flashcard();
        partialUpdatedFlashcard.setId(flashcard.getId());

        partialUpdatedFlashcard.term(UPDATED_TERM).hint(UPDATED_HINT).position(UPDATED_POSITION);

        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFlashcard.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFlashcard))
            )
            .andExpect(status().isOk());

        // Validate the Flashcard in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFlashcardUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedFlashcard, flashcard),
            getPersistedFlashcard(flashcard)
        );
    }

    @Test
    @Transactional
    void fullUpdateFlashcardWithPatch() throws Exception {
        // Initialize the database
        insertedFlashcard = flashcardRepository.saveAndFlush(flashcard);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the flashcard using partial update
        Flashcard partialUpdatedFlashcard = new Flashcard();
        partialUpdatedFlashcard.setId(flashcard.getId());

        partialUpdatedFlashcard
            .term(UPDATED_TERM)
            .definition(UPDATED_DEFINITION)
            .imageUrl(UPDATED_IMAGE_URL)
            .hint(UPDATED_HINT)
            .position(UPDATED_POSITION);

        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFlashcard.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFlashcard))
            )
            .andExpect(status().isOk());

        // Validate the Flashcard in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFlashcardUpdatableFieldsEquals(partialUpdatedFlashcard, getPersistedFlashcard(partialUpdatedFlashcard));
    }

    @Test
    @Transactional
    void patchNonExistingFlashcard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        flashcard.setId(longCount.incrementAndGet());

        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, flashcardDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(flashcardDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFlashcard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        flashcard.setId(longCount.incrementAndGet());

        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(flashcardDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFlashcard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        flashcard.setId(longCount.incrementAndGet());

        // Create the Flashcard
        FlashcardDTO flashcardDTO = flashcardMapper.toDto(flashcard);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(flashcardDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Flashcard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFlashcard() throws Exception {
        // Initialize the database
        insertedFlashcard = flashcardRepository.saveAndFlush(flashcard);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the flashcard
        restFlashcardMockMvc
            .perform(delete(ENTITY_API_URL_ID, flashcard.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return flashcardRepository.count();
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

    protected Flashcard getPersistedFlashcard(Flashcard flashcard) {
        return flashcardRepository.findById(flashcard.getId()).orElseThrow();
    }

    protected void assertPersistedFlashcardToMatchAllProperties(Flashcard expectedFlashcard) {
        assertFlashcardAllPropertiesEquals(expectedFlashcard, getPersistedFlashcard(expectedFlashcard));
    }

    protected void assertPersistedFlashcardToMatchUpdatableProperties(Flashcard expectedFlashcard) {
        assertFlashcardAllUpdatablePropertiesEquals(expectedFlashcard, getPersistedFlashcard(expectedFlashcard));
    }
}
