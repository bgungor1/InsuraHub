'use client';

import * as React from 'react';
import { Banknote, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';
import type { Policy } from '../types/policy.types';

interface PolicyDetailFinancialCardProps {
  policy: Policy;
  formatCurrency: (amount?: number | null) => string;
}

export function PolicyDetailFinancialCard({
  policy,
  formatCurrency,
}: PolicyDetailFinancialCardProps) {
  const displayAmount =
    policy.snapshot?.totalAmount ?? policy.totalAmount ?? 0;

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold flex items-center gap-1.5">
          <Banknote className="size-3.5 text-primary" />
          Poliçe Primi & Finansal Bilgiler
        </span>
        <span className="text-base font-bold text-primary">
          {formatCurrency(displayAmount)}
        </span>
      </div>
      <div className="h-px w-full bg-border" />
      <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
        <div>
          <span className="block text-[10px]">Ödeme Planı</span>
          <span className="font-medium text-foreground flex items-center gap-1">
            <CreditCard className="size-3" />
            {policy.paymentTerm === 'CASH'
              ? 'Peşin (Tek Çekim)'
              : policy.paymentTerm || 'Peşin'}
          </span>
        </div>
        <div>
          <span className="block text-[10px]">Kayıt Tarihi</span>
          <span className="font-medium text-foreground flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(policy.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>

      {policy.snapshot && (
        <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 text-[11px] space-y-1.5">
          <div className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            Komisyon Dağıtımı & Hakediş Dökümü
          </div>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
            <div className="bg-background/80 dark:bg-card p-1.5 rounded border">
              <span className="block text-[10px] text-muted-foreground">
                Broker Payı
              </span>
              <strong className="text-foreground text-xs">
                {formatCurrency(policy.snapshot.brokerAmount)}
              </strong>
            </div>
            <div className="bg-background/80 dark:bg-card p-1.5 rounded border">
              <span className="block text-[10px] text-muted-foreground">
                Şube Payı
              </span>
              <strong className="text-foreground text-xs">
                {formatCurrency(policy.snapshot.branchAmount)}
              </strong>
            </div>
            <div className="bg-background/80 dark:bg-card p-1.5 rounded border">
              <span className="block text-[10px] text-muted-foreground">
                Acente Payı
              </span>
              <strong className="text-foreground text-xs">
                {formatCurrency(policy.snapshot.agencyAmount)}
              </strong>
            </div>
            <div className="bg-background/80 dark:bg-card p-1.5 rounded border">
              <span className="block text-[10px] text-muted-foreground">
                Şirket Payı
              </span>
              <strong className="text-foreground text-xs">
                {formatCurrency(policy.snapshot.companyAmount)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
