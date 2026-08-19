import * as React from 'react';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketCategoryBadge, TicketStatusBadge } from './ticket-status-badge';
import type { TicketItem } from '../types/tickets.types';

interface TicketCardProps {
  ticket: TicketItem;
  onSelect: (ticket: TicketItem) => void;
  onClose: (id: string) => void;
  isClosing?: boolean;
}

export function TicketCard({ ticket, onSelect, onClose, isClosing }: TicketCardProps) {
  const isClosed = ticket.status === 'CLOSED';

  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-xs transition-colors hover:border-border sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground text-sm cursor-pointer hover:underline" onClick={() => onSelect(ticket)}>
            {ticket.subject}
          </span>
          <TicketStatusBadge status={ticket.status} />
          <TicketCategoryBadge category={ticket.category} />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            {ticket.creator.firstName} {ticket.creator.lastName} ({ticket.creator.role.replace('_', ' ')})
          </span>
          <span>•</span>
          <span>Şube: {ticket.creator.branch?.name || '-'}</span>
          <span>•</span>
          <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
          {ticket._count?.messages ? (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <MessageSquare className="size-3" />
                {ticket._count.messages} mesaj
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onSelect(ticket)}>
          Detay & Yanıtla
        </Button>
        {!isClosed && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
            onClick={() => onClose(ticket.id)}
            disabled={isClosing}
          >
            <CheckCircle2 className="size-3.5 mr-1" />
            Kapat
          </Button>
        )}
      </div>
    </div>
  );
}
