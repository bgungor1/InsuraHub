'use client';

import * as React from 'react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Store, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agency } from '../types/agency.types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AgenciesTableProps {
  data?: Agency[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function AgenciesTable({ data, isLoading, isError, onRetry }: AgenciesTableProps) {
  const columnDefs = React.useMemo<ColDef<Agency>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Acente Adı',
        flex: 2,
        minWidth: 200,
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Store className="size-4 text-primary shrink-0" />
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Bağlı Şirket',
        flex: 2,
        minWidth: 180,
        valueGetter: (params) => params.data?.company?.name || '-',
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="size-3.5 text-muted-foreground/70 shrink-0" />
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Şube Sayısı',
        flex: 1,
        minWidth: 110,
        valueGetter: (params) => params.data?._count?.branches ?? 0,
      },
      {
        headerName: 'Kullanıcı Sayısı',
        flex: 1,
        minWidth: 110,
        valueGetter: (params) => params.data?._count?.users ?? 0,
      },
      {
        field: 'isActive',
        headerName: 'Durum',
        flex: 1,
        minWidth: 110,
        cellRenderer: (params: { value: boolean }) => (
          <Badge variant={params.value ? 'default' : 'destructive'} className="text-[11px]">
            {params.value ? 'Aktif' : 'Pasif'}
          </Badge>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Kayıt Tarihi',
        flex: 1,
        minWidth: 130,
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-',
      },
    ],
    []
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-xs">Acente verileri yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">Acenteler yüklenirken bir hata oluştu.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <AgGridReact<Agency>
        rowData={data || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="single"
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50]}
      />
    </div>
  );
}
