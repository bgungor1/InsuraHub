export interface CommissionRule {
  id: string;
  name: string;
  companyShare: number;
  agencyShare: number;
  branchShare: number;
  brokerShare: number;
  validFrom: string;
  validUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommissionSnapshot {
  id: string;
  policyId: string;
  commissionRuleId: string;
  totalAmount: number;
  companyAmount: number;
  agencyAmount: number;
  branchAmount: number;
  brokerAmount: number;
  calculatedAt: string;
  rule?: {
    id: string;
    name: string;
  };
  policy?: {
    id: string;
    product: string;
    customer?: {
      id?: string;
      firstName: string;
      lastName: string;
      identityNo: string;
    };
    branch?: {
      id?: string;
      name: string;
    };
    broker?: {
      id?: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface CommissionSnapshotsResponse {
  items: CommissionSnapshot[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCommissionRuleInput {
  name: string;
  companyShare: number;
  agencyShare: number;
  branchShare: number;
  brokerShare: number;
  validFrom?: string;
}

export interface CommissionQueryParams {
  page?: number;
  limit?: number;
  ruleId?: string;
  startDate?: string;
  endDate?: string;
}
