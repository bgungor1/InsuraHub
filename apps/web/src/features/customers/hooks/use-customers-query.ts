import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { customersService } from '../services/customers.service';
import type { CustomersQueryParams } from '../types/customer.types';

export function useCustomersQuery(params?: CustomersQueryParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(params as Record<string, unknown>),
    queryFn: () => customersService.getCustomers(params),
  });
}
