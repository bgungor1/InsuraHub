import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { policiesService } from '../services/policies.service';

export function usePolicyActionsMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.policies.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  };

  const claimMutation = useMutation({
    mutationFn: (id: string) => policiesService.claimPolicy(id),
    onSuccess: () => {
      invalidate();
      toast.success('Poliçe başarıyla üzerinize alındı.');
    },
    onError: (error: Error) => toast.error(error.message || 'Poliçe talep edilemedi.'),
  });

  const releaseMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      policiesService.releasePolicy(id, reason),
    onSuccess: () => {
      invalidate();
      toast.success('Poliçe havuza iade edildi.');
    },
    onError: (error: Error) => toast.error(error.message || 'Poliçe iade edilemedi.'),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, totalAmount }: { id: string; totalAmount: number }) =>
      policiesService.completePolicy(id, totalAmount),
    onSuccess: () => {
      invalidate();
      toast.success('Poliçe tamamlandı ve komisyon payları hesaplandı.');
    },
    onError: (error: Error) => toast.error(error.message || 'Poliçe tamamlanamadı.'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => policiesService.cancelPolicy(id),
    onSuccess: () => {
      invalidate();
      toast.success('Poliçe iptal edildi.');
    },
    onError: (error: Error) => toast.error(error.message || 'Poliçe iptal edilemedi.'),
  });

  return {
    claimMutation,
    releaseMutation,
    completeMutation,
    cancelMutation,
  };
}
