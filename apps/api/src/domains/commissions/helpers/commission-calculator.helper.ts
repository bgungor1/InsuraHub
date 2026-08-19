export interface CommissionShares {
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
      companyShare: number;
      agencyShare: number;
      branchShare: number;
      brokerShare: number;
    },
  ): CommissionShares {
    const brokerAmount = Number(((total * rule.brokerShare) / 100).toFixed(2));
    const branchAmount = Number(((total * rule.branchShare) / 100).toFixed(2));
    const agencyAmount = Number(((total * rule.agencyShare) / 100).toFixed(2));

    const bottomTiersSum = Number(
      (brokerAmount + branchAmount + agencyAmount).toFixed(2),
    );
    const companyAmount = Number((total - bottomTiersSum).toFixed(2));

    return {
      totalAmount: total,
      brokerAmount,
      branchAmount,
      agencyAmount,
      companyAmount,
    };
  }
}
