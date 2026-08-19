import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { ticketsService } from '../services/tickets.service';
import type { AddTicketMessagePayload } from '../types/tickets.types';

export function useAddTicketMessageMutation(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddTicketMessagePayload) =>
      ticketsService.addMessage(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() });
    },
  });
}
