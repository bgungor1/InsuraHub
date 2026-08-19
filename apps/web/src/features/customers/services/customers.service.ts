import { api } from '@/lib/api';
import type {
  Customer,
  CustomersListResponse,
  CustomersQueryParams,
  CreateCustomerInput,
} from '../types/customer.types';

export const customersService = {
  async getCustomers(params?: CustomersQueryParams): Promise<CustomersListResponse> {
    return api.get<CustomersListResponse>('/customers', { params });
  },

  async getCustomerById(id: string): Promise<Customer> {
    const response = await api.get<{ data: Customer }>(`/customers/${id}`);
    return response.data;
  },

  async lookupCustomer(identityNo: string): Promise<Customer> {
    const response = await api.get<{ data: Customer }>(`/customers/lookup/${identityNo}`);
    return response.data;
  },

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const response = await api.post<{ message: string; data: Customer }>('/customers', input);
    return response.data;
  },

  async updateCustomer(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
    const response = await api.patch<{ message: string; data: Customer }>(`/customers/${id}`, input);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
