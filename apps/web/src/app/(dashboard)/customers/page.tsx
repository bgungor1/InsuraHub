'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Search, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { queryKeys } from '@/lib/api';
import { CreateCustomerDialog, CustomersTable } from '@/features/customers';

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <UsersRound className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Müşteriler
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistemdeki tüm bireysel ve kurumsal müşteri portföyünü yönetin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Yenile">
            <RefreshCw className="size-4" />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="size-4" />
            Yeni Müşteri
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Müşteri adı, soyadı veya TCKN/VKN ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <CustomersTable search={debouncedSearch} onRefresh={handleRefresh} />

      <CreateCustomerDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
