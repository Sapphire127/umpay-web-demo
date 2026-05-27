import { post } from '@/domain/shared/request';
import type { LoginRequest } from './auth';

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export function login(req: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>('/api/v1/admin/auth/login', req);
}
