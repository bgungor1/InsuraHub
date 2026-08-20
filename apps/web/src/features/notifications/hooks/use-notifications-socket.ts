'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsSocket } from '@/lib/socket';
import { queryKeys } from '@/lib/api/query-keys';
import { useCurrentUser } from '@/features/auth';
import type { Notification } from '../types/notification.types';

export function useNotificationsSocket() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  React.useEffect(() => {
    if (!currentUser?.id) return;

    notificationsSocket.io.opts.query = { userId: currentUser.id };

    if (!notificationsSocket.connected) {
      notificationsSocket.connect();
    }

    notificationsSocket.emit('join_user_channel', currentUser.id);

    const handleNewNotification = (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });

      toast.info(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    };

    notificationsSocket.on('new_notification', handleNewNotification);

    return () => {
      notificationsSocket.off('new_notification', handleNewNotification);
    };
  }, [currentUser?.id, queryClient]);
}
