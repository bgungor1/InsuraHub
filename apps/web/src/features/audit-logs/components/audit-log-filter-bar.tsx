'use client';

import * as React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AuditLogFilters } from '../types/audit-log.types';

interface AuditLogFilterBarProps {
  filters: AuditLogFilters;
  onChange: (filters: AuditLogFilters) => void;
}

export function AuditLogFilterBar({
  filters,
  onChange,
}: AuditLogFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Filter className="size-4" />
        Filtrele:
      </div>

      <div className="w-48">
        <Input
          placeholder="Aksiyon ara (Örn: CREATE)..."
          className="h-8 text-xs"
          value={filters.action || ''}
          onChange={(e) =>
            onChange({ ...filters, action: e.target.value || undefined })
          }
        />
      </div>

      <div className="w-48">
        <Select
          value={filters.entityType || 'ALL'}
          onValueChange={(val) =>
            onChange({
              ...filters,
              entityType: val === 'ALL' ? undefined : val,
            })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Varlık Türü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tüm Varlıklar</SelectItem>
            <SelectItem value="POLICY">Poliçeler (POLICY)</SelectItem>
            <SelectItem value="USER">Kullanıcılar (USER)</SelectItem>
            <SelectItem value="COMMISSION_RULE">Komisyon Kuralları</SelectItem>
            <SelectItem value="COMPANY">Şirket / Organizasyon</SelectItem>
            <SelectItem value="SYSTEM">Sistem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.action || filters.entityType) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground"
          onClick={() => onChange({})}
        >
          Filtreleri Temizle
        </Button>
      )}
    </div>
  );
}
