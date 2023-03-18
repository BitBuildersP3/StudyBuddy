package com.cenfotec.repository;

import com.cenfotec.domain.Pomodoro;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Pomodoro entity.
 */
@Repository
public interface PomodoroRepository extends JpaRepository<Pomodoro, Long> {
    default Optional<Pomodoro> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Pomodoro> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Pomodoro> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct pomodoro from Pomodoro pomodoro left join fetch pomodoro.user",
        countQuery = "select count(distinct pomodoro) from Pomodoro pomodoro"
    )
    Page<Pomodoro> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct pomodoro from Pomodoro pomodoro left join fetch pomodoro.user")
    List<Pomodoro> findAllWithToOneRelationships();

    @Query("select pomodoro from Pomodoro pomodoro left join fetch pomodoro.user where pomodoro.id =:id")
    Optional<Pomodoro> findOneWithToOneRelationships(@Param("id") Long id);
}
