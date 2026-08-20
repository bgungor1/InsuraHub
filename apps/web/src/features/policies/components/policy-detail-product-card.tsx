'use client';

import * as React from 'react';
import { Car, Home, HeartPulse } from 'lucide-react';
import type { Policy } from '../types/policy.types';

interface PolicyDetailProductCardProps {
  policy: Policy;
  formatCurrency: (amount?: number | null) => string;
}

export function PolicyDetailProductCard({
  policy,
  formatCurrency,
}: PolicyDetailProductCardProps) {
  const isVehicle =
    policy.product === 'KASKO' || policy.product === 'TRAFİK';
  const isProperty =
    policy.product === 'DASK' || policy.product === 'KONUT';
  const isHealth =
    policy.product === 'SAĞLIK' || policy.product === 'TAMAMLAYICI SAĞLIK';

  if (isVehicle) {
    return (
      <div className="rounded-lg border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-3 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400">
          <Car className="size-3.5" />
          Araç & Teminat Detayları
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="block text-[10px] text-muted-foreground">
              Araç Plakası
            </span>
            <span className="font-mono font-bold text-sm">
              {policy.plateNumber || '-'}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground">
              Kasko / Araç Değeri
            </span>
            <span className="font-semibold">
              {policy.coverageAmount
                ? formatCurrency(policy.coverageAmount)
                : '-'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isProperty) {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
          <Home className="size-3.5" />
          Konut & DASK Detayları
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="block text-[10px] text-muted-foreground">
              UAVT Adres Kodu
            </span>
            <span className="font-mono font-bold">{policy.uavtCode || '-'}</span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground">
              Bina Sigorta Bedeli
            </span>
            <span className="font-semibold">
              {policy.coverageAmount
                ? formatCurrency(policy.coverageAmount)
                : '-'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isHealth) {
    return (
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
          <HeartPulse className="size-3.5" />
          Teminat Kapsamı: Limitsiz Yatarak + 10 Seans Ayakta Tedavi
        </div>
      </div>
    );
  }

  return null;
}
