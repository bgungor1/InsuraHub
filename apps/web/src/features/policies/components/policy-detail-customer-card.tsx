'use client';

import * as React from 'react';
import { User, Building2 } from 'lucide-react';
import type { Policy } from '../types/policy.types';

interface PolicyDetailCustomerCardProps {
  policy: Policy;
}

export function PolicyDetailCustomerCard({
  policy,
}: PolicyDetailCustomerCardProps) {
  return (
    <>
      <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <User className="size-3.5 text-primary" />
          Sigortalı / Müşteri Bilgileri
        </div>
        <div className="grid grid-cols-2 gap-2 text-muted-foreground">
          <div>
            <span className="block text-[10px] uppercase font-bold text-foreground">
              Ad Soyad
            </span>
            <span>
              {policy.customer?.firstName} {policy.customer?.lastName}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-foreground">
              TCKN / VKN
            </span>
            <span className="font-mono">{policy.customer?.identityNo || '-'}</span>
          </div>
          {policy.customer?.contactInfo?.phone && (
            <div>
              <span className="block text-[10px] uppercase font-bold text-foreground">
                Telefon
              </span>
              <span>{policy.customer.contactInfo.phone}</span>
            </div>
          )}
          {policy.customer?.contactInfo?.city && (
            <div>
              <span className="block text-[10px] uppercase font-bold text-foreground">
                Şehir / Lokasyon
              </span>
              <span>{policy.customer.contactInfo.city}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-2.5 grid grid-cols-2 gap-2 text-muted-foreground">
        <div>
          <span className="block text-[10px] uppercase font-bold text-foreground flex items-center gap-1">
            <Building2 className="size-3" />
            Üretim Şubesi
          </span>
          <span>{policy.branch?.name || '-'}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-foreground">
            Sorumlu Broker
          </span>
          <span>
            {policy.broker
              ? `${policy.broker.firstName} ${policy.broker.lastName}`
              : 'Havuzda (Atanmadı)'}
          </span>
        </div>
      </div>
    </>
  );
}
