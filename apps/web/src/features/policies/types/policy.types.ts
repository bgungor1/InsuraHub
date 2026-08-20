export type PolicyState =
  | 'DRAFT'
  | 'UNASSIGNED'
  | 'CLAIMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Policy {
  id: string;
  product: string;
  state: PolicyState;
  customerId: string;
  branchId: string;
  brokerId?: string | null;
  previousPolicyId?: string | null;
  totalAmount?: number | null;
  coverageAmount?: number | null;
  plateNumber?: string | null;
  uavtCode?: string | null;
  paymentTerm?: string | null;
  createdAt: string;
  updatedAt?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    identityNo?: string;
    type?: string;
    contactInfo?: {
      phone?: string;
      email?: string;
      city?: string;
      district?: string;
      address?: string;
    };
  };
  branch?: {
    id: string;
    name: string;
  };
  broker?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  } | null;
  snapshot?: {
    id: string;
    totalAmount: number;
    brokerAmount?: number;
    branchAmount?: number;
    agencyAmount?: number;
    companyAmount?: number;
  } | null;
  assignment?: {
    id: string;
    assignedAt: string;
    releasedAt?: string | null;
    releaseReason?: string | null;
  } | null;
}

export interface PoliciesListResponse {
  items: Policy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PoliciesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  state?: PolicyState;
  customerId?: string;
  branchId?: string;
  brokerId?: string;
  product?: string;
}

export interface CreatePolicyInput {
  product: string;
  customerId?: string;
  newCustomer?: {
    firstName: string;
    lastName: string;
    identityNo: string;
    phone?: string;
    email?: string;
    city?: string;
    district?: string;
    address?: string;
  };
  branchId?: string;
  brokerId?: string;
  state?: PolicyState;
  totalAmount?: number;
  coverageAmount?: number;
  plateNumber?: string;
  uavtCode?: string;
  paymentTerm?: string;
  previousPolicyId?: string;
}
