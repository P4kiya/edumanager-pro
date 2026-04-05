package com.edumanager.api.controller;

import com.edumanager.api.dto.request.SplitPaymentRequest;
import com.edumanager.api.dto.request.TarifRequest;
import com.edumanager.api.dto.response.TarifDTO;
import com.edumanager.api.dto.response.TransactionDTO;
import com.edumanager.api.service.TarifService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tarifs")
@RequiredArgsConstructor
public class TarifController {

    private final TarifService tarifService;

    /** List all tarifs, optionally filtered by academic year. */
    @GetMapping
    public ResponseEntity<List<TarifDTO>> getAll(
            @RequestParam(required = false) String academicYear) {
        return ResponseEntity.ok(tarifService.getAll(academicYear));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarifDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tarifService.getById(id));
    }

    /** All tarifs for a specific student (across all years). */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TarifDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(tarifService.getByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<TarifDTO> create(@Valid @RequestBody TarifRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tarifService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarifDTO> update(
            @PathVariable Long id, @Valid @RequestBody TarifRequest req) {
        return ResponseEntity.ok(tarifService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tarifService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Record a cheque / cash payment from a parent, split across their children.
     * Creates one PAID transaction per split line.
     *
     * Example body:
     * {
     *   "parentId": 3,
     *   "paymentDate": "2025-01-15",
     *   "reference": "1234567",
     *   "academicYear": "2024-2025",
     *   "description": "Chèque N° 1234567",
     *   "splits": [
     *     { "studentId": 5, "amount": 5000 },
     *     { "studentId": 6, "amount": 5000 }
     *   ]
     * }
     */
    @PostMapping("/payment/split")
    public ResponseEntity<List<TransactionDTO>> createSplitPayment(
            @Valid @RequestBody SplitPaymentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tarifService.createSplitPayment(req));
    }
}
