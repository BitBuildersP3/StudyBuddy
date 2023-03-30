package com.cenfotec.repository;

import com.cenfotec.domain.Courses;
import com.cenfotec.domain.ExtraUserInfo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Courses entity.
 *
 * When extending this class, extend CoursesRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface CoursesRepository extends CoursesRepositoryWithBagRelationships, JpaRepository<Courses, Long> {
    default Optional<Courses> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Courses> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Courses> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query("SELECT courses FROM Courses courses  WHERE courses.ownerName = :ownerName")
    List<Courses> findByUserName(@Param("ownerName") String ownerName);
    /*@Query("SELECT id_curso FROM rel_courses__user WHERE user_id = :user")
    Optional<Long> findByUsers(@Param("user") Long user);*/

}
