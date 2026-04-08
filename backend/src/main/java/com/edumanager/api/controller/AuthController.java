package com.edumanager.api.controller;

import com.edumanager.api.dto.request.AuditLogRequest;
import com.edumanager.api.dto.request.ForgotPasswordRequest;
import com.edumanager.api.dto.request.LoginRequest;
import com.edumanager.api.dto.request.LogoutRequest;
import com.edumanager.api.dto.request.ResetPasswordRequest;
import com.edumanager.api.dto.response.LoginResponse;
import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.enums.AgentRole;
import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.repository.AgentRepository;
import com.edumanager.api.service.AuditLogService;
import com.edumanager.api.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AgentRepository agentRepository;
    private final AuditLogService auditLogService;
    private final PasswordResetService passwordResetService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.auth.forgot-password.reveal-email-not-found:false}")
    private boolean revealEmailNotFound;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Agent agent = agentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe invalide"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), agent.getPassword());
        if (!passwordMatches && request.getPassword().equals(agent.getPassword())) {
            // One-time migration path for legacy plain-text passwords.
            agent.setPassword(passwordEncoder.encode(request.getPassword()));
            agentRepository.save(agent);
            passwordMatches = true;
        }

        if (!passwordMatches) {
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

        AgentRole effectiveRole = agent.getRole() != null ? agent.getRole() : AgentRole.AGENT;

        return ResponseEntity.ok(LoginResponse.builder()
                .id(agent.getId())
                .name(agent.getName())
                .email(agent.getEmail())
                .status(agent.getStatus().name())
                .role(effectiveRole.name())
                .message("Connexion réussie")
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Agent agent = agentRepository.findByEmail(request.getEmail().trim()).orElse(null);
        if (agent == null) {
            if (revealEmailNotFound) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun compte trouvé avec cet email");
            }
            return ResponseEntity.noContent().build();
        }

        passwordResetService.createResetTokenAndSendEmail(agent);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La confirmation du mot de passe ne correspond pas");
        }

        Agent agent = passwordResetService.validateTokenAndConsume(request.getToken().trim());
        agent.setPassword(passwordEncoder.encode(request.getNewPassword()));
        agentRepository.save(agent);

        return ResponseEntity.noContent().build();
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
