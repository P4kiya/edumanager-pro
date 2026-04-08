package com.edumanager.api.config;

import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.enums.AgentRole;
import com.edumanager.api.entity.enums.AgentStatus;
import com.edumanager.api.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class AdminBootstrapConfig {

    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner ensureAdminUser() {
        return args -> {
            if (agentRepository.count() > 0) {
                return;
            }

            Agent admin = Agent.builder()
                    .name("Admin EduManager")
                    .email("admin@edumanager.ma")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+212600000000")
                    .status(AgentStatus.ACTIVE)
                    .role(AgentRole.ADMIN)
                    .permissions(List.of(
                            "students",
                            "parents",
                            "presences",
                            "notes",
                            "finances",
                            "journal",
                            "parametres"
                    ))
                    .build();

            agentRepository.save(admin);
        };
    }
}
