'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Store, Search, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useAgenciesQuery,
  CreateAgencyDialog,
  AgenciesTable,
} from '@/features/agencies';

export default function AgenciesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    if (user && (user.role === 'BRANCH_MANAGER' || user.role === 'BROKER')) {
      router.replace('/organizations/branches');
    }
  }, [user, router]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch, isFetching } = useAgenciesQuery({
    search: debouncedSearch || undefined,
    limit: 50,
  });

  const canCreateAgency = user?.role === 'SUPERADMIN' || user?.role === 'COMPANY_USER';

  if (user?.role === 'BRANCH_MANAGER' || user?.role === 'BROKER') {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Acenteler</h1>
            <p className="text-xs text-muted-foreground">
              Sigorta şirketlerine bağlı yetkili acenteler ve şube havuzları
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Acente adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Yenile"
          >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>

          {canCreateAgency && (
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="size-4" />
              <span>Yeni Acente</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
        <AgenciesTable
          data={data?.items}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </div>

      <CreateAgencyDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        defaultCompanyId={user?.companyId || undefined}
      />
    </div>
  );
}
