package com.edumanager.api.service;

import com.edumanager.api.dto.request.TransactionRequest;
import com.edumanager.api.dto.response.FinancialSummaryDTO;
import com.edumanager.api.dto.response.TransactionDTO;
import com.edumanager.api.entity.Parent;
import com.edumanager.api.entity.Student;
import com.edumanager.api.entity.Transaction;
import com.edumanager.api.entity.enums.TransactionStatus;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.ParentRepository;
import com.edumanager.api.repository.StudentRepository;
import com.edumanager.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final StudentRepository     studentRepository;
    private final ParentRepository      parentRepository;

    public Page<TransactionDTO> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(this::toDTO);
    }

    public TransactionDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public List<TransactionDTO> getByStudentId(Long studentId) {
        return transactionRepository.findByStudentId(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionDTO create(TransactionRequest req) {
        Transaction tx = buildFromRequest(new Transaction(), req);
        Transaction saved = transactionRepository.save(tx);
        syncParentArrears(saved.getParent());
        return toDTO(saved);
    }

    @Transactional
    public TransactionDTO update(Long id, TransactionRequest req) {
        Transaction tx = findOrThrow(id);
        Parent previousParent = tx.getParent();
        buildFromRequest(tx, req);
        Transaction saved = transactionRepository.save(tx);
        // Recalculate arrears for both the old and new parent (may be same)
        syncParentArrears(previousParent);
        if (saved.getParent() != null && !saved.getParent().equals(previousParent)) {
            syncParentArrears(saved.getParent());
        }
        return toDTO(saved);
    }

    public FinancialSummaryDTO getFinancialSummary(String academicYear) {
        BigDecimal revenue  = transactionRepository.sumAmountByStatusAndAcademicYear(TransactionStatus.PAID, academicYear);
        BigDecimal pending  = transactionRepository.sumAmountByStatusAndAcademicYear(TransactionStatus.PENDING, academicYear);
        BigDecimal overdue  = transactionRepository.sumAmountByStatusAndAcademicYear(TransactionStatus.OVERDUE, academicYear);
        long count          = transactionRepository.countByAcademicYear(academicYear);

        return FinancialSummaryDTO.builder()
                .academicYear(academicYear)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .totalPending(pending != null ? pending : BigDecimal.ZERO)
                .totalOverdue(overdue != null ? overdue : BigDecimal.ZERO)
                .transactionCount(count)
                .build();
    }

    // ── internal helpers ────────────────────────────────────────────────────

    private Transaction findOrThrow(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
    }

    private Transaction buildFromRequest(Transaction tx, TransactionRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));
        tx.setStudent(student);

        if (req.getParentId() != null) {
            Parent parent = parentRepository.findById(req.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent", req.getParentId()));
            tx.setParent(parent);
        } else if (student.getParent() != null) {
            // Default to student's linked parent
            tx.setParent(student.getParent());
        }

        tx.setAmount(req.getAmount());
        tx.setType(req.getType());
        tx.setStatus(req.getStatus());
        tx.setDueDate(req.getDueDate());
        tx.setDescription(req.getDescription());
        tx.setReceiptNumber(req.getReceiptNumber());
        tx.setAcademicYear(req.getAcademicYear());
        tx.setPaymentMethod(req.getPaymentMethod());

        // Stamp paidAt when status becomes PAID
        if (req.getStatus() == TransactionStatus.PAID && tx.getPaidAt() == null) {
            tx.setPaidAt(req.getPaidAt() != null ? req.getPaidAt() : java.time.LocalDateTime.now());
        } else if (req.getStatus() != TransactionStatus.PAID) {
            tx.setPaidAt(null);
        }
        return tx;
    }

    /**
     * Recalculates and persists the total arrears (PENDING + OVERDUE) for a parent.
     */
    private void syncParentArrears(Parent parent) {
        if (parent == null) return;
        List<Transaction> txList = transactionRepository.findByParentId(parent.getId());
        BigDecimal arrears = txList.stream()
                .filter(t -> t.getStatus() == TransactionStatus.PENDING
                          || t.getStatus() == TransactionStatus.OVERDUE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        parent.setArrears(arrears);
        parentRepository.save(parent);
    }

    public TransactionDTO toDTO(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .studentId(t.getStudent() != null ? t.getStudent().getId() : null)
                .studentName(t.getStudent() != null
                        ? t.getStudent().getFirstName() + " " + t.getStudent().getLastName() : null)
                .parentId(t.getParent() != null ? t.getParent().getId() : null)
                .parentName(t.getParent() != null
                        ? t.getParent().getFirstName() + " " + t.getParent().getLastName() : null)
                .amount(t.getAmount())
                .type(t.getType())
                .status(t.getStatus())
                .dueDate(t.getDueDate())
                .paidAt(t.getPaidAt())
                .description(t.getDescription())
                .receiptNumber(t.getReceiptNumber())
                .academicYear(t.getAcademicYear())
                .paymentMethod(t.getPaymentMethod())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
