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

  updateSpecializations: async (
    staffId: string,
    payload: { serviceIds: string[] },
  ): Promise<void> => {
    // 1. Fetch current specializations
    const currentSpecs = await staffSpecializationService.listSpecializations(staffId);
    const currentIds = Array.isArray(currentSpecs) ? currentSpecs.map((s) => s.serviceId) : [];
    
    // 2. Calculate diff
    const toAdd = payload.serviceIds.filter((id) => !currentIds.includes(id));
    const toRemove = currentIds.filter((id) => !payload.serviceIds.includes(id));
    
    // 3. Execute concurrently
    await Promise.all([
      ...toAdd.map((serviceId) => staffSpecializationService.addSpecialization(staffId, { serviceId })),
      ...toRemove.map((serviceId) => staffSpecializationService.removeSpecialization(staffId, serviceId))
    ]);
  },
};
