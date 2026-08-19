import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { ticketsService } from '../services/tickets.service';

export function useCloseTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketsService.closeTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(id) });
    },
  });
}
