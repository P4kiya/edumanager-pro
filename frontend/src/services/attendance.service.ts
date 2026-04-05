import apiClient from './api-client';
import {
  AttendanceDTO,
  AttendanceRequest,
  BulkAttendanceRequest,
  AttendanceStatsDTO,
} from '@/types/api.types';

export const attendanceService = {
  // Get all attendances
  getAll: async (): Promise<AttendanceDTO[]> => {
    const response = await apiClient.get<AttendanceDTO[]>('/attendances');
    return response.data;
  },

  // Get attendance by date and class
  getByDateAndClass: async (date: string, className: string): Promise<AttendanceDTO[]> => {
    const response = await apiClient.get<AttendanceDTO[]>('/attendances/class', {
      params: { date, className }
    });
    return response.data;
  },

  // Mark attendance for students
  markAttendance: async (records: AttendanceRequest[]): Promise<AttendanceDTO[]> => {
    const response = await apiClient.post<AttendanceDTO[]>('/attendances/mark', records);
    return response.data;
  },

  // Mark all students as present for a session
  bulkMarkPresent: async (request: BulkAttendanceRequest): Promise<AttendanceDTO[]> => {
    const response = await apiClient.post<AttendanceDTO[]>('/attendances/bulk-present', request);
    return response.data;
  },

  // Get student attendance stats
  getStudentStats: async (studentId: number): Promise<AttendanceStatsDTO> => {
    const response = await apiClient.get<AttendanceStatsDTO>(`/attendances/student/${studentId}/stats`);
    return response.data;
  },

  // Save all records for a session in one operation
  saveSessionAttendance: async (records: AttendanceRequest[]): Promise<AttendanceDTO[]> => {
    const response = await apiClient.post<AttendanceDTO[]>('/attendances/mark', records);
    return response.data;
  },
};

export default attendanceService;
