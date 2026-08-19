export interface PolicyStateCount {
  state: string;
  label: string;
  count: number;
}

export interface DashboardFinancials {
  totalPremium: number;
  commissions: {
    company: number;
    agency: number;
    branch: number;
    broker: number;
  };
}

export interface DashboardCounters {
  totalPolicies: number;
  activeClaims: number;
  completedPolicies: number;
  totalCustomers: number;
}

export interface RecentActivity {
  id: string;
  policyId: string;
  product: string;
  customerName: string;
  branchName: string;
  brokerName: string;
  totalAmount: number;
  calculatedAt: string;
}

export interface DashboardSummary {
  policiesByState: PolicyStateCount[];
  counters: DashboardCounters;
  financials: DashboardFinancials;
  recentActivities: RecentActivity[];
}
