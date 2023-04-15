package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.CourseVotes;
import com.cenfotec.repository.CourseVotesRepository;
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
 * Integration tests for the {@link CourseVotesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CourseVotesResourceIT {

    private static final Long DEFAULT_ID_COURSE = 1L;
    private static final Long UPDATED_ID_COURSE = 2L;

    private static final String DEFAULT_JSON = "AAAAAAAAAA";
    private static final String UPDATED_JSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/course-votes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CourseVotesRepository courseVotesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCourseVotesMockMvc;

    private CourseVotes courseVotes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseVotes createEntity(EntityManager em) {
        CourseVotes courseVotes = new CourseVotes().idCourse(DEFAULT_ID_COURSE).json(DEFAULT_JSON);
        return courseVotes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseVotes createUpdatedEntity(EntityManager em) {
        CourseVotes courseVotes = new CourseVotes().idCourse(UPDATED_ID_COURSE).json(UPDATED_JSON);
        return courseVotes;
    }

    @BeforeEach
    public void initTest() {
        courseVotes = createEntity(em);
    }

    @Test
    @Transactional
    void createCourseVotes() throws Exception {
        int databaseSizeBeforeCreate = courseVotesRepository.findAll().size();
        // Create the CourseVotes
        restCourseVotesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isCreated());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeCreate + 1);
        CourseVotes testCourseVotes = courseVotesList.get(courseVotesList.size() - 1);
        assertThat(testCourseVotes.getIdCourse()).isEqualTo(DEFAULT_ID_COURSE);
        assertThat(testCourseVotes.getJson()).isEqualTo(DEFAULT_JSON);
    }

    @Test
    @Transactional
    void createCourseVotesWithExistingId() throws Exception {
        // Create the CourseVotes with an existing ID
        courseVotes.setId(1L);

        int databaseSizeBeforeCreate = courseVotesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCourseVotesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCourseVotes() throws Exception {
        // Initialize the database
        courseVotesRepository.saveAndFlush(courseVotes);

        // Get all the courseVotesList
        restCourseVotesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(courseVotes.getId().intValue())))
            .andExpect(jsonPath("$.[*].idCourse").value(hasItem(DEFAULT_ID_COURSE.intValue())))
            .andExpect(jsonPath("$.[*].json").value(hasItem(DEFAULT_JSON)));
    }

    @Test
    @Transactional
    void getCourseVotes() throws Exception {
        // Initialize the database
        courseVotesRepository.saveAndFlush(courseVotes);

        // Get the courseVotes
        restCourseVotesMockMvc
            .perform(get(ENTITY_API_URL_ID, courseVotes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(courseVotes.getId().intValue()))
            .andExpect(jsonPath("$.idCourse").value(DEFAULT_ID_COURSE.intValue()))
            .andExpect(jsonPath("$.json").value(DEFAULT_JSON));
    }

    @Test
    @Transactional
    void getNonExistingCourseVotes() throws Exception {
        // Get the courseVotes
        restCourseVotesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCourseVotes() throws Exception {
        // Initialize the database
        courseVotesRepository.saveAndFlush(courseVotes);

        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();

        // Update the courseVotes
        CourseVotes updatedCourseVotes = courseVotesRepository.findById(courseVotes.getId()).get();
        // Disconnect from session so that the updates on updatedCourseVotes are not directly saved in db
        em.detach(updatedCourseVotes);
        updatedCourseVotes.idCourse(UPDATED_ID_COURSE).json(UPDATED_JSON);

        restCourseVotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCourseVotes.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCourseVotes))
            )
            .andExpect(status().isOk());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
        CourseVotes testCourseVotes = courseVotesList.get(courseVotesList.size() - 1);
        assertThat(testCourseVotes.getIdCourse()).isEqualTo(UPDATED_ID_COURSE);
        assertThat(testCourseVotes.getJson()).isEqualTo(UPDATED_JSON);
    }

    @Test
    @Transactional
    void putNonExistingCourseVotes() throws Exception {
        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();
        courseVotes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseVotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courseVotes.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCourseVotes() throws Exception {
        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();
        courseVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseVotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCourseVotes() throws Exception {
        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();
        courseVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseVotesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCourseVotesWithPatch() throws Exception {
        // Initialize the database
        courseVotesRepository.saveAndFlush(courseVotes);

        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();

        // Update the courseVotes using partial update
        CourseVotes partialUpdatedCourseVotes = new CourseVotes();
        partialUpdatedCourseVotes.setId(courseVotes.getId());

        partialUpdatedCourseVotes.idCourse(UPDATED_ID_COURSE);

        restCourseVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseVotes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourseVotes))
            )
            .andExpect(status().isOk());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
        CourseVotes testCourseVotes = courseVotesList.get(courseVotesList.size() - 1);
        assertThat(testCourseVotes.getIdCourse()).isEqualTo(UPDATED_ID_COURSE);
        assertThat(testCourseVotes.getJson()).isEqualTo(DEFAULT_JSON);
    }

    @Test
    @Transactional
    void fullUpdateCourseVotesWithPatch() throws Exception {
        // Initialize the database
        courseVotesRepository.saveAndFlush(courseVotes);

        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();

        // Update the courseVotes using partial update
        CourseVotes partialUpdatedCourseVotes = new CourseVotes();
        partialUpdatedCourseVotes.setId(courseVotes.getId());

        partialUpdatedCourseVotes.idCourse(UPDATED_ID_COURSE).json(UPDATED_JSON);

        restCourseVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseVotes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourseVotes))
            )
            .andExpect(status().isOk());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
        CourseVotes testCourseVotes = courseVotesList.get(courseVotesList.size() - 1);
        assertThat(testCourseVotes.getIdCourse()).isEqualTo(UPDATED_ID_COURSE);
        assertThat(testCourseVotes.getJson()).isEqualTo(UPDATED_JSON);
    }

    @Test
    @Transactional
    void patchNonExistingCourseVotes() throws Exception {
        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();
        courseVotes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, courseVotes.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCourseVotes() throws Exception {
        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();
        courseVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseVotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCourseVotes() throws Exception {
        int databaseSizeBeforeUpdate = courseVotesRepository.findAll().size();
        courseVotes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseVotesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courseVotes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseVotes in the database
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCourseVotes() throws Exception {
        // Initialize the database
        courseVotesRepository.saveAndFlush(courseVotes);

        int databaseSizeBeforeDelete = courseVotesRepository.findAll().size();

        // Delete the courseVotes
        restCourseVotesMockMvc
            .perform(delete(ENTITY_API_URL_ID, courseVotes.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CourseVotes> courseVotesList = courseVotesRepository.findAll();
        assertThat(courseVotesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
