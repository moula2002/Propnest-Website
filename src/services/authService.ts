import { apiClient } from '@/lib/api/client';
import { ApiResponse, User } from '@/types';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role?: 'USER' | 'AGENT';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>('/auth/register', payload);
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<LoginResponseData> {
    const res = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', payload);
    const data = res.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('authUser', JSON.stringify(data.user));
    }
    return data;
  },

  async refresh(): Promise<string> {
    const res = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    const token = res.data.data.accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
    return token;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authUser');
      }
    }
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (typeof window !== 'undefined') {
      localStorage.setItem('authUser', JSON.stringify(res.data.data));
    }
    return res.data.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<void> {
    await apiClient.patch('/auth/change-password', data);
  },
};

