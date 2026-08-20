'use client';

import * as React from 'react';
import { Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { POLICY_STATE_MAP } from '../schemas/policy.schema';
import type { Policy } from '../types/policy.types';
import { PolicyDetailCustomerCard } from './policy-detail-customer-card';
import { PolicyDetailProductCard } from './policy-detail-product-card';
import { PolicyDetailFinancialCard } from './policy-detail-financial-card';
import { PolicyDetailActions } from './policy-detail-actions';

interface PolicyDetailDialogProps {
  policy: Policy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleteClick?: (policy: Policy) => void;
}

export function PolicyDetailDialog({
  policy,
  open,
  onOpenChange,
  onCompleteClick,
}: PolicyDetailDialogProps) {
  if (!policy) return null;

  const stateCfg = POLICY_STATE_MAP[policy.state] || {
    label: policy.state,
    variant: 'outline',
  };

  const formatCurrency = (amount?: number | null) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg font-bold">
                    {policy.product} Poliçesi
                  </DialogTitle>
                  <Badge variant={stateCfg.variant}>{stateCfg.label}</Badge>
                </div>
                <DialogDescription className="text-xs font-mono">
                  Ref: {policy.id}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <PolicyDetailCustomerCard policy={policy} />

          <PolicyDetailProductCard
            policy={policy}
            formatCurrency={formatCurrency}
          />

          <PolicyDetailFinancialCard
            policy={policy}
            formatCurrency={formatCurrency}
          />
        </div>

        <DialogFooter>
          <PolicyDetailActions
            policy={policy}
            onClose={() => onOpenChange(false)}
            onCompleteClick={onCompleteClick}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
