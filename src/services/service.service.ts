import apiClient from "../config/appClient";
import { BooleanString } from "../constant/enum/boolean.enum";

export type ServiceListQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  q?: string;
  includeInactive?: BooleanString;
};

export type CreateServiceRequest = {
  categoryId: string;
  name: string;
  durationMin: number;
  price: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type UpdateServiceRequest = {
  categoryId?: string;
  name?: string;
  description?: string | null;
  durationMin?: number;
  price?: string;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type ServiceResponse = Record<string, unknown>;
export type ServiceListResponse = Record<string, unknown>;

export const serviceService = {
  listServices: async (
    params?: ServiceListQuery,
  ): Promise<ServiceListResponse> => {
    return apiClient.get("/services", { params });
  },

  createService: async (
    payload: CreateServiceRequest,
  ): Promise<ServiceResponse> => {
    return apiClient.post("/services", payload);
  },

  getServiceDetail: async (
    id: string,
    params?: { includeInactive?: BooleanString },
  ): Promise<ServiceResponse> => {
    return apiClient.get(`/services/${id}`, { params });
  },

  updateService: async (
    id: string,
    payload: UpdateServiceRequest,
  ): Promise<ServiceResponse> => {
    return apiClient.patch(`/services/${id}`, payload);
  },

  deleteService: async (id: string): Promise<void> => {
    return apiClient.delete(`/services/${id}`);
  },
};
