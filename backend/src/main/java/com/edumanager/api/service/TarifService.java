package com.edumanager.api.service;

import com.edumanager.api.dto.request.SplitPaymentRequest;
import com.edumanager.api.dto.request.StudentPaymentSplit;
import com.edumanager.api.dto.request.TarifRequest;
import com.edumanager.api.dto.response.TarifDTO;
import com.edumanager.api.dto.response.TransactionDTO;
import com.edumanager.api.entity.Parent;
import com.edumanager.api.entity.Student;
import com.edumanager.api.entity.Tarif;
import com.edumanager.api.entity.Transaction;
import com.edumanager.api.entity.enums.PaymentMethod;
import com.edumanager.api.entity.enums.TransactionStatus;
import com.edumanager.api.entity.enums.TransactionType;
import com.edumanager.api.exception.DuplicateResourceException;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.ParentRepository;
import com.edumanager.api.repository.StudentRepository;
import com.edumanager.api.repository.TarifRepository;
import com.edumanager.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TarifService {

    private final TarifRepository       tarifRepository;
    private final StudentRepository     studentRepository;
    private final ParentRepository      parentRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService    transactionService;

    // ── Queries ─────────────────────────────────────────────────────────────

    public List<TarifDTO> getAll(String academicYear) {
        List<Tarif> tarifs = (academicYear != null && !academicYear.isBlank())
                ? tarifRepository.findByAcademicYear(academicYear)
                : tarifRepository.findAll();
        return tarifs.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TarifDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public List<TarifDTO> getByStudent(Long studentId) {
        return tarifRepository.findByStudentId(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Mutations ────────────────────────────────────────────────────────────

    @Transactional
    public TarifDTO create(TarifRequest req) {
        tarifRepository.findByStudentIdAndAcademicYear(req.getStudentId(), req.getAcademicYear())
                .ifPresent(t -> {
                    throw new DuplicateResourceException(
                            "A tarif already exists for this student in year " + req.getAcademicYear());
                });

        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));

        Tarif tarif = buildFromRequest(new Tarif(), req, student);
        return toDTO(tarifRepository.save(tarif));
    }

    @Transactional
    public TarifDTO update(Long id, TarifRequest req) {
        Tarif tarif = findOrThrow(id);

        // Only reject duplicate if the student or year actually changed
        if (!tarif.getStudent().getId().equals(req.getStudentId())
                || !tarif.getAcademicYear().equals(req.getAcademicYear())) {
            tarifRepository.findByStudentIdAndAcademicYear(req.getStudentId(), req.getAcademicYear())
                    .ifPresent(t -> {
                        throw new DuplicateResourceException(
                                "A tarif already exists for this student in year " + req.getAcademicYear());
                    });
        }

        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));

        buildFromRequest(tarif, req, student);
        return toDTO(tarifRepository.save(tarif));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        tarifRepository.deleteById(id);
    }

    // ── Split cheque payment ─────────────────────────────────────────────────

    /**
     * Records a single parent payment (cheque / cash) split across one or more children.
     * Creates one PAID Transaction per split line.
     */
    @Transactional
    public List<TransactionDTO> createSplitPayment(SplitPaymentRequest req) {
        Parent parent = parentRepository.findById(req.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent", req.getParentId()));

        PaymentMethod method = req.getPaymentMethod() != null ? req.getPaymentMethod() : PaymentMethod.OTHER;

        List<TransactionDTO> result = new ArrayList<>();
        int lineIndex = 1;

        for (StudentPaymentSplit split : req.getSplits()) {
            Student student = studentRepository.findById(split.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", split.getStudentId()));

            String receipt = buildReceiptNumber(method, req.getReference(), split.getStudentId(), lineIndex++);
            String desc    = buildDescription(method, req.getDescription(), req.getReference());

            Transaction tx = Transaction.builder()
                    .student(student)
                    .parent(parent)
                    .amount(split.getAmount())
                    .type(TransactionType.TUITION)
                    .status(TransactionStatus.PAID)
                    .paymentMethod(method)
                    .dueDate(req.getPaymentDate())
                    .paidAt(req.getPaymentDate().atStartOfDay())
                    .description(desc)
                    .receiptNumber(receipt)
                    .academicYear(req.getAcademicYear())
                    .build();

            result.add(transactionService.toDTO(transactionRepository.save(tx)));
        }

        // Recalculate parent arrears after new payments
        syncParentArrears(parent);
        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Tarif findOrThrow(Long id) {
        return tarifRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarif", id));
    }

    private Tarif buildFromRequest(Tarif tarif, TarifRequest req, Student student) {
        tarif.setStudent(student);
        tarif.setAcademicYear(req.getAcademicYear());
        tarif.setEnrollmentMonth(req.getEnrollmentMonth() != null ? req.getEnrollmentMonth() : 9);
        tarif.setTotalAmount(req.getTotalAmount());
        tarif.setFrequency(req.getFrequency());
        tarif.setDescription(req.getDescription());

        Integer count = req.getInstallmentCount();
        tarif.setInstallmentCount(count);

        if (count != null && count > 0) {
            BigDecimal instalment = req.getTotalAmount()
                    .divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
            tarif.setInstallmentAmount(instalment);
        } else {
            tarif.setInstallmentAmount(req.getTotalAmount());
        }
        return tarif;
    }

    public TarifDTO toDTO(Tarif t) {
        BigDecimal paid = transactionRepository
                .sumPaidByStudentAndYear(t.getStudent().getId(), t.getAcademicYear());
        if (paid == null) paid = BigDecimal.ZERO;

        BigDecimal remaining = t.getTotalAmount().subtract(paid);
        if (remaining.compareTo(BigDecimal.ZERO) < 0) remaining = BigDecimal.ZERO;

        double progress = 0.0;
        if (t.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {
            progress = paid.divide(t.getTotalAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            progress = Math.min(100.0, Math.round(progress * 10.0) / 10.0);
        }

        return TarifDTO.builder()
                .id(t.getId())
                .studentId(t.getStudent().getId())
                .studentName(t.getStudent().getFirstName() + " " + t.getStudent().getLastName())
                .studentAvatarUrl(t.getStudent().getAvatarUrl())
                .className(t.getStudent().getClassName())
                .academicYear(t.getAcademicYear())
                .enrollmentMonth(t.getEnrollmentMonth() != null ? t.getEnrollmentMonth() : 9)
                .totalAmount(t.getTotalAmount())
                .frequency(t.getFrequency())
                .installmentCount(t.getInstallmentCount())
                .installmentAmount(t.getInstallmentAmount())
                .description(t.getDescription())
                .amountPaid(paid)
                .remainingAmount(remaining)
                .progressPercent(progress)
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }

    private String buildReceiptNumber(PaymentMethod method, String reference, Long studentId, int index) {
        String prefix = switch (method) {
            case CASH          -> "ESP";
            case CHEQUE        -> "CHQ";
            case BANK_TRANSFER -> "VIR";
            default            -> "PAY";
        };
        if (reference != null && !reference.isBlank()) {
            return prefix + "-" + reference.trim() + "-S" + studentId;
        }
        return prefix + "-" + System.currentTimeMillis() + "-" + index;
    }

    private String buildDescription(PaymentMethod method, String customDesc, String reference) {
        if (customDesc != null && !customDesc.isBlank()) return customDesc;
        boolean hasRef = reference != null && !reference.isBlank();
        return switch (method) {
            case CASH          -> hasRef ? "Paiement en espèces – Bon N° " + reference : "Paiement en espèces";
            case CHEQUE        -> hasRef ? "Chèque N° " + reference : "Paiement par chèque";
            case BANK_TRANSFER -> hasRef ? "Virement bancaire Réf. " + reference : "Virement bancaire";
            default            -> hasRef ? "Paiement Réf. " + reference : "Paiement";
        };
    }

    private void syncParentArrears(Parent parent) {
        List<Transaction> txList = transactionRepository.findByParentId(parent.getId());
        BigDecimal arrears = txList.stream()
                .filter(t -> t.getStatus() == TransactionStatus.PENDING
                          || t.getStatus() == TransactionStatus.OVERDUE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        parent.setArrears(arrears);
        parentRepository.save(parent);
    }
}
