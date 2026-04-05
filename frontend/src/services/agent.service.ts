import apiClient from './api-client';
import { AgentDTO, AgentRequest } from '@/types/api.types';

export const agentService = {
  // Get all agents
  getAll: async (): Promise<AgentDTO[]> => {
    const response = await apiClient.get<AgentDTO[]>('/agents');
    return response.data;
  },

  // Get agent by ID
  getById: async (id: number): Promise<AgentDTO> => {
    const response = await apiClient.get<AgentDTO>(`/agents/${id}`);
    return response.data;
  },

  // Create new agent
  create: async (agent: AgentRequest): Promise<AgentDTO> => {
    const response = await apiClient.post<AgentDTO>('/agents', agent);
    return response.data;
  },

  // Update existing agent
  update: async (id: number, agent: Partial<AgentRequest>): Promise<AgentDTO> => {
    const response = await apiClient.put<AgentDTO>(`/agents/${id}`, agent);
    return response.data;
  },

  // Delete agent
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/agents/${id}`);
  },
};

export default agentService;
