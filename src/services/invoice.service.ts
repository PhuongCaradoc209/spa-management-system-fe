import apiClient from "../config/appClient";
import { InvoiceStatus, PaymentMethod } from "../constant/enum/invoice.enum";

export type InvoiceListQuery = {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  appointmentId?: string;
};

export type CreateCheckoutSessionRequest = {
  successUrl?: string;
  cancelUrl?: string;
};

export type MarkInvoicePaidRequest = {
  amount: number;
  paymentMethod?: PaymentMethod;
  note?: string | null;
};

export type InvoiceResponse = Record<string, unknown>;
export type InvoiceListResponse = Record<string, unknown>;
export type CheckoutSessionResponse = {
  url?: string;
  sessionId?: string;
} & Record<string, unknown>;

export const invoiceService = {
  listInvoices: async (
    params?: InvoiceListQuery,
  ): Promise<InvoiceListResponse> => {
    return apiClient.get("/invoices", { params });
  },

  getInvoiceDetail: async (id: string): Promise<InvoiceResponse> => {
    return apiClient.get(`/invoices/${id}`);
  },

  createCheckoutSession: async (
    id: string,
    payload?: CreateCheckoutSessionRequest,
  ): Promise<CheckoutSessionResponse> => {
    return apiClient.post(`/invoices/${id}/checkout-session`, payload);
  },

  markInvoicePaid: async (
    id: string,
    payload: MarkInvoicePaidRequest,
  ): Promise<InvoiceResponse> => {
    return apiClient.patch(`/invoices/${id}/mark-paid`, payload);
  },
};
