package com.edumanager.api.controller;

import com.edumanager.api.dto.request.SchoolSettingsRequest;
import com.edumanager.api.dto.response.SchoolSettingsDTO;
import com.edumanager.api.service.SchoolSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings/school")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SchoolSettingsController {

    private final SchoolSettingsService schoolSettingsService;

    @GetMapping
    public ResponseEntity<SchoolSettingsDTO> getSettings() {
        return ResponseEntity.ok(schoolSettingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<SchoolSettingsDTO> updateSettings(@Valid @RequestBody SchoolSettingsRequest request) {
        return ResponseEntity.ok(schoolSettingsService.updateSettings(request));
    }
}
