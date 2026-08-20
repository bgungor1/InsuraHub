import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { queryKeys } from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types/auth.types';

export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.clear();
        queryClient.setQueryData(queryKeys.auth.me(), data.user);
        setUser(data.user);
      }
    },
  });
}
