import { apiClient } from '@/lib/api/client';
import { ApiResponse, User, PropertyListItem } from '@/types';

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  profileImage?: string;
}

export const userService = {
  async getProfile(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/users/me');
    return res.data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>('/users/me', payload);
    return res.data.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await apiClient.patch<ApiResponse<User>>('/users/me/avatar', formData);
    return res.data.data;
  },

  async getMyProperties(page = 1, limit = 20, status?: string): Promise<{ properties: PropertyListItem[]; meta?: ApiResponse<PropertyListItem[]>['meta'] }> {
    const res = await apiClient.get<ApiResponse<PropertyListItem[]>>('/users/me/properties', {
      params: { page, limit, status },
    });
    return {
      properties: res.data.data,
      meta: res.data.meta,
    };
  },
};

