import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi } from '@/domain/auth/authService';
import type { LoginRequest } from '@/domain/auth/auth';

function parseRole(token: string): string {
  if (token.startsWith('mock-jwt-')) {
    const parts = token.split('-');
    return parts[2]?.toUpperCase() || '';
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || '';
  } catch {
    return '';
  }
}

interface AuthState {
  token: string | null;
  username: string;
  role: string;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: '',
      role: '',
      isLoading: false,

      login: async (req) => {
        set({ isLoading: true });
        try {
          const res = await loginApi(req);
          localStorage.setItem('token', res.accessToken);
          set({
            token: res.accessToken,
            username: req.username,
            role: parseRole(res.accessToken),
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, username: '', role: '' });
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token, username: state.username, role: state.role }),
    }
  )
);
