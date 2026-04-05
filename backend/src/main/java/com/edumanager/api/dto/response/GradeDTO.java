package com.edumanager.api.dto.response;

import com.edumanager.api.entity.enums.EvaluationType;
import com.edumanager.api.entity.enums.Semester;
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
public class GradeDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long teacherId;
    private String teacherName;
    private String moduleName;
    private EvaluationType evaluationType;
    private Semester semester;
    private Double score;
    private Double coefficient;
    private Double weightedScore;
    private String academicYear;
    private LocalDate gradedAt;
    private LocalDateTime createdAt;
}
