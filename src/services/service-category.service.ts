import apiClient from "../config/appClient";
import { BooleanString } from "../constant/enum/boolean.enum";

export type ServiceCategoryListQuery = {
  includeInactive?: BooleanString;
};

export type CreateServiceCategoryRequest = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateServiceCategoryRequest = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type ServiceCategoryResponse = Record<string, unknown>;
export type ServiceCategoryListResponse = Record<string, unknown>;

export const serviceCategoryService = {
  listCategories: async (
    params?: ServiceCategoryListQuery,
  ): Promise<ServiceCategoryListResponse> => {
    return apiClient.get("/service-categories", { params });
  },

  createCategory: async (
    payload: CreateServiceCategoryRequest,
  ): Promise<ServiceCategoryResponse> => {
    return apiClient.post("/service-categories", payload);
  },

  getCategoryDetail: async (
    id: string,
    params?: ServiceCategoryListQuery,
  ): Promise<ServiceCategoryResponse> => {
    return apiClient.get(`/service-categories/${id}`, { params });
  },

  updateCategory: async (
    id: string,
    payload: UpdateServiceCategoryRequest,
  ): Promise<ServiceCategoryResponse> => {
    return apiClient.patch(`/service-categories/${id}`, payload);
  },

  deleteCategory: async (id: string): Promise<void> => {
    return apiClient.delete(`/service-categories/${id}`);
  },
};
