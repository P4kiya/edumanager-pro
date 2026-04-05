package com.edumanager.api.controller;

import com.edumanager.api.dto.request.TransactionRequest;
import com.edumanager.api.dto.response.FinancialSummaryDTO;
import com.edumanager.api.dto.response.TransactionDTO;
import com.edumanager.api.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<Page<TransactionDTO>> getAll(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(transactionService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> create(@Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> update(
            @PathVariable Long id, @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(transactionService.update(id, req));
    }

    @GetMapping("/summary")
    public ResponseEntity<FinancialSummaryDTO> getSummary(
            @RequestParam String academicYear) {
        return ResponseEntity.ok(transactionService.getFinancialSummary(academicYear));
    }
}
