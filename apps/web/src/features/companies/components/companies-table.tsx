'use client';

import * as React from 'react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Company } from '../types/company.types';
import { useUpdateCompanyMutation } from '../hooks/use-update-company-mutation';
import { getCompanyColumnDefs } from './company-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CompaniesTableProps {
  data?: Company[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function CompaniesTable({
  data,
  isLoading,
  isError,
  onRetry,
}: CompaniesTableProps) {
  const updateMutation = useUpdateCompanyMutation();

  const handleToggleActive = React.useCallback(
    (company: Company) => {
      updateMutation.mutate({
        id: company.id,
        data: { isActive: !(company.isActive !== false) },
      });
    },
    [updateMutation],
  );

  const columnDefs = React.useMemo<ColDef<Company>[]>(
    () => getCompanyColumnDefs(handleToggleActive, updateMutation.isPending),
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
        <span className="text-xs">Şirket verileri yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">
          Şirketler yüklenirken bir hata oluştu.
        </p>
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
