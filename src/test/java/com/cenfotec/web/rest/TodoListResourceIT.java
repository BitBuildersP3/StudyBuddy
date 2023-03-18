package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.TodoList;
import com.cenfotec.repository.TodoListRepository;
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
 * Integration tests for the {@link TodoListResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TodoListResourceIT {

    private static final String DEFAULT_TASK = "AAAAAAAAAA";
    private static final String UPDATED_TASK = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRIORITY = 1;
    private static final Integer UPDATED_PRIORITY = 2;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/todo-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodoListRepository todoListRepository;

    @Mock
    private TodoListRepository todoListRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoListMockMvc;

    private TodoList todoList;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoList createEntity(EntityManager em) {
        TodoList todoList = new TodoList().task(DEFAULT_TASK).priority(DEFAULT_PRIORITY).status(DEFAULT_STATUS);
        return todoList;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoList createUpdatedEntity(EntityManager em) {
        TodoList todoList = new TodoList().task(UPDATED_TASK).priority(UPDATED_PRIORITY).status(UPDATED_STATUS);
        return todoList;
    }

    @BeforeEach
    public void initTest() {
        todoList = createEntity(em);
    }

    @Test
    @Transactional
    void createTodoList() throws Exception {
        int databaseSizeBeforeCreate = todoListRepository.findAll().size();
        // Create the TodoList
        restTodoListMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isCreated());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeCreate + 1);
        TodoList testTodoList = todoListList.get(todoListList.size() - 1);
        assertThat(testTodoList.getTask()).isEqualTo(DEFAULT_TASK);
        assertThat(testTodoList.getPriority()).isEqualTo(DEFAULT_PRIORITY);
        assertThat(testTodoList.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createTodoListWithExistingId() throws Exception {
        // Create the TodoList with an existing ID
        todoList.setId(1L);

        int databaseSizeBeforeCreate = todoListRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoListMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTodoLists() throws Exception {
        // Initialize the database
        todoListRepository.saveAndFlush(todoList);

        // Get all the todoListList
        restTodoListMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todoList.getId().intValue())))
            .andExpect(jsonPath("$.[*].task").value(hasItem(DEFAULT_TASK)))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTodoListsWithEagerRelationshipsIsEnabled() throws Exception {
        when(todoListRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTodoListMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(todoListRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTodoListsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(todoListRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTodoListMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(todoListRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTodoList() throws Exception {
        // Initialize the database
        todoListRepository.saveAndFlush(todoList);

        // Get the todoList
        restTodoListMockMvc
            .perform(get(ENTITY_API_URL_ID, todoList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todoList.getId().intValue()))
            .andExpect(jsonPath("$.task").value(DEFAULT_TASK))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingTodoList() throws Exception {
        // Get the todoList
        restTodoListMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTodoList() throws Exception {
        // Initialize the database
        todoListRepository.saveAndFlush(todoList);

        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();

        // Update the todoList
        TodoList updatedTodoList = todoListRepository.findById(todoList.getId()).get();
        // Disconnect from session so that the updates on updatedTodoList are not directly saved in db
        em.detach(updatedTodoList);
        updatedTodoList.task(UPDATED_TASK).priority(UPDATED_PRIORITY).status(UPDATED_STATUS);

        restTodoListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTodoList.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTodoList))
            )
            .andExpect(status().isOk());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
        TodoList testTodoList = todoListList.get(todoListList.size() - 1);
        assertThat(testTodoList.getTask()).isEqualTo(UPDATED_TASK);
        assertThat(testTodoList.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testTodoList.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingTodoList() throws Exception {
        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();
        todoList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoList.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodoList() throws Exception {
        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();
        todoList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodoList() throws Exception {
        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();
        todoList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodoListWithPatch() throws Exception {
        // Initialize the database
        todoListRepository.saveAndFlush(todoList);

        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();

        // Update the todoList using partial update
        TodoList partialUpdatedTodoList = new TodoList();
        partialUpdatedTodoList.setId(todoList.getId());

        partialUpdatedTodoList.priority(UPDATED_PRIORITY).status(UPDATED_STATUS);

        restTodoListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoList))
            )
            .andExpect(status().isOk());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
        TodoList testTodoList = todoListList.get(todoListList.size() - 1);
        assertThat(testTodoList.getTask()).isEqualTo(DEFAULT_TASK);
        assertThat(testTodoList.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testTodoList.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateTodoListWithPatch() throws Exception {
        // Initialize the database
        todoListRepository.saveAndFlush(todoList);

        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();

        // Update the todoList using partial update
        TodoList partialUpdatedTodoList = new TodoList();
        partialUpdatedTodoList.setId(todoList.getId());

        partialUpdatedTodoList.task(UPDATED_TASK).priority(UPDATED_PRIORITY).status(UPDATED_STATUS);

        restTodoListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoList))
            )
            .andExpect(status().isOk());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
        TodoList testTodoList = todoListList.get(todoListList.size() - 1);
        assertThat(testTodoList.getTask()).isEqualTo(UPDATED_TASK);
        assertThat(testTodoList.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testTodoList.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingTodoList() throws Exception {
        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();
        todoList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todoList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodoList() throws Exception {
        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();
        todoList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodoList() throws Exception {
        int databaseSizeBeforeUpdate = todoListRepository.findAll().size();
        todoList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoList))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoList in the database
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodoList() throws Exception {
        // Initialize the database
        todoListRepository.saveAndFlush(todoList);

        int databaseSizeBeforeDelete = todoListRepository.findAll().size();

        // Delete the todoList
        restTodoListMockMvc
            .perform(delete(ENTITY_API_URL_ID, todoList.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TodoList> todoListList = todoListRepository.findAll();
        assertThat(todoListList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
