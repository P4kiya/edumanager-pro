package com.edumanager.api.controller;

import com.edumanager.api.dto.request.AttendanceRequest;
import com.edumanager.api.dto.request.BulkAttendanceRequest;
import com.edumanager.api.dto.response.AttendanceDTO;
import com.edumanager.api.dto.response.AttendanceStatsDTO;
import com.edumanager.api.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/class")
    public ResponseEntity<List<AttendanceDTO>> getByDateAndClass(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String className) {
        return ResponseEntity.ok(attendanceService.getByDateAndClass(date, className));
    }

    @PostMapping("/mark")
    public ResponseEntity<List<AttendanceDTO>> markAttendance(
            @Valid @RequestBody List<AttendanceRequest> requests) {
        return ResponseEntity.ok(attendanceService.markAttendance(requests));
    }

    @PostMapping("/bulk-present")
    public ResponseEntity<List<AttendanceDTO>> bulkMarkAllPresent(
            @Valid @RequestBody BulkAttendanceRequest req) {
        return ResponseEntity.ok(attendanceService.bulkMarkAllPresent(req));
    }

    @GetMapping("/student/{studentId}/stats")
    public ResponseEntity<AttendanceStatsDTO> getStudentStats(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceStats(studentId));
    }
}
