import { get, post, put } from '@/domain/shared/request';
import type { PageResponse, PaginationParams } from '@/domain/shared/types';
import { Active } from '@/domain/shared/types';
import type { AdminUser, AdminUserCreateRequest } from './user';

export function getUsers(params: PaginationParams & { role?: string; status?: string }) {
  const query = new URLSearchParams();
  query.set('pageNum', String(params.pageNum));
  query.set('pageSize', String(params.pageSize));
  if (params.role) query.set('role', params.role);
  if (params.status) query.set('status', params.status);
  return get<PageResponse<AdminUser>>(`/api/v1/admin/users?${query}`);
}

export function getUser(id: number) {
  return get<AdminUser>(`/api/v1/admin/users/${id}`);
}

export function createUser(req: AdminUserCreateRequest) {
  return post<AdminUser>('/api/v1/admin/users', req);
}

export function updateUser(id: number, req: Partial<AdminUserCreateRequest>) {
  return put<AdminUser>(`/api/v1/admin/users/${id}`, req);
}

export function updateUserStatus(id: number, status: Active) {
  return put<null>(`/api/v1/admin/users/${id}/status`, { status });
}
