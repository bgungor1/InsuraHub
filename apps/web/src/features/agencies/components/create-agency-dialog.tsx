'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Store } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
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
import { useCompaniesQuery } from '@/features/companies';
import { useCreateAgencyMutation } from '../hooks/use-create-agency-mutation';
import { AgencyFormFields, type AgencyFormValues } from './agency-form-fields';

const agencyFormSchema = z.object({
  name: z.string().min(2, 'Acente adı en az 2 karakter olmalıdır.').max(100),
  companyId: z.string().min(1, 'Lütfen bağlı olduğu şirketi seçiniz.'),
  isActive: z.boolean(),
});

interface CreateAgencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompanyId?: string;
}

export function CreateAgencyDialog({
  open,
  onOpenChange,
  defaultCompanyId,
}: CreateAgencyDialogProps) {
  const user = useAuthStore((state) => state.user);
  const effectiveCompanyId = user?.companyId || defaultCompanyId || '';
  const isCompanyScoped = user?.role === 'COMPANY_USER' && Boolean(user.companyId);

  const { data: companiesData, isLoading: isLoadingCompanies } = useCompaniesQuery({
    limit: 100,
    isActive: true,
  });

  const form = useForm<AgencyFormValues>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: { name: '', companyId: effectiveCompanyId, isActive: true },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        companyId: effectiveCompanyId,
        isActive: true,
      });
    }
  }, [open, effectiveCompanyId, form]);

  const createMutation = useCreateAgencyMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: AgencyFormValues) => {
    createMutation.mutate({
      name: values.name.trim(),
      companyId: values.companyId || effectiveCompanyId,
      isActive: values.isActive,
    });
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
          <DialogDescription>
            {isCompanyScoped
              ? 'Şirketinize bağlı çalışacak yeni bir acente oluşturun.'
              : 'Sigorta şirketine bağlı çalışacak yeni bir acente oluşturun.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <AgencyFormFields
              form={form}
              isCompanyScoped={isCompanyScoped}
              companies={companiesData?.items}
              isLoadingCompanies={isLoadingCompanies}
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
                {createMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {createMutation.isPending ? 'Kaydediliyor...' : 'Acenteyi Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
