import apiClient from './api-client';
import { GradeDTO, GradeRequest, GradeReportDTO, Semester } from '@/types/api.types';

export const gradeService = {
  // Get all grades
  getAll: async (): Promise<GradeDTO[]> => {
    const response = await apiClient.get<GradeDTO[]>('/grades');
    return response.data;
  },

  // Get grades by student
  getByStudent: async (studentId: number, semester?: Semester): Promise<GradeDTO[]> => {
    const response = await apiClient.get<GradeDTO[]>(`/grades/student/${studentId}`, {
      params: semester ? { semester } : {}
    });
    return response.data;
  },

  // Get student grade report
  getStudentReport: async (studentId: number, academicYear: string): Promise<GradeReportDTO> => {
    const response = await apiClient.get<GradeReportDTO>(`/grades/student/${studentId}/report`, {
      params: { academicYear }
    });
    return response.data;
  },

  // Create new grade
  create: async (grade: GradeRequest): Promise<GradeDTO> => {
    const response = await apiClient.post<GradeDTO>('/grades', grade);
    return response.data;
  },

  // Update existing grade
  update: async (id: number, grade: GradeRequest): Promise<GradeDTO> => {
    const response = await apiClient.put<GradeDTO>(`/grades/${id}`, grade);
    return response.data;
  },

  // Delete grade
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/grades/${id}`);
  },
};

export default gradeService;
