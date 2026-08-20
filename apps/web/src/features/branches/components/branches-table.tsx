'use client';

import * as React from 'react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Branch } from '../types/branch.types';
import { useUpdateBranchMutation } from '../hooks/use-update-branch-mutation';
import { getBranchColumnDefs } from './branch-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

interface BranchesTableProps {
  data?: Branch[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export function BranchesTable({
  data,
  isLoading,
  isError,
  onRetry,
}: BranchesTableProps) {
  const updateMutation = useUpdateBranchMutation();

  const handleToggleActive = React.useCallback(
    (branch: Branch) => {
      updateMutation.mutate({
        id: branch.id,
        data: { isActive: !(branch.isActive !== false) },
      });
    },
    [updateMutation],
  );

  const columnDefs = React.useMemo<ColDef<Branch>[]>(
    () => getBranchColumnDefs(handleToggleActive, updateMutation.isPending),
    [handleToggleActive, updateMutation.isPending],
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
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
