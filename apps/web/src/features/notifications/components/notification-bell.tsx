'use client';

import * as React from 'react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotificationsQuery } from '../hooks/use-notifications-query';
import { useNotificationsMutations } from '../hooks/use-notifications-mutations';
import { useNotificationsSocket } from '../hooks/use-notifications-socket';
import { NotificationItem } from './notification-item';

export function NotificationBell() {
  useNotificationsSocket();
  const { data, isLoading } = useNotificationsQuery(1, 15);
  const { markAsReadMutation, markAllAsReadMutation } =
    useNotificationsMutations();

  const unreadCount = data?.unreadCount ?? 0;
  const notifications = data?.items ?? [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Bildirimler"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-xs animate-in zoom-in-50"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 sm:w-96 p-0 shadow-lg border-border/80"
      >
        <div className="flex items-center justify-between border-b px-4 py-2.5 bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-foreground">
              Bildirimler
            </span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount} yeni
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="h-6 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="size-3" />
              Tümünü Okundu Say
            </Button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Inbox className="size-8 opacity-30 mb-1.5" />
              <p className="text-xs font-medium">Henüz bir bildirim yok</p>
              <p className="text-[10px] text-muted-foreground/80">
                Taleplerinize yanıt geldiğinde burada göreceksiniz.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
