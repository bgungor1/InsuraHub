'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
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
import { Button } from '@/components/ui/button';
import { useCustomersQuery } from '@/features/customers';
import { useBranchesQuery } from '@/features/branches';
import { useCreatePolicyMutation } from '../hooks/use-create-policy-mutation';
import {
  PRODUCT_OPTIONS,
  createPolicySchema,
  type CreatePolicyFormValues,
} from '../schemas/policy.schema';

interface CreatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePolicyDialog({ open, onOpenChange }: CreatePolicyDialogProps) {
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomersQuery({ limit: 100 });
  const { data: branchesData, isLoading: isLoadingBranches } = useBranchesQuery({ limit: 100 });

  const form = useForm<CreatePolicyFormValues>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: { product: 'KASKO', customerId: '', branchId: '', totalAmount: 0, state: 'UNASSIGNED' },
  });

  const createMutation = useCreatePolicyMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: CreatePolicyFormValues) => {
    createMutation.mutate({
      ...values,
      branchId: values.branchId || undefined,
      totalAmount: Number(values.totalAmount) || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Poliçe Kaydı</DialogTitle>
          <DialogDescription>Havuzda işlem görecek veya doğrudan atanacak yeni bir poliçe oluşturun.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField control={form.control} name="product" render={({ field }) => (
              <FormItem>
                <FormLabel>Poliçe Ürün Türü *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Ürün seçin" /></SelectTrigger></FormControl>
                  <SelectContent>{PRODUCT_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="customerId" render={({ field }) => (
              <FormItem>
                <FormLabel>Müşteri *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger disabled={isLoadingCustomers}><SelectValue placeholder={isLoadingCustomers ? 'Yükleniyor...' : 'Müşteri seçin'} /></SelectTrigger></FormControl>
                  <SelectContent>{customersData?.items?.map((c) => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.identityNo})</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="branchId" render={({ field }) => (
              <FormItem>
                <FormLabel>Şube</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger disabled={isLoadingBranches}><SelectValue placeholder={isLoadingBranches ? 'Yükleniyor...' : 'Şube seçin (Opsiyonel)'} /></SelectTrigger></FormControl>
                  <SelectContent>{branchesData?.items?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="totalAmount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prim Tutarı (₺)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0.00" value={field.value ?? ''} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlangıç Durumu</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="UNASSIGNED">Havuzda (Bekliyor)</SelectItem>
                      <SelectItem value="CLAIMED">Üzerime Al (İşlemde)</SelectItem>
                      <SelectItem value="DRAFT">Taslak</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Kaydediliyor...' : 'Poliçe Oluştur'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
