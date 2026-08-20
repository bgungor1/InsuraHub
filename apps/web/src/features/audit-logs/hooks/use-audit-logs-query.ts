import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { auditLogsService } from '../services/audit-logs.service';
import type { AuditLogFilters } from '../types/audit-log.types';

export function useAuditLogsQuery(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(filters),
    queryFn: () => auditLogsService.getLogs(filters),
  });
}
