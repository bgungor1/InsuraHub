export interface Agency {
  id: string;
  name: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
  };
  _count?: {
    branches: number;
    users: number;
  };
}

export interface AgencyListResponse {
  items: Agency[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryAgencyParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  isActive?: boolean;
}

export interface CreateAgencyInput {
  name: string;
  companyId: string;
  isActive?: boolean;
}
