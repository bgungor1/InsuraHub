'use client';

import * as React from 'react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Agency } from '../types/agency.types';
import { useUpdateAgencyMutation } from '../hooks/use-update-agency-mutation';
import { getAgencyColumnDefs } from './agency-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AgenciesTableProps {
  data?: Agency[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function AgenciesTable({
  data,
  isLoading,
  isError,
  onRetry,
}: AgenciesTableProps) {
  const updateMutation = useUpdateAgencyMutation();

  const handleToggleActive = React.useCallback(
    (agency: Agency) => {
      updateMutation.mutate({
        id: agency.id,
        data: { isActive: !(agency.isActive !== false) },
      });
    },
    [updateMutation],
  );

  const columnDefs = React.useMemo<ColDef<Agency>[]>(
    () => getAgencyColumnDefs(handleToggleActive, updateMutation.isPending),
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
        <span className="text-xs">Acente verileri yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">
          Acenteler yüklenirken bir hata oluştu.
        </p>
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
