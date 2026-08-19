import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecentActivity } from '../types/dashboard.types';

const formatMoney = (val: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);

interface RecentActivitiesTableProps {
  activities: RecentActivity[];
}

export function RecentActivitiesTable({ activities }: RecentActivitiesTableProps) {
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Son Finansal İşlemler</CardTitle>
          <CardDescription className="text-xs">Tamamlanan son poliçelerin dağıtımları</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
          <Link href="/commissions">
            Tümünü Gör
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {activities.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground">
            Henüz tamamlanmış finansal işlem bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-border/50 text-xs">
            {activities.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.product}</p>
                    <p className="text-[11px] text-muted-foreground">{item.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatMoney(item.totalAmount)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(item.calculatedAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
