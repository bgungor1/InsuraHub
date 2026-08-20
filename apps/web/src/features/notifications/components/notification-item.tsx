'use client';

import * as React from 'react';
import { MessageSquare, CheckCircle, ShieldAlert, Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Notification } from '../types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const isUnread = !notification.readAt;

  const getIcon = () => {
    switch (notification.type) {
      case 'TICKET_MESSAGE':
        return <MessageSquare className="size-4 text-blue-500" />;
      case 'TICKET_STATUS':
        return <CheckCircle className="size-4 text-emerald-500" />;
      case 'POLICY_CREATED':
      case 'POLICY_CLAIMED':
        return <ShieldAlert className="size-4 text-amber-500" />;
      default:
        return <Bell className="size-4 text-primary" />;
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-3 transition-colors ${
        isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
      }`}
    >
      <div className="mt-0.5 rounded-md border bg-card p-1.5 shadow-xs">
        {getIcon()}
      </div>

      <div className="flex-1 space-y-1 pr-6">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground leading-tight">
            {notification.title}
          </p>
          {isUnread && (
            <span className="size-2 rounded-full bg-primary ring-2 ring-primary/20" />
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          {notification.message}
        </p>
        <span className="block text-[10px] text-muted-foreground/70">
          {new Date(notification.createdAt).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {isUnread && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onMarkAsRead(notification.id)}
          title="Okundu İşaretle"
        >
          <Check className="size-3.5 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
}
