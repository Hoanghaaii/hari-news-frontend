import {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@/lib/types/api";

// Type guard để kiểm tra response thành công
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  const isSuccess = response.status === "success";
  return isSuccess;
}

// Type guard để kiểm tra response lỗi
export function isErrorResponse(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.status === "error" || response.statusCode >= 400;
}

// Extract data từ success response
export function extractData<T>(response: ApiResponse<T>): T {
  console.log("🔍 extractData called with:", response);
  if (isSuccessResponse(response)) {
    console.log("🔍 extractData success, returning:", response.data);
    return response.data;
  }
  console.log("🔍 extractData error, throwing:", response.message);
  throw new Error(response.message || "Unknown error");
}

// Extract message từ response
export function extractMessage(response: ApiResponse): string {
  return response.message || "Unknown message";
}

// Tạo error object từ API response
export function createApiError(response: ApiErrorResponse): Error {
  return new Error(response.message);
}

// Wrapper function để xử lý API calls
export async function apiCall<T, R = T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: R) => void;
    onError?: (error: Error) => void;
    transformData?: (data: T) => R;
  }
): Promise<R> {
  try {
    const response = await apiFunction();

    if (isSuccessResponse(response)) {
      const data = options?.transformData
        ? options.transformData(response.data)
        : (response.data as unknown as R);
      options?.onSuccess?.(data);
      return data;
    } else {
      const error = createApiError(response as ApiErrorResponse);
      options?.onError?.(error);
      throw error;
    }
  } catch (error) {
    const apiError =
      error instanceof Error ? error : new Error("Unknown error");
    options?.onError?.(apiError);
    throw apiError;
  }
}
