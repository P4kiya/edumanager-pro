package com.edumanager.api.entity;

import com.edumanager.api.entity.enums.PaymentFrequency;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Defines the total tuition contract for one student in one academic year.
 * The actual balance (amount paid / remaining) is computed dynamically
 * from the sum of PAID Transactions linked to that student + academicYear.
 */
@Entity
@Table(
    name = "tarifs",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_tarif_student_year",
        columnNames = {"student_id", "academic_year"}
    )
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tarif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Student student;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    /** Total amount the student owes for the year (MAD). */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    /** How the amount is split: monthly / trimestrial / annual. */
    @Enumerated(EnumType.STRING)
    private PaymentFrequency frequency;

    /**
     * Month the student enrolled (1–12).
     * 9 = September (default, start of school year).
     * Drives installmentCount computation: a December enrolment skips Sep–Nov.
     */
    @Column(nullable = false)
    private Integer enrollmentMonth;

    /** Number of scheduled instalments (e.g. 10 monthly, 3 trimestrial, 1 annual). */
    private Integer installmentCount;

    /**
     * Amount per instalment = totalAmount / installmentCount.
     * Stored for display; recomputed on every save.
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal installmentAmount;

    private String description;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
