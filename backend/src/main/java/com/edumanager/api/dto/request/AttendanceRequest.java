package com.edumanager.api.dto.request;

import com.edumanager.api.entity.enums.AttendanceSession;
import com.edumanager.api.entity.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Session is required")
    private AttendanceSession session;

    @NotNull(message = "Status is required")
    private AttendanceStatus status;

    private String className;

    private String markedByTeacher;

    private String notes;
}
