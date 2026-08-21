'use client';

import * as React from 'react';
import { KeyRound, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DemoAccount {
  roleName: string;
  email: string;
  badge: string;
  variant: 'default' | 'secondary' | 'outline';
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    roleName: 'Süper Admin',
    email: 'admin@insurahub.com',
    badge: 'SUPERADMIN',
    variant: 'default',
  },
  {
    roleName: 'Şirket Yetkilisi',
    email: 'sirket@insurahub.com',
    badge: 'COMPANY_USER',
    variant: 'secondary',
  },
  {
    roleName: 'Acente Müdürü',
    email: 'acenta@insurahub.com',
    badge: 'AGENCY_MANAGER',
    variant: 'outline',
  },
  {
    roleName: 'Şube Müdürü',
    email: 'sube1@insurahub.com',
    badge: 'BRANCH_MANAGER',
    variant: 'outline',
  },
  {
    roleName: 'Broker 1',
    email: 'broker1@insurahub.com',
    badge: 'BROKER',
    variant: 'secondary',
  },
  {
    roleName: 'Broker 2',
    email: 'broker2@insurahub.com',
    badge: 'BROKER',
    variant: 'secondary',
  },
  {
    roleName: 'Broker 3',
    email: 'broker3@insurahub.com',
    badge: 'BROKER',
    variant: 'secondary',
  },
];

interface DemoCredentialsCardProps {
  onSelect: (email: string, password: string) => void;
  disabled?: boolean;
}

export function DemoCredentialsCard({
  onSelect,
  disabled,
}: DemoCredentialsCardProps) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-semibold text-primary">
          <Sparkles className="size-3.5" />
          Test / Demo Hesapları
        </span>
        <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
          <KeyRound className="size-3" />
          Şifre: <span className="font-semibold text-foreground">123456</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <Button
            key={acc.email}
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onSelect(acc.email, '123456')}
            className="flex h-auto w-full items-center justify-between gap-1.5 rounded-lg border border-border/40 bg-card/60 px-2.5 py-1.5 text-left transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground">{acc.roleName}</div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">
                {acc.email}
              </div>
            </div>
            <Badge variant={acc.variant} className="shrink-0 text-[9px] px-1.5 py-0 font-mono">
              Seç
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
