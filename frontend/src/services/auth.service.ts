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

  hasPermission: (permission: string): boolean => {
    const user = authService.getUser();
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return (user.permissions || []).includes(permission);
  },

  getDefaultRoute: (): string => {
    const user = authService.getUser();
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/';

    const permissionRouteMap: Record<string, string> = {
      students: '/etudiants',
      parents: '/parents',
      presences: '/presences',
      notes: '/notes',
      finances: '/finances',
      emploi_du_temps: '/emploi-du-temps',
      professeurs: '/professeurs',
    };

    for (const permission of user.permissions || []) {
      const route = permissionRouteMap[permission];
      if (route) {
        return route;
      }
    }

    return '/etudiants';
  },

  logout: (): void => {
    sessionStorage.removeItem(AUTH_USER_KEY);
  },
};

export default authService;
