package com.edumanager.api.dto.response;

import com.edumanager.api.entity.enums.TeacherStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String specialization;
    private TeacherStatus status;
    private List<String> subjects;
    private List<String> assignedClasses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
