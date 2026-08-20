import { ColDef } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import type { User, UserRole } from '../types/user.types';

const roleLabels: Record<
  UserRole,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  SUPERADMIN: { label: 'Sistem Yöneticisi', variant: 'default' },
  COMPANY_USER: { label: 'Şirket Yetkilisi', variant: 'secondary' },
  AGENCY_MANAGER: { label: 'Acente Müdürü', variant: 'outline' },
  BRANCH_MANAGER: { label: 'Şube Müdürü', variant: 'outline' },
  BROKER: { label: 'Broker (Temsilci)', variant: 'secondary' },
};

export function getUserColumnDefs(
  onToggleActive: (user: User) => void,
  isPending: boolean,
): ColDef<User>[] {
  return [
    {
      headerName: 'Ad Soyad',
      flex: 2,
      minWidth: 160,
      filter: true,
      valueGetter: (params) =>
        `${params.data?.firstName || ''} ${params.data?.lastName || ''}`.trim(),
    },
    {
      field: 'email',
      headerName: 'E-posta',
      flex: 2,
      minWidth: 180,
      filter: true,
    },
    {
      field: 'role',
      headerName: 'Rol',
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params: { value: UserRole }) => {
        const info = roleLabels[params.value] || {
          label: params.value,
          variant: 'outline',
        };
        return (
          <Badge variant={info.variant} className="text-[11px] font-medium">
            {info.label}
          </Badge>
        );
      },
    },
    {
      headerName: 'Organizasyon',
      flex: 2,
      minWidth: 160,
      valueGetter: (params) => {
        const d = params.data;
        if (!d) return '-';
        if (d.role === 'SUPERADMIN') return 'Merkez Sistem';
        if (d.role === 'COMPANY_USER') return d.company?.name || '-';
        if (d.role === 'AGENCY_MANAGER') return d.agency?.name || '-';
        if (d.role === 'BRANCH_MANAGER' || d.role === 'BROKER')
          return d.branch?.name || '-';
        return '-';
      },
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      width: 120,
      cellRenderer: (params: { data?: User }) => {
        const u = params.data;
        if (!u) return null;
        const isActive = u.isActive !== false;
        return (
          <button
            type="button"
            title="Durumu değiştirmek için tıklayın"
            disabled={isPending}
            onClick={() => onToggleActive(u)}
            className="inline-flex items-center transition-transform hover:scale-105 active:scale-95"
          >
            <Badge
              variant={isActive ? 'default' : 'destructive'}
              className="cursor-pointer text-[10px] font-medium transition-colors"
            >
              {isActive ? '● Aktif' : '○ Pasif'}
            </Badge>
          </button>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Kayıt Tarihi',
      width: 130,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-',
    },
  ];
}
