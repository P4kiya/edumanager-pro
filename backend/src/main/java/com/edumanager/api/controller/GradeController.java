package com.edumanager.api.controller;

import com.edumanager.api.dto.request.GradeRequest;
import com.edumanager.api.dto.response.GradeDTO;
import com.edumanager.api.dto.response.GradeReportDTO;
import com.edumanager.api.entity.enums.Semester;
import com.edumanager.api.service.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<GradeDTO>> getAll() {
        return ResponseEntity.ok(gradeService.getAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeDTO>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(required = false) Semester semester) {
        if (semester != null) {
            return ResponseEntity.ok(gradeService.getByStudentAndSemester(studentId, semester));
        }
        return ResponseEntity.ok(gradeService.getByStudentId(studentId));
    }

    @GetMapping("/student/{studentId}/report")
    public ResponseEntity<GradeReportDTO> getReport(
            @PathVariable Long studentId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(gradeService.getStudentReport(studentId, academicYear));
    }

    @PostMapping
    public ResponseEntity<GradeDTO> create(@Valid @RequestBody GradeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gradeService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeDTO> update(
            @PathVariable Long id, @Valid @RequestBody GradeRequest req) {
        return ResponseEntity.ok(gradeService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gradeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
