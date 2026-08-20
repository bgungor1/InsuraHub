'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { AuditLog } from '../types/audit-log.types';
import { getAuditLogColumnDefs } from './audit-log-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading?: boolean;
  onViewDetail: (log: AuditLog) => void;
}

export function AuditLogsTable({
  logs,
  isLoading,
  onViewDetail,
}: AuditLogsTableProps) {
  const columnDefs = React.useMemo<ColDef<AuditLog>[]>(
    () => getAuditLogColumnDefs(onViewDetail),
    [onViewDetail],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ sortable: true, resizable: true }),
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card p-6">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-[620px] w-full rounded-xl border border-border/60 shadow-xs overflow-hidden bg-card">
      <AgGridReact<AuditLog>
        rowData={logs}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={56}
        headerHeight={44}
        pagination={true}
        paginationPageSize={20}
        domLayout="normal"
      />
    </div>
  );
}
