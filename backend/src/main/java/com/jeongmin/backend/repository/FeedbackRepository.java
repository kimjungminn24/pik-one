package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    boolean existsByUserIdAndDecorId(Long userId, Long decorId);

    List<Feedback> findByUserId(Long userId);

}
