'use client';

import * as React from 'react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '../types/company.types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CompaniesTableProps {
  data?: Company[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function CompaniesTable({ data, isLoading, isError, onRetry }: CompaniesTableProps) {
  const columnDefs = React.useMemo<ColDef<Company>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Şirket Adı',
        flex: 2,
        minWidth: 200,
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Building2 className="size-4 text-primary shrink-0" />
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        field: 'taxNumber',
        headerName: 'Vergi Numarası',
        flex: 1,
        minWidth: 140,
        valueFormatter: (params) => params.value || '-',
      },
      {
        headerName: 'Acente Sayısı',
        flex: 1,
        minWidth: 120,
        valueGetter: (params) => params.data?._count?.agencies ?? 0,
      },
      {
        headerName: 'Kullanıcı Sayısı',
        flex: 1,
        minWidth: 120,
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
        <span className="text-xs">Şirket verileri yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">Şirketler yüklenirken bir hata oluştu.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <AgGridReact<Company>
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
