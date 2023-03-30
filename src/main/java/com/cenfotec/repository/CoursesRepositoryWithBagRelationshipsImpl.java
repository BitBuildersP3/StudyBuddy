package com.cenfotec.repository;

import com.cenfotec.domain.Courses;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CoursesRepositoryWithBagRelationshipsImpl implements CoursesRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Courses> fetchBagRelationships(Optional<Courses> courses) {
        return courses.map(this::fetchUsers);
    }

    @Override
    public Page<Courses> fetchBagRelationships(Page<Courses> courses) {
        return new PageImpl<>(fetchBagRelationships(courses.getContent()), courses.getPageable(), courses.getTotalElements());
    }

    @Override
    public List<Courses> fetchBagRelationships(List<Courses> courses) {
        return Optional.of(courses).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    @Override
    public List<Long> findByIdCursoAndUserId(Long userId) {
        return entityManager
            .createQuery("SELECT courses_id FROM rel_courses__user  WHERE user_id = :userId", Long.class)
            .setParameter("userId", userId)
            .getResultList();
    }

    Courses fetchUsers(Courses result) {
        return entityManager
            .createQuery("select courses from Courses courses left join fetch courses.users where courses is :courses", Courses.class)
            .setParameter("courses", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Courses> fetchUsers(List<Courses> courses) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, courses.size()).forEach(index -> order.put(courses.get(index).getId(), index));
        List<Courses> result = entityManager
            .createQuery(
                "select distinct courses from Courses courses left join fetch courses.users where courses in :courses",
                Courses.class
            )
            .setParameter("courses", courses)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
