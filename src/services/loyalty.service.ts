import apiClient from "../config/appClient";

export type LoyaltyResponse = Record<string, unknown>;

export const loyaltyService = {
  getMyLoyalty: async (): Promise<LoyaltyResponse> => {
    return apiClient.get("/loyalty/me");
  },

  getCustomerLoyalty: async (customerId: string): Promise<LoyaltyResponse> => {
    return apiClient.get(`/loyalty/customers/${customerId}`);
  },
};
