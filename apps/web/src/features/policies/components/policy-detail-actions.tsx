'use client';

import * as React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Policy } from '../types/policy.types';
import { usePolicyActionsMutations } from '../hooks/use-policy-actions-mutations';

interface PolicyDetailActionsProps {
  policy: Policy;
  onClose: () => void;
  onCompleteClick?: (policy: Policy) => void;
}

export function PolicyDetailActions({
  policy,
  onClose,
  onCompleteClick,
}: PolicyDetailActionsProps) {
  const { claimMutation, releaseMutation, cancelMutation } =
    usePolicyActionsMutations();

  return (
    <div className="flex items-center justify-between w-full pt-2">
      <Button variant="outline" size="sm" onClick={onClose}>
        Kapat
      </Button>

      <div className="flex items-center gap-1.5">
        {policy.state === 'UNASSIGNED' && (
          <Button
            size="sm"
            className="gap-1 bg-primary text-xs"
            disabled={claimMutation.isPending}
            onClick={() => {
              claimMutation.mutate(policy.id);
              onClose();
            }}
          >
            <Shield className="size-3.5" />
            {claimMutation.isPending ? 'Alınıyor...' : 'Poliçeyi Üzerime Al'}
          </Button>
        )}

        {policy.state === 'CLAIMED' && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              disabled={releaseMutation.isPending}
              onClick={() => {
                releaseMutation.mutate({ id: policy.id });
                onClose();
              }}
            >
              Havuza Bırak
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="text-xs"
              disabled={cancelMutation.isPending}
              onClick={() => {
                cancelMutation.mutate(policy.id);
                onClose();
              }}
            >
              İptal Et
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              onClick={() => {
                onClose();
                onCompleteClick?.(policy);
              }}
            >
              <CheckCircle2 className="size-3.5" />
              Onayla & Tamamla
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
