import { apiClient } from '@/lib/api/client';
import { ApiResponse, Favorite } from '@/types';

export const favoriteService = {
  async getFavorites(page = 1, limit = 20): Promise<{ favorites: Favorite[]; meta?: ApiResponse<Favorite[]>['meta'] }> {
    const res = await apiClient.get<ApiResponse<Favorite[]>>('/favorites', {
      params: { page, limit },
    });
    return {
      favorites: res.data.data,
      meta: res.data.meta,
    };
  },

  async addFavorite(propertyId: string): Promise<Favorite> {
    const res = await apiClient.post<ApiResponse<Favorite>>(`/favorites/${propertyId}`);
    return res.data.data;
  },

  async removeFavorite(propertyId: string): Promise<void> {
    await apiClient.delete(`/favorites/${propertyId}`);
  },
};

