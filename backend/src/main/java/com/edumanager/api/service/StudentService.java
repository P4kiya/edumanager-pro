package com.edumanager.api.service;

import com.edumanager.api.dto.request.StudentRequest;
import com.edumanager.api.dto.response.StudentDTO;
import com.edumanager.api.entity.Parent;
import com.edumanager.api.entity.Student;
import com.edumanager.api.entity.enums.StudentStatus;
import com.edumanager.api.exception.DuplicateResourceException;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.ParentRepository;
import com.edumanager.api.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final ParentRepository  parentRepository;

    public Page<StudentDTO> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::toDTO);
    }

    public StudentDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public List<StudentDTO> getByParentId(Long parentId) {
        return studentRepository.findByParentId(parentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<StudentDTO> search(String keyword, String className, String status, Pageable pageable) {
        StudentStatus statusEnum = null;
        if (status != null && !status.isBlank()) {
            statusEnum = StudentStatus.valueOf(status.toUpperCase());
        }
        return studentRepository.search(keyword, className, statusEnum, pageable).map(this::toDTO);
    }

    @Transactional
    public StudentDTO create(StudentRequest req) {
        if (req.getEmail() != null) {
            studentRepository.findAll().stream()
                    .filter(s -> req.getEmail().equalsIgnoreCase(s.getEmail()))
                    .findFirst()
                    .ifPresent(s -> {
                        throw new DuplicateResourceException("Student", "email", req.getEmail());
                    });
        }
        Student student = buildFromRequest(new Student(), req);
        return toDTO(studentRepository.save(student));
    }

    @Transactional
    public StudentDTO update(Long id, StudentRequest req) {
        Student student = findOrThrow(id);
        buildFromRequest(student, req);
        return toDTO(studentRepository.save(student));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        studentRepository.deleteById(id);
    }

    // ── internal helpers ────────────────────────────────────────────────────

    private Student findOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
    }

    private Student buildFromRequest(Student student, StudentRequest req) {
        student.setFirstName(req.getFirstName());
        student.setLastName(req.getLastName());
        student.setEmail(req.getEmail());
        student.setPhone(req.getPhone());
        student.setAvatarUrl(req.getAvatarUrl());
        student.setBirthDate(req.getBirthDate());
        student.setStatus(req.getStatus() != null ? req.getStatus() : StudentStatus.ACTIVE);
        student.setClassName(req.getClassName());

        if (req.getParentId() != null) {
            Parent parent = parentRepository.findById(req.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent", req.getParentId()));
            student.setParent(parent);
        } else {
            student.setParent(null);
        }
        return student;
    }

    public StudentDTO toDTO(Student s) {
        String parentName = null;
        Long parentId = null;
        if (s.getParent() != null) {
            parentId   = s.getParent().getId();
            parentName = s.getParent().getFirstName() + " " + s.getParent().getLastName();
        }
        return StudentDTO.builder()
                .id(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .avatarUrl(s.getAvatarUrl())
                .birthDate(s.getBirthDate())
                .status(s.getStatus())
                .className(s.getClassName())
                .parentId(parentId)
                .parentName(parentName)
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
