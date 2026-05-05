import apiClient from '../config/appClient';

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export const authService = {
  login: async (loginData: LoginData) => {
    const response = await apiClient.post('/auth/login', loginData);
    return response;
  },
  register: async (registerData: RegisterData) => {
    const response = await apiClient.post('/auth/register', registerData);
    return response;
  },
};
