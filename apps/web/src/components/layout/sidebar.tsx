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
    roles: ['SUPERADMIN', 'COMPANY_USER', 'AGENCY_MANAGER'],
  },
  {
    title: 'Kullanıcılar',
    href: '/users',
    icon: Users,
    roles: ['SUPERADMIN', 'COMPANY_USER', 'AGENCY_MANAGER', 'BRANCH_MANAGER'],
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
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/60 bg-sidebar/95 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Shield className="size-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">InsuraHub</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Menü
          </div>
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className={cn('size-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/40 p-4">
          <div className="rounded-lg bg-muted/40 p-3 border border-border/30">
            <div className="text-[11px] font-medium uppercase text-muted-foreground">Kapsam</div>
            <div className="mt-0.5 truncate text-xs font-semibold text-foreground">
              {organizationLabel}
            </div>
            <Badge variant="secondary" className="mt-2 text-[10px] uppercase tracking-wide">
              {user?.role.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </aside>
    </>
  );
}
