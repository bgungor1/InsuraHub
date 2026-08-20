'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Store, GitBranch } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const tabs = React.useMemo(() => {
    const list = [];
    const role = user?.role;

    if (role === 'SUPERADMIN') {
      list.push({
        title: 'Sigorta Şirketleri',
        href: '/organizations/companies',
        icon: Building2,
      });
    }

    if (
      role === 'SUPERADMIN' ||
      role === 'COMPANY_USER' ||
      role === 'AGENCY_MANAGER'
    ) {
      list.push({
        title: 'Acenteler',
        href: '/organizations/agencies',
        icon: Store,
      });
    }

    if (
      role === 'SUPERADMIN' ||
      role === 'COMPANY_USER' ||
      role === 'AGENCY_MANAGER' ||
      role === 'BRANCH_MANAGER' ||
      role === 'BROKER'
    ) {
      list.push({
        title: 'Şubeler',
        href: '/organizations/branches',
        icon: GitBranch,
      });
    }

    return list;
  }, [user]);

  return (
    <div className="space-y-4">
      {tabs.length > 1 && (
        <div className="flex items-center gap-1 border-b border-border/60 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.title}</span>
              </Link>
            );
          })}
        </div>
      )}
      {children}
    </div>
  );
}
