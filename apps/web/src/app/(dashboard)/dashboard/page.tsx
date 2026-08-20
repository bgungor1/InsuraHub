'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { queryKeys } from '@/lib/api';
import {
  useDashboardSummaryQuery,
  KpiCards,
  PolicyStatusChart,
  CommissionDistributionChart,
  RecentActivitiesTable,
} from '@/features/dashboard';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useDashboardSummaryQuery();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
  };

  const orgName =
    user?.branch?.name ||
    user?.agency?.name ||
    user?.company?.name ||
    'Genel Merkez';

  const isBroker = user?.role === 'BROKER';

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Hoş Geldiniz, {user?.firstName} {user?.lastName}
            </h2>
            <Badge
              variant="secondary"
              className="font-semibold uppercase tracking-wider text-[10px]"
            >
              {user?.role.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {orgName} bünyesindeki anlık poliçe ve finansal dağılım özetiniz.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Verileri Yenile
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
          Finansal göstergeler yükleniyor...
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Dashboard verileri alınamadı.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tekrar Dene
          </Button>
        </div>
      ) : summary ? (
        <>
          <KpiCards
            financials={summary.financials}
            counters={summary.counters}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/60 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Poliçe Durum Dağılımı
                </CardTitle>
                <CardDescription className="text-xs">
                  {isBroker
                    ? 'Sorumlu olduğunuz poliçelerin aşama durumu'
                    : 'Sistemdeki poliçelerin yaşam döngüsü dağılımı'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <PolicyStatusChart data={summary.policiesByState} />
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  {isBroker
                    ? 'Komisyon & Hakediş Analizi'
                    : 'Komisyon Hakediş Dağılımı'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isBroker
                    ? 'Üretimlerinizden hak ettiğiniz komisyon payı'
                    : 'Kademelere göre dağıtılan komisyon payları'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <CommissionDistributionChart financials={summary.financials} />
              </CardContent>
            </Card>
          </div>

          <RecentActivitiesTable activities={summary.recentActivities} />
        </>
      ) : null}
    </div>
  );
}
