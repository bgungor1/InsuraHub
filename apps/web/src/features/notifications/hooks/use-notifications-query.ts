import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { notificationsService } from '../services/notifications.service';

export function useNotificationsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.notifications.list({ page, limit }),
    queryFn: () => notificationsService.getNotifications(page, limit),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
