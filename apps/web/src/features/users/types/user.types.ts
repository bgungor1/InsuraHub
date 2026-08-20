export type UserRole =
  | 'SUPERADMIN'
  | 'COMPANY_USER'
  | 'AGENCY_MANAGER'
  | 'BRANCH_MANAGER'
  | 'BROKER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  companyId?: string | null;
  agencyId?: string | null;
  branchId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  company?: { id?: string; name: string } | null;
  agency?: { id?: string; name: string } | null;
  branch?: { id?: string; name: string } | null;
}

export interface UsersListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  companyId?: string;
  agencyId?: string;
  branchId?: string;
  isActive?: boolean;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
  agencyId?: string;
  branchId?: string;
  isActive?: boolean;
}
