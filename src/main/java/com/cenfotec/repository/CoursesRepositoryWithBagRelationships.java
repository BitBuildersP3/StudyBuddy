package com.cenfotec.repository;

import com.cenfotec.domain.Courses;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CoursesRepositoryWithBagRelationships {
    Optional<Courses> fetchBagRelationships(Optional<Courses> courses);

    List<Courses> fetchBagRelationships(List<Courses> courses);

    Page<Courses> fetchBagRelationships(Page<Courses> courses);

    List<Long> findByIdCursoAndUserId(Long userId);
}
