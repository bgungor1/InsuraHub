'use client';

import * as React from 'react';
import { CreateAgencyDialog } from '@/features/agencies';

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCompanyId?: string;
}

export function AgencyModal({ isOpen, onClose, defaultCompanyId }: AgencyModalProps) {
  return (
    <CreateAgencyDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      defaultCompanyId={defaultCompanyId}
    />
  );
}
