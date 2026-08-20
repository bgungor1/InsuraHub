'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowClickedEvent,
} from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { usePoliciesQuery } from '../hooks/use-policies-query';
import { usePolicyActionsMutations } from '../hooks/use-policy-actions-mutations';
import type { Policy, PolicyState } from '../types/policy.types';
import { CompletePolicyDialog } from './complete-policy-dialog';
import { PolicyDetailDialog } from './policy-detail-dialog';
import { getPolicyColumnDefs } from './policy-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

interface PoliciesTableProps {
  search?: string;
  state?: PolicyState;
}

export function PoliciesTable({ search, state }: PoliciesTableProps) {
  const { data, isLoading, isError, refetch } = usePoliciesQuery({
    search,
    state,
    limit: 50,
  });
  const { claimMutation, releaseMutation, cancelMutation } =
    usePolicyActionsMutations();

  const [selectedPolicyForComplete, setSelectedPolicyForComplete] =
    React.useState<Policy | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = React.useState(false);
  const [selectedPolicyForDetail, setSelectedPolicyForDetail] =
    React.useState<Policy | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const columnDefs = React.useMemo<ColDef<Policy>[]>(
    () =>
      getPolicyColumnDefs({
        onDetailClick: (p) => {
          setSelectedPolicyForDetail(p);
          setIsDetailOpen(true);
        },
        onCompleteClick: (p) => {
          setSelectedPolicyForComplete(p);
          setIsCompleteOpen(true);
        },
        onClaimClick: (id) => claimMutation.mutate(id),
        onReleaseClick: (id) => releaseMutation.mutate({ id }),
        onCancelClick: (id) => cancelMutation.mutate(id),
        isClaimPending: claimMutation.isPending,
        isReleasePending: releaseMutation.isPending,
        isCancelPending: cancelMutation.isPending,
      }),
    [claimMutation, releaseMutation, cancelMutation],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({ sortable: true, resizable: true, filter: true }),
    [],
  );

  const handleRowClicked = (event: RowClickedEvent<Policy>) => {
    if (event.data) {
      setSelectedPolicyForDetail(event.data);
      setIsDetailOpen(true);
    }
  };

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Poliçe listesi yüklenirken bir hata oluştu.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="ag-theme-quartz flex-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm cursor-pointer">
        <AgGridReact<Policy>
          rowData={data?.items ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          loading={isLoading}
          pagination={true}
          paginationPageSize={20}
          domLayout="normal"
          onRowClicked={handleRowClicked}
        />
      </div>

      <PolicyDetailDialog
        policy={selectedPolicyForDetail}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onCompleteClick={(p) => {
          setSelectedPolicyForComplete(p);
          setIsCompleteOpen(true);
        }}
      />

      <CompletePolicyDialog
        policy={selectedPolicyForComplete}
        open={isCompleteOpen}
        onOpenChange={setIsCompleteOpen}
      />
    </>
  );
}
