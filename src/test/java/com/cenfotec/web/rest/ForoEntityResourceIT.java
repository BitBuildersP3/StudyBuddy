package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.ForoEntity;
import com.cenfotec.repository.ForoEntityRepository;
import java.util.List;
import java.util.UUID;
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
 * Integration tests for the {@link ForoEntityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ForoEntityResourceIT {

    private static final String DEFAULT_JSON = "AAAAAAAAAA";
    private static final String UPDATED_JSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/foro-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ForoEntityRepository foroEntityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restForoEntityMockMvc;

    private ForoEntity foroEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ForoEntity createEntity(EntityManager em) {
        ForoEntity foroEntity = new ForoEntity().json(DEFAULT_JSON);
        return foroEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ForoEntity createUpdatedEntity(EntityManager em) {
        ForoEntity foroEntity = new ForoEntity().json(UPDATED_JSON);
        return foroEntity;
    }

    @BeforeEach
    public void initTest() {
        foroEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createForoEntity() throws Exception {
        int databaseSizeBeforeCreate = foroEntityRepository.findAll().size();
        // Create the ForoEntity
        restForoEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isCreated());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeCreate + 1);
        ForoEntity testForoEntity = foroEntityList.get(foroEntityList.size() - 1);
        assertThat(testForoEntity.getJson()).isEqualTo(DEFAULT_JSON);
    }

    @Test
    @Transactional
    void createForoEntityWithExistingId() throws Exception {
        // Create the ForoEntity with an existing ID
        foroEntity.setId("existing_id");

        int databaseSizeBeforeCreate = foroEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restForoEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllForoEntities() throws Exception {
        // Initialize the database
        foroEntity.setId(UUID.randomUUID().toString());
        foroEntityRepository.saveAndFlush(foroEntity);

        // Get all the foroEntityList
        restForoEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(foroEntity.getId())))
            .andExpect(jsonPath("$.[*].json").value(hasItem(DEFAULT_JSON)));
    }

    @Test
    @Transactional
    void getForoEntity() throws Exception {
        // Initialize the database
        foroEntity.setId(UUID.randomUUID().toString());
        foroEntityRepository.saveAndFlush(foroEntity);

        // Get the foroEntity
        restForoEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, foroEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(foroEntity.getId()))
            .andExpect(jsonPath("$.json").value(DEFAULT_JSON));
    }

    @Test
    @Transactional
    void getNonExistingForoEntity() throws Exception {
        // Get the foroEntity
        restForoEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingForoEntity() throws Exception {
        // Initialize the database
        foroEntity.setId(UUID.randomUUID().toString());
        foroEntityRepository.saveAndFlush(foroEntity);

        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();

        // Update the foroEntity
        ForoEntity updatedForoEntity = foroEntityRepository.findById(foroEntity.getId()).get();
        // Disconnect from session so that the updates on updatedForoEntity are not directly saved in db
        em.detach(updatedForoEntity);
        updatedForoEntity.json(UPDATED_JSON);

        restForoEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedForoEntity.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedForoEntity))
            )
            .andExpect(status().isOk());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
        ForoEntity testForoEntity = foroEntityList.get(foroEntityList.size() - 1);
        assertThat(testForoEntity.getJson()).isEqualTo(UPDATED_JSON);
    }

    @Test
    @Transactional
    void putNonExistingForoEntity() throws Exception {
        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();
        foroEntity.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restForoEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, foroEntity.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchForoEntity() throws Exception {
        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();
        foroEntity.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restForoEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamForoEntity() throws Exception {
        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();
        foroEntity.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restForoEntityMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateForoEntityWithPatch() throws Exception {
        // Initialize the database
        foroEntity.setId(UUID.randomUUID().toString());
        foroEntityRepository.saveAndFlush(foroEntity);

        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();

        // Update the foroEntity using partial update
        ForoEntity partialUpdatedForoEntity = new ForoEntity();
        partialUpdatedForoEntity.setId(foroEntity.getId());

        restForoEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedForoEntity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedForoEntity))
            )
            .andExpect(status().isOk());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
        ForoEntity testForoEntity = foroEntityList.get(foroEntityList.size() - 1);
        assertThat(testForoEntity.getJson()).isEqualTo(DEFAULT_JSON);
    }

    @Test
    @Transactional
    void fullUpdateForoEntityWithPatch() throws Exception {
        // Initialize the database
        foroEntity.setId(UUID.randomUUID().toString());
        foroEntityRepository.saveAndFlush(foroEntity);

        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();

        // Update the foroEntity using partial update
        ForoEntity partialUpdatedForoEntity = new ForoEntity();
        partialUpdatedForoEntity.setId(foroEntity.getId());

        partialUpdatedForoEntity.json(UPDATED_JSON);

        restForoEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedForoEntity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedForoEntity))
            )
            .andExpect(status().isOk());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
        ForoEntity testForoEntity = foroEntityList.get(foroEntityList.size() - 1);
        assertThat(testForoEntity.getJson()).isEqualTo(UPDATED_JSON);
    }

    @Test
    @Transactional
    void patchNonExistingForoEntity() throws Exception {
        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();
        foroEntity.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restForoEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, foroEntity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchForoEntity() throws Exception {
        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();
        foroEntity.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restForoEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamForoEntity() throws Exception {
        int databaseSizeBeforeUpdate = foroEntityRepository.findAll().size();
        foroEntity.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restForoEntityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foroEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ForoEntity in the database
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteForoEntity() throws Exception {
        // Initialize the database
        foroEntity.setId(UUID.randomUUID().toString());
        foroEntityRepository.saveAndFlush(foroEntity);

        int databaseSizeBeforeDelete = foroEntityRepository.findAll().size();

        // Delete the foroEntity
        restForoEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, foroEntity.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ForoEntity> foroEntityList = foroEntityRepository.findAll();
        assertThat(foroEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
