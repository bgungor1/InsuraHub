'use client';

import * as React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, Clock, LifeBuoy, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const orgName =
    user?.branch?.name || user?.agency?.name || user?.company?.name || 'Genel Merkez';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Hoş Geldiniz, {user?.firstName} {user?.lastName}
            </h2>
            <Badge variant="secondary" className="font-semibold uppercase tracking-wider text-[10px]">
              {user?.role.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {orgName} bünyesindeki anlık poliçe, komisyon ve talep durumlarınız.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Poliçeler</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <FileText className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600">
              <ArrowUpRight className="size-3.5" />
              <span>Bu ay %12 artış</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Komisyon</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺45.850</div>
            <p className="text-xs text-muted-foreground mt-1">Cari dönem hakediş</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">İşlem Bekleyenler</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">Onay/Sahiplenme bekliyor</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Açık Destek Talepleri</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <LifeBuoy className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 teknik, 1 onay</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Area */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Son Poliçe İşlemleri</CardTitle>
            <CardDescription>Şubenize ait en son düzenlenen poliçeler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <FileText className="size-8 mb-2 stroke-1" />
              <p className="text-sm">Poliçe modülü yüklendiğinde AG-Grid listesi burada yer alacaktır.</p>
              <Link href="/policies" className="mt-3 text-xs font-semibold text-primary hover:underline">
                Poliçelere Git →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Operasyonel Destek Havuzu</CardTitle>
            <CardDescription>Genel Merkez operasyon birimine açılan talepler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <LifeBuoy className="size-8 mb-2 stroke-1" />
              <p className="text-sm">Destek modülü üzerinden şirket operasyon birimine talep iletebilirsiniz.</p>
              <Link href="/tickets" className="mt-3 text-xs font-semibold text-primary hover:underline">
                Destek Taleplerine Git →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
