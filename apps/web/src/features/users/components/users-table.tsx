'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import type { User } from '../types/user.types';
import { useUpdateUserMutation } from '../hooks/use-update-user-mutation';
import { getUserColumnDefs } from './user-columns';

ModuleRegistry.registerModules([AllCommunityModule]);

interface UsersTableProps {
  data?: User[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function UsersTable({
  data = [],
  isLoading,
  isError,
  onRetry,
}: UsersTableProps) {
  const updateMutation = useUpdateUserMutation();

  const handleToggleActive = React.useCallback(
    (user: User) => {
      updateMutation.mutate({
        id: user.id,
        data: { isActive: !(user.isActive !== false) },
      });
    },
    [updateMutation],
  );

  const columnDefs = React.useMemo<ColDef<User>[]>(
    () => getUserColumnDefs(handleToggleActive, updateMutation.isPending),
    [handleToggleActive, updateMutation.isPending],
  );

  const defaultColDef = React.useMemo(
    () => ({ sortable: true, resizable: true }),
    [],
  );

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
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Tekrar Dene
          </Button>
        )}
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
