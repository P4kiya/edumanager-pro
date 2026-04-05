package com.edumanager.api.dto.request;

import com.edumanager.api.entity.enums.EvaluationType;
import com.edumanager.api.entity.enums.Semester;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private Long teacherId;

    @NotBlank(message = "Module name is required")
    private String moduleName;

    private EvaluationType evaluationType;

    private Semester semester;

    @NotNull(message = "Score is required")
    @DecimalMin(value = "0.0", message = "Score must be >= 0")
    @DecimalMax(value = "20.0", message = "Score must be <= 20")
    private Double score;

    @NotNull(message = "Coefficient is required")
    @Positive(message = "Coefficient must be positive")
    private Double coefficient;

    private String academicYear;

    private LocalDate gradedAt;
}
