'use client';

import * as React from 'react';
import { ColDef } from 'ag-grid-community';
import { GitBranch, Store, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Branch } from '../types/branch.types';

export function getBranchColumnDefs(
  onToggleActive: (branch: Branch) => void,
  isPending: boolean,
): ColDef<Branch>[] {
  return [
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
      minWidth: 120,
      cellRenderer: (params: { data?: Branch }) => {
        const b = params.data;
        if (!b) return null;
        const isActive = b.isActive !== false;
        return (
          <button
            type="button"
            title="Durumu değiştirmek için tıklayın"
            disabled={isPending}
            onClick={() => onToggleActive(b)}
            className="inline-flex items-center transition-transform hover:scale-105 active:scale-95"
          >
            <Badge
              variant={isActive ? 'default' : 'destructive'}
              className="cursor-pointer text-[10px] font-medium transition-colors"
            >
              {isActive ? '● Aktif' : '○ Pasif'}
            </Badge>
          </button>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Kayıt Tarihi',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-',
    },
  ];
}
