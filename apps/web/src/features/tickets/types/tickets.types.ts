export type TicketCategory =
  | 'POLICY_ISSUE'
  | 'COMMISSION_INQUIRY'
  | 'TECHNICAL_SUPPORT'
  | 'GENERAL_REQUEST';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface TicketSender {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  sender?: TicketSender;
  body: string;
  createdAt: string;
}

export interface TicketCreator {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  branch?: { name: string; agency?: { name: string } };
}

export interface TicketItem {
  id: string;
  creatorId: string;
  creator: TicketCreator;
  category: TicketCategory;
  status: TicketStatus;
  subject: string;
  createdAt: string;
  resolvedAt?: string | null;
  _count?: { messages: number };
  messages?: TicketMessage[];
}

export interface CreateTicketPayload {
  subject: string;
  category: TicketCategory;
  message: string;
}

export interface AddTicketMessagePayload {
  body: string;
}

export interface TicketFilters extends Record<string, unknown> {
  category?: TicketCategory;
  status?: TicketStatus;
  page?: number;
  limit?: number;
}

export interface TicketsPaginatedResponse {
  items: TicketItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
