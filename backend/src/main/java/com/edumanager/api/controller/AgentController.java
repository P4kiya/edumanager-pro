package com.edumanager.api.controller;

import com.edumanager.api.dto.request.AgentRequest;
import com.edumanager.api.dto.response.AgentDTO;
import com.edumanager.api.service.AgentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AgentController {

    private final AgentService agentService;

    @GetMapping
    public ResponseEntity<List<AgentDTO>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentDTO> getAgentById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getAgentById(id));
    }

    @GetMapping("/admin")
    public ResponseEntity<AgentDTO> getAdminAgent() {
        return ResponseEntity.ok(agentService.getAdminAgent());
    }

    @PostMapping
    public ResponseEntity<AgentDTO> createAgent(@Valid @RequestBody AgentRequest request) {
        AgentDTO created = agentService.createAgent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentDTO> updateAgent(
            @PathVariable Long id,
            @Valid @RequestBody AgentRequest request) {
        return ResponseEntity.ok(agentService.updateAgent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }
}
