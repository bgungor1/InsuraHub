import { ColDef } from 'ag-grid-community';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Company } from '../types/company.types';

export function getCompanyColumnDefs(
  onToggleActive: (company: Company) => void,
  isPending: boolean,
): ColDef<Company>[] {
  return [
    {
      field: 'name',
      headerName: 'Şirket Adı',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: { value: string }) => (
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Building2 className="size-4 text-primary shrink-0" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: 'taxNumber',
      headerName: 'Vergi Numarası',
      flex: 1,
      minWidth: 140,
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: 'Acente Sayısı',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.data?._count?.agencies ?? 0,
    },
    {
      headerName: 'Kullanıcı Sayısı',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.data?._count?.users ?? 0,
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: { data?: Company }) => {
        const c = params.data;
        if (!c) return null;
        const isActive = c.isActive !== false;
        return (
          <button
            type="button"
            title="Durumu değiştirmek için tıklayın"
            disabled={isPending}
            onClick={() => onToggleActive(c)}
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
