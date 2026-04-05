package com.edumanager.api.dto.request;

import com.edumanager.api.entity.enums.PaymentFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TarifRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private BigDecimal totalAmount;

    private PaymentFrequency frequency;

    /**
     * Month the student enrolled (1–12). Defaults to 9 (September).
     * Used to compute how many instalments are actually due.
     */
    private Integer enrollmentMonth;

    /** Number of instalments; null = one-shot payment. */
    private Integer installmentCount;

    private String description;
}
