package com.cenfotec.repository;

import com.cenfotec.domain.UserVotes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserVotes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserVotesRepository extends JpaRepository<UserVotes, Long> {
    UserVotes getUserVotesByIdUser(String user);
}
