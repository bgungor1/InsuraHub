'use client';

import * as React from 'react';
import { ColDef } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import { POLICY_STATE_MAP } from '../schemas/policy.schema';
import type { Policy, PolicyState } from '../types/policy.types';
import {
  PolicyTableActions,
  type PolicyTableActionsProps,
} from './policy-table-actions';

export type PolicyColumnCallbacks = Omit<PolicyTableActionsProps, 'policy'>;

export function getPolicyColumnDefs(
  callbacks: PolicyColumnCallbacks,
): ColDef<Policy>[] {
  return [
    {
      field: 'product',
      headerName: 'Ürün Türü',
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params: { data?: Policy; value: string }) => {
        const p = params.data;
        if (!p) return params.value;
        return (
          <div className="flex items-center gap-1.5 font-medium">
            <span>{p.product}</span>
            {p.plateNumber && (
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono px-1 py-0.5 rounded font-bold">
                {p.plateNumber}
              </span>
            )}
          </div>
        );
      },
    },
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
        new Intl.NumberFormat('tr-TR', {
          style: 'currency',
          currency: 'TRY',
        }).format(
          params.data?.snapshot?.totalAmount ?? params.data?.totalAmount ?? 0,
        ),
    },
    {
      field: 'state',
      headerName: 'Durum',
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params: { value: PolicyState }) => {
        const cfg = POLICY_STATE_MAP[params.value] || {
          label: params.value,
          variant: 'outline',
        };
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    {
      headerName: 'İşlemler',
      flex: 2.2,
      minWidth: 220,
      cellRenderer: (params: { data?: Policy }) => {
        const p = params.data;
        if (!p) return null;
        return <PolicyTableActions policy={p} {...callbacks} />;
      },
    },
  ];
}
