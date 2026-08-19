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
  createdAt: string;
  updatedAt?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    identityNo?: string;
    type?: string;
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
  customerId: string;
  branchId?: string;
  brokerId?: string;
  state?: PolicyState;
  totalAmount?: number;
  previousPolicyId?: string;
}
