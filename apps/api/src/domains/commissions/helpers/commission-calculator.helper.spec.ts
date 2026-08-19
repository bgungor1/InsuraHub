import { CommissionCalculatorHelper } from './commission-calculator.helper';

describe('CommissionCalculatorHelper', () => {
  it('should calculate shares correctly and avoid float drift (zero-cent drift)', () => {
    const total = 10000;
    const rule = {
      companyShare: 40,
      agencyShare: 30,
      branchShare: 20,
      brokerShare: 10,
    };

    const shares = CommissionCalculatorHelper.calculateShares(total, rule);

    expect(shares.brokerAmount).toBe(1000);
    expect(shares.branchAmount).toBe(2000);
    expect(shares.agencyAmount).toBe(3000);
    expect(shares.companyAmount).toBe(4000);

    const sum =
      shares.brokerAmount +
      shares.branchAmount +
      shares.agencyAmount +
      shares.companyAmount;
    expect(sum).toBe(total);
  });

  it('should guarantee exact total sum even with fractional cents and odd splits', () => {
    const total = 333.33;
    const rule = {
      companyShare: 33.34,
      agencyShare: 33.33,
      branchShare: 20.0,
      brokerShare: 13.33,
    };

    const shares = CommissionCalculatorHelper.calculateShares(total, rule);

    const sum = Number(
      (
        shares.brokerAmount +
        shares.branchAmount +
        shares.agencyAmount +
        shares.companyAmount
      ).toFixed(2),
    );

    expect(sum).toBe(total);
  });
});
