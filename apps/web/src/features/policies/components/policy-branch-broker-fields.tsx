'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Users, UserCheck } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBranchesQuery } from '@/features/branches';
import { useUsersQuery } from '@/features/users';
import { useAuthStore } from '@/stores/auth.store';
import type { CreatePolicyFormValues } from '../schemas/policy.schema';
import { DirectBrokerSelectField } from './direct-broker-select-field';

interface PolicyBranchBrokerFieldsProps {
  form: UseFormReturn<CreatePolicyFormValues>;
}

export function PolicyBranchBrokerFields({ form }: PolicyBranchBrokerFieldsProps) {
  const user = useAuthStore((s) => s.user);
  const [assignMode, setAssignMode] = React.useState<'POOL' | 'DIRECT'>('POOL');

  const { data: branchesData, isLoading: isLoadingBranches } = useBranchesQuery({
    limit: 100,
    isActive: true,
  });
  const { data: usersData, isLoading: isLoadingUsers } = useUsersQuery({
    role: 'BROKER',
    limit: 100,
  });

  const selectedBranchId = form.watch('branchId');

  React.useEffect(() => {
    if (!selectedBranchId && branchesData?.items?.length) {
      const match = user?.branchId ? branchesData.items.find((b) => b.id === user.branchId) : null;
      form.setValue('branchId', match ? match.id : branchesData.items[0].id);
    }
  }, [branchesData, user, selectedBranchId, form]);

  const rawUsers = usersData?.items;
  const availableBrokers = React.useMemo(() => {
    if (!rawUsers) return [];
    if (!selectedBranchId) return rawUsers;
    return rawUsers.filter((u) => u.branchId === selectedBranchId);
  }, [rawUsers, selectedBranchId]);

  React.useEffect(() => {
    if (assignMode === 'DIRECT') {
      const current = form.getValues('brokerId');
      if (availableBrokers.length > 0) {
        if (!availableBrokers.some((b) => b.id === current)) {
          form.setValue('brokerId', availableBrokers[0].id);
        }
      } else {
        form.setValue('brokerId', '');
      }
    }
  }, [selectedBranchId, assignMode, availableBrokers, form]);

  const handleModeChange = (mode: 'POOL' | 'DIRECT') => {
    setAssignMode(mode);
    if (mode === 'POOL') {
      form.setValue('brokerId', '');
      form.setValue('state', 'UNASSIGNED');
    } else {
      form.setValue('state', 'CLAIMED');
      if (availableBrokers.length > 0) {
        form.setValue('brokerId', availableBrokers[0].id);
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="branchId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Üretim Şubesi *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || undefined}>
              <FormControl>
                <SelectTrigger disabled={isLoadingBranches} className="h-9">
                  <SelectValue placeholder={isLoadingBranches ? 'Yükleniyor...' : 'Şube seçin'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {branchesData?.items?.length ? (
                  branchesData.items.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} {b.agency?.name ? `(${b.agency.name})` : ''}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-xs text-muted-foreground text-center">Kayıtlı şube bulunamadı</div>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-2 space-y-2 rounded-lg border border-border/60 bg-muted/30 p-2.5">
        <span className="text-xs font-medium text-foreground">Poliçe Dağıtım / Atama Yöntemi</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('POOL')}
            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
              assignMode === 'POOL'
                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            <Users className="size-3.5" />
            Şube Havuzuna Ekle
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('DIRECT')}
            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
              assignMode === 'DIRECT'
                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            <UserCheck className="size-3.5" />
            Doğrudan Temsilciye Ata
          </button>
        </div>

        {assignMode === 'POOL' ? (
          <p className="text-[11px] text-muted-foreground">
            💡 Poliçe ortak şube havuzuna aktarılır. Şubedeki tüm yetkili brokerlar poliçeyi inceleyip talep edebilir.
          </p>
        ) : (
          <DirectBrokerSelectField
            form={form}
            availableBrokers={availableBrokers}
            isLoading={isLoadingUsers}
          />
        )}
      </div>
    </>
  );
}
