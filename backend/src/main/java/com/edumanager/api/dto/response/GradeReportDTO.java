package com.edumanager.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeReportDTO {
    private Long studentId;
    private String studentName;
    private String academicYear;
    private List<ModuleReportDTO> modules;
    /** Arithmetic mean of all module annual averages */
    private Double overallAverage;
}
