package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.Courses;
import com.cenfotec.repository.CoursesRepository;
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
 * Integration tests for the {@link CoursesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CoursesResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PREVIEW_IMG = "AAAAAAAAAA";
    private static final String UPDATED_PREVIEW_IMG = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final Double DEFAULT_SCORE = 1D;
    private static final Double UPDATED_SCORE = 2D;

    private static final String DEFAULT_EXCERPT = "AAAAAAAAAA";
    private static final String UPDATED_EXCERPT = "BBBBBBBBBB";

    private static final Integer DEFAULT_USER_ID = 1;
    private static final Integer UPDATED_USER_ID = 2;

    private static final Double DEFAULT_USER_VOTES = 1D;
    private static final Double UPDATED_USER_VOTES = 2D;

    private static final String DEFAULT_OWNER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_OWNER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_USER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_USER_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/courses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CoursesRepository coursesRepository;

    @Mock
    private CoursesRepository coursesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCoursesMockMvc;

    private Courses courses;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Courses createEntity(EntityManager em) {
        Courses courses = new Courses()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .previewImg(DEFAULT_PREVIEW_IMG)
            .status(DEFAULT_STATUS)
            .score(DEFAULT_SCORE)
            .excerpt(DEFAULT_EXCERPT)
            .userId(DEFAULT_USER_ID)
            .userVotes(DEFAULT_USER_VOTES)
            .ownerName(DEFAULT_OWNER_NAME)
            .userName(DEFAULT_USER_NAME);
        return courses;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Courses createUpdatedEntity(EntityManager em) {
        Courses courses = new Courses()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .previewImg(UPDATED_PREVIEW_IMG)
            .status(UPDATED_STATUS)
            .score(UPDATED_SCORE)
            .excerpt(UPDATED_EXCERPT)
            .userId(UPDATED_USER_ID)
            .userVotes(UPDATED_USER_VOTES)
            .ownerName(UPDATED_OWNER_NAME)
            .userName(UPDATED_USER_NAME);
        return courses;
    }

    @BeforeEach
    public void initTest() {
        courses = createEntity(em);
    }

    @Test
    @Transactional
    void createCourses() throws Exception {
        int databaseSizeBeforeCreate = coursesRepository.findAll().size();
        // Create the Courses
        restCoursesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isCreated());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeCreate + 1);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCourses.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCourses.getPreviewImg()).isEqualTo(DEFAULT_PREVIEW_IMG);
        assertThat(testCourses.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testCourses.getScore()).isEqualTo(DEFAULT_SCORE);
        assertThat(testCourses.getExcerpt()).isEqualTo(DEFAULT_EXCERPT);
        assertThat(testCourses.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testCourses.getUserVotes()).isEqualTo(DEFAULT_USER_VOTES);
        assertThat(testCourses.getOwnerName()).isEqualTo(DEFAULT_OWNER_NAME);
        assertThat(testCourses.getUserName()).isEqualTo(DEFAULT_USER_NAME);
    }

    @Test
    @Transactional
    void createCoursesWithExistingId() throws Exception {
        // Create the Courses with an existing ID
        courses.setId(1L);

        int databaseSizeBeforeCreate = coursesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCoursesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCourses() throws Exception {
        // Initialize the database
        coursesRepository.saveAndFlush(courses);

        // Get all the coursesList
        restCoursesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(courses.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].previewImg").value(hasItem(DEFAULT_PREVIEW_IMG)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE.doubleValue())))
            .andExpect(jsonPath("$.[*].excerpt").value(hasItem(DEFAULT_EXCERPT)))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].userVotes").value(hasItem(DEFAULT_USER_VOTES.doubleValue())))
            .andExpect(jsonPath("$.[*].ownerName").value(hasItem(DEFAULT_OWNER_NAME)))
            .andExpect(jsonPath("$.[*].userName").value(hasItem(DEFAULT_USER_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCoursesWithEagerRelationshipsIsEnabled() throws Exception {
        when(coursesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCoursesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(coursesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCoursesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(coursesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCoursesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(coursesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCourses() throws Exception {
        // Initialize the database
        coursesRepository.saveAndFlush(courses);

        // Get the courses
        restCoursesMockMvc
            .perform(get(ENTITY_API_URL_ID, courses.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(courses.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.previewImg").value(DEFAULT_PREVIEW_IMG))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE.doubleValue()))
            .andExpect(jsonPath("$.excerpt").value(DEFAULT_EXCERPT))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.userVotes").value(DEFAULT_USER_VOTES.doubleValue()))
            .andExpect(jsonPath("$.ownerName").value(DEFAULT_OWNER_NAME))
            .andExpect(jsonPath("$.userName").value(DEFAULT_USER_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCourses() throws Exception {
        // Get the courses
        restCoursesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCourses() throws Exception {
        // Initialize the database
        coursesRepository.saveAndFlush(courses);

        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();

        // Update the courses
        Courses updatedCourses = coursesRepository.findById(courses.getId()).get();
        // Disconnect from session so that the updates on updatedCourses are not directly saved in db
        em.detach(updatedCourses);
        updatedCourses
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .previewImg(UPDATED_PREVIEW_IMG)
            .status(UPDATED_STATUS)
            .score(UPDATED_SCORE)
            .excerpt(UPDATED_EXCERPT)
            .userId(UPDATED_USER_ID)
            .userVotes(UPDATED_USER_VOTES)
            .ownerName(UPDATED_OWNER_NAME)
            .userName(UPDATED_USER_NAME);

        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCourses.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCourses))
            )
            .andExpect(status().isOk());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCourses.getPreviewImg()).isEqualTo(UPDATED_PREVIEW_IMG);
        assertThat(testCourses.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCourses.getScore()).isEqualTo(UPDATED_SCORE);
        assertThat(testCourses.getExcerpt()).isEqualTo(UPDATED_EXCERPT);
        assertThat(testCourses.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testCourses.getUserVotes()).isEqualTo(UPDATED_USER_VOTES);
        assertThat(testCourses.getOwnerName()).isEqualTo(UPDATED_OWNER_NAME);
        assertThat(testCourses.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courses.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCoursesWithPatch() throws Exception {
        // Initialize the database
        coursesRepository.saveAndFlush(courses);

        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();

        // Update the courses using partial update
        Courses partialUpdatedCourses = new Courses();
        partialUpdatedCourses.setId(courses.getId());

        partialUpdatedCourses.description(UPDATED_DESCRIPTION).score(UPDATED_SCORE).excerpt(UPDATED_EXCERPT).userName(UPDATED_USER_NAME);

        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourses.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourses))
            )
            .andExpect(status().isOk());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCourses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCourses.getPreviewImg()).isEqualTo(DEFAULT_PREVIEW_IMG);
        assertThat(testCourses.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testCourses.getScore()).isEqualTo(UPDATED_SCORE);
        assertThat(testCourses.getExcerpt()).isEqualTo(UPDATED_EXCERPT);
        assertThat(testCourses.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testCourses.getUserVotes()).isEqualTo(DEFAULT_USER_VOTES);
        assertThat(testCourses.getOwnerName()).isEqualTo(DEFAULT_OWNER_NAME);
        assertThat(testCourses.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCoursesWithPatch() throws Exception {
        // Initialize the database
        coursesRepository.saveAndFlush(courses);

        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();

        // Update the courses using partial update
        Courses partialUpdatedCourses = new Courses();
        partialUpdatedCourses.setId(courses.getId());

        partialUpdatedCourses
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .previewImg(UPDATED_PREVIEW_IMG)
            .status(UPDATED_STATUS)
            .score(UPDATED_SCORE)
            .excerpt(UPDATED_EXCERPT)
            .userId(UPDATED_USER_ID)
            .userVotes(UPDATED_USER_VOTES)
            .ownerName(UPDATED_OWNER_NAME)
            .userName(UPDATED_USER_NAME);

        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourses.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourses))
            )
            .andExpect(status().isOk());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCourses.getPreviewImg()).isEqualTo(UPDATED_PREVIEW_IMG);
        assertThat(testCourses.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCourses.getScore()).isEqualTo(UPDATED_SCORE);
        assertThat(testCourses.getExcerpt()).isEqualTo(UPDATED_EXCERPT);
        assertThat(testCourses.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testCourses.getUserVotes()).isEqualTo(UPDATED_USER_VOTES);
        assertThat(testCourses.getOwnerName()).isEqualTo(UPDATED_OWNER_NAME);
        assertThat(testCourses.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, courses.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCourses() throws Exception {
        // Initialize the database
        coursesRepository.saveAndFlush(courses);

        int databaseSizeBeforeDelete = coursesRepository.findAll().size();

        // Delete the courses
        restCoursesMockMvc
            .perform(delete(ENTITY_API_URL_ID, courses.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
