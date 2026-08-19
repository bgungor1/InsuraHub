import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { commissionsService } from '../services/commissions.service';
import type { CreateCommissionRuleInput } from '../types/commission.types';

interface UseCreateCommissionRuleMutationProps {
  onSuccess?: () => void;
}

export function useCreateCommissionRuleMutation({
  onSuccess,
}: UseCreateCommissionRuleMutationProps = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommissionRuleInput) => commissionsService.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all });
      toast.success('Yeni komisyon kuralı başarıyla oluşturuldu ve aktif edildi.');
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Komisyon kuralı oluşturulamadı.');
    },
  });
}
