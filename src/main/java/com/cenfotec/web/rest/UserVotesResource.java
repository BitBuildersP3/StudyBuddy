package com.cenfotec.web.rest;

import com.cenfotec.domain.CourseVotes;
import com.cenfotec.domain.UserVotes;
import com.cenfotec.domain.UserVotes;
import com.cenfotec.domain.UserVotes;
import com.cenfotec.domain.UserVotes;
import com.cenfotec.domain.UserVotes;
import com.cenfotec.repository.UserVotesRepository;
import com.cenfotec.security.SecurityUtils;
import com.cenfotec.web.rest.errors.BadRequestAlertException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
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
 * REST controller for managing {@link com.cenfotec.domain.UserVotes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserVotesResource {

    private final Logger log = LoggerFactory.getLogger(UserVotesResource.class);

    private static final String ENTITY_NAME = "userVotes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserVotesRepository userVotesRepository;

    public UserVotesResource(UserVotesRepository userVotesRepository) {
        this.userVotesRepository = userVotesRepository;
    }

    /**
     * {@code POST  /user-votes} : Create a new userVotes.
     *
     * @param userVotes the userVotes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userVotes, or with status {@code 400 (Bad Request)} if the userVotes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-votes")
    public ResponseEntity<UserVotes> createUserVotes(@RequestBody UserVotes userVotes) throws URISyntaxException {
        log.debug("REST request to save UserVotes : {}", userVotes);
        if (userVotes.getId() != null) {
            throw new BadRequestAlertException("A new userVotes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userVotes.setJson("{\"votes\" : [], \"avg\" : 0, \"num\" : 0}");
        UserVotes result = userVotesRepository.save(userVotes);
        return ResponseEntity
            .created(new URI("/api/user-votes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-votes/:id} : Updates an existing userVotes.
     *
     * @param id the id of the userVotes to save.
     * @param userVotes the userVotes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userVotes,
     * or with status {@code 400 (Bad Request)} if the userVotes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userVotes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-votes/{id}")
    public ResponseEntity<UserVotes> updateUserVotes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserVotes userVotes
    ) throws URISyntaxException {
        log.debug("REST request to update UserVotes : {}, {}", id, userVotes);
        if (userVotes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userVotes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userVotesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserVotes result = userVotesRepository.save(userVotes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userVotes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-votes/:id} : Partial updates given fields of an existing userVotes, field will ignore if it is null
     *
     * @param id the id of the userVotes to save.
     * @param userVotes the userVotes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userVotes,
     * or with status {@code 400 (Bad Request)} if the userVotes is not valid,
     * or with status {@code 404 (Not Found)} if the userVotes is not found,
     * or with status {@code 500 (Internal Server Error)} if the userVotes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-votes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserVotes> partialUpdateUserVotes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserVotes userVotes
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserVotes partially : {}, {}", id, userVotes);
        if (userVotes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userVotes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userVotesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserVotes> result = userVotesRepository
            .findById(userVotes.getId())
            .map(existingUserVotes -> {
                if (userVotes.getIdUser() != null) {
                    existingUserVotes.setIdUser(userVotes.getIdUser());
                }
                if (userVotes.getJson() != null) {
                    existingUserVotes.setJson(userVotes.getJson());
                }

                return existingUserVotes;
            })
            .map(userVotesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userVotes.getId().toString())
        );
    }

    /**
     * {@code GET  /user-votes} : get all the userVotes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userVotes in body.
     */
    @GetMapping("/user-votes")
    public List<UserVotes> getAllUserVotes() {
        log.debug("REST request to get all UserVotes");
        return userVotesRepository.findAll();
    }

    /**
     * {@code GET  /user-votes/:id} : get the "id" userVotes.
     *
     * @param id the id of the userVotes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userVotes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-votes/{id}")
    public ResponseEntity<UserVotes> getUserVotes(@PathVariable Long id) {
        log.debug("REST request to get UserVotes : {}", id);
        Optional<UserVotes> userVotes = userVotesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userVotes);
    }

    /**
     * {@code DELETE  /user-votes/:id} : delete the "id" userVotes.
     *
     * @param id the id of the userVotes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-votes/{id}")
    public ResponseEntity<Void> deleteUserVotes(@PathVariable Long id) {
        log.debug("REST request to delete UserVotes : {}", id);
        userVotesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/user-votes/createByProxy/{id}")
    public void createAndAsociateUserVotes(@PathVariable String id) throws URISyntaxException {
        UserVotes userVotes = new UserVotes();
        userVotes.setIdUser(id);
        this.createUserVotes(userVotes);
    }

    @GetMapping("/user-votes/getByUser/{id}")
    public ResponseEntity<UserVotes> getByUserId(@PathVariable String id) {
        return ResponseEntity.ok().body(userVotesRepository.getUserVotesByIdUser(id));
    }

    @GetMapping("/user-votes/addVote/{prompt}")
    public ResponseEntity<UserVotes> addUserVoteToACourse(@PathVariable String prompt) throws JsonProcessingException {
        String[] promptSplit = prompt.split("-");
        String userName = promptSplit[0];
        int points = Integer.parseInt(promptSplit[1]);
        String name = SecurityUtils.getCurrentUserLogin().orElse(null);
        String updatedJson;

        UserVotes userVotes = userVotesRepository.getUserVotesByIdUser(userName);

        List<String> currentUserData = JsonPath.read(userVotes.getJson(), "$.votes[?(@.user == \"" + name + "\")]");

        if (currentUserData.isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(userVotes.getJson());

            ArrayNode votesArray = (ArrayNode) json.get("votes");

            ObjectNode objectNode = mapper.createObjectNode();

            objectNode.put("score", points);
            objectNode.put("user", name);

            votesArray.add(objectNode);
            updatedJson = mapper.writeValueAsString(json);
        } else {
            updatedJson = JsonPath.parse(userVotes.getJson()).set("$.votes[?(@.user == \"" + name + "\")].score", points).jsonString();
            userVotes.setJson(updatedJson);
            userVotesRepository.save(userVotes);
        }

        double avgPoints = JsonPath.read(updatedJson, "$..votes..score.avg()");
        int totalVotes = JsonPath.read(updatedJson, "$.votes.length()");
        updatedJson = JsonPath.parse(updatedJson).set("$.avg", avgPoints).set("$.num", totalVotes).jsonString();
        userVotes.setJson(updatedJson);
        userVotesRepository.save(userVotes);

        return ResponseEntity.ok().body(userVotes);
    }

    @GetMapping("/user-votes/getCurrentUserVotes/{id}")
    public ResponseEntity<JsonNode> getCurrentUserVotes(@PathVariable String id) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        String name = SecurityUtils.getCurrentUserLogin().orElse(null);
        UserVotes courseVotes = userVotesRepository.getUserVotesByIdUser(id);
        String currentUserData = JsonPath.read(courseVotes.getJson(), "$.votes[?(@.user == \"" + name + "\")]").toString();

        return ResponseEntity.ok().body(mapper.readTree(currentUserData));
    }
}
