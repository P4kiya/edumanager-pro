package com.edumanager.api.repository;

import com.edumanager.api.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {

    List<Parent> findByEmailContainingIgnoreCase(String email);

    Optional<Parent> findByEmail(String email);
}
