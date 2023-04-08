package com.cenfotec.web.rest;

import com.cenfotec.domain.Courses;
import com.cenfotec.domain.ExtraUserInfo;
import com.cenfotec.domain.Files;
import com.cenfotec.domain.Section;
import com.cenfotec.domain.User;
import com.cenfotec.repository.CoursesRepository;
import com.cenfotec.repository.UserRepository;
import com.cenfotec.security.SecurityUtils;
import com.cenfotec.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.domain.Courses}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CoursesResource {

    private final Logger log = LoggerFactory.getLogger(CoursesResource.class);

    private static final String ENTITY_NAME = "courses";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private UserRepository userRepository;

    private final CoursesRepository coursesRepository;

    public CoursesResource(CoursesRepository coursesRepository) {
        this.coursesRepository = coursesRepository;
    }

    /**
     * {@code POST  /courses} : Create a new courses.
     *
     * @param courses the courses to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courses, or with status {@code 400 (Bad Request)} if the courses has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/courses")
    public ResponseEntity<Courses> createCourses(@RequestBody Courses courses) throws URISyntaxException {
        log.debug("REST request to save Courses : {}", courses);
        if (courses.getId() != null) {
            throw new BadRequestAlertException("A new courses cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Courses result = coursesRepository.save(courses);
        return ResponseEntity
            .created(new URI("/api/courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /courses/:id} : Updates an existing courses.
     *
     * @param id the id of the courses to save.
     * @param courses the courses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courses,
     * or with status {@code 400 (Bad Request)} if the courses is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/courses/{id}")
    public ResponseEntity<Courses> updateCourses(@PathVariable(value = "id", required = false) final Long id, @RequestBody Courses courses)
        throws URISyntaxException {
        log.debug("REST request to update Courses : {}, {}", id, courses);
        if (courses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coursesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Courses result = coursesRepository.save(courses);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courses.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /courses/:id} : Partial updates given fields of an existing courses, field will ignore if it is null
     *
     * @param id the id of the courses to save.
     * @param courses the courses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courses,
     * or with status {@code 400 (Bad Request)} if the courses is not valid,
     * or with status {@code 404 (Not Found)} if the courses is not found,
     * or with status {@code 500 (Internal Server Error)} if the courses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/courses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Courses> partialUpdateCourses(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Courses courses
    ) throws URISyntaxException {
        log.debug("REST request to partial update Courses partially : {}, {}", id, courses);
        if (courses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coursesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Courses> result = coursesRepository
            .findById(courses.getId())
            .map(existingCourses -> {
                if (courses.getName() != null) {
                    existingCourses.setName(courses.getName());
                }
                if (courses.getDescription() != null) {
                    existingCourses.setDescription(courses.getDescription());
                }
                if (courses.getPreviewImg() != null) {
                    existingCourses.setPreviewImg(courses.getPreviewImg());
                }
                if (courses.getStatus() != null) {
                    existingCourses.setStatus(courses.getStatus());
                }
                if (courses.getScore() != null) {
                    existingCourses.setScore(courses.getScore());
                }
                if (courses.getExcerpt() != null) {
                    existingCourses.setExcerpt(courses.getExcerpt());
                }
                if (courses.getUserId() != null) {
                    existingCourses.setUserId(courses.getUserId());
                }
                if (courses.getOwnerName() != null) {
                    existingCourses.setOwnerName(courses.getOwnerName());
                }
                if (courses.getUserName() != null) {
                    existingCourses.setUserName(courses.getUserName());
                }
                if (courses.getUserVotes() != null) {
                    existingCourses.setUserVotes(courses.getUserVotes());
                }

                return existingCourses;
            })
            .map(coursesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courses.getId().toString())
        );
    }

    /**
     * {@code GET  /courses} : get all the courses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("/courses")
    public List<Courses> getAllCourses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Courses");
        if (eagerload) {
            return coursesRepository.findAllWithEagerRelationships();
        } else {
            return coursesRepository.findAll();
        }
    }

    /**
     * {@code GET  /courses/:id} : get the "id" courses.
     *
     * @param id the id of the courses to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courses, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/courses/{id}")
    public ResponseEntity<Courses> getCourses(@PathVariable Long id) {
        log.debug("REST request to get Courses : {}", id);
        Optional<Courses> courses = coursesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(courses);
    }

    @GetMapping("/courses/owner/{ownerName}")
    public List<Courses> getCoursesOwner(@PathVariable String ownerName) {
        log.debug("REST request to get course by the owner");
        List<Courses> retVal = coursesRepository.findByUserName(ownerName);
        return retVal;
    }

    @GetMapping("/courses/getFiveByOwner")
    public List<Courses> getFiveCoursesOwner() {
        log.debug("REST request to get course by the owner");
        String ownerName = SecurityUtils.getCurrentUserLogin().orElse(null);
        List<Courses> retVal = coursesRepository.findTop5ByOwnerNameLike(ownerName);
        return retVal;
    }

    /**
     * {@code DELETE  /courses/:id} : delete the "id" courses.
     *
     * @param id the id of the courses to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourses(@PathVariable Long id) {
        log.debug("REST request to delete Courses : {}", id);
        coursesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/courses/getAllData/{id}")
    public Optional<Courses> getAllCourseData(@PathVariable long id) {
        Optional<Courses> res = coursesRepository.findAllDataByCourseId(id);
        res
            .get()
            .getSections()
            .forEach(section -> {
                section.setFiles(section.getFiles());
            });
        return res;
    }

    /*Este metodo devuelve todos los cursos que el usuario "id" este matriculado*/
    @GetMapping("/courses/enrolled/{id}")
    public List<Courses> GetRegisteredCoursesByUserId(@PathVariable Long id) {
        User user = new User(id);
        List<Courses> res = coursesRepository.findCoursesByUsersLike(user);
        return res;
    }

    @GetMapping("/courses/fiveEnrolled/{id}")
    public List<Courses> GetFiveRegisteredCoursesByUserId(@PathVariable Long id) {
        User user = new User(id);
        List<Courses> res = coursesRepository.findTop5ByUsersLike(user);
        return res;
    }

    //Para usar este metodo se debe de enviar los datos de la variable String id de la siguiente manera:
    //<idCurso>-<idUsuarioEnSesion>
    //este metodo retorna un dato tipo boolean
    //este metodo revisa que el usuario en sesion este registrado a un curso (true) o no (false)

    @GetMapping("/courses/isRegistered/{id}")
    public boolean isUserRegister(@PathVariable String id) {
        String[] split = id.split("-");
        Long idCourse = Long.parseLong(split[0]);
        Long idUser = Long.parseLong(split[1]);
        User user = new User(idUser);
        List<Courses> res = coursesRepository.findCoursesByUsersLike(user);
        return res.contains(new Courses(idCourse));
    }

    //devuelve verdadero si el usuario en sesion es dueño del curso, falso de lo contrario.
    @GetMapping("/courses/isOwner/{id}")
    public boolean isUserOwner(@PathVariable Long id) {
        String name = SecurityUtils.getCurrentUserLogin().orElse(null);
        Optional<Courses> courses = coursesRepository.findAllDataByCourseId(id);
        if (courses.isEmpty()) return false;
        return courses.get().getOwnerName().equals(name);
    }

    @GetMapping("/courses/topTen")
    public List<Courses> getTopTenCourses() {
        return coursesRepository.findTop10ByOrderByScoreDesc();
    }
}
