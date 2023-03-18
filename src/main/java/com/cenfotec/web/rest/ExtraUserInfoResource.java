package com.cenfotec.web.rest;

import com.cenfotec.domain.ExtraUserInfo;
import com.cenfotec.repository.ExtraUserInfoRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.ExtraUserInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExtraUserInfoResource {

    private final Logger log = LoggerFactory.getLogger(ExtraUserInfoResource.class);

    private static final String ENTITY_NAME = "extraUserInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExtraUserInfoRepository extraUserInfoRepository;

    public ExtraUserInfoResource(ExtraUserInfoRepository extraUserInfoRepository) {
        this.extraUserInfoRepository = extraUserInfoRepository;
    }

    /**
     * {@code POST  /extra-user-infos} : Create a new extraUserInfo.
     *
     * @param extraUserInfo the extraUserInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new extraUserInfo, or with status {@code 400 (Bad Request)} if the extraUserInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/extra-user-infos")
    public ResponseEntity<ExtraUserInfo> createExtraUserInfo(@RequestBody ExtraUserInfo extraUserInfo) throws URISyntaxException {
        log.debug("REST request to save ExtraUserInfo : {}", extraUserInfo);
        if (extraUserInfo.getId() != null) {
            throw new BadRequestAlertException("A new extraUserInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExtraUserInfo result = extraUserInfoRepository.save(extraUserInfo);
        return ResponseEntity
            .created(new URI("/api/extra-user-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /extra-user-infos/:id} : Updates an existing extraUserInfo.
     *
     * @param id the id of the extraUserInfo to save.
     * @param extraUserInfo the extraUserInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated extraUserInfo,
     * or with status {@code 400 (Bad Request)} if the extraUserInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the extraUserInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/extra-user-infos/{id}")
    public ResponseEntity<ExtraUserInfo> updateExtraUserInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExtraUserInfo extraUserInfo
    ) throws URISyntaxException {
        log.debug("REST request to update ExtraUserInfo : {}, {}", id, extraUserInfo);
        if (extraUserInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, extraUserInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!extraUserInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExtraUserInfo result = extraUserInfoRepository.save(extraUserInfo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, extraUserInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /extra-user-infos/:id} : Partial updates given fields of an existing extraUserInfo, field will ignore if it is null
     *
     * @param id the id of the extraUserInfo to save.
     * @param extraUserInfo the extraUserInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated extraUserInfo,
     * or with status {@code 400 (Bad Request)} if the extraUserInfo is not valid,
     * or with status {@code 404 (Not Found)} if the extraUserInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the extraUserInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/extra-user-infos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExtraUserInfo> partialUpdateExtraUserInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExtraUserInfo extraUserInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExtraUserInfo partially : {}, {}", id, extraUserInfo);
        if (extraUserInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, extraUserInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!extraUserInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExtraUserInfo> result = extraUserInfoRepository
            .findById(extraUserInfo.getId())
            .map(existingExtraUserInfo -> {
                if (extraUserInfo.getPhone() != null) {
                    existingExtraUserInfo.setPhone(extraUserInfo.getPhone());
                }
                if (extraUserInfo.getDegree() != null) {
                    existingExtraUserInfo.setDegree(extraUserInfo.getDegree());
                }
                if (extraUserInfo.getProfilePicture() != null) {
                    existingExtraUserInfo.setProfilePicture(extraUserInfo.getProfilePicture());
                }
                if (extraUserInfo.getBirthDay() != null) {
                    existingExtraUserInfo.setBirthDay(extraUserInfo.getBirthDay());
                }
                if (extraUserInfo.getScore() != null) {
                    existingExtraUserInfo.setScore(extraUserInfo.getScore());
                }
                if (extraUserInfo.getUserVotes() != null) {
                    existingExtraUserInfo.setUserVotes(extraUserInfo.getUserVotes());
                }

                return existingExtraUserInfo;
            })
            .map(extraUserInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, extraUserInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /extra-user-infos} : get all the extraUserInfos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of extraUserInfos in body.
     */
    @GetMapping("/extra-user-infos")
    public List<ExtraUserInfo> getAllExtraUserInfos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ExtraUserInfos");
        if (eagerload) {
            return extraUserInfoRepository.findAllWithEagerRelationships();
        } else {
            return extraUserInfoRepository.findAll();
        }
    }

    /**
     * {@code GET  /extra-user-infos/:id} : get the "id" extraUserInfo.
     *
     * @param id the id of the extraUserInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the extraUserInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/extra-user-infos/{id}")
    public ResponseEntity<ExtraUserInfo> getExtraUserInfo(@PathVariable Long id) {
        log.debug("REST request to get ExtraUserInfo : {}", id);
        Optional<ExtraUserInfo> extraUserInfo = extraUserInfoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(extraUserInfo);
    }

    /**
     * {@code DELETE  /extra-user-infos/:id} : delete the "id" extraUserInfo.
     *
     * @param id the id of the extraUserInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/extra-user-infos/{id}")
    public ResponseEntity<Void> deleteExtraUserInfo(@PathVariable Long id) {
        log.debug("REST request to delete ExtraUserInfo : {}", id);
        extraUserInfoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
