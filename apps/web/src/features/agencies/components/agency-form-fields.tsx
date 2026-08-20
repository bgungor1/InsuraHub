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
import type { Company } from '@/features/companies';

export interface AgencyFormValues {
  name: string;
  companyId: string;
  isActive: boolean;
}

interface AgencyFormFieldsProps {
  form: UseFormReturn<AgencyFormValues>;
  isCompanyScoped: boolean;
  companies?: Company[];
  isLoadingCompanies: boolean;
}

export function AgencyFormFields({
  form,
  isCompanyScoped,
  companies,
  isLoadingCompanies,
}: AgencyFormFieldsProps) {
  return (
    <>
      {!isCompanyScoped && (
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bağlı Olduğu Sigorta Şirketi *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingCompanies}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCompanies
                          ? 'Şirketler yükleniyor...'
                          : 'Şirket seçiniz'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
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
            <FormLabel>Acente Adı *</FormLabel>
            <FormControl>
              <Input placeholder="Örn: Kadıköy Merkez Acentesi" {...field} />
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
                Acente ve bağlı şubeleri sistemde aktif işlem yapabilsin mi?
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
