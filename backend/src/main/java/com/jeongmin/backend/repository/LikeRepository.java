package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {


    void deleteByUserIdAndDecorId(Long userId, Long decorId);

    int countByDecorId(Long decorId);

    boolean existsByUserIdAndDecorId(Long userId, Long decorId);


}
