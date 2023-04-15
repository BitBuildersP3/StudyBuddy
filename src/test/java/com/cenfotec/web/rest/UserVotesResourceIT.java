package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.UserVotes;
import com.cenfotec.repository.UserVotesRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserVotesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserVotesResourceIT {

    private static final String DEFAULT_ID_USER = "AAAAAAAAAA";
    private static final String UPDATED_ID_USER = "BBBBBBBBBB";

    private static final String DEFAULT_JSON = "AAAAAAAAAA";
    private static final String UPDATED_JSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-votes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserVotesRepository userVotesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserVotesMockMvc;

    private UserVotes userVotes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserVotes createEntity(EntityManager em) {
        UserVotes userVotes = new UserVotes().idUser(DEFAULT_ID_USER).json(DEFAULT_JSON);
        return userVotes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserVotes createUpdatedEntity(EntityManager em) {
        UserVotes userVotes = new UserVotes().idUser(UPDATED_ID_USER).json(UPDATED_JSON);
        return userVotes;
    }

    @BeforeEach
    public void initTest() {
        userVotes = createEntity(em);
    }

    @Test
    @Transactional
    void createUserVotes() throws Exception {
        int databaseSizeBeforeCreate = userVotesRepository.findAll().size();
        // Create the UserVotes
        restUserVotesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isCreated());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeCreate + 1);
        UserVotes testUserVotes = userVotesList.get(userVotesList.size() - 1);
        assertThat(testUserVotes.getIdUser()).isEqualTo(DEFAULT_ID_USER);
        assertThat(testUserVotes.getJson()).isEqualTo(DEFAULT_JSON);
    }

    @Test
    @Transactional
    void createUserVotesWithExistingId() throws Exception {
        // Create the UserVotes with an existing ID
        userVotes.setId(1L);

        int databaseSizeBeforeCreate = userVotesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserVotesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserVotes() throws Exception {
        // Initialize the database
        userVotesRepository.saveAndFlush(userVotes);

        // Get all the userVotesList
        restUserVotesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userVotes.getId().intValue())))
            .andExpect(jsonPath("$.[*].idUser").value(hasItem(DEFAULT_ID_USER)))
            .andExpect(jsonPath("$.[*].json").value(hasItem(DEFAULT_JSON)));
    }

    @Test
    @Transactional
    void getUserVotes() throws Exception {
        // Initialize the database
        userVotesRepository.saveAndFlush(userVotes);

        // Get the userVotes
        restUserVotesMockMvc
            .perform(get(ENTITY_API_URL_ID, userVotes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userVotes.getId().intValue()))
            .andExpect(jsonPath("$.idUser").value(DEFAULT_ID_USER))
            .andExpect(jsonPath("$.json").value(DEFAULT_JSON));
    }

    @Test
    @Transactional
    void getNonExistingUserVotes() throws Exception {
        // Get the userVotes
        restUserVotesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserVotes() throws Exception {
        // Initialize the database
        userVotesRepository.saveAndFlush(userVotes);

        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();

        // Update the userVotes
        UserVotes updatedUserVotes = userVotesRepository.findById(userVotes.getId()).get();
        // Disconnect from session so that the updates on updatedUserVotes are not directly saved in db
        em.detach(updatedUserVotes);
        updatedUserVotes.idUser(UPDATED_ID_USER).json(UPDATED_JSON);

        restUserVotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserVotes.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserVotes))
            )
            .andExpect(status().isOk());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
        UserVotes testUserVotes = userVotesList.get(userVotesList.size() - 1);
        assertThat(testUserVotes.getIdUser()).isEqualTo(UPDATED_ID_USER);
        assertThat(testUserVotes.getJson()).isEqualTo(UPDATED_JSON);
    }

    @Test
    @Transactional
    void putNonExistingUserVotes() throws Exception {
        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();
        userVotes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserVotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userVotes.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserVotes() throws Exception {
        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();
        userVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserVotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserVotes() throws Exception {
        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();
        userVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserVotesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserVotesWithPatch() throws Exception {
        // Initialize the database
        userVotesRepository.saveAndFlush(userVotes);

        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();

        // Update the userVotes using partial update
        UserVotes partialUpdatedUserVotes = new UserVotes();
        partialUpdatedUserVotes.setId(userVotes.getId());

        partialUpdatedUserVotes.idUser(UPDATED_ID_USER);

        restUserVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserVotes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserVotes))
            )
            .andExpect(status().isOk());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
        UserVotes testUserVotes = userVotesList.get(userVotesList.size() - 1);
        assertThat(testUserVotes.getIdUser()).isEqualTo(UPDATED_ID_USER);
        assertThat(testUserVotes.getJson()).isEqualTo(DEFAULT_JSON);
    }

    @Test
    @Transactional
    void fullUpdateUserVotesWithPatch() throws Exception {
        // Initialize the database
        userVotesRepository.saveAndFlush(userVotes);

        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();

        // Update the userVotes using partial update
        UserVotes partialUpdatedUserVotes = new UserVotes();
        partialUpdatedUserVotes.setId(userVotes.getId());

        partialUpdatedUserVotes.idUser(UPDATED_ID_USER).json(UPDATED_JSON);

        restUserVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserVotes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserVotes))
            )
            .andExpect(status().isOk());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
        UserVotes testUserVotes = userVotesList.get(userVotesList.size() - 1);
        assertThat(testUserVotes.getIdUser()).isEqualTo(UPDATED_ID_USER);
        assertThat(testUserVotes.getJson()).isEqualTo(UPDATED_JSON);
    }

    @Test
    @Transactional
    void patchNonExistingUserVotes() throws Exception {
        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();
        userVotes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userVotes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserVotes() throws Exception {
        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();
        userVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserVotes() throws Exception {
        int databaseSizeBeforeUpdate = userVotesRepository.findAll().size();
        userVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserVotesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userVotes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserVotes in the database
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserVotes() throws Exception {
        // Initialize the database
        userVotesRepository.saveAndFlush(userVotes);

        int databaseSizeBeforeDelete = userVotesRepository.findAll().size();

        // Delete the userVotes
        restUserVotesMockMvc
            .perform(delete(ENTITY_API_URL_ID, userVotes.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserVotes> userVotesList = userVotesRepository.findAll();
        assertThat(userVotesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
