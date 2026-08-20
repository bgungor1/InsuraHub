import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { companiesService } from '../services/companies.service';
import type { CreateCompanyInput } from '../types/company.types';

export function useUpdateCompanyMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCompanyInput> }) =>
      companiesService.updateCompany(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success(
        `Şirket durumu güncellendi: ${updated.isActive !== false ? 'Aktif' : 'Pasif'}`
      );
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Şirket güncellenirken bir hata oluştu.';
      toast.error(msg);
    },
  });
}
