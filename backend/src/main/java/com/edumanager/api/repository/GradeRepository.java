package com.edumanager.api.repository;

import com.edumanager.api.entity.Grade;
import com.edumanager.api.entity.enums.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    List<Grade> findByStudentId(Long studentId);

    List<Grade> findByStudentIdAndSemester(Long studentId, Semester semester);

    List<Grade> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

    List<Grade> findByStudentIdAndModuleNameAndSemester(Long studentId, String moduleName, Semester semester);

    @Query("""
            SELECT g FROM Grade g
            JOIN g.student s
            WHERE g.moduleName = :moduleName AND s.className = :className
            """)
    List<Grade> findByModuleNameAndClassName(
            @Param("moduleName") String moduleName,
            @Param("className") String className);
}
