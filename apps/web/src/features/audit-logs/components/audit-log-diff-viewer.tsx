'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Minus } from 'lucide-react';

const fieldLabels: Record<string, string> = {
  state: 'Poliçe Yaşam Durumu',
  product: 'Ürün Adı',
  brokerId: 'Broker / Temsilci ID',
  totalAmount: 'Toplam Prim Tutarı',
  coverageAmount: 'Teminat Tutarı',
  branchId: 'Bağlı Şube ID',
  customerId: 'Müşteri ID',
  companyShare: 'Şirket Payı (%)',
  agencyShare: 'Acente Payı (%)',
  branchShare: 'Şube Payı (%)',
  brokerShare: 'Broker Payı (%)',
  name: 'İsim / Başlık',
  taxNumber: 'Vergi Numarası',
  reason: 'Gerekçe / Açıklama',
  description: 'İşlem Detayı',
  message: 'Mesaj / Bildirim',
  isActive: 'Aktiflik Durumu',
};

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return 'Tanımsız / Yok';
  if (typeof val === 'boolean') return val ? 'Aktif (Evet)' : 'Pasif (Hayır)';
  if (typeof val === 'number') {
    return val.toLocaleString('tr-TR');
  }
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return String(val);
}

interface AuditLogDiffViewerProps {
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}

export function AuditLogDiffViewer({ before, after }: AuditLogDiffViewerProps) {
  const b = before || {};
  const a = after || {};

  const allKeys = React.useMemo(() => {
    const bObj = before || {};
    const aObj = after || {};
    const keys = new Set([...Object.keys(bObj), ...Object.keys(aObj)]);
    return Array.from(keys);
  }, [before, after]);

  if (allKeys.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-muted/20 p-6 text-center text-xs text-muted-foreground">
        Herhangi bir parametrik veri değişikliği kaydedilmedi.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden bg-card text-xs">
      <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-2.5 font-semibold text-muted-foreground">
        <div className="col-span-4">Değişen Alan / Parametre</div>
        <div className="col-span-4">Önceki Değer (Before)</div>
        <div className="col-span-4">Yeni Değer (After)</div>
      </div>

      <div className="divide-y divide-border/40 max-h-64 overflow-y-auto">
        {allKeys.map((key) => {
          const beforeVal = b[key];
          const afterVal = a[key];
          const isChanged = JSON.stringify(beforeVal) !== JSON.stringify(afterVal);
          const isNew = beforeVal === undefined && afterVal !== undefined;
          const isDeleted = beforeVal !== undefined && afterVal === undefined;

          return (
            <div
              key={key}
              className={`grid grid-cols-12 gap-2 items-center p-2.5 transition-colors ${
                isChanged ? 'bg-primary/5 font-medium' : 'hover:bg-muted/30'
              }`}
            >
              <div className="col-span-4 font-medium text-foreground">
                <span>{fieldLabels[key] || key}</span>
                <span className="block font-mono text-[10px] text-muted-foreground">
                  {key}
                </span>
              </div>

              <div className="col-span-4 break-words">
                {isNew ? (
                  <span className="text-muted-foreground/60 italic flex items-center gap-1">
                    <Minus className="size-3" /> Yok (İlk Oluşturma)
                  </span>
                ) : (
                  <span className={isChanged ? 'text-destructive/90 line-through' : 'text-foreground'}>
                    {formatValue(beforeVal)}
                  </span>
                )}
              </div>

              <div className="col-span-4 break-words">
                {isDeleted ? (
                  <span className="text-destructive font-medium italic">Silindi</span>
                ) : (
                  <Badge
                    variant={isChanged ? 'default' : 'secondary'}
                    className="font-normal text-xs"
                  >
                    {formatValue(afterVal)}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
