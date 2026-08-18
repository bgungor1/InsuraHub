import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { usersService } from '../services/users.service';
import type { UsersQueryParams } from '../types/user.types';

export function useUsersQuery(params?: UsersQueryParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => usersService.getUsers(params),
  });
}
