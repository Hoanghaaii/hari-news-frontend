import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (data: { user: User | null; message?: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (data) => {
        set({
          user: data.user,
          isAuthenticated: true,
        });
        // Tokens sẽ được lưu trong httpOnly cookies bởi backend
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        // Tokens sẽ được xóa bởi backend khi gọi logout API
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 