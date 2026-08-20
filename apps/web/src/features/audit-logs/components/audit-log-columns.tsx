import type { ColDef } from 'ag-grid-community';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AuditLog } from '../types/audit-log.types';

export function getAuditLogColumnDefs(
  onViewDetail: (log: AuditLog) => void,
): ColDef<AuditLog>[] {
  return [
    {
      headerName: 'Tarih & Saat',
      field: 'createdAt',
      width: 180,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString('tr-TR') : '-',
    },
    {
      headerName: 'Kullanıcı (Actor)',
      field: 'actor',
      flex: 1.5,
      minWidth: 240,
      cellRenderer: (params: { data: AuditLog | undefined }) => {
        if (!params.data) return null;
        const actor = params.data.actor;
        return (
          <div className="flex flex-col justify-center h-full py-1">
            <span className="font-semibold text-foreground text-xs leading-snug truncate">
              {actor ? `${actor.firstName} ${actor.lastName}` : params.data.actorId}
            </span>
            <span className="text-[11px] text-muted-foreground leading-snug truncate">
              {actor?.email || '-'}
            </span>
          </div>
        );
      },
    },
    {
      headerName: 'Rol',
      field: 'actor.role',
      width: 140,
      cellRenderer: (params: { value: string | undefined }) => (
        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
          {params.value || 'SİSTEM'}
        </Badge>
      ),
    },
    {
      headerName: 'Aksiyon',
      field: 'action',
      width: 180,
      cellRenderer: (params: { value: string }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Varlık Türü',
      field: 'entityType',
      width: 140,
      cellRenderer: (params: { value: string }) => (
        <Badge variant="outline" className="text-[11px] font-medium">
          {params.value}
        </Badge>
      ),
    },
    {
      headerName: 'Detay',
      width: 80,
      cellRenderer: (params: { data: AuditLog | undefined }) => {
        if (!params.data) return null;
        return (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewDetail(params.data!)}
            title="Değişiklik Detaylarını İncele"
          >
            <Eye className="size-4 text-muted-foreground hover:text-foreground" />
          </Button>
        );
      },
    },
  ];
}
