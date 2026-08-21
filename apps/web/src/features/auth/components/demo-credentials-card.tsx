import * as React from 'react';
import { KeyRound, Users } from 'lucide-react';

interface DemoAccountInfo {
  role: string;
  email: string;
}

const DEMO_ACCOUNTS: DemoAccountInfo[] = [
  { role: 'Süper Admin', email: 'admin@insurahub.com' },
  { role: 'Şirket Yetkilisi', email: 'sirket@insurahub.com' },
  { role: 'Acente Müdürü', email: 'acenta@insurahub.com' },
  { role: 'Şube Müdürü', email: 'sube1@insurahub.com' },
  { role: 'Broker 1', email: 'broker1@insurahub.com' },
  { role: 'Broker 2', email: 'broker2@insurahub.com' },
  { role: 'Broker 3', email: 'broker3@insurahub.com' },
];

export function DemoCredentialsCard() {
  return (
    <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 p-4 text-xs">
      <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Users className="size-3.5 text-primary" />
          Test & Demo Hesapları
        </span>
        <div className="flex items-center gap-1 font-mono text-[11px] text-primary">
          <KeyRound className="size-3" />
          Ortak Şifre: <span className="font-bold text-foreground">123456</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {DEMO_ACCOUNTS.map((acc) => (
          <div
            key={acc.email}
            className="flex items-center justify-between rounded-md bg-background/50 px-2.5 py-1 text-[11px]"
          >
            <span className="font-medium text-muted-foreground">{acc.role}</span>
            <span className="font-mono text-foreground select-all">{acc.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
