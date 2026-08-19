'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommissionRulesQuery } from '../hooks/use-commissions-query';
import type { CommissionRule } from '../types/commission.types';

export function RulesTable() {
  const { data, isLoading, isError, refetch } = useCommissionRulesQuery();

  const columnDefs = React.useMemo<ColDef<CommissionRule>[]>(
    () => [
      { field: 'name', headerName: 'Kural Adı', flex: 2, minWidth: 180 },
      {
        field: 'companyShare',
        headerName: 'Şirket',
        flex: 1,
        minWidth: 100,
        valueFormatter: (p) => `%${p.value ?? 0}`,
      },
      {
        field: 'agencyShare',
        headerName: 'Acente',
        flex: 1,
        minWidth: 100,
        valueFormatter: (p) => `%${p.value ?? 0}`,
      },
      {
        field: 'branchShare',
        headerName: 'Şube',
        flex: 1,
        minWidth: 100,
        valueFormatter: (p) => `%${p.value ?? 0}`,
      },
      {
        field: 'brokerShare',
        headerName: 'Broker',
        flex: 1,
        minWidth: 100,
        valueFormatter: (p) => `%${p.value ?? 0}`,
      },
      {
        field: 'validFrom',
        headerName: 'Geçerlilik Başlangıcı',
        flex: 1.5,
        minWidth: 150,
        valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString('tr-TR') : '-'),
      },
      {
        headerName: 'Durum',
        flex: 1,
        minWidth: 100,
        cellRenderer: (params: { data?: CommissionRule }) => {
          const isActive = !params.data?.validUntil;
          return (
            <Badge variant={isActive ? 'default' : 'outline'}>
              {isActive ? 'Aktif' : 'Arşiv'}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ sortable: true, resizable: true, filter: true }),
    [],
  );

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">Komisyon kuralları yüklenemedi.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="ag-theme-quartz h-[520px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <AgGridReact<CommissionRule>
        rowData={data ?? []}
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
