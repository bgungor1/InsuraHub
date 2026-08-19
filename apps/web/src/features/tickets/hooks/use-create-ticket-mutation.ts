import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { ticketsService } from '../services/tickets.service';
import type { CreateTicketPayload } from '../types/tickets.types';

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => ticketsService.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
  });
}
