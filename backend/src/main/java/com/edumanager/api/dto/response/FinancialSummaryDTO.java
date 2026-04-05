package com.edumanager.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialSummaryDTO {
    private String academicYear;
    private BigDecimal totalRevenue;
    private BigDecimal totalPending;
    private BigDecimal totalOverdue;
    private long transactionCount;
}
