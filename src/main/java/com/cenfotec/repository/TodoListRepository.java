package com.cenfotec.repository;

import com.cenfotec.domain.Courses;
import com.cenfotec.domain.TodoList;
import com.cenfotec.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TodoList entity.
 */
@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {
    @Query("select todoList from TodoList todoList where todoList.user.login = ?#{principal.username}")
    List<TodoList> findByUserIsCurrentUser();

    default Optional<TodoList> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TodoList> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TodoList> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    List<TodoList> findByUserLike(User user);

    @Query("SELECT t FROM TodoList t JOIN FETCH t.user u WHERE u.login = :userLogin")
    List<TodoList> findByCreatedBy(@Param("userLogin") String userLogin);

    @Query(
        value = "select distinct todoList from TodoList todoList left join fetch todoList.user",
        countQuery = "select count(distinct todoList) from TodoList todoList"
    )
    Page<TodoList> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct todoList from TodoList todoList left join fetch todoList.user")
    List<TodoList> findAllWithToOneRelationships();

    @Query("select todoList from TodoList todoList left join fetch todoList.user where todoList.id =:id")
    Optional<TodoList> findOneWithToOneRelationships(@Param("id") Long id);
}
