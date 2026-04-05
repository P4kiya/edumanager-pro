import apiClient from './api-client';
import { AuditLogDTO } from '@/types/api.types';

export const auditLogService = {
  // Get all audit logs
  getAll: async (): Promise<AuditLogDTO[]> => {
    const response = await apiClient.get<AuditLogDTO[]>('/audit-logs');
    return response.data;
  },

  // Get logs by agent
  getByAgent: async (agentId: number): Promise<AuditLogDTO[]> => {
    const response = await apiClient.get<AuditLogDTO[]>(`/audit-logs/agent/${agentId}`);
    return response.data;
  },

  // Get logs by module
  getByModule: async (module: string): Promise<AuditLogDTO[]> => {
    const response = await apiClient.get<AuditLogDTO[]>(`/audit-logs/module/${module}`);
    return response.data;
  },

  // Get logs by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<AuditLogDTO[]> => {
    const response = await apiClient.get<AuditLogDTO[]>('/audit-logs/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },
};

export default auditLogService;
