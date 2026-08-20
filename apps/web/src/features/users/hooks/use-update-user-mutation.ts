import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { usersService } from '../services/users.service';
import type { CreateUserInput } from '../types/user.types';

export function useUpdateUserMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserInput> }) =>
      usersService.updateUser(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(
        `Kullanıcı durumu güncellendi: ${updated.isActive !== false ? 'Aktif' : 'Pasif'}`
      );
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Kullanıcı güncellenirken bir hata oluştu.';
      toast.error(msg);
    },
  });
}
