'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

ModuleRegistry.registerModules([AllCommunityModule]);
import type { Customer } from '../types/customer.types';
import { useCustomersQuery } from '../hooks/use-customers-query';

interface CustomersTableProps {
  search?: string;
  onRefresh?: () => void;
}

export function CustomersTable({ search }: CustomersTableProps) {
  const { data, isLoading, isError, refetch } = useCustomersQuery({ search, limit: 50 });

  const columnDefs = React.useMemo<ColDef<Customer>[]>(
    () => [
      {
        headerName: 'Müşteri Adı Soyadı',
        flex: 2,
        minWidth: 180,
        valueGetter: (params) => {
          if (!params.data) return '';
          return `${params.data.firstName} ${params.data.lastName}`.trim();
        },
      },
      {
        field: 'identityNo',
        headerName: 'TCKN / VKN',
        flex: 1.5,
        minWidth: 140,
      },
      {
        headerName: 'Telefon',
        flex: 1.5,
        minWidth: 130,
        valueGetter: (params) => params.data?.contactInfo?.phone || '-',
      },
      {
        headerName: 'E-posta',
        flex: 2,
        minWidth: 170,
        valueGetter: (params) => params.data?.contactInfo?.email || '-',
      },
      {
        headerName: 'İl / İlçe',
        flex: 1.5,
        minWidth: 140,
        valueGetter: (params) => {
          const c = params.data?.contactInfo;
          if (!c?.city && !c?.district) return '-';
          return [c.city, c.district].filter(Boolean).join(' / ');
        },
      },
      {
        headerName: 'Poliçe Sayısı',
        flex: 1,
        minWidth: 120,
        cellRenderer: (params: { data?: Customer }) => (
          <Badge variant="secondary">
            {params.data?._count?.policies ?? 0} Poliçe
          </Badge>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Kayıt Tarihi',
        flex: 1.2,
        minWidth: 120,
        valueFormatter: (params) => {
          if (!params.value) return '-';
          return new Date(params.value).toLocaleDateString('tr-TR');
        },
      },
    ],
    [],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    [],
  );

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Müşteri verileri yüklenirken bir sorun oluştu.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="ag-theme-quartz flex-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <AgGridReact<Customer>
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
