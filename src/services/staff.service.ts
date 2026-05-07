import apiClient from "../config/appClient";
import { BooleanString } from "../constant/enum/boolean.enum";

export type StaffListQuery = {
  includeUnavailable?: BooleanString;
};

export type StaffListResponse = Record<string, unknown>;

export const staffService = {
  listStaff: async (params?: StaffListQuery): Promise<StaffListResponse> => {
    return apiClient.get("/staff", { params });
  },
};
