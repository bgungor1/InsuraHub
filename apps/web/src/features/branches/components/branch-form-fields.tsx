'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import type { Agency } from '@/features/agencies';

export interface BranchFormValues {
  name: string;
  agencyId: string;
  isActive: boolean;
}

interface BranchFormFieldsProps {
  form: UseFormReturn<BranchFormValues>;
  isAgencyScoped: boolean;
  agencies?: Agency[];
  isLoadingAgencies: boolean;
}

export function BranchFormFields({
  form,
  isAgencyScoped,
  agencies,
  isLoadingAgencies,
}: BranchFormFieldsProps) {
  return (
    <>
      {!isAgencyScoped && (
        <FormField
          control={form.control}
          name="agencyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bağlı Olduğu Acente *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingAgencies}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingAgencies
                          ? 'Acenteler yükleniyor...'
                          : 'Acente seçiniz'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agencies?.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}{' '}
                      {agency.company?.name ? `(${agency.company.name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Şube Adı *</FormLabel>
            <FormControl>
              <Input placeholder="Örn: Kadıköy Rıhtım Şubesi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border border-border/60 p-3 shadow-xs">
            <div className="space-y-0.5">
              <FormLabel className="text-sm font-medium">
                Aktiflik Durumu
              </FormLabel>
              <FormDescription className="text-xs">
                Şube ve bağlı temsilciler sistemde poliçe havuzu açabilsin mi?
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
