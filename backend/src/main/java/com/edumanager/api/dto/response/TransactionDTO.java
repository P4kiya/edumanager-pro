package com.edumanager.api.dto.response;

import com.edumanager.api.entity.enums.PaymentMethod;
import com.edumanager.api.entity.enums.TransactionStatus;
import com.edumanager.api.entity.enums.TransactionType;
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
public class TransactionDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long parentId;
    private String parentName;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private LocalDate dueDate;
    private LocalDateTime paidAt;
    private String description;
    private String receiptNumber;
    private String academicYear;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
