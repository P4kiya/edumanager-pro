package com.edumanager.api.dto.response;

import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.entity.enums.AgentRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private AgentStatus status;
    private AgentRole role;
    private List<String> permissions;
    private LocalDateTime createdAt;
}
