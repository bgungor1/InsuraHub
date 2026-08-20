'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { useCreateTicketMutation } from '../hooks/use-create-ticket-mutation';
import { createTicketSchema, type CreateTicketFormValues } from '../schemas/ticket.schema';

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
  const createMutation = useCreateTicketMutation();
  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { subject: '', category: 'TECHNICAL', message: '' },
  });

  const onSubmit = (values: CreateTicketFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Destek talebi başarıyla oluşturuldu.');
        form.reset();
        onOpenChange(false);
      },
      onError: (err: unknown) => {
        const errData = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data;
        const msg = Array.isArray(errData?.message) ? errData.message.join(', ') : errData?.message || 'Destek talebi oluşturulamadı.';
        toast.error(msg);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Yeni Destek Talebi Aç</DialogTitle>
          <DialogDescription>Operasyon birimine veya genel merkeze iletmek istediğiniz konuyu detaylandırın.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="TECHNICAL">Teknik Destek</SelectItem>
                      <SelectItem value="POLICY_APPROVAL">Poliçe Onay & İşlem</SelectItem>
                      <SelectItem value="FINANCE">Finans & Komisyon</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konu Başlığı</FormLabel>
                  <FormControl><Input placeholder="Örn: 2026-POL-449 komisyon düzeltmesi" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesajınız</FormLabel>
                  <FormControl>
                    <textarea
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Talebinizi ayrıntılarıyla açıklayın..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Oluşturuluyor...' : 'Talebi İlet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
