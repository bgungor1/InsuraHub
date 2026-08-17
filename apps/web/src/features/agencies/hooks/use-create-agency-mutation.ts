import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { agenciesService } from '../services/agencies.service';
import { Agency, CreateAgencyInput } from '../types/agency.types';
import { queryKeys } from '@/lib/api';

interface UseCreateAgencyOptions {
  onSuccess?: (agency: Agency) => void;
  onError?: (error: Error) => void;
}

export function useCreateAgencyMutation(options?: UseCreateAgencyOptions) {
  const queryClient = useQueryClient();

  return useMutation<Agency, Error, CreateAgencyInput>({
    mutationFn: (data) => agenciesService.createAgency(data),
    onSuccess: (newAgency) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agencies.lists() });
      toast.success(`"${newAgency.name}" acentesi başarıyla oluşturuldu.`);
      options?.onSuccess?.(newAgency);
    },
    onError: (error) => {
      toast.error(error.message || 'Acente oluşturulurken bir hata meydana geldi.');
      options?.onError?.(error);
    },
  });
}
