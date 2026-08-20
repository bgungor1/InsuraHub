'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePolicyActionsMutations } from '../hooks/use-policy-actions-mutations';
import type { Policy } from '../types/policy.types';

interface CompletePolicyDialogProps {
  policy: Policy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompletePolicyDialog({
  policy,
  open,
  onOpenChange,
}: CompletePolicyDialogProps) {
  const { completeMutation } = usePolicyActionsMutations();
  const defaultAmount = policy?.snapshot?.totalAmount && policy.snapshot.totalAmount > 0
    ? policy.snapshot.totalAmount.toString()
    : '';
  const [totalAmount, setTotalAmount] = React.useState<string>(defaultAmount);

  const [prevPolicyId, setPrevPolicyId] = React.useState<string | undefined>(policy?.id);
  if (policy?.id !== prevPolicyId) {
    setPrevPolicyId(policy?.id);
    setTotalAmount(defaultAmount);
  }

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;

    const amount = parseFloat(totalAmount);
    if (!amount || amount <= 0) return;

    completeMutation.mutate(
      { id: policy.id, totalAmount: amount },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const customerName = policy?.customer
    ? `${policy.customer.firstName} ${policy.customer.lastName || ''}`.trim()
    : 'Müşteri';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleComplete}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <DialogTitle>Poliçeyi Tamamla</DialogTitle>
                <DialogDescription>
                  Poliçeyi onaylayıp tamamlayın ve komisyon paylaşımını başlatın.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="my-4 space-y-3 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Poliçe / Ürün:</span>
              <span className="font-semibold text-foreground">{policy?.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Müşteri:</span>
              <span className="font-semibold text-foreground">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Şube:</span>
              <span className="font-semibold text-foreground">{policy?.branch?.name || '-'}</span>
            </div>
          </div>

          <div className="space-y-2 py-2">
            <Label htmlFor="complete-amount" className="text-xs font-semibold">
              Kesinleşen Poliçe Tutarı / Prim (₺) *
            </Label>
            <Input
              id="complete-amount"
              type="number"
              step="0.01"
              min="1"
              required
              placeholder="Örn: 15000"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="text-sm font-medium"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              Komisyon oranları bu tutar üzerinden şirket, acente, şube ve broker paylarına dağıtılacaktır.
            </p>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={completeMutation.isPending || !totalAmount || parseFloat(totalAmount) <= 0}
            >
              {completeMutation.isPending ? 'Tamamlanıyor...' : 'Onayla & Tamamla'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
