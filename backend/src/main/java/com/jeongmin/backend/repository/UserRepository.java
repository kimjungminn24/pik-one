package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByProviderAndProviderId(String provider, String providerId);

    @Query("select u.id from User u where u.provider = :provider and u.providerId = :providerId")
    Optional<Long> findIdByProviderAndProviderId(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

}
