'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useAuth } from '@/lib/hooks/use-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const { refreshToken } = useAuth();

  useEffect(() => {
    // Nếu user đã đăng nhập nhưng không có thông tin user, thử refresh token
    if (isAuthenticated && !user) {
      refreshToken();
    }
  }, [isAuthenticated, user, refreshToken]);

  return <>{children}</>;
} 