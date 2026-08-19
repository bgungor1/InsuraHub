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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateCustomerMutation } from '../hooks/use-create-customer-mutation';
import {
  createCustomerSchema,
  type CreateCustomerFormValues,
} from '../schemas/customer.schema';

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCustomerDialog({ open, onOpenChange }: CreateCustomerDialogProps) {
  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      identityNo: '',
      email: '',
      phone: '',
      city: '',
      district: '',
      address: '',
    },
  });

  const createMutation = useCreateCustomerMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: CreateCustomerFormValues) => {
    createMutation.mutate({
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Müşteri Kaydı</DialogTitle>
          <DialogDescription>
            Poliçe oluşturulabilecek yeni bir müşteri (bireysel/kurumsal) ekleyin.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>Ad / Unvan *</FormLabel><FormControl><Input placeholder="Ahmet" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Soyad *</FormLabel><FormControl><Input placeholder="Yılmaz" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="identityNo" render={({ field }) => (
              <FormItem><FormLabel>TCKN / VKN *</FormLabel><FormControl><Input placeholder="11 haneli kimlik numarası" maxLength={11} {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Telefon</FormLabel><FormControl><Input placeholder="0532xxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>E-posta</FormLabel><FormControl><Input type="email" placeholder="ornek@mail.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>İl</FormLabel><FormControl><Input placeholder="İstanbul" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="district" render={({ field }) => (
                <FormItem><FormLabel>İlçe</FormLabel><FormControl><Input placeholder="Kadıköy" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Kaydediliyor...' : 'Müşteri Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
