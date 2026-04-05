package com.edumanager.api.service;

import com.edumanager.api.dto.request.SchoolSettingsRequest;
import com.edumanager.api.dto.response.SchoolSettingsDTO;
import com.edumanager.api.entity.SchoolSettings;
import com.edumanager.api.repository.SchoolSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SchoolSettingsService {

    private final SchoolSettingsRepository schoolSettingsRepository;

    @Transactional(readOnly = true)
    public SchoolSettingsDTO getSettings() {
        SchoolSettings settings = schoolSettingsRepository.findAll().stream().findFirst()
                .orElseGet(this::createDefaultSettings);
        return toDTO(settings);
    }

    @Transactional
    public SchoolSettingsDTO updateSettings(SchoolSettingsRequest request) {
        SchoolSettings settings = schoolSettingsRepository.findAll().stream().findFirst()
                .orElseGet(this::createDefaultSettings);

        settings.setSchoolName(request.getSchoolName());
        settings.setEmail(request.getEmail());
        settings.setPhone(request.getPhone());
        settings.setAddress(request.getAddress());

        return toDTO(schoolSettingsRepository.save(settings));
    }

    private SchoolSettings createDefaultSettings() {
        SchoolSettings defaults = SchoolSettings.builder()
                .schoolName("EduManager")
                .email("contact@edumanager.ma")
                .phone("0766046660")
                .address("123 Avenue Hassan II, Marrakech, Maroc")
                .build();
        return schoolSettingsRepository.save(defaults);
    }

    private SchoolSettingsDTO toDTO(SchoolSettings settings) {
        return SchoolSettingsDTO.builder()
                .id(settings.getId())
                .schoolName(settings.getSchoolName())
                .email(settings.getEmail())
                .phone(settings.getPhone())
                .address(settings.getAddress())
                .createdAt(settings.getCreatedAt())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
