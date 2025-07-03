import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
  UserProfileResponse,
  MessageData,
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

  // Update user
  updateUser: async (id: number | string, data: UpdateUserDto): Promise<User> => {
    const res = await apiPatch<User, UpdateUserDto>(`/user/${id}`, data);
    if (!res.data) throw new Error(res.message || "Cập nhật user thất bại");
    return res.data;
  },

  // Xóa user
  deleteUser: async (id: number | string): Promise<MessageData> => {
    return apiDelete<MessageData>(`/user/${id}`);
  },
}; 