export interface Company {
  id: string;
  name: string;
  taxNumber?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    agencies: number;
    users: number;
  };
}

export interface CompanyListResponse {
  items: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryCompanyParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateCompanyInput {
  name: string;
  taxNumber?: string;
  isActive?: boolean;
}
