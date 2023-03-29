package com.cenfotec.repository;

import com.cenfotec.domain.Courses;
import com.cenfotec.domain.ExtraUserInfo;
import com.cenfotec.domain.Files;
import com.cenfotec.domain.Section;
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

    @Query("select section from Section section")
    List<Section> findAllDataByCourseId(@Param("id") long id);
    /*
    *
    *
    * @Query("select files, files.section, files.section.courses.name  from Files files")
    List<Files> findAllDataByCourseId(@Param("id") long id);
    *
    * */
}
