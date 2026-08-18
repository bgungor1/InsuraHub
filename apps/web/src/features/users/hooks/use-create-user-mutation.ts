import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { usersService } from '../services/users.service';
import type { CreateUserInput } from '../types/user.types';

interface MutationOptions {
  onSuccess?: () => void;
}

export function useCreateUserMutation(options?: MutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => usersService.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast.success('Kullanıcı başarıyla oluşturuldu');
      options?.onSuccess?.();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || 'Kullanıcı oluşturulamadı';
      toast.error(message);
    },
  });
}
