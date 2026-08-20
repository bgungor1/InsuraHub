'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
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
import type { User } from '@/features/users';
import type { CreatePolicyFormValues } from '../schemas/policy.schema';

interface DirectBrokerSelectFieldProps {
  form: UseFormReturn<CreatePolicyFormValues>;
  availableBrokers: User[];
  isLoading: boolean;
}

export function DirectBrokerSelectField({
  form,
  availableBrokers,
  isLoading,
}: DirectBrokerSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="brokerId"
      render={({ field }) => (
        <FormItem className="pt-1">
          <FormLabel className="text-[11px] text-muted-foreground">
            Atanacak Temsilci / Broker *
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value || undefined}>
            <FormControl>
              <SelectTrigger className="h-9 bg-background">
                <SelectValue placeholder={isLoading ? 'Yükleniyor...' : 'Temsilci seçiniz'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableBrokers.length > 0 ? (
                availableBrokers.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.firstName} {b.lastName} ({b.email})
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-xs text-muted-foreground text-center">
                  Bu şubede kayıtlı aktif broker bulunamadı
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
