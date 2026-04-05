package com.edumanager.api.dto.response;

import com.edumanager.api.entity.enums.PaymentFrequency;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TarifDTO {

    private Long id;

    /* ── Student info ──────────────────────────────────── */
    private Long studentId;
    private String studentName;
    private String studentAvatarUrl;
    private String className;

    /* ── Contract ──────────────────────────────────────── */
    private String academicYear;
    /** Month enrolled (1–12); 9 = September. */
    private Integer enrollmentMonth;
    private BigDecimal totalAmount;
    private PaymentFrequency frequency;
    private Integer installmentCount;
    private BigDecimal installmentAmount;
    private String description;

    /* ── Live balance (computed from transactions) ─────── */
    private BigDecimal amountPaid;
    private BigDecimal remainingAmount;
    /** 0–100 percentage paid. */
    private double progressPercent;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
