'use client';

import * as React from 'react';
import { Control } from 'react-hook-form';
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
import { useCompaniesQuery } from '@/features/companies';
import { useAgenciesQuery } from '@/features/agencies';
import { useBranchesQuery } from '@/features/branches';
import type { UserFormValues } from '../schemas/user.schema';

interface UserScopeFieldsProps {
  control: Control<UserFormValues>;
  role: UserFormValues['role'];
}

export function UserScopeFields({ control, role }: UserScopeFieldsProps) {
  const isCompany = role === 'COMPANY_USER';
  const isAgency = role === 'AGENCY_MANAGER';
  const isBranchOrBroker = role === 'BRANCH_MANAGER' || role === 'BROKER';

  const { data: companies } = useCompaniesQuery({ limit: 100 });
  const { data: agencies } = useAgenciesQuery({ limit: 100 });
  const { data: branches } = useBranchesQuery({ limit: 100 });

  if (isCompany) {
    return (
      <FormField
        control={control}
        name="companyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bağlı Olduğu Şirket *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Şirket seçiniz" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {companies?.items.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (isAgency) {
    return (
      <FormField
        control={control}
        name="agencyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bağlı Olduğu Acente *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Acente seçiniz" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {agencies?.items.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (isBranchOrBroker) {
    return (
      <FormField
        control={control}
        name="branchId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bağlı Olduğu Şube *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Şube seçiniz" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {branches?.items.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return null;
}
