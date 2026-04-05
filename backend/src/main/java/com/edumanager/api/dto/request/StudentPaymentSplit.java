package com.edumanager.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** One line in a split cheque: how much of the total goes to a specific student. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentPaymentSplit {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
}
