package com.edumanager.api.controller;

import com.edumanager.api.dto.request.TeacherRequest;
import com.edumanager.api.dto.response.TeacherDTO;
import com.edumanager.api.entity.enums.TeacherStatus;
import com.edumanager.api.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> getAll(
            @RequestParam(required = false) TeacherStatus status) {
        if (status != null) {
            return ResponseEntity.ok(teacherService.getByStatus(status));
        }
        return ResponseEntity.ok(teacherService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TeacherDTO> create(@Valid @RequestBody TeacherRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teacherService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDTO> update(
            @PathVariable Long id, @Valid @RequestBody TeacherRequest req) {
        return ResponseEntity.ok(teacherService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
