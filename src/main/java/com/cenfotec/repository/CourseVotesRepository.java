package com.cenfotec.repository;

import com.cenfotec.domain.CourseVotes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CourseVotes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseVotesRepository extends JpaRepository<CourseVotes, Long> {
    CourseVotes getCourseVotesByIdCourse(Long idCourse);
}
