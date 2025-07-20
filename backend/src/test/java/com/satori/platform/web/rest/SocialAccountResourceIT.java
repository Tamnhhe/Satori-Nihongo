package com.satori.platform.web.rest;

import static com.satori.platform.domain.SocialAccountAsserts.*;
import static com.satori.platform.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.IntegrationTest;
import com.satori.platform.domain.SocialAccount;
import com.satori.platform.domain.enumeration.AuthProvider;
import com.satori.platform.repository.SocialAccountRepository;
import com.satori.platform.service.dto.SocialAccountDTO;
import com.satori.platform.service.mapper.SocialAccountMapper;
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
 * Integration tests for the {@link SocialAccountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SocialAccountResourceIT {

    private static final AuthProvider DEFAULT_PROVIDER = AuthProvider.LOCAL;
    private static final AuthProvider UPDATED_PROVIDER = AuthProvider.GOOGLE;

    private static final String DEFAULT_PROVIDER_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_PROVIDER_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ACCESS_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_ACCESS_TOKEN = "BBBBBBBBBB";

    private static final String DEFAULT_REFRESH_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_REFRESH_TOKEN = "BBBBBBBBBB";

    private static final Instant DEFAULT_TOKEN_EXPIRY = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TOKEN_EXPIRY = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/social-accounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SocialAccountRepository socialAccountRepository;

    @Autowired
    private SocialAccountMapper socialAccountMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSocialAccountMockMvc;

    private SocialAccount socialAccount;

    private SocialAccount insertedSocialAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocialAccount createEntity() {
        return new SocialAccount()
            .provider(DEFAULT_PROVIDER)
            .providerUserId(DEFAULT_PROVIDER_USER_ID)
            .accessToken(DEFAULT_ACCESS_TOKEN)
            .refreshToken(DEFAULT_REFRESH_TOKEN)
            .tokenExpiry(DEFAULT_TOKEN_EXPIRY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocialAccount createUpdatedEntity() {
        return new SocialAccount()
            .provider(UPDATED_PROVIDER)
            .providerUserId(UPDATED_PROVIDER_USER_ID)
            .accessToken(UPDATED_ACCESS_TOKEN)
            .refreshToken(UPDATED_REFRESH_TOKEN)
            .tokenExpiry(UPDATED_TOKEN_EXPIRY);
    }

    @BeforeEach
    void initTest() {
        socialAccount = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedSocialAccount != null) {
            socialAccountRepository.delete(insertedSocialAccount);
            insertedSocialAccount = null;
        }
    }

    @Test
    @Transactional
    void createSocialAccount() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);
        var returnedSocialAccountDTO = om.readValue(
            restSocialAccountMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(socialAccountDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SocialAccountDTO.class
        );

        // Validate the SocialAccount in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedSocialAccount = socialAccountMapper.toEntity(returnedSocialAccountDTO);
        assertSocialAccountUpdatableFieldsEquals(returnedSocialAccount, getPersistedSocialAccount(returnedSocialAccount));

        insertedSocialAccount = returnedSocialAccount;
    }

    @Test
    @Transactional
    void createSocialAccountWithExistingId() throws Exception {
        // Create the SocialAccount with an existing ID
        socialAccount.setId(1L);
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSocialAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(socialAccountDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkProviderIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        socialAccount.setProvider(null);

        // Create the SocialAccount, which fails.
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        restSocialAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(socialAccountDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkProviderUserIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        socialAccount.setProviderUserId(null);

        // Create the SocialAccount, which fails.
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        restSocialAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(socialAccountDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSocialAccounts() throws Exception {
        // Initialize the database
        insertedSocialAccount = socialAccountRepository.saveAndFlush(socialAccount);

        // Get all the socialAccountList
        restSocialAccountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(socialAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].provider").value(hasItem(DEFAULT_PROVIDER.toString())))
            .andExpect(jsonPath("$.[*].providerUserId").value(hasItem(DEFAULT_PROVIDER_USER_ID)))
            .andExpect(jsonPath("$.[*].accessToken").value(hasItem(DEFAULT_ACCESS_TOKEN)))
            .andExpect(jsonPath("$.[*].refreshToken").value(hasItem(DEFAULT_REFRESH_TOKEN)))
            .andExpect(jsonPath("$.[*].tokenExpiry").value(hasItem(DEFAULT_TOKEN_EXPIRY.toString())));
    }

    @Test
    @Transactional
    void getSocialAccount() throws Exception {
        // Initialize the database
        insertedSocialAccount = socialAccountRepository.saveAndFlush(socialAccount);

        // Get the socialAccount
        restSocialAccountMockMvc
            .perform(get(ENTITY_API_URL_ID, socialAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(socialAccount.getId().intValue()))
            .andExpect(jsonPath("$.provider").value(DEFAULT_PROVIDER.toString()))
            .andExpect(jsonPath("$.providerUserId").value(DEFAULT_PROVIDER_USER_ID))
            .andExpect(jsonPath("$.accessToken").value(DEFAULT_ACCESS_TOKEN))
            .andExpect(jsonPath("$.refreshToken").value(DEFAULT_REFRESH_TOKEN))
            .andExpect(jsonPath("$.tokenExpiry").value(DEFAULT_TOKEN_EXPIRY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSocialAccount() throws Exception {
        // Get the socialAccount
        restSocialAccountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSocialAccount() throws Exception {
        // Initialize the database
        insertedSocialAccount = socialAccountRepository.saveAndFlush(socialAccount);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the socialAccount
        SocialAccount updatedSocialAccount = socialAccountRepository.findById(socialAccount.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSocialAccount are not directly saved in db
        em.detach(updatedSocialAccount);
        updatedSocialAccount
            .provider(UPDATED_PROVIDER)
            .providerUserId(UPDATED_PROVIDER_USER_ID)
            .accessToken(UPDATED_ACCESS_TOKEN)
            .refreshToken(UPDATED_REFRESH_TOKEN)
            .tokenExpiry(UPDATED_TOKEN_EXPIRY);
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(updatedSocialAccount);

        restSocialAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, socialAccountDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(socialAccountDTO))
            )
            .andExpect(status().isOk());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSocialAccountToMatchAllProperties(updatedSocialAccount);
    }

    @Test
    @Transactional
    void putNonExistingSocialAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        socialAccount.setId(longCount.incrementAndGet());

        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocialAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, socialAccountDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(socialAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSocialAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        socialAccount.setId(longCount.incrementAndGet());

        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(socialAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSocialAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        socialAccount.setId(longCount.incrementAndGet());

        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialAccountMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(socialAccountDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSocialAccountWithPatch() throws Exception {
        // Initialize the database
        insertedSocialAccount = socialAccountRepository.saveAndFlush(socialAccount);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the socialAccount using partial update
        SocialAccount partialUpdatedSocialAccount = new SocialAccount();
        partialUpdatedSocialAccount.setId(socialAccount.getId());

        partialUpdatedSocialAccount
            .providerUserId(UPDATED_PROVIDER_USER_ID)
            .accessToken(UPDATED_ACCESS_TOKEN)
            .tokenExpiry(UPDATED_TOKEN_EXPIRY);

        restSocialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocialAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSocialAccount))
            )
            .andExpect(status().isOk());

        // Validate the SocialAccount in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSocialAccountUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSocialAccount, socialAccount),
            getPersistedSocialAccount(socialAccount)
        );
    }

    @Test
    @Transactional
    void fullUpdateSocialAccountWithPatch() throws Exception {
        // Initialize the database
        insertedSocialAccount = socialAccountRepository.saveAndFlush(socialAccount);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the socialAccount using partial update
        SocialAccount partialUpdatedSocialAccount = new SocialAccount();
        partialUpdatedSocialAccount.setId(socialAccount.getId());

        partialUpdatedSocialAccount
            .provider(UPDATED_PROVIDER)
            .providerUserId(UPDATED_PROVIDER_USER_ID)
            .accessToken(UPDATED_ACCESS_TOKEN)
            .refreshToken(UPDATED_REFRESH_TOKEN)
            .tokenExpiry(UPDATED_TOKEN_EXPIRY);

        restSocialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocialAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSocialAccount))
            )
            .andExpect(status().isOk());

        // Validate the SocialAccount in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSocialAccountUpdatableFieldsEquals(partialUpdatedSocialAccount, getPersistedSocialAccount(partialUpdatedSocialAccount));
    }

    @Test
    @Transactional
    void patchNonExistingSocialAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        socialAccount.setId(longCount.incrementAndGet());

        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, socialAccountDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(socialAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSocialAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        socialAccount.setId(longCount.incrementAndGet());

        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(socialAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSocialAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        socialAccount.setId(longCount.incrementAndGet());

        // Create the SocialAccount
        SocialAccountDTO socialAccountDTO = socialAccountMapper.toDto(socialAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialAccountMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(socialAccountDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocialAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSocialAccount() throws Exception {
        // Initialize the database
        insertedSocialAccount = socialAccountRepository.saveAndFlush(socialAccount);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the socialAccount
        restSocialAccountMockMvc
            .perform(delete(ENTITY_API_URL_ID, socialAccount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return socialAccountRepository.count();
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

    protected SocialAccount getPersistedSocialAccount(SocialAccount socialAccount) {
        return socialAccountRepository.findById(socialAccount.getId()).orElseThrow();
    }

    protected void assertPersistedSocialAccountToMatchAllProperties(SocialAccount expectedSocialAccount) {
        assertSocialAccountAllPropertiesEquals(expectedSocialAccount, getPersistedSocialAccount(expectedSocialAccount));
    }

    protected void assertPersistedSocialAccountToMatchUpdatableProperties(SocialAccount expectedSocialAccount) {
        assertSocialAccountAllUpdatablePropertiesEquals(expectedSocialAccount, getPersistedSocialAccount(expectedSocialAccount));
    }
}
