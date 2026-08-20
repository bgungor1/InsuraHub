import {
  Briefcase,
  Building,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react';
import type {
  DashboardFinancials,
  DashboardCounters,
} from '../types/dashboard.types';
import type { UserRole } from '@/types/auth.types';

const formatMoney = (val: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
    val || 0,
  );

export interface KpiCardConfig {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function getKpiCardsForRole(
  role: UserRole | undefined,
  financials: DashboardFinancials,
  counters: DashboardCounters,
): KpiCardConfig[] {
  if (role === 'BROKER') {
    return [
      {
        title: 'Toplam Üretim Primi',
        value: formatMoney(financials.totalPremium),
        icon: Wallet,
        color: 'text-blue-500 bg-blue-500/10',
      },
      {
        title: 'Hak Edilen Komisyonum',
        value: formatMoney(financials.commissions.broker),
        icon: ShieldCheck,
        color: 'text-purple-500 bg-purple-500/10',
      },
      {
        title: 'Tamamlanan Poliçelerim',
        value: counters.completedPolicies.toString(),
        icon: CheckCircle2,
        color: 'text-emerald-500 bg-emerald-500/10',
      },
      {
        title: 'İşlemdeki Poliçelerim',
        value: counters.activeClaims.toString(),
        icon: Clock,
        color: 'text-amber-500 bg-amber-500/10',
      },
    ];
  }

  if (role === 'BRANCH_MANAGER') {
    return [
      {
        title: 'Toplam Şube Primi',
        value: formatMoney(financials.totalPremium),
        icon: Wallet,
        color: 'text-blue-500 bg-blue-500/10',
      },
      {
        title: 'Şube Komisyon Geliri',
        value: formatMoney(financials.commissions.branch),
        icon: Building,
        color: 'text-emerald-500 bg-emerald-500/10',
      },
      {
        title: 'Broker Hakedişleri',
        value: formatMoney(financials.commissions.broker),
        icon: ShieldCheck,
        color: 'text-purple-500 bg-purple-500/10',
      },
      {
        title: 'Şube Müşteri Sayısı',
        value: counters.totalCustomers.toString(),
        icon: Users,
        color: 'text-amber-500 bg-amber-500/10',
      },
    ];
  }

  if (role === 'AGENCY_MANAGER') {
    return [
      {
        title: 'Toplam Acente Primi',
        value: formatMoney(financials.totalPremium),
        icon: Wallet,
        color: 'text-blue-500 bg-blue-500/10',
      },
      {
        title: 'Acente Komisyon Geliri',
        value: formatMoney(financials.commissions.agency),
        icon: Building,
        color: 'text-emerald-500 bg-emerald-500/10',
      },
      {
        title: 'Şube Dağıtımı',
        value: formatMoney(financials.commissions.branch),
        icon: Briefcase,
        color: 'text-amber-500 bg-amber-500/10',
      },
      {
        title: 'Broker Hakedişleri',
        value: formatMoney(financials.commissions.broker),
        icon: ShieldCheck,
        color: 'text-purple-500 bg-purple-500/10',
      },
    ];
  }

  return [
    {
      title: 'Toplam Prim Hacmi',
      value: formatMoney(financials.totalPremium),
      icon: Wallet,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Şirket Net Geliri',
      value: formatMoney(financials.commissions.company),
      icon: Building,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Acente & Şube Dağıtımı',
      value: formatMoney(
        financials.commissions.agency + financials.commissions.branch,
      ),
      icon: Briefcase,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Broker Hakedişleri',
      value: formatMoney(financials.commissions.broker),
      icon: ShieldCheck,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];
}
