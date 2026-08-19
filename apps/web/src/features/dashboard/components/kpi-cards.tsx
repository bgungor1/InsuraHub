import * as React from 'react';
import { Briefcase, Building, ShieldCheck, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardFinancials } from '../types/dashboard.types';

const formatMoney = (val: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);

interface KpiCardsProps {
  financials: DashboardFinancials;
}

export function KpiCards({ financials }: KpiCardsProps) {
  const cards = [
    {
      title: 'Toplam Prim Hacmi',
      amount: financials.totalPremium,
      icon: Wallet,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Şirket Geliri',
      amount: financials.commissions.company,
      icon: Building,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Acente & Şube Dağıtımı',
      amount: financials.commissions.agency + financials.commissions.branch,
      icon: Briefcase,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Broker Hakedişleri',
      amount: financials.commissions.broker,
      icon: ShieldCheck,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, amount, icon: Icon, color }) => (
        <Card key={title} className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
            <div className={`flex size-8 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight">{formatMoney(amount)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
