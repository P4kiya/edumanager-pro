package com.edumanager.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleReportDTO {
    private String moduleName;
    private Double s1Average;
    private Double s2Average;
    private Double annualAverage;
    /** true if annualAverage >= 10.0 */
    private boolean passed;
}
