import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { MessageData } from '@/lib/types/api';
import { toast } from 'sonner';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth, setUser, logout: logoutStore, isAuthenticated, user } = useAuthStore();

  // Query để lấy thông tin user hiện tại
  const { data: currentUser, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: (failureCount, error) => {
      // Nếu lỗi 401, thử refresh token trước khi retry
      if (error && typeof error === 'object' && 'status' in error) {
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
    if (userError && typeof userError === 'object' && 'status' in userError) {
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
      console.log('🔍 Login success data:', data);
      // Chỉ set isAuthenticated = true, React Query sẽ tự động gọi /auth/me
      setAuth({ user: null, message: data.message });
      console.log('🔍 Auth state set, redirecting...');
      toast.success('Đăng nhập thành công!');
      // Redirect sau khi login thành công
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      console.log('🔍 Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại!';
      toast.error(errorMessage);
    },
  });

  // Mutation đăng ký
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: MessageData) => {
      // Chỉ set isAuthenticated = true, React Query sẽ tự động gọi /auth/me
      setAuth({ user: null, message: data.message });
      toast.success('Đăng ký thành công!');
      // Redirect sau khi register thành công
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại!';
      toast.error(errorMessage);
    },
  });

  // Mutation đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success('Đăng xuất thành công!');
      // Redirect về trang chủ sau khi logout
      router.push('/');
    },
    onError: (error: unknown) => {
      // Vẫn logout ở client side ngay cả khi API fail
      logoutStore();
      queryClient.clear();
      const errorMessage = error instanceof Error ? error.message : 'Đăng xuất thất bại!';
      toast.error(errorMessage);
      // Redirect về trang chủ
      router.push('/');
    },
  });

  // Mutation refresh token
  const refreshTokenMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: () => {
      // Sau khi refresh thành công, refetch /me query
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: () => {
      // Nếu refresh token fail, logout user
      logoutStore();
      queryClient.clear();
      router.push('/login');
    },
  });

  // Mutation đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data: MessageData) => {
      toast.success(data.message || 'Đổi mật khẩu thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Đổi mật khẩu thất bại!';
      toast.error(errorMessage);
    },
  });

  // Mutation quên mật khẩu
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data: MessageData) => {
      toast.success(data.message || 'Email đặt lại mật khẩu đã được gửi!');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Gửi email thất bại!';
      toast.error(errorMessage);
    },
  });

  // Mutation reset mật khẩu
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data: MessageData) => {
      toast.success(data.message || 'Đặt lại mật khẩu thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại!';
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