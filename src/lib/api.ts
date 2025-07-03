import api from './axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Định nghĩa type cho response chuẩn
export interface ApiResponse<T = undefined> {
  status?: string;
  statusCode: number;
  message: string;
  data?: T;
  metadata?: unknown;
  timestamp?: string;
  path?: string;
}

// Định nghĩa type cho lỗi trả về từ backend
export interface ApiError {
  statusCode: number;
  message: string;
  path?: string;
  timestamp?: string;
}

// Hàm unwrap response
function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
  // Luôn trả về toàn bộ response.data để có cả message và data cùng cấp
  return response.data;
}

// Hàm xử lý lỗi
function handleApiError(error: unknown): never {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: unknown }).response &&
    typeof (error as { response: unknown }).response === 'object' &&
    (error as { response: { data?: unknown } }).response &&
    'data' in (error as { response: { data?: unknown } }).response
  ) {
    const err = (error as { response: { data: ApiError } }).response.data;
    throw err;
  }
  throw error;
}

// Hàm GET
export async function apiGet<T = undefined>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.get<ApiResponse<T>>(url, config);
    return unwrapResponse<T>(response);
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// Hàm POST
export async function apiPost<T = undefined, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.post<ApiResponse<T>>(url, body, config);
    return unwrapResponse<T>(response);
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// Hàm PUT
export async function apiPut<T = undefined, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.put<ApiResponse<T>>(url, body, config);
    return unwrapResponse<T>(response);
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// Hàm DELETE
export async function apiDelete<T = undefined>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return unwrapResponse<T>(response);
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// Hàm PATCH
export async function apiPatch<T = undefined, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.patch<ApiResponse<T>>(url, body, config);
    return unwrapResponse<T>(response);
  } catch (error: unknown) {
    handleApiError(error);
  }
} 