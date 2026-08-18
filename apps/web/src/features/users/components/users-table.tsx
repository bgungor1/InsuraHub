'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { User, UserRole } from '../types/user.types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface UsersTableProps {
  data?: User[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const roleLabels: Record<UserRole, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  SUPERADMIN: { label: 'Sistem Yöneticisi', variant: 'default' },
  COMPANY_USER: { label: 'Şirket Yetkilisi', variant: 'secondary' },
  AGENCY_MANAGER: { label: 'Acente Müdürü', variant: 'outline' },
  BRANCH_MANAGER: { label: 'Şube Müdürü', variant: 'outline' },
  BROKER: { label: 'Broker (Temsilci)', variant: 'secondary' },
};

export function UsersTable({ data = [], isLoading, isError, onRetry }: UsersTableProps) {
  const columnDefs = React.useMemo<ColDef<User>[]>(() => [
    {
      headerName: 'Ad Soyad',
      flex: 2,
      minWidth: 160,
      filter: true,
      valueGetter: (params) => `${params.data?.firstName || ''} ${params.data?.lastName || ''}`.trim(),
    },
    { field: 'email', headerName: 'E-posta', flex: 2, minWidth: 180, filter: true },
    {
      field: 'role',
      headerName: 'Rol',
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params: { value: UserRole }) => {
        const info = roleLabels[params.value] || { label: params.value, variant: 'outline' };
        return <Badge variant={info.variant} className="text-[11px] font-medium">{info.label}</Badge>;
      },
    },
    {
      headerName: 'Organizasyon',
      flex: 2,
      minWidth: 160,
      valueGetter: (params) => {
        const d = params.data;
        if (!d) return '-';
        if (d.role === 'SUPERADMIN') return 'Merkez Sistem';
        if (d.role === 'COMPANY_USER') return d.company?.name || '-';
        if (d.role === 'AGENCY_MANAGER') return d.agency?.name || '-';
        if (d.role === 'BRANCH_MANAGER' || d.role === 'BROKER') return d.branch?.name || '-';
        return '-';
      },
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      width: 100,
      cellRenderer: (params: { value: boolean }) => (
        <Badge variant={params.value ? 'default' : 'destructive'} className="text-[10px]">
          {params.value ? 'Aktif' : 'Pasif'}
        </Badge>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Kayıt Tarihi',
      width: 130,
      valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'),
    },
  ], []);

  const defaultColDef = React.useMemo(() => ({ sortable: true, resizable: true }), []);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">Kullanıcılar yüklenirken hata oluştu.</p>
        {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Tekrar Dene</Button>}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection={{ mode: 'singleRow' }}
        pagination={true}
        paginationPageSize={20}
        domLayout="normal"
      />
    </div>
  );
}
