import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { branchesService } from '../services/branches.service';
import { Branch, CreateBranchInput } from '../types/branch.types';
import { queryKeys } from '@/lib/api';

interface UseCreateBranchOptions {
  onSuccess?: (branch: Branch) => void;
  onError?: (error: Error) => void;
}

export function useCreateBranchMutation(options?: UseCreateBranchOptions) {
  const queryClient = useQueryClient();

  return useMutation<Branch, Error, CreateBranchInput>({
    mutationFn: (data) => branchesService.createBranch(data),
    onSuccess: (newBranch) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.lists() });
      toast.success(`"${newBranch.name}" şubesi başarıyla oluşturuldu.`);
      options?.onSuccess?.(newBranch);
    },
    onError: (error) => {
      toast.error(error.message || 'Şube oluşturulurken bir hata meydana geldi.');
      options?.onError?.(error);
    },
  });
}
