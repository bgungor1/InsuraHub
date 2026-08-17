'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Store } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCompaniesQuery } from '@/features/companies';
import { useCreateAgencyMutation } from '../hooks/use-create-agency-mutation';

const agencyFormSchema = z.object({
  name: z.string().min(2, 'Acente adı en az 2 karakter olmalıdır.').max(100),
  companyId: z.string().min(1, 'Lütfen bağlı olduğu şirketi seçiniz.'),
  isActive: z.boolean(),
});

export type AgencyFormValues = z.infer<typeof agencyFormSchema>;

interface CreateAgencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompanyId?: string;
}

export function CreateAgencyDialog({ open, onOpenChange, defaultCompanyId }: CreateAgencyDialogProps) {
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompaniesQuery({ limit: 100, isActive: true });
  const form = useForm<AgencyFormValues>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: { name: '', companyId: defaultCompanyId || '', isActive: true },
  });

  const createMutation = useCreateAgencyMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: AgencyFormValues) => {
    createMutation.mutate({ name: values.name.trim(), companyId: values.companyId, isActive: values.isActive });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="size-4" />
            </div>
            <DialogTitle>Yeni Acente Ekle</DialogTitle>
          </div>
          <DialogDescription>Sigorta şirketine bağlı çalışacak yeni bir acente oluşturun.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bağlı Olduğu Sigorta Şirketi *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCompanies}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCompanies ? 'Şirketler yükleniyor...' : 'Şirket seçiniz'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesData?.items?.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel className="text-sm font-medium">Aktiflik Durumu</FormLabel>
                    <FormDescription className="text-xs">Acente ve bağlı şubeleri sistemde aktif işlem yapabilsin mi?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createMutation.isPending}>
                İptal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {createMutation.isPending ? 'Kaydediliyor...' : 'Acenteyi Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
