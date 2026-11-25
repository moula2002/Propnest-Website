import { apiClient } from '@/lib/api/client';
import {
  ApiResponse,
  Property,
  PropertyListItem,
  PropertySearchParams,
  Amenity,
  LocationItem,
  PropertyCategory,
  PropertyImage,
  PropertyStatus,
} from '@/types';

export interface CreatePropertyPayload {
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  price: number;
  negotiable?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  builtUpArea?: number;
  carpetArea: number;
  plotArea?: number;
  areaUnit?: string;
  floorNumber?: number;
  totalFloors?: number;
  furnishingStatus?: string;
  possessionStatus?: string;
  constructionStatus?: string;
  propertyAge?: string;
  facing?: string;
  parkingSpaces?: number;
  city: string;
  locality: string;
  state: string;
  country?: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  address: string;
  landmark?: string;
  amenityIds?: string[];
  isFeatured?: boolean;
  isLatest?: boolean;
}

export const propertyService = {
  async getProperties(params?: PropertySearchParams): Promise<{ properties: PropertyListItem[]; meta?: ApiResponse<PropertyListItem[]>['meta'] }> {
    const res = await apiClient.get<ApiResponse<PropertyListItem[]>>('/properties', {
      params,
    });
    return {
      properties: res.data.data,
      meta: res.data.meta,
    };
  },

  async getProperty(idOrSlug: string): Promise<Property> {
    const res = await apiClient.get<ApiResponse<Property>>(`/properties/${idOrSlug}`);
    return res.data.data;
  },

  async getPropertyBySlug(slug: string): Promise<Property> {
    const res = await apiClient.get<ApiResponse<Property>>(`/properties/slug/${slug}`);
    return res.data.data;
  },

  async getSimilarProperties(id: string): Promise<PropertyListItem[]> {
    const res = await apiClient.get<ApiResponse<PropertyListItem[]>>(`/properties/${id}/similar`);
    return res.data.data;
  },

  async createProperty(payload: CreatePropertyPayload): Promise<Property> {
    const res = await apiClient.post<ApiResponse<Property>>('/properties', payload);
    return res.data.data;
  },

  async updateProperty(id: string, payload: Partial<CreatePropertyPayload>): Promise<Property> {
    const res = await apiClient.patch<ApiResponse<Property>>(`/properties/${id}`, payload);
    return res.data.data;
  },

  async updatePropertyStatus(id: string, status: PropertyStatus): Promise<Property> {
    const res = await apiClient.patch<ApiResponse<Property>>(`/properties/${id}/status`, { status });
    return res.data.data;
  },

  async submitForApproval(id: string): Promise<Property> {
    const res = await apiClient.patch<ApiResponse<Property>>(`/properties/${id}/submit-for-approval`);
    return res.data.data;
  },

  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  },

  async uploadImages(propertyId: string, files: File[]): Promise<PropertyImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const res = await apiClient.post<ApiResponse<PropertyImage[]>>(
      `/properties/${propertyId}/images`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data.data;
  },

  async deleteImage(propertyId: string, imageId: string): Promise<void> {
    await apiClient.delete(`/properties/${propertyId}/images/${imageId}`);
  },

  async setPrimaryImage(propertyId: string, imageId: string): Promise<void> {
    await apiClient.patch(`/properties/${propertyId}/images/${imageId}/primary`);
  },

  async reorderImages(propertyId: string, images: Array<{ imageId: string; displayOrder: number }>): Promise<void> {
    await apiClient.patch(`/properties/${propertyId}/images/reorder`, { images });
  },

  async getAmenities(): Promise<Amenity[]> {
    const res = await apiClient.get<ApiResponse<Amenity[]>>('/amenities');
    return res.data.data;
  },

  async getCategories(): Promise<PropertyCategory[]> {
    const res = await apiClient.get<ApiResponse<PropertyCategory[]>>('/categories');
    return res.data.data;
  },

  async searchLocations(q?: string): Promise<LocationItem[]> {
    const res = await apiClient.get<ApiResponse<LocationItem[]>>('/locations/search', {
      params: q ? { q } : undefined,
    });
    return res.data.data;
  },
};

