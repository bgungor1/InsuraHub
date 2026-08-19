import { api } from '@/lib/api';
import type {
  AddTicketMessagePayload,
  CreateTicketPayload,
  TicketFilters,
  TicketItem,
  TicketsPaginatedResponse,
  TicketStatus,
} from '../types/tickets.types';

export const ticketsService = {
  async getTickets(filters?: TicketFilters): Promise<TicketsPaginatedResponse> {
    return api.get<TicketsPaginatedResponse>('/tickets', {
      params: filters,
    });
  },

  async getTicket(id: string): Promise<TicketItem> {
    const res = await api.get<{ data: TicketItem }>(`/tickets/${id}`);
    return res.data;
  },

  async createTicket(payload: CreateTicketPayload): Promise<TicketItem> {
    const res = await api.post<{ data: TicketItem }>('/tickets', payload);
    return res.data;
  },

  async addMessage(id: string, payload: AddTicketMessagePayload): Promise<unknown> {
    return api.post(`/tickets/${id}/messages`, payload);
  },

  async updateStatus(id: string, status: TicketStatus): Promise<TicketItem> {
    const res = await api.patch<{ data: TicketItem }>(`/tickets/${id}/status`, {
      status,
    });
    return res.data;
  },

  async closeTicket(id: string): Promise<TicketItem> {
    const res = await api.patch<{ data: TicketItem }>(`/tickets/${id}/close`);
    return res.data;
  },
};
