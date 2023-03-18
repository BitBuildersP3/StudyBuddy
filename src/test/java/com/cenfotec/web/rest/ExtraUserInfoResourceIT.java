package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.ExtraUserInfo;
import com.cenfotec.repository.ExtraUserInfoRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ExtraUserInfoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ExtraUserInfoResourceIT {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_DEGREE = "AAAAAAAAAA";
    private static final String UPDATED_DEGREE = "BBBBBBBBBB";

    private static final String DEFAULT_PROFILE_PICTURE = "AAAAAAAAAA";
    private static final String UPDATED_PROFILE_PICTURE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BIRTH_DAY = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTH_DAY = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_SCORE = 1D;
    private static final Double UPDATED_SCORE = 2D;

    private static final Double DEFAULT_USER_VOTES = 1D;
    private static final Double UPDATED_USER_VOTES = 2D;

    private static final String ENTITY_API_URL = "/api/extra-user-infos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExtraUserInfoRepository extraUserInfoRepository;

    @Mock
    private ExtraUserInfoRepository extraUserInfoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExtraUserInfoMockMvc;

    private ExtraUserInfo extraUserInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExtraUserInfo createEntity(EntityManager em) {
        ExtraUserInfo extraUserInfo = new ExtraUserInfo()
            .phone(DEFAULT_PHONE)
            .degree(DEFAULT_DEGREE)
            .profilePicture(DEFAULT_PROFILE_PICTURE)
            .birthDay(DEFAULT_BIRTH_DAY)
            .score(DEFAULT_SCORE)
            .userVotes(DEFAULT_USER_VOTES);
        return extraUserInfo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExtraUserInfo createUpdatedEntity(EntityManager em) {
        ExtraUserInfo extraUserInfo = new ExtraUserInfo()
            .phone(UPDATED_PHONE)
            .degree(UPDATED_DEGREE)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .birthDay(UPDATED_BIRTH_DAY)
            .score(UPDATED_SCORE)
            .userVotes(UPDATED_USER_VOTES);
        return extraUserInfo;
    }

    @BeforeEach
    public void initTest() {
        extraUserInfo = createEntity(em);
    }

    @Test
    @Transactional
    void createExtraUserInfo() throws Exception {
        int databaseSizeBeforeCreate = extraUserInfoRepository.findAll().size();
        // Create the ExtraUserInfo
        restExtraUserInfoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isCreated());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeCreate + 1);
        ExtraUserInfo testExtraUserInfo = extraUserInfoList.get(extraUserInfoList.size() - 1);
        assertThat(testExtraUserInfo.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testExtraUserInfo.getDegree()).isEqualTo(DEFAULT_DEGREE);
        assertThat(testExtraUserInfo.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testExtraUserInfo.getBirthDay()).isEqualTo(DEFAULT_BIRTH_DAY);
        assertThat(testExtraUserInfo.getScore()).isEqualTo(DEFAULT_SCORE);
        assertThat(testExtraUserInfo.getUserVotes()).isEqualTo(DEFAULT_USER_VOTES);
    }

    @Test
    @Transactional
    void createExtraUserInfoWithExistingId() throws Exception {
        // Create the ExtraUserInfo with an existing ID
        extraUserInfo.setId(1L);

        int databaseSizeBeforeCreate = extraUserInfoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExtraUserInfoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExtraUserInfos() throws Exception {
        // Initialize the database
        extraUserInfoRepository.saveAndFlush(extraUserInfo);

        // Get all the extraUserInfoList
        restExtraUserInfoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(extraUserInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].degree").value(hasItem(DEFAULT_DEGREE)))
            .andExpect(jsonPath("$.[*].profilePicture").value(hasItem(DEFAULT_PROFILE_PICTURE)))
            .andExpect(jsonPath("$.[*].birthDay").value(hasItem(DEFAULT_BIRTH_DAY.toString())))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE.doubleValue())))
            .andExpect(jsonPath("$.[*].userVotes").value(hasItem(DEFAULT_USER_VOTES.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExtraUserInfosWithEagerRelationshipsIsEnabled() throws Exception {
        when(extraUserInfoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExtraUserInfoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(extraUserInfoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExtraUserInfosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(extraUserInfoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExtraUserInfoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(extraUserInfoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getExtraUserInfo() throws Exception {
        // Initialize the database
        extraUserInfoRepository.saveAndFlush(extraUserInfo);

        // Get the extraUserInfo
        restExtraUserInfoMockMvc
            .perform(get(ENTITY_API_URL_ID, extraUserInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(extraUserInfo.getId().intValue()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.degree").value(DEFAULT_DEGREE))
            .andExpect(jsonPath("$.profilePicture").value(DEFAULT_PROFILE_PICTURE))
            .andExpect(jsonPath("$.birthDay").value(DEFAULT_BIRTH_DAY.toString()))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE.doubleValue()))
            .andExpect(jsonPath("$.userVotes").value(DEFAULT_USER_VOTES.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingExtraUserInfo() throws Exception {
        // Get the extraUserInfo
        restExtraUserInfoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExtraUserInfo() throws Exception {
        // Initialize the database
        extraUserInfoRepository.saveAndFlush(extraUserInfo);

        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();

        // Update the extraUserInfo
        ExtraUserInfo updatedExtraUserInfo = extraUserInfoRepository.findById(extraUserInfo.getId()).get();
        // Disconnect from session so that the updates on updatedExtraUserInfo are not directly saved in db
        em.detach(updatedExtraUserInfo);
        updatedExtraUserInfo
            .phone(UPDATED_PHONE)
            .degree(UPDATED_DEGREE)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .birthDay(UPDATED_BIRTH_DAY)
            .score(UPDATED_SCORE)
            .userVotes(UPDATED_USER_VOTES);

        restExtraUserInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExtraUserInfo.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExtraUserInfo))
            )
            .andExpect(status().isOk());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
        ExtraUserInfo testExtraUserInfo = extraUserInfoList.get(extraUserInfoList.size() - 1);
        assertThat(testExtraUserInfo.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testExtraUserInfo.getDegree()).isEqualTo(UPDATED_DEGREE);
        assertThat(testExtraUserInfo.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testExtraUserInfo.getBirthDay()).isEqualTo(UPDATED_BIRTH_DAY);
        assertThat(testExtraUserInfo.getScore()).isEqualTo(UPDATED_SCORE);
        assertThat(testExtraUserInfo.getUserVotes()).isEqualTo(UPDATED_USER_VOTES);
    }

    @Test
    @Transactional
    void putNonExistingExtraUserInfo() throws Exception {
        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();
        extraUserInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtraUserInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, extraUserInfo.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExtraUserInfo() throws Exception {
        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();
        extraUserInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExtraUserInfo() throws Exception {
        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();
        extraUserInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserInfoMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExtraUserInfoWithPatch() throws Exception {
        // Initialize the database
        extraUserInfoRepository.saveAndFlush(extraUserInfo);

        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();

        // Update the extraUserInfo using partial update
        ExtraUserInfo partialUpdatedExtraUserInfo = new ExtraUserInfo();
        partialUpdatedExtraUserInfo.setId(extraUserInfo.getId());

        partialUpdatedExtraUserInfo.birthDay(UPDATED_BIRTH_DAY).score(UPDATED_SCORE).userVotes(UPDATED_USER_VOTES);

        restExtraUserInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExtraUserInfo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExtraUserInfo))
            )
            .andExpect(status().isOk());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
        ExtraUserInfo testExtraUserInfo = extraUserInfoList.get(extraUserInfoList.size() - 1);
        assertThat(testExtraUserInfo.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testExtraUserInfo.getDegree()).isEqualTo(DEFAULT_DEGREE);
        assertThat(testExtraUserInfo.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testExtraUserInfo.getBirthDay()).isEqualTo(UPDATED_BIRTH_DAY);
        assertThat(testExtraUserInfo.getScore()).isEqualTo(UPDATED_SCORE);
        assertThat(testExtraUserInfo.getUserVotes()).isEqualTo(UPDATED_USER_VOTES);
    }

    @Test
    @Transactional
    void fullUpdateExtraUserInfoWithPatch() throws Exception {
        // Initialize the database
        extraUserInfoRepository.saveAndFlush(extraUserInfo);

        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();

        // Update the extraUserInfo using partial update
        ExtraUserInfo partialUpdatedExtraUserInfo = new ExtraUserInfo();
        partialUpdatedExtraUserInfo.setId(extraUserInfo.getId());

        partialUpdatedExtraUserInfo
            .phone(UPDATED_PHONE)
            .degree(UPDATED_DEGREE)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .birthDay(UPDATED_BIRTH_DAY)
            .score(UPDATED_SCORE)
            .userVotes(UPDATED_USER_VOTES);

        restExtraUserInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExtraUserInfo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExtraUserInfo))
            )
            .andExpect(status().isOk());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
        ExtraUserInfo testExtraUserInfo = extraUserInfoList.get(extraUserInfoList.size() - 1);
        assertThat(testExtraUserInfo.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testExtraUserInfo.getDegree()).isEqualTo(UPDATED_DEGREE);
        assertThat(testExtraUserInfo.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testExtraUserInfo.getBirthDay()).isEqualTo(UPDATED_BIRTH_DAY);
        assertThat(testExtraUserInfo.getScore()).isEqualTo(UPDATED_SCORE);
        assertThat(testExtraUserInfo.getUserVotes()).isEqualTo(UPDATED_USER_VOTES);
    }

    @Test
    @Transactional
    void patchNonExistingExtraUserInfo() throws Exception {
        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();
        extraUserInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtraUserInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, extraUserInfo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExtraUserInfo() throws Exception {
        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();
        extraUserInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExtraUserInfo() throws Exception {
        int databaseSizeBeforeUpdate = extraUserInfoRepository.findAll().size();
        extraUserInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserInfoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extraUserInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExtraUserInfo in the database
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExtraUserInfo() throws Exception {
        // Initialize the database
        extraUserInfoRepository.saveAndFlush(extraUserInfo);

        int databaseSizeBeforeDelete = extraUserInfoRepository.findAll().size();

        // Delete the extraUserInfo
        restExtraUserInfoMockMvc
            .perform(delete(ENTITY_API_URL_ID, extraUserInfo.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExtraUserInfo> extraUserInfoList = extraUserInfoRepository.findAll();
        assertThat(extraUserInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
