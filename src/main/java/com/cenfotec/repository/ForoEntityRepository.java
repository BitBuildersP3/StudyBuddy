package com.cenfotec.repository;

import com.cenfotec.domain.ForoEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ForoEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ForoEntityRepository extends JpaRepository<ForoEntity, String> {}
