import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/api';
import { customersService } from '../services/customers.service';
import type { CreateCustomerInput } from '../types/customer.types';

export function useCreateCustomerMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCustomerInput) => customersService.createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      toast.success('Müşteri kaydı başarıyla oluşturuldu.');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Müşteri oluşturulurken bir hata meydana geldi.');
    },
  });
}
