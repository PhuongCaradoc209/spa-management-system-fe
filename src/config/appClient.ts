import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Xử lý lỗi hệ thống tập trung (ví dụ: Logout khi hết hạn token)
apiClient.interceptors.response.use(
  (response) => response.data, // Chỉ trả về data để code ở tầng trên gọn hơn
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Logic Logout hoặc Refresh Token ở đây
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  },
);

export default apiClient;