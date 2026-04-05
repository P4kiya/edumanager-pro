package com.edumanager.api.controller;

import com.edumanager.api.dto.request.AuditLogRequest;
import com.edumanager.api.dto.request.LoginRequest;
import com.edumanager.api.dto.request.LogoutRequest;
import com.edumanager.api.dto.response.LoginResponse;
import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.repository.AgentRepository;
import com.edumanager.api.service.AuditLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AgentRepository agentRepository;
    private final AuditLogService auditLogService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Agent agent = agentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe invalide"));

        if (!request.getPassword().equals(agent.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe invalide");
        }

        if (agent.getStatus() != AgentStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Compte inactif");
        }

        auditLogService.createLog(AuditLogRequest.builder()
                .agentId(agent.getId())
                .agentName(agent.getName())
                .module("Système")
                .action("LOGIN")
                .description("Connexion utilisateur")
                .target(agent.getName())
                .ipAddress("APP")
                .build());

        return ResponseEntity.ok(LoginResponse.builder()
                .id(agent.getId())
                .name(agent.getName())
                .email(agent.getEmail())
                .status(agent.getStatus().name())
                .role("Administrateur")
                .message("Connexion réussie")
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        Agent agent = agentRepository.findById(request.getAgentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        auditLogService.createLog(AuditLogRequest.builder()
                .agentId(agent.getId())
                .agentName(agent.getName())
                .module("Système")
                .action("LOGOUT")
                .description("Déconnexion utilisateur")
                .target(agent.getName())
                .ipAddress("APP")
                .build());

        return ResponseEntity.noContent().build();
    }
}
