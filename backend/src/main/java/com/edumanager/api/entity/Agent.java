package com.edumanager.api.entity;

import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.entity.enums.AgentRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // Should be hashed

    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AgentStatus status = AgentStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private AgentRole role = AgentRole.AGENT;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "agent_permissions", joinColumns = @JoinColumn(name = "agent_id"))
    @Column(name = "permission")
    @Builder.Default
    private List<String> permissions = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
