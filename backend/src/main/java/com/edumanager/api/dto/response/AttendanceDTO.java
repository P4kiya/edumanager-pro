package com.edumanager.api.dto.response;

import com.edumanager.api.entity.enums.AttendanceSession;
import com.edumanager.api.entity.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private LocalDate date;
    private AttendanceSession session;
    private AttendanceStatus status;
    private String className;
    private String markedByTeacher;
    private String notes;
    private LocalDateTime createdAt;
}
