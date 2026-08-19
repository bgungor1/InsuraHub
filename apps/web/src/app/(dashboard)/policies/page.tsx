'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, RefreshCw, Search, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { queryKeys } from '@/lib/api';
import {
  CreatePolicyDialog,
  PoliciesTable,
  usePoliciesRealtime,
  type PolicyState,
} from '@/features/policies';

export default function PoliciesPage() {
  const queryClient = useQueryClient();
  const { isConnected } = usePoliciesRealtime();
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedState, setSelectedState] = React.useState<PolicyState | undefined>(undefined);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.policies.all });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <FileText className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Poliçe Havuzu</h1>
              <Badge variant={isConnected ? 'default' : 'outline'} className="gap-1 text-[11px] py-0.5">
                <Radio className={`size-3 ${isConnected ? 'animate-pulse text-emerald-400' : 'text-muted-foreground'}`} />
                {isConnected ? 'Canlı Senkronize' : 'Bağlanıyor...'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Havuzdaki poliçeleri canlı takip edin, anında üzerinize alın.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Yenile">
            <RefreshCw className="size-4" />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Yeni Poliçe
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Poliçe ürünü veya müşteri adına göre ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/40 p-1 text-xs">
          {(
            [
              { label: 'Tümü', value: undefined },
              { label: 'Havuz (Bekleyen)', value: 'UNASSIGNED' as const },
              { label: 'İşlemde (Atanan)', value: 'CLAIMED' as const },
              { label: 'Tamamlanan', value: 'COMPLETED' as const },
            ] as const
          ).map((tab) => (
            <button
              key={tab.label}
              onClick={() => setSelectedState(tab.value)}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                selectedState === tab.value
                  ? 'bg-background shadow-xs text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PoliciesTable search={debouncedSearch} state={selectedState} />
      <CreatePolicyDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
