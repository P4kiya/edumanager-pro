package com.edumanager.api.repository;

import com.edumanager.api.entity.Transaction;
import com.edumanager.api.entity.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByStudentId(Long studentId);

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByParentId(Long parentId);

    List<Transaction> findByAcademicYear(String academicYear);

    long countByAcademicYear(String academicYear);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.status = :status AND t.academicYear = :academicYear
            """)
    BigDecimal sumAmountByStatusAndAcademicYear(
            @Param("status") TransactionStatus status,
            @Param("academicYear") String academicYear);

    /** Sum of PAID transactions for one student in one academic year — used for tarif balance. */
    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.student.id = :studentId
              AND t.academicYear = :academicYear
              AND t.status = 'PAID'
            """)
    BigDecimal sumPaidByStudentAndYear(
            @Param("studentId") Long studentId,
            @Param("academicYear") String academicYear);
}
