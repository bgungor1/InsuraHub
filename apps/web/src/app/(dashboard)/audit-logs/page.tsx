'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { queryKeys } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  useAuditLogsQuery,
  AuditLogsTable,
  AuditLogDetailDialog,
  AuditLogFilterBar,
  type AuditLog,
  type AuditLogFilters,
} from '@/features/audit-logs';

export default function AuditLogsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState<AuditLogFilters>({});
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const { data, isLoading, isError, refetch } = useAuditLogsQuery(filters);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
  };

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
            <ShieldAlert className="size-6 text-primary" />
            Sistem Denetim İzi (Audit Log)
          </h2>
          <p className="text-sm text-muted-foreground">
            Sistem üzerinde gerçekleşen tüm kritik veri değişiklikleri ve kullanıcı eylemleri.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="size-4" />
          Yenile
        </Button>
      </div>

      <AuditLogFilterBar filters={filters} onChange={setFilters} />

      {isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">Denetim kayıtları yüklenemedi.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tekrar Dene
          </Button>
        </div>
      ) : (
        <AuditLogsTable
          logs={data?.items || []}
          isLoading={isLoading}
          onViewDetail={handleViewDetail}
        />
      )}

      <AuditLogDetailDialog
        log={selectedLog}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
