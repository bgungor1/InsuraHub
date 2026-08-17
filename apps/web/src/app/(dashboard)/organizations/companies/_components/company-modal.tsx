'use client';

import * as React from 'react';
import { CreateCompanyDialog } from '@/features/companies';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyModal({ isOpen, onClose }: CompanyModalProps) {
  return <CreateCompanyDialog open={isOpen} onOpenChange={(open) => !open && onClose()} />;
}
