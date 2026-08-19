import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import type { TicketCategory, TicketStatus } from '../types/tickets.types';

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  POLICY_ISSUE: 'Poliçe İşlemi',
  COMMISSION_INQUIRY: 'Komisyon Sorusu',
  TECHNICAL_SUPPORT: 'Teknik Destek',
  GENERAL_REQUEST: 'Genel Talep',
};

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }
> = {
  OPEN: {
    label: 'Açık',
    variant: 'default',
    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  IN_PROGRESS: {
    label: 'İşlemde',
    variant: 'secondary',
    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  RESOLVED: {
    label: 'Çözüldü',
    variant: 'outline',
    className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20',
  },
  CLOSED: {
    label: 'Kapatıldı',
    variant: 'secondary',
    className: 'bg-muted text-muted-foreground',
  },
};

export function TicketCategoryBadge({ category }: { category: TicketCategory }) {
  return (
    <Badge variant="outline" className="text-xs font-normal">
      {CATEGORY_LABELS[category] || category}
    </Badge>
  );
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    variant: 'secondary' as const,
    className: '',
  };

  return (
    <Badge variant={config.variant} className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
