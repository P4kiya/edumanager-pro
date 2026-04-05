package com.edumanager.api.service;

import com.edumanager.api.dto.request.AttendanceRequest;
import com.edumanager.api.dto.request.BulkAttendanceRequest;
import com.edumanager.api.dto.response.AttendanceDTO;
import com.edumanager.api.dto.response.AttendanceStatsDTO;
import com.edumanager.api.entity.Attendance;
import com.edumanager.api.entity.Student;
import com.edumanager.api.entity.enums.AttendanceSession;
import com.edumanager.api.entity.enums.AttendanceStatus;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.AttendanceRepository;
import com.edumanager.api.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository    studentRepository;

    public List<AttendanceDTO> getAll() {
        return attendanceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getByDateAndClass(LocalDate date, String className) {
        return attendanceRepository.findByDateAndClassName(date, className).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Upserts a list of attendance records (creates or overwrites by student+date+session).
     */
    @Transactional
    public List<AttendanceDTO> markAttendance(List<AttendanceRequest> requests) {
        List<Attendance> saved = requests.stream().map(req -> {
            Student student = studentRepository.findById(req.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));

            // Update existing record if it already exists for this student/date/session
            Attendance attendance = attendanceRepository
                    .findByStudentIdAndDateAndSession(req.getStudentId(), req.getDate(), req.getSession())
                    .orElse(new Attendance());

            attendance.setStudent(student);
            attendance.setDate(req.getDate());
            attendance.setSession(req.getSession());
            attendance.setStatus(req.getStatus());
            attendance.setClassName(req.getClassName());
            attendance.setMarkedByTeacher(req.getMarkedByTeacher());
            attendance.setNotes(req.getNotes());
            return attendanceRepository.save(attendance);
        }).collect(Collectors.toList());

        return saved.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Marks every student in a class as PRESENT for a given date/session.
     */
    @Transactional
    public List<AttendanceDTO> bulkMarkAllPresent(BulkAttendanceRequest req) {
        List<Student> students = studentRepository.findByClassName(req.getClassName());

        List<Attendance> saved = students.stream().map(student -> {
            Attendance attendance = attendanceRepository
                    .findByStudentIdAndDateAndSession(student.getId(), req.getDate(), req.getSession())
                    .orElse(new Attendance());

            attendance.setStudent(student);
            attendance.setDate(req.getDate());
            attendance.setSession(req.getSession());
            attendance.setStatus(AttendanceStatus.PRESENT);
            attendance.setClassName(req.getClassName());
            attendance.setMarkedByTeacher(req.getMarkedByTeacher());
            return attendanceRepository.save(attendance);
        }).collect(Collectors.toList());

        return saved.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AttendanceStatsDTO getStudentAttendanceStats(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        long total   = attendanceRepository.countByStudentId(studentId);
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long late    = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.LATE);
        long absent  = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.ABSENT);

        double rate = total > 0 ? ((double)(present + late) / total) * 100.0 : 0.0;

        return AttendanceStatsDTO.builder()
                .studentId(studentId)
                .studentName(student.getFirstName() + " " + student.getLastName())
                .totalSessions(total)
                .present(present)
                .late(late)
                .absent(absent)
                .attendanceRate(Math.round(rate * 10.0) / 10.0)
                .build();
    }

    // ── internal helpers ────────────────────────────────────────────────────

    public AttendanceDTO toDTO(Attendance a) {
        return AttendanceDTO.builder()
                .id(a.getId())
                .studentId(a.getStudent() != null ? a.getStudent().getId() : null)
                .studentName(a.getStudent() != null
                        ? a.getStudent().getFirstName() + " " + a.getStudent().getLastName() : null)
                .date(a.getDate())
                .session(a.getSession())
                .status(a.getStatus())
                .className(a.getClassName())
                .markedByTeacher(a.getMarkedByTeacher())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
