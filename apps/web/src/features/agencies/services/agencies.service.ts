import { api } from '@/lib/api';
import {
  Agency,
  AgencyListResponse,
  CreateAgencyInput,
  QueryAgencyParams,
} from '../types/agency.types';

export const agenciesService = {
  getAgencies: async (params?: QueryAgencyParams): Promise<AgencyListResponse> => {
    return api.get<AgencyListResponse>('/agencies', { params });
  },

  getAgency: async (id: string): Promise<Agency> => {
    return api.get<Agency>(`/agencies/${id}`);
  },

  createAgency: async (data: CreateAgencyInput): Promise<Agency> => {
    return api.post<Agency>('/agencies', data);
  },

  updateAgency: async (id: string, data: Partial<CreateAgencyInput>): Promise<Agency> => {
    return api.patch<Agency>(`/agencies/${id}`, data);
  },

  deleteAgency: async (id: string): Promise<Agency> => {
    return api.delete<Agency>(`/agencies/${id}`);
  },
};
