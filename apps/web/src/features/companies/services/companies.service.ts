import { api } from '@/lib/api';
import {
  Company,
  CompanyListResponse,
  CreateCompanyInput,
  QueryCompanyParams,
} from '../types/company.types';

export const companiesService = {
  getCompanies: async (params?: QueryCompanyParams): Promise<CompanyListResponse> => {
    return api.get<CompanyListResponse>('/companies', { params });
  },

  getCompany: async (id: string): Promise<Company> => {
    return api.get<Company>(`/companies/${id}`);
  },

  createCompany: async (data: CreateCompanyInput): Promise<Company> => {
    return api.post<Company>('/companies', data);
  },

  updateCompany: async (id: string, data: Partial<CreateCompanyInput>): Promise<Company> => {
    return api.patch<Company>(`/companies/${id}`, data);
  },

  deleteCompany: async (id: string): Promise<Company> => {
    return api.delete<Company>(`/companies/${id}`);
  },
};
