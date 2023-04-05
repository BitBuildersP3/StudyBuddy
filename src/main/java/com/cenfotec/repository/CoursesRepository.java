package com.cenfotec.repository;

import com.cenfotec.domain.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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

    @Query("select courses from Courses courses where courses.id = :id")
    Optional<Courses> findAllDataByCourseId(@Param("id") long id);

    List<Courses> findCoursesByUsersLike(User user);

    List<Courses> findTop10ByOrderByScoreDesc();

    List<Courses> findTop5ByUsersLike(User user);
    /*    *
    *
    * @Query("select files, files.section, files.section.courses.name  from Files files")
    List<Files> findAllDataByCourseId(@Param("id") long id);
    *
    * */
}
