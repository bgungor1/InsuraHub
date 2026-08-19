import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { ticketsService } from '../services/tickets.service';
import type { TicketFilters } from '../types/tickets.types';

export function useTicketsQuery(filters?: TicketFilters) {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters),
    queryFn: () => ticketsService.getTickets(filters),
  });
}
