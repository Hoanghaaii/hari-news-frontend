import { apiGet, apiPost } from "@/lib/api";
import {
  UserData,
  MessageData,
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordData,
  ResetPasswordData,
  User,
} from "@/lib/types/api";

export const authApi = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<MessageData> => {
    return apiPost<MessageData, LoginCredentials>("/auth/login", credentials);
  },

  // Đăng ký
  register: async (credentials: RegisterCredentials): Promise<MessageData> => {
    return apiPost<MessageData, RegisterCredentials>(
      "/auth/register",
      credentials
    );
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await apiPost<undefined, undefined>("/auth/logout");
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<User> => {
    const res = await apiGet<UserData>("/auth/me");
    if (!res.data?.user) throw new Error(res.message || "Không tìm thấy thông tin người dùng");
    return res.data.user;
  },

  // Refresh token
  refreshToken: async (): Promise<MessageData> => {
    return apiPost<MessageData>("/auth/refresh");
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordData): Promise<MessageData> => {
    return apiPost<MessageData, ChangePasswordData>(
      "/auth/change-password",
      data
    );
  },

  // Quên mật khẩu
  forgotPassword: async (email: string): Promise<MessageData> => {
    return apiPost<MessageData, { email: string }>("/auth/forgot-password", {
      email,
    });
  },

  // Reset mật khẩu
  resetPassword: async (data: ResetPasswordData): Promise<MessageData> => {
    return apiPost<MessageData, ResetPasswordData>(
      "/auth/reset-password",
      data
    );
  },

  // Gửi email xác minh
  sendEmailVerification: async (email: string): Promise<MessageData> => {
    return apiPost<MessageData, { email: string }>(
      "/auth/send-email-verification",
      { email }
    );
  },

  // Set cookie từ FE (sau khi nhận token từ OAuth)
  setCookie: async (tokens: { accessToken: string; refreshToken: string }): Promise<MessageData> => {
    return apiPost<MessageData, { accessToken: string; refreshToken: string }>(
      "/auth/set-cookie",
      tokens
    );
  },
};
