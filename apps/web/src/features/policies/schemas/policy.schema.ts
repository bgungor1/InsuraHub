import * as z from 'zod';
import type { PolicyState } from '../types/policy.types';

export const PRODUCT_OPTIONS = [
  'KASKO',
  'TRAFİK',
  'DASK',
  'KONUT',
  'SAĞLIK',
  'FERDİ KAZA',
  'TAMAMLAYICI SAĞLIK',
  'DİĞER',
] as const;

export const POLICY_STATE_MAP: Record<
  PolicyState,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  DRAFT: { label: 'Taslak', variant: 'outline' },
  UNASSIGNED: { label: 'Havuzda', variant: 'secondary' },
  CLAIMED: { label: 'İşlemde', variant: 'default' },
  COMPLETED: { label: 'Tamamlandı', variant: 'outline' },
  CANCELLED: { label: 'İptal', variant: 'destructive' },
};

export const createPolicyBaseSchema = z.object({
  customerMode: z.enum(['EXISTING', 'NEW']),
  customerId: z.string().optional(),
  newCustomer: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      identityNo: z.string().optional(),
      phone: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
  product: z
    .string()
    .min(2, { message: 'Poliçe ürün türü en az 2 karakter olmalıdır.' }),
  branchId: z.string().optional(),
  brokerId: z.string().optional(),
  coverageAmount: z.number().min(0).optional(),
  totalAmount: z
    .number()
    .min(0, { message: 'Prim tutarı 0 veya daha büyük olmalıdır.' })
    .optional(),
  plateNumber: z.string().optional(),
  uavtCode: z.string().optional(),
  paymentTerm: z.string().optional(),
  state: z.enum(['DRAFT', 'UNASSIGNED', 'CLAIMED', 'COMPLETED', 'CANCELLED'] as const),
});

export type CreatePolicyFormValues = z.infer<typeof createPolicyBaseSchema>;

export const createPolicySchema = createPolicyBaseSchema.superRefine(
  (data, ctx) => {
    if (data.customerMode === 'EXISTING') {
      if (!data.customerId || data.customerId.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Lütfen bir müşteri seçiniz.',
          path: ['customerId'],
        });
      }
    } else if (data.customerMode === 'NEW') {
      if (!data.newCustomer?.firstName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Müşteri adı zorunludur.',
          path: ['newCustomer', 'firstName'],
        });
      }
      if (!data.newCustomer?.lastName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Müşteri soyadı zorunludur.',
          path: ['newCustomer', 'lastName'],
        });
      }
      if (
        !data.newCustomer?.identityNo?.trim() ||
        data.newCustomer.identityNo.length < 10
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Geçerli bir TCKN veya VKN giriniz (en az 10 hane).',
          path: ['newCustomer', 'identityNo'],
        });
      }
    }
  }
);
