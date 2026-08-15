
export type UserRole =
  | 'SUPERADMIN'
  | 'COMPANY_USER'
  | 'AGENCY_MANAGER'
  | 'BRANCH_MANAGER'
  | 'BROKER';

export interface AuthUser {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branchId?: string | null;
  agencyId?: string | null;
  companyId?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  user: AuthUser;
  message?: string;
}
