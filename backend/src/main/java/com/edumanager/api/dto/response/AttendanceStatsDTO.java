package com.edumanager.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStatsDTO {
    private Long studentId;
    private String studentName;
    private long totalSessions;
    private long present;
    private long late;
    private long absent;
    /** (present + late) / totalSessions × 100 */
    private double attendanceRate;
}
