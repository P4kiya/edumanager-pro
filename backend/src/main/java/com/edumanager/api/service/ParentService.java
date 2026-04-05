package com.edumanager.api.service;

import com.edumanager.api.dto.request.ParentRequest;
import com.edumanager.api.dto.response.ParentDTO;
import com.edumanager.api.entity.Parent;
import com.edumanager.api.exception.DuplicateResourceException;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ParentService {

    private final ParentRepository parentRepository;

    public List<ParentDTO> getAll() {
        return parentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ParentDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    @Transactional
    public ParentDTO create(ParentRequest req) {
        if (req.getEmail() != null && parentRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Parent", "email", req.getEmail());
        }
        Parent parent = Parent.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .address(req.getAddress())
                .arrears(req.getArrears() != null ? req.getArrears() : BigDecimal.ZERO)
                .build();
        return toDTO(parentRepository.save(parent));
    }

    @Transactional
    public ParentDTO update(Long id, ParentRequest req) {
        Parent parent = findOrThrow(id);
        if (req.getEmail() != null && !req.getEmail().equals(parent.getEmail())) {
            parentRepository.findByEmail(req.getEmail()).ifPresent(p -> {
                throw new DuplicateResourceException("Parent", "email", req.getEmail());
            });
        }
        parent.setFirstName(req.getFirstName());
        parent.setLastName(req.getLastName());
        parent.setEmail(req.getEmail());
        parent.setPhone(req.getPhone());
        parent.setAddress(req.getAddress());
        if (req.getArrears() != null) {
            parent.setArrears(req.getArrears());
        }
        return toDTO(parentRepository.save(parent));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        parentRepository.deleteById(id);
    }

    @Transactional
    public void updateArrears(Long parentId, BigDecimal amount) {
        Parent parent = findOrThrow(parentId);
        parent.setArrears(amount);
        parentRepository.save(parent);
    }

    // ── internal helpers ────────────────────────────────────────────────────

    private Parent findOrThrow(Long id) {
        return parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", id));
    }

    public ParentDTO toDTO(Parent p) {
        List<Long> childrenIds = p.getChildren().stream()
                .map(s -> s.getId())
                .collect(Collectors.toList());
        List<String> childrenNames = p.getChildren().stream()
                .map(s -> s.getFirstName() + " " + s.getLastName())
                .collect(Collectors.toList());
        return ParentDTO.builder()
                .id(p.getId())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .address(p.getAddress())
                .arrears(p.getArrears())
                .childrenIds(childrenIds)
                .childrenNames(childrenNames)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
