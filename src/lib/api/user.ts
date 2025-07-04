import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
  UserProfileResponse,
  MessageData,
  UserConfig,
  UserConfigUpdateDto,
  UserConfigResponse,
} from "@/lib/types/api";

export const userApi = {
  // Tạo user mới
  createUser: async (data: CreateUserDto): Promise<User> => {
    const res = await apiPost<User, CreateUserDto>("/user", data);
    if (!res.data) throw new Error(res.message || "Tạo user thất bại");
    return res.data;
  },

  // Lấy danh sách user (có phân trang, filter)
  getUsers: async (params?: { page?: number; pageSize?: number; [key: string]: unknown }): Promise<UserListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) query.append(k, String(v));
      });
    }
    const res = await apiGet<UserListResponse>(`/user?${query.toString()}`);
    if (!res.data) throw new Error(res.message || "Không lấy được danh sách user");
    return res.data;
  },

  // Lấy profile user hiện tại
  getProfile: async (): Promise<UserProfileResponse> => {
    const res = await apiGet<UserProfileResponse>("/user/profile");
    if (!res.data) throw new Error(res.message || "Không lấy được profile");
    return res.data;
  },

  // Lấy user theo id
  getUserById: async (id: number | string): Promise<User> => {
    const res = await apiGet<User>(`/user/${id}`);
    if (!res.data) throw new Error(res.message || "Không tìm thấy user");
    return res.data;
  },

  // Update profile của chính mình
  updateProfile: async (data: UpdateUserDto): Promise<User> => {
    const res = await apiPatch<User, UpdateUserDto>(`/user/profile`, data);
    if (!res.data) throw new Error(res.message || "Cập nhật profile thất bại");
    return res.data;
  },

  // Xóa user
  deleteUser: async (id: number | string): Promise<MessageData> => {
    return apiDelete<MessageData>(`/user/${id}`);
  },

  // Update user (cho admin/superadmin)
  updateUser: async (id: number | string, data: UpdateUserDto): Promise<User> => {
    const res = await apiPatch<User, UpdateUserDto>(`/user/${id}`, data);
    if (!res.data) throw new Error(res.message || "Cập nhật user thất bại");
    return res.data;
  },
};

// UserConfig APIs
export const userConfigApi = {
  // Lấy config của chính mình
  getMyConfig: async (): Promise<UserConfigResponse> => {
    const res = await apiGet<UserConfigResponse>("/user/config/self");
    if (!res.data) throw new Error(res.message || "Không lấy được config user");
    return res.data;
  },
  // Tạo config cho chính mình
  createMyConfig: async (): Promise<UserConfigResponse> => {
    const res = await apiPost<UserConfigResponse>("/user/config/self", {});
    if (!res.data) throw new Error(res.message || "Không tạo được config user");
    return res.data;
  },
  // Update config của chính mình
  updateMyConfig: async (data: UserConfigUpdateDto): Promise<UserConfigResponse> => {
    const res = await apiPatch<UserConfigResponse, UserConfigUpdateDto>("/user/config/self", data);
    if (!res.data) throw new Error(res.message || "Cập nhật config user thất bại");
    return res.data;
  },
  // Xóa config của chính mình
  deleteMyConfig: async (): Promise<boolean> => {
    const res = await apiDelete<{ deleted: boolean }>("/user/config/self");
    return !!res.data?.deleted;
  },
  // Lấy config theo userId (admin)
  getUserConfigById: async (userId: number): Promise<UserConfigResponse> => {
    const res = await apiGet<UserConfigResponse>(`/user/config/${userId}`);
    if (!res.data) throw new Error(res.message || "Không lấy được config user");
    return res.data;
  },
  // Tạo config cho user hiện tại
  createUserConfig: async (): Promise<UserConfigResponse> => {
    const res = await apiPost<UserConfigResponse>("/user/config", {});
    if (!res.data) throw new Error(res.message || "Không tạo được config user");
    return res.data;
  },
  // Update toàn bộ config
  updateUserConfig: async (data: UserConfigUpdateDto): Promise<UserConfigResponse> => {
    const res = await apiPatch<UserConfigResponse, UserConfigUpdateDto>("/user/config", data);
    if (!res.data) throw new Error(res.message || "Cập nhật config user thất bại");
    return res.data;
  },
  // Update preferences
  updatePreferences: async (preferences: Partial<UserConfig["preferences"]>): Promise<UserConfigResponse> => {
    const res = await apiPatch<UserConfigResponse, { preferences: Partial<UserConfig["preferences"]> }>("/user/config/preferences", { preferences });
    if (!res.data) throw new Error(res.message || "Cập nhật preferences thất bại");
    return res.data;
  },
  // Update socialLinks
  updateSocialLinks: async (socialLinks: UserConfig["socialLinks"]): Promise<UserConfigResponse> => {
    const res = await apiPatch<UserConfigResponse, { socialLinks: UserConfig["socialLinks"] }>("/user/config/social-links", { socialLinks });
    if (!res.data) throw new Error(res.message || "Cập nhật socialLinks thất bại");
    return res.data;
  },
  // Enable 2FA
  enableTwoFactor: async (secret: string): Promise<UserConfigResponse> => {
    const res = await apiPatch<UserConfigResponse, { secret: string }>("/user/config/2fa/enable", { secret });
    if (!res.data) throw new Error(res.message || "Bật 2FA thất bại");
    return res.data;
  },
  // Disable 2FA
  disableTwoFactor: async (): Promise<UserConfigResponse> => {
    const res = await apiPatch<UserConfigResponse>("/user/config/2fa/disable", {});
    if (!res.data) throw new Error(res.message || "Tắt 2FA thất bại");
    return res.data;
  },
  // Lấy tất cả config (admin)
  getAllUserConfigs: async (): Promise<UserConfig[]> => {
    const res = await apiGet<UserConfig[]>("/user/config/all");
    if (!res.data) throw new Error(res.message || "Không lấy được danh sách config");
    return res.data;
  },
  // Tìm config theo reset token
  findByResetToken: async (token: string): Promise<UserConfigResponse> => {
    const res = await apiGet<UserConfigResponse>(`/user/config/reset-token/${token}`);
    if (!res.data) throw new Error(res.message || "Không tìm thấy config theo token");
    return res.data;
  },
}; 