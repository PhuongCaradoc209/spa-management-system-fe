import apiClient from "../config/appClient";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type RefreshTokenRequest = {
  refreshToken?: string;
};

export type AuthResponse = Record<string, unknown>;
export type AuthEmptyResponse = Record<string, unknown> | null;

export const authService = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post("/auth/login", payload);
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post("/auth/register", payload);
  },

  refresh: async (payload?: RefreshTokenRequest): Promise<AuthResponse> => {
    return apiClient.post("/auth/refresh", payload);
  },

  logout: async (payload?: RefreshTokenRequest): Promise<AuthEmptyResponse> => {
    return apiClient.post("/auth/logout", payload);
  },

  logoutAll: async (): Promise<AuthEmptyResponse> => {
    return apiClient.post("/auth/logout-all");
  },
};
