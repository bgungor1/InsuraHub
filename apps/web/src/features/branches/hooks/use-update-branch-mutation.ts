import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { branchesService } from '../services/branches.service';
import type { CreateBranchInput } from '../types/branch.types';

export function useUpdateBranchMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBranchInput> }) =>
      branchesService.updateBranch(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      toast.success(
        `Şube durumu güncellendi: ${updated.isActive !== false ? 'Aktif' : 'Pasif'}`
      );
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Şube güncellenirken bir hata oluştu.';
      toast.error(msg);
    },
  });
}
