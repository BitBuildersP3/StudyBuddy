package com.cenfotec.web.rest;

import com.cenfotec.domain.News;
import com.cenfotec.repository.NewsRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.News}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NewsResource {

    private final Logger log = LoggerFactory.getLogger(NewsResource.class);

    private static final String ENTITY_NAME = "news";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NewsRepository newsRepository;

    public NewsResource(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    /**
     * {@code POST  /news} : Create a new news.
     *
     * @param news the news to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new news, or with status {@code 400 (Bad Request)} if the news has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/news")
    public ResponseEntity<News> createNews(@RequestBody News news) throws URISyntaxException {
        log.debug("REST request to save News : {}", news);
        if (news.getId() != null) {
            throw new BadRequestAlertException("A new news cannot already have an ID", ENTITY_NAME, "idexists");
        }
        News result = newsRepository.save(news);
        return ResponseEntity
            .created(new URI("/api/news/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /news/:id} : Updates an existing news.
     *
     * @param id the id of the news to save.
     * @param news the news to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated news,
     * or with status {@code 400 (Bad Request)} if the news is not valid,
     * or with status {@code 500 (Internal Server Error)} if the news couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/news/{id}")
    public ResponseEntity<News> updateNews(@PathVariable(value = "id", required = false) final Long id, @RequestBody News news)
        throws URISyntaxException {
        log.debug("REST request to update News : {}, {}", id, news);
        if (news.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, news.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        News result = newsRepository.save(news);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, news.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /news/:id} : Partial updates given fields of an existing news, field will ignore if it is null
     *
     * @param id the id of the news to save.
     * @param news the news to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated news,
     * or with status {@code 400 (Bad Request)} if the news is not valid,
     * or with status {@code 404 (Not Found)} if the news is not found,
     * or with status {@code 500 (Internal Server Error)} if the news couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/news/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<News> partialUpdateNews(@PathVariable(value = "id", required = false) final Long id, @RequestBody News news)
        throws URISyntaxException {
        log.debug("REST request to partial update News partially : {}, {}", id, news);
        if (news.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, news.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<News> result = newsRepository
            .findById(news.getId())
            .map(existingNews -> {
                if (news.getName() != null) {
                    existingNews.setName(news.getName());
                }
                if (news.getExcerpt() != null) {
                    existingNews.setExcerpt(news.getExcerpt());
                }
                if (news.getBody() != null) {
                    existingNews.setBody(news.getBody());
                }
                if (news.getImage() != null) {
                    existingNews.setImage(news.getImage());
                }
                if (news.getCreationDate() != null) {
                    existingNews.setCreationDate(news.getCreationDate());
                }

                return existingNews;
            })
            .map(newsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, news.getId().toString())
        );
    }

    /**
     * {@code GET  /news} : get all the news.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of news in body.
     */
    @GetMapping("/news")
    public List<News> getAllNews(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all News");
        if (eagerload) {
            return newsRepository.findAllWithEagerRelationships();
        } else {
            return newsRepository.findAll();
        }
    }

    @GetMapping("/news/fourNews")
    public List<News> fourNewestNews(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        return newsRepository.findTop4ByOrderByCreationDateDesc();
    }

    /**
     * {@code GET  /news/:id} : get the "id" news.
     *
     * @param id the id of the news to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the news, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/news/{id}")
    public ResponseEntity<News> getNews(@PathVariable Long id) {
        log.debug("REST request to get News : {}", id);
        Optional<News> news = newsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(news);
    }

    /**
     * {@code DELETE  /news/:id} : delete the "id" news.
     *
     * @param id the id of the news to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        log.debug("REST request to delete News : {}", id);
        newsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
