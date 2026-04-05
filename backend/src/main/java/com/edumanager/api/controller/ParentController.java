package com.edumanager.api.controller;

import com.edumanager.api.dto.request.ParentRequest;
import com.edumanager.api.dto.response.ParentDTO;
import com.edumanager.api.dto.response.StudentDTO;
import com.edumanager.api.service.ParentService;
import com.edumanager.api.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService  parentService;
    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<ParentDTO>> getAll() {
        return ResponseEntity.ok(parentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(parentService.getById(id));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentDTO>> getChildren(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getByParentId(id));
    }

    @PostMapping
    public ResponseEntity<ParentDTO> create(@Valid @RequestBody ParentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(parentService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParentDTO> update(
            @PathVariable Long id, @Valid @RequestBody ParentRequest req) {
        return ResponseEntity.ok(parentService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        parentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
