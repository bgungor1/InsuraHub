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
      if (data.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.accessToken);
        const isSecure = window.location.protocol === 'https:';
        document.cookie = `Authentication=${data.accessToken}; path=/; max-age=28800; SameSite=Lax${isSecure ? '; Secure' : ''}`;
      }
      if (data.user) {
        queryClient.clear();
        queryClient.setQueryData(queryKeys.auth.me(), data.user);
        setUser(data.user);
      }
    },
  });
}
