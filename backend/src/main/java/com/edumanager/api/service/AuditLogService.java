package com.edumanager.api.service;

import com.edumanager.api.dto.request.AuditLogRequest;
import com.edumanager.api.dto.response.AuditLogDTO;
import com.edumanager.api.entity.AuditLog;
import com.edumanager.api.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByAgentId(Long agentId) {
        return auditLogRepository.findByAgentIdOrderByTimestampDesc(agentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByModule(String module) {
        return auditLogRepository.findByModuleOrderByTimestampDesc(module).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AuditLogDTO createLog(AuditLogRequest request) {
        AuditLog log = AuditLog.builder()
                .agentId(request.getAgentId())
                .agentName(request.getAgentName())
                .module(request.getModule())
                .action(request.getAction())
                .description(request.getDescription())
                .target(request.getTarget())
                .ipAddress(request.getIpAddress())
                .build();

        AuditLog saved = auditLogRepository.save(log);
        return mapToDTO(saved);
    }

    private AuditLogDTO mapToDTO(AuditLog log) {
        return AuditLogDTO.builder()
                .id(log.getId())
                .agentId(log.getAgentId())
                .agentName(log.getAgentName())
                .module(log.getModule())
                .action(log.getAction())
                .description(log.getDescription())
                .target(log.getTarget())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
}
