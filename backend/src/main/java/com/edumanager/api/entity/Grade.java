package com.edumanager.api.entity;

import com.edumanager.api.entity.enums.EvaluationType;
import com.edumanager.api.entity.enums.Semester;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Teacher teacher;

    @Column(nullable = false)
    private String moduleName;

    @Enumerated(EnumType.STRING)
    private EvaluationType evaluationType;

    @Enumerated(EnumType.STRING)
    private Semester semester;

    @Column(nullable = false)
    private Double score;

    @Column(nullable = false)
    private Double coefficient;

    /** Stored computed value: score × coefficient */
    private Double weightedScore;

    private String academicYear;

    private LocalDate gradedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
