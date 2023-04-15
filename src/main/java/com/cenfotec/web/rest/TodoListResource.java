package com.cenfotec.web.rest;

import com.cenfotec.domain.Courses;
import com.cenfotec.domain.TodoList;
import com.cenfotec.domain.User;
import com.cenfotec.repository.TodoListRepository;
import com.cenfotec.security.SecurityUtils;
import com.cenfotec.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.domain.TodoList}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TodoListResource {

    private final Logger log = LoggerFactory.getLogger(TodoListResource.class);

    private static final String ENTITY_NAME = "todoList";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TodoListRepository todoListRepository;

    public TodoListResource(TodoListRepository todoListRepository) {
        this.todoListRepository = todoListRepository;
    }

    /**
     * {@code POST  /todo-lists} : Create a new todoList.
     *
     * @param todoList the todoList to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new todoList, or with status {@code 400 (Bad Request)} if the todoList has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/todo-lists")
    public ResponseEntity<TodoList> createTodoList(@RequestBody TodoList todoList) throws URISyntaxException {
        log.debug("REST request to save TodoList : {}", todoList);
        if (todoList.getId() != null) {
            throw new BadRequestAlertException("A new todoList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TodoList result = todoListRepository.save(todoList);

        return ResponseEntity
            .created(new URI("/api/todo-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /todo-lists/:id} : Updates an existing todoList.
     *
     * @param id the id of the todoList to save.
     * @param todoList the todoList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoList,
     * or with status {@code 400 (Bad Request)} if the todoList is not valid,
     * or with status {@code 500 (Internal Server Error)} if the todoList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/todo-lists/{id}")
    public ResponseEntity<TodoList> updateTodoList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TodoList todoList
    ) throws URISyntaxException {
        log.debug("REST request to update TodoList : {}, {}", id, todoList);
        if (todoList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TodoList result = todoListRepository.save(todoList);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoList.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /todo-lists/:id} : Partial updates given fields of an existing todoList, field will ignore if it is null
     *
     * @param id the id of the todoList to save.
     * @param todoList the todoList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoList,
     * or with status {@code 400 (Bad Request)} if the todoList is not valid,
     * or with status {@code 404 (Not Found)} if the todoList is not found,
     * or with status {@code 500 (Internal Server Error)} if the todoList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/todo-lists/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TodoList> partialUpdateTodoList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TodoList todoList
    ) throws URISyntaxException {
        log.debug("REST request to partial update TodoList partially : {}, {}", id, todoList);
        if (todoList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TodoList> result = todoListRepository
            .findById(todoList.getId())
            .map(existingTodoList -> {
                if (todoList.getTask() != null) {
                    existingTodoList.setTask(todoList.getTask());
                }
                if (todoList.getPriority() != null) {
                    existingTodoList.setPriority(todoList.getPriority());
                }
                if (todoList.getStatus() != null) {
                    existingTodoList.setStatus(todoList.getStatus());
                }

                return existingTodoList;
            })
            .map(todoListRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoList.getId().toString())
        );
    }

    /**
     * {@code GET  /todo-lists} : get all the todoLists.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todoLists in body.
     */
    @GetMapping("/todo-lists")
    public List<TodoList> getAllTodoLists(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TodoLists");
        if (eagerload) {
            return todoListRepository.findAllWithEagerRelationships();
        } else {
            return todoListRepository.findAll();
        }
    }

    /**
     * {@code GET  /todo-lists/:id} : get the "id" todoList.
     *
     * @param id the id of the todoList to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the todoList, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/todo-lists/{id}")
    public ResponseEntity<TodoList> getTodoList(@PathVariable Long id) {
        log.debug("REST request to get TodoList : {}", id);
        Optional<TodoList> todoList = todoListRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(todoList);
    }

    /**
     * {@code DELETE  /todo-lists/:id} : delete the "id" todoList.
     *
     * @param id the id of the todoList to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/todo-lists/{id}")
    public ResponseEntity<Void> deleteTodoList(@PathVariable Long id) {
        log.debug("REST request to delete TodoList : {}", id);
        todoListRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/todo-lists/isRegistered/{id}")
    public List<TodoList> isUserRegister(@PathVariable Long id) {
        User user = new User(id);
        List<TodoList> res = todoListRepository.findByUserLike(user);
        return res;
    }
}
