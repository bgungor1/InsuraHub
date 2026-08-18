export interface Branch {
  id: string;
  name: string;
  agencyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  agency: {
    id: string;
    name: string;
    company: {
      id: string;
      name: string;
    };
  };
  _count?: {
    users: number;
    policies: number;
  };
}

export interface BranchListResponse {
  items: Branch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryBranchParams {
  page?: number;
  limit?: number;
  search?: string;
  agencyId?: string;
  companyId?: string;
  isActive?: boolean;
}

export interface CreateBranchInput {
  name: string;
  agencyId: string;
  isActive?: boolean;
}
