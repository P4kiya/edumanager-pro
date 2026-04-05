package com.edumanager.api.repository;

import com.edumanager.api.entity.Student;
import com.edumanager.api.entity.enums.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByClassName(String className);

    List<Student> findByStatus(StudentStatus status);

    List<Student> findByParentId(Long parentId);

    @Query("""
            SELECT s FROM Student s
            WHERE (:keyword IS NULL OR :keyword = ''
                OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(s.lastName)  LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(s.email)     LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:className IS NULL OR :className = '' OR s.className = :className)
            AND (:status IS NULL OR s.status = :status)
            """)
    Page<Student> search(
            @Param("keyword") String keyword,
            @Param("className") String className,
            @Param("status") StudentStatus status,
            Pageable pageable);
}
