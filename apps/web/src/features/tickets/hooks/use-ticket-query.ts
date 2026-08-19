import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { ticketsService } from '../services/tickets.service';

export function useTicketQuery(id: string | null) {
  return useQuery({
    queryKey: id ? queryKeys.tickets.detail(id) : ['tickets', 'null'],
    queryFn: () => (id ? ticketsService.getTicket(id) : null),
    enabled: Boolean(id),
  });
}
