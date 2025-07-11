package com.jeongmin.backend.repository;


import com.jeongmin.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByProviderAndProviderId(String provider, String providerId);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

}
