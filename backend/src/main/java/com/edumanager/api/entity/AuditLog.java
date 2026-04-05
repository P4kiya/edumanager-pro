package com.edumanager.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long agentId;

    @Column(nullable = false)
    private String agentName;

    @Column(nullable = false)
    private String module; // e.g., "Étudiants", "Finances", "Présences"

    @Column(nullable = false)
    private String action; // e.g., "CREATE", "UPDATE", "DELETE", "VIEW"

    @Column(length = 1000)
    private String description;

    private String target; // e.g., student name, parent name

    private String ipAddress;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
