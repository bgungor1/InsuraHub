export interface CommissionDistribution {
  totalAmount: number;
  brokerAmount: number;
  branchAmount: number;
  agencyAmount: number;
  companyAmount: number;
}

export class CommissionCalculatorHelper {
  static calculateShares(
    total: number,
    rule: {
      brokerShare: number;
      branchShare: number;
      agencyShare: number;
    },
  ): CommissionDistribution {
    const brokerAmount = Number(((total * rule.brokerShare) / 100).toFixed(2));
    const branchAmount = Number(((total * rule.branchShare) / 100).toFixed(2));
    const agencyAmount = Number(((total * rule.agencyShare) / 100).toFixed(2));
    const companyAmount = Number(
      (total - (brokerAmount + branchAmount + agencyAmount)).toFixed(2),
    );

    return {
      totalAmount: total,
      brokerAmount,
      branchAmount,
      agencyAmount,
      companyAmount,
    };
  }
}
