import { Active } from '@/domain/shared/types';
import { createCrudHandlers } from '../utils/factory';

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: 'Admin',
    role: 'ADMIN' as const,
    cpId: null,
    totpBound: false,
    lastLoginAt: '2026-05-27T15:30:00',
    status: Active.ENABLED,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    username: 'operator',
    name: 'Operator',
    role: 'CP' as const,
    cpId: 1,
    totpBound: true,
    lastLoginAt: '2026-05-26T10:00:00',
    status: Active.ENABLED,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const userHandlers = createCrudHandlers('/api/v1/admin/users', mockUsers);
