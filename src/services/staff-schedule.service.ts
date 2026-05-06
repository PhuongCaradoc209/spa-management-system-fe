import apiClient from "../config/appClient";

export type CreateStaffScheduleRequest = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay?: boolean;
};

export type UpdateStaffScheduleRequest = {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isWorkingDay?: boolean;
};

export type StaffAvailabilityQuery = {
  date: string;
};

export type StaffScheduleResponse = Record<string, unknown>;
export type StaffScheduleListResponse = Record<string, unknown>;
export type StaffAvailabilityResponse = Record<string, unknown>;

export const staffScheduleService = {
  listSchedules: async (
    staffId: string,
  ): Promise<StaffScheduleListResponse> => {
    return apiClient.get(`/staff/${staffId}/schedules`);
  },

  createSchedule: async (
    staffId: string,
    payload: CreateStaffScheduleRequest,
  ): Promise<StaffScheduleResponse> => {
    return apiClient.post(`/staff/${staffId}/schedules`, payload);
  },

  updateSchedule: async (
    staffId: string,
    scheduleId: string,
    payload: UpdateStaffScheduleRequest,
  ): Promise<StaffScheduleResponse> => {
    return apiClient.patch(
      `/staff/${staffId}/schedules/${scheduleId}`,
      payload,
    );
  },

  deleteSchedule: async (
    staffId: string,
    scheduleId: string,
  ): Promise<void> => {
    return apiClient.delete(`/staff/${staffId}/schedules/${scheduleId}`);
  },

  getAvailability: async (
    staffId: string,
    params: StaffAvailabilityQuery,
  ): Promise<StaffAvailabilityResponse> => {
    return apiClient.get(`/staff/${staffId}/availability`, { params });
  },
};
