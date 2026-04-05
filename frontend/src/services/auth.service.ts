import apiClient from './api-client';
import type { LoginRequest, LoginResponse } from '@/types/api.types';

const AUTH_USER_KEY = 'edumanager.auth.user';

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  logoutRemote: async (): Promise<void> => {
    const user = authService.getUser();
    if (!user) return;
    await apiClient.post('/auth/logout', { agentId: user.id });
  },

  saveUser: (user: LoginResponse): void => {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  getUser: (): LoginResponse | null => {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LoginResponse;
    } catch {
      sessionStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return authService.getUser() !== null;
  },

  logout: (): void => {
    sessionStorage.removeItem(AUTH_USER_KEY);
  },
};

export default authService;
