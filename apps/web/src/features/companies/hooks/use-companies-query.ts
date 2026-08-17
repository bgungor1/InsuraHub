import { useQuery } from '@tanstack/react-query';
import { companiesService } from '../services/companies.service';
import { CompanyListResponse, QueryCompanyParams } from '../types/company.types';
import { queryKeys } from '@/lib/api';

export function useCompaniesQuery(params?: QueryCompanyParams) {
  return useQuery<CompanyListResponse, Error>({
    queryKey: queryKeys.companies.list(params as Record<string, unknown>),
    queryFn: () => companiesService.getCompanies(params),
    staleTime: 60 * 1000,
  });
}
