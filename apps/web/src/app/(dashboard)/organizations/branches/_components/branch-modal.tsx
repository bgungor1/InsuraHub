'use client';

import * as React from 'react';
import { CreateBranchDialog } from '@/features/branches';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAgencyId?: string;
}

export function BranchModal({ isOpen, onClose, defaultAgencyId }: BranchModalProps) {
  return (
    <CreateBranchDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      defaultAgencyId={defaultAgencyId}
    />
  );
}
