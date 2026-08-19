import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { policiesService } from '../services/policies.service';
import type { PoliciesQueryParams } from '../types/policy.types';

export function usePoliciesQuery(params?: PoliciesQueryParams) {
  return useQuery({
    queryKey: queryKeys.policies.list(params as Record<string, unknown>),
    queryFn: () => policiesService.getPolicies(params),
  });
}
