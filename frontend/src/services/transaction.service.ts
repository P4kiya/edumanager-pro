import apiClient from './api-client';
import { TransactionDTO, TransactionRequest, PageResponse, FinancialSummaryDTO } from '@/types/api.types';

export const transactionService = {
  // Get all transactions (paginated)
  getAll: async (page = 0, size = 20): Promise<PageResponse<TransactionDTO>> => {
    const response = await apiClient.get<PageResponse<TransactionDTO>>('/transactions', {
      params: { page, size }
    });
    return response.data;
  },

  // Get transaction by ID
  getById: async (id: number): Promise<TransactionDTO> => {
    const response = await apiClient.get<TransactionDTO>(`/transactions/${id}`);
    return response.data;
  },

  // Create new transaction
  create: async (transaction: TransactionRequest): Promise<TransactionDTO> => {
    const response = await apiClient.post<TransactionDTO>('/transactions', transaction);
    return response.data;
  },

  // Update existing transaction
  update: async (id: number, transaction: TransactionRequest): Promise<TransactionDTO> => {
    const response = await apiClient.put<TransactionDTO>(`/transactions/${id}`, transaction);
    return response.data;
  },

  // Get transaction summary
  getSummary: async (academicYear: string): Promise<FinancialSummaryDTO> => {
    const response = await apiClient.get<FinancialSummaryDTO>('/transactions/summary', {
      params: { academicYear },
    });
    return response.data;
  },
};

export default transactionService;
