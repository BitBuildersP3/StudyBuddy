package com.cenfotec.web.rest;

import com.cenfotec.domain.ForoEntity;
import com.cenfotec.repository.ForoEntityRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.ForoEntity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ForoEntityResource {

    private final Logger log = LoggerFactory.getLogger(ForoEntityResource.class);

    private static final String ENTITY_NAME = "foroEntity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ForoEntityRepository foroEntityRepository;

    public ForoEntityResource(ForoEntityRepository foroEntityRepository) {
        this.foroEntityRepository = foroEntityRepository;
    }

    /**
     * {@code POST  /foro-entities} : Create a new foroEntity.
     *
     * @param foroEntity the foroEntity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new foroEntity, or with status {@code 400 (Bad Request)} if the foroEntity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/foro-entities")
    public ResponseEntity<ForoEntity> createForoEntity(@RequestBody ForoEntity foroEntity) throws URISyntaxException {
        log.debug("REST request to save ForoEntity : {}", foroEntity);
        if (foroEntity.getId() != null) {
            throw new BadRequestAlertException("A new foroEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ForoEntity result = foroEntityRepository.save(foroEntity);
        return ResponseEntity
            .created(new URI("/api/foro-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /foro-entities/:id} : Updates an existing foroEntity.
     *
     * @param id the id of the foroEntity to save.
     * @param foroEntity the foroEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foroEntity,
     * or with status {@code 400 (Bad Request)} if the foroEntity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the foroEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/foro-entities/{id}")
    public ResponseEntity<ForoEntity> updateForoEntity(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ForoEntity foroEntity
    ) throws URISyntaxException {
        log.debug("REST request to update ForoEntity : {}, {}", id, foroEntity);
        if (foroEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foroEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foroEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        foroEntity.setIsPersisted();
        ForoEntity result = foroEntityRepository.save(foroEntity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, foroEntity.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /foro-entities/:id} : Partial updates given fields of an existing foroEntity, field will ignore if it is null
     *
     * @param id the id of the foroEntity to save.
     * @param foroEntity the foroEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foroEntity,
     * or with status {@code 400 (Bad Request)} if the foroEntity is not valid,
     * or with status {@code 404 (Not Found)} if the foroEntity is not found,
     * or with status {@code 500 (Internal Server Error)} if the foroEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/foro-entities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ForoEntity> partialUpdateForoEntity(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ForoEntity foroEntity
    ) throws URISyntaxException {
        log.debug("REST request to partial update ForoEntity partially : {}, {}", id, foroEntity);
        if (foroEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foroEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foroEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ForoEntity> result = foroEntityRepository
            .findById(foroEntity.getId())
            .map(existingForoEntity -> {
                if (foroEntity.getJson() != null) {
                    existingForoEntity.setJson(foroEntity.getJson());
                }

                return existingForoEntity;
            })
            .map(foroEntityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, foroEntity.getId())
        );
    }

    /**
     * {@code GET  /foro-entities} : get all the foroEntities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foroEntities in body.
     */
    @GetMapping("/foro-entities")
    public List<ForoEntity> getAllForoEntities() {
        log.debug("REST request to get all ForoEntities");
        return foroEntityRepository.findAll();
    }

    /**
     * {@code GET  /foro-entities/:id} : get the "id" foroEntity.
     *
     * @param id the id of the foroEntity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the foroEntity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/foro-entities/{id}")
    public ResponseEntity<ForoEntity> getForoEntity(@PathVariable String id) {
        log.debug("REST request to get ForoEntity : {}", id);
        Optional<ForoEntity> foroEntity = foroEntityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(foroEntity);
    }

    /**
     * {@code DELETE  /foro-entities/:id} : delete the "id" foroEntity.
     *
     * @param id the id of the foroEntity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/foro-entities/{id}")
    public ResponseEntity<Void> deleteForoEntity(@PathVariable String id) {
        log.debug("REST request to delete ForoEntity : {}", id);
        foroEntityRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
