package com.edumanager.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequest {
    @NotNull(message = "Agent ID is required")
    private Long agentId;

    @NotBlank(message = "Agent name is required")
    private String agentName;

    @NotBlank(message = "Module is required")
    private String module;

    @NotBlank(message = "Action is required")
    private String action;

    private String description;
    private String target;
    private String ipAddress;
}
