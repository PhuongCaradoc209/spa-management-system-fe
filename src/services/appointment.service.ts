import apiClient from "../config/appClient";
import { AppointmentStatus } from "../constant/enum/appointment.enum";

export type CreateAppointmentRequest = {
  staffId: string;
  scheduledAt: string;
  serviceIds: string[];
  notes?: string | null;
};

export type AppointmentListQuery = {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  date?: string;
  staffId?: string;
  customerId?: string;
};

export type UpdateAppointmentStatusRequest = {
  status: AppointmentStatus;
};

export type CancelAppointmentRequest = {
  reason?: string | null;
};

export type AppointmentResponse = Record<string, unknown>;
export type AppointmentListResponse = Record<string, unknown>;
export type AppointmentInvoiceResponse = Record<string, unknown>;

export const appointmentService = {
  createAppointment: async (
    payload: CreateAppointmentRequest,
  ): Promise<AppointmentResponse> => {
    return apiClient.post("/appointments", payload);
  },

  listAppointments: async (
    params?: AppointmentListQuery,
  ): Promise<AppointmentListResponse> => {
    return apiClient.get("/appointments", { params });
  },

  getAppointmentDetail: async (id: string): Promise<AppointmentResponse> => {
    return apiClient.get(`/appointments/${id}`);
  },

  updateAppointmentStatus: async (
    id: string,
    payload: UpdateAppointmentStatusRequest,
  ): Promise<AppointmentResponse> => {
    return apiClient.patch(`/appointments/${id}/status`, payload);
  },

  cancelAppointment: async (
    id: string,
    payload: CancelAppointmentRequest,
  ): Promise<AppointmentResponse> => {
    return apiClient.patch(`/appointments/${id}/cancel`, payload);
  },

  generateAppointmentInvoice: async (
    id: string,
  ): Promise<AppointmentInvoiceResponse> => {
    return apiClient.post(`/appointments/${id}/invoice`);
  },
};
