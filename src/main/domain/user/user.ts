import { Active } from '@/domain/shared/types';

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: 'ADMIN' | 'CP';
  cpId: number | null;
  totpBound: boolean;
  lastLoginAt: string | null;
  status: Active;
  createdAt: number;
  updatedAt: number;
}

export interface AdminUserCreateRequest {
  username: string;
  name: string;
  role: 'ADMIN' | 'CP';
  cpId?: number;
}
