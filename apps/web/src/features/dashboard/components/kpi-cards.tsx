'use client';

import * as React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  DashboardFinancials,
  DashboardCounters,
} from '../types/dashboard.types';
import { getKpiCardsForRole } from './kpi-card-configs';

interface KpiCardsProps {
  financials: DashboardFinancials;
  counters: DashboardCounters;
}

export function KpiCards({ financials, counters }: KpiCardsProps) {
  const user = useAuthStore((state) => state.user);

  const cards = React.useMemo(
    () => getKpiCardsForRole(user?.role, financials, counters),
    [user?.role, financials, counters],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, icon: Icon, color }) => (
        <Card key={title} className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div
              className={`flex size-8 items-center justify-center rounded-lg ${color}`}
            >
              <Icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
