'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Car, Home, HeartPulse } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreatePolicyFormValues } from '../schemas/policy.schema';

interface CoverageProps {
  form: UseFormReturn<CreatePolicyFormValues>;
}

export function VehicleCoverageFields({ form }: CoverageProps) {
  return (
    <div className="rounded-md border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 space-y-2">
      <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
        <Car className="size-3.5" />
        Araç & Plaka Bilgileri
      </span>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="plateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px]">Araç Plakası</FormLabel>
              <FormControl>
                <Input placeholder="34 ABC 789" className="h-8 text-xs font-mono font-bold uppercase" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverageAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px]">Kasko / Araç Değeri (₺)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  placeholder="1.250.000"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function PropertyCoverageFields({ form }: CoverageProps) {
  return (
    <div className="rounded-md border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 space-y-2">
      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
        <Home className="size-3.5" />
        Konut & DASK Bilgileri
      </span>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="uavtCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px]">UAVT Adres Kodu (10 Hane)</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" maxLength={10} className="h-8 text-xs font-mono" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverageAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px]">Bina Sigorta Bedeli (₺)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  placeholder="2.500.000"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function HealthCoverageCard() {
  return (
    <div className="rounded-md border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5">
      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
        <HeartPulse className="size-3.5" />
        Teminat: Limitsiz Yatarak + 10 Seans Ayakta Tedavi
      </span>
    </div>
  );
}
