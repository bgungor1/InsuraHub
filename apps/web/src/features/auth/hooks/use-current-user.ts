import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { queryKeys } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { AuthUser } from '@/types/auth.types';

export function useCurrentUser() {
  const { setUser, logout } = useAuthStore();

  return useQuery<AuthUser, Error>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        const response = await authService.getMe();
        setUser(response.user);
        return response.user;
      } catch (err) {
        logout();
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 dakika önbellek
    retry: false,
  });
}
