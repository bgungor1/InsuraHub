export interface Notification {
  id: string;
  userId: string;
  type: 'TICKET_MESSAGE' | 'TICKET_STATUS' | 'POLICY_CREATED' | 'POLICY_CLAIMED' | 'PAYOUT_READY' | string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
