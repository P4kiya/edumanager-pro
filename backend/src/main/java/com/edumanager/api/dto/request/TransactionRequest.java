package com.edumanager.api.dto.request;

import com.edumanager.api.entity.enums.PaymentMethod;
import com.edumanager.api.entity.enums.TransactionStatus;
import com.edumanager.api.entity.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private Long parentId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    @NotNull(message = "Status is required")
    private TransactionStatus status;

    private LocalDate dueDate;

    private LocalDateTime paidAt;

    private String description;

    private String receiptNumber;

    private String academicYear;

    private PaymentMethod paymentMethod;
}
