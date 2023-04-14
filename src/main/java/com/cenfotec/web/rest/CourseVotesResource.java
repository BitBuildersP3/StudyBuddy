package com.cenfotec.web.rest;

import com.cenfotec.domain.CourseVotes;
import com.cenfotec.repository.CourseVotesRepository;
import com.cenfotec.web.rest.errors.BadRequestAlertException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
 * REST controller for managing {@link com.cenfotec.domain.CourseVotes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CourseVotesResource {

    private final Logger log = LoggerFactory.getLogger(CourseVotesResource.class);

    private static final String ENTITY_NAME = "courseVotes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseVotesRepository courseVotesRepository;

    public CourseVotesResource(CourseVotesRepository courseVotesRepository) {
        this.courseVotesRepository = courseVotesRepository;
    }

    /**
     * {@code POST  /course-votes} : Create a new courseVotes.
     *
     * @param courseVotes the courseVotes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courseVotes, or with status {@code 400 (Bad Request)} if the courseVotes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/course-votes")
    public ResponseEntity<CourseVotes> createCourseVotes(@RequestBody CourseVotes courseVotes) throws URISyntaxException {
        log.debug("REST request to save CourseVotes : {}", courseVotes);
        if (courseVotes.getId() != null) {
            throw new BadRequestAlertException("A new courseVotes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        courseVotes.setJson("{\"votes\" : [] }");
        CourseVotes result = courseVotesRepository.save(courseVotes);
        return ResponseEntity
            .created(new URI("/api/course-votes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @GetMapping("/course-votes/createByProxy/{id}")
    public void createAndAsociateCoursesVotes(@PathVariable Long id) throws URISyntaxException {
        CourseVotes courseVotes = new CourseVotes();
        courseVotes.setIdCourse(id);
        this.createCourseVotes(courseVotes);
    }

    @GetMapping("/course-votes/getByCourse/{id}")
    public ResponseEntity<CourseVotes> getByCourseId(@PathVariable Long id) {
        return ResponseEntity.ok().body(courseVotesRepository.getCourseVotesByIdCourse(id));
    }

    @GetMapping("/course-votes/addVote/{prompt}")
    public ResponseEntity<ArrayNode> test(@PathVariable String prompt) throws JsonProcessingException {
        String[] promptSplit = prompt.split("-");
        Long idCourse = Long.parseLong(promptSplit[0]);
        String points = promptSplit[1];
        String totalAvg = promptSplit[2];

        CourseVotes courseVotes = courseVotesRepository.getCourseVotesByIdCourse(idCourse);

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode json = (ObjectNode) mapper.readTree(courseVotes.getJson());

        String votesArrayString = json.findParent("votes").toPrettyString();
        ArrayNode votesArray = (ArrayNode) mapper.readTree(votesArrayString);
        /*ObjectMapper mapper =  new ObjectMapper();
        ArrayNode jsonNodes =  mapper.createArrayNode();
        ObjectNode json = mapper.createObjectNode();
        ObjectNode newJson =  mapper.createObjectNode();
        json.putArray("test");
        jsonNodes = (ArrayNode) json.get("test");
        newJson.put("nombre", "Andres");
        newJson.put("edad", 123);
        newJson.put("telefono", 12345);
        jsonNodes.add(newJson);
        newJson.put("nombre", "Andres");
        newJson.put("edad", 123);
        newJson.put("telefono", 341234);
        jsonNodes.add(newJson);*/

        return ResponseEntity.ok().body(votesArray.arrayNode());
    }

    /**
     * {@code PUT  /course-votes/:id} : Updates an existing courseVotes.
     *
     * @param id the id of the courseVotes to save.
     * @param courseVotes the courseVotes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseVotes,
     * or with status {@code 400 (Bad Request)} if the courseVotes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courseVotes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/course-votes/{id}")
    public ResponseEntity<CourseVotes> updateCourseVotes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CourseVotes courseVotes
    ) throws URISyntaxException {
        log.debug("REST request to update CourseVotes : {}, {}", id, courseVotes);
        if (courseVotes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseVotes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseVotesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CourseVotes result = courseVotesRepository.save(courseVotes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseVotes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /course-votes/:id} : Partial updates given fields of an existing courseVotes, field will ignore if it is null
     *
     * @param id the id of the courseVotes to save.
     * @param courseVotes the courseVotes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseVotes,
     * or with status {@code 400 (Bad Request)} if the courseVotes is not valid,
     * or with status {@code 404 (Not Found)} if the courseVotes is not found,
     * or with status {@code 500 (Internal Server Error)} if the courseVotes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/course-votes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CourseVotes> partialUpdateCourseVotes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CourseVotes courseVotes
    ) throws URISyntaxException {
        log.debug("REST request to partial update CourseVotes partially : {}, {}", id, courseVotes);
        if (courseVotes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseVotes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseVotesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CourseVotes> result = courseVotesRepository
            .findById(courseVotes.getId())
            .map(existingCourseVotes -> {
                if (courseVotes.getIdCourse() != null) {
                    existingCourseVotes.setIdCourse(courseVotes.getIdCourse());
                }
                if (courseVotes.getJson() != null) {
                    existingCourseVotes.setJson(courseVotes.getJson());
                }

                return existingCourseVotes;
            })
            .map(courseVotesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseVotes.getId().toString())
        );
    }

    /**
     * {@code GET  /course-votes} : get all the courseVotes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courseVotes in body.
     */
    @GetMapping("/course-votes")
    public List<CourseVotes> getAllCourseVotes() {
        log.debug("REST request to get all CourseVotes");
        return courseVotesRepository.findAll();
    }

    /**
     * {@code GET  /course-votes/:id} : get the "id" courseVotes.
     *
     * @param id the id of the courseVotes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courseVotes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/course-votes/{id}")
    public ResponseEntity<CourseVotes> getCourseVotes(@PathVariable Long id) {
        log.debug("REST request to get CourseVotes : {}", id);
        Optional<CourseVotes> courseVotes = courseVotesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(courseVotes);
    }

    /**
     * {@code DELETE  /course-votes/:id} : delete the "id" courseVotes.
     *
     * @param id the id of the courseVotes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/course-votes/{id}")
    public ResponseEntity<Void> deleteCourseVotes(@PathVariable Long id) {
        log.debug("REST request to delete CourseVotes : {}", id);
        courseVotesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
