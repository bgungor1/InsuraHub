'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Building2 } from 'lucide-react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreateCompanyMutation } from '../hooks/use-create-company-mutation';

const companyFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Şirket adı en az 2 karakter olmalıdır.' })
    .max(100, { message: 'Şirket adı en fazla 100 karakter olabilir.' }),
  taxNumber: z.string().optional(),
  isActive: z.boolean(),
});

export type CompanyFormValues = {
  name: string;
  taxNumber?: string;
  isActive: boolean;
};

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCompanyDialog({ open, onOpenChange }: CreateCompanyDialogProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      taxNumber: '',
      isActive: true,
    },
  });

  const createMutation = useCreateCompanyMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: CompanyFormValues) => {
    createMutation.mutate({
      name: values.name.trim(),
      taxNumber: values.taxNumber?.trim() || undefined,
      isActive: values.isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <DialogTitle>Yeni Sigorta Şirketi Ekle</DialogTitle>
          </div>
          <DialogDescription>
            Sisteme yeni bir sigorta şirketi tanımlayın. Şirket oluştuktan sonra acenteler bağlanabilir.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şirket Adı *</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Anadolu Sigorta A.Ş." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vergi Numarası</FormLabel>
                  <FormControl>
                    <Input placeholder="10 Haneli Vergi No (İsteğe bağlı)" maxLength={10} {...field} />
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
                    <FormLabel className="text-sm font-medium">Aktiflik Durumu</FormLabel>
                    <FormDescription className="text-xs">
                      Şirket ve bağlı acenteler sistemde aktif işlem yapabilsin mi?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                İptal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {createMutation.isPending ? 'Kaydediliyor...' : 'Şirketi Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
