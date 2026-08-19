/**
 * Centralized Query Key Factory for TanStack Query
 * Prevents typos, guarantees type safety, and enables deterministic cache invalidations
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  policies: {
    all: ['policies'] as const,
    lists: () => [...queryKeys.policies.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.policies.lists(), filters] as const,
    details: () => [...queryKeys.policies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.policies.details(), id] as const,
    assignments: (id: string) => [...queryKeys.policies.detail(id), 'assignments'] as const,
  },
  commissions: {
    all: ['commissions'] as const,
    rules: () => [...queryKeys.commissions.all, 'rules'] as const,
    snapshots: (policyId?: string) => [...queryKeys.commissions.all, 'snapshots', policyId] as const,
  },
  tickets: {
    all: ['tickets'] as const,
    lists: () => [...queryKeys.tickets.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.tickets.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.tickets.all, 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
  },
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.companies.lists(), filters] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.companies.details(), id] as const,
  },
  agencies: {
    all: ['agencies'] as const,
    lists: () => [...queryKeys.agencies.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.agencies.lists(), filters] as const,
    details: () => [...queryKeys.agencies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.agencies.details(), id] as const,
  },
  branches: {
    all: ['branches'] as const,
    lists: () => [...queryKeys.branches.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.branches.lists(), filters] as const,
    details: () => [...queryKeys.branches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.branches.details(), id] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
    lookup: (identityNo: string) => [...queryKeys.customers.all, 'lookup', identityNo] as const,
  },
} as const;
