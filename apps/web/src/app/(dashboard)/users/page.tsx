'use client';

import * as React from 'react';
import { Plus, Users, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useUsersQuery,
  CreateUserDialog,
  UsersTable,
} from '@/features/users';

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch, isFetching } = useUsersQuery({
    search: debouncedSearch || undefined,
    limit: 50,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Kullanıcılar & Temsilciler</h1>
            <p className="text-xs text-muted-foreground">
              Sistem yöneticileri, şirket personeli, acente/şube müdürleri ve brokerlar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="İsim veya e-posta ara..."
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

          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="size-4" />
            <span>Yeni Kullanıcı</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
        <UsersTable
          data={data?.items}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </div>

      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
