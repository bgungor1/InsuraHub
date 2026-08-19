'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { Badge } from '@/components/ui/badge';
import { useCreateCommissionRuleMutation } from '../hooks/use-create-commission-rule-mutation';
import {
  createCommissionRuleSchema,
  type CreateCommissionRuleFormValues,
} from '../schemas/commission.schema';

const SHARE_FIELDS: { name: keyof Omit<CreateCommissionRuleFormValues, 'name'>; label: string }[] = [
  { name: 'companyShare', label: 'Şirket Payı (%)' },
  { name: 'agencyShare', label: 'Acente Payı (%)' },
  { name: 'branchShare', label: 'Şube Payı (%)' },
  { name: 'brokerShare', label: 'Broker Payı (%)' },
];

interface CreateRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRuleDialog({ open, onOpenChange }: CreateRuleDialogProps) {
  const form = useForm<CreateCommissionRuleFormValues>({
    resolver: zodResolver(createCommissionRuleSchema),
    defaultValues: { name: '', companyShare: 40, agencyShare: 20, branchShare: 20, brokerShare: 20 },
  });

  const mutation = useCreateCommissionRuleMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  const watchValues = useWatch({ control: form.control });
  const currentTotal =
    (Number(watchValues?.companyShare) || 0) +
    (Number(watchValues?.agencyShare) || 0) +
    (Number(watchValues?.branchShare) || 0) +
    (Number(watchValues?.brokerShare) || 0);

  const isExact100 = Math.abs(currentTotal - 100) < 0.001;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Yeni Komisyon Kuralı</DialogTitle>
          <DialogDescription>
            Tüm seviyeler için pay oranlarını belirleyin. Yeni kural otomatik olarak aktif olacaktır.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kural Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: 2026 Standart Kasko Dağılımı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              {SHARE_FIELDS.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-2.5 text-xs">
              <span className="text-muted-foreground">Toplam Dağılım Oranı:</span>
              <Badge variant={isExact100 ? 'default' : 'destructive'} className="font-semibold">
                %{currentTotal} / %100
              </Badge>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={mutation.isPending || !isExact100}>
                {mutation.isPending ? 'Kaydediliyor...' : 'Kuralı Kaydet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
