package com.edumanager.api.dto.request;

import com.edumanager.api.entity.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * A parent pays by cheque (or cash); the amount is distributed across
 * one or more of their children's accounts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitPaymentRequest {

    @NotNull(message = "Parent ID is required")
    private Long parentId;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    /** How the payment was made (cash, cheque, bank transfer…). Defaults to OTHER if omitted. */
    private PaymentMethod paymentMethod;

    /**
     * Payment reference: cheque number, bank transfer ID, bon de caisse, etc.
     * Meaning depends on paymentMethod. Optional for CASH / OTHER.
     */
    private String reference;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private String description;

    /** At least one student must be in the split. */
    @NotEmpty(message = "At least one payment split is required")
    @Valid
    private List<StudentPaymentSplit> splits;
}
