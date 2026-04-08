package com.edumanager.api.service;

import com.edumanager.api.entity.Agent;
import com.edumanager.api.entity.PasswordResetToken;
import com.edumanager.api.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Transactional
    public void createResetTokenAndSendEmail(Agent agent) {
        passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        passwordResetTokenRepository.deleteByAgent(agent);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .agent(agent)
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendBaseUrl + "/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        String sender = (fromEmail == null || fromEmail.isBlank()) ? "no-reply@edumanager.local" : fromEmail.trim();
        message.setFrom(sender);
        message.setTo(agent.getEmail());
        message.setSubject("Réinitialisation de votre mot de passe - EduManager");
        message.setText(
                "Bonjour " + agent.getName() + ",\n\n" +
                "Vous avez demandé la réinitialisation de votre mot de passe.\n" +
                "Cliquez sur ce lien pour choisir un nouveau mot de passe :\n" +
                resetLink + "\n\n" +
                "Ce lien expire dans 30 minutes.\n\n" +
                "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email."
        );

        mailSender.send(message);
    }

    @Transactional
    public Agent validateTokenAndConsume(String token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le lien de réinitialisation est invalide"));

        if (resetToken.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce lien de réinitialisation a déjà été utilisé");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le lien de réinitialisation a expiré");
        }

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return resetToken.getAgent();
    }
}
