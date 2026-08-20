import { ColDef } from 'ag-grid-community';
import { Store, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Agency } from '../types/agency.types';

export function getAgencyColumnDefs(
  onToggleActive: (agency: Agency) => void,
  isPending: boolean,
): ColDef<Agency>[] {
  return [
    {
      field: 'name',
      headerName: 'Acente Adı',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: { value: string }) => (
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Store className="size-4 text-primary shrink-0" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Bağlı Şirket',
      flex: 2,
      minWidth: 180,
      valueGetter: (params) => params.data?.company?.name || '-',
      cellRenderer: (params: { value: string }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="size-3.5 text-muted-foreground/70 shrink-0" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Şube Sayısı',
      flex: 1,
      minWidth: 110,
      valueGetter: (params) => params.data?._count?.branches ?? 0,
    },
    {
      headerName: 'Kullanıcı Sayısı',
      flex: 1,
      minWidth: 110,
      valueGetter: (params) => params.data?._count?.users ?? 0,
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: { data?: Agency }) => {
        const a = params.data;
        if (!a) return null;
        const isActive = a.isActive !== false;
        return (
          <button
            type="button"
            title="Durumu değiştirmek için tıklayın"
            disabled={isPending}
            onClick={() => onToggleActive(a)}
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
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-',
    },
  ];
}
