'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserCheck, UserPlus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomersQuery } from '@/features/customers';
import type { CreatePolicyFormValues } from '../schemas/policy.schema';

interface PolicyCustomerSectionProps {
  form: UseFormReturn<CreatePolicyFormValues>;
}

export function PolicyCustomerSection({ form }: PolicyCustomerSectionProps) {
  const { data: customersData, isLoading } = useCustomersQuery({ limit: 100 });
  const customerMode = form.watch('customerMode');

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <UserCheck className="size-3.5 text-primary" />
          Müşteri Tanımlama
        </span>
        <Tabs
          value={customerMode}
          onValueChange={(v) => form.setValue('customerMode', v as 'EXISTING' | 'NEW')}
          className="w-auto"
        >
          <TabsList className="h-7 p-0.5">
            <TabsTrigger value="EXISTING" className="text-[11px] h-6 px-2 gap-1">
              <UserCheck className="size-3" />
              Kayıtlı Müşteri
            </TabsTrigger>
            <TabsTrigger value="NEW" className="text-[11px] h-6 px-2 gap-1">
              <UserPlus className="size-3" />
              Yeni Müşteri (Hızlı CRM)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {customerMode === 'EXISTING' ? (
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoading} className="h-9">
                    <SelectValue placeholder={isLoading ? 'Yükleniyor...' : 'Sistemden müşteri seçin'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customersData?.items?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} — TC: {c.identityNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="newCustomer.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px]">Ad *</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Ahmet" className="h-8 text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newCustomer.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px]">Soyad *</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Yılmaz" className="h-8 text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="newCustomer.identityNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px]">TC Kimlik / VKN (11 Hane) *</FormLabel>
                  <FormControl>
                    <Input placeholder="11122233344" maxLength={11} className="h-8 text-xs font-mono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newCustomer.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px]">Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="0555 123 4567" className="h-8 text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
