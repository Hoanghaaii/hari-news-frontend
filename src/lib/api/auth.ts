import api from "@/lib/axios";
import {
  ApiResponse,
  UserData,
  MessageData,
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordData,
  ResetPasswordData,
  User,
} from "@/lib/types/api";
import { extractData, isSuccessResponse } from "@/lib/utils/api-utils";

export const authApi = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<MessageData> => {
    console.log("🔍 Login API called with:", credentials);
    const response = await api.post<ApiResponse<MessageData>>(
      "/auth/login",
      credentials
    );
    console.log("🔍 Login API response:", response.data);

    // Tạm thời sử dụng flexible check để debug
    if (isSuccessResponse(response.data)) {
      console.log("🔍 Login API success with flexible check");
      if (response.data.data) {
        return response.data.data;
      }
    }

    const result = extractData(response.data);
    console.log("🔍 Login API extracted data:", result);
    return result;
  },

  // Đăng ký
  register: async (credentials: RegisterCredentials): Promise<MessageData> => {
    const response = await api.post<ApiResponse<MessageData>>(
      "/auth/register",
      credentials
    );
    return extractData(response.data);
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<UserData>>("/auth/me");
    const userData = extractData(response.data);
    return userData.user;
  },

  // Refresh token
  refreshToken: async (): Promise<MessageData> => {
    const response = await api.post<ApiResponse<MessageData>>("/auth/refresh");
    return extractData(response.data);
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordData): Promise<MessageData> => {
    const response = await api.post<ApiResponse<MessageData>>(
      "/auth/change-password",
      data
    );
    return extractData(response.data);
  },

  // Quên mật khẩu
  forgotPassword: async (email: string): Promise<MessageData> => {
    const response = await api.post<ApiResponse<MessageData>>(
      "/auth/forgot-password",
      {
        email,
      }
    );
    return extractData(response.data);
  },

  // Reset mật khẩu
  resetPassword: async (data: ResetPasswordData): Promise<MessageData> => {
    const response = await api.post<ApiResponse<MessageData>>(
      "/auth/reset-password",
      data
    );
    return extractData(response.data);
  },
};
