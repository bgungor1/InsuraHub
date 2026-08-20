'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  FileText,
  DollarSign,
  LifeBuoy,
  Building2,
  Users,
  ShieldAlert,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthUser, UserRole } from '@/types/auth.types';
import { useUiStore } from '@/stores/ui.store';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Poliçeler', href: '/policies', icon: FileText },
  { title: 'Komisyon & Hakediş', href: '/commissions', icon: DollarSign },
  { title: 'Destek & Talepler', href: '/tickets', icon: LifeBuoy },
  {
    title: 'Organizasyon',
    href: '/organizations',
    icon: Building2,
    roles: ['SUPERADMIN', 'COMPANY_USER', 'AGENCY_MANAGER', 'BRANCH_MANAGER'],
  },
  {
    title: 'Kullanıcılar',
    href: '/users',
    icon: Users,
    roles: ['SUPERADMIN', 'COMPANY_USER', 'AGENCY_MANAGER', 'BRANCH_MANAGER'],
  },
  {
    title: 'Denetim İzi (Audit)',
    href: '/audit-logs',
    icon: ShieldAlert,
    roles: ['SUPERADMIN', 'COMPANY_USER'],
  },
];

export function Sidebar({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  const filteredNavItems = React.useMemo(() => {
    if (!user) return [];
    return navItems.filter(
      (item) => !item.roles || item.roles.includes(user.role)
    );
  }, [user]);

  const organizationLabel =
    user?.branch?.name || user?.agency?.name || user?.company?.name || 'Genel Merkez';

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/60 bg-card transition-transform duration-300 lg:static lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-6">
          <div className="flex items-center gap-2.5 font-bold tracking-tight text-foreground">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Shield className="size-5" />
            </div>
            <span className="text-lg">InsuraHub</span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Menüyü kapat"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className={cn('size-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/60 p-4">
          <div className="rounded-xl border border-border/50 bg-muted/40 p-3">
            <div className="text-xs font-semibold text-foreground truncate">
              {organizationLabel}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                {user?.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
