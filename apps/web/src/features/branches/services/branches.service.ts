import { api } from '@/lib/api';
import {
  Branch,
  BranchListResponse,
  CreateBranchInput,
  QueryBranchParams,
} from '../types/branch.types';

export const branchesService = {
  getBranches: async (params?: QueryBranchParams): Promise<BranchListResponse> => {
    return api.get<BranchListResponse>('/branches', { params });
  },

  getBranch: async (id: string): Promise<Branch> => {
    return api.get<Branch>(`/branches/${id}`);
  },

  createBranch: async (data: CreateBranchInput): Promise<Branch> => {
    return api.post<Branch>('/branches', data);
  },

  updateBranch: async (id: string, data: Partial<CreateBranchInput>): Promise<Branch> => {
    return api.patch<Branch>(`/branches/${id}`, data);
  },

  deleteBranch: async (id: string): Promise<Branch> => {
    return api.delete<Branch>(`/branches/${id}`);
  },
};
