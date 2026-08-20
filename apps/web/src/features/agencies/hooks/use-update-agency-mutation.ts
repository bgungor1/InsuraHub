import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { agenciesService } from '../services/agencies.service';
import type { CreateAgencyInput } from '../types/agency.types';

export function useUpdateAgencyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAgencyInput> }) =>
      agenciesService.updateAgency(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agencies.all });
      toast.success(
        `Acente durumu güncellendi: ${updated.isActive !== false ? 'Aktif' : 'Pasif'}`
      );
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Acente güncellenirken bir hata oluştu.';
      toast.error(msg);
    },
  });
}
