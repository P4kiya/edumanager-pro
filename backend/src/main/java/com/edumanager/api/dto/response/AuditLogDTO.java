package com.edumanager.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    private Long id;
    private Long agentId;
    private String agentName;
    private String module;
    private String action;
    private String description;
    private String target;
    private String ipAddress;
    private LocalDateTime timestamp;
}
