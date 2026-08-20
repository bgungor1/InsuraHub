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

  it('should render correct Turkish label for POLICY_APPROVAL category', () => {
    render(<TicketCategoryBadge category="POLICY_APPROVAL" />);
    expect(screen.getByText('Poliçe Onayı / İşlemi')).toBeInTheDocument();
  });

  it('should render correct Turkish label for TECHNICAL category', () => {
    render(<TicketCategoryBadge category="TECHNICAL" />);
    expect(screen.getByText('Teknik Destek')).toBeInTheDocument();
  });
});
