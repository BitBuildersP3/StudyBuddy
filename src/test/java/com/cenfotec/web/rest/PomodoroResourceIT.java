package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.Pomodoro;
import com.cenfotec.repository.PomodoroRepository;
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
 * Integration tests for the {@link PomodoroResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PomodoroResourceIT {

    private static final LocalDate DEFAULT_BEGIN_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BEGIN_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_TOTAL_TIME = 1D;
    private static final Double UPDATED_TOTAL_TIME = 2D;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_TASK = "AAAAAAAAAA";
    private static final String UPDATED_TASK = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BEGIN_BREAK = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BEGIN_BREAK = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_BREAK = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_BREAK = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_TOTAL_BREAK = 1D;
    private static final Double UPDATED_TOTAL_BREAK = 2D;

    private static final String ENTITY_API_URL = "/api/pomodoros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PomodoroRepository pomodoroRepository;

    @Mock
    private PomodoroRepository pomodoroRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPomodoroMockMvc;

    private Pomodoro pomodoro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pomodoro createEntity(EntityManager em) {
        Pomodoro pomodoro = new Pomodoro()
            .beginTime(DEFAULT_BEGIN_TIME)
            .endTime(DEFAULT_END_TIME)
            .totalTime(DEFAULT_TOTAL_TIME)
            .status(DEFAULT_STATUS)
            .task(DEFAULT_TASK)
            .beginBreak(DEFAULT_BEGIN_BREAK)
            .endBreak(DEFAULT_END_BREAK)
            .totalBreak(DEFAULT_TOTAL_BREAK);
        return pomodoro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pomodoro createUpdatedEntity(EntityManager em) {
        Pomodoro pomodoro = new Pomodoro()
            .beginTime(UPDATED_BEGIN_TIME)
            .endTime(UPDATED_END_TIME)
            .totalTime(UPDATED_TOTAL_TIME)
            .status(UPDATED_STATUS)
            .task(UPDATED_TASK)
            .beginBreak(UPDATED_BEGIN_BREAK)
            .endBreak(UPDATED_END_BREAK)
            .totalBreak(UPDATED_TOTAL_BREAK);
        return pomodoro;
    }

    @BeforeEach
    public void initTest() {
        pomodoro = createEntity(em);
    }

    @Test
    @Transactional
    void createPomodoro() throws Exception {
        int databaseSizeBeforeCreate = pomodoroRepository.findAll().size();
        // Create the Pomodoro
        restPomodoroMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isCreated());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeCreate + 1);
        Pomodoro testPomodoro = pomodoroList.get(pomodoroList.size() - 1);
        assertThat(testPomodoro.getBeginTime()).isEqualTo(DEFAULT_BEGIN_TIME);
        assertThat(testPomodoro.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testPomodoro.getTotalTime()).isEqualTo(DEFAULT_TOTAL_TIME);
        assertThat(testPomodoro.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPomodoro.getTask()).isEqualTo(DEFAULT_TASK);
        assertThat(testPomodoro.getBeginBreak()).isEqualTo(DEFAULT_BEGIN_BREAK);
        assertThat(testPomodoro.getEndBreak()).isEqualTo(DEFAULT_END_BREAK);
        assertThat(testPomodoro.getTotalBreak()).isEqualTo(DEFAULT_TOTAL_BREAK);
    }

    @Test
    @Transactional
    void createPomodoroWithExistingId() throws Exception {
        // Create the Pomodoro with an existing ID
        pomodoro.setId(1L);

        int databaseSizeBeforeCreate = pomodoroRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPomodoroMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPomodoros() throws Exception {
        // Initialize the database
        pomodoroRepository.saveAndFlush(pomodoro);

        // Get all the pomodoroList
        restPomodoroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pomodoro.getId().intValue())))
            .andExpect(jsonPath("$.[*].beginTime").value(hasItem(DEFAULT_BEGIN_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].totalTime").value(hasItem(DEFAULT_TOTAL_TIME.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].task").value(hasItem(DEFAULT_TASK)))
            .andExpect(jsonPath("$.[*].beginBreak").value(hasItem(DEFAULT_BEGIN_BREAK.toString())))
            .andExpect(jsonPath("$.[*].endBreak").value(hasItem(DEFAULT_END_BREAK.toString())))
            .andExpect(jsonPath("$.[*].totalBreak").value(hasItem(DEFAULT_TOTAL_BREAK.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPomodorosWithEagerRelationshipsIsEnabled() throws Exception {
        when(pomodoroRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPomodoroMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(pomodoroRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPomodorosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(pomodoroRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPomodoroMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(pomodoroRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPomodoro() throws Exception {
        // Initialize the database
        pomodoroRepository.saveAndFlush(pomodoro);

        // Get the pomodoro
        restPomodoroMockMvc
            .perform(get(ENTITY_API_URL_ID, pomodoro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pomodoro.getId().intValue()))
            .andExpect(jsonPath("$.beginTime").value(DEFAULT_BEGIN_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.totalTime").value(DEFAULT_TOTAL_TIME.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.task").value(DEFAULT_TASK))
            .andExpect(jsonPath("$.beginBreak").value(DEFAULT_BEGIN_BREAK.toString()))
            .andExpect(jsonPath("$.endBreak").value(DEFAULT_END_BREAK.toString()))
            .andExpect(jsonPath("$.totalBreak").value(DEFAULT_TOTAL_BREAK.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingPomodoro() throws Exception {
        // Get the pomodoro
        restPomodoroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPomodoro() throws Exception {
        // Initialize the database
        pomodoroRepository.saveAndFlush(pomodoro);

        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();

        // Update the pomodoro
        Pomodoro updatedPomodoro = pomodoroRepository.findById(pomodoro.getId()).get();
        // Disconnect from session so that the updates on updatedPomodoro are not directly saved in db
        em.detach(updatedPomodoro);
        updatedPomodoro
            .beginTime(UPDATED_BEGIN_TIME)
            .endTime(UPDATED_END_TIME)
            .totalTime(UPDATED_TOTAL_TIME)
            .status(UPDATED_STATUS)
            .task(UPDATED_TASK)
            .beginBreak(UPDATED_BEGIN_BREAK)
            .endBreak(UPDATED_END_BREAK)
            .totalBreak(UPDATED_TOTAL_BREAK);

        restPomodoroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPomodoro.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPomodoro))
            )
            .andExpect(status().isOk());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
        Pomodoro testPomodoro = pomodoroList.get(pomodoroList.size() - 1);
        assertThat(testPomodoro.getBeginTime()).isEqualTo(UPDATED_BEGIN_TIME);
        assertThat(testPomodoro.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testPomodoro.getTotalTime()).isEqualTo(UPDATED_TOTAL_TIME);
        assertThat(testPomodoro.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPomodoro.getTask()).isEqualTo(UPDATED_TASK);
        assertThat(testPomodoro.getBeginBreak()).isEqualTo(UPDATED_BEGIN_BREAK);
        assertThat(testPomodoro.getEndBreak()).isEqualTo(UPDATED_END_BREAK);
        assertThat(testPomodoro.getTotalBreak()).isEqualTo(UPDATED_TOTAL_BREAK);
    }

    @Test
    @Transactional
    void putNonExistingPomodoro() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();
        pomodoro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPomodoroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pomodoro.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPomodoro() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();
        pomodoro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPomodoro() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();
        pomodoro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePomodoroWithPatch() throws Exception {
        // Initialize the database
        pomodoroRepository.saveAndFlush(pomodoro);

        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();

        // Update the pomodoro using partial update
        Pomodoro partialUpdatedPomodoro = new Pomodoro();
        partialUpdatedPomodoro.setId(pomodoro.getId());

        partialUpdatedPomodoro.endTime(UPDATED_END_TIME).totalTime(UPDATED_TOTAL_TIME).totalBreak(UPDATED_TOTAL_BREAK);

        restPomodoroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPomodoro.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPomodoro))
            )
            .andExpect(status().isOk());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
        Pomodoro testPomodoro = pomodoroList.get(pomodoroList.size() - 1);
        assertThat(testPomodoro.getBeginTime()).isEqualTo(DEFAULT_BEGIN_TIME);
        assertThat(testPomodoro.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testPomodoro.getTotalTime()).isEqualTo(UPDATED_TOTAL_TIME);
        assertThat(testPomodoro.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPomodoro.getTask()).isEqualTo(DEFAULT_TASK);
        assertThat(testPomodoro.getBeginBreak()).isEqualTo(DEFAULT_BEGIN_BREAK);
        assertThat(testPomodoro.getEndBreak()).isEqualTo(DEFAULT_END_BREAK);
        assertThat(testPomodoro.getTotalBreak()).isEqualTo(UPDATED_TOTAL_BREAK);
    }

    @Test
    @Transactional
    void fullUpdatePomodoroWithPatch() throws Exception {
        // Initialize the database
        pomodoroRepository.saveAndFlush(pomodoro);

        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();

        // Update the pomodoro using partial update
        Pomodoro partialUpdatedPomodoro = new Pomodoro();
        partialUpdatedPomodoro.setId(pomodoro.getId());

        partialUpdatedPomodoro
            .beginTime(UPDATED_BEGIN_TIME)
            .endTime(UPDATED_END_TIME)
            .totalTime(UPDATED_TOTAL_TIME)
            .status(UPDATED_STATUS)
            .task(UPDATED_TASK)
            .beginBreak(UPDATED_BEGIN_BREAK)
            .endBreak(UPDATED_END_BREAK)
            .totalBreak(UPDATED_TOTAL_BREAK);

        restPomodoroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPomodoro.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPomodoro))
            )
            .andExpect(status().isOk());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
        Pomodoro testPomodoro = pomodoroList.get(pomodoroList.size() - 1);
        assertThat(testPomodoro.getBeginTime()).isEqualTo(UPDATED_BEGIN_TIME);
        assertThat(testPomodoro.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testPomodoro.getTotalTime()).isEqualTo(UPDATED_TOTAL_TIME);
        assertThat(testPomodoro.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPomodoro.getTask()).isEqualTo(UPDATED_TASK);
        assertThat(testPomodoro.getBeginBreak()).isEqualTo(UPDATED_BEGIN_BREAK);
        assertThat(testPomodoro.getEndBreak()).isEqualTo(UPDATED_END_BREAK);
        assertThat(testPomodoro.getTotalBreak()).isEqualTo(UPDATED_TOTAL_BREAK);
    }

    @Test
    @Transactional
    void patchNonExistingPomodoro() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();
        pomodoro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPomodoroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pomodoro.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPomodoro() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();
        pomodoro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPomodoro() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroRepository.findAll().size();
        pomodoro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pomodoro))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pomodoro in the database
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePomodoro() throws Exception {
        // Initialize the database
        pomodoroRepository.saveAndFlush(pomodoro);

        int databaseSizeBeforeDelete = pomodoroRepository.findAll().size();

        // Delete the pomodoro
        restPomodoroMockMvc
            .perform(delete(ENTITY_API_URL_ID, pomodoro.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pomodoro> pomodoroList = pomodoroRepository.findAll();
        assertThat(pomodoroList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
