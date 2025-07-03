package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    boolean existsByUserAndDecor(User user, Decor decor);
}
