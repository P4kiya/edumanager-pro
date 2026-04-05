import apiClient from './api-client';
import { ParentDTO, ParentRequest, StudentDTO } from '@/types/api.types';

export const parentService = {
  // Get all parents
  getAll: async (): Promise<ParentDTO[]> => {
    const response = await apiClient.get<ParentDTO[]>('/parents');
    return response.data;
  },

  // Get parent by ID
  getById: async (id: number): Promise<ParentDTO> => {
    const response = await apiClient.get<ParentDTO>(`/parents/${id}`);
    return response.data;
  },

  // Get parent's children
  getChildren: async (id: number): Promise<StudentDTO[]> => {
    const response = await apiClient.get<StudentDTO[]>(`/parents/${id}/students`);
    return response.data;
  },

  // Create new parent
  create: async (parent: ParentRequest): Promise<ParentDTO> => {
    const response = await apiClient.post<ParentDTO>('/parents', parent);
    return response.data;
  },

  // Update existing parent
  update: async (id: number, parent: ParentRequest): Promise<ParentDTO> => {
    const response = await apiClient.put<ParentDTO>(`/parents/${id}`, parent);
    return response.data;
  },

  // Delete parent
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/parents/${id}`);
  },

  // Update arrears helper (backend has no dedicated endpoint, so reuse update)
  updateArrears: async (id: number, parent: ParentDTO, arrears: number): Promise<ParentDTO> => {
    const payload: ParentRequest = {
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone,
      address: parent.address,
      arrears,
    };
    const response = await apiClient.put<ParentDTO>(`/parents/${id}`, payload);
    return response.data;
  },
};

export default parentService;
