'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useCreatePolicyMutation } from '../hooks/use-create-policy-mutation';
import {
  createPolicySchema,
  type CreatePolicyFormValues,
} from '../schemas/policy.schema';
import type { PolicyState } from '../types/policy.types';
import { PolicyCustomerSection } from './policy-customer-section';
import { PolicyProductSection } from './policy-product-section';
import { PolicyPricingSection } from './policy-pricing-section';

interface CreatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePolicyDialog({ open, onOpenChange }: CreatePolicyDialogProps) {
  const form = useForm<CreatePolicyFormValues>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: {
      customerMode: 'EXISTING',
      customerId: '',
      newCustomer: {
        firstName: '',
        lastName: '',
        identityNo: '',
        phone: '',
        city: 'İstanbul',
      },
      product: 'KASKO',
      branchId: '',
      brokerId: '',
      coverageAmount: 1250000,
      totalAmount: 14500,
      plateNumber: '',
      uavtCode: '',
      paymentTerm: 'CASH',
      state: 'UNASSIGNED',
    },
  });

  const createMutation = useCreatePolicyMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: CreatePolicyFormValues) => {
    const brokerId =
      values.brokerId && values.brokerId.trim().length > 0
        ? values.brokerId
        : undefined;
    const state: PolicyState = brokerId ? 'CLAIMED' : 'UNASSIGNED';

    const payload = {
      product: values.product,
      state,
      brokerId,
      branchId: values.branchId || undefined,
      totalAmount: Number(values.totalAmount) || undefined,
      coverageAmount: Number(values.coverageAmount) || undefined,
      plateNumber: values.plateNumber || undefined,
      uavtCode: values.uavtCode || undefined,
      paymentTerm: values.paymentTerm || undefined,
      ...(values.customerMode === 'EXISTING'
        ? { customerId: values.customerId }
        : {
            newCustomer: {
              firstName: values.newCustomer?.firstName?.trim() || '',
              lastName: values.newCustomer?.lastName?.trim() || '',
              identityNo: values.newCustomer?.identityNo?.trim() || '',
              phone: values.newCustomer?.phone?.trim() || undefined,
              city: values.newCustomer?.city?.trim() || undefined,
            },
          }),
    };

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Yeni Poliçe & Teklif Kaydı</DialogTitle>
              <DialogDescription className="text-xs">
                Müşteri bilgilerini girin, branş seçin ve doğrudan bir temsilciye atayın ya da havuza bırakın.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <PolicyCustomerSection form={form} />
            <PolicyProductSection form={form} />
            <PolicyPricingSection form={form} />

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Vazgeç
              </Button>
              <Button type="submit" size="sm" disabled={createMutation.isPending} className="gap-1.5">
                <Shield className="size-3.5" />
                {createMutation.isPending ? 'Oluşturuluyor...' : 'Poliçeyi Kaydet ve Gönder'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
