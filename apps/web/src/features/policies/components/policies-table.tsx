'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePoliciesQuery } from '../hooks/use-policies-query';
import { usePolicyActionsMutations } from '../hooks/use-policy-actions-mutations';
import { POLICY_STATE_MAP } from '../schemas/policy.schema';
import type { Policy, PolicyState } from '../types/policy.types';

interface PoliciesTableProps {
  search?: string;
  state?: PolicyState;
}

export function PoliciesTable({ search, state }: PoliciesTableProps) {
  const { data, isLoading, isError, refetch } = usePoliciesQuery({ search, state, limit: 50 });
  const { claimMutation, releaseMutation, cancelMutation } = usePolicyActionsMutations();

  const columnDefs = React.useMemo<ColDef<Policy>[]>(
    () => [
      { field: 'product', headerName: 'Ürün Türü', flex: 1.2, minWidth: 120 },
      {
        headerName: 'Müşteri',
        flex: 2,
        minWidth: 180,
        valueGetter: (params) => {
          const c = params.data?.customer;
          return c ? `${c.firstName} ${c.lastName || ''}`.trim() : '-';
        },
      },
      {
        headerName: 'Şube',
        flex: 1.5,
        minWidth: 140,
        valueGetter: (params) => params.data?.branch?.name || '-',
      },
      {
        headerName: 'Atanan Broker',
        flex: 1.5,
        minWidth: 140,
        valueGetter: (params) => {
          const b = params.data?.broker;
          return b ? `${b.firstName} ${b.lastName}` : 'Havuzda (Atanmamış)';
        },
      },
      {
        headerName: 'Prim Tutarı',
        flex: 1.2,
        minWidth: 120,
        valueFormatter: (params) =>
          new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
            params.data?.snapshot?.totalAmount || 0,
          ),
      },
      {
        field: 'state',
        headerName: 'Durum',
        flex: 1.2,
        minWidth: 120,
        cellRenderer: (params: { value: PolicyState }) => {
          const cfg = POLICY_STATE_MAP[params.value] || { label: params.value, variant: 'outline' };
          return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
      },
      {
        headerName: 'İşlemler',
        flex: 1.6,
        minWidth: 160,
        cellRenderer: (params: { data?: Policy }) => {
          const p = params.data;
          if (!p) return null;
          if (p.state === 'UNASSIGNED') {
            return (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs font-semibold"
                disabled={claimMutation.isPending}
                onClick={() => claimMutation.mutate(p.id)}
              >
                {claimMutation.isPending ? 'Alınıyor...' : 'Poliçeyi Al'}
              </Button>
            );
          }
          if (p.state === 'CLAIMED') {
            return (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={releaseMutation.isPending}
                  onClick={() => releaseMutation.mutate({ id: p.id })}
                >
                  Havuza Bırak
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(p.id)}
                >
                  İptal
                </Button>
              </div>
            );
          }
          return null;
        },
      },
    ],
    [claimMutation, releaseMutation, cancelMutation],
  );

  const defaultColDef = React.useMemo<ColDef>(() => ({ sortable: true, resizable: true, filter: true }), []);

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">Poliçe listesi yüklenirken bir hata oluştu.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Tekrar Dene</Button>
      </div>
    );
  }

  return (
    <div className="ag-theme-quartz flex-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <AgGridReact<Policy>
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
