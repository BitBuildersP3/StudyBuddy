package com.cenfotec.web.rest;

import com.cenfotec.domain.Pomodoro;
import com.cenfotec.repository.PomodoroRepository;
import com.cenfotec.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
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
 * REST controller for managing {@link com.cenfotec.domain.Pomodoro}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PomodoroResource {

    private final Logger log = LoggerFactory.getLogger(PomodoroResource.class);

    private static final String ENTITY_NAME = "pomodoro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PomodoroRepository pomodoroRepository;

    public PomodoroResource(PomodoroRepository pomodoroRepository) {
        this.pomodoroRepository = pomodoroRepository;
    }

    /**
     * {@code POST  /pomodoros} : Create a new pomodoro.
     *
     * @param pomodoro the pomodoro to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pomodoro, or with status {@code 400 (Bad Request)} if the pomodoro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pomodoros")
    public ResponseEntity<Pomodoro> createPomodoro(@RequestBody Pomodoro pomodoro) throws URISyntaxException {
        log.debug("REST request to save Pomodoro : {}", pomodoro);
        if (pomodoro.getId() != null) {
            throw new BadRequestAlertException("A new pomodoro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pomodoro result = pomodoroRepository.save(pomodoro);
        return ResponseEntity
            .created(new URI("/api/pomodoros/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pomodoros/:id} : Updates an existing pomodoro.
     *
     * @param id the id of the pomodoro to save.
     * @param pomodoro the pomodoro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pomodoro,
     * or with status {@code 400 (Bad Request)} if the pomodoro is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pomodoro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pomodoros/{id}")
    public ResponseEntity<Pomodoro> updatePomodoro(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Pomodoro pomodoro
    ) throws URISyntaxException {
        log.debug("REST request to update Pomodoro : {}, {}", id, pomodoro);
        if (pomodoro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pomodoroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pomodoro result = pomodoroRepository.save(pomodoro);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pomodoro.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pomodoros/:id} : Partial updates given fields of an existing pomodoro, field will ignore if it is null
     *
     * @param id the id of the pomodoro to save.
     * @param pomodoro the pomodoro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pomodoro,
     * or with status {@code 400 (Bad Request)} if the pomodoro is not valid,
     * or with status {@code 404 (Not Found)} if the pomodoro is not found,
     * or with status {@code 500 (Internal Server Error)} if the pomodoro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pomodoros/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pomodoro> partialUpdatePomodoro(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Pomodoro pomodoro
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pomodoro partially : {}, {}", id, pomodoro);
        if (pomodoro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pomodoroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pomodoro> result = pomodoroRepository
            .findById(pomodoro.getId())
            .map(existingPomodoro -> {
                if (pomodoro.getBeginTime() != null) {
                    existingPomodoro.setBeginTime(pomodoro.getBeginTime());
                }
                if (pomodoro.getEndTime() != null) {
                    existingPomodoro.setEndTime(pomodoro.getEndTime());
                }
                if (pomodoro.getTotalTime() != null) {
                    existingPomodoro.setTotalTime(pomodoro.getTotalTime());
                }
                if (pomodoro.getStatus() != null) {
                    existingPomodoro.setStatus(pomodoro.getStatus());
                }
                if (pomodoro.getTask() != null) {
                    existingPomodoro.setTask(pomodoro.getTask());
                }
                if (pomodoro.getBeginBreak() != null) {
                    existingPomodoro.setBeginBreak(pomodoro.getBeginBreak());
                }
                if (pomodoro.getEndBreak() != null) {
                    existingPomodoro.setEndBreak(pomodoro.getEndBreak());
                }
                if (pomodoro.getTotalBreak() != null) {
                    existingPomodoro.setTotalBreak(pomodoro.getTotalBreak());
                }

                return existingPomodoro;
            })
            .map(pomodoroRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pomodoro.getId().toString())
        );
    }

    /**
     * {@code GET  /pomodoros} : get all the pomodoros.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pomodoros in body.
     */
    @GetMapping("/pomodoros")
    public List<Pomodoro> getAllPomodoros(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Pomodoros");
        if (eagerload) {
            return pomodoroRepository.findAllWithEagerRelationships();
        } else {
            return pomodoroRepository.findAll();
        }
    }

    /**
     * {@code GET  /pomodoros/:id} : get the "id" pomodoro.
     *
     * @param id the id of the pomodoro to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pomodoro, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pomodoros/{id}")
    public ResponseEntity<Pomodoro> getPomodoro(@PathVariable Long id) {
        log.debug("REST request to get Pomodoro : {}", id);
        Optional<Pomodoro> pomodoro = pomodoroRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(pomodoro);
    }

    /**
     * {@code DELETE  /pomodoros/:id} : delete the "id" pomodoro.
     *
     * @param id the id of the pomodoro to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pomodoros/{id}")
    public ResponseEntity<Void> deletePomodoro(@PathVariable Long id) {
        log.debug("REST request to delete Pomodoro : {}", id);
        pomodoroRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
