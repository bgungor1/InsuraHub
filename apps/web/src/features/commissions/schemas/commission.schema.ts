import * as z from 'zod';

export const createCommissionRuleSchema = z
  .object({
    name: z.string().min(2, { message: 'Kural adı en az 2 karakter olmalıdır.' }),
    companyShare: z.number().min(0, '0 ile 100 arasında olmalıdır.').max(100, '0 ile 100 arasında olmalıdır.'),
    agencyShare: z.number().min(0, '0 ile 100 arasında olmalıdır.').max(100, '0 ile 100 arasında olmalıdır.'),
    branchShare: z.number().min(0, '0 ile 100 arasında olmalıdır.').max(100, '0 ile 100 arasında olmalıdır.'),
    brokerShare: z.number().min(0, '0 ile 100 arasında olmalıdır.').max(100, '0 ile 100 arasında olmalıdır.'),
  })
  .refine(
    (data) =>
      Math.abs(data.companyShare + data.agencyShare + data.branchShare + data.brokerShare - 100) < 0.001,
    {
      message: 'Komisyon paylarının toplamı tam olarak %100 olmalıdır.',
      path: ['brokerShare'],
    },
  );

export type CreateCommissionRuleFormValues = z.infer<typeof createCommissionRuleSchema>;
