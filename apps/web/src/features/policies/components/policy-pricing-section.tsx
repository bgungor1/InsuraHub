'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Banknote, CreditCard, Sparkles } from 'lucide-react';
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
import type { CreatePolicyFormValues } from '../schemas/policy.schema';

interface PolicyPricingSectionProps {
  form: UseFormReturn<CreatePolicyFormValues>;
}

export function PolicyPricingSection({ form }: PolicyPricingSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-2 pt-1">
      <FormField
        control={form.control}
        name="totalAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[11px] flex items-center gap-1">
              <Banknote className="size-3 text-primary" />
              Poliçe Primi (₺) *
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="14.500"
                className="h-8 text-xs font-semibold text-foreground"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="paymentTerm"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[11px] flex items-center gap-1">
              <CreditCard className="size-3 text-muted-foreground" />
              Ödeme Planı
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="CASH">Peşin (Tek Çekim)</SelectItem>
                <SelectItem value="INSTALLMENT_3">3 Taksit</SelectItem>
                <SelectItem value="INSTALLMENT_6">6 Taksit</SelectItem>
                <SelectItem value="INSTALLMENT_9">9 Taksit</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[11px] flex items-center gap-1">
              <Sparkles className="size-3 text-muted-foreground" />
              Başlangıç Durumu
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="UNASSIGNED">Havuzda (Bekliyor)</SelectItem>
                <SelectItem value="CLAIMED">Üzerime Al (İşlemde)</SelectItem>
                <SelectItem value="DRAFT">Taslak</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}
