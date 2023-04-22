package com.cenfotec.repository;

import com.cenfotec.domain.ExtraUserInfo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExtraUserInfo entity.
 */
@Repository
public interface ExtraUserInfoRepository extends JpaRepository<ExtraUserInfo, Long> {
    default Optional<ExtraUserInfo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ExtraUserInfo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ExtraUserInfo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct extraUserInfo from ExtraUserInfo extraUserInfo left join fetch extraUserInfo.user",
        countQuery = "select count(distinct extraUserInfo) from ExtraUserInfo extraUserInfo"
    )
    Page<ExtraUserInfo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct extraUserInfo from ExtraUserInfo extraUserInfo left join fetch extraUserInfo.user")
    List<ExtraUserInfo> findAllWithToOneRelationships();

    @Query("select extraUserInfo from ExtraUserInfo extraUserInfo left join fetch extraUserInfo.user where extraUserInfo.id =:id")
    Optional<ExtraUserInfo> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select extraUserInfo from ExtraUserInfo extraUserInfo where extraUserInfo.user.login = :name")
    Optional<ExtraUserInfo> findByUserIsCurrentUser(@Param("name") String name);

    List<ExtraUserInfo> findTop5ByOrderByScoreDesc();
}
