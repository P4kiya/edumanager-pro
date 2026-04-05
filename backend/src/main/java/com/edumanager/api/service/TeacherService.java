package com.edumanager.api.service;

import com.edumanager.api.dto.request.TeacherRequest;
import com.edumanager.api.dto.response.TeacherDTO;
import com.edumanager.api.entity.Teacher;
import com.edumanager.api.entity.enums.TeacherStatus;
import com.edumanager.api.exception.DuplicateResourceException;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public List<TeacherDTO> getAll() {
        return teacherRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TeacherDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public List<TeacherDTO> getByStatus(TeacherStatus status) {
        return teacherRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeacherDTO create(TeacherRequest req) {
        if (req.getEmail() != null && teacherRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Teacher", "email", req.getEmail());
        }
        Teacher teacher = buildFromRequest(new Teacher(), req);
        return toDTO(teacherRepository.save(teacher));
    }

    @Transactional
    public TeacherDTO update(Long id, TeacherRequest req) {
        Teacher teacher = findOrThrow(id);
        if (req.getEmail() != null && !req.getEmail().equals(teacher.getEmail())) {
            teacherRepository.findByEmail(req.getEmail()).ifPresent(t -> {
                throw new DuplicateResourceException("Teacher", "email", req.getEmail());
            });
        }
        buildFromRequest(teacher, req);
        return toDTO(teacherRepository.save(teacher));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        teacherRepository.deleteById(id);
    }

    // ── internal helpers ────────────────────────────────────────────────────

    private Teacher findOrThrow(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
    }

    private Teacher buildFromRequest(Teacher teacher, TeacherRequest req) {
        teacher.setFirstName(req.getFirstName());
        teacher.setLastName(req.getLastName());
        teacher.setEmail(req.getEmail());
        teacher.setPhone(req.getPhone());
        teacher.setAvatarUrl(req.getAvatarUrl());
        teacher.setSpecialization(req.getSpecialization());
        teacher.setStatus(req.getStatus() != null ? req.getStatus() : TeacherStatus.ACTIVE);
        teacher.setSubjects(req.getSubjects() != null ? new ArrayList<>(req.getSubjects()) : new ArrayList<>());
        teacher.setAssignedClasses(req.getAssignedClasses() != null ? new ArrayList<>(req.getAssignedClasses()) : new ArrayList<>());
        return teacher;
    }

    public TeacherDTO toDTO(Teacher t) {
        return TeacherDTO.builder()
                .id(t.getId())
                .firstName(t.getFirstName())
                .lastName(t.getLastName())
                .email(t.getEmail())
                .phone(t.getPhone())
                .avatarUrl(t.getAvatarUrl())
                .specialization(t.getSpecialization())
                .status(t.getStatus())
                .subjects(t.getSubjects())
                .assignedClasses(t.getAssignedClasses())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
