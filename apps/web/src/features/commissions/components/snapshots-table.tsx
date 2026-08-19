'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { useCommissionSnapshotsQuery } from '../hooks/use-commissions-query';
import type { CommissionSnapshot } from '../types/commission.types';

const formatMoney = (val?: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);

export function SnapshotsTable() {
  const { data, isLoading, isError, refetch } = useCommissionSnapshotsQuery();

  const columnDefs = React.useMemo<ColDef<CommissionSnapshot>[]>(
    () => [
      {
        headerName: 'Poliçe / Ürün',
        flex: 1.3,
        minWidth: 130,
        valueGetter: (params) => params.data?.policy?.product || '-',
      },
      {
        headerName: 'Müşteri',
        flex: 1.5,
        minWidth: 150,
        valueGetter: (params) => {
          const c = params.data?.policy?.customer;
          return c ? `${c.firstName} ${c.lastName}` : '-';
        },
      },
      {
        headerName: 'Şube',
        flex: 1.2,
        minWidth: 120,
        valueGetter: (params) => params.data?.policy?.branch?.name || '-',
      },
      {
        headerName: 'Broker',
        flex: 1.3,
        minWidth: 130,
        valueGetter: (params) => {
          const b = params.data?.policy?.broker;
          return b ? `${b.firstName} ${b.lastName}` : '-';
        },
      },
      {
        field: 'totalAmount',
        headerName: 'Toplam Prim',
        flex: 1.2,
        minWidth: 120,
        valueFormatter: (p) => formatMoney(p.value),
      },
      {
        field: 'brokerAmount',
        headerName: 'Broker Payı',
        flex: 1.2,
        minWidth: 110,
        valueFormatter: (p) => formatMoney(p.value),
      },
      {
        field: 'branchAmount',
        headerName: 'Şube Payı',
        flex: 1.2,
        minWidth: 110,
        valueFormatter: (p) => formatMoney(p.value),
      },
      {
        field: 'agencyAmount',
        headerName: 'Acente Payı',
        flex: 1.2,
        minWidth: 110,
        valueFormatter: (p) => formatMoney(p.value),
      },
      {
        field: 'companyAmount',
        headerName: 'Şirket Payı',
        flex: 1.2,
        minWidth: 110,
        valueFormatter: (p) => formatMoney(p.value),
      },
      {
        field: 'calculatedAt',
        headerName: 'Hesaplanma Tarihi',
        flex: 1.4,
        minWidth: 140,
        valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString('tr-TR') : '-'),
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
        <p className="text-sm font-medium text-destructive">Komisyon dekontları yüklenemedi.</p>
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
