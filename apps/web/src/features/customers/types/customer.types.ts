export interface CustomerContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  identityNo: string;
  contactInfo: CustomerContactInfo;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    policies: number;
  };
  policies?: {
    id: string;
    product: string;
    state: string;
    createdAt: string;
    branch?: { id: string; name: string };
    broker?: { id: string; firstName: string; lastName: string; email: string };
  }[];
}

export interface CustomersListResponse {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  identityNo?: string;
}

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  identityNo: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
}
