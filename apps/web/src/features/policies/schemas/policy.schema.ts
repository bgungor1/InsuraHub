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

export const createPolicySchema = z.object({
  product: z
    .string()
    .min(2, { message: 'Poliçe ürün türü en az 2 karakter olmalıdır.' }),
  customerId: z
    .string()
    .min(1, { message: 'Lütfen bir müşteri seçiniz.' }),
  branchId: z
    .string()
    .optional(),
  totalAmount: z
    .number()
    .min(0, { message: 'Prim tutarı 0 veya daha büyük olmalıdır.' })
    .optional(),
  state: z
    .enum(['DRAFT', 'UNASSIGNED', 'CLAIMED', 'COMPLETED', 'CANCELLED'] as const),
});

export interface CreatePolicyFormValues {
  product: string;
  customerId: string;
  branchId?: string;
  totalAmount?: number;
  state: PolicyState;
}
