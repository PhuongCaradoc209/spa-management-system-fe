import apiClient from "../config/appClient";
import { UserRole } from "../constant/enum/user.enum";

export type UpdateMyProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  notes?: string;
  bio?: string;
  isAvailable?: boolean;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  isAvailable?: boolean;
};

export type UpdateUserRequest = {
  role?: UserRole;
  isActive?: boolean;
};

export type UserResponse = Record<string, unknown>;
export type UsersListResponse = Record<string, unknown>;

export const userService = {
  getMe: async (): Promise<UserResponse> => {
    return apiClient.get("/users/me");
  },

  updateMyProfile: async (
    payload: UpdateMyProfileRequest,
  ): Promise<UserResponse> => {
    return apiClient.patch("/users/me/profile", payload);
  },

  listUsers: async (): Promise<UsersListResponse> => {
    return apiClient.get("/users");
  },

  createUser: async (payload: CreateUserRequest): Promise<UserResponse> => {
    return apiClient.post("/users", payload);
  },

  updateUser: async (
    userId: string,
    payload: UpdateUserRequest,
  ): Promise<UserResponse> => {
    return apiClient.patch(`/users/${userId}`, payload);
  },

  getUserById: async (userId: string): Promise<UserResponse> => {
    return apiClient.get(`/users/${userId}`);
  },

  deleteUser: async (userId: string): Promise<void> => {
    return apiClient.delete(`/users/${userId}`);
  },
};
