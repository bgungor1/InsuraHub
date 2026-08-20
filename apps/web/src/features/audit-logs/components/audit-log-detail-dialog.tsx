'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Layers } from 'lucide-react';
import type { AuditLog } from '../types/audit-log.types';
import { AuditLogDiffViewer } from './audit-log-diff-viewer';

interface AuditLogDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailDialog({
  log,
  open,
  onOpenChange,
}: AuditLogDetailDialogProps) {
  const [showRawJson, setShowRawJson] = React.useState(false);
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <DialogTitle className="flex items-center gap-2">
              <span>Denetim & Değişiklik İnceleme</span>
              <Badge variant="outline" className="font-mono text-xs">
                {log.action}
              </Badge>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRawJson(!showRawJson)}
              className="h-7 gap-1.5 text-xs text-muted-foreground"
            >
              {showRawJson ? <Layers className="size-3.5" /> : <Code className="size-3.5" />}
              {showRawJson ? 'Görsel Tablo' : 'Ham JSON'}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2.5 rounded-lg border bg-muted/30 p-3">
            <div>
              <span className="text-muted-foreground text-[11px]">İşlemi Yapan (Actor):</span>
              <p className="font-semibold text-foreground">
                {log.actor
                  ? `${log.actor.firstName} ${log.actor.lastName}`
                  : log.actorId}
              </p>
              <p className="text-[11px] text-muted-foreground">{log.actor?.email || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-[11px]">Yetki Rolü:</span>
              <p className="font-semibold text-foreground">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold mt-0.5">
                  {log.actor?.role || 'SİSTEM'}
                </Badge>
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-[11px]">Varlık Türü / Referans ID:</span>
              <p className="font-mono font-medium text-foreground">
                {log.entityType} <span className="text-muted-foreground">({log.entityId})</span>
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-[11px]">Kayıt Tarihi:</span>
              <p className="font-semibold text-foreground">
                {new Date(log.createdAt).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">
              Parametrik Değişiklik Özeti (Diff)
            </h4>
            {showRawJson ? (
              <div className="grid grid-cols-2 gap-2">
                <pre className="max-h-56 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[11px]">
                  {JSON.stringify(log.before, null, 2) || 'null'}
                </pre>
                <pre className="max-h-56 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[11px]">
                  {JSON.stringify(log.after, null, 2) || 'null'}
                </pre>
              </div>
            ) : (
              <AuditLogDiffViewer before={log.before} after={log.after} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
