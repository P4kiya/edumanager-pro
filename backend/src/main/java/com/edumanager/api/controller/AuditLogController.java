package com.edumanager.api.controller;

import com.edumanager.api.dto.request.AuditLogRequest;
import com.edumanager.api.dto.response.AuditLogDTO;
import com.edumanager.api.service.AuditLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogDTO>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<AuditLogDTO>> getLogsByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(auditLogService.getLogsByAgentId(agentId));
    }

    @GetMapping("/module/{module}")
    public ResponseEntity<List<AuditLogDTO>> getLogsByModule(@PathVariable String module) {
        return ResponseEntity.ok(auditLogService.getLogsByModule(module));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<AuditLogDTO>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(auditLogService.getLogsByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<AuditLogDTO> createLog(@Valid @RequestBody AuditLogRequest request) {
        AuditLogDTO created = auditLogService.createLog(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
