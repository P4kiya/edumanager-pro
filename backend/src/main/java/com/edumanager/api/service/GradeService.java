package com.edumanager.api.service;

import com.edumanager.api.dto.request.GradeRequest;
import com.edumanager.api.dto.response.GradeDTO;
import com.edumanager.api.dto.response.GradeReportDTO;
import com.edumanager.api.dto.response.ModuleReportDTO;
import com.edumanager.api.entity.Grade;
import com.edumanager.api.entity.Student;
import com.edumanager.api.entity.Teacher;
import com.edumanager.api.entity.enums.Semester;
import com.edumanager.api.exception.ResourceNotFoundException;
import com.edumanager.api.repository.GradeRepository;
import com.edumanager.api.repository.StudentRepository;
import com.edumanager.api.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradeService {

    private final GradeRepository   gradeRepository;
    private final StudentRepository  studentRepository;
    private final TeacherRepository  teacherRepository;

    public List<GradeDTO> getAll() {
        return gradeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<GradeDTO> getByStudentId(Long studentId) {
        return gradeRepository.findByStudentId(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<GradeDTO> getByStudentAndSemester(Long studentId, Semester semester) {
        return gradeRepository.findByStudentIdAndSemester(studentId, semester).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GradeDTO create(GradeRequest req) {
        Grade grade = buildFromRequest(new Grade(), req);
        return toDTO(gradeRepository.save(grade));
    }

    @Transactional
    public GradeDTO update(Long id, GradeRequest req) {
        Grade grade = findOrThrow(id);
        buildFromRequest(grade, req);
        return toDTO(gradeRepository.save(grade));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        gradeRepository.deleteById(id);
    }

    /**
     * Weighted average for a specific module + semester.
     * average = Σ(score × coefficient) / Σ(coefficient)
     */
    public Double calculateModuleAverage(Long studentId, String moduleName, Semester semester) {
        List<Grade> grades = gradeRepository
                .findByStudentIdAndModuleNameAndSemester(studentId, moduleName, semester);
        return weightedAverage(grades);
    }

    /**
     * Full bulletin report: one row per module with S1/S2/annual averages and pass/fail.
     */
    public GradeReportDTO getStudentReport(Long studentId, String academicYear) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        List<Grade> allGrades = gradeRepository.findByStudentIdAndAcademicYear(studentId, academicYear);

        // Group by moduleName
        Map<String, List<Grade>> byModule = allGrades.stream()
                .collect(Collectors.groupingBy(Grade::getModuleName));

        List<ModuleReportDTO> modules = new ArrayList<>();
        for (Map.Entry<String, List<Grade>> entry : byModule.entrySet()) {
            String moduleName = entry.getKey();
            List<Grade> moduleGrades = entry.getValue();

            List<Grade> s1Grades = moduleGrades.stream()
                    .filter(g -> g.getSemester() == Semester.S1)
                    .collect(Collectors.toList());
            List<Grade> s2Grades = moduleGrades.stream()
                    .filter(g -> g.getSemester() == Semester.S2)
                    .collect(Collectors.toList());

            Double s1Avg = weightedAverage(s1Grades);
            Double s2Avg = weightedAverage(s2Grades);

            Double annualAvg;
            if (s1Avg != null && s2Avg != null) {
                annualAvg = (s1Avg + s2Avg) / 2.0;
            } else {
                annualAvg = s1Avg != null ? s1Avg : s2Avg;
            }

            modules.add(ModuleReportDTO.builder()
                    .moduleName(moduleName)
                    .s1Average(s1Avg)
                    .s2Average(s2Avg)
                    .annualAverage(annualAvg)
                    .passed(annualAvg != null && annualAvg >= 10.0)
                    .build());
        }

        // Sort modules by name for stable output
        modules.sort(Comparator.comparing(ModuleReportDTO::getModuleName));

        double overallAverage = modules.stream()
                .filter(m -> m.getAnnualAverage() != null)
                .mapToDouble(ModuleReportDTO::getAnnualAverage)
                .average()
                .orElse(0.0);

        return GradeReportDTO.builder()
                .studentId(studentId)
                .studentName(student.getFirstName() + " " + student.getLastName())
                .academicYear(academicYear)
                .modules(modules)
                .overallAverage(Math.round(overallAverage * 100.0) / 100.0)
                .build();
    }

    // ── internal helpers ────────────────────────────────────────────────────

    private Grade findOrThrow(Long id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade", id));
    }

    private Grade buildFromRequest(Grade grade, GradeRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));
        grade.setStudent(student);

        if (req.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(req.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", req.getTeacherId()));
            grade.setTeacher(teacher);
        }

        grade.setModuleName(req.getModuleName());
        grade.setEvaluationType(req.getEvaluationType());
        grade.setSemester(req.getSemester());
        grade.setScore(req.getScore());
        grade.setCoefficient(req.getCoefficient());
        grade.setWeightedScore(req.getScore() * req.getCoefficient());
        grade.setAcademicYear(req.getAcademicYear());
        grade.setGradedAt(req.getGradedAt());
        return grade;
    }

    /** Returns null if the list is empty. */
    private Double weightedAverage(List<Grade> grades) {
        if (grades == null || grades.isEmpty()) return null;
        double sumWeighted = grades.stream().mapToDouble(g -> g.getScore() * g.getCoefficient()).sum();
        double sumCoeff    = grades.stream().mapToDouble(Grade::getCoefficient).sum();
        if (sumCoeff == 0) return null;
        double avg = sumWeighted / sumCoeff;
        return Math.round(avg * 100.0) / 100.0;
    }

    public GradeDTO toDTO(Grade g) {
        return GradeDTO.builder()
                .id(g.getId())
                .studentId(g.getStudent() != null ? g.getStudent().getId() : null)
                .studentName(g.getStudent() != null
                        ? g.getStudent().getFirstName() + " " + g.getStudent().getLastName() : null)
                .teacherId(g.getTeacher() != null ? g.getTeacher().getId() : null)
                .teacherName(g.getTeacher() != null
                        ? g.getTeacher().getFirstName() + " " + g.getTeacher().getLastName() : null)
                .moduleName(g.getModuleName())
                .evaluationType(g.getEvaluationType())
                .semester(g.getSemester())
                .score(g.getScore())
                .coefficient(g.getCoefficient())
                .weightedScore(g.getWeightedScore())
                .academicYear(g.getAcademicYear())
                .gradedAt(g.getGradedAt())
                .createdAt(g.getCreatedAt())
                .build();
    }
}
