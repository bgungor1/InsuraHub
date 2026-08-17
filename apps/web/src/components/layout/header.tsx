'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, LogOut, Bell, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/types/auth.types';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/policies': 'Poliçe Yönetimi',
  '/commissions': 'Komisyon & Hakediş',
  '/tickets': 'Destek Talepleri',
  '/organizations': 'Organizasyon Yönetimi',
  '/users': 'Kullanıcılar',
};

export function Header({ user }: { user: AuthUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar } = useUiStore();
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const pageTitle = routeTitles[pathname] || 'Yönetim Paneli';

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label="Menüyü aç/kapat"
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <h1 className="text-base font-semibold text-foreground lg:text-lg">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="relative text-muted-foreground" aria-label="Bildirimler">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </Button>

        <div className="h-5 w-px bg-border/60" />

        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
            {initials || <User className="size-4" />}
          </div>
          <div className="hidden text-left md:block">
            <div className="text-xs font-semibold leading-none text-foreground">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Çıkış</span>
        </Button>
      </div>
    </header>
  );
}
