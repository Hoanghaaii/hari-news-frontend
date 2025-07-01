import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { authApi } from "@/lib/api/auth";
import { MessageData } from "@/lib/types/api";
import { toast } from "sonner";

// Hàm extractErrorMessage lấy message từ error chuẩn hóa của util API
function extractErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Đã có lỗi xảy ra";
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    setAuth,
    setUser,
    logout: logoutStore,
    isAuthenticated,
    user,
  } = useAuthStore();

  // Query để lấy thông tin user hiện tại
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: (failureCount, error) => {
      // Nếu lỗi 401, thử refresh token trước khi retry
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;
        if (status === 401 && failureCount === 0) {
          // Thử refresh token trước khi retry
          return true;
        }
      }
      return failureCount < 2;
    },
  });

  // Cập nhật user info khi React Query fetch thành công
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      setUser(currentUser);
    }
  }, [currentUser, isAuthenticated, setUser]);

  // Xử lý lỗi 401 từ /me query
  useEffect(() => {
    if (userError && typeof userError === "object" && "status" in userError) {
      const status = (userError as { status: number }).status;
      if (status === 401) {
        // Thử refresh token khi /me trả về 401
        refreshTokenMutation.mutate();
      }
    }
  }, [userError]);

  // Mutation đăng nhập
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: MessageData) => {
      setAuth({ user: null, message: data.message });
      toast.success(data.message);
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  // Mutation đăng ký
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: MessageData) => {
      toast.success(data.message);
      router.push("/login");
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  // Mutation đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("Đăng xuất thành công!");
      router.push("/");
    },
    onError: (error: unknown) => {
      logoutStore();
      queryClient.clear();
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      router.push("/");
    },
  });

  // Mutation refresh token
  const refreshTokenMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: () => {
      // Sau khi refresh thành công, refetch /me query
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: () => {
      // Nếu refresh token fail, logout user
      logoutStore();
      queryClient.clear();
      router.push("/login");
    },
  });

  // Mutation đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data: MessageData) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  // Mutation quên mật khẩu
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data: MessageData) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  // Mutation reset mật khẩu
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data: MessageData) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  // Mutation gửi mã xác minh email
  const sendEmailVerification = useMutation({
    mutationFn: authApi.sendEmailVerification,
    onSuccess: (data: MessageData, email, context) => {
      toast.success(data.message);
      if (context && typeof context === 'object' && 'onSuccess' in context && typeof context.onSuccess === 'function') {
        context.onSuccess();
      }
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return {
    // State
    user: currentUser || user,
    isAuthenticated,
    isLoadingUser,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    sendEmailVerification,

    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRefreshLoading: refreshTokenMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };
};
