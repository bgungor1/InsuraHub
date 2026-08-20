'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function OrganizationsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (user?.role === 'SUPERADMIN') {
      router.replace('/organizations/companies');
    } else if (
      user?.role === 'COMPANY_USER' ||
      user?.role === 'AGENCY_MANAGER'
    ) {
      router.replace('/organizations/agencies');
    } else {
      router.replace('/organizations/branches');
    }
  }, [user, router]);

  return (
    <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
      Organizasyon birimi yükleniyor...
    </div>
  );
}
