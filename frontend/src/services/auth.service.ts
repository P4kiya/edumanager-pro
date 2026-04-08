import apiClient from './api-client';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from '@/types/api.types';

const AUTH_USER_KEY = 'edumanager.auth.user';

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/forgot-password', payload);
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/reset-password', payload);
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

  isAdmin: (): boolean => {
    const user = authService.getUser();
    return user?.role === 'ADMIN';
  },

  logout: (): void => {
    sessionStorage.removeItem(AUTH_USER_KEY);
  },
};

export default authService;
