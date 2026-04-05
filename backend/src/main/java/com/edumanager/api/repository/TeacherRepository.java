package com.edumanager.api.repository;

import com.edumanager.api.entity.Teacher;
import com.edumanager.api.entity.enums.TeacherStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    List<Teacher> findByStatus(TeacherStatus status);

    @Query("SELECT DISTINCT t FROM Teacher t JOIN t.subjects s WHERE s = :subject")
    List<Teacher> findBySubject(@Param("subject") String subject);

    Optional<Teacher> findByEmail(String email);
}
