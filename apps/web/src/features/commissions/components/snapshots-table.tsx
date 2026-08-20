'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useCommissionSnapshotsQuery } from '../hooks/use-commissions-query';
import type { CommissionSnapshot } from '../types/commission.types';
import { getSnapshotColumnDefs } from './snapshot-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

export function SnapshotsTable() {
  const { data, isLoading, isError, refetch } = useCommissionSnapshotsQuery();
  const user = useAuthStore((state) => state.user);

  const columnDefs = React.useMemo<ColDef<CommissionSnapshot>[]>(
    () => getSnapshotColumnDefs(user),
    [user],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ sortable: true, resizable: true, filter: true }),
    [],
  );

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Komisyon dekontları yüklenemedi.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="ag-theme-quartz h-[520px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <AgGridReact<CommissionSnapshot>
        rowData={data?.items ?? []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        loading={isLoading}
        pagination={true}
        paginationPageSize={20}
        domLayout="normal"
      />
    </div>
  );
}
