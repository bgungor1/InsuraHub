import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  TicketStatusBadge,
  TicketCategoryBadge,
} from './ticket-status-badge';

describe('Ticket Badges Components', () => {
  it('should render correct Turkish label for OPEN status', () => {
    render(<TicketStatusBadge status="OPEN" />);
    expect(screen.getByText('Açık')).toBeInTheDocument();
  });

  it('should render correct Turkish label for CLOSED status', () => {
    render(<TicketStatusBadge status="CLOSED" />);
    expect(screen.getByText('Kapatıldı')).toBeInTheDocument();
  });

  it('should render correct Turkish label for IN_PROGRESS status', () => {
    render(<TicketStatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('İşlemde')).toBeInTheDocument();
  });

  it('should render correct Turkish label for POLICY_ISSUE category', () => {
    render(<TicketCategoryBadge category="POLICY_ISSUE" />);
    expect(screen.getByText('Poliçe İşlemi')).toBeInTheDocument();
  });

  it('should render correct Turkish label for COMMISSION_INQUIRY category', () => {
    render(<TicketCategoryBadge category="COMMISSION_INQUIRY" />);
    expect(screen.getByText('Komisyon Sorusu')).toBeInTheDocument();
  });
});
