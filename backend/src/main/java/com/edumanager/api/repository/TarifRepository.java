package com.edumanager.api.repository;

import com.edumanager.api.entity.Tarif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarifRepository extends JpaRepository<Tarif, Long> {

    List<Tarif> findByAcademicYear(String academicYear);

    List<Tarif> findByStudentId(Long studentId);

    Optional<Tarif> findByStudentIdAndAcademicYear(Long studentId, String academicYear);
}
