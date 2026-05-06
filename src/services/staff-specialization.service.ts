import apiClient from "../config/appClient";

export type StaffSpecializationItem = {
  serviceId: string;
  name: string;
  price: string;
};

export type AddStaffSpecializationRequest = {
  serviceId: string;
};

export type StaffSpecializationListResponse = StaffSpecializationItem[];

export const staffSpecializationService = {
  listSpecializations: async (
    staffId: string,
  ): Promise<StaffSpecializationListResponse> => {
    return apiClient.get(`/staff/${staffId}/specializations`);
  },

  addSpecialization: async (
    staffId: string,
    payload: AddStaffSpecializationRequest,
  ): Promise<StaffSpecializationItem> => {
    return apiClient.post(`/staff/${staffId}/specializations`, payload);
  },

  removeSpecialization: async (
    staffId: string,
    serviceId: string,
  ): Promise<void> => {
    return apiClient.delete(`/staff/${staffId}/specializations/${serviceId}`);
  },
};
