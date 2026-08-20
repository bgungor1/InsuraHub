import { api } from '@/lib/api/client';
import type { AuditLogsResponse, AuditLogFilters } from '../types/audit-log.types';

export const auditLogsService = {
  getLogs: async (params?: AuditLogFilters): Promise<AuditLogsResponse> => {
    return api.get<AuditLogsResponse>('/audit-logs', { params });
  },
};
