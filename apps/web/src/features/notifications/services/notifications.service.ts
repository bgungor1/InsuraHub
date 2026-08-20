import { api } from '@/lib/api';
import type { NotificationsResponse, Notification } from '../types/notification.types';

export const notificationsService = {
  async getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    return api.get<NotificationsResponse>('/notifications', {
      params: { page, limit },
    });
  },

  async markAsRead(id: string): Promise<Notification> {
    return api.patch<Notification>(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<{ count: number }> {
    return api.post<{ count: number }>('/notifications/read-all');
  },
};
