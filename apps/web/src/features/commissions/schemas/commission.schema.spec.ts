import { describe, it, expect } from 'vitest';
import { createCommissionRuleSchema } from './commission.schema';

describe('Commission Schema Validation', () => {
  it('should validate successfully when shares sum to 100%', () => {
    const validData = {
      name: '2026 Standart Kural',
      companyShare: 40,
      agencyShare: 30,
      branchShare: 20,
      brokerShare: 10,
    };

    const result = createCommissionRuleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation when shares do not sum to 100%', () => {
    const invalidData = {
      name: 'Eksik Pay Kuralı',
      companyShare: 40,
      agencyShare: 30,
      branchShare: 20,
      brokerShare: 5, // Toplam 95%
    };

    const result = createCommissionRuleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('tam olarak %100');
    }
  });

  it('should fail validation when any share is negative or greater than 100', () => {
    const invalidNegative = {
      name: 'Negatif Pay',
      companyShare: 120,
      agencyShare: -20,
      branchShare: 0,
      brokerShare: 0,
    };

    const result = createCommissionRuleSchema.safeParse(invalidNegative);
    expect(result.success).toBe(false);
  });
});
