// API Response Structure cho tất cả endpoints
export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data?: T;
  metadata?: string;
  timestamp: string;
  path?: string;
}

// Success Response
export interface ApiSuccessResponse<T = unknown> extends ApiResponse<T> {
  status: "success";
  statusCode: 200;
  data: T;
}

// Error Response
export interface ApiErrorResponse extends ApiResponse {
  status: "error";
  statusCode: 400 | 401 | 403 | 404 | 422 | 500;
  path: string;
}

// Specific Data Types
export interface UserData {
  user: User;
  message: string;
}

export interface MessageData {
  message: string;
}

// User interface
export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  status: string;
  role: "admin" | "user";
  lastLoginAt: string | null;
  loginCount: number;
  lastPasswordChangeAt: string | null;
  deletedAt: string | null;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// User Create DTO (FE -> BE)
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  token?: string;
  isVerified?: boolean;
}

// User Update DTO (FE -> BE)
export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  password?: string;
}

// User List Response
export interface UserListResponse {
  data: User[];
  message: string;
  metadata: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    filters: Record<string, unknown>;
  };
}

// User Profile Response
export interface UserProfileResponse {
  user: User;
  message: string;
}

// UserConfig types
export interface UserConfigPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacyLevel: 'public' | 'private' | 'friends';
  theme: 'light' | 'dark';
}

export interface UserConfigSocialLinks {
  [key: string]: string;
}

export interface UserConfig {
  id: number;
  userId: number;
  preferences: UserConfigPreferences;
  socialLinks: UserConfigSocialLinks;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  passwordResetToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserConfigUpdateDto {
  preferences?: Partial<UserConfigPreferences>;
  socialLinks?: UserConfigSocialLinks;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
}

export interface UserConfigResponse {
  config: UserConfig;
  message: string;
}
