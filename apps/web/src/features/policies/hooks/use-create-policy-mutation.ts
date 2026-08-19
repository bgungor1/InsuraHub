import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { policiesService } from '../services/policies.service';
import type { CreatePolicyInput } from '../types/policy.types';

export function useCreatePolicyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePolicyInput) => policiesService.createPolicy(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.lists() });
      toast.success('Poliçe kaydı başarıyla oluşturuldu.');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Poliçe oluşturulurken bir hata meydana geldi.');
    },
  });
}
