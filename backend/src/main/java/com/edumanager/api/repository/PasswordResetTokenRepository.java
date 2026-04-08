package com.edumanager.api.repository;

import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByAgent(Agent agent);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
