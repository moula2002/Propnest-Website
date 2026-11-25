import { apiClient } from '@/lib/api/client';
import { ApiResponse, Inquiry, InquiryStatus } from '@/types';

export interface CreateInquiryPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}

export const inquiryService = {
  async createInquiry(propertyId: string, payload: CreateInquiryPayload): Promise<Inquiry> {
    const res = await apiClient.post<ApiResponse<Inquiry>>(`/properties/${propertyId}/inquiries`, payload);
    return res.data.data;
  },

  async submitContactInquiry(payload: {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
  }): Promise<Inquiry> {
    const res = await apiClient.post<ApiResponse<Inquiry>>('/inquiries/contact', payload);
    return res.data.data;
  },

  async getMyInquiries(page = 1, limit = 20): Promise<{ inquiries: Inquiry[]; meta?: ApiResponse<Inquiry[]>['meta'] }> {
    const res = await apiClient.get<ApiResponse<Inquiry[]>>('/inquiries/my-inquiries', {
      params: { page, limit },
    });
    return {
      inquiries: res.data.data,
      meta: res.data.meta,
    };
  },

  async getReceivedInquiries(page = 1, limit = 20): Promise<{ inquiries: Inquiry[]; meta?: ApiResponse<Inquiry[]>['meta'] }> {
    const res = await apiClient.get<ApiResponse<Inquiry[]>>('/inquiries/received', {
      params: { page, limit },
    });
    return {
      inquiries: res.data.data,
      meta: res.data.meta,
    };
  },

  async getInquiry(id: string): Promise<Inquiry> {
    const res = await apiClient.get<ApiResponse<Inquiry>>(`/inquiries/${id}`);
    return res.data.data;
  },

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    const res = await apiClient.patch<ApiResponse<Inquiry>>(`/inquiries/${id}/status`, { status });
    return res.data.data;
  },
};

