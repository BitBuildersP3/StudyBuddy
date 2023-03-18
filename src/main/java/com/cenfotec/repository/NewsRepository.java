package com.cenfotec.repository;

import com.cenfotec.domain.News;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the News entity.
 */
@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    @Query("select news from News news where news.user.login = ?#{principal.username}")
    List<News> findByUserIsCurrentUser();

    default Optional<News> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<News> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<News> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct news from News news left join fetch news.user",
        countQuery = "select count(distinct news) from News news"
    )
    Page<News> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct news from News news left join fetch news.user")
    List<News> findAllWithToOneRelationships();

    @Query("select news from News news left join fetch news.user where news.id =:id")
    Optional<News> findOneWithToOneRelationships(@Param("id") Long id);
}
