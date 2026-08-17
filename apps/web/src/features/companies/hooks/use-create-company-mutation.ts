import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { companiesService } from '../services/companies.service';
import { Company, CreateCompanyInput } from '../types/company.types';
import { queryKeys } from '@/lib/api';

interface UseCreateCompanyOptions {
  onSuccess?: (company: Company) => void;
  onError?: (error: Error) => void;
}

export function useCreateCompanyMutation(options?: UseCreateCompanyOptions) {
  const queryClient = useQueryClient();

  return useMutation<Company, Error, CreateCompanyInput>({
    mutationFn: (data) => companiesService.createCompany(data),
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.lists() });
      toast.success(`"${newCompany.name}" şirketi başarıyla oluşturuldu.`);
      options?.onSuccess?.(newCompany);
    },
    onError: (error) => {
      toast.error(error.message || 'Şirket oluşturulurken bir hata meydana geldi.');
      options?.onError?.(error);
    },
  });
}
