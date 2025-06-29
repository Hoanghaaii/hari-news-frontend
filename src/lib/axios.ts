import axios from "axios";

// Tạo instance axios với cấu hình cơ bản
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Bật credentials để gửi cookies
  withCredentials: true,
});

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Không redirect tự động, để component xử lý
      console.log("Unauthorized - Token expired or invalid");
    }

    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
