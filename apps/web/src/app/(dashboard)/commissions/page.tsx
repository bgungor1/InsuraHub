'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Calculator, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { queryKeys } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import {
  CreateRuleDialog,
  RulesTable,
  SnapshotsTable,
} from '@/features/commissions';

export default function CommissionsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const isAdminOrCompany = user?.role === 'SUPERADMIN' || user?.role === 'COMPANY_USER';

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <Calculator className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isAdminOrCompany ? 'Komisyon Motoru & Kuralları' : 'Komisyon & Hakediş Dökümü'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isAdminOrCompany
                ? 'Dağıtım kurallarını yönetin ve tamamlanan poliçelerin finansal dökümlerini inceleyin.'
                : 'Poliçe üretimlerinizden hak ettiğiniz komisyon dökümlerini ve hakedişlerinizi inceleyin.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Yenile">
            <RefreshCw className="size-4" />
          </Button>
          {isAdminOrCompany && (
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Yeni Kural Ekle
            </Button>
          )}
        </div>
      </div>

      {isAdminOrCompany ? (
        <Tabs defaultValue="snapshots" className="flex-1 flex flex-col space-y-4">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="snapshots">Dekontlar / Dağılımlar</TabsTrigger>
            <TabsTrigger value="rules">Komisyon Kuralları</TabsTrigger>
          </TabsList>

          <TabsContent value="snapshots" className="flex-1 m-0">
            <SnapshotsTable />
          </TabsContent>

          <TabsContent value="rules" className="flex-1 m-0">
            <RulesTable />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex-1">
          <SnapshotsTable />
        </div>
      )}

      {isAdminOrCompany && (
        <CreateRuleDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      )}
    </div>
  );
}
