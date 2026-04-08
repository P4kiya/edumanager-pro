package com.edumanager.api.repository;

import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.enums.AgentRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Agent> findByRole(AgentRole role);
}
