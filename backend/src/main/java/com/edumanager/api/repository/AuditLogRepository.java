package com.edumanager.api.repository;

import com.edumanager.api.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByAgentIdOrderByTimestampDesc(Long agentId);
    List<AuditLog> findByModuleOrderByTimestampDesc(String module);
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
    List<AuditLog> findAllByOrderByTimestampDesc();
}
