import apiClient from './api-client';
import { StudentDTO, StudentRequest, PageResponse } from '@/types/api.types';

export const studentService = {
  // Get all students (paginated)
  getAll: async (page = 0, size = 20): Promise<PageResponse<StudentDTO>> => {
    const response = await apiClient.get<PageResponse<StudentDTO>>('/students', {
      params: { page, size }
    });
    return response.data;
  },

  // Get student by ID
  getById: async (id: number): Promise<StudentDTO> => {
    const response = await apiClient.get<StudentDTO>(`/students/${id}`);
    return response.data;
  },

  // Create new student
  create: async (student: StudentRequest): Promise<StudentDTO> => {
    const response = await apiClient.post<StudentDTO>('/students', student);
    return response.data;
  },

  // Update existing student
  update: async (id: number, student: StudentRequest): Promise<StudentDTO> => {
    const response = await apiClient.put<StudentDTO>(`/students/${id}`, student);
    return response.data;
  },

  // Delete student
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },

  // Search students
  search: async (query: string): Promise<StudentDTO[]> => {
    const response = await apiClient.get<StudentDTO[]>('/students/search', {
      params: { q: query }
    });
    return response.data;
  },
};

export default studentService;
