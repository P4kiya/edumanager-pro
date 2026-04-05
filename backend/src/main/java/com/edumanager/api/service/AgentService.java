package com.edumanager.api.service;

import com.edumanager.api.dto.request.AgentRequest;
import com.edumanager.api.dto.request.AuditLogRequest;
import com.edumanager.api.dto.response.AgentDTO;
import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.exception.DuplicateResourceException;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<AgentDTO> getAllAgents() {
        return agentRepository.findAll().stream()
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
    public AgentDTO createAgent(AgentRequest request) {
        if (agentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Agent with email " + request.getEmail() + " already exists");
        }

        Agent agent = Agent.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // TODO: Hash password with BCrypt
                .phone(request.getPhone())
                .status(request.getStatus() != null ? request.getStatus() : AgentStatus.ACTIVE)
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
            agent.setPassword(request.getPassword()); // TODO: Hash password
        }
        agent.setPhone(request.getPhone());
        agent.setStatus(request.getStatus());
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
                .permissions(agent.getPermissions())
                .createdAt(agent.getCreatedAt())
                .build();
    }
}
