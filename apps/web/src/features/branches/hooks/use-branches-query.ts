import { useQuery } from '@tanstack/react-query';
import { branchesService } from '../services/branches.service';
import { BranchListResponse, QueryBranchParams } from '../types/branch.types';
import { queryKeys } from '@/lib/api';

export function useBranchesQuery(params?: QueryBranchParams) {
  return useQuery<BranchListResponse, Error>({
    queryKey: queryKeys.branches.list(params as Record<string, unknown>),
    queryFn: () => branchesService.getBranches(params),
    staleTime: 60 * 1000,
  });
}
