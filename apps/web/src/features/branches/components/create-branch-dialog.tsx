'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, GitBranch } from 'lucide-react';
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
import { useAgenciesQuery } from '@/features/agencies';
import { useCreateBranchMutation } from '../hooks/use-create-branch-mutation';
import { BranchFormFields, type BranchFormValues } from './branch-form-fields';

const branchFormSchema = z.object({
  name: z.string().min(2, 'Şube adı en az 2 karakter olmalıdır.').max(100),
  agencyId: z.string().min(1, 'Lütfen bağlı olduğu acenteyi seçiniz.'),
  isActive: z.boolean(),
});

interface CreateBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAgencyId?: string;
}

export function CreateBranchDialog({
  open,
  onOpenChange,
  defaultAgencyId,
}: CreateBranchDialogProps) {
  const user = useAuthStore((state) => state.user);
  const effectiveAgencyId = user?.agencyId || defaultAgencyId || '';
  const isAgencyScoped = user?.role === 'AGENCY_MANAGER' && Boolean(user.agencyId);

  const { data: agenciesData, isLoading: isLoadingAgencies } = useAgenciesQuery({
    limit: 100,
    isActive: true,
  });

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: { name: '', agencyId: effectiveAgencyId, isActive: true },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        agencyId: effectiveAgencyId,
        isActive: true,
      });
    }
  }, [open, effectiveAgencyId, form]);

  const createMutation = useCreateBranchMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: BranchFormValues) => {
    createMutation.mutate({
      name: values.name.trim(),
      agencyId: values.agencyId || effectiveAgencyId,
      isActive: values.isActive,
    });
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
          <DialogDescription>
            {isAgencyScoped
              ? 'Acentenize bağlı çalışacak yeni bir şube / havuz merkezi oluşturun.'
              : 'Acenteye bağlı çalışacak yeni bir şube / havuz merkezi oluşturun.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <BranchFormFields
              form={form}
              isAgencyScoped={isAgencyScoped}
              agencies={agenciesData?.items}
              isLoadingAgencies={isLoadingAgencies}
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
                {createMutation.isPending ? 'Kaydediliyor...' : 'Şubeyi Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
