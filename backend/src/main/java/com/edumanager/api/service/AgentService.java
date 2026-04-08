package com.edumanager.api.service;

import com.edumanager.api.dto.request.AgentRequest;
import com.edumanager.api.dto.request.AuditLogRequest;
import com.edumanager.api.dto.response.AgentDTO;
import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.enums.AgentRole;
import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.exception.DuplicateResourceException;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AgentDTO> getAllAgents() {
        return agentRepository.findByRole(AgentRole.AGENT).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AgentDTO getAgentById(Long id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + id));
        return mapToDTO(agent);
    }

    @Transactional
    public AgentDTO getAdminAgent() {
        backfillMissingRoles();

        List<Agent> admins = agentRepository.findByRole(AgentRole.ADMIN);
        if (admins.isEmpty()) {
            throw new ResourceNotFoundException("Aucun administrateur trouvé");
        }
        Agent selected = admins.stream()
                .filter(a -> a.getStatus() == AgentStatus.ACTIVE)
                .findFirst()
                .orElse(admins.get(0));
        return mapToDTO(selected);
    }

    @Transactional
    public AgentDTO createAgent(AgentRequest request) {
        if (agentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Agent with email " + request.getEmail() + " already exists");
        }

        Agent agent = Agent.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status(request.getStatus() != null ? request.getStatus() : AgentStatus.ACTIVE)
                .role(request.getRole() != null ? request.getRole() : AgentRole.AGENT)
                .permissions(request.getPermissions())
                .build();

        Agent saved = agentRepository.save(agent);
        createAuditLog(saved.getId(), saved.getName(), "CREATE", "Création d'un utilisateur", saved.getName());
        return mapToDTO(saved);
    }

    @Transactional
    public AgentDTO updateAgent(Long id, AgentRequest request) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + id));

        // Check email uniqueness if changed
        if (!agent.getEmail().equals(request.getEmail()) && agentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Agent with email " + request.getEmail() + " already exists");
        }

        agent.setName(request.getName());
        agent.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            agent.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        agent.setPhone(request.getPhone());
        agent.setStatus(request.getStatus());
        agent.setRole(request.getRole() != null ? request.getRole() : agent.getRole());
        agent.setPermissions(request.getPermissions());

        Agent updated = agentRepository.save(agent);
        createAuditLog(updated.getId(), updated.getName(), "UPDATE", "Modification d'un utilisateur", updated.getName());
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteAgent(Long id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + id));

        agentRepository.deleteById(id);
        createAuditLog(agent.getId(), agent.getName(), "DELETE", "Suppression d'un utilisateur", agent.getName());
    }

    private void createAuditLog(Long agentId, String agentName, String action, String description, String target) {
        auditLogService.createLog(AuditLogRequest.builder()
                .agentId(agentId)
                .agentName(agentName)
                .module("Utilisateurs")
                .action(action)
                .description(description)
                .target(target)
                .ipAddress("SYSTEM")
                .build());
    }

    private AgentDTO mapToDTO(Agent agent) {
        return AgentDTO.builder()
                .id(agent.getId())
                .name(agent.getName())
                .email(agent.getEmail())
                .phone(agent.getPhone())
                .status(agent.getStatus())
                .role(agent.getRole())
                .permissions(agent.getPermissions())
                .createdAt(agent.getCreatedAt())
                .build();
    }

    @Transactional
    protected void backfillMissingRoles() {
        List<Agent> allAgents = agentRepository.findAll();
        boolean changed = false;

        for (Agent agent : allAgents) {
            if (agent.getRole() != null) {
                continue;
            }

            agent.setRole(AgentRole.AGENT);
            changed = true;
        }

        if (!changed) {
            return;
        }

        agentRepository.saveAll(allAgents);

        List<Agent> refreshed = agentRepository.findByRole(AgentRole.AGENT);
        if (!refreshed.isEmpty()) {
            Agent selectedAdmin = refreshed.stream()
                    .filter(a -> a.getStatus() == AgentStatus.ACTIVE)
                    .findFirst()
                    .orElse(refreshed.get(0));
            selectedAdmin.setRole(AgentRole.ADMIN);
            agentRepository.save(selectedAdmin);
        }
    }
}
