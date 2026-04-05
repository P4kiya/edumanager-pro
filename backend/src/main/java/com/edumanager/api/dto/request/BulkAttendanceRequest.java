package com.edumanager.api.dto.request;

import com.edumanager.api.entity.enums.AttendanceSession;
import jakarta.validation.constraints.NotBlank;
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
public class BulkAttendanceRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Class name is required")
    private String className;

    @NotNull(message = "Session is required")
    private AttendanceSession session;

    private String markedByTeacher;
}
