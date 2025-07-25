package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.DecorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DecorRepository extends JpaRepository<Decor, Long> {


    @Query("""
            SELECT d FROM Decor d
            WHERE d.lat BETWEEN :southLat AND :northLat
            AND d.lng BETWEEN :westLng AND :eastLng
            AND d.type = :type
            AND d.deletedAt IS NULL
            """)
    List<Decor> findByBoundaryAndType(
            @Param("northLat") double northLat,
            @Param("southLat") double southLat,
            @Param("eastLng") double eastLng,
            @Param("westLng") double westLng,
            @Param("type") DecorType type
    );

    @Query("""
            SELECT d FROM Decor d
            WHERE d.lat BETWEEN :southLat AND :northLat
            AND d.lng BETWEEN :westLng AND :eastLng
            AND d.deletedAt IS NULL
            """)
    List<Decor> findByBoundary(
            @Param("northLat") double northLat,
            @Param("southLat") double southLat,
            @Param("eastLng") double eastLng,
            @Param("westLng") double westLng
    );

    Optional<Decor> findByIdAndDeletedAtIsNull(Long id);

    @Query("""
                SELECT DISTINCT d FROM Decor d
                LEFT JOIN FETCH d.feedbacks
                WHERE d.user.id = :userId AND d.deletedAt IS NULL
            """)
    List<Decor> findWithFeedbacksByUserId(@Param("userId") Long userId);
}
