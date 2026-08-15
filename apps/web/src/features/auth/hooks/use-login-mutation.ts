import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { LoginRequest, LoginResponse } from '@/types/auth.types';

export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
    },
  });
}
