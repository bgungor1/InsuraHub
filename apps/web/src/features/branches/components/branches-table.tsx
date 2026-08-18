'use client';

import * as React from 'react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { GitBranch, Store, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Branch } from '../types/branch.types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface BranchesTableProps {
  data?: Branch[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function BranchesTable({ data, isLoading, isError, onRetry }: BranchesTableProps) {
  const columnDefs = React.useMemo<ColDef<Branch>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Şube Adı',
        flex: 2,
        minWidth: 180,
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-2 font-medium text-foreground">
            <GitBranch className="size-4 text-primary shrink-0" />
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Bağlı Acente',
        flex: 2,
        minWidth: 160,
        valueGetter: (params) => params.data?.agency?.name || '-',
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-1.5 text-foreground/90">
            <Store className="size-3.5 text-muted-foreground shrink-0" />
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Sigorta Şirketi',
        flex: 2,
        minWidth: 160,
        valueGetter: (params) => params.data?.agency?.company?.name || '-',
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="size-3.5 text-muted-foreground/70 shrink-0" />
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Temsilci Sayısı',
        flex: 1,
        minWidth: 110,
        valueGetter: (params) => params.data?._count?.users ?? 0,
      },
      {
        headerName: 'Poliçe Sayısı',
        flex: 1,
        minWidth: 110,
        valueGetter: (params) => params.data?._count?.policies ?? 0,
      },
      {
        field: 'isActive',
        headerName: 'Durum',
        flex: 1,
        minWidth: 100,
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
        minWidth: 120,
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
        <span className="text-xs">Şube verileri yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">Şubeler yüklenirken bir hata oluştu.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <AgGridReact<Branch>
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
