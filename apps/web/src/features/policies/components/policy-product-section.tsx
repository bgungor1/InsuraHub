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
import {
  PRODUCT_OPTIONS,
  type CreatePolicyFormValues,
} from '../schemas/policy.schema';
import {
  VehicleCoverageFields,
  PropertyCoverageFields,
  HealthCoverageCard,
} from './policy-coverage-cards';
import { PolicyBranchBrokerFields } from './policy-branch-broker-fields';

interface PolicyProductSectionProps {
  form: UseFormReturn<CreatePolicyFormValues>;
}

export function PolicyProductSection({ form }: PolicyProductSectionProps) {
  const selectedProduct = form.watch('product');

  const isVehicle = selectedProduct === 'KASKO' || selectedProduct === 'TRAFİK';
  const isProperty = selectedProduct === 'DASK' || selectedProduct === 'KONUT';
  const isHealth = selectedProduct === 'SAĞLIK' || selectedProduct === 'TAMAMLAYICI SAĞLIK';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Sigorta Ürünü / Branş *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Ürün seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRODUCT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <PolicyBranchBrokerFields form={form} />
      </div>

      {isVehicle && <VehicleCoverageFields form={form} />}
      {isProperty && <PropertyCoverageFields form={form} />}
      {isHealth && <HealthCoverageCard />}
    </div>
  );
}
