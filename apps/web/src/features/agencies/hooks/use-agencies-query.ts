import { useQuery } from '@tanstack/react-query';
import { agenciesService } from '../services/agencies.service';
import { AgencyListResponse, QueryAgencyParams } from '../types/agency.types';
import { queryKeys } from '@/lib/api';

export function useAgenciesQuery(params?: QueryAgencyParams) {
  return useQuery<AgencyListResponse, Error>({
    queryKey: queryKeys.agencies.list(params as Record<string, unknown>),
    queryFn: () => agenciesService.getAgencies(params),
    staleTime: 60 * 1000,
  });
}
