'use client';

import * as React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Policy } from '../types/policy.types';

export interface PolicyTableActionsProps {
  policy: Policy;
  onDetailClick: (policy: Policy) => void;
  onCompleteClick: (policy: Policy) => void;
  onClaimClick: (id: string) => void;
  onReleaseClick: (id: string) => void;
  onCancelClick: (id: string) => void;
  isClaimPending: boolean;
  isReleasePending: boolean;
  isCancelPending: boolean;
}

export function PolicyTableActions({
  policy,
  onDetailClick,
  onCompleteClick,
  onClaimClick,
  onReleaseClick,
  onCancelClick,
  isClaimPending,
  isReleasePending,
  isCancelPending,
}: PolicyTableActionsProps) {
  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        title="Poliçe Detayını Görüntüle"
        onClick={() => onDetailClick(policy)}
      >
        <Eye className="size-3.5" />
      </Button>

      {policy.state === 'UNASSIGNED' && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs font-semibold"
          disabled={isClaimPending}
          onClick={() => onClaimClick(policy.id)}
        >
          {isClaimPending ? 'Alınıyor...' : 'Poliçeyi Al'}
        </Button>
      )}

      {policy.state === 'CLAIMED' && (
        <>
          <Button
            size="sm"
            className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2"
            onClick={() => onCompleteClick(policy)}
          >
            Tamamla
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            disabled={isReleasePending}
            onClick={() => onReleaseClick(policy.id)}
          >
            Havuza Bırak
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 text-xs px-2"
            disabled={isCancelPending}
            onClick={() => onCancelClick(policy.id)}
          >
            İptal
          </Button>
        </>
      )}
    </div>
  );
}
