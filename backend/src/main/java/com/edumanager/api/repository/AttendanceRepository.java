package com.edumanager.api.repository;

import com.edumanager.api.entity.Attendance;
import com.edumanager.api.entity.enums.AttendanceSession;
import com.edumanager.api.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByDateAndClassName(LocalDate date, String className);

    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate from, LocalDate to);

    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    long countByStudentId(Long studentId);

    Optional<Attendance> findByStudentIdAndDateAndSession(Long studentId, LocalDate date, AttendanceSession session);
}
