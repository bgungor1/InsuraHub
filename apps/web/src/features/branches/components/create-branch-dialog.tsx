'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, GitBranch } from 'lucide-react';
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
import { useAgenciesQuery } from '@/features/agencies';
import { useCreateBranchMutation } from '../hooks/use-create-branch-mutation';

const branchFormSchema = z.object({
  name: z.string().min(2, 'Şube adı en az 2 karakter olmalıdır.').max(100),
  agencyId: z.string().min(1, 'Lütfen bağlı olduğu acenteyi seçiniz.'),
  isActive: z.boolean(),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;

interface CreateBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAgencyId?: string;
}

export function CreateBranchDialog({ open, onOpenChange, defaultAgencyId }: CreateBranchDialogProps) {
  const { data: agenciesData, isLoading: isLoadingAgencies } = useAgenciesQuery({ limit: 100, isActive: true });
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: { name: '', agencyId: defaultAgencyId || '', isActive: true },
  });

  const createMutation = useCreateBranchMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: BranchFormValues) => {
    createMutation.mutate({ name: values.name.trim(), agencyId: values.agencyId, isActive: values.isActive });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GitBranch className="size-4" />
            </div>
            <DialogTitle>Yeni Şube Ekle</DialogTitle>
          </div>
          <DialogDescription>Acenteye bağlı çalışacak yeni bir şube / havuz merkezi oluşturun.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="agencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bağlı Olduğu Acente *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingAgencies}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingAgencies ? 'Acenteler yükleniyor...' : 'Acente seçiniz'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agenciesData?.items?.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id}>
                          {agency.name} {agency.company?.name ? `(${agency.company.name})` : ''}
                        </SelectItem>
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
                  <FormLabel>Şube Adı *</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Kadıköy Rıhtım Şubesi" {...field} />
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
                    <FormDescription className="text-xs">Şube ve bağlı temsilciler sistemde poliçe havuzu açabilsin mi?</FormDescription>
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
                {createMutation.isPending ? 'Kaydediliyor...' : 'Şubeyi Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
