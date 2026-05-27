import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi } from '@/domain/auth/authService';
import type { LoginRequest } from '@/domain/auth/auth';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  errorMsg: string;
  login: (req: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: false,
      errorMsg: '',

      login: async (req) => {
        set({ isLoading: true, errorMsg: '' });
        try {
          const res = await loginApi(req);
          localStorage.setItem('token', res.accessToken);
          set({ token: res.accessToken, isLoading: false, errorMsg: '' });
        } catch (err: unknown) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          set({ isLoading: false, errorMsg: axiosErr?.response?.data?.message || '登录失败' });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null });
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
