package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    boolean existsByUserIdAndDecorId(Long userId, Long decorId);

    List<Feedback> findByUserId(Long userId);

    // [decorId, FeedbackType, count]
    @Query("""
            SELECT f.decor.id, f.type, COUNT(f) FROM Feedback f
            WHERE f.decor.id IN :decorIds
            GROUP BY f.decor.id, f.type
            """)
    List<Object[]> countByDecorIdsGroupByType(@Param("decorIds") Collection<Long> decorIds);

}
